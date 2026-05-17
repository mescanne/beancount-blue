from __future__ import annotations

import logging
import os
from datetime import date, datetime
from decimal import Decimal
from enum import StrEnum
from typing import Any, Literal, final, override
from uuid import UUID

import httpx
from pydantic import BaseModel, Field, SecretStr

from .delta_importer import APIImporter
from .importer import ImportedTransaction

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))

BASE_URL = "https://api.starlingbank.com"


class CurrencyAndAmount(BaseModel):
    """
    Standard representation of monetary value in the API.
    'minorUnits' is the smallest unit (e.g., pence for GBP).
    """

    currency: str
    minorUnits: int = Field(..., description="Amount in minor units (e.g., 100 = £1.00)")


class AccountV2(BaseModel):
    """
    Represents a Starling Bank account (V2).
    """

    accountUid: UUID
    accountType: str
    defaultCategory: UUID
    currency: str
    createdAt: datetime
    name: str


class AccountsResponse(BaseModel):
    accounts: list[AccountV2]


class BalanceResponse(BaseModel):
    effectiveBalance: CurrencyAndAmount
    clearedBalance: CurrencyAndAmount
    totalEffectiveBalance: CurrencyAndAmount
    totalClearedBalance: CurrencyAndAmount


class SavingsGoals(BaseModel):
    savingsGoalUid: UUID
    name: str
    target: CurrencyAndAmount | None = None
    totalSaved: CurrencyAndAmount | None = None
    savedPercentage: int | None = None
    sortOrder: int
    state: str


class SpendingSpace(BaseModel):
    name: str
    balance: CurrencyAndAmount
    cardAssociationUuid: UUID | None = None
    sortOrder: int
    spendingSpaceType: str
    state: str
    spaceUid: UUID


class SpacesResponse(BaseModel):
    savingsGoals: list[SavingsGoals]
    spendingSpaces: list[SpendingSpace]


class FeedItemStatus(StrEnum):
    UPCOMING = "UPCOMING"
    PENDING = "PENDING"
    REVERSED = "REVERSED"
    SETTLED = "SETTLED"
    DECLINED = "DECLINED"
    REFUNDED = "REFUNDED"
    RETRYING = "RETRYING"
    ACCOUNT_CHECK = "ACCOUNT_CHECK"


class FeedItemSource(StrEnum):
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


class Direction(StrEnum):
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
    source: str
    status: str
    counterPartyUid: UUID | None = None
    counterPartyName: str | None = None
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
    account_spending_spaces: dict[UUID, list[SpendingSpace]] = Field(default_factory=dict)
    account_savings_spaces: dict[UUID, list[SavingsGoals]] = Field(default_factory=dict)
    feed_items: dict[UUID, FeedItem] = Field(default_factory=dict)
    balances: dict[UUID, CurrencyAndAmount] = Field(default_factory=dict)


def cleanup_string(s: str | None) -> str:
    if not s:
        return "Unknown"
    s = s.strip()
    s = s.replace("_", " ")
    s = "".join([w.capitalize() for w in s.split(" ") if not w.isdigit()])
    s = "".join([w for w in s if w.isalnum()])
    return s


