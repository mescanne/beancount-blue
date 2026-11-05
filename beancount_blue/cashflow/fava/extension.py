"""
beancount_blue.cashflow.fava.extension

Fava extension exposing lifetime cashflow and decumulation simulation with
real-time reactive UI controls and SVG charts.
"""

from __future__ import annotations

import ast
import importlib.util
import logging
import sys
from pathlib import Path
from typing import cast

from fava.ext import FavaExtensionBase, extension_endpoint
from flask import Response, jsonify, request

from beancount_blue.cashflow.core import (
    ModelDefinition,
    SimulationModel,
    run_simulation,
)
from beancount_blue.cashflow.model import DemoCashflowModel

log = logging.getLogger(__name__)


class Cashflow(FavaExtensionBase):  # type: ignore[misc]
    """
    Fava extension for plain-text lifetime cashflow and decumulation simulation.
    """

    report_title = "Lifetime Cashflow"
    has_js_module = True

    def __init__(self, ledger: object, config: object = None) -> None:
        super().__init__(ledger, config)  # type: ignore[arg-type]
        self._models: dict[str, SimulationModel] = {}
        self._default_model_name: str = ""
        self._is_demo: bool = False
        self._models_loaded: bool = False
        self._parsed_config: dict[str, object] = self._parse_config()

    def _parse_config(self) -> dict[str, object]:
        """Parses the extension configuration string or dictionary."""
        raw_config: object = getattr(self, "config", None)
        if isinstance(raw_config, dict):
            return cast(dict[str, object], raw_config)
        if isinstance(raw_config, str) and raw_config.strip():
            try:
                c: object = ast.literal_eval(raw_config)
                if isinstance(c, dict):
                    return cast(dict[str, object], c)
            except Exception as e:
                log.debug("Failed to parse Cashflow extension config: %s", e)
        return {}

    @property
    def start_year(self) -> int:
        val = self._parsed_config.get("start_year", 2026)
        return int(float(str(val)))

    @property
    def end_year(self) -> int:
        val = self._parsed_config.get("end_year", 2076)
        return int(float(str(val)))

    def _load_models(self) -> None:
        if self._models_loaded:
            return
        self._models_loaded = True
        self._models.clear()

        ledger_obj = getattr(self, "ledger", None)
        ledger_options: dict[str, object] = getattr(ledger_obj, "options", {}) if ledger_obj else {}
        ledger_file = ledger_options.get("filename")
        ledger_dir = Path(str(ledger_file)).parent if ledger_file else Path.cwd()

        model_filename = str(self._parsed_config.get("model", "household_model.py"))
        model_path = Path(model_filename)
        if not model_path.is_absolute():
            model_path = ledger_dir / model_path

        if not model_path.exists():
            alt_path = ledger_dir / "cashflow_model.py"
            if alt_path.exists():
                model_path = alt_path

        if model_path.exists():
            try:
                spec = importlib.util.spec_from_file_location("user_cashflow_model", model_path)
                if spec is not None and spec.loader is not None:
                    module = importlib.util.module_from_spec(spec)
                    sys.modules[spec.name] = module
                    spec.loader.exec_module(module)

                    # 1. Discover all simulation model classes defined in the module
                    for attr_name in dir(module):
                        attr: object = getattr(module, attr_name)
                        if (
                            isinstance(attr, type)
                            and getattr(attr, "__module__", "") == module.__name__
                            and attr is not ModelDefinition
                            and attr is not SimulationModel
                            and not attr_name.endswith("Base")
                        ):
                            candidate = None
                            try:
                                candidate = attr(ledger_obj)
                            except TypeError:
                                try:
                                    candidate = attr()
                                except Exception as e:
                                    log.debug(
                                        "Failed to instantiate %s without args: %s",
                                        attr,
                                        e,
                                    )
                                    continue
                            except Exception as e:
                                log.debug(
                                    "Failed to instantiate %s with ledger: %s",
                                    attr,
                                    e,
                                )
                                continue

                            if isinstance(candidate, SimulationModel):
                                self._models[attr.__name__] = candidate
                                log.info(f"Discovered cashflow scenario: {attr.__name__}")

                    # 2. Check for explicit factory function get_model(ledger)
                    if hasattr(module, "get_model"):
                        get_model_fn: object = module.get_model
                        if callable(get_model_fn):
                            default_instance = get_model_fn(ledger_obj)
                            if isinstance(default_instance, SimulationModel):
                                name = getattr(
                                    type(default_instance),
                                    "__name__",
                                    "DefaultScenario",
                                )
                                self._models[name] = default_instance
                                self._default_model_name = name

                    # 3. Check for configured model_class override
                    configured_class = self._parsed_config.get("model_class")
                    if configured_class and str(configured_class) in self._models:
                        self._default_model_name = str(configured_class)

                    # 4. Default to first discovered model
                    if not self._default_model_name and self._models:
                        self._default_model_name = list(self._models.keys())[0]

                    if self._models:
                        self._is_demo = False
                        return
            except Exception:
                log.exception("Failed to load user cashflow model from %s", model_path)

        # Fallback to Demo model
        self._is_demo = True
        demo_model = DemoCashflowModel()
        self._models["DemoCashflowModel"] = demo_model
        self._default_model_name = "DemoCashflowModel"

    def get_model(self, model_name: str | None = None) -> SimulationModel:
        """Loads and returns the requested simulation model, or the default."""
        self._load_models()
        if model_name and model_name in self._models:
            return self._models[model_name]
        return self._models[self._default_model_name]

    @extension_endpoint("params", methods=["GET"])
    def get_params(self) -> Response:
        """Returns the introspected parameters and scenario metadata."""
        try:
            requested_model = request.args.get("model")
            model = self.get_model(requested_model)
            params = model.get_params()
            model_name = getattr(type(model), "__name__", "CustomCashflowModel")

            param_schema = {k: p.to_dict() for k, p in params.items()}
            return jsonify({
                "status": "success",
                "model_name": model_name,
                "models": list(self._models.keys()),
                "is_demo": self._is_demo,
                "start_year": self.start_year,
                "end_year": self.end_year,
                "params": param_schema,
            })
        except Exception as e:
            log.exception("Error in get_params")
            err_resp = jsonify({"status": "error", "message": str(e)})
            err_resp.status_code = 500
            return err_resp

    @extension_endpoint("simulate", methods=["POST"])
    def simulate(self) -> Response:
        """
        Executes a simulation with parameter overrides and returns the mapped trace.
        Sub-15ms execution time.
        """
        try:
            raw_json: object = request.get_json(silent=True)
            req_data: dict[str, object] = cast("dict[str, object]", raw_json) if isinstance(raw_json, dict) else {}
            overrides_val = req_data.get("overrides")
            overrides: dict[str, object] = (
                cast("dict[str, object]", overrides_val) if isinstance(overrides_val, dict) else {}
            )
            start_val = req_data.get("start_year", self.start_year)
            start_yr = int(float(str(start_val)))
            end_val = req_data.get("end_year", self.end_year)
            end_yr = int(float(str(end_val)))

            requested_model = req_data.get("model")
            model = self.get_model(str(requested_model) if requested_model else None)

            trace = run_simulation(
                model,
                params=overrides,
                start_period=start_yr,
                end_period=end_yr,
            )
            return jsonify({"status": "success", "trace": trace.to_dict()})
        except Exception as e:
            log.exception("Error in simulate")
            err_resp = jsonify({"status": "error", "message": str(e)})
            err_resp.status_code = 500
            return err_resp
