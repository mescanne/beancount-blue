from __future__ import annotations

import datetime
import logging
import os
from decimal import Decimal
from typing import Any, Literal, final, override

from authlib.integrations.httpx_client import OAuth2Client, OAuthError
from pydantic import BaseModel, Field
from pymonzo.accounts.resources import AccountsResource
from pymonzo.accounts.schemas import MonzoAccount
from pymonzo.attachments.resources import AttachmentsResource
from pymonzo.balance.resources import BalanceResource
from pymonzo.balance.schemas import MonzoBalance
from pymonzo.client import MonzoAPI
from pymonzo.exceptions import NoSettingsFile
from pymonzo.feed.resources import FeedResource
from pymonzo.pots.resources import PotsResource
from pymonzo.pots.schemas import MonzoPot
from pymonzo.settings import PyMonzoSettings
from pymonzo.transactions.enums import MonzoTransactionCategory
from pymonzo.transactions.resources import TransactionsResource
from pymonzo.transactions.schemas import MonzoTransaction, MonzoTransactionMerchant
from pymonzo.webhooks.resources import WebhooksResource
from pymonzo.whoami.resources import WhoAmIResource

from beancount_blue.importer.delta_importer import APIImporter

from .importer import ImportedTransaction

log = logging.getLogger(__name__)

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))


def _cleanup(s: str | None) -> str:
    if not s:
        return ""
    s = s.strip()
    s = s.replace("_", " ")
    s = " ".join([w.capitalize() for w in s.split(" ") if not w.isdigit()])
    return s


def _cleanup_account(s: str) -> str:
    s = _cleanup(s).replace(" ", "")
    s = "".join([w for w in s if w.isalnum()])
    return s


##
## This is a JSON-serialized model
##
#
#


class CustomMonzoAPI(MonzoAPI):
    token: dict[str, Any]

    @classmethod
    def auth_from_state_or_cli(
        cls, token_state: dict[str, Any], client_id: str, client_secret: str
    ) -> tuple["CustomMonzoAPI", bool]:

        # If it's fresh, just construct it fresh
        if "access_token" not in token_state:
            return cls.auth_from_cli(token_state, client_id, client_secret), True

        # Try it out -- if it fails, do it fresh
        monzo_api: CustomMonzoAPI | None = None
        try:
            monzo_api = CustomMonzoAPI(token_state)
            monzo_api.whoami()
            return monzo_api, False
        except (OAuthError, NoSettingsFile) as e:
            log.error("Error: %s", e)
            return cls.auth_from_cli(token_state, client_id, client_secret), True

    @classmethod
    def auth_from_cli(cls, token_state: dict[str, Any], client_id: str, client_secret: str) -> "CustomMonzoAPI":

        # Generate the new token state
        new_token: dict[str, Any] = cls.authorize(  # pyright: ignore[reportUnknownMemberType, reportUnknownVariableType]
            client_id=client_id,
            client_secret=client_secret,
            save_to_disk=False,
        )

        # Verify it's all good
        if "access_token" not in new_token:
            raise RuntimeError("Authorization failed, no access_token received")
        _ = input("Confirm when authorized in the app: ")

        # Update the token state
        for k, v in new_token.items():
            token_state[k] = v

        # Warm up the connection and return it
        monzo_api = CustomMonzoAPI(token_state)
        monzo_api.whoami()
        log.info(
            "Authenticated: %s, now token %s", monzo_api.whoami().authenticated, token_state.get("access_token", "")
        )

        return monzo_api

    def __init__(self, stateful_token: dict[str, Any]) -> None:  # pyright: ignore[reportUnknownParameterType, reportMissingParameterType]
        self.token = stateful_token
        if "access_token" not in self.token:
            raise RuntimeError("No access_token in token state")
        self._settings = PyMonzoSettings(
            client_id=self.token["client_id"],
            client_secret="",
            token=self.token,
        )
        log.info("Initializing MonzoAPI with token: %s", self.token)
        log.info("Token endpoint: %s, api_url: %s", self.token_endpoint, self.api_url)
        log.info("Auth URL: %s", self.authorization_endpoint)
        self.session = OAuth2Client(
            client_id=self._settings.client_id,
            client_secret=self._settings.client_secret,
            token=self._settings.token,
            authorization_endpoint=self.authorization_endpoint,
            token_endpoint=self.token_endpoint,
            token_endpoint_auth_method="client_secret_post",  # noqa
            update_token=self._update_token,
            base_url=self.api_url,
        )
        self.whoami = WhoAmIResource(client=self).whoami
        self.accounts = AccountsResource(client=self)
        self.attachments = AttachmentsResource(client=self)
        self.balance = BalanceResource(client=self)
        self.feed = FeedResource(client=self)
        self.pots = PotsResource(client=self)
        self.transactions = TransactionsResource(client=self)
        self.webhooks = WebhooksResource(client=self)

    def _update_token(self, token: dict[str, Any], **kwargs: Any) -> None:
        log.info("Updating token: %s", token)
        for k, v in token.items():
            self.token[k] = v


