from __future__ import annotations

import json
import logging
import os
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Any, final, override
from uuid import UUID

import httpx
from pydantic import BaseModel, Field

from .delta_importer import APIImporter
from .importer import ImportedTransaction

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))

BASE_URL = "https://api.starlingbank.com"


class Currency(str, Enum):
    GBP = "GBP"
    EUR = "EUR"
    USD = "USD"


class CurrencyAndAmount(BaseModel):
    """
    Standard representation of monetary value in the API.
    'minorUnits' is the smallest unit (e.g., pence for GBP).
    """

    currency: Currency
    minorUnits: int = Field(..., description="Amount in minor units (e.g., 100 = £1.00)")


class AccountV2(BaseModel):
    """
    Represents a Starling Bank account (V2).
    """

    accountUid: UUID
    accountType: str
    defaultCategory: UUID
    currency: Currency
    createdAt: datetime
    name: str


class AccountsResponse(BaseModel):
    accounts: list[AccountV2]


class FeedItemStatus(str, Enum):
    UPCOMING = "UPCOMING"
    PENDING = "PENDING"
    REVERSED = "REVERSED"
    SETTLED = "SETTLED"
    DECLINED = "DECLINED"
    REFUNDED = "REFUNDED"
    RETRYING = "RETRYING"
    ACCOUNT_CHECK = "ACCOUNT_CHECK"


class FeedItemSource(str, Enum):
    FASTER_PAYMENTS_IN = "FASTER_PAYMENTS_IN"
    FASTER_PAYMENTS_OUT = "FASTER_PAYMENTS_OUT"
    FASTER_PAYMENTS_REVERSAL = "FASTER_PAYMENTS_REVERSAL"
    DIRECT_DEBIT = "DIRECT_DEBIT"
    DIRECT_DEBIT_DISPUTE = "DIRECT_DEBIT_DISPUTE"
    DIRECT_CREDIT = "DIRECT_CREDIT"
    INTERNAL_TRANSFER = "INTERNAL_TRANSFER"
    MASTER_CARD = "MASTER_CARD"
    SEPA = "SEPA"
    STARLING_PAY_STRIPE = "STARLING_PAY_STRIPE"
    ON_US_PAY_ME = "ON_US_PAY_ME"


class Direction(str, Enum):
    IN = "IN"
    OUT = "OUT"


class FeedItem(BaseModel):
    feedItemUid: UUID
    categoryUid: UUID
    amount: CurrencyAndAmount
    sourceAmount: CurrencyAndAmount
    direction: Direction
    updatedAt: datetime
    transactionTime: datetime
    settlementTime: datetime | None = None
    source: FeedItemSource
    status: FeedItemStatus
    counterPartyUid: UUID | None = None
    counterPartyName: str
    reference: str | None = None
    spendingCategory: str | None = None
    transactingApplicationUserUid: UUID | None = None
    userNote: str | None = None
    counterPartySubEntityIdentifier: str | None = None
    counterPartySubEntitySubIdentifier: str | None = None


class FeedItemsResponse(BaseModel):
    feedItems: list[FeedItem]


class StarlingData(BaseModel):
    accounts: dict[UUID, AccountV2] = Field(default_factory=dict)
    feed_items: dict[UUID, FeedItem] = Field(default_factory=dict)
    transactions_by_account: dict[UUID, list[UUID]] = Field(default_factory=dict)


def cleanup_string(s: str) -> str:
    s = s.strip()
    s = s.replace("_", " ")
    s = "".join([w.capitalize() for w in s.split(" ") if not w.isdigit()])
    s = "".join([w for w in s if w.isalnum()])
    return s


