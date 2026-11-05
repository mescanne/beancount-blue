<script lang="ts">
  import type { SimulationTrace } from "../types";

  let { trace }: { trace: SimulationTrace | null } = $props();

  let hoveredIndex = $state<number | null>(null);
  let showTotalOnly = $state(false);

  const POT_COLORS = ["#3182ce", "#38a169", "#805ad5", "#dd6b20", "#319795", "#d69e2e", "#e53e3e"];

  const width = 800;
  const height = 320;
  const margin = { top: 25, right: 20, bottom: 35, left: 65 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  let balanceKeys = $derived(trace ? Object.keys(trace.balances) : []);

  function getTotalBalance(i: number): number {
    if (!trace) return 0;
    // Prefer net_worth metric if present
    if (trace.metrics && trace.metrics.net_worth && trace.metrics.net_worth[i] !== undefined) {
      return trace.metrics.net_worth[i];
    }
    let tot = 0;
    for (const k of balanceKeys) {
      const val = trace.balances[k][i] || 0;
      if (k.toLowerCase().includes("mortgage") || k.toLowerCase().includes("debt")) {
        tot -= val;
      } else {
        tot += val;
      }
    }
    return tot;
  }

  let totalSeries = $derived.by(() => {
    if (!trace || trace.periods.length === 0) return [];
    return trace.periods.map((_, i) => getTotalBalance(i));
  });

  let maxVal = $derived.by(() => {
    if (!trace || trace.periods.length === 0) return 500000;
    let m = 0;
    if (showTotalOnly) {
      for (const val of totalSeries) {
        if (val > m) m = val;
      }
    } else {
      for (const key of balanceKeys) {
        for (const val of trace.balances[key]) {
          if (val > m) m = val;
        }
      }
    }
    return Math.max(m * 1.1, 100000);
  });

  function formatShort(val: number): string {
    const abs = Math.abs(val);
    if (abs >= 1_000_000) return `£${(val / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `£${(val / 1_000).toFixed(0)}k`;
    return `£${val.toFixed(0)}`;
  }

  function getX(i: number, len: number): number {
    if (len <= 1) return margin.left;
    return margin.left + (i / (len - 1)) * chartW;
  }

  function getY(val: number): number {
    return margin.top + chartH - (Math.max(0, val) / maxVal) * chartH;
  }

  function getPath(arr: number[]): string {
    if (!arr || arr.length === 0) return "";
    return arr
      .map((val, i) => `${i === 0 ? "M" : "L"} ${getX(i, arr.length).toFixed(1)} ${getY(val).toFixed(1)}`)
      .join(" ");
  }
</script>

<div class="chart-container">
  <div class="chart-header">
    <div class="title-and-controls">
      <h4 class="chart-title">Account Balance Trajectories</h4>
      <div class="view-toggles">
        <button
          class="toggle-btn"
          class:active={!showTotalOnly}
          onclick={() => (showTotalOnly = false)}
          type="button"
        >
          All Accounts
        </button>
        <button
          class="toggle-btn"
          class:active={showTotalOnly}
          onclick={() => (showTotalOnly = true)}
          type="button"
        >
          Total Only
        </button>
      </div>
    </div>
    <div class="legend">
      {#if !showTotalOnly}
        {#each balanceKeys as key, i}
          <span class="legend-item">
            <span class="legend-swatch" style="background: {POT_COLORS[i % POT_COLORS.length]};"></span>
            {key.replace(/_/g, " ")}
          </span>
        {/each}
      {:else}
        <span class="legend-item">
          <span class="legend-swatch" style="background: #2b6cb0;"></span>
          Total Net Worth
        </span>
      {/if}
    </div>
  </div>

  <svg viewBox="0 0 {width} {height}" class="chart-svg">
    <!-- Grid lines -->
    {#each [0, 0.25, 0.5, 0.75, 1.0] as frac}
      {@const y = margin.top + chartH * (1 - frac)}
      <line
        x1={margin.left}
        y1={y}
        x2={width - margin.right}
        y2={y}
        stroke="var(--border-color, #edf2f7)"
        stroke-dasharray="3,3"
      />
      <text x={margin.left - 8} y={y + 4} class="axis-label" text-anchor="end">
        {formatShort(maxVal * frac)}
      </text>
    {/each}

    <!-- Trajectory Lines -->
    {#if trace && trace.periods.length > 0}
      {#if showTotalOnly}
        <!-- Total Net Worth single trajectory -->
        <path
          d={getPath(totalSeries)}
          fill="none"
          stroke="#2b6cb0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        {#if hoveredIndex !== null}
          {@const x = getX(hoveredIndex, trace.periods.length)}
          {@const y = getY(totalSeries[hoveredIndex] || 0)}
          <circle cx={x} cy={y} r="5" fill="#2b6cb0" stroke="#ffffff" stroke-width="2" />
        {/if}
      {:else}
        <!-- Individual Account Trajectories -->
        {#each balanceKeys as key, kIdx}
          <path
            d={getPath(trace.balances[key])}
            fill="none"
            stroke={POT_COLORS[kIdx % POT_COLORS.length]}
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        {/each}
      {/if}

      <!-- X-axis tick labels -->
      {#each trace.periods as period, i}
        {#if i % Math.ceil(trace.periods.length / 8) === 0 || i === trace.periods.length - 1}
          <text
            x={getX(i, trace.periods.length)}
            y={height - margin.bottom + 18}
            class="axis-label"
            text-anchor="middle"
          >
            {period}
          </text>
        {/if}
      {/each}

      <!-- Crosshair on hover -->
      {#if hoveredIndex !== null}
        {@const x = getX(hoveredIndex, trace.periods.length)}
        <line
          x1={x}
          y1={margin.top}
          x2={x}
          y2={margin.top + chartH}
          stroke="#4a5568"
          stroke-width="1.5"
          stroke-dasharray="2,2"
        />
      {/if}

      <!-- Interactive hover overlay columns -->
      {@const stepW = chartW / trace.periods.length}
      {#each trace.periods as _, i}
        <rect
          x={margin.left + i * stepW}
          y={margin.top}
          width={stepW}
          height={chartH}
          fill="transparent"
          class="hover-zone"
          role="presentation"
          onmouseenter={() => (hoveredIndex = i)}
          onmouseleave={() => (hoveredIndex = null)}
        />
      {/each}
    {/if}
  </svg>

  <!-- Tooltip: ALWAYS includes total balance / net worth -->
  {#if hoveredIndex !== null && trace}
    {@const i = hoveredIndex}
    {@const totalNet = totalSeries[i] ?? 0}
    <div class="chart-tooltip">
      <div class="tooltip-header">
        <strong>Year {trace.periods[i]}</strong>
        <span class="total-badge">
          Total: {formatShort(totalNet)}
        </span>
      </div>
      <div class="tooltip-list">
        {#each balanceKeys as key}
          {@const val = trace.balances[key][i] || 0}
          <div class="tooltip-row">
            <span class="cat-name">{key.replace(/_/g, " ")}:</span>
            <span class="cat-val">
              {formatShort(val)}
            </span>
          </div>
        {/each}
      </div>
      <div class="tooltip-divider"></div>
      <div class="tooltip-row tooltip-total">
        <strong>Total Net Worth:</strong>
        <strong>{formatShort(totalNet)}</strong>
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    position: relative;
    background: var(--background, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .title-and-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .chart-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color, #2d3748);
  }

  .view-toggles {
    display: inline-flex;
    background: var(--background-muted, #edf2f7);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 6px;
    padding: 2px;
  }

  .toggle-btn {
    border: none;
    background: transparent;
    padding: 3px 8px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted, #718096);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .toggle-btn:hover {
    color: var(--text-color, #2d3748);
  }

  .toggle-btn.active {
    background: var(--card-bg, #ffffff);
    color: var(--primary, #2b6cb0);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.75rem;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--text-muted, #718096);
    text-transform: capitalize;
  }

  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }

  .chart-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .axis-label {
    font-size: 11px;
    fill: var(--text-muted, #a0aec0);
  }

  .hover-zone {
    cursor: pointer;
  }

  .hover-zone:hover {
    fill: rgba(66, 153, 225, 0.08);
  }

  .chart-tooltip {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(26, 32, 44, 0.95);
    color: #ffffff;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    pointer-events: none;
    z-index: 10;
    min-width: 180px;
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
  }

  .total-badge {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 3px;
    color: #63b3ed;
    background: rgba(99, 179, 237, 0.2);
  }

  .tooltip-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .tooltip-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0.35rem 0;
  }

  .tooltip-total {
    font-weight: 600;
    color: #edf2f7;
  }

  .cat-name {
    color: #cbd5e0;
    text-transform: capitalize;
  }

  .cat-val {
    color: #edf2f7;
  }
</style>
