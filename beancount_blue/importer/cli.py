import typer

app = typer.Typer(
    pretty_exceptions_enable=False,
    help="Beancount Blue Importers CLI. Use to interact with different API importers.",
)


@app.command()
def hello(name: str):
    """
    Say hello to NAME.
    """
    print(f"Hello {name}")


if __name__ == "__main__":
    app()
