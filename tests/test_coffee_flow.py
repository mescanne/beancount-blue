import os
import subprocess
import time
from pathlib import Path

import pytest
from playwright.sync_api import Page, expect

pytestmark = pytest.mark.integration


@pytest.fixture(scope="module")
def coffee_fava_server():
    """Starts a local Fava server for the coffee shop test."""
    port = 5006
    test_fava_dir = Path(__file__).parent / "test_fava"
    (test_fava_dir / "import_data").mkdir(exist_ok=True, parents=True)

    log_path = test_fava_dir / "fava.log"
    log_file = log_path.open("w")

    fava_proc = subprocess.Popen(
        ["uv", "run", "fava", str(test_fava_dir / "coffee_ledger.beancount"), "--port", str(port)],
        env={**os.environ, "PYTHONPATH": str(Path.cwd()), "FAVA_TESTING": "1"},
        stdout=log_file,
        stderr=log_file,
    )
    # Give Fava a moment to initialize
    time.sleep(5)
    yield f"http://localhost:{port}"
    fava_proc.terminate()
    fava_proc.wait()
    log_file.close()

    # Print logs on failure
    if log_path.exists():
        print("--- FAVA LOGS ---")
        print(log_path.read_text())
        print("-----------------")


def test_coffee_shop_interaction_flow(page: Page, coffee_fava_server: str):
    """
    Simulates a full end-to-end interaction flow:
    1. Loads the dashboard with pre-populated cache.
    2. Clicks Sync (verifies custom error alert feedback).
    3. Clicks Import (redirects to Fava's native #extract view).
    4. Verifies that Fava's extraction UI correctly renders predicted transactions.
    """
    test_fava_dir = Path(__file__).parent / "test_fava"

    # 1. Navigate to the extension page
    target_url = f"{coffee_fava_server}/coffee-test-ledger/extension/BankSync/"
    print(f"Navigating to {target_url}")

    page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    page.goto(target_url, wait_until="networkidle")

    # Check that our configured integration is visible
    expect(page.get_by_text("api_monzo.yaml")).to_be_visible(timeout=10000)

    # 2. Click Sync (It will fail in test mode to prevent API calls, producing custom alert feedback)
    print("Clicking Sync...")
    sync_btn = page.locator(".btn-sync").first
    sync_btn.click()

    # Verify our custom Error Alert (this proves the backend didn't hang)
    alert_error = page.locator(".alert-error")
    expect(alert_error).to_be_visible(timeout=10000)
    print(f"Sync Error Alert Text (Expected): {alert_error.inner_text()}")

    # 3. Click Import (opens native modal overlay)
    print("Clicking Import...")
    import_btn = page.locator(".btn-import").first
    import_btn.click()

    # Give it a moment to run extraction and render
    time.sleep(2)

    # Take a screenshot for visual inspection
    screenshot_path = str(test_fava_dir / "interaction_screenshot.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    # 4. Verify Fava's extract UI is showing the Starbucks transaction with the Expenses:Food:Coffee prediction
    # Both 'Starbucks' (or 'STARBUCKS') and the predicted account 'Expenses:Food:Coffee' must be visible in Fava's DOM.
    # We use wait_for_function to robustly verify that visible input elements contain the expected values,
    # avoiding issues with hidden autocomplete/dropdown elements.
    page.wait_for_function(
        "() => Array.from(document.querySelectorAll('input')).some(i => i.value.includes('Starbucks') && i.offsetWidth > 0)",
        timeout=15000,
    )
    page.wait_for_function(
        "() => Array.from(document.querySelectorAll('input')).some(i => i.value.includes('Expenses:Food:Coffee') && i.offsetWidth > 0)",
        timeout=15000,
    )