class StarlingImporter(APIImporter[StarlingData]):
    personal_access_token: str = Field(..., description="Starling Personal Access Token")
    since_date: str | None = Field(None, description="Fetch transactions since this date.")
    account_map: str = Field(..., description="Map of account UIDs to Beancount account names.")
    spending_category_map: str = Field(
        default="{}", description="Map of spending categories to Beancount account names."
    )
    faster_payments_map: str = Field(
        default="{}", description="Map of faster payment identifiers to Beancount account names."
    )
    user_map: str = Field(default="{}", description="Map of user UIDs to names.")

    @classmethod
    def name(cls) -> str:
        return "starling"

    def _get_counter_account(self, item: FeedItem, account_name: str) -> str | None:
        spending_category_map = json.loads(self.spending_category_map)
        faster_payments_map = json.loads(self.faster_payments_map)

        # Try faster payments
        if (
            item.source in [FeedItemSource.FASTER_PAYMENTS_IN, FeedItemSource.FASTER_PAYMENTS_OUT]
            and item.counterPartySubEntityIdentifier
            and item.counterPartySubEntitySubIdentifier
        ):
            acct = f"{item.counterPartySubEntityIdentifier}-{item.counterPartySubEntitySubIdentifier}"
            if acct in faster_payments_map:
                return faster_payments_map[acct]

        # Try internal transfers
        if item.source == FeedItemSource.INTERNAL_TRANSFER:
            return f"{account_name}:{cleanup_string(item.counterPartyName)}"

        # Try On Us Pay Me
        if item.source == FeedItemSource.ON_US_PAY_ME:
            return "Assets:ZeroSumTransfer"

        # Try spending category
        if item.spendingCategory and item.spendingCategory in spending_category_map:
            return spending_category_map[item.spendingCategory]

        # Default category
        if item.spendingCategory:
            cp = spending_category_map.get("DEFAULT", "Expenses:Unknown:<CATEGORY>")
            return cp.replace("<CATEGORY>", cleanup_string(item.spendingCategory))

        return None

    @final
    @override
    def refresh(self, state: StarlingData) -> None:
        headers = {"Authorization": f"Bearer {self.personal_access_token}"}
        with httpx.Client(headers=headers, base_url=BASE_URL) as client:
            # Get accounts
            accounts_response = client.get("/api/v2/accounts")
            _ = accounts_response.raise_for_status()
            accounts = AccountsResponse.model_validate(accounts_response.json()).accounts
            for account in accounts:
                state.accounts[account.accountUid] = account

            # Get transactions for each account
            account_map = {UUID(k): v for k, v in json.loads(self.account_map).items()}
            for account_uid in account_map:
                params: dict[str, str] = {}
                if self.since_date:
                    params["changesSince"] = date.fromisoformat(self.since_date).isoformat() + "T00:00:00.000Z"

                feed_response = client.get(f"/api/v2/feed/account/{account_uid}/settled-transactions", params=params)
                _ = feed_response.raise_for_status()
                feed_items = FeedItemsResponse.model_validate(feed_response.json()).feedItems

                if account_uid not in state.transactions_by_account:
                    state.transactions_by_account[account_uid] = []

                for item in feed_items:
                    state.feed_items[item.feedItemUid] = item
                    if item.feedItemUid not in state.transactions_by_account[account_uid]:
                        state.transactions_by_account[account_uid].append(item.feedItemUid)

    @final
    @override
    def extract(self, state: StarlingData) -> list[ImportedTransaction]:
        transactions: list[ImportedTransaction] = []

        user_map = {UUID(k): v for k, v in json.loads(self.user_map).items()}
        account_map = {UUID(k): v for k, v in json.loads(self.account_map).items()}

        # Create a reverse map for efficient lookup
        feed_item_to_account: dict[UUID, UUID] = {}
        for account_uid, feed_item_uids in state.transactions_by_account.items():
            for feed_item_uid in feed_item_uids:
                feed_item_to_account[feed_item_uid] = account_uid

        for item in state.feed_items.values():
            amount = Decimal(item.amount.minorUnits) / 100
            if item.direction == Direction.OUT:
                amount = -amount

            account_uid = feed_item_to_account.get(item.feedItemUid)
            if not account_uid:
                log.warning(f"Could not find account for feed item {item.feedItemUid}")
                continue

            account_name = account_map.get(account_uid)
            if not account_name:
                log.warning(f"Could not find beancount account name for account {account_uid}")
                continue

            counter_account = self._get_counter_account(item, account_name)

            meta: dict[str, Any] = {
                "__source__": json.dumps(item.model_dump_json(), indent=2),
                "orig_payee": item.counterPartyName,
                "category": item.spendingCategory,
            }
            if item.settlementTime and item.transactionTime.date() != item.settlementTime.date():
                meta["transaction_date"] = item.transactionTime.date().isoformat()
            if item.transactingApplicationUserUid:
                user = user_map.get(item.transactingApplicationUserUid)
                if user:
                    meta["user"] = user
            if item.userNote:
                meta["note"] = item.userNote

            transactions.append(
                ImportedTransaction(
                    id=str(item.feedItemUid),
                    date=item.settlementTime.date() if item.settlementTime else item.transactionTime.date(),
                    settled=item.status == FeedItemStatus.SETTLED,
                    amount=amount,
                    currency=item.amount.currency.value,
                    account=account_name,
                    counter_account=counter_account,
                    narration=f"{item.counterPartyName} {item.reference or ''}".strip(),
                    payee=item.counterPartyName,
                    meta=meta,
                )
            )
        return transactions
