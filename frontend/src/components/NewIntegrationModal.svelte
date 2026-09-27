<script lang="ts">
  import { getBaseExtensionUrl } from "../lib/ledger";

  interface Props {
    onCreated: (filename: string) => void;
    onClose: () => void;
    onError: (msg: string) => void;
  }

  let { onCreated, onClose, onError }: Props = $props();

  let name = $state("api_new.yaml");
  let importerType = $state("monzo");
  let isCreating = $state(false);

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed.startsWith("api_") || !trimmed.endsWith(".yaml")) {
      onError("Name must start with 'api_' and end with '.yaml'");
      return;
    }

    isCreating = true;
    try {
      const res = await fetch(`${getBaseExtensionUrl()}create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, importer_type: importerType }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onCreated(trimmed);
      } else {
        onError("Create failed: " + data.message);
      }
    } catch (e: any) {
      onError("Create error: " + e.message);
    } finally {
      isCreating = false;
    }
  }
</script>

<div class="modal-overlay">
  <div class="modal-card">
    <div class="modal-header">
      <h3>New Integration</h3>
      <button type="button" class="btn-close" onclick={onClose}>&times;</button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label for="new-int-name">File Name</label>
        <input
          id="new-int-name"
          type="text"
          placeholder="api_mybank.yaml"
          bind:value={name}
        />
      </div>
      <div class="form-group">
        <label for="new-int-type">Importer Type</label>
        <select id="new-int-type" bind:value={importerType}>
          <option value="monzo">Monzo</option>
          <option value="starling">Starling</option>
          <option value="truelayer">TrueLayer</option>
        </select>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn" onclick={onClose}>Cancel</button>
      <button
        type="button"
        class="btn btn-primary"
        disabled={isCreating}
        onclick={handleCreate}
      >
        {isCreating ? "Creating..." : "Create"}
      </button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-card {
    background: var(--background, #fff);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 420px;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border, #ddd);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.1em;
  }

  .btn-close {
    background: transparent;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    line-height: 1;
    color: var(--text-color, inherit);
  }

  .modal-body {
    padding: 16px;
  }

  .form-group {
    margin-bottom: 14px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: bold;
    font-size: 0.9em;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border, #ccc);
    border-radius: 4px;
    background: var(--background, #fff);
    color: var(--text-color, inherit);
    box-sizing: border-box;
    font-size: 0.95em;
  }

  .modal-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border, #ddd);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .btn {
    padding: 6px 14px;
    border-radius: 4px;
    border: 1px solid var(--border, #ccc);
    background: var(--background, #fff);
    color: var(--text-color, inherit);
    cursor: pointer;
    font-size: 0.9em;
  }

  .btn-primary {
    background: var(--primary, #0066cc);
    color: #fff;
    border-color: var(--primary, #0066cc);
  }

  .btn-primary:hover:not(:disabled) {
    background: #0052a3;
  }
</style>
