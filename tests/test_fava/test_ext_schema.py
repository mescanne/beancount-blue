import os

from fava.application import create_app


def test_ext_schema():
    app = create_app([os.path.abspath("tests/test_fava/test_ledger.beancount")])
    with app.test_client() as c:
        res = c.get("/test-ledger/extension/BankSync/schema")
        assert res.status_code == 200
        assert "$defs" in res.json
