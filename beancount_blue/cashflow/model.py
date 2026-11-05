"""
beancount_blue.cashflow.model

LedgerModel: Base class integrating parameter introspection, ledger ingestion,
and pure in-memory lifetime simulation execution.
"""

from __future__ import annotations

from beancount_blue.cashflow.core import (
    ModelDefinition,
    Param,
    SimulationTrace,
)
from beancount_blue.cashflow.extractor import LedgerExtractor


class LedgerModel(ModelDefinition):
    """
    Unified base class for cashflow scenario models backed by a Beancount ledger.

    Integrates:
    1. Construction & Cold Ingestion: Accepts a Beancount ledger on __init__,
       instantiates a LedgerExtractor, and calls initialize_from_ledger(extractor) once.
    2. Parameter declaration & introspection: Via Param descriptors and get_params().
    3. Pure simulation execution: Requires subclasses to implement simulate(params, start, end).
    """

    def __init__(self, ledger: object = None) -> None:
        self.ledger = ledger
        self.extractor: LedgerExtractor | None = LedgerExtractor(ledger) if ledger is not None else None
        if self.extractor is not None:
            self.initialize_from_ledger(self.extractor)

    def initialize_from_ledger(self, extractor: LedgerExtractor) -> None:
        """
        Hook for subclasses to extract starting balances, baseline living burn,
        and cached baseline numbers once upon model construction.
        """
        pass

    def get_balance(
        self,
        account_pattern: str,
        currency: str = "GBP",
        abs_value: bool = False,
    ) -> float:
        """Queries an account or pattern balance from the ledger."""
        if self.extractor is None:
            raise RuntimeError("No ledger was provided to this model. Cannot extract balance.")
        return self.extractor.get_balance(account_pattern, currency=currency, abs_value=abs_value)

    def get_balances(
        self,
        patterns: dict[str, str],
        currency: str = "GBP",
        abs_value: bool = False,
    ) -> dict[str, float]:
        """Queries multiple account balances from the ledger."""
        if self.extractor is None:
            raise RuntimeError("No ledger was provided to this model. Cannot extract balances.")
        return self.extractor.get_balances(patterns, currency=currency, abs_value=abs_value)

    def query_sum(self, bql: str, currency: str = "GBP") -> float:
        """Executes a BQL query against the ledger to calculate aggregate totals."""
        if self.extractor is None:
            raise RuntimeError("No ledger was provided to this model. Cannot query ledger.")
        return self.extractor.query_sum(bql, currency=currency)

    def simulate(
        self,
        params: dict[str, object] | None = None,
        start_period: int = 2026,
        end_period: int = 2076,
    ) -> SimulationTrace:
        """
        Executes the simulation across [start_period, end_period] with active parameters.
        Subclasses must implement this.
        """
        raise NotImplementedError(f"Subclasses of {self.__class__.__name__} must implement simulate().")


class DemoCashflowModel(ModelDefinition):
    """Fallback interactive demo model when no custom model script is found."""

    retire_year = Param(
        default=2035,
        min=2028,
        max=2050,
        step=1,
        label="Retirement Year",
        unit="year",
        group="Timelines",
        description="Target retirement year",
    )
    growth_rate = Param(
        default=0.04,
        min=0.01,
        max=0.08,
        step=0.005,
        label="Portfolio Return",
        unit="%",
        group="Macro",
        description="Real annual investment return",
    )
    living_expenses = Param(
        default=55_000.0,
        min=30_000.0,
        max=120_000.0,
        step=5_000.0,
        label="Annual Living Expenses",
        unit="£",
        group="Living Costs",
        description="Core household spending",
    )
    earned_salary = Param(
        default=95_000.0,
        min=40_000.0,
        max=150_000.0,
        step=5_000.0,
        label="Annual Net Salary",
        unit="£",
        group="Incomes",
        description="Net earned income prior to retirement",
    )

    def __init__(self, initial_portfolio: float = 650_000.0, ledger: object = None) -> None:
        self.initial_portfolio = initial_portfolio
        self.ledger = ledger

    def simulate(
        self,
        params: dict[str, object] | None = None,
        start_period: int = 2026,
        end_period: int = 2076,
    ) -> SimulationTrace:
        active: dict[str, object] = {name: p.default for name, p in self.get_params().items()}
        if params:
            active.update(params)

        retire_yr = int(float(str(active.get("retire_year", 2035))))
        growth_r = float(str(active.get("growth_rate", 0.04)))
        expenses_amt = float(str(active.get("living_expenses", 55000.0)))
        salary_amt = float(str(active.get("earned_salary", 95000.0)))

        portfolio = self.initial_portfolio
        trace = SimulationTrace()

        for year in range(start_period, end_period + 1):
            cashflows: dict[str, float] = {}

            # Inflow
            salary = salary_amt if year < retire_yr else 0.0
            if salary > 0:
                cashflows["salary"] = salary

            # Outflow
            cashflows["living_expenses"] = -expenses_amt

            # Growth
            growth = portfolio * growth_r
            portfolio += growth
            cashflows["investment_growth"] = growth

            # Net cashflow delta
            net_cash = salary - expenses_amt
            portfolio += net_cash

            trace.record(
                period=year,
                cashflows=cashflows,
                balances={"portfolio": portfolio},
                metrics={"net_worth": portfolio},
            )

        return trace
