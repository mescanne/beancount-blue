import logging
import os
from pathlib import Path
from typing import TypedDict, TypeVar, final, override

from beancount.core.data import Account, Directive, Entries
from beangulp.importer import Importer  # pyright: ignore[reportMissingTypeStubs]
from pydantic import BaseModel, TypeAdapter

from .delta_importer import APIImporter as APIImporterBase
from .delta_importer import BeancountAPIImporter

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


T = TypeVar("T", bound=BaseModel)


class ImporterStatus(TypedDict):
    filename: str
    path: str
    importer_name: str
    status: str  # "ok" or "error"
    last_sync: str | None
    balances: str | None
    error_msg: str | None


def load_api_importer(filepath: Path) -> APIImporterBase[BaseModel]:
    """Loads and validates an API importer from a configuration file, resolving relative paths."""
    from .cli import Importer as APIImporterConfig
    from .cli import load_config

    yaml_data = load_config(filepath)
    if not yaml_data:
        raise ValueError(f"Could not load valid configuration from {filepath}")

    from typing import cast

    api_importer = cast(
        APIImporterBase[BaseModel],
        TypeAdapter(APIImporterConfig).validate_python(yaml_data),  # type: ignore[reportUnknownVariableType]
    )

    # Resolve relative paths relative to the directory containing api_configs (i.e., path.parent.parent)
    base_dir = filepath.parent.parent if filepath.parent.name == "api_configs" else filepath.parent
    if api_importer.cache_data:
        tp = Path(api_importer.cache_data)
        if not tp.is_absolute():
            api_importer.cache_data = str(base_dir / tp)

    if api_importer.predict_ledger_path:
        tp = Path(api_importer.predict_ledger_path)
        if not tp.is_absolute():
            api_importer.predict_ledger_path = str(base_dir / tp)

    if api_importer.predict_model_path:
        tp = Path(api_importer.predict_model_path)
        if not tp.is_absolute():
            api_importer.predict_model_path = str(base_dir / tp)

    return api_importer


def get_importer_status(config_path: Path) -> ImporterStatus:
    """Loads the importer from the configuration path, and reads its local cache status."""
    try:
        api_importer = load_api_importer(config_path)

        importer_name = getattr(api_importer, "importer_name", "Unknown")
        cache_data_path = getattr(api_importer, "cache_data", None)

        status = "ok"
        last_sync = None
        balances = None
        error_msg = None

        if cache_data_path:
            tp = Path(cache_data_path)
            if tp.exists():
                api_importer.cache_only = True
                try:
                    state = api_importer.load_data()
                    last_sync = state.last_sync_time.isoformat() if state.last_sync_time else None
                    error_msg = state.last_sync_error
                    balances = api_importer.format_available_balances(state)
                    status = "ok" if not state.last_sync_error else "error"
                except Exception as e:
                    log.error(e, exc_info=True)
                    status = "error"
                    error_msg = f"Failed to load cache: {str(e)}"
            else:
                status = "ok"
                error_msg = "Never synced"
        else:
            status = "error"
            error_msg = "No cache_data path configured"

        return ImporterStatus(
            filename=config_path.name,
            path=str(config_path.absolute()),
            importer_name=importer_name,
            status=status,
            last_sync=last_sync,
            balances=balances,
            error_msg=error_msg,
        )
    except Exception as e:
        return ImporterStatus(
            filename=config_path.name,
            path=str(config_path.absolute()),
            importer_name="Unknown",
            status="error",
            last_sync=None,
            balances=None,
            error_msg=f"Config error: {str(e)}",
        )


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

        api_importer = load_api_importer(path)

        # Cast to satisfy strict type checking that it's a bound APIImporter
        importer = BeancountAPIImporter(api_importer)

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
