"""Flexible capital gains calculator.

This plugin calculates capital gains on transactions. It is designed to be
flexible and can be configured to support various capital gains calculation
methods. By default, it supports averaging the cost of all lots (a "cost_avg"
method).

This is particularly useful for investment accounts where you need to track the
cost basis of your assets and calculate the gain or loss when you sell them.

Example configuration:

.. code-block:: beancount

    plugin "beancount_blue.calc_gains" "{
        'accounts': {
            'Assets:Investments:Broker': {
                'method': 'cost_avg',
                'counterAccount': 'Equity:Gains'
            }
        }
    }"

"""

import ast
import datetime
from decimal import Decimal
from typing import NamedTuple, Optional

from beancount.core.amount import Amount
from beancount.core.data import Directive, Entries, Meta, Posting, Transaction
from beancount.core.position import CostSpec

__plugins__ = ["calc_gains"]


PostingID = tuple[int, int]


class Trade(NamedTuple):
    """A trade in a security."""

    postingId: PostingID
    date: datetime.date
    units: Decimal
    price: Decimal
    realizing: bool


class Adjustment(NamedTuple):
    """An adjustment to a trade."""

    postingId: PostingID
    price: Decimal
    counterAmount: Decimal
    counterAccount: Optional[str]


class GainsCalculatorError(NamedTuple):
    """An error that occurred during capital gains calculation."""

    source: Meta
    message: str
    entry: object


def cost_avg(trades: list[Trade]) -> list[Adjustment]:
    """Calculate the average cost of a list of trades.

        This function implements the "average cost" method of calculating capital
        gains. It averages the cost of all lots purchased and uses that average
    cost
        to determine the gain or loss on a sale.

        Args:
            trades: A list of trades.

        Returns:
            A list of adjustments.
    """
    adjs = []
    total_units = Decimal(0)
    total_cost = Decimal(0)
    for _, trade in enumerate(trades):
        if trade.realizing:
            avg_cost_price = total_cost / total_units
            if trade.price != avg_cost_price:
                adjs.append(
                    Adjustment(
                        postingId=trade.postingId,
                        price=total_cost / total_units,
                        counterAmount=((trade.price * trade.units) - (avg_cost_price * trade.units)),
                        counterAccount=None,
                    )
                )
            total_cost += trade.units * avg_cost_price
        else:
            total_cost += trade.units * trade.price
        total_units += trade.units
    return adjs


# Available methods
METHODS = {
    "cost_avg": cost_avg,
}


class Account:
    """An account that holds securities."""

    def __init__(self, account: str, config: dict):
        """Initialize the account.

        Args:
            account: The name of the account.
            config: The configuration for the account.
        """
        self.account = account
        self.config = config
        self.cost_currency = {}
        self.history = {}
        self.last_balance = {}

    def process(self) -> list[Adjustment]:
        """Process the trades in the account.

        Returns:
            A list of adjustments.
        """
        adjustments = []

        method = METHODS.get(self.config.get("method", ""), None)
        if method is None:
            raise Exception(f"Account {self.account} has no valid method, mustbe one of {', '.join(METHODS.keys())}")  # noqa: TRY002, TRY003

        cacct = self.config.get("counterAccount", None)

        # Add in counteraccount configuration
        for trades in self.history.values():
            adjs = method(trades)
            adjustments.extend([a._replace(counterAccount=cacct) for a in adjs])

        return adjustments

    def add_posting(self, postingId: PostingID, entry: Transaction, posting: Posting) -> Optional[str]:
        """Add a posting to the account.

        Args:
            postingId: The ID of the posting.
            entry: The entry containing the posting.
            posting: The posting to add.

        Returns:
            An error message if there was an error, otherwise None.
        """
        if posting.cost is None:
            return f"posting on {entry.date} in {posting.account} has no cost"
        if posting.units is None or posting.units.number is None:
            return f"posting on {entry.date} in {posting.account} has no units"

        # Validate the cost currency for this asset
        asset_currency = posting.units.currency
        cost_currency = posting.cost.currency
        if asset_currency not in self.cost_currency:
            self.cost_currency[asset_currency] = cost_currency
        elif self.cost_currency[asset_currency] != cost_currency:
            return (
                f"account {self.account} has inconsistent cost currencies for "
                f"{asset_currency}: {self.cost_currency[asset_currency]} and {cost_currency}"
            )

        if posting.cost.date and posting.cost.date != entry.date:
            return f"cost date {posting.cost.date} is different from transaction date {entry.date}"

        # Get the last balance
        balance = self.last_balance.get(asset_currency, Decimal(0))

        # Determine if realizing
        # print(posting)
        if (balance > 0 and posting.units.number < 0) or (balance < 0 and posting.units.number > 0):
            realizing = True
        else:
            realizing = False

        # TODO: Validate cost date versus transaction date

        # Add the trade
        price = posting.cost.number_per if isinstance(posting.cost, CostSpec) else posting.cost.number
        if price is None:
            return f"cost {posting.cost} has no price!"

        self.history.setdefault(posting.units.currency, []).append(
            Trade(
                postingId=postingId,
                date=entry.date,
                units=posting.units.number,
                price=price,
                realizing=realizing,
            )
        )

        # Update the last balance
        self.last_balance[posting.units.currency] = balance + posting.units.number

        return None


def calc_gains(entries: Entries, _, config_str: str) -> tuple[list[Directive], list[GainsCalculatorError]]:
    """Calculate capital gains for UK tax purposes.

    Args:
        entries: A list of beancount entries.
        config_str: A string containing the configuration for the plugin.

    Returns:
        A tuple of the modified entries and a list of errors.
    """
    accounts = {}

    config = ast.literal_eval(config_str)
    for acct, acct_config in config.get("accounts", {}).items():
        accounts[acct] = Account(acct, acct_config)

    errors = []

    # Collect all of the trading histories
    for transId, entry in enumerate(entries):
        if not isinstance(entry, Transaction):
            continue
        for postId, post in enumerate(entry.postings):
            if post.account not in accounts:
                continue
            if not post.cost and not post.price:
                continue
            if not post.cost:
                errors.append("missing cost?!?")
                continue
            accounts[post.account].add_posting((transId, postId), entry, post)

    # Collect adjustments for accounts
    adjs = []
    for account in accounts.values():
        adjs.extend(account.process())

    # Apply adjustments to the entries
    new_entries = entries.copy()
    errors = []
    for adj in adjs:
        trans = new_entries[adj.postingId[0]]

        # If there is no counterAccount, we need to report an error
        if adj.counterAccount is None:
            errors.append(
                GainsCalculatorError(trans.meta, f"Calculated cost price is {adj.price}, not matching", trans)
            )
            continue

        # Adjust the price
        trans.postings[adj.postingId[1]] = trans.postings[adj.postingId[1]]._replace(
            cost=trans.postings[adj.postingId[1]].cost._replace(
                number=adj.price,
            )
        )

        # Create the adjustment posting
        trans.postings.append(
            Posting(
                account=adj.counterAccount,
                units=Amount(number=adj.counterAmount, currency=trans.postings[adj.postingId[1]].cost.currency),
                cost=None,
                price=None,
                flag=None,
                meta={"note": "adjusted"},
            )
        )

    return new_entries, errors
