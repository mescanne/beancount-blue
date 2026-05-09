import os

from fava.application import create_app


def test():
    app = create_app([os.path.abspath("test_fava/test_ledger.beancount")])
    with app.test_client() as c:
        res = c.get("/test-ledger/extension/BankSync/schema")
        print(res.status_code)
        if res.status_code == 200:
            print("Schema loaded successfully")
        else:
            print(res.data)


test()
