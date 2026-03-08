import os

from fava.application import create_app


def test_fava_extension():
    abs_path = os.path.abspath("test_fava/test_ledger.beancount")
    app = create_app([abs_path])
    app.config["TESTING"] = True

    ledgers_by_slug = app.config["LEDGERS"].ledgers_by_slug
    slug = list(ledgers_by_slug.keys())[0]
    ledger = ledgers_by_slug[slug]

    print(f"Loaded extensions in Fava: {ledger.extensions._loaded_extensions}")

    with app.test_client() as client:
        # Instead of going to the HTML page right away, which uses url_for and fails, let's call the endpoints

        # Test Save Config Endpoint
        res = client.post(
            f"/{slug}/extension/BeancountBlue/save_config", json={"content": "global:\n  import_dir: test_dir"}
        )
        print("Extension Save Config Status:", res.status_code)
        if res.status_code == 200:
            print("-> SUCCESS: Save Config:", res.json)
        else:
            print(res.data)

        # Test the HTML report after checking the extension loaded
        try:
            res = client.get(f"/{slug}/extension/BeancountBlue/")
            print("Extension HTML Status:", res.status_code)
            if res.status_code == 200:
                print("HTML template rendering works.")
        except Exception as e:
            print(f"Template render error: {e}")


if __name__ == "__main__":
    test_fava_extension()
