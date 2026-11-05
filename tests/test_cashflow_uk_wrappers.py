"""
Tests for beancount_blue.cashflow.uk.uk_wrappers
"""

import pytest

from beancount_blue.cashflow.uk.uk_tax import UKIncomeTaxCalculator
from beancount_blue.cashflow.uk.uk_wrappers import (
    UKGIAWrapper,
    UKISAWrapper,
    UKOffsetMortgageWrapper,
    UKSIPPWrapper,
)


def test_uk_isa_wrapper_mechanics():
    isa = UKISAWrapper(name="Test ISA", balance=10_000.0, annual_allowance=20_000.0)

    # Growth
    growth = isa.grow(0.05)
    assert growth == pytest.approx(500.0)
    assert isa.balance == pytest.approx(10_500.0)

    # Deposit with allowance limit
    dep1 = isa.deposit(15_000.0)
    assert dep1 == 15_000.0
    assert isa.balance == pytest.approx(25_500.0)
    assert isa.allowance_remaining == 5_000.0

    # Over-deposit is capped by remaining allowance
    dep2 = isa.deposit(10_000.0)
    assert dep2 == 5_000.0
    assert isa.balance == pytest.approx(30_500.0)
    assert isa.allowance_remaining == 0.0

    # Reset allowance
    isa.reset_annual_allowance()
    assert isa.allowance_remaining == 20_000.0

    # Withdrawal
    withdrawn = isa.withdraw(5_000.0)
    assert withdrawn == 5_000.0
    assert isa.balance == pytest.approx(25_500.0)


def test_uk_sipp_wrapper_age_gate_and_tax_withholding():
    tax_calc = UKIncomeTaxCalculator()
    sipp = UKSIPPWrapper(
        name="Test SIPP",
        balance=100_000.0,
        access_age=57,
        birth_year=1970,
        tax_calc=tax_calc,
    )

    # Age gate
    assert not sipp.is_accessible(2026)  # Age 56
    assert sipp.is_accessible(2027)  # Age 57
    assert sipp.is_accessible(2033)  # Age 63

    # Compounding
    sipp.grow(0.04)
    assert sipp.balance == pytest.approx(104_000.0)

    # Net withdrawal: request £16,000 net when there is other income of £40,000
    # Between 40k and 50.27k (basic rate 20%), above 50.27k (higher rate 40%)
    net_got, gross_depleted = sipp.withdraw_net(16_000.0, existing_taxable_income=40_000.0)

    assert net_got == pytest.approx(16_000.0, abs=0.1)
    assert gross_depleted > 16_000.0  # More gross balance must be removed to cover tax
    assert sipp.balance == pytest.approx(104_000.0 - gross_depleted)


def test_uk_gia_wrapper_cost_basis_and_gains():
    gia = UKGIAWrapper(name="Dealing GIA", balance=100_000.0, cost_basis=80_000.0)

    # Unrealized gain: 100k - 80k = 20k (20% of balance)
    assert gia.unrealized_gain == 20_000.0

    # Growth with dividend yield and dividend tax drag (e.g. 3% yield with 33.75% tax)
    # Price growth 4% = £4,000
    # Gross dividend 3% = £3,000. Net dividend = 3,000 * (1 - 0.3375) = £1,987.50
    # Total growth = £5,987.50
    growth = gia.grow(growth_rate=0.04, dividend_yield=0.03, dividend_tax_rate=0.3375)
    assert growth == pytest.approx(5_987.50)
    assert gia.balance == pytest.approx(105_987.50)
    # Cost basis increased by net reinvested dividend
    assert gia.cost_basis == pytest.approx(81_987.50)

    # Deposit
    gia.deposit(10_000.0)
    assert gia.balance == pytest.approx(115_987.50)
    assert gia.cost_basis == pytest.approx(91_987.50)

    # Withdrawal: proportional depletion of gain and cost basis
    bal_before = gia.balance
    basis_before = gia.cost_basis
    expected_gain_ratio = (bal_before - basis_before) / bal_before

    withdrawn, realized_gain = gia.withdraw(20_000.0)
    assert withdrawn == 20_000.0
    assert realized_gain == pytest.approx(20_000.0 * expected_gain_ratio)
    assert gia.balance == pytest.approx(bal_before - 20_000.0)
    # Basis reduced proportionally
    assert gia.cost_basis == pytest.approx(basis_before * (1.0 - 20_000.0 / bal_before))


