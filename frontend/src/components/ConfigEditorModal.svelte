<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { ImporterStatus } from "../types";
  import { getBaseExtensionUrl } from "../lib/ledger";

  interface Props {
    item: ImporterStatus;
    onSave: () => void;
    onDelete: () => void;
    onClose: () => void;
    onError: (msg: string) => void;
  }

  let { item, onSave, onDelete, onClose, onError }: Props = $props();

  let editorContainer: HTMLDivElement | null = $state(null);
  let editor: any = null;
  let isSaving = $state(false);
  let isDeleting = $state(false);
  let hasChanges = $state(false);

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  async function initMonaco() {
    if (!window.jsyaml) {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"
      );
    }
    if (!window.ajv7) {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/ajv/8.12.0/ajv7.min.js"
      );
    }

    const ajv = new window.ajv7({ strict: false });
    ["date", "date-time", "uuid", "uri", "url", "email", "ipv4", "ipv6"].forEach(
      (fmt) => {
        try {
          ajv.addFormat(fmt, true);
        } catch (_) {}
      }
    );

    let validateSchema: any = null;
    try {
      const res = await fetch(`${getBaseExtensionUrl()}schema`);
      const schema = await res.json();
      validateSchema = ajv.compile(schema);
    } catch (e) {
      console.warn("Failed to compile schema:", e);
    }

    if (!window.require) {
      await loadScript(
        "https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js"
      );
    }

    window.require.config({
      paths: { vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs" },
    });

    window.require(["vs/editor/editor.main"], async (monaco: any) => {
      if (!editorContainer) return;

      editor = monaco.editor.create(editorContainer, {
        value: "Loading...",
        language: "yaml",
        theme: "vs-light",
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        fontFamily: "monospace",
      });

      editor.onDidChangeModelContent(() => {
        hasChanges = true;
        validate(monaco, validateSchema);
      });

      try {
        const res = await fetch(
          `${getBaseExtensionUrl()}config?name=${encodeURIComponent(item.filename)}`
        );
        const data = await res.json();
        if (data.status === "success") {
          editor.setValue(data.content);
          hasChanges = false;
        } else {
          editor.setValue(`Error: ${data.message}`);
        }
      } catch (e: any) {
        editor.setValue(`Failed to load file: ${e.message}`);
      }
    });
  }

  function validate(monaco: any, validateSchema: any) {
    if (!editor) return;
    const value = editor.getValue();
    const markers: any[] = [];

    let parsed: any = null;
    try {
      parsed = window.jsyaml.load(value);
    } catch (e: any) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: e.mark ? e.mark.line + 1 : 1,
        startColumn: e.mark ? e.mark.column + 1 : 1,
        endLineNumber: e.mark ? e.mark.line + 1 : 1,
        endColumn: 100,
        message: e.message,
      });
      monaco.editor.setModelMarkers(editor.getModel(), "yaml", markers);
      return;
    }

    if (parsed && validateSchema) {
      try {
        const valid = validateSchema(parsed);
        if (!valid && validateSchema.errors) {
          validateSchema.errors.forEach((err: any) => {
            markers.push({
              severity: monaco.MarkerSeverity.Warning,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 100,
              message: `${err.instancePath} ${err.message}`,
            });
          });
        }
      } catch (_) {}
    }

    monaco.editor.setModelMarkers(editor.getModel(), "yaml", markers);
  }

  async function handleSave() {
    if (!editor) return;
    isSaving = true;
    try {
      const content = editor.getValue();
      const res = await fetch(`${getBaseExtensionUrl()}config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.filename, content }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onSave();
      } else {
        onError("Save failed: " + data.message);
      }
    } catch (e: any) {
      onError("Save error: " + e.message);
    } finally {
      isSaving = false;
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${item.filename}?`)) return;
    isDeleting = true;
    try {
      const res = await fetch(
        `${getBaseExtensionUrl()}config?name=${encodeURIComponent(item.filename)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.status === "success") {
        onDelete();
      } else {
        onError("Delete failed: " + data.message);
      }
    } catch (e: any) {
      onError("Delete error: " + e.message);
    } finally {
      isDeleting = false;
    }
  }

  onMount(() => {
    initMonaco();
  });

  onDestroy(() => {
    if (editor) {
      editor.dispose();
    }
  });
</script>

<div class="modal-overlay">
  <div class="modal-card">
    <div class="modal-header">
      <h3>Edit Configuration &mdash; <code>{item.filename}</code></h3>
      <button type="button" class="btn-close" onclick={onClose}>&times;</button>
    </div>

    <div class="modal-body">
      <div class="editor-container" bind:this={editorContainer}></div>
    </div>

    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-delete"
        disabled={isDeleting}
        onclick={handleDelete}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      <div class="footer-actions">
        <button type="button" class="btn" onclick={onClose}>Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          disabled={isSaving || !hasChanges}
          onclick={handleSave}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
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
    width: 80vw;
    height: 80vh;
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
    flex: 1;
    position: relative;
    padding: 10px;
  }

  .editor-container {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid var(--border, #ddd);
  }

  .modal-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border, #ddd);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-actions {
    display: flex;
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

  .btn-delete {
    color: var(--color-background-negative, #e74c3c);
    border-color: rgba(231, 76, 60, 0.3);
  }

  .btn-delete:hover:not(:disabled) {
    background: rgba(231, 76, 60, 0.1);
  }
</style>