class MonzoAccountData(BaseModel):
    account: MonzoAccount
    pots: list[MonzoPot]
    balances: dict[float, MonzoBalance]
    transactions: dict[str, MonzoTransaction]

    def refresh(self, monzo_api: MonzoAPI, days_ago: int | None):

        # Update balances and pots
        self.balances[datetime.datetime.now().timestamp()] = monzo_api.balance.get(account_id=self.account.id)
        self.pots = monzo_api.pots.list(account_id=self.account.id)

        since = self.account.created
        if days_ago is not None:
            since = max(since, datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days_ago))
        final_before = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1)
        while True:
            before = since + datetime.timedelta(days=90)
            before = min(before, final_before)
            log.info("Fetching from %s to %s", since, before)
            next_transactions = monzo_api.transactions.list(
                account_id=self.account.id,
                since=since,
                before=before,
                expand_merchant=True,
                limit=100,
            )

            for trans in next_transactions:
                if trans.id not in self.transactions:
                    log.info(
                        f"New transaction: {trans.created} {trans.settled} {trans.id} {trans.amount} "
                        f"{trans.description}"
                    )
                elif self.transactions[trans.id] != trans:
                    log.info(
                        f"Updated transaction: {trans.created} {trans.settled} {trans.id} {trans.amount} "
                        f"(old {self.transactions[trans.id].amount}) {trans.description}"
                    )
                self.transactions[trans.id] = trans
                if not since or trans.created > since:
                    since = trans.created

            if len(next_transactions) < 100:
                break

    def cleanup_monzo(self):
        settled_reversals_mastercard_lifecycle_ids = {}
        for t in self.transactions.values():
            if not t.settled:
                continue
            if "is_reversal" in t.metadata and t.metadata["is_reversal"] == "true":
                settled_reversals_mastercard_lifecycle_ids[t.metadata["mastercard_lifecycle_id"]] = t.settled

        # Settle the original posting
        for t in self.transactions.values():
            if "mastercard_lifecycle_id" not in t.metadata:
                continue
            if t.metadata["mastercard_lifecycle_id"] not in settled_reversals_mastercard_lifecycle_ids:
                continue
            t.settled = settled_reversals_mastercard_lifecycle_ids[t.metadata["mastercard_lifecycle_id"]]

    def extract_transaction(self, t: MonzoTransaction, units: int = 2) -> ImportedTransaction | None:

        # Current price of the Monzo transaction
        now_amount = round(Decimal(Decimal(t.amount) / pow(10, units)), units)

        # If it's declined, it should be zero
        if t.decline_reason:
            now_amount = Decimal(0)

        # If price is now zero, then return (nothing to adjust!)
        if now_amount == Decimal(0):
            return None

        # Create base metadata
        metadata = {
            "type": "monzo",
        }
        if isinstance(t.category, MonzoTransactionCategory):
            metadata["category"] = t.category.value
        elif t.category:
            metadata["category"] = str(t.category)

        # if t.user_id:
        #    metadata["user_id"] = t.user_id
        #    if self.account.owners:
        #        for owner in self.account.owners:
        #            if owner.user_id == t.user_id and owner.preferred_first_name:
        #                metadata["user_id"] = owner.preferred_first_name
        #                break

        if t.notes:
            metadata["notes"] = t.notes

        if t.merchant and isinstance(t.merchant, MonzoTransactionMerchant):
            metadata["orig_payee"] = _cleanup(t.merchant.name)
        elif t.merchant:
            metadata["orig_payee"] = _cleanup(t.merchant)
        elif t.counterparty:
            metadata["orig_payee"] = _cleanup(t.counterparty.name)

        if t.counterparty and t.counterparty.sort_code:
            metadata["sort_code"] = t.counterparty.sort_code
            metadata["account_number"] = t.counterparty.account_number or ""

        # See if we can find the counter_account
        counter_account = None
        if "pot_id" in t.metadata:
            for pot in self.pots:
                if pot.id == t.metadata["pot_id"]:
                    counter_account = self.account.id + ":" + _cleanup_account(pot.name)
                    break

        return ImportedTransaction(
            id=t.id,
            date=t.created.date(),
            settled=t.settled is not None,
            amount=now_amount,
            currency=t.currency,
            account=self.account.id,
            counter_account=counter_account,
            narration=(t.description if "pot_id" not in t.metadata else "pot movement"),
            payee=metadata.get("orig_payee"),
            meta=metadata,
        )

    def extract(self, units: int = 2) -> list[ImportedTransaction]:
        if self.account.closed:
            return []

        # Hackish Monzo issues -- clean up the data
        self.cleanup_monzo()

        trans: list[ImportedTransaction] = []
        for t in self.transactions.values():
            new_t = self.extract_transaction(t, units)
            if new_t:
                trans.append(new_t)

        return trans


class MonzoData(BaseModel):
    token: dict[str, Any] = {}
    accounts: dict[str, MonzoAccountData] = {}

    def refresh(self, client_id: str, client_secret: str) -> None:
        monzo_api, newClient = CustomMonzoAPI.auth_from_state_or_cli(self.token, client_id, client_secret)

        days_ago = None if newClient else 89

        for account in monzo_api.accounts.list():
            if account.id not in self.accounts:
                self.accounts[account.id] = MonzoAccountData(account=account, pots=[], balances={}, transactions={})
            else:
                self.accounts[account.id].account = account

            self.accounts[account.id].refresh(monzo_api, days_ago=days_ago)

    def extract(self, units: int = 2) -> list[ImportedTransaction]:
        imported: list[ImportedTransaction] = []
        for account in self.accounts.values():
            imported.extend(account.extract(units))

        return imported


class MonzoImporter(APIImporter[MonzoData]):
    importer_name: Literal["monzo"]  # pyright: ignore[reportIncompatibleVariableOverride]

    units: int = 2
    client_id: str = Field(description="Monzo Client ID")
    client_secret: str = Field(description="Monzo Client Secret")

    @final
    @override
    def refresh(self, state: MonzoData) -> None:
        state.refresh(self.client_id, self.client_secret)

    @final
    @override
    def extract(self, state: MonzoData) -> list[ImportedTransaction]:
        return state.extract(units=self.units)
