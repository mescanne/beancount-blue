import inspect
import io
import logging
from typing import Any, Type

import typer
from beancount.parser.printer import print_entry  # pyright: ignore[reportUnknownVariableType]
from typer import Option

from beancount_blue.importer.delta_importer import APIImporter
from beancount_blue.importer.monzo import MonzoImporter
from beancount_blue.importer.starling_importer import StarlingImporter

log = logging.getLogger(__name__)

app = typer.Typer(
    pretty_exceptions_enable=False,
    help="Beancount Blue Importers CLI. Use to interact with different API importers.",
)

importers: list[Type[APIImporter[Any]]] = [StarlingImporter, MonzoImporter]


def run_importer(importer: APIImporter[Any]) -> None:
    entries = importer.beancount_load()
    string_io = io.StringIO()
    for entry in entries:
        print_entry(entry, file=string_io)
    print(string_io.getvalue())


def create_command(importer_cls: Type[APIImporter[Any]]) -> Any:
    parameters: list[inspect.Parameter] = []
    for name, field in importer_cls.model_fields.items():
        default = ... if field.is_required() else field.default
        parameter = inspect.Parameter(
            name,
            inspect.Parameter.KEYWORD_ONLY,
            default=Option(default, help=field.description),
            annotation=field.annotation,
        )
        parameters.append(parameter)

    signature = inspect.Signature(parameters)

    def command(**kwargs: Any) -> None:
        importer = importer_cls(**kwargs)
        run_importer(importer)

    command.__signature__ = signature  # type: ignore
    return command


for importer_cls in importers:
    importer_app = typer.Typer(pretty_exceptions_enable=False, help=f"Commands for the {importer_cls.name()} importer.")
    importer_app.command("run")(create_command(importer_cls))
    app.add_typer(importer_app, name=importer_cls.name())


@app.callback()
def main(ctx: typer.Context):
    """
    Beancount Blue Importers CLI.
    """
    pass


if __name__ == "__main__":
    app()
