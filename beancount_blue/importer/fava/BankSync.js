/**
 * Beancount Blue Fava Extension JS
 */

async function waitForJSONEditor() {
    for (let i = 0; i < 50; i++) {
        if (window.JSONEditor) return true;
        await new Promise(r => setTimeout(r, 100));
    }
    return false;
}

export default {
    init: async function() {
        console.log("BankSync JS Initialized");

        const container = document.getElementById('json-editor-container');
        if (!container) {
            // Not on the extension page or it's not rendered yet
            return;
        }

        const extBaseUrl = window.location.pathname.split("extension/")[0] + "extension/BankSync/";
        const saveUrl = extBaseUrl + "save_config";
        const syncUrl = extBaseUrl + "sync";
        const generateUrl = extBaseUrl + "generate";
        const schemaUrl = extBaseUrl + "schema";

        function showAlert(msg, isError = false) {
            const alertContainer = document.getElementById('alerts-container');
            if (!alertContainer) return;
            const alert = document.createElement('div');
            alert.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
            alert.innerHTML = `<span>${isError ? '❌' : '✅'} ${msg}</span>`;

            // Add close button
            const close = document.createElement('button');
            close.innerHTML = '&times;';
            close.style.background = 'none';
            close.style.border = 'none';
            close.style.color = 'inherit';
            close.style.cursor = 'pointer';
            close.style.fontSize = '1.5em';
            close.onclick = () => alert.remove();
            alert.appendChild(close);

            alertContainer.appendChild(alert);
            if (!isError) setTimeout(() => alert.remove(), 8000);
        }

        function showHandoffAlert(msg) {
            const alertContainer = document.getElementById('alerts-container');
            if (!alertContainer) return;
            const alert = document.createElement('div');
            alert.className = 'alert alert-info';
            const importUrl = window.location.pathname.split("extension/")[0] + "import/";
            alert.innerHTML = `
                <span>✨ ${msg}</span>
                <a href="${importUrl}" class="handoff-btn">Review in Import Tab &rarr;</a>
            `;

            const close = document.createElement('button');
            close.innerHTML = '&times;';
            close.style.background = 'none';
            close.style.border = 'none';
            close.style.color = 'inherit';
            close.style.cursor = 'pointer';
            close.style.fontSize = '1.5em';
            close.onclick = () => alert.remove();
            alert.appendChild(close);

            alertContainer.appendChild(alert);
        }

        // Initialize JSON Editor
        let editor = null;
        const hasEditor = await waitForJSONEditor();

        if (hasEditor && container) {
            try {
                const schemaRes = await fetch(schemaUrl);
                const schema = await schemaRes.json();

                // Wrap the schema to map directly to the config object keys
                const rootSchema = {
                    type: "object",
                    title: "Active Importers",
                    $defs: schema.$defs || {},
                    properties: {
                        monzo: { type: "array", title: "Monzo Connections", format: "tabs", items: { $ref: "#/$defs/MonzoImporter" } },
                        starling: { type: "array", title: "Starling Connections", format: "tabs", items: { $ref: "#/$defs/StarlingImporter" } },
                        truelayer: { type: "array", title: "TrueLayer Connections", format: "tabs", items: { $ref: "#/$defs/TrueLayerImporter" } }
                    }
                };

                const currentConfig = window.beancountBlueConfig || {};
                const editorData = {
                    monzo: Array.isArray(currentConfig.monzo) ? currentConfig.monzo : (currentConfig.monzo ? [currentConfig.monzo] : []),
                    starling: Array.isArray(currentConfig.starling) ? currentConfig.starling : (currentConfig.starling ? [currentConfig.starling] : []),
                    truelayer: Array.isArray(currentConfig.truelayer) ? currentConfig.truelayer : (currentConfig.truelayer ? [currentConfig.truelayer] : [])
                };

                editor = new window.JSONEditor(container, {
                    schema: rootSchema,
                    startval: editorData,
                    theme: 'html',
                    disable_edit_json: true,
                    disable_properties: true
                });

                console.log("JSON Editor initialized with data:", editorData);
            } catch (err) {
                console.error("Failed to initialize JSON Editor:", err);
                container.innerText = "Error loading configuration editor: " + err.message;
            }
        } else if (container) {
            container.innerText = "JSON Editor library not found. Please check your internet connection or CDN availability.";
        }

        const btnSave = document.getElementById('btn-save-config');
        if (btnSave) {
            btnSave.onclick = async () => {
                if (!editor) return;
                const errors = editor.validate();
                if (errors.length) {
                    showAlert("Please fix validation errors before saving: " + errors.map(e => e.message).join(", "), true);
                    return;
                }

                const editorData = editor.getValue();
                const groupedData = {};

                // Preserve global config
                if (window.beancountBlueConfig && window.beancountBlueConfig.global) {
                    groupedData.global = window.beancountBlueConfig.global;
                }

                // Add configured importers, stripping out empty arrays
                for (const key of ['monzo', 'starling', 'truelayer']) {
                    if (editorData[key] && editorData[key].length > 0) {
                        groupedData[key] = editorData[key].map(item => {
                            const cleaned = { ...item };
                            delete cleaned.importer_name;
                            return cleaned;
                        });
                    }
                }

                try {
                    const res = await fetch(saveUrl, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({content: groupedData})
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        showAlert("Configuration saved successfully. Reloading...");
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showAlert("Error saving config: " + data.message, true);
                    }
                } catch (err) {
                    showAlert("Failed to save configuration: " + err.message, true);
                }
            };
        }

        // Action Buttons (Sync/Generate)
        document.querySelectorAll('.btn-sync').forEach(btn => {
            btn.onclick = async (e) => {
                const button = e.currentTarget;
                const originalText = button.innerText;
                button.disabled = true;
                button.innerText = "Syncing...";

                try {
                    const res = await fetch(syncUrl, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            bank: button.getAttribute('data-bank'),
                            idx: button.getAttribute('data-idx')
                        })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        showAlert(`Successfully synced API data.`);
                        button.innerText = "Sync API ✅";
                    } else {
                        showAlert(`Error: ${data.message}`, true);
                        button.innerText = "Sync Failed ❌";
                    }
                } catch (err) {
                    showAlert("Sync failed: " + err.message, true);
                } finally {
                    setTimeout(() => {
                        button.disabled = false;
                        button.innerText = originalText;
                    }, 3000);
                }
            };
        });

        document.querySelectorAll('.btn-generate').forEach(btn => {
            btn.onclick = async (e) => {
                const button = e.currentTarget;
                const originalText = button.innerText;
                button.disabled = true;
                button.innerText = "Generating...";

                try {
                    const res = await fetch(generateUrl, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            bank: button.getAttribute('data-bank'),
                            idx: button.getAttribute('data-idx')
                        })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        showHandoffAlert(`Generated import file.`);
                        button.innerText = "Generate Beancount ✅";
                    } else {
                        showAlert(`Error: ${data.message}`, true);
                        button.innerText = "Generation Failed ❌";
                    }
                } catch (err) {
                    showAlert("Generation failed: " + err.message, true);
                } finally {
                    setTimeout(() => {
                        button.disabled = false;
                        button.innerText = originalText;
                    }, 3000);
                }
            };
        });
    }
};
