# pyright: ignore[reportUnknownMemberType, reportUnknownVariableType, reportUnknownArgumentType]
import logging
from pathlib import Path
from typing import Any

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
    report_title = "API Importers"
    has_js_module = True

    def __init__(self, ledger: Any, config: Any = None) -> None:
        super().__init__(ledger, config)
        log.info(f"API Config Manager initialized. Config: {self.config}")

    @property
    def config_dir(self) -> Path:
        """
        Determines the directory for API configuration files.
        If not specified in extension config, defaults to 'api_configs' relative to ledger.
        """
        user_dir: str | None = None
        if isinstance(self.config, dict):
            val = self.config.get("config_dir")  # pyright: ignore
            if isinstance(val, str):
                user_dir = val
        elif isinstance(self.config, str) and self.config:
            try:
                import ast

                c = ast.literal_eval(self.config)
                if isinstance(c, dict):
                    val = c.get("config_dir")  # pyright: ignore
                    if isinstance(val, str):
                        user_dir = val
            except Exception as e:
                log.debug(f"Failed to parse config as literal eval: {e}")

        if user_dir:
            path = Path(user_dir)
            if not path.is_absolute():
                path = Path(self.ledger.options["filename"]).parent / path
        else:
            path = Path(self.ledger.options["filename"]).parent / "api_configs"

        path.mkdir(parents=True, exist_ok=True)
        return path

    @extension_endpoint("configs", methods=["GET"])
    def get_configs(self) -> Any:
        try:
            files: list[dict[str, str]] = []
            for p in self.config_dir.glob("api_*.yaml"):
                if p.is_file():
                    files.append({"name": p.name, "path": str(p.absolute())})
            # Sort for deterministic order
            files.sort(key=lambda x: x["name"])
            return jsonify({"status": "success", "files": files})
        except Exception as e:
            log.exception("Failed to get configs")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("config", methods=["GET"])
    def get_config(self) -> Any:
        try:
            name = request.args.get("name")
            if not name or not name.startswith("api_") or not name.endswith(".yaml"):
                return jsonify({"status": "error", "message": "Invalid config name"}), 400

            p = self.config_dir / name
            if not p.exists():
                return jsonify({"status": "error", "message": "File not found"}), 404

            content = p.read_text(encoding="utf-8")
            return jsonify({"status": "success", "content": content})
        except Exception as e:
            log.exception("Failed to get config")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("config", methods=["POST"])
    def save_config(self) -> Any:
        try:
            data = request.json
            if not data or "name" not in data or "content" not in data:
                return jsonify({"status": "error", "message": "Invalid request"}), 400

            name = data["name"]
            if not name.startswith("api_") or not name.endswith(".yaml"):
                return jsonify({"status": "error", "message": "Invalid config name (must match api_*.yaml)"}), 400

            # Basic safety check
            if "/" in name or "\\" in name:
                return jsonify({"status": "error", "message": "Invalid config name"}), 400

            p = self.config_dir / name
            p.write_text(data["content"], encoding="utf-8")

            return jsonify({"status": "success", "path": str(p.absolute())})
        except Exception as e:
            log.exception("Failed to save config")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("config", methods=["DELETE"])
    def delete_config(self) -> Any:
        try:
            name = request.args.get("name")
            if not name or not name.startswith("api_") or not name.endswith(".yaml"):
                return jsonify({"status": "error", "message": "Invalid config name"}), 400

            if "/" in name or "\\" in name:
                return jsonify({"status": "error", "message": "Invalid config name"}), 400

            p = self.config_dir / name
            if p.exists():
                p.unlink()

            return jsonify({"status": "success"})
        except Exception as e:
            log.exception("Failed to delete config")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("schema", methods=["GET"])
    def schema(self) -> Any:
        try:
            # Pydantic v2 schema generation
            schema = TypeAdapter(Importer).json_schema()
            return jsonify(schema)
        except Exception as e:
            log.exception("Schema generation failed")
            return jsonify({"status": "error", "message": str(e)}), 500
