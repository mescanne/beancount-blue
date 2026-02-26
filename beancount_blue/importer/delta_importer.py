import logging
import os
from abc import ABCMeta, abstractmethod
from datetime import date
from pathlib import Path
from types import get_original_bases
from typing import TypeVar, final, override

from beancount.api import Account
from beancount.core.data import Directive, Entries
from beangulp.importer import Importer  # pyright: ignore[reportMissingTypeStubs]
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings

from .importer import ImportedTransaction, imported_to_beancount
from .utils import load

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


T = TypeVar("T", bound=BaseModel)


class ImporterConfigurationError(Exception):
    pass


class APIImporter[APIData: BaseModel](BaseSettings, metaclass=ABCMeta):
    """
    Base class for all API Importers.

    This class manages configuration, API state caching, filtering, and machine learning predictions.
    Subclasses (like MonzoImporter or StarlingImporter) implement the `refresh` and `extract` logic.
    """

    # Main type
    importer_name: str = Field(description="The unique name identifying this importer.")

    # Configure parameters
    min_date: date | None = Field(None, description="Only extract transactions on or after this date.")
    account_map: dict[str, str] | None = Field(
        None, description="Mapping of API account IDs to Beancount account names."
    )
    cache_only: bool = Field(
        False, description="If True, skips the API refresh and only loads data from the local cache."
    )
    cache_data: str | None = Field(
        None, description="File path to the compressed tar.gz file where the API state is cached."
    )

    # Predictor options
    auto_predict: bool = Field(False, description="Enable the ML predictor to guess payees and counter_accounts.")
    predict_ledger_path: str | None = Field(
        None, description="Path to the main Beancount ledger file used as training data."
    )
    predict_model_path: str = Field(
        "predictor_model.json", description="File path where the trained JSON ML model is stored/cached."
    )
    predict_anchor_accounts: list[str] | None = Field(
        None, description="List of anchor accounts to train on. Defaults to the values in `account_map`."
    )
    predict_skip_accounts: list[str] = Field(
        default_factory=list, description="List of counter-accounts to explicitly ignore when training the ML model."
    )
    predict_min_confidence: float = Field(
        0.5, description="The minimum confidence threshold (0.0 to 1.0) required to apply a prediction."
    )
    predict_retrain_days: float | None = Field(
        7.0,
        description="Force a retraining of the ML model if it is older than this many days.",
    )

    @property
    def anchor_accounts(self) -> list[str]:
        if self.account_map:
            return list(self.account_map.values())
        return []

    @classmethod
    def get_types(cls) -> type[APIData]:
        """Magic introspection to avoid 'config_type = ...' boilerplate"""
        for base in get_original_bases(cls):
            if not hasattr(base, "__pydantic_generic_metadata__"):
                continue
            if base.__pydantic_generic_metadata__.get("origin") is APIImporter:
                return base.__pydantic_generic_metadata__.get("args")[0]  # type: ignore
        raise ImporterConfigurationError(f"{cls.__name__} must inherit from APIImporter[APIData]")

    @abstractmethod
    def refresh(self, state: APIData) -> None:
        """Refresh the data from the API.

        state: mutable BaseModel for the state of the API connection and data.
        """

    @abstractmethod
    def extract(self, state: APIData) -> list[ImportedTransaction]:
        """Extract imported transactions from API data.

        state: BaseModel to extract the transactions from.
        """

    def load_data(self) -> APIData:
        api_data = self.get_types()
        if self.cache_data:
            with load(self.cache_data, api_data, skip_save=self.cache_only) as data:
                if not self.cache_only:
                    log.info("Refreshing data from API, Cache only is %s", self.cache_only)
                    self.refresh(data)
                return data
        else:
            if self.cache_only:
                log.warning("No cache data path provided, but cache_only is set to True. Ignoring cache_only.")
            data = api_data()
            self.refresh(data)
            return data

    def filter(self, data: list[ImportedTransaction]) -> list[ImportedTransaction]:
        """Filter imported transactions based on config.

        data: List of imported transactions.
        config: Configuration object.
        """
        if self.min_date:
            data = [e for e in data if e.date >= self.min_date]
        if self.account_map:
            m = self.account_map
            sorted_keys = sorted(m.keys(), key=len, reverse=True)
            for e in data:
                for k in sorted_keys:
                    v = m[k]
                    if e.account == k or e.account.startswith(k + ":"):
                        e.account = e.account.replace(k, v, 1)
                        break
                if e.counter_account:
                    for k in sorted_keys:
                        v = m[k]
                        if e.counter_account == k or e.counter_account.startswith(k + ":"):
                            e.counter_account = e.counter_account.replace(k, v, 1)
                            break
        return data

    @final
    def beancount_load(self, existing: Entries | None = None) -> Entries:
        data = self.load_data()
        imported_entries = self.extract(data)
        imported_entries = self.filter(imported_entries)

        # ML Prediction logic
        if self.auto_predict:
            import time

            from beancount.loader import load_file

            from .predictor import TransactionPredictor

            predictor = TransactionPredictor(Path(self.predict_model_path))

            # Heuristic: Check if we need to retrain
            retrain = False
            if self.predict_ledger_path:
                ledger_path = Path(self.predict_ledger_path)
                if ledger_path.exists():
                    model_path = Path(self.predict_model_path)
                    if not model_path.exists():
                        log.info("Model missing. Retraining...")
                        retrain = True
                    else:
                        model_mtime = model_path.stat().st_mtime
                        if ledger_path.stat().st_mtime > model_mtime:
                            log.info("Ledger is newer than model. Retraining...")
                            retrain = True
                        elif self.predict_retrain_days is not None:
                            age_days = (time.time() - model_mtime) / 86400.0
                            if age_days > self.predict_retrain_days:
                                log.info(
                                    f"Model age ({age_days:.1f} days) exceeds threshold "
                                    f"({self.predict_retrain_days} days). Retraining..."
                                )
                                retrain = True

            if retrain and self.predict_ledger_path:
                entries, _, _ = load_file(self.predict_ledger_path)
                anchors = self.predict_anchor_accounts or self.anchor_accounts
                predictor.train(entries, anchors, self.predict_skip_accounts)
            else:
                predictor.load()

            predictor.apply_predictions(imported_entries, min_confidence=self.predict_min_confidence)

        ret = imported_to_beancount(imported_entries, existing=existing)
        log.info(f"Found {len(imported_entries)} entries, returning {len(ret)} entries when de-duplicated.")
        return ret


@final
class BeancountAPIImporter(Importer):  # type: ignore[no-any-unimported]
    def __init__(
        self,
        importer: APIImporter[T],
    ) -> None:
        self.importer = importer

    @final
    @property
    def name(self) -> str:
        return self.importer.importer_name + " API Importer"

    @final
    @override
    def identify(self, filepath: str) -> bool:
        log.info("Checking file %s vs %s.txt", Path(filepath).name, self.importer.importer_name)
        return Path(filepath).name == f"{self.importer.importer_name}.txt"

    @final
    @override
    def extract(self, filepath: str, existing: Entries | None = None) -> Entries:
        entries = self.importer.beancount_load(existing)
        return [e for e in entries if self.importer.min_date is None or e.date >= self.importer.min_date]

    @final
    @override
    def cmp(self, entry1: Directive, entry2: Directive) -> bool:
        return "id" in entry1.meta and "id" in entry2.meta and entry1.meta["id"] == entry2.meta["id"]

    @final
    @override
    def account(self, filepath: str) -> Account:
        return f"Assets:API:{self.importer.importer_name.capitalize()}"

    @final
    @override
    def date(self, filepath: str) -> None:
        return None

    @final
    @override
    def filename(self, filepath: str) -> str:
        return Path(filepath).name
