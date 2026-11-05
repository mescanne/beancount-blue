"""
Tests for beancount_blue.cashflow.core
"""

import time
from typing import Any

import pytest

from beancount_blue.cashflow.core import (
    Cashflow,
    ModelDefinition,
    Param,
    SimulationModel,
    SimulationTrace,
    run_simulation,
)


class SimpleModel(ModelDefinition):
    """A minimal test model implementing SimulationModel."""

    growth_rate = Param(default=0.05, min=0.0, max=0.20, step=0.01, label="Growth Rate", unit="%")
    withdrawal = Param(default=1000.0, min=0.0, max=10000.0, step=100.0, label="Annual Withdrawal")

    def __init__(self, initial_balance: float = 10000.0):
        self.initial_balance = initial_balance

    def simulate(
        self,
        params: dict[str, Any] | None = None,
        start_period: int = 2020,
        end_period: int = 2025,
    ) -> SimulationTrace:
        active = {name: p.default for name, p in self.get_params().items()}
        if params:
            active.update(params)

        bal = self.initial_balance
        trace = SimulationTrace()

        for period in range(start_period, end_period + 1):
            growth = bal * active["growth_rate"]
            bal += growth
            withdrawal = active["withdrawal"]
            bal -= withdrawal

            cfs = [
                Cashflow("growth", growth),
                Cashflow("withdrawal", -withdrawal),
            ]
            if period % 5 == 0:
                cfs.append(Cashflow("special_bonus", 500.0))

            trace.record(
                period=period,
                cashflows=cfs,
                balances={"main_pot": bal},
                metrics={"net_worth": bal},
            )

        return trace


def test_param_definition_and_serialization():
    p = Param(
        default=2035,
        min=2025,
        max=2050,
        step=1,
        label="Retirement Year",
        unit="year",
        group="Timelines",
        description="Target retirement year",
    )
    data = p.to_dict()
    assert data["type"] == "int"
    assert data["default"] == 2035
    assert data["min"] == 2025
    assert data["max"] == 2050
    assert data["step"] == 1
    assert data["label"] == "Retirement Year"
    assert data["unit"] == "year"
    assert data["group"] == "Timelines"
    assert data["description"] == "Target retirement year"


def test_model_definition_param_introspection():
    class BaseScenario(ModelDefinition):
        shared_param = Param(default=10)
        overridden_param = Param(default=1.0)

    class DerivedScenario(BaseScenario):
        overridden_param = Param(default=2.0)
        new_param = Param(default="test")

    params = DerivedScenario.get_params()
    assert set(params.keys()) == {"shared_param", "overridden_param", "new_param"}
    assert params["shared_param"].default == 10
    assert params["overridden_param"].default == 2.0
    assert params["new_param"].default == "test"


def test_simulation_protocol_check():
    model = SimpleModel()
    assert isinstance(model, SimulationModel)


def test_run_simulation_defaults_and_alignment():
    model = SimpleModel(initial_balance=10000.0)
    trace = run_simulation(model, start_period=2020, end_period=2025)

    assert trace.periods == [2020, 2021, 2022, 2023, 2024, 2025]
    assert len(trace.periods) == 6

    # Verify categories are aligned across all periods
    assert "growth" in trace.cashflows
    assert "withdrawal" in trace.cashflows
    assert "special_bonus" in trace.cashflows

    for cat in ["growth", "withdrawal", "special_bonus"]:
        assert len(trace.cashflows[cat]) == 6

    # special_bonus only occurred in 2020 and 2025 (multiples of 5)
    # The others should be zero-filled
    assert trace.cashflows["special_bonus"][0] == 500.0  # 2020
    assert trace.cashflows["special_bonus"][1] == 0.0  # 2021
    assert trace.cashflows["special_bonus"][2] == 0.0  # 2022
    assert trace.cashflows["special_bonus"][3] == 0.0  # 2023
    assert trace.cashflows["special_bonus"][4] == 0.0  # 2024
    assert trace.cashflows["special_bonus"][5] == 500.0  # 2025

    # Balances and metrics aligned
    assert len(trace.balances["main_pot"]) == 6
    assert len(trace.metrics["net_worth"]) == 6

    # Verify serialization
    serialized = trace.to_dict()
    assert "periods" in serialized
    assert "cashflows" in serialized
    assert "balances" in serialized
    assert "metrics" in serialized
    assert serialized["periods"] == [2020, 2021, 2022, 2023, 2024, 2025]


def test_run_simulation_with_overrides():
    model_default = SimpleModel(initial_balance=10000.0)
    trace_default = run_simulation(model_default, start_period=2020, end_period=2025)

    model_override = SimpleModel(initial_balance=10000.0)
    trace_override = run_simulation(
        model_override,
        params={"growth_rate": 0.10, "withdrawal": 500.0},
        start_period=2020,
        end_period=2025,
    )

    # With higher growth and lower withdrawal, ending balance should be strictly higher
    ending_default = trace_default.balances["main_pot"][-1]
    ending_override = trace_override.balances["main_pot"][-1]
    assert ending_override > ending_default


def test_run_simulation_invalid_range():
    model = SimpleModel()
    with pytest.raises(ValueError, match="end_period"):
        run_simulation(model, start_period=2025, end_period=2020)


def test_multiple_cashflows_same_category_summed():
    class MultiFlowModel(ModelDefinition):
        def simulate(
            self,
            params: dict[str, Any] | None = None,
            start_period: int = 2020,
            end_period: int = 2022,
        ) -> SimulationTrace:
            trace = SimulationTrace()
            for period in range(start_period, end_period + 1):
                trace.record(
                    period=period,
                    cashflows=[
                        Cashflow("expense", -100.0),
                        Cashflow("expense", -50.0),
                        Cashflow("income", 300.0),
                    ],
                )
            return trace

    model = MultiFlowModel()
    trace = run_simulation(model, start_period=2020, end_period=2022)
    assert trace.cashflows["expense"] == [-150.0, -150.0, -150.0]
    assert trace.cashflows["income"] == [300.0, 300.0, 300.0]


def test_simulation_performance():
    """Verify that 100 simulation runs across 50 years execute in well under 100ms."""
    model = SimpleModel(initial_balance=100000.0)

    start = time.perf_counter()
    for _ in range(100):
        # Pure simulation - no manual reset needed!
        run_simulation(model, start_period=2026, end_period=2076)
    elapsed = time.perf_counter() - start

    # 100 runs of 50 years should be sub-50ms (average < 0.5ms per run)
    assert elapsed < 0.1, f"Elapsed time {elapsed:.3f}s exceeded 0.1s threshold"


def test_simulation_trace_funding():
    """Verify that funding (portfolio drawdowns, transfers) is tracked and serialized."""
    trace = SimulationTrace()
    trace.record(
        period=2026,
        cashflows=[Cashflow("salary", 50000.0), Cashflow("living", -60000.0)],
        balances={"sipp": 500000.0},
        funding=[Cashflow("sipp_drawdown", 10000.0), Cashflow("tax", -1500.0)],
    )
    trace.record(
        period=2027,
        cashflows=[Cashflow("salary", 50000.0), Cashflow("living", -55000.0)],
        balances={"sipp": 495000.0},
        funding=[Cashflow("sipp_drawdown", 5000.0)],
    )

    data = trace.to_dict()
    assert "funding" in data
    funding_data = data["funding"]
    assert funding_data["sipp_drawdown"] == [10000.0, 5000.0]
    assert funding_data["tax"] == [-1500.0, 0.0]
