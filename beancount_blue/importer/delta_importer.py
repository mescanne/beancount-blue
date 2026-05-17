import logging
import os
from abc import ABCMeta, abstractmethod
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from types import get_original_bases
from typing import Any, TypeVar, final, override

from beancount.core.data import Account, Balance, Directive, Entries, Transaction
from beangulp.importer import Importer  # pyright: ignore[reportMissingTypeStubs]
from pydantic import BaseModel, Field, model_validator
from pydantic_settings import BaseSettings

from .importer import ImportedTransaction, imported_to_beancount
from .utils import load

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


T = TypeVar("T", bound=BaseModel)


class ImporterState[T: BaseModel](BaseModel):
    last_sync_time: datetime | None = None
    last_sync_error: str | None = None
    latest_transaction_date: date | None = None
    data: T

    @model_validator(mode="before")
    @classmethod
    def _migrate_legacy_data(cls, values: Any) -> Any:
        """
        Migrates legacy raw API caches into the new ImporterState envelope.
        If the raw JSON dictionary lacks a 'data' key, we assume it's the old
        raw model (e.g., MonzoData) and wrap it automatically.
        """
        from typing import cast

        if isinstance(values, dict) and "data" not in values:
            log.info("Legacy cache payload detected. Migrating to ImporterState envelope in-memory.")
            return cast(Any, {"data": values})
        return cast(Any, values)


