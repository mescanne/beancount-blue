"""
Tests for beancount_blue.cashflow.cli
"""

import json
from pathlib import Path

from beancount_blue.cashflow.cli import app


def test_cli_list_params(capsys):
    ret = app(["--list-params"])
    assert ret == 0
    captured = capsys.readouterr()
    assert "Declared parameters for DemoCashflowModel:" in captured.out
    assert "retire_year" in captured.out
    assert "living_expenses" in captured.out


def test_cli_json_simulation(capsys):
    ret = app([
        "--json",
        "--start-year",
        "2026",
        "--end-year",
        "2030",
        "-p",
        "retire_year=2028",
        "-p",
        "living_expenses=45000",
    ])
    assert ret == 0
    captured = capsys.readouterr()
    data = json.loads(captured.out)

    assert "periods" in data
    assert data["periods"] == [2026, 2027, 2028, 2029, 2030]
    assert "cashflows" in data
    assert "balances" in data
    assert "metrics" in data


def test_cli_table_summary(capsys):
    ret = app([
        "--start-year",
        "2026",
        "--end-year",
        "2030",
    ])
    assert ret == 0
    captured = capsys.readouterr()
    assert "CASHFLOW SIMULATION SUMMARY" in captured.out
    assert "CASHFLOWS (NET)" in captured.out
    assert "ACCOUNT BALANCES (YEAR END)" in captured.out


def test_cli_with_model_file(tmp_path: Path, capsys):
    model_code = """
from beancount_blue.cashflow import LedgerModel, Param, SimulationTrace

class CustomModel(LedgerModel):
    annual_spend = Param(default=30000.0, min=10000.0, max=100000.0)

    def initialize_from_ledger(self, extractor=None):
        self.initial_pot = 200000.0

    def simulate(self, params=None, start_period=2026, end_period=2028):
        spend = params["annual_spend"]
        pot = getattr(self, "initial_pot", 200000.0)
        trace = SimulationTrace()
        for period in range(start_period, end_period + 1):
            pot -= spend
            trace.record(
                period=period,
                cashflows={"spending": -spend},
                balances={"pot": pot},
                metrics={"net_worth": pot},
            )
        return trace
"""
    model_file = tmp_path / "custom_model.py"
    model_file.write_text(model_code)

    ret = app([
        "--model",
        str(model_file),
        "--list-params",
    ])
    assert ret == 0
    captured = capsys.readouterr()
    assert "Declared parameters for CustomModel:" in captured.out
    assert "annual_spend" in captured.out

    ret = app([
        "--model",
        str(model_file),
        "--json",
        "--start-year",
        "2026",
        "--end-year",
        "2028",
        "-p",
        "annual_spend=40000",
    ])
    assert ret == 0
    captured = capsys.readouterr()
    data = json.loads(captured.out)
    assert data["periods"] == [2026, 2027, 2028]
    assert data["cashflows"]["spending"] == [-40000.0, -40000.0, -40000.0]
    assert data["balances"]["pot"] == [160000.0, 120000.0, 80000.0]
