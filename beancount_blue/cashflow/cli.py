"""
beancount_blue.cashflow.cli

Command Line Interface for running plain-text cashflow simulations.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import logging
import sys
from pathlib import Path
from typing import cast

from beancount.loader import load_file

from beancount_blue.cashflow.core import (
    ModelDefinition,
    SimulationModel,
    run_simulation,
)
from beancount_blue.cashflow.model import DemoCashflowModel

log = logging.getLogger(__name__)


def load_model_from_file(model_path: Path, ledger: object, model_class: str | None = None) -> SimulationModel:
    """Dynamically loads and instantiates a simulation model from a Python file."""
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    spec = importlib.util.spec_from_file_location("user_cashflow_model", model_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load module from {model_path}")

    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)

    # 1. Explicit class name
    if model_class and hasattr(module, model_class):
        cls: object = getattr(module, model_class)
        if isinstance(cls, type):
            candidate_cls: object = None
            try:
                candidate_cls = cls(ledger)
            except TypeError:
                candidate_cls = cls()
            if isinstance(candidate_cls, SimulationModel):
                return candidate_cls

    # 2. Factory function get_model(ledger)
    if hasattr(module, "get_model"):
        get_model_fn: object = module.get_model
        if callable(get_model_fn):
            candidate_fn = get_model_fn(ledger)
            if isinstance(candidate_fn, SimulationModel):
                return candidate_fn

    for attr_name in dir(module):
        attr: object = getattr(module, attr_name)
        if (
            isinstance(attr, type)
            and getattr(attr, "__module__", "") == module.__name__
            and attr is not ModelDefinition
            and attr is not SimulationModel
        ):
            candidate_attr: object = None
            try:
                candidate_attr = attr(ledger)
            except TypeError:
                try:
                    candidate_attr = attr()
                except Exception as e:
                    log.debug("Failed to instantiate %s without args: %s", attr, e)
                    continue
            if isinstance(candidate_attr, SimulationModel):
                return candidate_attr

    raise ValueError(f"No simulation model class found in {model_path}")


def parse_param_value(val_str: str) -> int | float | bool | str:
    """Parses a string parameter value into int, float, bool, or str."""
    if val_str.lower() in ("true", "yes"):
        return True
    if val_str.lower() in ("false", "no"):
        return False
    try:
        if "." in val_str:
            return float(val_str)
        return int(val_str)
    except ValueError:
        return val_str


def print_table_summary(trace_dict: dict[str, object], model_name: str) -> None:
    """Prints a formatted text summary of the simulation results."""
    periods_raw = trace_dict.get("periods")
    periods: list[int] = []
    if isinstance(periods_raw, list):
        periods_list: list[object] = cast(list[object], periods_raw)
        for p in periods_list:
            if isinstance(p, (int, float, str)):
                periods.append(int(p))
    if not periods:
        print("No simulation periods recorded.")
        return

    cashflows_raw = trace_dict.get("cashflows")
    cashflows: dict[str, list[float]] = (
        cast(dict[str, list[float]], cashflows_raw) if isinstance(cashflows_raw, dict) else {}
    )
    balances_raw = trace_dict.get("balances")
    balances: dict[str, list[float]] = (
        cast(dict[str, list[float]], balances_raw) if isinstance(balances_raw, dict) else {}
    )

    print("=" * 80)
    print(f" CASHFLOW SIMULATION SUMMARY: {model_name} ({periods[0]} - {periods[-1]})")
    print("=" * 80)

    # Show sample years (start, end, and steps of 5)
    sample_indices = [0]
    step_size = max(1, len(periods) // 10)
    for i in range(step_size, len(periods) - 1, step_size):
        sample_indices.append(i)
    if (len(periods) - 1) not in sample_indices:
        sample_indices.append(len(periods) - 1)

    # Header
    col_w = 12
    year_headers = "".join(f"{periods[i]:>{col_w}}" for i in sample_indices)
    print(f"{'Category / Account':<28}{year_headers}")
    print("-" * 80)

    # Cashflows
    print("CASHFLOWS (NET)")
    for cat, vals in sorted(cashflows.items()):
        row = f"  {cat:<26}"
        for i in sample_indices:
            v = vals[i] if i < len(vals) else 0.0
            row += f"{v:>{col_w},.0f}"
        print(row)

    # Net Operating Cashflow Row
    net_row = f"  {'NET CASHFLOW':<26}"
    for i in sample_indices:
        net_v = sum(cashflows[c][i] for c in cashflows if i < len(cashflows[c]))
        net_row += f"{net_v:>{col_w},.0f}"
    print(net_row)

    # Funding (portfolio drawdowns, transfers, taxes)
    funding_raw = trace_dict.get("funding")
    if isinstance(funding_raw, dict) and funding_raw:
        funding = cast(dict[str, list[float]], funding_raw)
        print("-" * 80)
        print("PORTFOLIO FUNDING (DRAWDOWNS & TAXES)")
        for cat, vals in sorted(funding.items()):
            row = f"  {cat:<26}"
            for i in sample_indices:
                v = vals[i] if i < len(vals) else 0.0
                row += f"{v:>{col_w},.0f}"
            print(row)

    print("-" * 80)
    # Balances
    print("ACCOUNT BALANCES (YEAR END)")
    for pot, vals in sorted(balances.items()):
        row = f"  {pot:<26}"
        for i in sample_indices:
            v = vals[i] if i < len(vals) else 0.0
            row += f"{v:>{col_w},.0f}"
        print(row)

    print("=" * 80)


def app(args: list[str] | None = None) -> int:
    """CLI main application function."""
    parser = argparse.ArgumentParser(
        prog="bean-blue-cashflow",
        description="Run plain-text lifetime cashflow and decumulation simulations.",
    )
    parser.add_argument(
        "--ledger",
        "-l",
        type=Path,
        default=None,
        help="Path to the Beancount ledger file (e.g. main.beancount).",
    )
    parser.add_argument(
        "--model",
        "-m",
        type=Path,
        default=None,
        help="Path to the household model script (e.g. household_model.py).",
    )
    parser.add_argument(
        "--model-class",
        type=str,
        default=None,
        help="Specific scenario class name to load from the model script.",
    )
    parser.add_argument(
        "--start-year",
        type=int,
        default=2026,
        help="Simulation starting year (default: 2026).",
    )
    parser.add_argument(
        "--end-year",
        type=int,
        default=2076,
        help="Simulation ending year (default: 2076).",
    )
    parser.add_argument(
        "--param",
        "-p",
        action="append",
        default=[],
        help="Override a model parameter in the format name=value (repeatable).",
    )
    parser.add_argument(
        "--list-params",
        action="store_true",
        help="List available parameters and their defaults, then exit.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output the full simulation trace as JSON.",
    )

    parsed = parser.parse_args(args)

    # 1. Load ledger if provided
    ledger: object = None
    if parsed.ledger:
        if not parsed.ledger.exists():
            print(f"Error: Ledger file not found: {parsed.ledger}", file=sys.stderr)
            return 1
        ledger = load_file(str(parsed.ledger))

    # 2. Load model
    model: SimulationModel
    if parsed.model:
        try:
            model = load_model_from_file(parsed.model, ledger=ledger, model_class=parsed.model_class)
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            return 1
    else:
        # Fallback to demo model
        model = DemoCashflowModel()

    # 3. Handle --list-params
    if parsed.list_params:
        params = model.get_params()
        print(f"Declared parameters for {type(model).__name__}:")
        for name, p in sorted(params.items()):
            p_dict = p.to_dict()
            print(
                f"  {name} ({p_dict['type']}): default={p_dict['default']} "
                f"range=[{p_dict['min']}, {p_dict['max']}] unit='{p_dict['unit']}' group='{p_dict['group']}'"
            )
            if p_dict["description"]:
                print(f"    {p_dict['description']}")
        return 0

    # 4. Parse parameter overrides
    overrides: dict[str, object] = {}
    for p_arg in parsed.param:
        if "=" not in p_arg:
            print(
                f"Error: Invalid parameter format '{p_arg}'. Expected name=value.",
                file=sys.stderr,
            )
            return 1
        k, v = p_arg.split("=", 1)
        overrides[k.strip()] = parse_param_value(v.strip())

    # 5. Run simulation
    trace = run_simulation(
        model,
        params=overrides,
        start_period=parsed.start_year,
        end_period=parsed.end_year,
    )

    # 6. Output
    trace_dict = trace.to_dict()
    if parsed.json:
        print(json.dumps(trace_dict, indent=2))
    else:
        print_table_summary(trace_dict, type(model).__name__)

    return 0


if __name__ == "__main__":
    sys.exit(app())
