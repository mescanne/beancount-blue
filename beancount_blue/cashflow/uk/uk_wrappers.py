"""
beancount_blue.cashflow.uk.uk_wrappers

UK-specific account wrappers encapsulating HMRC tax rules and banking mechanics.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from beancount_blue.cashflow.uk.uk_tax import UKIncomeTaxCalculator


class BalanceHolder(Protocol):
    balance: float


@dataclass
class UKISAWrapper:
    """
    UK Individual Savings Account (ISA) wrapper.

    Models zero tax friction on growth, deposits, and withdrawals.
    Enforces the £20,000 annual ISA subscription allowance.
    """

    name: str
    balance: float = 0.0
    annual_allowance: float | None = 20_000.0
    allowance_remaining: float = 20_000.0

    def grow(self, return_rate: float) -> float:
        """Applies tax-free capital return."""
        growth = self.balance * return_rate
        self.balance += growth
        return growth

    def deposit(self, amount: float) -> float:
        """
        Deposits cash into the ISA, respecting remaining annual allowance.

        Returns the actual amount deposited.
        """
        if amount <= 0.0:
            return 0.0

        if self.annual_allowance is not None:
            actual = min(amount, max(0.0, self.allowance_remaining))
            self.allowance_remaining -= actual
        else:
            actual = amount

        self.balance += actual
        return actual

    def withdraw(self, amount: float) -> float:
        """
        Withdraws liquid funds from the ISA. Zero tax friction.

        Returns the actual amount withdrawn.
        """
        if amount <= 0.0:
            return 0.0
        actual = min(self.balance, amount)
        self.balance -= actual
        return actual

    def reset_annual_allowance(self) -> None:
        """Resets annual contribution allowance for a new tax year."""
        self.allowance_remaining = self.annual_allowance if self.annual_allowance is not None else float("inf")


@dataclass
class UKSIPPWrapper:
    """
    UK Self-Invested Personal Pension (SIPP) / Workplace Pension wrapper.

    Models access age restrictions (e.g. Age 57) and integrates with
    UKIncomeTaxCalculator to model PAYE income tax withholding on decumulation,
    including 25% Pension Commencement Lump Sum (PCLS / UFPLS) up to the statutory
    Lump Sum Allowance (£268,275).
    """

    name: str
    balance: float = 0.0
    access_age: int = 57
    birth_year: int = 1970
    tax_calc: UKIncomeTaxCalculator | None = None
    pcls_fraction: float = 0.25
    pcls_allowance_remaining: float = 268_275.0
    pcls_taken_total: float = 0.0

    def is_accessible(self, year: int) -> bool:
        """Checks if statutory pension access age has been reached."""
        return (year - self.birth_year) >= self.access_age

    def grow(self, return_rate: float) -> float:
        """Applies untaxed pension portfolio compounding."""
        growth = self.balance * return_rate
        self.balance += growth
        return growth

    def deposit(self, gross_amount: float) -> float:
        """Deposits gross funds into the pension."""
        if gross_amount <= 0.0:
            return 0.0
        self.balance += gross_amount
        return gross_amount

    def calculate_tax_on_gross(
        self, gross_amount: float, existing_taxable_income: float = 0.0
    ) -> tuple[float, float, float]:
        """
        Calculates tax-free PCLS element, taxable element, and tax liability on a gross withdrawal.

        Returns: (tax_free_portion, taxable_portion, tax_liability)
        """
        if gross_amount <= 0.0:
            return 0.0, 0.0, 0.0

        tf = (
            min(gross_amount * self.pcls_fraction, self.pcls_allowance_remaining)
            if self.pcls_fraction > 0 and self.pcls_allowance_remaining > 0
            else 0.0
        )
        tx = gross_amount - tf
        tax = self.tax_calc.marginal_tax(tx, existing_taxable_income) if self.tax_calc is not None else 0.0
        return tf, tx, tax

    def net_from_gross(self, gross_amount: float, existing_taxable_income: float = 0.0) -> float:
        """Calculates net cash delivered from a gross withdrawal."""
        if gross_amount <= 0.0:
            return 0.0
        _, _, tax = self.calculate_tax_on_gross(gross_amount, existing_taxable_income)
        return gross_amount - tax

    def gross_from_net(self, net_amount: float, existing_taxable_income: float = 0.0, tolerance: float = 0.01) -> float:
        """
        Solves for the gross withdrawal needed to deliver the target net cash.
        Uses monotonic bisection search.
        """
        if net_amount <= 0.0:
            return 0.0
        if self.tax_calc is None:
            return net_amount

        low = net_amount
        high = max(net_amount * 3.0, 1000.0)
        while self.net_from_gross(high, existing_taxable_income) < net_amount:
            high *= 2.0

        for _ in range(60):
            mid = (low + high) / 2.0
            mid_net = self.net_from_gross(mid, existing_taxable_income)
            diff = mid_net - net_amount
            if abs(diff) <= tolerance:
                return mid
            if diff < 0:
                low = mid
            else:
                high = mid

        return (low + high) / 2.0

    def basic_rate_gross_headroom(
        self, existing_taxable_income: float = 0.0, basic_rate_limit: float = 50_270.0
    ) -> float:
        """
        Computes maximum gross SIPP withdrawal that keeps total taxable income
        within the basic rate limit (£50,270).
        """
        taxable_room = max(0.0, basic_rate_limit - existing_taxable_income)
        if taxable_room <= 0.0:
            return 0.0

        if self.pcls_fraction > 0 and self.pcls_allowance_remaining > 0:
            taxable_fraction = 1.0 - self.pcls_fraction
            if taxable_fraction > 0:
                return taxable_room / taxable_fraction
        return taxable_room

    def basic_rate_net_capacity(
        self, existing_taxable_income: float = 0.0, basic_rate_limit: float = 50_270.0
    ) -> float:
        """
        Computes maximum net cash that can be withdrawn from this SIPP without exceeding
        the basic rate limit, constrained by current SIPP balance.
        """
        if self.balance <= 0.0:
            return 0.0
        gross_headroom = self.basic_rate_gross_headroom(existing_taxable_income, basic_rate_limit)
        actual_gross = min(self.balance, gross_headroom)
        return self.net_from_gross(actual_gross, existing_taxable_income)

    def withdraw_gross(self, gross_amount: float, existing_taxable_income: float = 0.0) -> tuple[float, float]:
        """
        Withdraws gross balance directly from the SIPP.

        Returns: (net_received, gross_withdrawn)
        """
        if gross_amount <= 0.0 or self.balance <= 0.0:
            return 0.0, 0.0

        actual_gross = min(self.balance, gross_amount)
        tf, _tx, tax = self.calculate_tax_on_gross(actual_gross, existing_taxable_income)

        self.balance -= actual_gross
        self.pcls_allowance_remaining = max(0.0, self.pcls_allowance_remaining - tf)
        self.pcls_taken_total += tf
        net_received = actual_gross - tax
        return net_received, actual_gross

    def withdraw_net(self, net_needed: float, existing_taxable_income: float = 0.0) -> tuple[float, float]:
        """
        Withdraws enough gross pension balance to satisfy a net disposable cash need,
        accounting for UK income tax withholding and 25% tax-free PCLS.

        Returns: (net_received, gross_depleted_from_pension)
        """
        if net_needed <= 0.0 or self.balance <= 0.0:
            return 0.0, 0.0

        if self.tax_calc is not None:
            gross_needed = self.gross_from_net(net_needed, existing_taxable_income=existing_taxable_income)
            return self.withdraw_gross(gross_needed, existing_taxable_income=existing_taxable_income)

        actual = min(self.balance, net_needed)
        self.balance -= actual
        return actual, actual


@dataclass
class UKGIAWrapper:
    """
    UK General Investment Account (GIA) wrapper.

    Tracks Section 104 pooled average cost basis to calculate realized capital gains,
    and models dividend yield and tax drag during compounding.
    """

    name: str
    balance: float = 0.0
    cost_basis: float = 0.0

    @property
    def unrealized_gain(self) -> float:
        """Current unrealized capital gain."""
        return max(0.0, self.balance - self.cost_basis)

    def grow(
        self,
        growth_rate: float,
        dividend_yield: float = 0.0,
        dividend_tax_rate: float = 0.0,
    ) -> float:
        """
        Applies asset price growth and reinvested dividends net of dividend tax drag.

        Returns total net growth added to the account.
        """
        cap_growth = self.balance * growth_rate

        gross_div = self.balance * dividend_yield
        net_div = gross_div * (1.0 - dividend_tax_rate)

        total_gain = cap_growth + net_div
        self.balance += total_gain

        # Reinvested net dividends increase the pooled cost basis
        self.cost_basis += net_div
        return total_gain

    def deposit(self, amount: float) -> float:
        """Deposits new capital, increasing both balance and cost basis."""
        if amount <= 0.0:
            return 0.0
        self.balance += amount
        self.cost_basis += amount
        return amount

    def withdraw(self, amount: float) -> tuple[float, float]:
        """
        Withdraws funds, reducing pooled Section 104 cost basis proportionally.

        Returns: (actual_amount_withdrawn, realized_capital_gain)
        """
        if amount <= 0.0 or self.balance <= 0.0:
            return 0.0, 0.0

        actual = min(self.balance, amount)

        # Calculate proportional realized gain
        if self.balance > self.cost_basis:
            gain_ratio = (self.balance - self.cost_basis) / self.balance
            realized_gain = actual * gain_ratio
        else:
            realized_gain = 0.0

        # Deplete cost basis proportionally
        basis_ratio = self.cost_basis / self.balance if self.balance > 0 else 1.0
        basis_reduction = actual * basis_ratio

        self.balance -= actual
        self.cost_basis = max(0.0, self.cost_basis - basis_reduction)

        return actual, realized_gain


@dataclass
class UKOffsetMortgageWrapper:
    """
    UK Offset Mortgage liability wrapper linked to an offset cash account.

    Interest is charged purely on the net liability:
    effective_debt = max(0.0, principal - linked_cash.balance).
    """

    name: str
    balance: float = 0.0
    interest_rate: float = 0.05
    linked_cash: BalanceHolder | None = None

    @property
    def net_liability(self) -> float:
        """Net interest-bearing balance after accounting for offset cash."""
        offset = self.linked_cash.balance if self.linked_cash is not None else 0.0
        return max(0.0, self.balance - offset)

    def step_interest(self) -> float:
        """
        Calculates interest for the period based on net liability and adds it to the debt balance.

        Returns the interest charged.
        """
        interest = self.net_liability * self.interest_rate
        self.balance += interest
        return interest

    def repay_principal(self, amount: float) -> float:
        """Directly repays debt principal. Returns actual principal repaid."""
        if amount <= 0.0:
            return 0.0
        actual = min(self.balance, amount)
        self.balance -= actual
        return actual

    def step_payment(self, scheduled_payment: float) -> tuple[float, float]:
        """
        Executes a scheduled periodic payment.
        Interest on net liability is paid first; any remainder reduces principal.

        Returns: (interest_paid, principal_repaid)
        """
        if scheduled_payment <= 0.0:
            interest = self.step_interest()
            return 0.0, 0.0

        interest = self.net_liability * self.interest_rate

        if scheduled_payment >= interest:
            interest_paid = interest
            excess = scheduled_payment - interest
            principal_repaid = min(self.balance, excess)
            self.balance -= principal_repaid
            return interest_paid, principal_repaid

        # Underpayment: payment does not cover full interest
        interest_paid = scheduled_payment
        unpaid_interest = interest - scheduled_payment
        self.balance += unpaid_interest
        return interest_paid, 0.0
