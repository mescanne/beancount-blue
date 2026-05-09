from decimal import Decimal

from beancount_blue.importer.monzo import MonzoData, MonzoImporter
from beancount_blue.importer.starling import StarlingData, StarlingImporter
from beancount_blue.importer.truelayer import TrueLayerData, TrueLayerImporter


def test_monzo_extraction():
    with open("tests/test_data/monzo_test_data.jsonl") as f:
        state = MonzoData.model_validate_json(f.readline())

    importer = MonzoImporter(importer_name="monzo", client_id="test", client_secret="test")
    transactions = importer.extract(state)
    txns_by_id = {t.id: t for t in transactions}

    t1 = txns_by_id.get("tx_standard")
    assert t1 is not None, "Standard transaction missing"
    assert t1.amount == Decimal("-15.00")
    assert t1.settled is True

    t2 = txns_by_id.get("tx_pending")
    assert t2 is not None, "Pending transaction missing"
    assert t2.settled is False

    assert "tx_declined" not in txns_by_id

    t_orig = txns_by_id.get("tx_orig")
    t_rev = txns_by_id.get("tx_rev")
    assert t_orig is not None and t_rev is not None
    assert t_orig.settled is True
    assert t_orig.amount == Decimal("-10.00")
    assert t_rev.amount == Decimal("10.00")

    t_pot = txns_by_id.get("tx_pot")
    assert t_pot is not None
    assert t_pot.counter_account is not None
    assert "SavingsPot" in t_pot.counter_account

    t_cp = txns_by_id.get("tx_counterparty")
    assert t_cp is not None
    assert t_cp.meta.get("sort_code") == "123456"
    assert t_cp.meta.get("account_number") == "12345678"


def test_starling_extraction():
    with open("tests/test_data/starling_test_data.jsonl") as f:
        state = StarlingData.model_validate_json(f.readline())

    importer = StarlingImporter(
        importer_name="starling",
        personal_access_token="test",
        user_map={"88888888-8888-8888-8888-888888888888": "Alice"},
    )
    transactions = importer.extract(state)
    txns_by_id = {t.id: t for t in transactions}

    t_out = txns_by_id.get("11111111-1111-1111-1111-111111111111")
    assert t_out is not None, "OUT Settled missing"
    assert t_out.amount == Decimal("-15.00")
    assert t_out.settled is True

    t_in = txns_by_id.get("22222222-2222-2222-2222-222222222222")
    assert t_in is not None
    assert t_in.amount == Decimal("50.00")

    t_dec = txns_by_id.get("33333333-3333-3333-3333-333333333333")
    assert t_dec is not None
    assert t_dec.amount == Decimal("0.00")

    t_int = txns_by_id.get("44444444-4444-4444-4444-444444444444")
    assert t_int is not None
    assert t_int.amount == Decimal("-20.00")
    assert t_int.counter_account is not None
    assert "HolidaySpace" in t_int.counter_account

    t_usr = txns_by_id.get("55555555-5555-5555-5555-555555555555")
    assert t_usr is not None
    assert t_usr.meta.get("note") == "Drinks"
    assert t_usr.meta.get("user") == "Alice"

    t_pend = txns_by_id.get("66666666-6666-6666-6666-666666666666")
    assert t_pend is not None
    assert t_pend.settled is False


def test_truelayer_extraction():
    with open("tests/test_data/truelayer_test_data.jsonl") as f:
        state = TrueLayerData.model_validate_json(f.readline())

    importer = TrueLayerImporter(importer_name="truelayer", client_id="test", client_secret="test")
    transactions = importer.extract(state)
    txns_by_id = {t.id: t for t in transactions}

    assert len(transactions) == 4

    t_debit = txns_by_id.get("tl_debit")
    assert t_debit is not None
    assert t_debit.amount == Decimal("-15.00")
    assert t_debit.settled is True

    t_credit = txns_by_id.get("tl_credit")
    assert t_credit is not None
    assert t_credit.amount == Decimal("50.00")
    assert t_credit.settled is True

    t_no_id = [t for t in transactions if "tl_" not in t.id]
    assert len(t_no_id) == 1
    assert t_no_id[0].amount == Decimal("-5.00")

    t_pending = txns_by_id.get("tl_pending")
    assert t_pending is not None
    assert t_pending.amount == Decimal("-20.00")
    assert t_pending.settled is False

    assert "tl_disabled" not in txns_by_id
