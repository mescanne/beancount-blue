"""
Tests for beancount_blue.cashflow.extractor
"""

import pytest
from beancount.loader import load_string

from beancount_blue.cashflow.extractor import LedgerExtractor

SAMPLE_LEDGER = """
2020-01-01 open Assets:Bank:Current GBP
2020-01-01 open Assets:Investments:ISA GBP
2020-01-01 open Assets:Investments:Dealing USD
2020-01-01 open Liabilities:Mortgage GBP
2020-01-01 open Expenses:Living:Groceries GBP
2020-01-01 open Expenses:Living:Dining GBP
2020-01-01 open Equity:Opening

2020-01-01 price USD 0.80 GBP

2020-01-01 * "Opening Balance"
  Assets:Bank:Current            5,000.00 GBP
  Assets:Investments:ISA        25,000.00 GBP
  Assets:Investments:Dealing       100.00 USD
  Liabilities:Mortgage        -150,000.00 GBP
  Equity:Opening

2020-02-01 * "Supermarket"
  Expenses:Living:Groceries        300.00 GBP
  Assets:Bank:Current

2020-02-15 * "Restaurant"
  Expenses:Living:Dining           150.00 GBP
  Assets:Bank:Current
"""


def test_ledger_extractor_balances_and_prices():
    loaded = load_string(SAMPLE_LEDGER)
    extractor = LedgerExtractor(loaded)

    # Simple glob
    bank_bal = extractor.get_balance("Assets:Bank:*")
    # 5,000 - 300 - 150 = 4,550
    assert bank_bal == pytest.approx(4_550.0)

    # ISA
    isa_bal = extractor.get_balance("Assets:Investments:ISA")
    assert isa_bal == pytest.approx(25_000.0)

    # Dealing with currency conversion: 100 USD @ 0.80 GBP = 80.00 GBP
    dealing_bal = extractor.get_balance("Assets:Investments:Dealing", currency="GBP")
    assert dealing_bal == pytest.approx(80.0)

    # Combined regex
    inv_bal = extractor.get_balance(r"Assets:Investments:(ISA|Dealing)")
    assert inv_bal == pytest.approx(25_080.0)

    # Liability with abs_value
    mortgage_raw = extractor.get_balance("Liabilities:Mortgage", abs_value=False)
    assert mortgage_raw == pytest.approx(-150_000.0)

    mortgage_abs = extractor.get_balance("Liabilities:Mortgage", abs_value=True)
    assert mortgage_abs == pytest.approx(150_000.0)


def test_ledger_extractor_get_balances_dict():
    loaded = load_string(SAMPLE_LEDGER)
    extractor = LedgerExtractor(loaded)

    bals = extractor.get_balances(
        {
            "bank": "Assets:Bank:*",
            "isa": "Assets:Investments:ISA",
            "mortgage": "Liabilities:Mortgage",
        },
        abs_value=True,
    )

    assert bals["bank"] == pytest.approx(4_550.0)
    assert bals["isa"] == pytest.approx(25_000.0)
    assert bals["mortgage"] == pytest.approx(150_000.0)


def test_ledger_extractor_query_sum():
    loaded = load_string(SAMPLE_LEDGER)
    extractor = LedgerExtractor(loaded)

    # Sum all living expenses: 300 + 150 = 450
    bql = "SELECT sum(position) WHERE account ~ '^Expenses:Living'"
    total_living = extractor.query_sum(bql, currency="GBP")
    assert total_living == pytest.approx(450.0)
