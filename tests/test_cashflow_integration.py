"""
Integration test for beancount_blue lifetime cashflow simulation framework.

Uses an anonymous, generic sample ledger and household model to test:
- Ledger loading and initial balance extraction
- Parameter introspection
- UK wrappers: SIPP with tax calculator, ISA, GIA, Offset Mortgage
- Pure simulate() execution over 30 years
- CLI invocation with custom model file and ledger
"""

from pathlib import Path
from typing import Any

import pytest
from beancount.loader import load_string

from beancount_blue.cashflow import (
    Cashflow,
    LedgerExtractor,
    LedgerModel,
    Param,
    SimulationModel,
    SimulationTrace,
    run_simulation,
)
from beancount_blue.cashflow.cli import app
from beancount_blue.cashflow.uk import (
    UKCapitalGainsCalculator,
    UKGIAWrapper,
    UKIncomeTaxCalculator,
    UKISAWrapper,
    UKOffsetMortgageWrapper,
    UKSIPPWrapper,
)

GENERIC_SAMPLE_LEDGER = """
option "operating_currency" "GBP"

2020-01-01 open Assets:Bank:Current GBP
2020-01-01 open Assets:Bank:OffsetCash GBP
2020-01-01 open Assets:Investments:ISA GBP
2020-01-01 open Assets:Investments:GIA GBP
2020-01-01 open Assets:Investments:SIPP GBP
2020-01-01 open Liabilities:Mortgage GBP
2020-01-01 open Expenses:Living:General GBP
2020-01-01 open Expenses:Living:Utilities GBP
2020-01-01 open Income:Salary GBP
2020-01-01 open Equity:OpeningBalances

2025-01-01 * "Initial Balances"
  Assets:Bank:Current                 5,000.00 GBP
  Assets:Bank:OffsetCash             40,000.00 GBP
  Assets:Investments:ISA            150,000.00 GBP
  Assets:Investments:GIA             80,000.00 GBP
  Assets:Investments:SIPP           350,000.00 GBP
  Liabilities:Mortgage             -300,000.00 GBP
  Equity:OpeningBalances

2025-06-01 * "Sample Spending"
  Expenses:Living:General            35,000.00 GBP
  Expenses:Living:Utilities           5,000.00 GBP
  Assets:Bank:Current               -40,000.00 GBP
"""


