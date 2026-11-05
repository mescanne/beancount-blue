"""
Tests for beancount_blue.cashflow.fava.extension
"""

import tempfile

from fava.application import create_app


def test_cashflow_fava_extension_demo_mode():
    with tempfile.NamedTemporaryFile("w", suffix=".beancount") as f:
        f.write(
            """
option "operating_currency" "GBP"
2020-01-01 custom "fava-extension" "beancount_blue.cashflow.fava"
2020-01-01 open Assets:Bank GBP
"""
        )
        f.flush()

        app = create_app([f.name])
        app.config["TESTING"] = True
        slug = list(app.config["LEDGERS"].ledgers_by_slug.keys())[0]

        with app.test_client() as client:
            # 1. Test params endpoint
            res = client.get(f"/{slug}/extension/Cashflow/params")
            assert res.status_code == 200
            data = res.json
            assert data["status"] == "success"
            assert data["is_demo"] is True
            assert "retire_year" in data["params"]
            assert "growth_rate" in data["params"]

            # 2. Test simulate endpoint with overrides
            sim_res = client.post(
                f"/{slug}/extension/Cashflow/simulate",
                json={"overrides": {"retire_year": 2030, "living_expenses": 60_000.0}},
            )
            assert sim_res.status_code == 200
            sim_data = sim_res.json
            assert sim_data["status"] == "success"
            trace = sim_data["trace"]
            assert "periods" in trace
            assert "cashflows" in trace
            assert "balances" in trace
            assert "metrics" in trace
            assert "salary" in trace["cashflows"]
            assert "portfolio" in trace["balances"]

            # 3. Test HTML page loads
            page_res = client.get(f"/{slug}/extension/Cashflow/")
            assert page_res.status_code == 200
            assert b"cashflow-root" in page_res.data

            # 4. Test Cashflow.js bundle is served
            js_res = client.get(f"/{slug}/extension_js_module/Cashflow.js")
            assert js_res.status_code == 200
            assert b"Cashflow Svelte Module initialized" in js_res.data
