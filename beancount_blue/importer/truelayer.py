from __future__ import annotations

import datetime
import hashlib
import http.server
import logging
import secrets
import sys
import urllib.parse
import webbrowser
from decimal import Decimal
from typing import Any, Literal, Optional, cast, final, override

import dateutil.parser
from authlib.integrations.httpx_client import OAuth2Client
from pydantic import BaseModel, Field

from beancount_blue.importer.delta_importer import APIImporter
from beancount_blue.importer.importer import ImportedTransaction

log = logging.getLogger(__name__)

ACCOUNT_TYPES = ("accounts", "cards")


def currency_to_decimal(currency: float) -> Decimal:
    return Decimal(f"{currency:.2f}")


# --- Pydantic Models for API Data ---


class TrueLayerTransaction(BaseModel):
    transaction_id: str | None = None
    timestamp: str
    description: str
    amount: float
    currency: str
    transaction_type: str
    transaction_category: str | None = None
    merchant_name: str | None = None
    meta: dict[str, Any] = {}
    transaction_classification: list[str] = []

    model_config = {"extra": "allow"}


class TrueLayerAccount(BaseModel):
    account_id: str
    display_name: str
    currency: str
    account_type: str
    provider: dict[str, Any] = {}

    model_config = {"extra": "allow"}


class TrueLayerCard(BaseModel):
    account_id: str
    display_name: str
    currency: str
    card_type: str
    provider: dict[str, Any] = {}

    model_config = {"extra": "allow"}


class TrueLayerBalance(BaseModel):
    available: float | None = None
    current: float | None = None
    currency: str
    update_timestamp: str | None = None

    model_config = {"extra": "allow"}


class TrueLayerAccountConfig(BaseModel):
    account_id: str
    name: str
    liability: bool
    enabled: bool = True
    beancount_account: Optional[str] = None
    from_date: float = Field(default_factory=lambda: datetime.datetime.now().timestamp() - 86400 * 90)


class TrueLayerData(BaseModel):
    # Auth tokens (stored in format compatible with authlib)
    token: dict[str, Any] | None = None

    # Account configurations
    accounts: dict[str, TrueLayerAccountConfig] = {}
    cards: dict[str, TrueLayerAccountConfig] = {}

    # Raw data from API (stored as Pydantic models)
    raw_accounts: list[TrueLayerAccount] = []
    raw_cards: list[TrueLayerCard] = []
    raw_transactions: dict[str, list[TrueLayerTransaction]] = {}
    raw_pending_transactions: dict[str, list[TrueLayerTransaction]] = {}
    raw_balances: dict[str, TrueLayerBalance] = {}


