"""
Command Line Interface for Beancount Blue Importers.

This module provides the `app` function to run importers defined in a YAML configuration file.

Example configuration `settings.yaml`:
```yaml
importer_name: monzo
client_id: "your_client_id"
client_secret: "your_client_secret"
auto_predict: true
predict_ledger_path: "main.beancount"
account_map:
  acc_00009UCIgykfr42cQuNtCr: "Assets:Current:Mark:Monzo"
```

Usage:
```bash
# Sync new data
python -m beancount_blue.importer.cli sync --settings settings.yaml

# Output Beancount directives
python -m beancount_blue.importer.cli beancount --settings settings.yaml
```
"""

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Annotated, Any

import yaml
from beancount.parser.printer import print_entries  # pyright: ignore[reportUnknownVariableType]
from pydantic import Field, TypeAdapter

from beancount_blue.importer.monzo import MonzoImporter
from beancount_blue.importer.starling import StarlingImporter
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


Importer = Annotated[MonzoImporter | StarlingImporter | TrueLayerImporter, Field(discriminator="importer_name")]


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
    sync_parser = subparsers.add_parser("sync", help="Refresh data from the API and save state")
    sync_parser.add_argument("--ntfy", type=str, help="ntfy token for sending available balance updates")
    sync_parser.add_argument("--ntfy_acct", type=str, help="ntfy account for balance updates")
    _ = subparsers.add_parser("beancount", help="Output imported transactions as Beancount directives")
    _ = subparsers.add_parser("dump", help="Dump the raw API state as JSON")

    # Command: train
    train_parser = subparsers.add_parser("train", help="Train the ML predictor from a ledger file")
    train_parser.add_argument("--ledger", type=Path, help="Path to the Beancount ledger file")

    # Command: explain
    explain_parser = subparsers.add_parser("explain", help="Diagnose an ML prediction for a given string")
    explain_parser.add_argument("text", type=str, help="The string to predict (e.g., 'TFL Travel transport')")

    args = parser.parse_args()

    # A. Load the YAML (Flat, simple loading)
    if args.settings.exists():
        with open(args.settings) as f:
            yaml_data = yaml.safe_load(f) or {}  # pyright: ignore[reportUnknownVariableType]
    else:
        # Decide if this is fatal or if defaults are okay
        log.warning(f"Warning: Config file '{args.settings}' not found. Using defaults/env vars.")
        yaml_data = {}

    try:
        config = TypeAdapter[Importer](Importer).validate_python(yaml_data)
        config.interactive_auth = True
    except Exception:
        log.exception("Configuration Error")
        sys.exit(1)

    if args.debug:
        log.debug("!! DEBUG MODE ON !!")

    log.info(f"Loaded Config: {config}")

    if args.command == "sync":
        config.cache_only = False
        data = config.load_data()

        if getattr(args, "ntfy", None):
            msg = config.format_available_balances(data)  # type: ignore[arg-type]
            if msg:
                from beancount_blue.importer.ntfy import push_message

                push_message(title=config.importer_name.capitalize(), msg=msg, notify_token=args.ntfy)

    elif args.command == "beancount":
        config.cache_only = True
        print_entries(config.beancount_load())

    elif args.command == "dump":
        config.cache_only = True
        print(config.load_data().model_dump_json(indent=2))

    elif args.command == "train":
        from beancount.loader import load_file

        from beancount_blue.importer.predictor import TransactionPredictor

        ledger_path = args.ledger or (Path(config.predict_ledger_path) if config.predict_ledger_path else None)
        if not ledger_path:
            log.error("No ledger path provided for training. Use --ledger or set predict_ledger_path in config.")
            sys.exit(1)

        predictor = TransactionPredictor(Path(config.predict_model_path))
        entries, _, _ = load_file(str(ledger_path))
        anchors = config.predict_anchor_accounts or config.anchor_accounts

        try:
            data = config.load_data()
            imported_entries = config.extract(data)  # type: ignore[arg-type]
        except Exception:
            imported_entries = None

        predictor.train(
            entries,
            anchors,
            config.predict_skip_accounts,
            config.predict_remap_accounts,
            imported_entries=imported_entries,
        )

    elif args.command == "explain":
        from beancount_blue.importer.predictor import TransactionPredictor

        predictor = TransactionPredictor(Path(config.predict_model_path))
        predictor.load()

        print(f"\n--- Diagnosing ML Prediction for '{args.text}' ---\n")
        print("POSTING (Counter-Account) PREDICTION:")
        posting_res = predictor.posting_predictor.explain(args.text)  # type: ignore[reportUnknownMemberType]
        print(f"Tokens extracted: {posting_res.get('tokens')}")  # type: ignore[reportUnknownMemberType]
        for c in posting_res.get("top_classes", []):  # type: ignore[reportUnknownMemberType, reportUnknownVariableType]
            print(f"  [{c['confidence'] * 100:0.1f}%] {c['label']} (log_prob: {c['log_prob']:.2f})")  # type: ignore[reportUnknownArgumentType, reportUnknownMemberType]
            for w, s in c["word_scores"].items():  # type: ignore[reportUnknownMemberType, reportUnknownVariableType]
                print(f"    - '{w}': matched {s['count']} times")  # type: ignore[reportUnknownArgumentType]

        print("\nPAYEE PREDICTION:")
        payee_res = predictor.payee_predictor.explain(args.text)  # type: ignore[reportUnknownMemberType]
        print(f"Tokens extracted: {payee_res.get('tokens')}")  # type: ignore[reportUnknownMemberType]
        for c in payee_res.get("top_classes", []):  # type: ignore[reportUnknownMemberType, reportUnknownVariableType]
            print(f"  [{c['confidence'] * 100:0.1f}%] {c['label']} (log_prob: {c['log_prob']:.2f})")  # type: ignore[reportUnknownArgumentType, reportUnknownMemberType]
            for w, s in c["word_scores"].items():  # type: ignore[reportUnknownMemberType, reportUnknownVariableType]
                print(f"    - '{w}': matched {s['count']} times")  # type: ignore[reportUnknownArgumentType]
        print("")

    else:
        log.warning("No valid command provided.")


if __name__ == "__main__":
    app()
