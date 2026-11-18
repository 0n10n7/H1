<script>
  // Schematic map of the service area: stops, the selected route and all buses.
  let { stops = [], vehicles = [], from = null, to = null, assignedId = null } = $props();
</script>

<svg viewBox="0 0 100 90" class="map" role="img" aria-label="Karta över trafikområdet">
  <rect x="1" y="1" width="98" height="88" rx="6" class="zone" />
  <text x="5" y="8" class="zone-label">Trafikområde Barkarby</text>

  {#if from && to}
    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} class="route" />
  {/if}

  {#each stops as stop (stop.id)}
    <g class="stop" class:from={stop.id === from?.id} class:to={stop.id === to?.id}>
      <circle cx={stop.x} cy={stop.y} r="2.2" />
      <text x={stop.x} y={stop.y + 5.6} text-anchor="middle">{stop.name}</text>
    </g>
  {/each}

  {#each vehicles as v (v.id)}
    <g
      class="bus"
      class:busy={v.tripId !== null}
      class:assigned={v.id === assignedId}
      style="transform: translate({v.x}px, {v.y}px)"
    >
      {#if v.id === assignedId}<circle r="5" class="pulse" />{/if}
      <rect x="-3.4" y="-2.3" width="6.8" height="4.6" rx="1.3" />
      <text y="0.9" text-anchor="middle">{v.id.slice(-2)}</text>
    </g>
  {/each}
</svg>

<style>
  .map {
    display: block;
    width: 100%;
    height: auto;
  }

  .zone {
    fill: #eaf3ea;
    stroke: #9cc59f;
    stroke-width: 0.4;
    stroke-dasharray: 2 1.5;
  }

  .zone-label {
    font-size: 2.8px;
    font-weight: 600;
    fill: #4f7d53;
  }

  .route {
    stroke: var(--blue);
    stroke-width: 1;
    stroke-dasharray: 2 1.4;
    stroke-linecap: round;
  }

  .stop circle {
    fill: #fff;
    stroke: var(--muted);
    stroke-width: 0.7;
  }

  .stop text {
    font-size: 2.8px;
    fill: var(--text);
  }

  .stop.from circle {
    fill: var(--blue);
    stroke: var(--blue);
  }

  .stop.to circle {
    fill: var(--pink);
    stroke: var(--pink);
  }

  .stop.from text,
  .stop.to text {
    font-weight: 700;
  }

  .bus {
    transition: transform 0.25s linear; /* matches the simulation tick */
  }

  .bus rect {
    fill: var(--green);
    stroke: #fff;
    stroke-width: 0.5;
  }

  .bus.busy rect {
    fill: #8a94a3;
  }

  .bus.assigned rect {
    fill: var(--blue);
  }

  .bus text {
    font-size: 2.4px;
    font-weight: 700;
    fill: #fff;
  }

  .pulse {
    fill: var(--blue);
    opacity: 0.25;
    animation: pulse 1.6s ease-out infinite;
  }

  @keyframes pulse {
    from {
      r: 3;
      opacity: 0.45;
    }
    to {
      r: 8;
      opacity: 0;
    }
  }
</style>
