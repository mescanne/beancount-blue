import os

from fava.application import create_app


def test_fava_extension():
    abs_path = os.path.abspath("tests/test_fava/test_ledger.beancount")
    app = create_app([abs_path])
    app.config["TESTING"] = True

    ledgers_by_slug = app.config["LEDGERS"].ledgers_by_slug
    slug = list(ledgers_by_slug.keys())[0]

    with app.test_client() as client:
        # Test Get Configs
        res = client.get(f"/{slug}/extension/BankSync/configs")
        assert res.status_code == 200
        assert res.json["status"] == "success"

        # Test Save Config
        res = client.post(
            f"/{slug}/extension/BankSync/config",
            json={"name": "api_test.yaml", "content": "importer_name: monzo\nclient_id: 'test'"},
        )
        assert res.status_code == 200
        assert res.json["status"] == "success"

        # Test Get Config
        res = client.get(f"/{slug}/extension/BankSync/config?name=api_test.yaml")
        assert res.status_code == 200
        assert res.json["content"] == "importer_name: monzo\nclient_id: 'test'"

        # Test Delete Config
        res = client.delete(f"/{slug}/extension/BankSync/config?name=api_test.yaml")
        assert res.status_code == 200
        assert res.json["status"] == "success"

        # Test the HTML report
        res = client.get(f"/{slug}/extension/BankSync/")
        assert res.status_code == 200


if __name__ == "__main__":
    test_fava_extension()