class GenericHouseholdModel(LedgerModel):
    """
    Generic sample scenario testing lifetime cashflow modeling.
    Completely anonymous with no personal identifiers.
    """

    retire_age = Param(default=60, min=55, max=68, step=1, label="Retirement Age", group="Timelines")
    coast_age = Param(default=55, min=50, max=65, step=1, label="Downshift Age", group="Timelines")
    growth_rate = Param(
        default=0.04, min=0.01, max=0.08, step=0.005, label="Investment Return", unit="%", group="Macro"
    )
    salary_full = Param(
        default=90_000.0, min=40_000.0, max=150_000.0, step=5_000.0, label="Full Salary", unit="£", group="Incomes"
    )
    salary_coast = Param(
        default=45_000.0, min=20_000.0, max=80_000.0, step=5_000.0, label="Coast Salary", unit="£", group="Incomes"
    )

    def initialize_from_ledger(self, extractor: LedgerExtractor) -> None:
        # 1. Extract starting balances once on cold load
        self.sipp_start = self.get_balance("Assets:Investments:SIPP")
        self.isa_start = self.get_balance("Assets:Investments:ISA")
        self.gia_start = self.get_balance("Assets:Investments:GIA")
        self.offset_cash_start = self.get_balance("Assets:Bank:OffsetCash")
        self.mortgage_debt_start = self.get_balance("Liabilities:Mortgage", abs_value=True)

        # 2. Extract baseline expenditure using BQL
        self.baseline_living_burn = self.query_sum("SELECT sum(position) WHERE account ~ '^Expenses:Living'")

        # Baseline individual demographics
        self.birth_year = 1978

    def simulate(
        self,
        params: dict[str, Any] | None = None,
        start_period: int = 2026,
        end_period: int = 2056,
    ) -> SimulationTrace:
        active = {name: p.default for name, p in self.get_params().items()}
        if params:
            active.update(params)

        # 1. Instantiate fresh local wrappers per simulation (Zero state leakage)
        tax_calc = UKIncomeTaxCalculator()
        cgt_calc = UKCapitalGainsCalculator()

        sipp = UKSIPPWrapper(
            "Sample SIPP",
            self.sipp_start,
            access_age=57,
            birth_year=self.birth_year,
            tax_calc=tax_calc,
        )
        isa = UKISAWrapper("Sample ISA", self.isa_start)
        gia = UKGIAWrapper(
            "Sample GIA",
            self.gia_start,
            cost_basis=self.gia_start * 0.75,
        )
        offset_cash = UKISAWrapper("Offset Cash", self.offset_cash_start)
        mortgage = UKOffsetMortgageWrapper(
            "Mortgage",
            self.mortgage_debt_start,
            interest_rate=0.045,
            linked_cash=offset_cash,
        )

        trace = SimulationTrace()

        for year in range(start_period, end_period + 1):
            age = year - self.birth_year
            cashflows: list[Cashflow] = []

            # 2. Earned Incomes (Full-time -> Coasting -> Retired)
            if age < active["coast_age"]:
                salary = active["salary_full"]
            elif age < active["retire_age"]:
                salary = active["salary_coast"]
            else:
                salary = 0.0

            if salary > 0:
                cashflows.append(Cashflow("salary", salary))

            # 3. Living Costs
            cashflows.append(Cashflow("living_costs", -self.baseline_living_burn))

            # 4. Mortgage Service: interest net of offset cash
            interest = mortgage.step_interest()
            if interest > 0:
                cashflows.append(Cashflow("mortgage_interest", -interest))

            # Principal contractual repayment (£20k/yr until cleared)
            if mortgage.balance > 0:
                repayment = min(20_000.0, mortgage.balance)
                mortgage.repay_principal(repayment)
                cashflows.append(Cashflow("mortgage_principal", -repayment))

            # 5. Asset Growth
            return_rate = active["growth_rate"]
            sipp.grow(return_rate)
            isa.grow(return_rate)
            gia.grow(return_rate)

            # 6. Deficit / Surplus Resolution
            net_flow = sum(cf.amount for cf in cashflows)
            if net_flow < 0:
                deficit = -net_flow
                # Drawdown hierarchy: Offset Cash -> ISA -> GIA -> SIPP
                if offset_cash.balance >= deficit:
                    offset_cash.withdraw(deficit)
                    cashflows.append(Cashflow("offset_drawdown", deficit))
                else:
                    deficit -= offset_cash.balance
                    offset_cash.withdraw(offset_cash.balance)

                    if isa.balance >= deficit:
                        isa.withdraw(deficit)
                        cashflows.append(Cashflow("isa_drawdown", deficit))
                    else:
                        deficit -= isa.balance
                        isa.withdraw(isa.balance)

                        if gia.balance >= deficit:
                            cash_received, realized_gain = gia.withdraw(deficit)
                            tax_paid = cgt_calc.tax_on_gain(realized_gain)
                            cashflows.append(Cashflow("gia_drawdown", cash_received))
                            if tax_paid > 0:
                                cashflows.append(Cashflow("cgt_paid", -tax_paid))
                        elif sipp.is_accessible(year):
                            net_got, gross_withdrawn = sipp.withdraw_net(deficit)
                            cashflows.append(Cashflow("sipp_drawdown", net_got))
                            tax_withheld = gross_withdrawn - net_got
                            if tax_withheld > 0:
                                cashflows.append(Cashflow("income_tax", -tax_withheld))

            # Total wealth calculation
            total_assets = sipp.balance + isa.balance + gia.balance + offset_cash.balance
            net_worth = total_assets - mortgage.balance

            trace.record(
                period=year,
                cashflows=cashflows,
                balances={
                    "sipp": sipp.balance,
                    "isa": isa.balance,
                    "gia": gia.balance,
                    "offset_cash": offset_cash.balance,
                    "mortgage": mortgage.balance,
                },
                metrics={
                    "net_worth": net_worth,
                    "total_assets": total_assets,
                    "age": float(age),
                },
            )

        return trace