def test_uk_offset_mortgage_wrapper_interest_and_payments():
    cash = UKISAWrapper(name="Offset Cash", balance=50_000.0)
    mortgage = UKOffsetMortgageWrapper(
        name="Offset Mortgage",
        balance=200_000.0,
        interest_rate=0.05,
        linked_cash=cash,
    )

    # Net liability = 200k - 50k = 150k
    assert mortgage.net_liability == 150_000.0

    # Scheduled payment: £15,000
    # Interest on net liability = 150,000 * 0.05 = £7,500
    # Principal reduction = 15,000 - 7,500 = £7,500
    interest_paid, principal_repaid = mortgage.step_payment(15_000.0)
    assert interest_paid == 7_500.0
    assert principal_repaid == 7_500.0
    assert mortgage.balance == 192_500.0

    # When offset cash fully equals debt: £0 interest!
    cash.balance = 200_000.0
    assert mortgage.net_liability == 0.0

    interest_paid, principal_repaid = mortgage.step_payment(10_000.0)
    assert interest_paid == 0.0
    assert principal_repaid == 10_000.0
    assert mortgage.balance == 182_500.0


def test_uk_sipp_wrapper_ufpls_and_basic_rate_headroom():
    tax_calc = UKIncomeTaxCalculator()
    sipp = UKSIPPWrapper(
        name="Retirement SIPP",
        balance=500_000.0,
        access_age=57,
        birth_year=1970,
        tax_calc=tax_calc,
    )

    # 1. Zero other income: Headroom before £50,270 higher rate limit
    # With 25% tax-free, taxable element is 75%: 50,270 / 0.75 = 67,026.67
    gross_headroom = sipp.basic_rate_gross_headroom(existing_taxable_income=0.0)
    assert gross_headroom == pytest.approx(50_270.0 / 0.75, abs=0.01)

    # Net capacity delivered at this basic rate threshold
    # Taxable = 50,270. Personal allowance 12,570. Tax = 37,700 * 0.20 = 7,540.
    # Net = 67,026.67 - 7,540 = 59,486.67
    net_capacity = sipp.basic_rate_net_capacity(existing_taxable_income=0.0)
    assert net_capacity == pytest.approx(59_486.67, abs=1.0)

    # 2. With state pension of £11,500
    # Taxable room = 50,270 - 11,500 = 38,770. Gross headroom = 38,770 / 0.75 = 51,693.33
    gross_sp = sipp.basic_rate_gross_headroom(existing_taxable_income=11_500.0)
    assert gross_sp == pytest.approx(38_770.0 / 0.75, abs=0.01)

    net_sp = sipp.basic_rate_net_capacity(existing_taxable_income=11_500.0)
    # SIPP Taxable = 38,770. Total taxable = 50,270. Total tax = 7,540. Tax on SP = 0.
    # SIPP tax = 7,540. Net from SIPP = 51,693.33 - 7,540 = 44,153.33
    assert net_sp == pytest.approx(44_153.33, abs=1.0)

    # 3. Withdraw net amount with UFPLS
    net_got, gross_depleted = sipp.withdraw_net(30_000.0, existing_taxable_income=11_500.0)
    assert net_got == pytest.approx(30_000.0, abs=0.1)
    assert gross_depleted > 30_000.0
    assert sipp.balance == pytest.approx(500_000.0 - gross_depleted)
    assert sipp.pcls_allowance_remaining < 268_275.0
