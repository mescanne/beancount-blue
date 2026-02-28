import logging
import os
from pathlib import Path
from typing import TypeVar, final, override

from beancount.api import Account
from beancount.core.data import Directive, Entries
from beangulp.importer import Importer  # pyright: ignore[reportMissingTypeStubs]
from pydantic import BaseModel, TypeAdapter

from .cli import Importer as APIImporterConfig
from .cli import load_config
from .delta_importer import APIImporter as APIImporterBase
from .delta_importer import BeancountAPIImporter

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


T = TypeVar("T", bound=BaseModel)


@final
class BeancountAPIImporterV2(Importer):  # type: ignore[no-any-unimported]
    def __init__(
        self,
    ) -> None:
        pass

    @final
    @property
    def name(self) -> str:
        return "API Importer"

    @final
    @override
    def identify(self, filepath: str) -> bool:
        name = Path(filepath).name
        return name.startswith("api_") and name.endswith(".yaml")

    @final
    @override
    def extract(self, filepath: str, existing: Entries | None = None) -> Entries:
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"Configuration file not found: {path}")

        yaml_data = load_config(path)
        if not yaml_data:
            raise ValueError(f"Could not load valid configuration from {path}")

        from typing import cast

        api_importer = TypeAdapter(APIImporterConfig).validate_python(yaml_data)  # type: ignore[reportUnknownVariableType]

        # Cast to satisfy strict type checking that it's a bound APIImporter
        importer = BeancountAPIImporter(cast(APIImporterBase[BaseModel], api_importer))

        return importer.extract(filepath, existing)

    @final
    @override
    def cmp(self, entry1: Directive, entry2: Directive) -> bool:
        return "id" in entry1.meta and "id" in entry2.meta and entry1.meta["id"] == entry2.meta["id"]

    @final
    @override
    def account(self, filepath: str) -> Account:
        return "API"

    @final
    @override
    def date(self, filepath: str) -> None:
        return None

    @final
    @override
    def filename(self, filepath: str) -> str:
        return Path(filepath).name
