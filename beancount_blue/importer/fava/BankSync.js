/**
 * API Importer Configuration Manager JS
 */

export default {
    init: async function() {
        console.log("API Config Manager Initialized");
        const root = document.getElementById('api-config-root');
        if (!root) return;

        const extBaseUrl = window.location.pathname.split("extension/")[0] + "extension/BankSync/";
        const getConfigsUrl = extBaseUrl + "configs";
        const configUrl = extBaseUrl + "config";
        const schemaUrl = extBaseUrl + "schema";

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

        const ajv = new window.ajv7();

        // Load Monaco
        if (!window.require) {
            await loadScript('https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js');
        }

        window.require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
        window.require(['vs/editor/editor.main'], async function(monaco) {
            monacoLib = monaco;

            // Create editor instance
            editor = monaco.editor.create(document.getElementById('editor-container'), {
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
                validateYaml();
                document.getElementById('btn-save').disabled = false;
            });

            // Load initial data
            await fetchSchema();
            await loadConfigs();
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

            if (parsed) {
                const validate = ajv.compile(schema);
                const valid = validate(parsed);
                if (!valid) {
                    validate.errors.forEach(err => {
                        // Rough mapping of JSON path to line number would be complex,
                        // just show at top for simplicity in CDN context
                        markers.push({
                            severity: monacoLib.MarkerSeverity.Error,
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: 1,
                            endColumn: 100,
                            message: `${err.instancePath} ${err.message}`
                        });
                    });
                }
            }

            monacoLib.editor.setModelMarkers(editor.getModel(), 'yaml', markers);
        }

        async function loadConfigs() {
            try {
                const res = await fetch(getConfigsUrl);
                const data = await res.json();
                if (data.status === 'success') {
                    renderSidebar(data.files);
                } else {
                    console.error("Error loading configs:", data.message);
                }
            } catch(e) {
                console.error("Fetch error:", e);
            }
        }

        function renderSidebar(files) {
            const list = document.getElementById('api-file-list');
            list.innerHTML = '';

            files.forEach(f => {
                const div = document.createElement('div');
                div.className = 'api-file-item';
                div.innerText = f.name;
                div.onclick = () => selectFile(f);
                if (currentFile && currentFile.name === f.name) {
                    div.classList.add('active');
                }
                list.appendChild(div);
            });

            const btnNew = document.createElement('button');
            btnNew.className = 'api-file-item';
            btnNew.style.width = '100%';
            btnNew.style.marginTop = '1rem';
            btnNew.innerText = '+ New Config';
            btnNew.onclick = createNewConfig;
            list.appendChild(btnNew);
        }

        async function selectFile(file) {
            currentFile = file;
            document.querySelectorAll('.api-file-item').forEach(el => {
                el.classList.toggle('active', el.innerText === file.name);
            });

            try {
                const res = await fetch(`${configUrl}?name=${encodeURIComponent(file.name)}`);
                const data = await res.json();
                if (data.status === 'success') {
                    if(editor) {
                        editor.setValue(data.content);
                        document.getElementById('btn-save').disabled = true;
                        document.getElementById('btn-import').disabled = false;
                        document.getElementById('btn-delete').disabled = false;
                        document.getElementById('current-file-name').innerText = file.name;
                    }
                }
            } catch(e) {
                console.error("Failed to load file:", e);
            }
        }

        function createNewConfig() {
            const name = prompt("Enter new filename (must end in .yaml, e.g., api_monzo.yaml):", "api_new.yaml");
            if (name && name.startsWith("api_") && name.endsWith(".yaml")) {
                currentFile = { name: name, path: "" }; // Path populated on save
                if(editor) {
                    const stub = `importer_name: monzo\nclient_id: ""\nclient_secret: ""\naccount_map:\n  "acc_123": "Assets:Bank"\n`;
                    editor.setValue(stub);
                    document.getElementById('btn-save').disabled = false;
                    document.getElementById('btn-import').disabled = true;
                    document.getElementById('btn-delete').disabled = true;
                    document.getElementById('current-file-name').innerText = name + " (Unsaved)";
                }
                // Mock active in sidebar
                document.querySelectorAll('.api-file-item').forEach(el => el.classList.remove('active'));
            } else if (name) {
                alert("Name must start with 'api_' and end with '.yaml'");
            }
        }

        document.getElementById('btn-save').onclick = async () => {
            if (!currentFile || !editor) return;
            const content = editor.getValue();

            try {
                const res = await fetch(configUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: currentFile.name, content: content })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    currentFile.path = data.path;
                    document.getElementById('btn-save').disabled = true;
                    document.getElementById('btn-import').disabled = false;
                    document.getElementById('btn-delete').disabled = false;
                    document.getElementById('current-file-name').innerText = currentFile.name;
                    await loadConfigs(); // refresh list to ensure it's there
                } else {
                    alert("Save failed: " + data.message);
                }
            } catch(e) {
                alert("Save error: " + e.message);
            }
        };

        document.getElementById('btn-delete').onclick = async () => {
            if (!currentFile) return;
            if (!confirm(`Delete ${currentFile.name}?`)) return;

            try {
                const res = await fetch(`${configUrl}?name=${encodeURIComponent(currentFile.name)}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                if (data.status === 'success') {
                    currentFile = null;
                    if(editor) editor.setValue('');
                    document.getElementById('btn-save').disabled = true;
                    document.getElementById('btn-import').disabled = true;
                    document.getElementById('btn-delete').disabled = true;
                    document.getElementById('current-file-name').innerText = 'Select a file';
                    await loadConfigs();
                } else {
                    alert("Delete failed: " + data.message);
                }
            } catch(e) {
                alert("Delete error: " + e.message);
            }
        };

        document.getElementById('btn-import').onclick = () => {
            if (!currentFile || !currentFile.path) return;
            // Native Fava delegation!
            const favaImportUrl = "/import?auto_extract=" + encodeURIComponent(currentFile.path) + "&importer=API+Importer";
            window.location.href = favaImportUrl;
        };
    }
};
