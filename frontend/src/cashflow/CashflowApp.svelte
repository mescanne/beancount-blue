<script lang="ts">
  import { onMount } from "svelte";
  import type { ModelInfo, SimulationTrace } from "./types";
  import ParamControls from "./components/ParamControls.svelte";
  import SummaryCards from "./components/SummaryCards.svelte";
  import WaterfallChart from "./components/WaterfallChart.svelte";
  import DepletionChart from "./components/DepletionChart.svelte";

  let modelInfo = $state<ModelInfo | null>(null);
  let paramValues = $state<Record<string, any>>({});
  let trace = $state<SimulationTrace | null>(null);
  let loading = $state(true);
  let simulating = $state(false);
  let error = $state<string | null>(null);

  let debounceTimer: any = null;

  function getBaseUrl(): string {
    const parts = window.location.pathname.split("extension/");
    return (parts[0] || "/") + "extension/Cashflow/";
  }

  async function loadParams(modelToLoad?: string) {
    loading = true;
    error = null;
    try {
      const url =
        getBaseUrl() +
        "params" +
        (modelToLoad ? `?model=${encodeURIComponent(modelToLoad)}` : "");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message || "Failed to load params");

      modelInfo = data;
      // Initialize defaults
      const defaults: Record<string, any> = {};
      for (const [k, v] of Object.entries(data.params as Record<string, any>)) {
        defaults[k] = v.default;
      }
      paramValues = defaults;

      // Run initial simulation
      await runSim(defaults, data.model_name);
    } catch (e: any) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  }

  async function runSim(valuesToUse = paramValues, modelName = modelInfo?.model_name) {
    if (!modelInfo) return;
    simulating = true;
    try {
      const res = await fetch(getBaseUrl() + "simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelName,
          overrides: valuesToUse,
          start_year: modelInfo.start_year,
          end_year: modelInfo.end_year,
        }),
      });
      if (!res.ok) throw new Error(`Simulation failed: HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message || "Simulation error");
      trace = data.trace;
    } catch (e: any) {
      error = e.message || String(e);
    } finally {
      simulating = false;
    }
  }

  function handleModelChange(newModel: string) {
    if (newModel !== modelInfo?.model_name) {
      loadParams(newModel);
    }
  }

  function handleParamChange(name: string, val: any) {
    paramValues[name] = val;
    // Debounce simulation calls by 40ms for ultra-responsive slider dragging
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      runSim();
    }, 40);
  }

  function resetDefaults() {
    if (!modelInfo) return;
    const defaults: Record<string, any> = {};
    for (const [k, v] of Object.entries(modelInfo.params)) {
      defaults[k] = v.default;
    }
    paramValues = defaults;
    runSim(defaults);
  }

  onMount(() => {
    loadParams();
  });
</script>

<div class="cashflow-app">
  <header class="app-header">
    <div class="header-left">
      <h2 class="app-title">Lifetime Cashflow & Decumulation</h2>
      {#if modelInfo}
        {#if modelInfo.models && modelInfo.models.length > 1}
          <div class="scenario-selector">
            <label for="scenario-dropdown" class="scenario-label">Scenario:</label>
            <select
              id="scenario-dropdown"
              class="scenario-dropdown"
              value={modelInfo.model_name}
              onchange={(e) => handleModelChange(e.currentTarget.value)}
              disabled={simulating}
            >
              {#each modelInfo.models as m}
                <option value={m}>{m}</option>
              {/each}
            </select>
          </div>
        {:else}
          <span class="model-badge">
            Model: <strong>{modelInfo.model_name}</strong>
          </span>
        {/if}
        {#if modelInfo.is_demo}
          <span class="demo-badge">Demo Mode (household_model.py not found)</span>
        {/if}
      {/if}
    </div>
    <div class="header-actions">
      <button class="reset-button" onclick={resetDefaults} disabled={simulating}>
        Reset Defaults
      </button>
    </div>
  </header>

  {#if error}
    <div class="error-banner">
      <strong>Error:</strong> {error}
      <button class="dismiss-btn" onclick={() => (error = null)}>✕</button>
    </div>
  {/if}

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Initializing simulation engine and loading ledger data...</p>
    </div>
  {:else if modelInfo}
    <SummaryCards {trace} />

    <div class="main-layout">
      <aside class="sidebar">
        <ParamControls
          params={modelInfo.params}
          values={paramValues}
          onchange={handleParamChange}
        />
      </aside>

      <main class="content-charts">
        <WaterfallChart {trace} />
        <DepletionChart {trace} />
      </main>
    </div>
  {/if}
</div>

<style>
  .cashflow-app {
    padding: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    color: var(--text-color, #2d3748);
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color, #e2e8f0);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .app-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .model-badge {
    font-size: 0.85rem;
    color: var(--text-muted, #718096);
  }

  .scenario-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .scenario-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted, #718096);
  }

  .scenario-dropdown {
    background: var(--background, #ffffff);
    border: 1px solid var(--border-color, #cbd5e0);
    border-radius: 6px;
    padding: 0.3rem 0.7rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-color, #2b6cb0);
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .scenario-dropdown:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  .demo-badge {
    font-size: 0.75rem;
    font-weight: 600;
    background: #feebc8;
    color: #c05621;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  .reset-button {
    background: var(--background, #ffffff);
    border: 1px solid var(--border-color, #cbd5e0);
    border-radius: 6px;
    padding: 0.4rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-color, #4a5568);
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .reset-button:hover:not(:disabled) {
    background: var(--background-secondary, #edf2f7);
  }

  .reset-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff5f5;
    border: 1px solid #feb2b2;
    color: #c53030;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1.25rem;
  }

  .dismiss-btn {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #c53030;
  }

  .loading-state {
    padding: 4rem 1rem;
    text-align: center;
    color: var(--text-muted, #718096);
  }

  .spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #cbd5e0;
    border-top-color: #3182ce;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .main-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 960px) {
    .main-layout {
      grid-template-columns: 1fr;
    }
  }

  .content-charts {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
