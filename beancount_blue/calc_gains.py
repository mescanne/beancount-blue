"""Calculate capital gains."""

import ast
import datetime
from decimal import Decimal
from typing import Callable, NamedTuple, Optional

from beancount.core.amount import Amount
from beancount.core.data import Directive, Entries, Meta, Posting, Transaction
from beancount.core.inventory import Inventory
from beancount.core.number import ZERO
from beancount.core.position import CostSpec

__plugins__ = ["calc_gains"]


PostingID = tuple[int, int]


class Trade(NamedTuple):
    """A trade in a security."""

    postingId: PostingID
    balance: Decimal  # total units (before this trade)
    date: datetime.date  # date of trade
    units: Decimal  # units of trade (+/-)
    price: Decimal  # price of trade
    consideration: Decimal  # units * price
    realizing: bool  # whether units brings balance closer to zero


class GainsCalculatorError(NamedTuple):
    """An error that occurred during capital gains calculation."""

    source: Meta
    message: str
    entry: object


# Take in a list of trades and return a list of cost basis for all
# realizing trades.
def get_realizing_cost_consideration(trades: list[Trade]) -> list[Decimal]:
    """Calculate the average cost of a list of trades.

        This function implements the "average cost" method of calculating capital
        gains. It averages the cost of all lots purchased and uses that average
    cost
        to determine the gain or loss on a sale.

        Args:
            trades: A list of trades.

        Returns:
            A list of cost basis for all realizing trades.
    """

    total_units = Decimal(0)
    total_cost = Decimal(0)
    cost_consideration = []
    for _, trade in enumerate(trades):
        if trade.realizing:
            cost_consideration.append(trade.units * (total_cost / total_units))
        total_cost += trade.price * trade.units
        total_units += trade.units
    return cost_consideration


# Available methods
METHODS: dict[str, Callable[[list[Trade]], list[Decimal]]] = {
    "cost_avg": get_realizing_cost_consideration,
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

        if self.config.get("method", "") not in METHODS:
            raise ValueError(f"Account {self.account} has no valid method, mustbe one of {', '.join(METHODS.keys())}")  # noqa: TRY003

        self.method: Callable[[list[Trade]], list[Decimal]] = METHODS[self.config.get("method", "")]

        if "counterAccount" not in self.config:
            raise ValueError(f"Account {self.account} has no valid counter account")  # noqa: TRY003

        self.cacct: str = str(self.config["counterAccount"])

        self.lots_adjust = bool(self.config.get("lots_adjust", False))

    def process(self, entries: Entries):
        """Process the entries as configured.

        Args:
            entries: The set of entries
        """
        # Add in counteraccount configuration
        for trades in self.history.values():
            inventory = Inventory()
            adjs = self.method(trades)
            # if self.lots_adjust:
            #    print(f"Calculated cost consideration: {adjs}")
            for trade in trades:
                trans = entries[trade.postingId[0]]

                new_cost_consideration = adjs.pop(0) if trade.realizing else trade.price * trade.units

                # Liquidiate previous holdings
                liquidated_balance = Decimal(0)
                liquidated_cost = Decimal(0)
                if self.lots_adjust:
                    for pos in inventory.get_positions():
                        if not pos.cost or not pos.units.number or pos.units.number == ZERO:
                            continue
                        liquidated_cost += pos.cost.number * pos.units.number
                        liquidated_balance += pos.units.number
                        trans.postings.append(
                            Posting(self.account, -pos.units, pos.cost, None, None, None),
                        )
                    inventory = Inventory()

                # New cost basis after realizing trade - bring in a new holding
                trans.postings[trade.postingId[1]] = trans.postings[trade.postingId[1]]._replace(
                    units=trans.postings[trade.postingId[1]].units._replace(
                        number=liquidated_balance + trade.units,
                    ),
                    cost=trans.postings[trade.postingId[1]].cost._replace(
                        number=(new_cost_consideration / trade.units),
                        date=trans.date,
                    ),
                )
                inventory.add_position(trans.postings[trade.postingId[1]])

                # Calculate the counteramount
                camt = trade.price * trade.units
                camt -= (liquidated_balance + trade.units) * (new_cost_consideration / trade.units)
                camt += liquidated_cost
                if camt != Decimal(0):
                    trans.postings.append(
                        Posting(
                            account=self.cacct,
                            units=Amount(number=camt, currency=trans.postings[trade.postingId[1]].cost.currency),
                            cost=None,
                            price=None,
                            flag=None,
                            meta={"note": "full_adjustment" if self.lots_adjust else "part_adjust"},
                        )
                    )

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

        # Add the trade
        price = posting.cost.number_per if isinstance(posting.cost, CostSpec) else posting.cost.number
        if price is None:
            return f"cost {posting.cost} has no price!"

        self.history.setdefault(posting.units.currency, []).append(
            Trade(
                postingId=postingId,
                date=entry.date,
                balance=balance,
                units=posting.units.number,
                price=price,
                consideration=posting.units.number * price,
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

    # Apply adjustments to the entries
    new_entries = entries.copy()

    # Process accounts
    for account in accounts.values():
        account.process(new_entries)

    return new_entries, []
