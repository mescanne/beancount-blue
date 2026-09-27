<script lang="ts">
  import { onMount } from "svelte";
  import DashboardTable from "./components/DashboardTable.svelte";
  import ConfigEditorModal from "./components/ConfigEditorModal.svelte";
  import NewIntegrationModal from "./components/NewIntegrationModal.svelte";
  import Extract from "@fava/reports/import/Extract.svelte";
  import { ledgerData } from "@fava/stores/index.ts";
  import { getScriptTagValue } from "@fava/lib/dom.ts";
  import { ledgerDataValidator } from "@fava/api/validators.ts";
  import { entryValidator, type Entry } from "@fava/entries/index.ts";
  import { array } from "@fava/lib/validation.ts";
  import { getBaseExtensionUrl } from "./lib/ledger";
  import type { ImporterStatus, Alert } from "./types";

  let items = $state<ImporterStatus[]>([]);
  let alerts = $state<Alert[]>([]);

  // Config Modals
  let showEditor = $state(false);
  let showNew = $state(false);
  let selectedItem = $state<ImporterStatus | null>(null);

  // Fava Extract Modal
  let extractEntries = $state<Entry[]>([]);
  let isExtracting = $state(false);

  onMount(() => {
    // Initialise Fava stores from DOM script tag for full autocomplete/metadata reactivity
    const initial = getScriptTagValue("#ledger-data", ledgerDataValidator);
    if (initial.is_ok) {
      ledgerData.set(initial.value);
    }
    loadData();
  });

  function addAlert(message: string, type: "success" | "error" | "warning" = "info" as any) {
    const id = Math.random().toString(36).substring(2, 9);
    alerts = [...alerts, { id, type, message }];
    setTimeout(() => {
      alerts = alerts.filter((a) => a.id !== id);
    }, 6000);
  }

  async function loadData() {
    try {
      const res = await fetch(`${getBaseExtensionUrl()}dashboard`);
      const data = await res.json();
      if (data.status === "success") {
        items = data.items || data.data || [];
      } else {
        addAlert(data.message || "Failed to load dashboard data", "error");
      }
    } catch (e: any) {
      addAlert(`Network error: ${e.message}`, "error");
    }
  }

  function handleEdit(item: ImporterStatus) {
    selectedItem = item;
    showEditor = true;
  }

  function handleNew() {
    showNew = true;
  }

  async function handleImport(item: ImporterStatus) {
    try {
      addAlert(`Extracting transactions for ${item.importer_name}...`, "success");
      const res = await fetch(
        `${getBaseExtensionUrl()}extract?name=${encodeURIComponent(item.filename)}`
      );
      const data = await res.json();

      if (data.status !== "success") {
        addAlert(`Extraction failed: ${data.message}`, "error");
        return;
      }

      const validated = array(entryValidator)(data.entries);
      if (validated.is_err) {
        addAlert(`Invalid entry data received: ${validated.error.message}`, "error");
        return;
      }

      if (validated.value.length === 0) {
        addAlert("No entries found to import.", "warning");
        return;
      }

      extractEntries = validated.value;
      isExtracting = true;
    } catch (e: any) {
      addAlert(`Failed to extract: ${e.message}`, "error");
    }
  }

  function closeExtract() {
    isExtracting = false;
    extractEntries = [];
  }

  async function saveExtract() {
    const nonDuplicates = extractEntries.filter((e) => !e.is_duplicate());
    closeExtract();

    if (nonDuplicates.length === 0) {
      addAlert("All extracted entries were marked as duplicates; none committed.", "warning");
      return;
    }

    try {
      const res = await fetch(`${getBaseExtensionUrl()}commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: nonDuplicates }),
      });
      const data = await res.json();

      if (data.status === "success") {
        addAlert(`Successfully imported ${data.count} entries.`, "success");
        loadData();
      } else {
        addAlert(`Failed to commit entries: ${data.message}`, "error");
      }
    } catch (e: any) {
      addAlert(`Error saving entries: ${e.message}`, "error");
    }
  }
</script>

<div class="api-dashboard">
  <div class="dashboard-header">
    <h2>API Integrations</h2>
    <button class="btn btn-primary" onclick={handleNew}>+ Add API</button>
  </div>

  {#if alerts.length > 0}
    <div class="alert-container">
      {#each alerts as alert (alert.id)}
        <div class="alert alert-{alert.type}">
          {alert.message}
        </div>
      {/each}
    </div>
  {/if}

  <DashboardTable
    {items}
    onOpenEdit={handleEdit}
    onOpenImport={handleImport}
    onSyncComplete={loadData}
    onAlert={addAlert}
  />
</div>

{#if isExtracting && extractEntries.length > 0}
  <Extract
    bind:entries={extractEntries}
    close={closeExtract}
    save={saveExtract}
  />
{/if}

{#if showEditor && selectedItem}
  <ConfigEditorModal
    item={selectedItem}
    onClose={() => {
      showEditor = false;
      selectedItem = null;
    }}
    onSave={() => {
      showEditor = false;
      selectedItem = null;
      loadData();
    }}
    onDelete={() => {
      showEditor = false;
      selectedItem = null;
      loadData();
    }}
    onError={(msg) => addAlert(msg, "error")}
  />
{/if}

{#if showNew}
  <NewIntegrationModal
    onClose={() => (showNew = false)}
    onCreated={(filename) => {
      showNew = false;
      loadData();
      const createdItem: ImporterStatus = {
        filename,
        path: filename,
        importer_name: filename.replace(/^api_/, "").replace(/\.yaml$/, ""),
        status: "ok",
        last_sync: null,
        balances: null,
      };
      handleEdit(createdItem);
    }}
    onError={(msg) => addAlert(msg, "error")}
  />
{/if}

<style>
  .api-dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .dashboard-header h2 {
    margin: 0;
  }

  .alert-container {
    margin-bottom: 1rem;
  }

  .alert {
    padding: 10px 14px;
    margin-bottom: 8px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .alert-success {
    background: var(--color-background-positive, rgba(46, 204, 113, 0.15));
    color: var(--color-text-positive, #27ae60);
    border: 1px solid var(--color-text-positive, #27ae60);
  }

  .alert-error {
    background: var(--color-background-negative, rgba(231, 76, 60, 0.15));
    color: var(--color-text-negative, #c0392b);
    border: 1px solid var(--color-text-negative, #c0392b);
  }

  .alert-warning {
    background: rgba(243, 156, 18, 0.15);
    color: #d35400;
    border: 1px solid #d35400;
  }
</style>
