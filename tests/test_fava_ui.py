import os
import subprocess
import time
from pathlib import Path

import pytest
from playwright.sync_api import Page, expect

pytestmark = pytest.mark.integration


@pytest.fixture(scope="module")
def fava_server():
    """Starts a local Fava server for the duration of the test module."""
    port = 5005
    test_fava_dir = Path(__file__).parent / "test_fava"
    # Use the test ledger provided in the repository
    fava_proc = subprocess.Popen(  # noqa: S603, S607
        ["uv", "run", "fava", str(test_fava_dir / "test_ledger.beancount"), "--port", str(port)],  # noqa: S607
        env={**os.environ, "PYTHONPATH": str(Path.cwd()), "FAVA_TESTING": "1"},
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    # Give Fava a moment to initialize
    time.sleep(3)
    yield f"http://localhost:{port}"
    fava_proc.terminate()
    fava_proc.wait()


def test_extension_ui_loads(page: Page, fava_server: str):
    """
    Verifies that the BankSync extension UI loads correctly,
    displays the list of configured APIs, and shows the 'Add API' button.
    """
    target_url = f"{fava_server}/test-ledger/extension/BankSync/"

    # Track console errors
    errors = []
    page.on("pageerror", lambda exc: errors.append(exc))

    print(f"Navigating to {target_url}")
    page.goto(target_url, wait_until="networkidle")

    # 1. Verify basic page structure
    expect(page.get_by_role("heading", name="API Integrations")).to_be_visible()

    # 2. Verify '+ Add API' button is present
    add_btn = page.get_by_role("button", name="+ Add API")
    expect(add_btn).to_be_visible()

    # 3. Verify Sync/Generate table is populated with our seeded api_monzo.yaml
    sync_table_rows = page.locator("table.api-table tbody tr")
    expect(sync_table_rows).to_have_count(1)

    # Verify api_monzo.yaml filename is displayed in the first row
    first_row = sync_table_rows.first
    expect(first_row).to_contain_text("api_monzo.yaml")

    # 4. Verify no Javascript crashes occurred
    assert not errors, f"Javascript errors detected on page: {errors}"


def test_sync_button_interaction(page: Page, fava_server: str):
    """Verifies that clicking the Sync button triggers an action and shows our custom inline alert banner."""
    target_url = f"{fava_server}/test-ledger/extension/BankSync/"
    page.goto(target_url, wait_until="networkidle")

    # Click the 'Sync' button in the dashboard table
    sync_btn = page.locator(".btn-sync").first
    sync_btn.click()

    # Verify that our custom API alert banner appears
    alert = page.locator(".alert-error")
    expect(alert).to_be_attached(timeout=15000)

    print(f"Interaction successful. Alert text: {alert.inner_text()}")
