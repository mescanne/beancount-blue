from pathlib import Path

from pydantic import TypeAdapter

from .cli import Importer, load_config
from .delta_importer import BeancountAPIImporter


def get_importer_from_file(config_path: str | Path) -> BeancountAPIImporter:
    """Load a configuration file and return a configured Beangulp importer.

    Args:
        config_path: Path to the YAML, TOML, or JSON configuration file.

    Returns:
        A BeancountAPIImporter instance configured from the file.
    """
    path = Path(config_path)
    if not path.exists():
        raise FileNotFoundError(f"Configuration file not found: {path}")

    yaml_data = load_config(path)
    if not yaml_data:
        raise ValueError(f"Could not load valid configuration from {path}")

    from typing import cast

    from .delta_importer import APIImporter, BaseModel

    api_importer = TypeAdapter(Importer).validate_python(yaml_data)  # type: ignore[reportUnknownVariableType]
    # Cast to satisfy strict type checking that it's a bound APIImporter
    return BeancountAPIImporter(cast(APIImporter[BaseModel], api_importer))


__all__ = ["get_importer_from_file", "BeancountAPIImporter"]
