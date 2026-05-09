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
    # Ensure import_data directory exists
    test_fava_dir = Path(__file__).parent / "test_fava"
    (test_fava_dir / "import_data").mkdir(exist_ok=True, parents=True)

    # Run fava with our test ledger
    # Run fava with our test ledger
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
    2. Clicks Sync (verifies feedback).
    3. Clicks Generate (verifies ML prediction).
    4. Verifies the generated file content.
    """
    target_url = f"{coffee_fava_server}/coffee-ledger/extension/BankSync/"

    test_fava_dir = Path(__file__).parent / "test_fava"
    # Pre-test cleanup: remove any old generated files
    import_dir = test_fava_dir / "import_data"
    for f in import_dir.glob("*.beancount"):
        f.unlink()

    # 1. Navigate to the extension page
    target_url = f"{coffee_fava_server}/coffee-test-ledger/extension/BankSync/"
    print(f"Navigating to {target_url}")

    page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    page.goto(target_url, wait_until="networkidle")

    # Check that our configured account is visible
    expect(page.get_by_text("My Coffee Monzo")).to_be_visible(timeout=10000)

    # 2. Click Sync (It will fail due to dummy credentials, but should NOT hang)
    print("Clicking Sync...")
    sync_btn = page.locator(".btn-sync").first
    sync_btn.click()

    # Verify Error Alert (this proves the backend didn't hang)
    alert_error = page.locator(".alert-error")
    expect(alert_error).to_be_visible(timeout=10000)
    print(f"Sync Error Alert Text (Expected): {alert_error.inner_text()}")

    # 3. Click Generate (ML)
    print("Clicking Generate...")
    # Using the new label
    gen_btn = page.locator("button").filter(has_text="Generate Beancount").first
    gen_btn.click()

    # Verify Handoff Alert (Success)
    # Looking for the link directly might be more robust
    handoff_link = page.get_by_role("link", name="Review in Import Tab")
    try:
        expect(handoff_link).to_be_visible(timeout=10000)
        print("Handoff link is visible!")
    except Exception:
        print(f"Handoff link NOT visible. Page content: {page.content()[-2000:]}")
        raise

    # Take a screenshot for visual inspection
    screenshot_path = str(test_fava_dir / "interaction_screenshot.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    # 4. Verify the generated file content
    generated_files = list(import_dir.glob("monzo_0_staged.beancount"))
    assert len(generated_files) == 1, "Should have generated one staged file"

    content = generated_files[0].read_text()
    print("Generated File Content:")
    print(content)

    # ML should have predicted Expenses:Food:Coffee for STARBUCKS
    assert "Expenses:Food:Coffee" in content
    assert "STARBUCKS - NEW VISIT" in content
    assert "Assets:UK:Monzo:Main" in content
