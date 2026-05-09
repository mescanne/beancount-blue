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
        self.config_file = (Path(self.ledger.options["filename"]).parent / "importers.yaml").absolute()
        log.info(f"BankSync extension initialized. Config file: {self.config_file}")

        # Ensure config file exists with defaults if missing
        if not self.config_file.exists():
            try:
                default_file = Path(__file__).parent / "default_importers.yaml"
                if default_file.exists():
                    self.config_file.write_text(default_file.read_text())
                    log.info(f"Created default config file at {self.config_file}")
            except Exception as e:
                log.error(f"Failed to create default config file: {e}")

    def get_config_content(self) -> str:
        if self.config_file.exists():
            try:
                content = self.config_file.read_text().strip()
                if content:
                    return content
            except Exception as e:
                log.error(f"Failed to read config file {self.config_file}: {e}")

        # Default starter config from file
        default_file = Path(__file__).parent / "default_importers.yaml"
        if default_file.exists():
            return default_file.read_text()

        return "# No configuration found."

    def parse_config(self) -> dict[str, Any]:
        content = self.get_config_content()
        try:
            data = yaml.safe_load(content)
            if not isinstance(data, dict):
                log.warning(f"Config file {self.config_file} did not parse to a dict.")
                return {}
            return data  # type: ignore
        except Exception as e:
            log.error(f"Failed to parse YAML config: {e}")
            return {}

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

    @extension_endpoint("save_config", methods=["POST"])
    def save_config(self) -> Any:
        try:
            data = request.json
            if not data or "content" not in data:
                raise ValueError("No content provided.")

            content = data["content"]

            # If content is a dict/list, we dump it as YAML.
            # If it's a string, we assume it's already YAML or JSON.
            if isinstance(content, (dict, list)):
                yaml_content = yaml.dump(content, default_flow_style=False, sort_keys=False)
            else:
                # Validate it's at least valid YAML/JSON
                yaml.safe_load(content)
                yaml_content = content

            self.config_file.write_text(yaml_content)
            log.info(f"Saved configuration to {self.config_file}")
            return jsonify({"status": "success"})
        except Exception as e:
            log.exception("Save config failed")
            return jsonify({"status": "error", "message": str(e)}), 400

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
