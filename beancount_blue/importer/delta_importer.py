import logging
import os
from abc import ABCMeta, abstractmethod
from pathlib import Path
from typing import TypeVar, final, get_args, override

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


class APIImporter[APIData: BaseModel](BaseSettings, metaclass=ABCMeta):
    """
    APIImporter
    APIImportConfig: The BaseSettings object with the fields for configuring the API importing and runtime behaviour
    APIData: The BaseModel containing the API state for incremental refreshes, token, etc.
    """

    cache_data: str = Field(..., description="Cache file for API.")
    cache_only: bool = Field(False, description="Only extract from cache, do not update it.")

    @classmethod
    @abstractmethod
    def name(cls) -> str:
        pass

    @classmethod
    def get_types(cls) -> type[APIData]:
        """Magic introspection to avoid 'config_type = ...' boilerplate"""
        orig_bases = getattr(cls, "__orig_bases__", [])
        for base in orig_bases:  # pyright: ignore[reportAny]
            if get_args(base):
                return get_args(base)[0]  # pyright: ignore[reportAny]
        raise TypeError(f"{cls.__name__} must inherit from APIImporter[Config, State]")

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
                    self.refresh(data)
                return data
        else:
            data = api_data()
            self.refresh(data)
            return data

    @final
    def beancount_load(self, existing: Entries | None = None) -> Entries:
        data = self.load_data()
        imported_entries = self.extract(data)
        ret = imported_to_beancount(imported_entries, existing=existing)
        log.info(f"Found {len(imported_entries)} entries, returning {len(ret)} entries when de-duplicated.")
        return ret


@final
class BeacountAPIImporter(Importer):  # type: ignore[no-any-unimported]
    def __init__(self, importers: list[APIImporter[T]]):
        self.importers = importers

    @final
    @override
    def identify(self, filepath: str) -> bool:
        return Path(filepath).name == "api_importer.txt"

    @final
    @override
    def extract(self, filepath: str, existing: Entries | None = None) -> Entries:
        entries: list[Directive] = []
        for importer in self.importers:
            entries.extend(importer.beancount_load(existing))
        return entries

    @final
    @override
    def cmp(self, entry1: Directive, entry2: Directive) -> bool:
        return "id" in entry1.meta and "id" in entry2.meta and entry1.meta["id"] == entry2.meta["id"]

    @final
    @override
    def account(self, filepath: str) -> Account:
        return self.name

    @final
    @override
    def date(self, filepath: str) -> None:
        return None

    @final
    @override
    def filename(self, filepath: str) -> None:
        return None
