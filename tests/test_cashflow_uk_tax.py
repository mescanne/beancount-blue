"""
Tests for beancount_blue.cashflow.uk.uk_tax
"""

import pytest

from beancount_blue.cashflow.uk.uk_tax import (
    UKCapitalGainsCalculator,
    UKIncomeTaxCalculator,
)


def test_personal_allowance_taper():
    calc = UKIncomeTaxCalculator()

    # Under £100k: full allowance
    assert calc.effective_personal_allowance(50_000) == 12_570.0
    assert calc.effective_personal_allowance(100_000) == 12_570.0

    # £110k: loses £5,000 of allowance
    assert calc.effective_personal_allowance(110_000) == 7_570.0

    # £125,140: fully tapered to £0
    assert calc.effective_personal_allowance(125_140) == 0.0
    assert calc.effective_personal_allowance(200_000) == 0.0


def test_total_tax_bands():
    calc = UKIncomeTaxCalculator()

    # Under PA: £0 tax
    assert calc.total_tax(10_000) == 0.0
    assert calc.total_tax(12_570) == 0.0

    # Basic rate only: £30,000 gross
    # Taxable = 30,000 - 12,570 = 17,430 @ 20% = £3,486
    assert calc.total_tax(30_000) == pytest.approx(3_486.0)

    # Basic rate max: £50,270 gross
    # Taxable = 37,700 @ 20% = £7,540
    assert calc.total_tax(50_270) == pytest.approx(7_540.0)

    # Higher rate: £80,000 gross
    # Basic = £7,540. Higher = (80,000 - 50,270) @ 40% = 29,730 * 0.40 = £11,892
    # Total = 7,540 + 11,892 = £19,432
    assert calc.total_tax(80_000) == pytest.approx(19_432.0)


def test_marginal_tax_and_net_from_gross():
    calc = UKIncomeTaxCalculator()

    # If already earning £50,270 (top of basic rate), next £10k is taxed at 40%
    tax = calc.marginal_tax(10_000, existing_gross=50_270)
    assert tax == pytest.approx(4_000.0)

    net = calc.net_from_gross(10_000, existing_gross=50_270)
    assert net == pytest.approx(6_000.0)


def test_gross_from_net_inversion():
    calc = UKIncomeTaxCalculator()

    # Test exact inversion across various net targets and existing income baselines
    test_cases = [
        (10_000.0, 0.0),  # Below personal allowance
        (25_000.0, 0.0),  # Crosses into basic rate
        (40_000.0, 30_000.0),  # Crosses from basic into higher rate
        (60_000.0, 80_000.0),  # In taper region
        (5_000.0, 60_000.0),  # Pure 40% bracket
    ]

    for net_target, existing_gross in test_cases:
        gross_solved = calc.gross_from_net(net_target, existing_gross=existing_gross)
        net_actual = calc.net_from_gross(gross_solved, existing_gross=existing_gross)
        assert net_actual == pytest.approx(net_target, abs=0.05)


def test_uk_capital_gains_calculator():
    cgt = UKCapitalGainsCalculator(annual_exemption=3_000.0, basic_rate=0.18, higher_rate=0.24)

    # Gain under exemption
    assert cgt.tax_on_gain(2_500.0, is_higher_rate=True) == 0.0
    assert cgt.tax_on_gain(3_000.0, is_higher_rate=True) == 0.0

    # Higher rate: £10,000 gain -> £7,000 taxable @ 24% = £1,680
    assert cgt.tax_on_gain(10_000.0, is_higher_rate=True) == pytest.approx(1_680.0)

    # Basic rate: £10,000 gain -> £7,000 taxable @ 18% = £1,260
    assert cgt.tax_on_gain(10_000.0, is_higher_rate=False) == pytest.approx(1_260.0)

    # Partial unused exemption
    assert cgt.tax_on_gain(5_000.0, is_higher_rate=True, unused_exemption=1_000.0) == pytest.approx(960.0)