class AccountConfig(BaseModel):
    name: str = Field(description="The Beancount account name.")
    starting_balance: Decimal | None = Field(
        None, description="The specific opening balance if the API lacks full history."
    )
    starting_date: date | None = Field(
        None, description="The date of the opening balance, effectively a min_date for this account."
    )
    currency: str | None = Field(None, description="The currency of the starting balance.")


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

    # Name of the importer
    name: str | None = Field(None, description="Name of this particular import configuration.")

    # Configure parameters
    min_date: date | None = Field(None, description="Only extract transactions on or after this date.")
    account_map: dict[str, str | AccountConfig] | None = Field(
        None, description="Mapping of API account IDs to Beancount account names or config objects."
    )
    cache_only: bool = Field(
        False, description="If True, skips the API refresh and only loads data from the local cache."
    )
    cache_data: str | None = Field(
        None, description="File path to the compressed tar.gz file where the API state is cached."
    )
    interactive_auth: bool = Field(
        False, exclude=True, description="Allow interactive CLI auth flows (like input() or local webservers)."
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
    predict_remap_accounts: dict[str, str] = Field(
        default_factory=dict,
        description="Mapping of accounts to rename during ML prediction training.",
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
            return [v.name if isinstance(v, AccountConfig) else v for v in self.account_map.values()]
        return []

    def get_account_configs_by_name(self) -> dict[str, AccountConfig]:
        if not self.account_map:
            return {}
        return {
            (v.name if isinstance(v, AccountConfig) else v): (
                v
                if isinstance(v, AccountConfig)
                else AccountConfig(name=v, starting_balance=None, starting_date=None, currency=None)
            )
            for v in self.account_map.values()
        }

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

    @abstractmethod
    def extract_available_balances(self, state: APIData) -> dict[str, tuple[Decimal, str]]:
        """Return a mapping of raw API account IDs to (available_balance, currency).
        Note: This represents the bank's available balance (often including pending transactions),
        not the cleared ledger balance.
        """

    def format_available_balances(self, state: APIData, acct: str | None = None) -> str | None:
        """Translates raw available balances into a human-readable string using account_map."""
        raw_balances = self.extract_available_balances(state)
        if not raw_balances:
            return None

        lines: list[str] = []
        # Translate keys using account_map
        m = {k: (v.name if isinstance(v, AccountConfig) else v) for k, v in (self.account_map or {}).items()}
        sorted_keys = sorted(m.keys(), key=len, reverse=True)

        # Evaluating account 25789c3f-778f-4e35-becf-eb4ab0718cf6 with 25789c3f-778f-4e35-becf-eb4ab0718cf6:Savings
        # Evaluating account 25789c3f-778f-4e35-becf-eb4ab0718cf6 with 25789c3f-778f-4e35-becf-eb4ab0718cf6:Silas
        # Evaluating account 25789c3f-778f-4e35-becf-eb4ab0718cf6 with 25789c3f-778f-4e35-becf-eb4ab0718cf6:Main
        # Evaluating account 25789c3f-778f-4e35-becf-eb4ab0718cf6 with 25789c3f-778f-4e35-becf-eb4ab0718cf6:Emma
        # Checking account 25789c3f-778f-4e35-becf-eb4ab0718cf6 with Assets:Current:Joint:Starling:Main for notification

        for raw_id, (amount, currency) in raw_balances.items():
            account_name = raw_id
            for k in sorted_keys:
                print(f"Evaluating account {account_name} with {k}")
                if account_name == k or account_name.startswith(k + ":"):
                    account_name = account_name.replace(k, m[k], 1)
                    print(f"New account name {account_name} with {k}")
                    break

            if acct:
                print(f"Checking account {account_name} with {acct} for notification")
                if account_name != acct:
                    continue

                return f"{amount:,.2f} {currency}"

            lines.append(f"{account_name}: {amount:,.2f} {currency}")

        if not lines:
            return None

        return "\n".join(sorted(lines))

    def load_data(self) -> ImporterState[APIData]:
        api_data_type = self.get_types()
        state_type = ImporterState[api_data_type]

        if self.cache_data:
            with load(self.cache_data, state_type, skip_save=self.cache_only) as state:
                if not self.cache_only:
                    log.info("Refreshing data from API, Cache only is %s", self.cache_only)
                    try:
                        self.refresh(state.data)
                        state.last_sync_error = None
                    except Exception as e:
                        log.exception("Error during API refresh")
                        state.last_sync_error = str(e)
                    finally:
                        state.last_sync_time = datetime.now()
                        try:
                            entries = self.extract(state.data)
                            if entries:
                                dates = [e.date for e in entries if getattr(e, "date", None)]
                                if dates:
                                    state.latest_transaction_date = max(dates)
                        except Exception as e:
                            log.debug(f"Could not extract dates for dashboard metadata: {e}")
                return state
        else:
            if self.cache_only:
                log.warning("No cache data path provided, but cache_only is set to True. Ignoring cache_only.")
            state = state_type(data=api_data_type())
            try:
                self.refresh(state.data)
                state.last_sync_error = None
            except Exception as e:
                log.exception("Error during API refresh")
                state.last_sync_error = str(e)
            finally:
                state.last_sync_time = datetime.now()
            return state

    def filter(self, data: list[ImportedTransaction]) -> list[ImportedTransaction]:
        """Filter imported transactions based on config.

        data: List of imported transactions.
        config: Configuration object.
        """
        if self.account_map:
            m = {k: (v.name if isinstance(v, AccountConfig) else v) for k, v in self.account_map.items()}
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
        state = self.load_data()
        imported_entries = self.extract(state.data)
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
                predictor.train(
                    entries,
                    anchors,
                    self.predict_skip_accounts,
                    self.predict_remap_accounts,
                    imported_entries=imported_entries,
                )
            else:
                predictor.load()

            predictor.apply_predictions(imported_entries, min_confidence=self.predict_min_confidence)

        ret = imported_to_beancount(
            imported_entries, existing=existing, account_configs=self.get_account_configs_by_name()
        )
        log.info(f"Found {len(imported_entries)} entries, returning {len(ret)} entries when de-duplicated.")
        return self.filter_beancount(ret)

    def filter_beancount(self, entries: Entries) -> Entries:
        """Filter the final Beancount entries."""
        configs = self.get_account_configs_by_name()
        filtered: list[Directive] = []
        for e in entries:
            # Global min_date
            if self.min_date and getattr(e, "date", date.min) < self.min_date:
                continue

            # Per-account starting_date (min_date)
            drop = False
            if isinstance(e, Transaction):
                for p in e.postings:
                    conf = configs.get(p.account)
                    if conf and conf.starting_date and e.date < conf.starting_date:
                        drop = True
                        break
            elif isinstance(e, Balance):
                conf = configs.get(e.account)
                if conf and conf.starting_date and e.date < conf.starting_date:
                    drop = True

            if not drop:
                filtered.append(e)

        return filtered


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
        return self.importer.beancount_load(existing)

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
