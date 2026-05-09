import os

from fava.application import create_app


def test():
    app = create_app([os.path.abspath("test_fava/test_ledger.beancount")])
    with app.test_client() as c:
        res = c.get("/test-ledger/extension_js_module/BankSync.js")
        print(res.status_code, res.data[:100])


test()
