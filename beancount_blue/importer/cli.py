import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Annotated, Any, Union

import yaml
from beancount.api import print_entries  # pyright: ignore[reportUnknownVariableType]
from pydantic import Field, TypeAdapter

from beancount_blue.importer.monzo import MonzoImporter
from beancount_blue.importer.starling_importer import StarlingImporter
from beancount_blue.importer.truelayer import TrueLayerImporter

log = logging.getLogger(__name__)


def load_config(path: Path) -> dict[str, Any] | None:
    if path.suffix in (".yaml", ".yml"):
        import yaml

        with path.open("r") as f:
            return yaml.safe_load(f)  # type: ignore
    elif path.suffix == ".toml":
        import tomllib

        with path.open("rb") as f:
            return tomllib.load(f)
    else:
        with path.open("r") as f:
            return json.load(f)  # type: ignore


Importer = Annotated[Union[MonzoImporter, StarlingImporter, TrueLayerImporter], Field(discriminator="importer_name")]


def app():
    parser = argparse.ArgumentParser(description="My App CLI")

    # Global Arguments
    parser.add_argument(
        "--settings", type=Path, default=Path("settings.yaml"), help="Path to the configuration YAML file"
    )

    parser.add_argument("--debug", action="store_true", help="Enable debug mode")

    # Sub-commands
    subparsers = parser.add_subparsers(dest="command", required=True, help="Action to perform")

    # Command: run
    _ = subparsers.add_parser("sync", help="Refresh data from the API and save state")
    _ = subparsers.add_parser("beancount", help="Output imported transactions as Beancount directives")
    _ = subparsers.add_parser("dump", help="Dump the raw API state as JSON")

    args = parser.parse_args()

    # A. Load the YAML (Flat, simple loading)
    if args.settings.exists():
        with open(args.settings, "r") as f:
            yaml_data = yaml.safe_load(f) or {}  # pyright: ignore[reportUnknownVariableType]
    else:
        # Decide if this is fatal or if defaults are okay
        log.warning(f"Warning: Config file '{args.settings}' not found. Using defaults/env vars.")
        yaml_data = {}

    try:
        config = TypeAdapter[Importer](Importer).validate_python(yaml_data)
    except Exception as e:
        log.error(f"Configuration Error: {e}")
        sys.exit(1)

    if args.debug:
        log.debug("!! DEBUG MODE ON !!")

    log.info(f"Loaded Config: {config}")

    if args.command == "sync":
        config.cache_only = False
        _ = config.load_data()

    elif args.command == "beancount":
        config.cache_only = True
        print_entries(config.beancount_load())

    elif args.command == "dump":
        config.cache_only = True
        print(config.load_data().model_dump_json(indent=2))

    else:
        log.warning("No valid command provided.")


if __name__ == "__main__":
    app()
