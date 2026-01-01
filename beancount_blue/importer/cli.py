import json
import logging
from pathlib import Path
from typing import Annotated, Any, Type

import typer
from beancount.api import print_entries  # pyright: ignore[reportUnknownVariableType]
from pydanclick import from_pydantic

from beancount_blue.importer.delta_importer import APIImporter, ImportConfig
from beancount_blue.importer.monzo import MonzoImporter
from beancount_blue.importer.starling_importer import StarlingImporter

log = logging.getLogger(__name__)

app = typer.Typer(
    pretty_exceptions_enable=False,
    rich_markup_mode=None,
    no_args_is_help=True,
    help="Beancount Blue Importers CLI. Use to interact with different API importers.",
)


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


def config_importer(importer_cls: Type[APIImporter[Any]]):
    importer_app = typer.Typer(
        pretty_exceptions_enable=False,
        rich_markup_mode=None,
        no_args_is_help=True,
        help=f"Commands for the {importer_cls.name()} importer.",
    )

    state: dict[str, Any] = {}

    @importer_app.callback()
    def cb(  # pyright: ignore[reportUnusedFunction]
        ctx: typer.Context,
        config: Annotated[
            Path,
            typer.Option(
                exists=True,
                file_okay=True,
                dir_okay=False,
                readable=True,
                resolve_path=True,
                help="Path to configuration file.",
            ),
        ],
        cache_data: Annotated[
            Path,
            typer.Option(
                exists=False,
                file_okay=True,
                dir_okay=False,
                readable=True,
                resolve_path=True,
                help="Path to cache data file.",
            ),
        ]
        | None = None,
    ) -> None:
        data = load_config(config)
        if not data:
            print(f"Failed to load configuration from {config}.")
            raise typer.Exit(code=1)

        ctx.obj["importer"] = importer_cls(**data)
        ctx.obj["cache_data"] = cache_data

    @importer_app.command("sync")
    def sync(ctx: typer.Context) -> None:  # pyright: ignore[reportUnusedFunction]
        log.info("Syncing")
        ctx.obj["importer"].load_data(ctx.obj["cache_data"], False)

    @importer_app.command("dump")
    def dump(ctx: typer.Context) -> None:  # pyright: ignore[reportUnusedFunction]
        print(ctx.obj["importer"].load_data(ctx.obj["cache_data"], True).model_dump_json(indent=4))

    @importer_app.command("beancount")
    def beancount(ctx: typer.Context) -> None:  # pyright: ignore[reportUnusedFunction]
        d = ctx.obj["importer"].beancount_load(state["cache_data"], True)
        print_entries(d)

    @importer_app.command("transactions")
    def transactions(ctx: typer.Context) -> None:  # pyright: ignore[reportUnusedFunction]
        d = ctx.obj["importer"].load_data(state["cache_data"], True)
        print(ctx.obj["importer"].extract(d))

    # TODO: Add beancount dump, other dump. Summary statistics?
    app.add_typer(importer_app, name=importer_cls.name())


for importer_cls in [StarlingImporter, MonzoImporter]:
    config_importer(importer_cls)


@app.callback()
@from_pydantic(ImportConfig)
def main(ctx: typer.Context, config: ImportConfig = from_pydantic(ImportConfig)):
    """
    Beancount Blue Importers CLI.
    """
    ctx.obj = {}
    ctx.obj["config"] = config
    pass


if __name__ == "__main__":
    app()
