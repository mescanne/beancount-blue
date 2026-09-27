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
        self._pending_oauth: dict[str, tuple[Path, str]] = {}
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
            ledger_dir = Path(self.ledger.options["filename"]).parent
            if (ledger_dir / "bank_apis").exists():
                path = ledger_dir / "bank_apis"
            elif (ledger_dir / "api_configs").exists():
                path = ledger_dir / "api_configs"
            else:
                path = ledger_dir / "bank_apis"

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

    @extension_endpoint("dashboard", methods=["GET"])
    def dashboard(self) -> Any:
        try:
            results: list[Any] = []
            for p in self.config_dir.glob("api_*.yaml"):
                if p.is_file():
                    from beancount_blue.importer.api_importer import (
                        get_importer_status,
                    )

                    results.append(get_importer_status(p))
            # Sort for deterministic order
            results.sort(key=lambda x: str(x["filename"]))
            return jsonify({"status": "success", "items": results, "data": results})
        except Exception as e:
            log.exception("Dashboard failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("sync", methods=["POST"])
    def sync(self) -> Any:
        try:
            import os

            if os.environ.get("FAVA_TESTING") == "1":
                return jsonify({"status": "error", "message": "Test mode: Mocked sync error to prevent API calls."})

            data = request.json
            if not data or "name" not in data:
                return jsonify({"status": "error", "message": "Invalid request"}), 400

            name = data["name"]
            p = self.config_dir / name
            if not p.exists():
                return jsonify({"status": "error", "message": "File not found"}), 404

            from beancount_blue.importer.api_importer import load_api_importer
            from beancount_blue.importer.delta_importer import APIImporterRedirectRequired

            api_importer = load_api_importer(p)

            # Get redirect_uri from frontend request JSON, with fallback to computed backend request URL
            redirect_uri = data.get("redirect_uri")
            if not redirect_uri:
                redirect_uri = request.url_root.rstrip("/") + request.path.replace("/sync", "/callback")
            log.info(f"Fava sync redirect URI: {redirect_uri}")
            api_importer.redirect_uri = redirect_uri

            try:
                api_importer.cache_only = False  # type: ignore
                _ = api_importer.load_data()  # type: ignore
                return jsonify({"status": "success"})
            except APIImporterRedirectRequired as redirect_err:
                self._pending_oauth[redirect_err.state] = (p, redirect_uri)
                return jsonify({"status": "auth_required", "auth_url": redirect_err.auth_url})
        except Exception as e:
            log.exception("Sync failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("callback", methods=["GET", "POST"])
    def oauth_callback(self) -> Any:
        try:
            data = request.form if request.method == "POST" else request.args
            code = data.get("code")
            state_str = data.get("state")

            if not code or not state_str:
                return "Missing authorization code or state", 400

            if state_str not in self._pending_oauth:
                return "Invalid or expired state parameter", 400

            config_path, redirect_uri = self._pending_oauth.pop(state_str)

            from beancount_blue.importer.api_importer import load_api_importer

            api_importer = load_api_importer(config_path)
            api_importer.redirect_uri = redirect_uri

            # Delegate to the generic callback handler on the importer!
            api_importer.handle_callback(code, state_str)

            # Re-sync to download the latest data using the newly stored token
            api_importer.cache_only = False
            _ = api_importer.load_data()

            # Redirect user back to the BankSync extension page
            redirect_target = request.path.replace("/callback", "/")
            from flask import redirect

            return redirect(redirect_target)
        except Exception as e:
            log.exception("OAuth Callback failed")
            return f"Error during authentication: {e}", 500

    @extension_endpoint("create", methods=["POST"])
    def create_config(self) -> Any:
        try:
            data = request.json
            if not data or "name" not in data or "importer_type" not in data:
                return jsonify({"status": "error", "message": "Invalid request"}), 400

            name = data["name"]
            if not name.startswith("api_") or not name.endswith(".yaml"):
                return jsonify({"status": "error", "message": "Invalid config name (must match api_*.yaml)"}), 400

            if "/" in name or "\\" in name:
                return jsonify({"status": "error", "message": "Invalid config name"}), 400

            p = self.config_dir / name
            if p.exists():
                return jsonify({"status": "error", "message": "File already exists"}), 400

            importer_type = data["importer_type"]
            base_name = name.replace("api_", "").replace(".yaml", "")

            content = f"importer_name: {importer_type}\ncache_data: {base_name}.tar.gz\n"
            if importer_type == "monzo":
                content += "client_id: ''\nclient_secret: ''\n"
            elif importer_type == "starling":
                content += "personal_access_token: ''\n"
            elif importer_type == "truelayer":
                content += "client_id: ''\nclient_secret: ''\n"

            content += "account_map:\n  '12345678': 'Assets:Bank:Account'\n"

            p.write_text(content, encoding="utf-8")

            return jsonify({"status": "success"})
        except Exception as e:
            log.exception("Create config failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("extract", methods=["GET"])
    def extract(self) -> Any:
        try:
            name = request.args.get("name")
            if not name or not name.startswith("api_") or not name.endswith(".yaml"):
                return jsonify({"status": "error", "message": "Invalid config name (must match api_*.yaml)"}), 400

            if "/" in name or "\\" in name:
                return jsonify({"status": "error", "message": "Invalid config name"}), 400

            p = self.config_dir / name
            if not p.exists():
                return jsonify({"status": "error", "message": "File not found"}), 404

            from fava.serialisation import serialise

            from beancount_blue.importer.api_importer import (
                BeancountAPIImporter,
                load_api_importer,
            )

            api_importer = load_api_importer(p)
            importer = BeancountAPIImporter(api_importer)
            entries = importer.extract(str(p), existing=list(self.ledger.all_entries))  # pyright: ignore[reportArgumentType]

            serialised = [serialise(e) for e in entries]  # pyright: ignore[reportUnknownVariableType]
            return jsonify({"status": "success", "entries": serialised})
        except Exception as e:
            log.exception("Extraction failed")
            return jsonify({"status": "error", "message": str(e)}), 500

    @extension_endpoint("commit", methods=["POST"])
    def commit(self) -> Any:
        try:
            data = request.json
            if not data or "entries" not in data:
                return jsonify({"status": "error", "message": "Invalid request"}), 400

            from fava.serialisation import deserialise

            entries = [deserialise(e) for e in data["entries"]]
            self.ledger.file.insert_entries(entries)
            return jsonify({"status": "success", "count": len(entries)})
        except Exception as e:
            log.exception("Commit failed")
            return jsonify({"status": "error", "message": str(e)}), 500
