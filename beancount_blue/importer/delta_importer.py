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
from pydantic import BaseModel
from pydantic_settings import BaseSettings

from .importer import ImportedTransaction, imported_to_beancount
from .utils import load

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


class ImportConfig(BaseModel):
    min_date: date | None = None
    account_map: dict[str, str] | None = None
    cache_only: bool = False
    cache_data: str | None = None


T = TypeVar("T", bound=BaseModel)


class APIImporter[APIData: BaseModel](BaseSettings, metaclass=ABCMeta):
    """
    APIImporter
    APIImportConfig: The BaseSettings object with the fields for configuring the API importing and runtime behaviour
    APIData: The BaseModel containing the API state for incremental refreshes, token, etc.
    """

    @classmethod
    @abstractmethod
    def name(cls) -> str:
        pass

    @classmethod
    def get_types(cls) -> type[APIData]:
        """Magic introspection to avoid 'config_type = ...' boilerplate"""
        for base in get_original_bases(cls):
            if not hasattr(base, "__pydantic_generic_metadata__"):
                continue
            if base.__pydantic_generic_metadata__.get("origin") is APIImporter:
                return base.__pydantic_generic_metadata__.get("args")[0]  # type: ignore
        raise TypeError(f"{cls.__name__} must inherit from APIImporter[APIData]")

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

    def load_data(self, config: ImportConfig) -> APIData:
        api_data = self.get_types()
        if config.cache_data:
            with load(config.cache_data, api_data, skip_save=config.cache_only) as data:
                if not config.cache_only:
                    log.info("Refreshing data from API, Cache only is %s", config.cache_only)
                    self.refresh(data)
                return data
        else:
            if config.cache_only:
                log.warning("No cache data path provided, but cache_only is set to True. Ignoring cache_only.")
            data = api_data()
            self.refresh(data)
            return data

    @staticmethod
    def filter(data: list[ImportedTransaction], config: ImportConfig) -> list[ImportedTransaction]:
        """Filter imported transactions based on config.

        data: List of imported transactions.
        config: Configuration object.
        """
        if config.min_date:
            data = [e for e in data if e.date >= config.min_date]
        if config.account_map:
            for e in data:
                if e.account in config.account_map:
                    e.account = config.account_map[e.account]
                if e.counter_account in config.account_map:
                    e.counter_account = config.account_map[e.counter_account]
        return data

    @final
    def beancount_load(self, config: ImportConfig, existing: Entries | None = None) -> Entries:
        data = self.load_data(config)
        imported_entries = self.extract(data)
        imported_entries = self.filter(imported_entries, config)
        ret = imported_to_beancount(imported_entries, existing=existing)
        log.info(f"Found {len(imported_entries)} entries, returning {len(ret)} entries when de-duplicated.")
        return ret


@final
class BeancountAPIImporter(Importer):  # type: ignore[no-any-unimported]
    def __init__(
        self,
        importer: APIImporter[T],
        config: ImportConfig,
    ) -> None:
        self.importer = importer
        self.config = config

    @final
    @property
    def name(self) -> str:
        return self.importer.name() + " API Importer"

    @final
    @override
    def identify(self, filepath: str) -> bool:
        log.info("Checking file %s vs %s.txt", Path(filepath).name, self.importer.name())
        return Path(filepath).name == f"{self.importer.name()}.txt"

    @final
    @override
    def extract(self, filepath: str, existing: Entries | None = None) -> Entries:
        entries = self.importer.beancount_load(self.config, existing)
        return [e for e in entries if self.config.min_date is None or e.date >= self.config.min_date]

    @final
    @override
    def cmp(self, entry1: Directive, entry2: Directive) -> bool:
        return "id" in entry1.meta and "id" in entry2.meta and entry1.meta["id"] == entry2.meta["id"]

    @final
    @override
    def account(self, filepath: str) -> Account:
        return ""

    @final
    @override
    def date(self, filepath: str) -> None:
        return None

    @final
    @override
    def filename(self, filepath: str) -> None:
        return None
