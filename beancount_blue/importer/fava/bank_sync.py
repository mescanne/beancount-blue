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
        self._dashboard_cache: dict[str, dict[str, Any]] = {}
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

    @extension_endpoint("dashboard", methods=["GET"])
    def dashboard(self) -> Any:
        try:
            results: list[dict[str, Any]] = []
            for p in self.config_dir.glob("api_*.yaml"):
                if not p.is_file():
                    continue
                filename = p.name
                yaml_mtime = p.stat().st_mtime

                cache_entry = self._dashboard_cache.get(filename)

                needs_reparse = False
                if not cache_entry or cache_entry.get("yaml_mtime") != yaml_mtime:
                    needs_reparse = True
                elif cache_entry.get("status") == "ok":
                    tar_gz_path_str = cache_entry.get("tar_gz_path")
                    if tar_gz_path_str:
                        tp = Path(tar_gz_path_str)
                        if tp.exists():
                            tar_mtime = tp.stat().st_mtime
                            if cache_entry.get("tar_mtime") != tar_mtime:
                                needs_reparse = True
                        else:
                            if cache_entry.get("tar_mtime") is not None:
                                needs_reparse = True

                if needs_reparse:
                    new_entry: dict[str, Any] = {
                        "filename": filename,
                        "path": str(p.absolute()),
                        "yaml_mtime": yaml_mtime,
                        "status": "error",
                        "importer_name": "Unknown",
                        "error_msg": None,
                        "last_sync": None,
                        "balances": None,
                        "tar_gz_path": None,
                        "tar_mtime": None,
                    }
                    try:
                        import yaml

                        yaml_data = yaml.safe_load(p.read_text(encoding="utf-8"))
                        if not yaml_data:
                            raise ValueError("Empty YAML")
                        from typing import cast

                        api_importer = cast(Any, TypeAdapter(Importer).validate_python(yaml_data))

                        new_entry["importer_name"] = getattr(api_importer, "importer_name", "Unknown")
                        tar_gz = getattr(api_importer, "cache_data", None)
                        if tar_gz:
                            tp = Path(tar_gz)
                            if not tp.is_absolute():
                                tp = Path(self.ledger.options["filename"]).parent / tp
                            new_entry["tar_gz_path"] = str(tp)
                            if tp.exists():
                                new_entry["tar_mtime"] = tp.stat().st_mtime
                                # load the ImporterState to get metadata and balances
                                api_importer.cache_data = str(tp)
                                api_importer.cache_only = True
                                try:
                                    state = api_importer.load_data()
                                    new_entry["last_sync"] = (
                                        state.last_sync_time.isoformat() if state.last_sync_time else None
                                    )
                                    new_entry["error_msg"] = state.last_sync_error
                                    new_entry["balances"] = api_importer.format_available_balances(state.data)
                                    new_entry["status"] = "ok" if not state.last_sync_error else "error"
                                except Exception as e:
                                    new_entry["status"] = "error"
                                    new_entry["error_msg"] = f"Failed to load cache: {str(e)}"
                            else:
                                new_entry["status"] = "ok"
                                new_entry["error_msg"] = "Never synced"
                        else:
                            new_entry["status"] = "error"
                            new_entry["error_msg"] = "No cache_data path configured"

                    except Exception as e:
                        new_entry["status"] = "error"
                        new_entry["error_msg"] = f"Config error: {str(e)}"

                    self._dashboard_cache[filename] = new_entry
                    cache_entry = new_entry

                if cache_entry:
                    results.append({
                        "filename": cache_entry["filename"],
                        "path": cache_entry["path"],
                        "importer_name": cache_entry["importer_name"],
                        "status": cache_entry["status"],
                        "last_sync": cache_entry["last_sync"],
                        "balances": cache_entry["balances"],
                        "error_msg": cache_entry["error_msg"],
                    })
            results.sort(key=lambda x: str(x["filename"]))
            return jsonify({"status": "success", "items": results})
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

            import yaml

            yaml_data = yaml.safe_load(p.read_text(encoding="utf-8"))
            if not yaml_data:
                raise ValueError("Empty YAML")

            from typing import cast

            api_importer = cast(Any, TypeAdapter(Importer).validate_python(yaml_data))

            if getattr(api_importer, "cache_data", None):
                tp = Path(api_importer.cache_data)  # type: ignore
                if not tp.is_absolute():
                    api_importer.cache_data = str(Path(self.ledger.options["filename"]).parent / tp)  # type: ignore

            api_importer.cache_only = False  # type: ignore
            _ = api_importer.load_data()  # type: ignore

            # remove from cache to force refresh on next dashboard load
            if name in self._dashboard_cache:
                del self._dashboard_cache[name]

            return jsonify({"status": "success"})
        except Exception as e:
            log.exception("Sync failed")
            return jsonify({"status": "error", "message": str(e)}), 500

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
