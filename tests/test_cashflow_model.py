"""
Tests for beancount_blue.cashflow.model.LedgerModel
"""

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
)

SAMPLE_LEDGER = """
2020-01-01 open Assets:Bank:Current GBP
2020-01-01 open Assets:Pension GBP
2020-01-01 open Expenses:Living GBP
2020-01-01 open Equity:Opening

2020-01-01 * "Opening Balance"
  Assets:Bank:Current            10,000.00 GBP
  Assets:Pension                100,000.00 GBP
  Equity:Opening

2020-06-01 * "Living costs"
  Expenses:Living                25,000.00 GBP
  Assets:Bank:Current
"""


class SimpleHouseholdModel(LedgerModel):
    # 1. Exposing parameters
    retire_year = Param(default=2035, min=2028, max=2045, label="Retire Year")
    growth_rate = Param(default=0.05, min=0.01, max=0.10, label="Return")

    # 2. Consuming ledger details (runs once on construction)
    def initialize_from_ledger(self, extractor: LedgerExtractor) -> None:
        self.bank_initial = self.get_balance("Assets:Bank:Current")
        self.pension_initial = self.get_balance("Assets:Pension")
        self.living_burn = self.query_sum("SELECT sum(position) WHERE account ~ 'Expenses:Living'")

    # 3. Implementing simulate()
    def simulate(
        self,
        params: dict[str, Any] | None = None,
        start_period: int = 2026,
        end_period: int = 2035,
    ) -> SimulationTrace:
        active = {name: p.default for name, p in self.get_params().items()}
        if params:
            active.update(params)

        bank = self.bank_initial
        pension = self.pension_initial
        trace = SimulationTrace()

        for period in range(start_period, end_period + 1):
            cashflows = []

            # Inflow
            salary = 80_000.0 if period < active["retire_year"] else 0.0
            if salary > 0:
                cashflows.append(Cashflow("salary", salary))
                bank += salary

            # Outflow
            cashflows.append(Cashflow("living", -self.living_burn))
            bank -= self.living_burn

            # Growth on pension
            growth = pension * active["growth_rate"]
            pension += growth
            cashflows.append(Cashflow("pension_growth", growth))

            trace.record(
                period=period,
                cashflows=cashflows,
                balances={"bank": bank, "pension": pension},
                metrics={"net_worth": bank + pension},
            )

        return trace


def test_ledger_model_lifecycle():
    loaded = load_string(SAMPLE_LEDGER)
    model = SimpleHouseholdModel(loaded)

    # Verify Protocol compliance
    assert isinstance(model, SimulationModel)

    # 1. Parameter introspection
    params = model.get_params()
    assert "retire_year" in params
    assert "growth_rate" in params
    assert params["retire_year"].default == 2035

    # 2. Ledger consumption
    assert model.bank_initial == pytest.approx(10_000.0 - 25_000.0)  # -15,000 net
    assert model.pension_initial == pytest.approx(100_000.0)
    assert model.living_burn == pytest.approx(25_000.0)

    # 3. Simulation execution via simulate()
    trace = model.simulate({"retire_year": 2030}, start_period=2026, end_period=2035)

    assert trace.periods == list(range(2026, 2036))
    assert "salary" in trace.cashflows
    assert "living" in trace.cashflows
    assert "pension_growth" in trace.cashflows

    # Salary stops in 2030
    salary_series = trace.cashflows["salary"]
    assert salary_series[0] == 80_000.0  # 2026
    assert salary_series[3] == 80_000.0  # 2029
    assert salary_series[4] == 0.0  # 2030 (retired)
    assert salary_series[5] == 0.0  # 2031

    # 4. Pure simulation idempotency: second run does not leak state
    trace2 = model.simulate({"retire_year": 2035}, start_period=2026, end_period=2035)
    salary_series_2 = trace2.cashflows["salary"]
    assert salary_series_2[4] == 80_000.0  # Still working in 2030 in second run!
    assert model.pension_initial == 100_000.0