class StarlingImporter(APIImporter[StarlingData]):
    """
    ### Starling API Setup Instructions

    To sync your Starling account, you need to generate a Personal Access Token from the Starling Developer portal.

    1. **Log in:** Go to [developer.starlingbank.com](https://developer.starlingbank.com/) and create a developer account if you haven't already.
    2. **Connect your Bank Account:** Follow the prompts to link your actual Starling Bank account to your developer account. You will need the Starling app on your phone to approve this.
    3. **Create a Token:**
       - Navigate to **"Personal Access Tokens"** in the developer dashboard.
       - Click **"Create Token"**.
       - Give it a name (e.g., `Beancount Fava Sync`).
       - Ensure you grant it **read-only** scopes for `account`, `balance`, and `transaction` data. Do not grant payment or write scopes.
    4. **Copy the Token:** Once generated, copy the token immediately. You will not be able to see it again.
    5. **Configure Fava:** Paste this token into the `personal_access_token` field below.
    """

    importer_name: Literal["starling"] = "starling"  # pyright: ignore[reportIncompatibleVariableOverride]

    personal_access_token: SecretStr = Field(..., description="Starling Personal Access Token")
    # For API access updating
    since_date: str | None = Field(None, description="Fetch transactions since this date.")
    spending_category_map: dict[str, str] = Field(
        default_factory=dict, description="Map of spending categories to Beancount account names."
    )
    faster_payments_map: dict[str, str] = Field(
        default_factory=dict, description="Map of faster payment identifiers to Beancount account names."
    )
    user_map: dict[str, str] = Field(default_factory=dict, description="Map of user UIDs to names.")

    def _get_counter_account(self, item: FeedItem, account_name: str) -> str | None:
        # spending_category_map = self.spending_category_map
        # faster_payments_map = self.faster_payments_map

        # # Try faster payments
        # if (
        #     item.source in [FeedItemSource.FASTER_PAYMENTS_IN, FeedItemSource.FASTER_PAYMENTS_OUT]
        #     and item.counterPartySubEntityIdentifier
        #     and item.counterPartySubEntitySubIdentifier
        # ):
        #     acct = f"{item.counterPartySubEntityIdentifier}-{item.counterPartySubEntitySubIdentifier}"
        #     if acct in faster_payments_map:
        #         return faster_payments_map[acct]

        # Try internal transfers
        if item.source == FeedItemSource.INTERNAL_TRANSFER:
            return f"{account_name}:{cleanup_string(item.counterPartyName)}"

        # # Try On Us Pay Me
        # if item.source == FeedItemSource.ON_US_PAY_ME:
        #     return "Assets:ZeroSumTransfer"

        # # Try spending category
        # if item.spendingCategory and item.spendingCategory in spending_category_map:
        #     return spending_category_map[item.spendingCategory]

        # # Default category
        # if item.spendingCategory:
        #     cp = spending_category_map.get("DEFAULT", "Expenses:Unknown:<CATEGORY>")
        #     return cp.replace("<CATEGORY>", cleanup_string(item.spendingCategory))

        return None

    @final
    @override
    def refresh(self, state: StarlingData) -> None:
        headers = {"Authorization": f"Bearer {self.personal_access_token.get_secret_value()}"}
        with httpx.Client(headers=headers, base_url=BASE_URL) as client:
            # Get accounts
            accounts_response = client.get("/api/v2/accounts")
            _ = accounts_response.raise_for_status()
            accounts = AccountsResponse.model_validate(accounts_response.json()).accounts
            for account in accounts:
                state.accounts[account.accountUid] = account

                # Get balance
                balance_response = client.get(f"/api/v2/accounts/{account.accountUid}/balance")
                _ = balance_response.raise_for_status()
                bal = BalanceResponse.model_validate(balance_response.json())
                state.balances[account.accountUid] = bal.effectiveBalance

                # Get spaces
                space_response = client.get(f"/api/v2/account/{account.accountUid}/spaces")
                _ = space_response.raise_for_status()
                spaces = SpacesResponse.model_validate(space_response.json())
                state.account_spending_spaces[account.accountUid] = spaces.spendingSpaces
                state.account_savings_spaces[account.accountUid] = spaces.savingsGoals

                # Get list of categories
                categories = (
                    [account.defaultCategory]
                    + list(s.spaceUid for s in state.account_spending_spaces[account.accountUid])
                    + list(s.savingsGoalUid for s in state.account_savings_spaces[account.accountUid])
                )

                # Get feed items for default category and all spaces
                for category_uid in categories:
                    params: dict[str, str] = {}
                    if self.since_date:
                        params["changesSince"] = date.fromisoformat(self.since_date).isoformat() + "T00:00:00.000Z"
                    else:
                        params["changesSince"] = "1970-01-01T00:00:00.000Z"

                    feed_response = client.get(
                        f"/api/v2/feed/account/{account.accountUid}/category/{category_uid}",
                        params=params,
                        timeout=30,
                    )
                    _ = feed_response.raise_for_status()
                    feed_items = FeedItemsResponse.model_validate(feed_response.json()).feedItems

                    for item in feed_items:
                        state.feed_items[item.feedItemUid] = item

    @final
    @override
    def extract_available_balances(self, state: StarlingData) -> dict[str, tuple[Decimal, str]]:
        res: dict[str, tuple[Decimal, str]] = {}
        for accountUid, bal in state.balances.items():
            amount = Decimal(bal.minorUnits) / 100
            res[str(accountUid) + ":Main"] = (amount, bal.currency)

            for savingSpace in state.account_savings_spaces[accountUid]:
                if savingSpace.totalSaved:
                    res[str(accountUid) + ":" + savingSpace.name] = (
                        Decimal(savingSpace.totalSaved.minorUnits / 100),
                        savingSpace.totalSaved.currency,
                    )

            for spendingSpace in state.account_spending_spaces[accountUid]:
                res[str(accountUid) + ":" + spendingSpace.name] = (
                    Decimal(spendingSpace.balance.minorUnits / 100),
                    spendingSpace.balance.currency,
                )

        return res

    @final
    @override
    def extract(self, state: StarlingData) -> list[ImportedTransaction]:
        transactions: list[ImportedTransaction] = []

        # TODO: Friendly mapping for import process
        user_map = {UUID(k): v for k, v in self.user_map.items()}

        accounts: set[UUID] = set()
        category_map: dict[UUID, str] = {}
        for accountUid, account in state.accounts.items():
            category_map[account.defaultCategory] = str(accountUid) + ":Main"
            accounts.add(account.defaultCategory)
            for space in state.account_spending_spaces[accountUid]:
                category_map[space.spaceUid] = str(accountUid) + ":" + cleanup_string(space.name)
            for space in state.account_savings_spaces[accountUid]:
                category_map[space.savingsGoalUid] = str(accountUid) + ":" + cleanup_string(space.name)

        for item in state.feed_items.values():
            account_name = category_map.get(item.categoryUid)
            if not account_name:
                log.warning(f"Could not find beancount account name for account {item.categoryUid}")
                continue

            amount = Decimal(item.amount.minorUnits) / 100
            if item.direction == Direction.OUT:
                amount = -amount

            # Zero amount for declined, reversed, refunded
            if (
                item.status == FeedItemStatus.DECLINED
                or item.status == FeedItemStatus.REVERSED
                or item.status == FeedItemStatus.REFUNDED
            ):
                amount = Decimal(0)

            # Skip internal transfers for non-primary accounts
            if item.source == FeedItemSource.INTERNAL_TRANSFER and item.categoryUid not in accounts:
                continue

            # Determine counter account for internal transfers
            counter_account: str | None = None
            if item.source == FeedItemSource.INTERNAL_TRANSFER and item.counterPartyUid:
                counter_account = category_map.get(item.counterPartyUid)
                if not counter_account:
                    log.warning(f"Could not find counter account name for account {item.counterPartyUid}")
                    continue

            # counter_account = self._get_counter_account(item, account_name)

            meta: dict[str, Any] = {
                "__source__": item.model_dump_json(indent=2),
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
                    currency=item.amount.currency,
                    account=account_name,
                    counter_account=counter_account,
                    narration=f"{item.counterPartyName} {item.reference or ''}".strip(),
                    payee=item.counterPartyName,
                    category=item.spendingCategory,
                    meta=meta,
                )
            )
        return transactions
