<script lang="ts">
  import type { ImporterStatus } from "../types";
  import { getBaseExtensionUrl } from "../lib/ledger";

  interface Props {
    items: ImporterStatus[];
    onSyncComplete: () => void;
    onOpenImport: (item: ImporterStatus) => void;
    onOpenEdit: (item: ImporterStatus) => void;
    onAlert: (msg: string, type: "success" | "error" | "warning") => void;
  }

  let { items, onSyncComplete, onOpenImport, onOpenEdit, onAlert }: Props =
    $props();

  let syncingMap = $state<Record<string, boolean>>({});

  async function handleSync(item: ImporterStatus) {
    syncingMap[item.filename] = true;
    try {
      const redirectUri =
        window.location.origin + getBaseExtensionUrl() + "callback";
      const res = await fetch(`${getBaseExtensionUrl()}sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.filename,
          redirect_uri: redirectUri,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onAlert(`Synced ${item.filename} successfully.`, "success");
        onSyncComplete();
      } else if (data.status === "auth_required") {
        window.open(data.auth_url, "_blank");
        onAlert(
          "Authentication required. A window has opened. Complete the authorization to sync.",
          "warning"
        );
      } else {
        onAlert(`Sync failed: ${data.message}`, "error");
      }
    } catch (e: any) {
      onAlert(`Sync error: ${e.message}`, "error");
    } finally {
      syncingMap[item.filename] = false;
      onSyncComplete();
    }
  }
</script>

<table class="api-table">
  <thead>
    <tr>
      <th>Integration</th>
      <th>Importer</th>
      <th>Balances</th>
      <th>Last Sync</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#if items.length === 0}
      <tr>
        <td colspan="6" class="empty-row">No integrations configured.</td>
      </tr>
    {:else}
      {#each items as item (item.filename)}
        <tr>
          <td><strong>{item.filename}</strong></td>
          <td>{item.importer_name}</td>
          <td><div class="api-balances">{item.balances || "-"}</div></td>
          <td>
            {item.last_sync
              ? new Date(item.last_sync).toLocaleString()
              : "Never"}
          </td>
          <td>
            {#if item.status === "ok"}
              <div class="api-status-ok">OK</div>
            {:else}
              <div class="api-status-error">Error</div>
              {#if item.error_msg}
                <div class="api-error-msg">{item.error_msg}</div>
              {/if}
            {/if}
          </td>
          <td class="api-actions">
            <button
              type="button"
              class="btn btn-sync"
              disabled={syncingMap[item.filename]}
              onclick={() => handleSync(item)}
            >
              {#if syncingMap[item.filename]}
                <span class="spinner"></span> Syncing...
              {:else}
                Sync
              {/if}
            </button>
            <button
              type="button"
              class="btn btn-primary btn-import"
              onclick={() => onOpenImport(item)}
            >
              Import
            </button>
            <button
              type="button"
              class="btn btn-edit"
              onclick={() => onOpenEdit(item)}
            >
              Edit
            </button>
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<style>
  .api-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }

  .api-table th,
  .api-table td {
    padding: 10px;
    border-bottom: 1px solid var(--border, #eee);
    text-align: left;
  }

  .api-table th {
    background: var(--color-sidebar-background, #fafafa);
    color: var(--text-color, inherit);
    font-weight: bold;
  }

  .empty-row {
    text-align: center;
    color: var(--text-color, inherit);
    opacity: 0.6;
    padding: 30px !important;
  }

  .api-status-ok {
    color: var(--color-background-positive, #2ecc71);
    font-weight: bold;
  }

  .api-status-error {
    color: var(--color-background-negative, #e74c3c);
    font-weight: bold;
  }

  .api-error-msg {
    color: var(--color-background-negative, #e74c3c);
    font-size: 0.85em;
    margin-top: 4px;
  }

  .api-balances {
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 0.9em;
  }

  .api-actions {
    white-space: nowrap;
  }

  .api-actions button {
    margin-right: 5px;
  }

  .btn {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid var(--border, #ccc);
    background: var(--background, #fff);
    color: var(--text-color, inherit);
    cursor: pointer;
    font-size: 0.85em;
  }

  .btn:hover:not(:disabled) {
    background: var(--color-sidebar-background, #f5f5f5);
  }

  .btn-primary {
    background: var(--primary, #0066cc);
    color: #fff;
    border-color: var(--primary, #0066cc);
  }

  .btn-primary:hover:not(:disabled) {
    background: #0052a3;
  }

  .spinner {
    display: inline-block;
    width: 0.85rem;
    height: 0.85rem;
    border: 2px solid rgba(128, 128, 128, 0.3);
    border-radius: 50%;
    border-top-color: currentColor;
    animation: spin 1s linear infinite;
    vertical-align: text-bottom;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