class TrueLayerAPI:
    ADDRESS = "127.0.0.1"
    PORT = 3015
    REDIRECT_URI = f"http://{ADDRESS}:{PORT}/callback"
    AUTH_URL = "https://auth.truelayer.com"
    API_URL = "https://api.truelayer.com/data/v1"
    TOKEN_ENDPOINT = "https://auth.truelayer.com/connect/token"

    def __init__(self, client_id: str, client_secret: str, state: TrueLayerData):
        self.client_id = client_id
        self.client_secret = client_secret
        self.state = state

        self.client = OAuth2Client(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=self.REDIRECT_URI,
            token=state.token,
            token_endpoint=self.TOKEN_ENDPOINT,
            update_token=self._update_token_callback,
            base_url=self.API_URL,
        )

    def _update_token_callback(
        self, token: dict[str, Any], refresh_token: str | None = None, access_token: str | None = None
    ) -> None:
        log.info("Updating TrueLayer access token.")
        self.state.token = token

    def ensure_authorized(self) -> None:
        """Ensures the client has a valid token, performing the initial OAuth flow if necessary."""
        if self.state.token:
            return

        log.info("No token found. Starting OAuth authorization flow.")

        # 1. Generate Authorization URL
        state_str = secrets.token_urlsafe(16)
        scope = "accounts cards transactions balance offline_access"
        # authlib types are missing, so we cast the result
        authorization_url, _ = cast(
            tuple[str, str],
            self.client.create_authorization_url(  # type: ignore[reportUnknownMemberType]
                f"{self.AUTH_URL}/", state=state_str, scope=scope, response_mode="form_post"
            ),
        )

        # 2. Capture Code via Local Server
        code = self._capture_auth_code(authorization_url, state_str)
        if not code:
            raise RuntimeError("Failed to obtain authorization code.")

        # 3. Exchange Code for Token
        token = cast(
            dict[str, Any],
            self.client.fetch_token(  # type: ignore[reportUnknownMemberType]
                self.TOKEN_ENDPOINT,
                grant_type="authorization_code",
                code=code,
                redirect_uri=self.REDIRECT_URI,
            ),
        )
        self._update_token_callback(token)
        log.info("Successfully obtained and stored initial access token.")

    def _capture_auth_code(self, auth_link: str, expected_state: str) -> str | None:
        code: str | None = None

        class HttpHandler(http.server.BaseHTTPRequestHandler):
            def do_POST(self) -> None:
                nonlocal code
                length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(length).decode("utf-8")
                data = dict(urllib.parse.parse_qsl(body))

                received_state = data.get("state")
                received_code = data.get("code")

                if received_code and received_state == expected_state:
                    code = received_code  # type: ignore
                    self.send_response(200)
                    response = b"Authorization successful! You can close this tab."
                    self.send_header("Content-Type", "text/plain")
                    self.send_header("Content-Length", str(len(response)))
                    self.end_headers()
                    self.wfile.write(response)
                else:
                    log.warning("OAuth failed. State mismatch or no code.")
                    self.send_response(302)
                    self.send_header("Location", auth_link)
                    self.end_headers()

            def log_message(self, format: str, *args: Any) -> None:
                return

        server = http.server.HTTPServer((self.ADDRESS, self.PORT), HttpHandler)
        log.info(f"Listening for callback at {self.REDIRECT_URI}")

        webbrowser.open_new(auth_link)
        print(f"Please log in at: {auth_link}", file=sys.stderr)

        while not code:
            server.handle_request()

        server.server_close()
        return code

    def _get_results(self, endpoint: str, params: dict[str, Any] | None = None) -> list[Any]:
        self.ensure_authorized()
        # Note: OAuth2Client automatically refreshes the token if expired before making the request.
        # However, due to how the base_url works in authlib/httpx, we need to be careful with paths.
        # We set base_url to "https://api.truelayer.com/data/v1" in __init__.
        # So endpoint should be relative to that, e.g., "accounts".

        r = self.client.get(endpoint, params=params)
        r.raise_for_status()
        return r.json().get("results", [])

    def get_accounts(self) -> list[TrueLayerAccount]:
        data = self._get_results("accounts")
        return [TrueLayerAccount(**item) for item in data]

    def get_cards(self) -> list[TrueLayerCard]:
        data = self._get_results("cards")
        return [TrueLayerCard(**item) for item in data]

    def get_transactions(
        self,
        account_id: str,
        type_: Literal["accounts", "cards"],
        from_date: datetime.datetime,
        to_date: datetime.datetime,
        pending: bool = False,
    ) -> list[TrueLayerTransaction]:

        path = "cards" if type_ == "cards" else "accounts"
        suffix = "/transactions/pending" if pending else "/transactions"
        endpoint = f"{path}/{account_id}{suffix}"

        params = {
            "from": from_date.isoformat(),
            "to": to_date.isoformat(),
        }

        data = self._get_results(endpoint, params=params)
        return [TrueLayerTransaction(**item) for item in data]

    def get_balance(self, account_id: str, type_: Literal["accounts", "cards"]) -> TrueLayerBalance | None:
        path = "cards" if type_ == "cards" else "accounts"
        endpoint = f"{path}/{account_id}/balance"

        try:
            results = self._get_results(endpoint)
            if results:
                return TrueLayerBalance(**results[0])
        except Exception:
            log.warning("Failed to fetch balance for %s", account_id, exc_info=True)

        return None


