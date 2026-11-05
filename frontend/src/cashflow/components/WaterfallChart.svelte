<script lang="ts">
  import type { SimulationTrace } from "../types";

  let { trace }: { trace: SimulationTrace | null } = $props();

  type ViewMode = "stacked" | "net" | "funding";
  let viewMode = $state<ViewMode>("stacked");
  let hoveredIndex = $state<number | null>(null);

  // Generic semantic colors for common categories; models may also supply trace.colors
  const PALETTE: Record<string, string> = {
    salary: "#38a169",
    earned_salary: "#38a169",
    state_pension: "#319795",
    investment_growth: "#48bb78",
    pension_drawdown: "#4299e1",
    sipp_drawdown: "#4299e1",
    isa_drawdown: "#63b3ed",
    offset_drawdown: "#4fd1c5",
    gia_drawdown: "#319795",
    living_expenses: "#e53e3e",
    living_costs: "#e53e3e",
    school_fees: "#dd6b20",
    mortgage_payment: "#d69e2e",
    mortgage_principal: "#d69e2e",
    mortgage_interest: "#c53030",
    income_tax: "#9b2c2c",
    cgt_paid: "#742a2a",
    cgt_drawdown: "#742a2a",
    cgt_bed_and_isa: "#742a2a",
    offset_savings: "#319795",
    isa_savings: "#63b3ed",
  };

  const DEFAULT_COLORS = ["#3182ce", "#38a169", "#d69e2e", "#e53e3e", "#805ad5", "#dd6b20", "#319795"];

  function getColor(cat: string, idx: number): string {
    if (trace?.colors?.[cat]) return trace.colors[cat];
    if (PALETTE[cat]) return PALETTE[cat];
    const lower = cat.toLowerCase();
    if (lower.includes("tax") || lower.includes("cgt")) return "#9b2c2c";
    if (lower.includes("interest") || lower.includes("expense") || lower.includes("living")) return "#e53e3e";
    if (lower.includes("mortgage") || lower.includes("school") || lower.includes("overflow")) return "#dd6b20";
    if (lower.includes("sipp") || lower.includes("pension")) return "#3182ce";
    if (lower.includes("isa")) return "#63b3ed";
    if (lower.includes("gia") || lower.includes("offset")) return "#319795";
    if (lower.includes("salary") || lower.includes("growth") || lower.includes("income")) return "#38a169";
    return DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
  }

  const width = 800;
  const height = 320;
  const margin = { top: 25, right: 20, bottom: 35, left: 65 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  let hasFunding = $derived(Boolean(trace?.funding && Object.keys(trace.funding).length > 0));

  let activeDataset = $derived.by(() => {
    if (!trace) return {};
    if (viewMode === "funding" && trace.funding) {
      return trace.funding;
    }
    return trace.cashflows || {};
  });

  let categories = $derived(Object.keys(activeDataset));

  function getNetOperating(i: number): number {
    if (!trace || !trace.cashflows) return 0;
    let sum = 0;
    for (const [_, vals] of Object.entries(trace.cashflows)) {
      sum += vals[i] || 0;
    }
    return sum;
  }

  function getNetActive(i: number): number {
    let sum = 0;
    for (const cat of categories) {
      sum += activeDataset[cat][i] || 0;
    }
    return sum;
  }

  // Compute maximum positive and negative bounds across all periods
  let chartBounds = $derived.by(() => {
    if (!trace || trace.periods.length === 0) return { maxIn: 100000, maxOut: 100000 };

    let maxIn = 0;
    let maxOut = 0;

    for (let i = 0; i < trace.periods.length; i++) {
      if (viewMode === "net") {
        const net = getNetOperating(i);
        if (net > maxIn) maxIn = net;
        if (net < 0 && Math.abs(net) > maxOut) maxOut = Math.abs(net);
      } else {
        let sumIn = 0;
        let sumOut = 0;
        for (const [_, vals] of Object.entries(activeDataset)) {
          const amt = vals[i] || 0;
          if (amt > 0) sumIn += amt;
          else if (amt < 0) sumOut += Math.abs(amt);
        }
        if (sumIn > maxIn) maxIn = sumIn;
        if (sumOut > maxOut) maxOut = sumOut;
      }
    }

    return {
      maxIn: Math.max(maxIn, 10000),
      maxOut: Math.max(maxOut, 10000),
    };
  });

  let totalRange = $derived(chartBounds.maxIn + chartBounds.maxOut);
  let zeroY = $derived(margin.top + (chartBounds.maxIn / totalRange) * chartH);

  function getY(amt: number): number {
    return (amt / totalRange) * chartH;
  }

  function formatShort(val: number): string {
    const abs = Math.abs(val);
    if (abs >= 1_000_000) return `£${(val / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `£${(val / 1_000).toFixed(0)}k`;
    return `£${val.toFixed(0)}`;
  }
</script>

<div class="chart-container">
  <div class="chart-header">
    <div class="title-and-controls">
      <h4 class="chart-title">
        {viewMode === "funding" ? "Portfolio Funding & Drawdowns" : "Annual Cashflow Waterfall"}
      </h4>
      <div class="view-toggles">
        <button
          class="toggle-btn"
          class:active={viewMode === "stacked"}
          onclick={() => (viewMode = "stacked")}
          type="button"
        >
          Operating Flows
        </button>
        <button
          class="toggle-btn"
          class:active={viewMode === "net"}
          onclick={() => (viewMode = "net")}
          type="button"
        >
          Net Change
        </button>
        {#if hasFunding}
          <button
            class="toggle-btn"
            class:active={viewMode === "funding"}
            onclick={() => (viewMode = "funding")}
            type="button"
          >
            Portfolio Funding
          </button>
        {/if}
      </div>
    </div>
    {#if viewMode === "net"}
      <div class="legend">
        <span class="legend-item">
          <span class="legend-swatch" style="background: #38a169;"></span>
          Surplus (+)
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="background: #e53e3e;"></span>
          Deficit (-)
        </span>
      </div>
    {:else}
      <div class="legend">
        {#each categories as cat, i}
          <span class="legend-item">
            <span class="legend-swatch" style="background: {getColor(cat, i)};"></span>
            {cat.replace(/_/g, " ")}
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <svg viewBox="0 0 {width} {height}" class="chart-svg">
    <!-- Zero axis -->
    <line
      x1={margin.left}
      y1={zeroY}
      x2={width - margin.right}
      y2={zeroY}
      stroke="var(--border-color, #cbd5e0)"
      stroke-width="1.5"
    />

    <!-- Y-axis reference lines -->
    <text x={margin.left - 8} y={margin.top + 10} class="axis-label" text-anchor="end">
      +{formatShort(chartBounds.maxIn)}
    </text>
    <text x={margin.left - 8} y={zeroY + 4} class="axis-label" text-anchor="end">£0</text>
    <text x={margin.left - 8} y={height - margin.bottom} class="axis-label" text-anchor="end">
      -{formatShort(chartBounds.maxOut)}
    </text>

    <!-- Bars -->
    {#if trace && trace.periods.length > 0}
      {@const barStep = chartW / trace.periods.length}
      {@const barW = Math.max(2, barStep * 0.75)}

      {#each trace.periods as period, i}
        {@const x = margin.left + i * barStep + (barStep - barW) / 2}

        {#if viewMode === "net"}
          <!-- Single Net Operating Bar -->
          {@const netVal = getNetOperating(i)}
          {#if netVal > 0}
            {@const barH = getY(netVal)}
            <rect
              {x}
              y={zeroY - barH}
              width={barW}
              height={Math.max(1, barH)}
              fill="#38a169"
              rx="1"
            />
          {:else if netVal < 0}
            {@const barH = getY(Math.abs(netVal))}
            <rect
              {x}
              y={zeroY}
              width={barW}
              height={Math.max(1, barH)}
              fill="#e53e3e"
              rx="1"
            />
          {:else}
            <line
              x1={x}
              y1={zeroY}
              x2={x + barW}
              y2={zeroY}
              stroke="#718096"
              stroke-width="1.5"
            />
          {/if}
        {:else}
          <!-- Stack positive bars upwards -->
          {#snippet positiveStack()}
            {@const posCategories = categories.filter((c) => (activeDataset[c][i] || 0) > 0)}
            {#each posCategories as cat, cIdx}
              {@const amt = activeDataset[cat][i]}
              {@const barH = getY(amt)}
              {@const prevSum = posCategories
                .slice(0, cIdx)
                .reduce((acc, c) => acc + activeDataset[c][i], 0)}
              {@const y = zeroY - getY(prevSum) - barH}
              <rect
                {x}
                {y}
                width={barW}
                height={Math.max(0, barH)}
                fill={getColor(cat, categories.indexOf(cat))}
                rx="1"
              />
            {/each}
          {/snippet}

          <!-- Stack negative bars downwards -->
          {#snippet negativeStack()}
            {@const negCategories = categories.filter((c) => (activeDataset[c][i] || 0) < 0)}
            {#each negCategories as cat, cIdx}
              {@const amt = Math.abs(activeDataset[cat][i])}
              {@const barH = getY(amt)}
              {@const prevSum = negCategories
                .slice(0, cIdx)
                .reduce((acc, c) => acc + Math.abs(activeDataset[c][i]), 0)}
              {@const y = zeroY + getY(prevSum)}
              <rect
                {x}
                {y}
                width={barW}
                height={Math.max(0, barH)}
                fill={getColor(cat, categories.indexOf(cat))}
                rx="1"
              />
            {/each}
          {/snippet}

          {@render positiveStack()}
          {@render negativeStack()}
        {/if}

        <!-- X-axis labels (every 5-10 years) -->
        {#if i % Math.ceil(trace.periods.length / 8) === 0 || i === trace.periods.length - 1}
          <text
            x={x + barW / 2}
            y={height - margin.bottom + 18}
            class="axis-label"
            text-anchor="middle"
          >
            {period}
          </text>
        {/if}

        <!-- Transparent hover zone -->
        <rect
          {x}
          y={margin.top}
          width={barW}
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

  <!-- Tooltip: ALWAYS includes net change -->
  {#if hoveredIndex !== null && trace}
    {@const i = hoveredIndex}
    {@const netOp = getNetOperating(i)}
    {@const netAct = getNetActive(i)}
    <div class="chart-tooltip">
      <div class="tooltip-header">
        <strong>Year {trace.periods[i]}</strong>
        <span class="net-badge" class:pos={netOp >= 0} class:neg={netOp < 0}>
          {netOp >= 0 ? "+" : ""}{formatShort(netOp)}
        </span>
      </div>

      {#if viewMode === "funding"}
        <div class="tooltip-list">
          {#each categories as cat}
            {@const val = activeDataset[cat][i] || 0}
            {#if val !== 0}
              <div class="tooltip-row">
                <span class="cat-name">{cat.replace(/_/g, " ")}:</span>
                <span class="cat-val" class:pos={val > 0} class:neg={val < 0}>
                  {val > 0 ? "+" : ""}{formatShort(val)}
                </span>
              </div>
            {/if}
          {/each}
        </div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-row tooltip-total">
          <strong>Net Funding:</strong>
          <strong class="cat-val" class:pos={netAct >= 0} class:neg={netAct < 0}>
            {netAct >= 0 ? "+" : ""}{formatShort(netAct)}
          </strong>
        </div>
      {:else}
        <div class="tooltip-list">
          {#each Object.keys(trace.cashflows) as cat}
            {@const val = trace.cashflows[cat][i] || 0}
            {#if val !== 0}
              <div class="tooltip-row">
                <span class="cat-name">{cat.replace(/_/g, " ")}:</span>
                <span class="cat-val" class:pos={val > 0} class:neg={val < 0}>
                  {val > 0 ? "+" : ""}{formatShort(val)}
                </span>
              </div>
            {/if}
          {/each}
        </div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-row tooltip-total">
          <strong>Operating Net:</strong>
          <strong class="cat-val" class:pos={netOp >= 0} class:neg={netOp < 0}>
            {netOp >= 0 ? "+" : ""}{formatShort(netOp)}
          </strong>
        </div>

        {#if hasFunding && trace.funding}
          {@const activeFundingCats = Object.keys(trace.funding).filter(c => (trace.funding?.[c][i] || 0) !== 0)}
          {#if activeFundingCats.length > 0}
            <div class="tooltip-divider"></div>
            <div class="tooltip-subheading">Portfolio Funding:</div>
            <div class="tooltip-list">
              {#each activeFundingCats as fCat}
                {@const fVal = trace.funding[fCat][i] || 0}
                <div class="tooltip-row tooltip-subrow">
                  <span class="cat-name">{fCat.replace(/_/g, " ")}:</span>
                  <span class="cat-val" class:pos={fVal > 0} class:neg={fVal < 0}>
                    {fVal > 0 ? "+" : ""}{formatShort(fVal)}
                  </span>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      {/if}
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
    fill: rgba(66, 153, 225, 0.1);
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
    min-width: 200px;
    max-height: 280px;
    overflow-y: auto;
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
  }

  .net-badge {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.15);
  }

  .net-badge.pos {
    color: #68d391;
    background: rgba(104, 211, 145, 0.2);
  }

  .net-badge.neg {
    color: #fc8181;
    background: rgba(252, 129, 129, 0.2);
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

  .tooltip-subheading {
    font-size: 0.7rem;
    font-weight: 600;
    color: #a0aec0;
    margin-top: 0.15rem;
    margin-bottom: 0.15rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tooltip-subrow {
    font-size: 0.75rem;
    opacity: 0.9;
  }

  .tooltip-total {
    font-weight: 600;
    color: #edf2f7;
  }

  .cat-name {
    color: #cbd5e0;
    text-transform: capitalize;
  }

  .cat-val.pos {
    color: #68d391;
  }

  .cat-val.neg {
    color: #fc8181;
  }
</style>