def test_full_model_integration_lifecycle():
    """Tests end-to-end extraction, simulation, and idempotency."""
    loaded_ledger = load_string(GENERIC_SAMPLE_LEDGER)
    model = GenericHouseholdModel(loaded_ledger)

    # 1. Verify SimulationModel Protocol compliance
    assert isinstance(model, SimulationModel)

    # 2. Verify Ledger Extraction
    assert model.sipp_start == pytest.approx(350_000.0)
    assert model.isa_start == pytest.approx(150_000.0)
    assert model.gia_start == pytest.approx(80_000.0)
    assert model.offset_cash_start == pytest.approx(40_000.0)
    assert model.mortgage_debt_start == pytest.approx(300_000.0)
    assert model.baseline_living_burn == pytest.approx(40_000.0)

    # 3. Parameter introspection
    params = model.get_params()
    assert "retire_age" in params
    assert "coast_age" in params
    assert "growth_rate" in params
    assert params["retire_age"].default == 60

    # 4. Run baseline simulation (2026 to 2056)
    trace = run_simulation(model, start_period=2026, end_period=2056)
    assert len(trace.periods) == 31
    assert trace.periods[0] == 2026
    assert trace.periods[-1] == 2056

    # Verify cashflows exist and are aligned
    assert "salary" in trace.cashflows
    assert "living_costs" in trace.cashflows
    assert "mortgage_interest" in trace.cashflows
    assert len(trace.cashflows["salary"]) == 31

    # In 2026 (age 48), full salary £90,000
    assert trace.cashflows["salary"][0] == 90_000.0

    # At age 55 (2033), salary drops to coast salary £45,000
    # 1978 + 55 = 2033, which is index 7
    assert trace.cashflows["salary"][7] == 45_000.0

    # At age 60 (2038, index 12), retirement: salary is 0
    assert trace.cashflows["salary"][12] == 0.0

    # Mortgage gets paid down over time
    assert trace.balances["mortgage"][0] < 300_000.0
    # After 30 years with £10k/yr, mortgage should be 0
    assert trace.balances["mortgage"][-1] == 0.0

    # Net worth must be positive throughout
    assert all(nw > 0 for nw in trace.metrics["net_worth"])

    # 5. Idempotency test: second run with different parameters does not leak state
    trace_early_retire = run_simulation(
        model,
        params={"retire_age": 55, "coast_age": 50, "growth_rate": 0.02},
        start_period=2026,
        end_period=2056,
    )
    # Early retirement: salary at index 7 (2033, age 55) is already 0
    assert trace_early_retire.cashflows["salary"][7] == 0.0

    # Starting values on model remain untouched
    assert model.sipp_start == 350_000.0
    assert model.isa_start == 150_000.0


def test_cli_integration_with_file(tmp_path: Path, capsys):
    """Tests executing the CLI with a generic ledger file and model script."""
    ledger_path = tmp_path / "test_ledger.beancount"
    ledger_path.write_text(GENERIC_SAMPLE_LEDGER)

    # Write model module
    model_code = """
from beancount_blue.cashflow import LedgerModel, Param, SimulationTrace, Cashflow

class SampleCliModel(LedgerModel):
    annual_draw = Param(default=25000.0, min=10000.0, max=50000.0)

    def initialize_from_ledger(self, extractor):
        self.initial_pot = extractor.get_balance("Assets:Investments:ISA")

    def simulate(self, params=None, start_period=2026, end_period=2030):
        active = {name: p.default for name, p in self.get_params().items()}
        if params:
            active.update(params)
        draw = active["annual_draw"]
        pot = self.initial_pot
        trace = SimulationTrace()
        for yr in range(start_period, end_period + 1):
            pot = (pot - draw) * 1.05
            trace.record(
                period=yr,
                cashflows=[Cashflow("drawdown", draw)],
                balances={"isa": pot},
                metrics={"net_worth": pot},
            )
        return trace
"""
    model_path = tmp_path / "sample_model.py"
    model_path.write_text(model_code)

    # 1. Run CLI --list-params with custom model and ledger
    ret_list = app([
        "--ledger",
        str(ledger_path),
        "--model",
        str(model_path),
        "--list-params",
    ])
    assert ret_list == 0
    captured = capsys.readouterr()
    assert "Declared parameters for SampleCliModel:" in captured.out
    assert "annual_draw" in captured.out

    # 2. Run CLI simulation outputting JSON
    ret_run = app([
        "--ledger",
        str(ledger_path),
        "--model",
        str(model_path),
        "--json",
        "--start-year",
        "2026",
        "--end-year",
        "2029",
        "-p",
        "annual_draw=30000",
    ])
    assert ret_run == 0
    captured_run = capsys.readouterr()
    import json

    data = json.loads(captured_run.out)
    assert data["periods"] == [2026, 2027, 2028, 2029]
    assert "drawdown" in data["cashflows"]
    assert data["cashflows"]["drawdown"] == [30000.0, 30000.0, 30000.0, 30000.0]
    # Starting ISA was 150k. Year 1: (150k - 30k) * 1.05 = 126k
    assert data["balances"]["isa"][0] == pytest.approx(126000.0)
