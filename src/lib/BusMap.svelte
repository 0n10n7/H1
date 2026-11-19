<script>
  // Schematic map of the area: ordinary bus lines, stops, a highlighted route and all autonomous buses.
  import { places, lines } from './places.js';

  /**
   * @type {{
   *   vehicles: import('./autobuss.svelte.js').Vehicle[],
   *   from?: import('./places.js').Place | null,
   *   to?: import('./places.js').Place | null,
   *   assignedId?: string | null,
   * }}
   */
  let { vehicles, from = null, to = null, assignedId = null } = $props();

  const byId = Object.fromEntries(places.map((p) => [p.id, p]));
  const linePoints = lines.map((l) => l.stops.map((id) => `${byId[id].x},${byId[id].y}`).join(' '));
  const freeCount = $derived(vehicles.filter((v) => v.tripId === null).length);
</script>

<svg viewBox="0 0 100 90" class="map" role="img" aria-label="Karta över trafikområdet">
  <rect x="1" y="1" width="98" height="88" rx="6" class="zone" />
  <text x="5" y="8" class="zone-label">Trafikområde Barkarby</text>

  {#each linePoints as points}
    <polyline {points} class="line" />
  {/each}

  {#if from && to}
    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} class="route" />
  {/if}

  {#each places as stop (stop.id)}
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

<div class="legend">
  <span>{freeCount} av {vehicles.length} autonoma bussar lediga</span>
  <span class="keys">
    <span><i class="free"></i>Ledig</span>
    <span><i class="busy"></i>Upptagen</span>
    {#if assignedId}<span><i class="mine"></i>Din buss</span>{/if}
  </span>
</div>

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

  .line {
    fill: none;
    stroke: #c3ccd6;
    stroke-width: 1.4;
    stroke-linejoin: round;
  }

  .route {
    stroke: var(--primary);
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
    /* outline in the map colour so lines passing behind a name don't hide it */
    stroke: #eaf3ea;
    stroke-width: 0.9px;
    paint-order: stroke;
  }

  .stop.from circle {
    fill: var(--primary);
    stroke: var(--primary);
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
    fill: var(--primary);
  }

  .bus text {
    font-size: 2.4px;
    font-weight: 700;
    fill: #fff;
  }

  .pulse {
    fill: var(--primary);
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

  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 12px;
    margin: 8px 4px 0;
    font-size: 0.78rem;
    color: var(--muted);
  }

  .keys {
    display: flex;
    gap: 10px;
  }

  .keys span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .keys i {
    width: 10px;
    height: 7px;
    border-radius: 2px;
  }

  .keys .free {
    background: var(--green);
  }

  .keys .busy {
    background: #8a94a3;
  }

  .keys .mine {
    background: var(--primary);
  }
</style>
