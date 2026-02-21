import logging
import os
import re
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


T = TypeVar("T", bound=BaseModel)


class APIImporter[APIData: BaseModel](BaseSettings, metaclass=ABCMeta):
    """
    APIImporter
    APIImportConfig: The BaseSettings object with the fields for configuring the API importing and runtime behaviour
    APIData: The BaseModel containing the API state for incremental refreshes, token, etc.
    """

    # Main type
    importer_name: str

    # Configure parameters
    min_date: date | None = None
    account_map: dict[str, str] | None = None
    cache_only: bool = False
    cache_data: str | None = None

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
            sorted_keys = sorted(self.account_map.keys(), key=len, reverse=True)
            pattern = re.compile("|".join(re.escape(k) for k in sorted_keys))

            def replace_callback(match: re.Match[str]) -> str:
                return m[match.group(0)]

            for e in data:
                e.account = pattern.sub(replace_callback, e.account)
                if e.counter_account:
                    e.counter_account = pattern.sub(replace_callback, e.counter_account)
                # if e.account in self.account_map:
                #    e.account = self.account_map[e.account]
                # if e.counter_account in self.account_map:
                #    e.counter_account = self.account_map[e.counter_account]
        return data

    @final
    def beancount_load(self, existing: Entries | None = None) -> Entries:
        data = self.load_data()
        imported_entries = self.extract(data)
        imported_entries = self.filter(imported_entries)
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
        return ""

    @final
    @override
    def date(self, filepath: str) -> None:
        return None

    @final
    @override
    def filename(self, filepath: str) -> None:
        return None
