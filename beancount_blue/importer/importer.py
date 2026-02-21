import datetime
import logging
import os
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal

from beancount.core.amount import Amount
from beancount.core.data import Balance, Directive, Posting, Transaction, new_metadata
from beancount.core.flags import FLAG_OKAY

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


@dataclass
class ImportedTransaction:
    """Imported Transactions"""

    id: str
    date: datetime.date
    settled: bool
    amount: Decimal
    currency: str
    account: str
    counter_account: str | None = None
    narration: str | None = None
    payee: str | None = None
    category: str | None = None
    meta: dict[str, str] = field(default_factory=dict)


# Not sure if this is used.
def imported_to_beancount(
    imported: list[ImportedTransaction], existing: list[Directive] | None = None
) -> list[Directive]:

    # If nothing imported, nothing to do
    if not len(imported):
        return []

    if not existing:
        existing = []

    # Check currency are all the same
    currencies = {str(t.currency) for t in imported}
    if len(currencies) != 1:
        raise Exception(f"invalid mixed currencies, found: {', '.join(currencies)}")
    currency = next(iter(currencies))

    # Index existing transactions by links and meta 'id' key
    existing_transactions: dict[str, list[Transaction]] = defaultdict(list)
    for t in existing:
        if not isinstance(t, Transaction):
            continue
        for i in t.links:
            existing_transactions[i].append(t)
        if "id" in t.meta:
            existing_transactions[t.meta["id"]].append(t)

    log.info(
        "Importing %d transactions with %d pre-existing and %d pre-existing with IDs, currency %s",
        len(imported),
        len(existing),
        len(existing_transactions),
        currency,
    )

    # Find all new transactions (adjusted or original)
    output_trans: list[Directive] = []
    for t in imported:
        now_amount = t.amount

        prev = existing_transactions.get(t.id)
        if prev:
            # Sort decreasing by version (if any)
            prev.sort(reverse=True, key=lambda f: int(f.meta.get("ver", "1")))

            # Find total price so far (if any)
            now_amount = now_amount - sum(
                p.units.number
                for e in prev
                for p in e.postings
                if (p.account == t.account and p.units and p.units.number)
            )

        # If price is now zero, then return (nothing to adjust!)
        if now_amount == Decimal(0):
            continue

        new_trans = Transaction(
            meta=new_metadata(
                "",
                100,
                t.meta
                | {
                    "vers": str(len(prev) + 1) if prev else "1",
                },
            ),
            date=t.date,
            flag=FLAG_OKAY,
            payee=(prev[0].payee if prev else t.payee),
            narration=t.narration,
            tags=frozenset(),
            links=frozenset([t.id]),
            postings=[
                Posting(
                    t.account,
                    Amount(
                        now_amount,
                        t.currency,
                    ),
                    None,
                    None,
                    None,
                    None,
                )
            ],
        )

        # Apply counter account right away if possible
        if t.counter_account:
            new_trans.postings.insert(
                0,
                Posting(
                    t.counter_account,
                    Amount(
                        Decimal(-1 * now_amount),
                        t.currency,
                    ),
                    None,
                    None,
                    None,
                    None,
                ),
            )

        output_trans.append(new_trans)

    log.info("With importing %d transactions, non-zero balances new transactions %d", len(imported), len(output_trans))

    # Sort by date
    output_trans.sort(key=lambda t: t.date)

    # Set of all accounts being updated
    accounts = set([t.account for t in imported] + [t.counter_account for t in imported if t.counter_account])

    for account in accounts:
        # Find last date for settled transactions
        unsettled_dates = [
            t.date
            for t in imported
            if not t.settled and t.amount != Decimal(0) and (t.account == account or t.counter_account == account)
        ]
        if unsettled_dates:
            new_bals_date = min(unsettled_dates)
            log.info("New balance date, based on mix settled/unsettled transactions: %s", new_bals_date)
        else:
            new_bals_date = max(t.date for t in imported)
            log.info("New balance date, based on only settled transactions: %s", new_bals_date)

        last_balance_date = _find_last_balance(existing, account)
        if last_balance_date and new_bals_date <= last_balance_date:
            log.info("skipping balance for %s as no more settled days", account)
            continue
        output_trans.extend(_generate_balance_entries(existing + output_trans, account, new_bals_date))

    return output_trans


def _find_last_balance(entries: list[Directive], account: str) -> date | None:
    existing_bals = [e for e in entries if isinstance(e, Balance) and e.account == account]
    if not existing_bals:
        return None

    return max(e.date for e in existing_bals)


def _generate_balance_entries(entries: list[Directive], account: str, asof_date: date) -> list[Directive]:
    balance = defaultdict[str, Decimal](Decimal)
    output_trans: list[Directive] = []

    # Calculate the implied balance
    for entry in entries:
        if not isinstance(entry, Transaction):
            continue
        if entry.date >= asof_date:
            continue
        for p in entry.postings:
            if p.account == account and p.units and p.units.number:
                balance[p.units.currency] += p.units.number

    # Generate the balance entries
    for ccy, bal in balance.items():
        output_trans.append(
            Balance(
                new_metadata("somepath", 100),
                asof_date,
                account,
                Amount(bal, ccy),
                None,
                None,
            )
        )

    return output_trans
