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
  acc_123456789: "Assets:Current:Monzo"
```

Usage:
```bash
# Sync new data
bean-blue-importer sync --settings settings.yaml

# Output Beancount directives
bean-blue-importer beancount --settings settings.yaml
```
"""

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Annotated, Any

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
        "--settings",
        type=Path,
        default=Path("settings.yaml"),
        help="Path to the configuration YAML file or directory of config files",
    )

    parser.add_argument("--debug", action="store_true", help="Enable debug mode")

    # Sub-commands
    subparsers = parser.add_subparsers(dest="command", required=True, help="Action to perform")

    # Command: status
    _ = subparsers.add_parser("status", help="Show the current sync status and balances of all configured importers")

    # Command: run
    sync_parser = subparsers.add_parser("sync", help="Refresh data from the API and save state")
    sync_parser.add_argument("--ntfy", type=str, help="ntfy token for sending available balance updates")
    sync_parser.add_argument("--ntfy_acct", type=str, help="ntfy account for balance updates")
    sync_parser.add_argument("--ntfy_title", type=str, help="ntfy title for message")
    _ = subparsers.add_parser("beancount", help="Output imported transactions as Beancount directives")
    _ = subparsers.add_parser("dump", help="Dump the raw API state as JSON")

    # Command: train
    train_parser = subparsers.add_parser("train", help="Train the ML predictor from a ledger file")
    train_parser.add_argument("--ledger", type=Path, help="Path to the Beancount ledger file")

    # Command: explain
    explain_parser = subparsers.add_parser("explain", help="Diagnose an ML prediction for a given string")
    explain_parser.add_argument("text", type=str, help="The string to predict (e.g., 'TFL Travel transport')")

    args = parser.parse_args()

    if args.debug:
        log.debug("!! DEBUG MODE ON !!")

    # Determine config files to process
    config_paths: list[Path] = []
    if args.settings.exists():
        if args.settings.is_dir():
            config_paths = list(args.settings.glob("api_*.yaml"))
            config_paths.sort()
        else:
            config_paths = [args.settings]
    else:
        # Check if settings is a directory name or path that doesn't exist yet or is just settings.yaml
        if args.settings == Path("settings.yaml"):
            # Decided below to handle default empty config if not exists
            config_paths = [args.settings]
        else:
            log.warning(f"Warning: Config path '{args.settings}' not found.")
            config_paths = []

    configs: list[tuple[Path, Any]] = []
    from beancount_blue.importer.api_importer import load_api_importer

    for path in config_paths:
        if path.exists() and path.is_file():
            try:
                config = load_api_importer(path)
                config.interactive_auth = True
                configs.append((path, config))
            except Exception:
                log.exception(f"Configuration Error loading {path}")
                sys.exit(1)

    if not configs and args.settings == Path("settings.yaml") and not args.settings.exists():
        # Fallback to default empty config
        try:
            config = TypeAdapter[Importer](Importer).validate_python({})
            config.interactive_auth = True
            configs.append((args.settings, config))
        except Exception:
            log.exception("Configuration Error initializing default config")
            sys.exit(1)

    if args.command == "status":
        from beancount_blue.importer.api_importer import get_importer_status

        if not configs:
            log.warning("No configuration files found.")
            return

        for path, _ in configs:
            status = get_importer_status(path)
            print(f"=== {status['filename']} ({status['importer_name']}) ===")
            print(f"  Status:    {status['status'].upper()}")
            print(f"  Last Sync: {status['last_sync'] or 'Never'}")
            if status["error_msg"]:
                print(f"  Error:     {status['error_msg']}")
            if status["balances"]:
                print("  Balances:")
                for line in status["balances"].splitlines():
                    print(f"    {line}")
            print()

    elif args.command == "sync":
        for path, config in configs:
            log.info(f"Syncing {path.name}...")
            config.cache_only = False
            data = config.load_data()

            if getattr(args, "ntfy", None):
                msg = config.format_available_balances(data, args.ntfy_acct)  # type: ignore[arg-type]
                if msg:
                    from beancount_blue.importer.ntfy import push_message

                    push_message(
                        title=args.ntfy_title or config.importer_name.capitalize(), msg=msg, notify_token=args.ntfy
                    )

    elif args.command == "beancount":
        all_entries: list[Any] = []
        for path, config in configs:
            log.info(f"Loading entries from {path.name}...")
            config.cache_only = True
            all_entries.extend(config.beancount_load())
        print_entries(all_entries)

    elif args.command == "dump":
        for path, config in configs:
            config.cache_only = True
            print(f"=== Raw API state dump for {path.name} ===")
            print(config.load_data().model_dump_json(indent=2))
            print()

    elif args.command == "train":
        from beancount.loader import load_file

        from beancount_blue.importer.predictor import TransactionPredictor

        for path, config in configs:
            ledger_path = args.ledger or (Path(config.predict_ledger_path) if config.predict_ledger_path else None)
            if not ledger_path:
                log.error(
                    f"No ledger path provided for training {path.name}. Use --ledger or set predict_ledger_path in config."
                )
                continue

            log.info(f"Training predictor for {path.name}...")
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

        for path, config in configs:
            print(f"=== ML Diagnosis for {path.name} ===")
            predictor = TransactionPredictor(Path(config.predict_model_path))
            if not predictor.load():
                log.warning(f"ML model for {path.name} is missing or invalid. Please run 'importer train' first.")
                continue

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
