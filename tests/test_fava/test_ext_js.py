import os

from fava.application import create_app


def test_ext_js():
    app = create_app([os.path.abspath("tests/test_fava/test_ledger.beancount")])
    with app.test_client() as c:
        res = c.get("/test-ledger/extension_js_module/BankSync.js")
        assert res.status_code == 200
        assert b"API Config Manager JS Module Loaded" in res.data
