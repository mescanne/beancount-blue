<script lang="ts">
  import type { SimulationTrace } from "../types";

  let { trace }: { trace: SimulationTrace | null } = $props();

  function formatCurrency(val: number): string {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val);
  }

  let finalBalance = $derived.by(() => {
    if (!trace || trace.periods.length === 0) return 0;
    // Sum all balances at the last period
    let total = 0;
    for (const key of Object.keys(trace.balances)) {
      const arr = trace.balances[key];
      total += arr[arr.length - 1] || 0;
    }
    return total;
  });

  let minBalanceInfo = $derived.by(() => {
    if (!trace || trace.periods.length === 0) return { min: 0, year: 0 };
    let minVal = Infinity;
    let minYr = trace.periods[0];

    for (let i = 0; i < trace.periods.length; i++) {
      let total = 0;
      for (const key of Object.keys(trace.balances)) {
        total += trace.balances[key][i] || 0;
      }
      if (total < minVal) {
        minVal = total;
        minYr = trace.periods[i];
      }
    }
    return { min: minVal === Infinity ? 0 : minVal, year: minYr };
  });

  let peakBalanceInfo = $derived.by(() => {
    if (!trace || trace.periods.length === 0) return { peak: 0, year: 0 };
    let peakVal = -Infinity;
    let peakYr = trace.periods[0];

    for (let i = 0; i < trace.periods.length; i++) {
      let total = 0;
      for (const key of Object.keys(trace.balances)) {
        total += trace.balances[key][i] || 0;
      }
      if (total > peakVal) {
        peakVal = total;
        peakYr = trace.periods[i];
      }
    }
    return { peak: peakVal === -Infinity ? 0 : peakVal, year: peakYr };
  });
</script>

<div class="summary-cards">
  <div class="card">
    <div class="label">Ending Net Worth</div>
    <div class="value" class:negative={finalBalance < 0}>
      {formatCurrency(finalBalance)}
    </div>
    <div class="subtext">At year {trace?.periods[trace.periods.length - 1] || 0}</div>
  </div>

  <div class="card">
    <div class="label">Portfolio Trough</div>
    <div class="value" class:warning={minBalanceInfo.min < 100000}>
      {formatCurrency(minBalanceInfo.min)}
    </div>
    <div class="subtext">Lowest balance in {minBalanceInfo.year}</div>
  </div>

  <div class="card">
    <div class="label">Peak Portfolio</div>
    <div class="value highlight">
      {formatCurrency(peakBalanceInfo.peak)}
    </div>
    <div class="subtext">Highest balance in {peakBalanceInfo.year}</div>
  </div>
</div>

<style>
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card {
    background: var(--background-secondary, #f8f9fa);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .label {
    font-size: 0.825rem;
    font-weight: 600;
    color: var(--text-muted, #718096);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.35rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color, #2d3748);
  }

  .value.highlight {
    color: #2b6cb0;
  }

  .value.warning {
    color: #dd6b20;
  }

  .value.negative {
    color: #e53e3e;
  }

  .subtext {
    font-size: 0.8rem;
    color: var(--text-muted, #a0aec0);
    margin-top: 0.25rem;
  }
</style>