class TrueLayerImporter(APIImporter[TrueLayerData]):
    importer_name: Literal["truelayer"]  # pyright: ignore[reportIncompatibleVariableOverride]

    client_id: str = Field(description="Truelayer Client ID")
    client_secret: str = Field(description="Truelayer Client Secret")

    units: int = 2

    @final
    @override
    def refresh(self, state: TrueLayerData) -> None:
        is_first_run = state.token is None

        api = TrueLayerAPI(self.client_id, self.client_secret, state)
        api.ensure_authorized()

        # 1. Accounts
        state.raw_accounts = api.get_accounts()
        for account in state.raw_accounts:
            if account.account_id not in state.accounts:
                state.accounts[account.account_id] = TrueLayerAccountConfig(
                    account_id=account.account_id,
                    name=account.display_name,
                    liability=False,
                )

        # 2. Cards
        state.raw_cards = api.get_cards()
        for card in state.raw_cards:
            if card.account_id not in state.cards:
                state.cards[card.account_id] = TrueLayerAccountConfig(
                    account_id=card.account_id,
                    name=card.display_name,
                    liability=card.card_type == "CREDIT",
                )

        # 3. Transactions & Balances
        state.raw_transactions = {}
        state.raw_pending_transactions = {}
        state.raw_balances = {}

        for type_ in ACCOUNT_TYPES:
            # type_ is "accounts" or "cards"
            config_map = state.accounts if type_ == "accounts" else state.cards
            # We need to map the string type_ to the Literal expected by get_transactions
            # This cast is safe because ACCOUNT_TYPES is defined as ("accounts", "cards")
            api_type = type_

            for account_config in config_map.values():
                if not account_config.enabled:
                    continue

                aid = account_config.account_id
                from_date = datetime.datetime.fromtimestamp(account_config.from_date, datetime.timezone.utc)
                if not is_first_run:
                    from_date = max(
                        from_date, datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=89)
                    )
                to_date = datetime.datetime.now(datetime.timezone.utc)

                state.raw_transactions[aid] = api.get_transactions(aid, api_type, from_date, to_date)
                state.raw_pending_transactions[aid] = api.get_transactions(
                    aid, api_type, from_date, to_date, pending=True
                )

                bal = api.get_balance(aid, api_type)
                if bal:
                    state.raw_balances[aid] = bal

    @final
    @override
    def extract(self, state: TrueLayerData) -> list[ImportedTransaction]:
        entries: list[ImportedTransaction] = []

        for config_map in [state.accounts, state.cards]:
            for account_config in config_map.values():
                if not account_config.enabled:
                    continue

                aid = account_config.account_id

                # Settled
                for txn in state.raw_transactions.get(aid, []):
                    entries.append(self._transform_transaction(txn, aid))

                # Pending
                for txn in state.raw_pending_transactions.get(aid, []):
                    t = self._transform_transaction(txn, aid)
                    t.settled = False
                    entries.append(t)

        return entries

    def _transform_transaction(self, txn: TrueLayerTransaction, account_id: str) -> ImportedTransaction:
        amount = currency_to_decimal(txn.amount)
        if txn.transaction_type == "DEBIT":
            amount = -amount

        date = dateutil.parser.parse(txn.timestamp).date()

        payee = txn.merchant_name or txn.meta.get("provider_merchant_name")

        # Robust ID generation
        if txn.transaction_id:
            txn_id = txn.transaction_id
        else:
            # Hash the content if no ID is provided
            content_str = f"{date.isoformat()}|{amount}|{txn.description}|{txn.currency}"
            txn_id = hashlib.sha256(content_str.encode("utf-8")).hexdigest()

        return ImportedTransaction(
            id=txn_id,
            date=date,
            settled=True,
            amount=amount,
            currency=txn.currency,
            account=account_id,
            narration=txn.description,
            payee=payee,
            meta={
                "type": "truelayer",
                "category": txn.transaction_category or "",
                "classification": ",".join(txn.transaction_classification),
            },
        )
