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
    the JSON editor renders without infinite loops, and 'Add' buttons are present.
    """
    target_url = f"{fava_server}/test-ledger/extension/BankSync/"

    # Track console errors
    errors = []
    page.on("pageerror", lambda exc: errors.append(exc))

    print(f"Navigating to {target_url}")
    page.goto(target_url, wait_until="networkidle")

    # 1. Verify basic page structure
    expect(page.get_by_role("heading", name="Bank Sync Dashboard")).to_be_visible()

    # 2. Verify JSON Editor renders (it's inside a details tag)
    print("Expanding Settings & API Configuration...")
    # JSON Editor might take a moment to fetch schema and init
    page.wait_for_selector("#json-editor-container .json-editor-btn-add", state="attached", timeout=10000)

    details = page.locator("details").filter(has_text="Settings & API Configuration")
    details.click()

    # 3. Check for 'Add' buttons inside the editor
    # This confirms the schema was parsed and UI was generated correctly
    add_buttons = page.locator("#json-editor-container .json-editor-btn-add")
    count = add_buttons.count()
    assert count >= 3, f"Expected at least 3 'Add' buttons (one for each bank type), found {count}"

    # 4. Verify Sync/Generate table is populated
    # It should have at least one row from our test_fava/importers.yaml
    sync_table_rows = page.locator("table.sortable tbody tr")
    assert sync_table_rows.count() > 0, "Expected at least one configured importer in the sync table"

    # 5. Verify no Javascript crashes occurred
    assert not errors, f"Javascript errors detected on page: {errors}"


def test_sync_button_interaction(page: Page, fava_server: str):
    """Verifies that clicking the Sync button triggers an action and shows an alert."""
    target_url = f"{fava_server}/test-ledger/extension/BankSync/"
    page.goto(target_url, wait_until="networkidle")

    # Click the first 'Sync' button in the dashboard table
    sync_btn = page.locator(".btn-sync").first
    sync_btn.click()

    # Verify that an alert appears (it might be an error alert due to dummy credentials, but it should appear)
    alert = page.locator(".alert")
    expect(alert.first).to_be_attached(timeout=15000)

    print(f"Interaction successful. Alert text: {alert.first.inner_text()}")
