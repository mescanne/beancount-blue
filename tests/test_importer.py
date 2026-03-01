import datetime
import unittest
from decimal import Decimal

from beancount.core.amount import Amount
from beancount.core.data import Balance, Posting, Transaction, new_metadata
from beancount.core.flags import FLAG_OKAY

from beancount_blue.importer.importer import ImportedTransaction, imported_to_beancount


class TestImporter(unittest.TestCase):
    def test_empty_import(self):
        self.assertEqual(imported_to_beancount([]), [])

    def test_mixed_currencies(self):
        imported = [
            ImportedTransaction(
                id="1",
                date=datetime.date(2023, 1, 1),
                settled=True,
                amount=Decimal("10.00"),
                currency="USD",
                account="Assets:Bank",
            ),
            ImportedTransaction(
                id="2",
                date=datetime.date(2023, 1, 2),
                settled=True,
                amount=Decimal("20.00"),
                currency="EUR",
                account="Assets:Bank",
            ),
        ]
        with self.assertRaisesRegex(Exception, "invalid mixed currencies"):
            imported_to_beancount(imported)

    def test_single_transaction_no_existing(self):
        imported = [
            ImportedTransaction(
                id="tx1",
                date=datetime.date(2023, 1, 1),
                settled=True,
                amount=Decimal("100.00"),
                currency="GBP",
                account="Assets:Bank",
                payee="Store",
                narration="Groceries",
                meta={"custom": "val"},
            )
        ]

        result = imported_to_beancount(imported)

        self.assertEqual(len(result), 2)

        tx = result[0]
        self.assertIsInstance(tx, Transaction)
        self.assertEqual(tx.date, datetime.date(2023, 1, 1))
        self.assertEqual(tx.payee, "Store")
        self.assertEqual(tx.narration, "Groceries")
        self.assertEqual(tx.links, frozenset(["tx1"]))
        self.assertEqual(tx.meta["custom"], "val")
        self.assertEqual(tx.meta["vers"], "1")

        self.assertEqual(len(tx.postings), 1)
        p1 = tx.postings[0]
        self.assertEqual(p1.account, "Assets:Bank")
        self.assertEqual(p1.units, Amount(Decimal("100.00"), "GBP"))

        bal = result[1]
        self.assertIsInstance(bal, Balance)
        self.assertEqual(bal.date, datetime.date(2023, 1, 2))
        self.assertEqual(bal.account, "Assets:Bank")
        self.assertEqual(bal.amount, Amount(Decimal("100.00"), "GBP"))

    def test_single_transaction_with_counter_account(self):
        imported = [
            ImportedTransaction(
                id="tx1",
                date=datetime.date(2023, 1, 1),
                settled=True,
                amount=Decimal("-50.00"),
                currency="GBP",
                account="Assets:Bank",
                counter_account="Expenses:Food",
            )
        ]

        result = imported_to_beancount(imported)

        self.assertEqual(len(result), 2)

        tx = result[0]
        self.assertIsInstance(tx, Transaction)
        self.assertEqual(len(tx.postings), 2)

        self.assertEqual(tx.postings[0].account, "Expenses:Food")
        self.assertEqual(tx.postings[0].units, Amount(Decimal("50.00"), "GBP"))

        self.assertEqual(tx.postings[1].account, "Assets:Bank")
        self.assertEqual(tx.postings[1].units, Amount(Decimal("-50.00"), "GBP"))

    def test_existing_transaction_deduplication(self):
        existing = [
            Transaction(
                meta=new_metadata("file.beancount", 10, {"id": "tx1", "ver": "1"}),
                date=datetime.date(2023, 1, 1),
                flag=FLAG_OKAY,
                payee="Store",
                narration="",
                tags=frozenset(),
                links=frozenset(["tx1"]),
                postings=[Posting("Assets:Bank", Amount(Decimal("100.00"), "GBP"), None, None, None, None)],
            )
        ]

        imported = [
            ImportedTransaction(
                id="tx1",
                date=datetime.date(2023, 1, 1),
                settled=True,
                amount=Decimal("100.00"),
                currency="GBP",
                account="Assets:Bank",
            )
        ]

        result = imported_to_beancount(imported, existing=existing)

        self.assertEqual(len(result), 0)

    def test_existing_transaction_amount_change(self):
        existing = [
            Transaction(
                meta=new_metadata("file.beancount", 10, {"id": "tx1", "ver": "1"}),
                date=datetime.date(2023, 1, 1),
                flag=FLAG_OKAY,
                payee="Store",
                narration="",
                tags=frozenset(),
                links=frozenset(["tx1"]),
                postings=[Posting("Assets:Bank", Amount(Decimal("100.00"), "GBP"), None, None, None, None)],
            )
        ]

        imported = [
            ImportedTransaction(
                id="tx1",
                date=datetime.date(2023, 1, 1),
                settled=True,
                amount=Decimal("120.00"),
                currency="GBP",
                account="Assets:Bank",
            )
        ]

        result = imported_to_beancount(imported, existing=existing)

        self.assertEqual(len(result), 2)

        tx = result[0]
        self.assertIsInstance(tx, Transaction)
        self.assertEqual(tx.meta["vers"], "2")
        self.assertEqual(tx.postings[0].account, "Assets:Bank")
        self.assertEqual(tx.postings[0].units, Amount(Decimal("20.00"), "GBP"))

        bal = result[1]
        self.assertIsInstance(bal, Balance)
        self.assertEqual(bal.amount, Amount(Decimal("120.00"), "GBP"))

    def test_balance_date_with_unsettled_transactions(self):
        imported = [
            ImportedTransaction(
                id="tx1",
                date=datetime.date(2023, 1, 1),
                settled=True,
                amount=Decimal("100.00"),
                currency="GBP",
                account="Assets:Bank",
            ),
            ImportedTransaction(
                id="tx2",
                date=datetime.date(2023, 1, 3),
                settled=False,
                amount=Decimal("50.00"),
                currency="GBP",
                account="Assets:Bank",
            ),
        ]

        result = imported_to_beancount(imported)

        self.assertEqual(len(result), 3)

        balances = [r for r in result if isinstance(r, Balance)]
        self.assertEqual(len(balances), 1)
        bal = balances[0]

        self.assertEqual(bal.date, datetime.date(2023, 1, 3))
        self.assertEqual(bal.amount, Amount(Decimal("100.00"), "GBP"))
