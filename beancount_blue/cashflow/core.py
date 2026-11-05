"""
beancount_blue.cashflow.core

Agnostic time-series simulation engine.
Executes deterministic simulations with dynamic parameters and aggregates
cashflows, balances, and metrics over time.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol, cast, runtime_checkable


@dataclass(frozen=True)
class Param:
    """
    Introspectable scenario parameter.

    Used by models to declare dynamic scenario levers with UI/CLI metadata.
    """

    default: object = 0.0
    min: float | int | None = None
    max: float | int | None = None
    step: float | int | None = None
    label: str = ""
    unit: str = ""
    group: str = "General"
    description: str = ""

    def to_dict(self) -> dict[str, object]:
        """Serialize parameter definition to a JSON-compatible dictionary."""
        val_type = type(self.default).__name__
        return {
            "type": val_type,
            "default": self.default,
            "min": self.min,
            "max": self.max,
            "step": self.step,
            "label": self.label or "",
            "unit": self.unit or "",
            "group": self.group or "General",
            "description": self.description or "",
        }


@dataclass(frozen=True)
class Cashflow:
    """
    A cash movement within a single simulation period.

    Positive amount represents an Inflow (e.g. earned income, pension receipt).
    Negative amount represents an Outflow (e.g. living expense, tax paid).
    """

    category: str
    amount: float
    metadata: dict[str, object] = field(default_factory=dict)


@dataclass
class StepResult:
    """
    Convenience container for single period simulation output.
    """

    cashflows: list[Cashflow] = field(default_factory=list)
    balances: dict[str, float] = field(default_factory=dict)
    metrics: dict[str, float] = field(default_factory=dict)


class ModelDefinition:
    """
    Base class for models with introspectable parameters.

    Automatically discovers and introspects Param class attributes across
    the class hierarchy.
    """

    @classmethod
    def get_params(cls) -> dict[str, Param]:
        """Collects all Param descriptors defined on the class or base classes."""
        params: dict[str, Param] = {}
        for base in reversed(cls.__mro__):
            for k, v in getattr(base, "__dict__", {}).items():
                if isinstance(v, Param):
                    params[k] = v
        return params


@dataclass
class SimulationTrace:
    """
    Complete mapped time-series results of a simulation run.
    """

    periods: list[int] = field(default_factory=list)
    cashflows: dict[str, list[float]] = field(default_factory=dict)
    balances: dict[str, list[float]] = field(default_factory=dict)
    metrics: dict[str, list[float]] = field(default_factory=dict)
    funding: dict[str, list[float]] = field(default_factory=dict)
    colors: dict[str, str] = field(default_factory=dict)

    def record(
        self,
        period: int,
        cashflows: list[Cashflow] | dict[str, float] | None = None,
        balances: dict[str, float] | None = None,
        metrics: dict[str, float] | None = None,
        funding: list[Cashflow] | dict[str, float] | None = None,
    ) -> None:
        """
        Records the cashflows, balances, metrics, and funding for a single period.

        Automatically pads any newly introduced series with 0.0 for earlier periods,
        ensuring all time-series arrays stay perfectly aligned with self.periods.
        """
        self.periods.append(period)
        n_periods = len(self.periods)

        # 1. Process cashflows
        cf_dict: dict[str, float] = {}
        if cashflows:
            if isinstance(cashflows, dict):
                cf_dict = cashflows
            else:
                for cf in cashflows:
                    cf_dict[cf.category] = cf_dict.get(cf.category, 0.0) + cf.amount

        for cat, amt in cf_dict.items():
            if cat not in self.cashflows:
                self.cashflows[cat] = [0.0] * (n_periods - 1)
            self.cashflows[cat].append(amt)

        for cat in self.cashflows:
            if cat not in cf_dict:
                self.cashflows[cat].append(0.0)

        # 2. Process balances
        bal_dict = balances or {}
        for k, v in bal_dict.items():
            if k not in self.balances:
                self.balances[k] = [0.0] * (n_periods - 1)
            self.balances[k].append(v)
        for k in self.balances:
            if k not in bal_dict:
                self.balances[k].append(0.0)

        # 3. Process metrics
        met_dict = metrics or {}
        for k, v in met_dict.items():
            if k not in self.metrics:
                self.metrics[k] = [0.0] * (n_periods - 1)
            self.metrics[k].append(v)
        for k in self.metrics:
            if k not in met_dict:
                self.metrics[k].append(0.0)

        # 4. Process funding (portfolio drawdowns, transfers, taxes)
        f_dict: dict[str, float] = {}
        if funding:
            if isinstance(funding, dict):
                f_dict = funding
            else:
                for f in funding:
                    f_dict[f.category] = f_dict.get(f.category, 0.0) + f.amount

        for cat, amt in f_dict.items():
            if cat not in self.funding:
                self.funding[cat] = [0.0] * (n_periods - 1)
            self.funding[cat].append(amt)

        for cat in self.funding:
            if cat not in f_dict:
                self.funding[cat].append(0.0)

    def to_dict(self) -> dict[str, object]:
        """Serializes the trace into a dictionary suitable for JSON / API responses."""
        res: dict[str, object] = {
            "periods": list(self.periods),
            "cashflows": {k: list(v) for k, v in self.cashflows.items()},
            "balances": {k: list(v) for k, v in self.balances.items()},
            "metrics": {k: list(v) for k, v in self.metrics.items()},
            "funding": {k: list(v) for k, v in self.funding.items()},
        }
        if self.colors:
            res["colors"] = dict(self.colors)
        return res


@runtime_checkable
class SimulationModel(Protocol):
    """
    Protocol for any simulation model.

    A model exposes parameters and executes a pure in-memory simulation across
    a period range.
    """

    def get_params(self) -> dict[str, Param]:
        """Returns the dictionary of declared parameters and their metadata."""
        ...

    def simulate(
        self,
        params: dict[str, object] | None = None,
        start_period: int = 2026,
        end_period: int = 2076,
    ) -> SimulationTrace:
        """
        Executes the simulation across [start_period, end_period] using provided parameters.
        Returns the complete mapped time-series trace.
        """
        ...


def run_simulation(
    model: SimulationModel,
    params: dict[str, object] | None = None,
    start_period: int = 2026,
    end_period: int = 2076,
) -> SimulationTrace:
    """
    Harness that combines model defaults with parameter overrides and invokes simulate().
    """
    if end_period < start_period:
        raise ValueError(f"end_period ({end_period}) must be >= start_period ({start_period})")

    # Combine default parameters with overrides
    declared_params = model.get_params()
    active_params: dict[str, object] = {name: p.default for name, p in declared_params.items()}
    if params:
        active_params.update(params)

    trace = model.simulate(
        params=active_params,
        start_period=start_period,
        end_period=end_period,
    )
    model_palette: object = getattr(model, "PALETTE", None) or getattr(model, "colors", None)
    if isinstance(model_palette, dict):
        palette_dict = cast(dict[object, object], model_palette)
        for k, v in palette_dict.items():
            if isinstance(k, str) and isinstance(v, str) and k not in trace.colors:
                trace.colors[k] = v
    return trace
