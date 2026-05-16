# pyright: ignore[reportUnknownMemberType, reportUnknownVariableType, reportUnknownArgumentType]
import logging
import os
from pathlib import Path
from typing import Any

import yaml
from beancount.parser import printer
from fava.ext import FavaExtensionBase, extension_endpoint
from flask import jsonify, request
from pydantic import TypeAdapter

from beancount_blue.importer.cli import Importer
from beancount_blue.importer.monzo import MonzoImporter
from beancount_blue.importer.starling import StarlingImporter
from beancount_blue.importer.truelayer import TrueLayerImporter

# Rebuild models to resolve forward references for Pydantic v2
MonzoImporter.model_rebuild()
StarlingImporter.model_rebuild()
TrueLayerImporter.model_rebuild()

log = logging.getLogger(__name__)


class BankSync(FavaExtensionBase):  # type: ignore
    report_title = "Bank Sync"
    has_js_module = True

    def __init__(self, ledger: Any, config: Any = None) -> None:
        super().__init__(ledger, config)
        log.info(f"BankSync extension initialized. Config: {self.config}")

    def parse_config(self) -> dict[str, Any]:
        """
        Parses the Fava extension config.
        The config should be provided directly in the Beancount file as a dictionary string.
        Returns a grouped dictionary: {"monzo": [config_dict, ...], "starling": [...]}
        """
        if not self.config:
            return {}

        data: dict[str, Any] = {}
        if isinstance(self.config, str):  # pyright: ignore
            try:
                import ast

                data = ast.literal_eval(self.config)  # pyright: ignore
            except Exception:
                try:
                    data = yaml.safe_load(self.config)
                except Exception as e:
                    log.error(f"Failed to parse config string: {e}")
                    return {}
        elif isinstance(self.config, dict):
            data = self.config  # pyright: ignore
        else:
            log.error(f"Unsupported config type: {type(self.config)}")
            return {}

        return data  # type: ignore

    def get_docs(self) -> list[str]:
        import inspect

        import markdown2

        from beancount_blue.importer.monzo import MonzoImporter
        from beancount_blue.importer.starling import StarlingImporter
        from beancount_blue.importer.truelayer import TrueLayerImporter

        docs: list[str] = []
        for cls in [MonzoImporter, StarlingImporter, TrueLayerImporter]:
            if cls.__doc__:
                # Dedent the docstring so markdown renders correctly
                clean_doc = inspect.cleandoc(cls.__doc__)
                # Render markdown with common extras
                html = markdown2.markdown(clean_doc, extras=["fenced-code-blocks", "tables", "break-on-newline"])
                docs.append(str(html))  # type: ignore
        return docs

    def get_banks_status(self) -> list[dict[str, Any]]:
        config = self.parse_config()
        status: list[dict[str, Any]] = []
        for bank_name, instances in config.items():
            if bank_name == "global":
                continue
            if isinstance(instances, list):
                for idx, inst in enumerate(instances):  # type: ignore
                    if not isinstance(inst, dict):
                        continue
                    n = inst.get("name")  # type: ignore
                    name = str(n) if n else f"{bank_name.capitalize()} #{idx + 1}"  # type: ignore
                    status.append({"bank": bank_name, "idx": idx, "name": name})
            elif isinstance(instances, dict):
                n = instances.get("name")  # type: ignore
                name = str(n) if n else f"{bank_name.capitalize()} #1"  # type: ignore
                status.append({"bank": bank_name, "idx": 0, "name": name})
        return status

    def get_config_json(self) -> str:
        import json

        return json.dumps(self.parse_config())

    @extension_endpoint("schema", methods=["GET"])
    def schema(self) -> Any:
        try:
            # Pydantic v2 schema generation
            schema = TypeAdapter(Importer).json_schema()
            return jsonify(schema)
        except Exception as e:
            log.exception("Schema generation failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("get_transactions", methods=["GET"])
    def get_transactions(self) -> Any:
        try:
            log.info("Fetching transactions for Clearing House UI...")
            config_dict = self.parse_config()
            if not config_dict:
                return jsonify({"status": "success", "accounts": {}})

            from beancount.core.data import Balance, Transaction
            from beancount.parser import printer

            grouped_accounts: dict[str, list[dict[str, Any]]] = {}

            # 1. Load all configured importers and fetch their data
            for bank, instances in config_dict.items():
                if bank == "global":
                    continue
                for inst_config in instances:  # type: ignore
                    importer_model = TypeAdapter(Importer).validate_python(inst_config)  # type: ignore
                    importer_model.cache_only = True  # type: ignore

                    try:
                        known_anchors: set[str] = set()

                        acc_map: Any = getattr(importer_model, "account_map", {})  # pyright: ignore
                        if isinstance(acc_map, dict):
                            for v in acc_map.values():  # pyright: ignore
                                if isinstance(v, str):
                                    known_anchors.add(v)
                                elif isinstance(v, dict) and "name" in v:
                                    known_anchors.add(str(v["name"]))  # pyright: ignore

                        pred_anchors: Any = getattr(importer_model, "predict_anchor_accounts", [])  # pyright: ignore
                        if isinstance(pred_anchors, list):
                            for a in pred_anchors:  # pyright: ignore
                                known_anchors.add(str(a))  # pyright: ignore

                        entries = importer_model.beancount_load(self.ledger.all_entries)  # type: ignore

                        for entry in entries:  # type: ignore
                            if isinstance(entry, Transaction) and entry.postings:
                                anchor_idx = 0
                                for idx, p in enumerate(entry.postings):
                                    if p.account in known_anchors:
                                        anchor_idx = idx
                                        break

                                anchor_posting = entry.postings[anchor_idx]
                                anchor_account = anchor_posting.account

                                if anchor_account not in grouped_accounts:
                                    grouped_accounts[anchor_account] = []

                                confidence = entry.meta.get("predict_confidence", 1.0) if entry.meta else 1.0

                                serialized_postings: list[dict[str, Any]] = []
                                for p in entry.postings:
                                    serialized_postings.append({
                                        "account": p.account,
                                        "amount": str(p.units.number) if p.units else "",
                                        "currency": p.units.currency if p.units else "",
                                    })

                                grouped_accounts[anchor_account].append({  # pyright: ignore
                                    "type": "Transaction",
                                    "id": entry.meta.get("id", "") if entry.meta else "",
                                    "date": entry.date.strftime("%Y-%m-%d"),
                                    "payee": entry.payee or "",
                                    "narration": entry.narration or "",
                                    "confidence": float(confidence),
                                    "postings": serialized_postings,
                                    "raw_metadata": entry.meta or {},
                                    "beancount_plaintext": printer.format_entry(entry),
                                })

                            elif isinstance(entry, Balance):
                                anchor_account = entry.account
                                if anchor_account not in grouped_accounts:
                                    grouped_accounts[anchor_account] = []

                                grouped_accounts[anchor_account].append({
                                    "type": "Balance",
                                    "date": entry.date.strftime("%Y-%m-%d"),
                                    "account": entry.account,
                                    "amount": str(entry.amount.number),
                                    "currency": entry.amount.currency,
                                    "beancount_plaintext": printer.format_entry(entry),
                                })
                    except Exception as e:
                        log.error(f"Failed to load entries for {bank}: {e}")

            return jsonify({"status": "success", "accounts": grouped_accounts})

        except Exception as e:
            log.exception("get_transactions failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("commit_transactions", methods=["POST"])
    def commit_transactions(self) -> Any:
        try:
            data = request.json
            if not data or "transactions" not in data:
                return jsonify({"status": "error", "message": "No transactions provided"}), 400

            import datetime
            from decimal import Decimal

            from beancount.core.amount import Amount
            from beancount.core.data import Balance, Posting, Transaction

            entries_to_insert: list[Any] = []

            for tx_data in data["transactions"]:
                if tx_data["type"] == "Transaction":
                    date = datetime.datetime.strptime(tx_data["date"], "%Y-%m-%d").date()
                    postings: list[Posting] = []
                    total_amount = Decimal("0")
                    for p in tx_data["postings"]:
                        if not p.get("account"):
                            continue

                        amt_str = p.get("amount", "0")
                        amt = Decimal(amt_str) if amt_str else Decimal("0")
                        total_amount += amt

                        cur = p.get("currency", "")

                        postings.append(
                            Posting(
                                account=p["account"],
                                units=Amount(amt, cur) if cur else None,
                                cost=None,
                                price=None,
                                flag=None,
                                meta=None,
                            )
                        )

                    if total_amount != Decimal("0"):
                        return jsonify({
                            "status": "error",
                            "message": f"Transaction on {tx_data['date']} for {tx_data.get('payee')} does not balance. Sum: {total_amount}",
                        }), 400

                    entries_to_insert.append(
                        Transaction(
                            meta=tx_data.get("raw_metadata", {}),
                            date=date,
                            flag="*",
                            payee=tx_data.get("payee", ""),
                            narration=tx_data.get("narration", ""),
                            tags=frozenset(),
                            links=frozenset(),
                            postings=postings,
                        )
                    )
                elif tx_data["type"] == "Balance":
                    date = datetime.datetime.strptime(tx_data["date"], "%Y-%m-%d").date()
                    amt = Decimal(str(tx_data["amount"]))
                    entries_to_insert.append(
                        Balance(
                            meta={},
                            date=date,
                            account=tx_data["account"],
                            amount=Amount(amt, tx_data["currency"]),
                            tolerance=None,
                            diff_amount=None,
                        )
                    )

            if entries_to_insert:
                self.ledger.file.insert_entries(entries_to_insert)

            return jsonify({"status": "success"})
        except Exception as e:
            log.exception("commit_transactions failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("sync", methods=["POST"])
    def sync(self) -> Any:
        try:
            if os.environ.get("FAVA_TESTING") == "1":
                return jsonify({"status": "error", "message": "Test mode: Mocked sync error to prevent API calls."})

            data = request.json
            if data is None:
                raise ValueError("No JSON payload provided.")
            bank: str = data.get("bank", "")
            idx = int(data.get("idx", 0))

            config = self.parse_config()
            instances: list[dict[str, Any]] = config.get(bank, [])  # type: ignore
            if isinstance(instances, dict):
                instances = [instances]
            if not isinstance(instances, list) or idx >= len(instances):  # type: ignore
                raise ValueError("Instance not found")

            inst_config: dict[str, Any] = instances[idx].copy()  # type: ignore
            inst_config["importer_name"] = bank

            importer_model = TypeAdapter(Importer).validate_python(inst_config)  # type: ignore
            importer_model.cache_only = False  # type: ignore
            _ = importer_model.load_data()  # type: ignore

            return jsonify({"status": "success"})
        except Exception as e:
            log.exception("Sync failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("generate", methods=["POST"])
    def generate(self) -> Any:
        try:
            log.info("Generating beancount file...")
            data = request.json
            if data is None:
                raise ValueError("No JSON payload provided.")
            bank: str = data.get("bank", "")
            idx = int(data.get("idx", 0))

            config = self.parse_config()
            instances: list[dict[str, Any]] = config.get(bank, [])  # type: ignore
            if isinstance(instances, dict):
                instances = [instances]
            if not isinstance(instances, list) or idx >= len(instances):  # type: ignore
                raise ValueError("Instance not found")

            inst_config: dict[str, Any] = instances[idx].copy()  # type: ignore
            inst_config["importer_name"] = bank

            importer_model = TypeAdapter(Importer).validate_python(inst_config)  # type: ignore
            importer_model.cache_only = True  # type: ignore

            entries = importer_model.beancount_load(self.ledger.all_entries)  # type: ignore

            import_dir_name = config.get("global", {}).get("import_dir", "import_data")
            import_path = Path(self.ledger.options["filename"]).parent / import_dir_name
            import_path.mkdir(exist_ok=True, parents=True)

            out_file = import_path / f"{bank}_{idx}_staged.beancount"
            with out_file.open("w") as f:
                printer.print_entries(entries, file=f)  # type: ignore

            return jsonify({"status": "success", "file": str(out_file)})
        except Exception as e:
            log.exception("Generate failed")
            return jsonify({"status": "error", "message": str(e)}), 500
