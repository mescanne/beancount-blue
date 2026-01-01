import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Annotated, Any, Union

import tyro
from beancount.api import print_entries  # pyright: ignore[reportUnknownVariableType]
from tyro.conf import OmitArgPrefixes, OmitSubcommandPrefixes

from beancount_blue.importer.delta_importer import APIImporter, ImportConfig
from beancount_blue.importer.monzo import MonzoImporter
from beancount_blue.importer.starling_importer import StarlingImporter

log = logging.getLogger(__name__)


def load_config(path: Path) -> dict[str, Any] | None:
    if path.suffix in (".yaml", ".yml"):
        import yaml

        with path.open("r") as f:
            return yaml.safe_load(f)  # type: ignore
    elif path.suffix == ".toml":
        try:
            import tomllib

            with path.open("rb") as f:
                return tomllib.load(f)
        except ImportError:
            import toml  # type: ignore

            with path.open("r") as f:
                return toml.load(f)
    else:
        with path.open("r") as f:
            return json.load(f)  # type: ignore


@dataclass
class Sync:
    """Sync data from API."""

    def run(self, importer: APIImporter[Any], config: ImportConfig) -> None:
        log.info("Syncing")
        config.cache_only = False
        importer.load_data(config)


@dataclass
class Dump:
    """Dump data to JSON."""

    def run(self, importer: APIImporter[Any], config: ImportConfig) -> None:
        config.cache_only = True
        print(importer.load_data(config).model_dump_json(indent=4))


@dataclass
class Beancount:
    """Generate Beancount entries."""

    def run(self, importer: APIImporter[Any], config: ImportConfig) -> None:
        config.cache_only = True
        d = importer.beancount_load(config)
        print_entries(d)


@dataclass
class Transactions:
    """Extract transactions."""

    def run(self, importer: APIImporter[Any], config: ImportConfig) -> None:
        config.cache_only = True
        d = importer.load_data(config)
        print(importer.extract(d))


Action = Union[Sync, Dump, Beancount, Transactions]


@dataclass
class ImporterContext:
    config: Annotated[
        Path,
        tyro.conf.arg(
            help="Path to configuration file.",
        ),
    ]
    action: Action
    cache_data: Annotated[
        Path | None,
        tyro.conf.arg(
            help="Path to cache data file.",
        ),
    ] = None

    def run(self, importer_cls: type[APIImporter[Any]], global_config: ImportConfig) -> None:
        data = load_config(self.config)
        if not data:
            print(f"Failed to load configuration from {self.config}.")
            raise SystemExit(1)

        importer = importer_cls(**data)

        if self.cache_data:
            global_config.cache_data = str(self.cache_data)

        self.action.run(importer, global_config)


@dataclass
class StarlingCommand(ImporterContext):
    """Starling Bank Importer."""

    def execute(self, global_config: ImportConfig) -> None:
        self.run(StarlingImporter, global_config)


@dataclass
class MonzoCommand(ImporterContext):
    """Monzo Importer."""

    def execute(self, global_config: ImportConfig) -> None:
        self.run(MonzoImporter, global_config)


@dataclass
class Cli:
    """Beancount Blue Importers CLI."""

    config: ImportConfig
    command: Union[
        Annotated[StarlingCommand, tyro.conf.subcommand(name="starling")],
        Annotated[MonzoCommand, tyro.conf.subcommand(name="monzo")],
    ]

    def main(self) -> None:
        self.command.execute(self.config)


def app():
    tyro.cli(Cli, config=(OmitArgPrefixes, OmitSubcommandPrefixes)).main()


if __name__ == "__main__":
    app()
