/**
 * API Importer Configuration Manager JS
 */

export default {
    init: async function() {
        console.log("API Config Manager JS Module Loaded");
    },

    onExtensionPageLoad: async function() {
        console.log("API Config Manager Page Loaded");
        const root = document.getElementById('api-config-root');
        if (!root) return;

        const extBaseUrl = window.location.pathname.split("extension/")[0] + "extension/BankSync/";
        const dashboardUrl = extBaseUrl + "dashboard";
        const configUrl = extBaseUrl + "config";
        const syncUrl = extBaseUrl + "sync";
        const createUrl = extBaseUrl + "create";
        const schemaUrl = extBaseUrl + "schema";

        // Reset state for new DOM
        let currentFile = null;
        let editor = null;
        let schema = null;
        let monacoLib = null;

        // Ensure JS YAML is loaded
        if (!window.jsyaml) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js');
        }
        // Ensure Ajv is loaded
        if (!window.ajv7) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/ajv/8.12.0/ajv7.min.js');
        }

        const ajv = new window.ajv7({ strict: false });
        // Add dummy formats to prevent ajv from throwing on Pydantic's format keywords
        ['date', 'date-time', 'uuid', 'uri', 'url', 'email', 'ipv4', 'ipv6'].forEach(fmt => {
            try { ajv.addFormat(fmt, true); } catch(e) {}
        });

        let validateSchema = null;

        // Load initial sidebar data immediately
        loadDashboard();

        // Load Monaco
        if (!window.require) {
            await loadScript('https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js');
        }

        window.require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
        window.require(['vs/editor/editor.main'], async function(monaco) {
            monacoLib = monaco;

            const container = document.getElementById('editor-container');
            if (!container) return; // In case user navigated away before Monaco loaded

            // Create editor instance
            editor = monaco.editor.create(container, {
                value: '',
                language: 'yaml',
                theme: 'vs-light',
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: 'monospace'
            });

            // Handle changes for validation
            editor.onDidChangeModelContent(() => {
                document.getElementById('btn-editor-save').disabled = false;
                validateYaml();
            });

            // Load schema for validation
            await fetchSchema();
        });

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        async function fetchSchema() {
            try {
                const res = await fetch(schemaUrl);
                schema = await res.json();
                try {
                    validateSchema = ajv.compile(schema);
                } catch(e) {
                    console.warn("Failed to compile JSON schema:", e);
                }
            } catch(e) {
                console.error("Failed to load schema:", e);
            }
        }

        function validateYaml() {
            if (!schema || !editor || !monacoLib) return;

            const value = editor.getValue();
            let parsed = null;
            const markers = [];

            try {
                parsed = window.jsyaml.load(value);
            } catch (e) {
                markers.push({
                    severity: monacoLib.MarkerSeverity.Error,
                    startLineNumber: e.mark ? e.mark.line + 1 : 1,
                    startColumn: e.mark ? e.mark.column + 1 : 1,
                    endLineNumber: e.mark ? e.mark.line + 1 : 1,
                    endColumn: 100,
                    message: e.message
                });
                monacoLib.editor.setModelMarkers(editor.getModel(), 'yaml', markers);
                return;
            }

            if (parsed && validateSchema) {
                try {
                    const valid = validateSchema(parsed);
                    if (!valid) {
                        validateSchema.errors.forEach(err => {
                            markers.push({
                                severity: monacoLib.MarkerSeverity.Warning,
                                startLineNumber: 1,
                                startColumn: 1,
                                endLineNumber: 1,
                                endColumn: 100,
                                message: `${err.instancePath} ${err.message}`
                            });
                        });
                    }
                } catch(e) {
                    console.warn("AJV evaluation error", e);
                }
            }

            monacoLib.editor.setModelMarkers(editor.getModel(), 'yaml', markers);
        }

        async function loadDashboard() {
            try {
                const res = await fetch(dashboardUrl);
                const data = await res.json();
                if (data.status === 'success') {
                    renderDashboard(data.items);
                } else {
                    console.error("Error loading dashboard:", data.message);
                }
            } catch(e) {
                console.error("Fetch error:", e);
            }
        }

        function renderDashboard(items) {
            const tbody = document.getElementById('api-table-body');
            tbody.innerHTML = '';

            if (items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No integrations configured.</td></tr>';
                return;
            }

            items.forEach((item, idx) => {
                const tr = document.createElement('tr');

                let statusHtml = '';
                if (item.status === 'ok') {
                    statusHtml = `<div class="api-status-ok">OK</div>`;
                } else {
                    statusHtml = `<div class="api-status-error">Error</div>`;
                    if (item.error_msg) {
                        statusHtml += `<div class="api-error-msg">${item.error_msg}</div>`;
                    }
                }

                let lastSyncStr = item.last_sync ? new Date(item.last_sync).toLocaleString() : 'Never';

                tr.innerHTML = `
                    <td><strong>${item.filename}</strong></td>
                    <td>${item.importer_name}</td>
                    <td><div class="api-balances">${item.balances || '-'}</div></td>
                    <td>${lastSyncStr}</td>
                    <td>${statusHtml}</td>
                    <td class="api-actions">
                        <button class="btn btn-sync" data-idx="${idx}">Sync</button>
                        <button class="btn btn-primary btn-import" data-idx="${idx}">Import</button>
                        <button class="btn btn-edit" data-idx="${idx}">Edit</button>
                    </td>
                `;
                tbody.appendChild(tr);

                // Attach event listeners
                tr.querySelector('.btn-sync').onclick = async function() {
                    const btn = this;
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner"></span> Syncing...';
                    try {
                        const res = await fetch(syncUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: item.filename })
                        });
                        const data = await res.json();
                        if (data.status === 'success') {
                            await loadDashboard();
                        } else {
                            alert("Sync failed: " + data.message);
                        }
                    } catch(e) {
                        alert("Sync error: " + e.message);
                    } finally {
                        btn.disabled = false;
                        btn.innerText = 'Sync';
                        await loadDashboard(); // refresh anyway to catch new mtimes
                    }
                };

                tr.querySelector('.btn-import').onclick = () => {
                    if (!item.path) return;
                    window.location.hash = `extract?filename=${encodeURIComponent(item.path)}&importer=API+Importer`;
                };

                tr.querySelector('.btn-edit').onclick = () => openEditorModal(item);
            });
        }

        // --- Modals Logic ---

        async function openEditorModal(item) {
            currentFile = item;
            document.getElementById('editor-modal-title').innerText = `Edit ${item.filename}`;
            document.getElementById('editor-modal').style.display = 'flex';

            if (editor) {
                editor.setValue("Loading...");
                document.getElementById('btn-editor-save').disabled = true;

                try {
                    const res = await fetch(`${configUrl}?name=${encodeURIComponent(item.filename)}`);
                    const data = await res.json();
                    if (data.status === 'success') {
                        editor.setValue(data.content);
                        document.getElementById('btn-editor-save').disabled = true; // disabled until changed
                    } else {
                        editor.setValue(`Error: ${data.message}`);
                    }
                } catch(e) {
                    editor.setValue(`Failed to load file: ${e.message}`);
                }
            }
        }

        function closeEditorModal() {
            document.getElementById('editor-modal').style.display = 'none';
            currentFile = null;
        }

        document.getElementById('btn-editor-close').onclick = closeEditorModal;
        document.getElementById('btn-editor-cancel').onclick = closeEditorModal;

        document.getElementById('btn-editor-save').onclick = async () => {
            if (!currentFile || !editor) return;
            const content = editor.getValue();

            try {
                const res = await fetch(configUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: currentFile.filename, content: content })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    closeEditorModal();
                    await loadDashboard();
                } else {
                    alert("Save failed: " + data.message);
                }
            } catch(e) {
                alert("Save error: " + e.message);
            }
        };

        document.getElementById('btn-editor-delete').onclick = async () => {
            if (!currentFile) return;
            if (!confirm(`Delete ${currentFile.filename}?`)) return;

            try {
                const res = await fetch(`${configUrl}?name=${encodeURIComponent(currentFile.filename)}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                if (data.status === 'success') {
                    closeEditorModal();
                    await loadDashboard();
                } else {
                    alert("Delete failed: " + data.message);
                }
            } catch(e) {
                alert("Delete error: " + e.message);
            }
        };

        // --- New Integration Modal ---

        document.getElementById('btn-add-new').onclick = () => {
            document.getElementById('new-integration-modal').style.display = 'flex';
        };

        function closeNewModal() {
            document.getElementById('new-integration-modal').style.display = 'none';
        }

        document.getElementById('btn-new-close').onclick = closeNewModal;
        document.getElementById('btn-new-cancel').onclick = closeNewModal;

        document.getElementById('btn-new-create').onclick = async () => {
            const name = document.getElementById('new-name').value.trim();
            const type = document.getElementById('new-importer-type').value;

            if (!name.startsWith("api_") || !name.endswith(".yaml")) {
                alert("Name must start with 'api_' and end with '.yaml'");
                return;
            }

            try {
                const res = await fetch(createUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, importer_type: type })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    closeNewModal();
                    await loadDashboard();
                    // automatically open editor
                    openEditorModal({ filename: name });
                } else {
                    alert("Create failed: " + data.message);
                }
            } catch(e) {
                alert("Create error: " + e.message);
            }
        };
    }
};
