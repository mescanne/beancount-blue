<script lang="ts">
  import type { ParamDefinition } from "../types";

  let {
    params,
    values,
    onchange,
  }: {
    params: Record<string, ParamDefinition>;
    values: Record<string, any>;
    onchange: (name: string, val: any) => void;
  } = $props();

  // Group parameters by their declared group attribute
  let groupedParams = $derived.by(() => {
    const groups: Record<string, Array<{ name: string; def: ParamDefinition }>> = {};
    for (const [name, def] of Object.entries(params)) {
      const g = def.group || "General";
      if (!groups[g]) groups[g] = [];
      groups[g].push({ name, def });
    }
    return groups;
  });

  function handleInput(name: string, event: Event) {
    const target = event.target as HTMLInputElement;
    let val: any = target.value;
    const def = params[name];

    if (def.type === "int") {
      val = parseInt(val, 10);
    } else if (def.type === "float") {
      val = parseFloat(val);
    }
    onchange(name, val);
  }
</script>

<div class="param-controls">
  {#each Object.entries(groupedParams) as [groupName, items]}
    <div class="param-group">
      <h4 class="group-title">{groupName}</h4>
      <div class="group-items">
        {#each items as { name, def }}
          <div class="param-item">
            <div class="param-header">
              <label for={"param-" + name} class="param-label" title={def.description}>
                {def.label || name}
              </label>
              <div class="param-value-box">
                <input
                  id={"param-" + name}
                  type="number"
                  class="number-input"
                  min={def.min ?? undefined}
                  max={def.max ?? undefined}
                  step={def.step ?? (def.type === "float" ? "0.01" : "1")}
                  value={values[name] ?? def.default}
                  oninput={(e) => handleInput(name, e)}
                />
                {#if def.unit}
                  <span class="unit-badge">{def.unit}</span>
                {/if}
              </div>
            </div>

            {#if def.min !== null && def.max !== null}
              <div class="slider-row">
                <span class="bound-label">{def.min}</span>
                <input
                  type="range"
                  class="range-slider"
                  min={def.min}
                  max={def.max}
                  step={def.step ?? (def.type === "float" ? "0.005" : "1")}
                  value={values[name] ?? def.default}
                  oninput={(e) => handleInput(name, e)}
                />
                <span class="bound-label">{def.max}</span>
              </div>
            {/if}

            {#if def.description}
              <div class="param-desc">{def.description}</div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .param-controls {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .param-group {
    background: var(--background-secondary, #f8f9fa);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    padding: 1rem;
  }

  .group-title {
    margin: 0 0 0.85rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-muted, #4a5568);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border-color, #edf2f7);
    padding-bottom: 0.35rem;
  }

  .group-items {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .param-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .param-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .param-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-color, #2d3748);
  }

  .param-value-box {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .number-input {
    width: 5.5rem;
    padding: 0.25rem 0.4rem;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: right;
    border: 1px solid var(--border-color, #cbd5e0);
    border-radius: 4px;
    background: var(--background, #ffffff);
    color: var(--text-color, #2d3748);
  }

  .unit-badge {
    font-size: 0.75rem;
    color: var(--text-muted, #718096);
    min-width: 1rem;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .range-slider {
    flex: 1;
    cursor: pointer;
    accent-color: #3182ce;
  }

  .bound-label {
    font-size: 0.7rem;
    color: var(--text-muted, #a0aec0);
  }

  .param-desc {
    font-size: 0.75rem;
    color: var(--text-muted, #718096);
  }
</style>
