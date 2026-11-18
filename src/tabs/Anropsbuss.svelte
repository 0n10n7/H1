<script>
  import BusMap from '../lib/BusMap.svelte';
  import Icon from '../lib/Icon.svelte';
  import {
    stops,
    fleet,
    MAX_PASSENGERS,
    myTrip,
    isOngoing,
    bookTrip,
    cancelMyTrip,
    clearMyTrip,
    tripTimes,
    tripDistanceMeters,
  } from '../lib/autobuss.svelte.js';

  const STEPS = ['Bokad', 'Bussen kommer', 'Ombord', 'Framme'];
  /** @type {Record<string, number>} */
  const STEP_INDEX = { to_pickup: 1, boarding: 2, riding: 2, completed: 4 };
  const passengerOptions = Array.from({ length: MAX_PASSENGERS }, (_, i) => i + 1);

  let fromId = $state(stops[0].id);
  let toId = $state(stops[2].id);
  let passengers = $state(1);
  let error = $state('');

  // The simulation state is reactive, so these update on every tick by themselves.
  const booking = $derived(myTrip());
  const ongoing = $derived(isOngoing(booking));
  const times = $derived(booking ? tripTimes(booking) : null);
  const freeCount = $derived(fleet.vehicles.filter((v) => v.tripId === null).length);
  const selectedFrom = $derived(stops.find((s) => s.id === fromId));
  const selectedTo = $derived(stops.find((s) => s.id === toId));

  /** @param {SubmitEvent} event */
  function order(event) {
    event.preventDefault();
    error = '';
    try {
      bookTrip(fromId, toId, passengers);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  function reset() {
    clearMyTrip();
    error = '';
  }

  function swap() {
    [fromId, toId] = [toId, fromId];
  }

  /** @param {number} sec */
  const formatSec = (sec) => (sec < 60 ? `${sec} s` : `${Math.floor(sec / 60)} min ${sec % 60} s`);
  /** @param {number} sec */
  const clockIn = (sec) =>
    new Date(Date.now() + sec * 1000).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  const headline = $derived.by(() => {
    if (!booking || !times) return '';
    switch (booking.status) {
      case 'to_pickup': return `Bussen är framme om ${formatSec(times.pickupSec)}`;
      case 'boarding': return `Bussen väntar vid ${booking.from.name}`;
      case 'riding': return `Framme om ${formatSec(times.dropoffSec)}`;
      case 'completed': return `Du är framme vid ${booking.to.name}`;
      case 'cancelled': return 'Resan är avbokad';
    }
  });

  const detail = $derived.by(() => {
    if (!booking || !times) return '';
    switch (booking.status) {
      case 'to_pickup': return `Gå till hållplatsen ${booking.from.name}. Den förarlösa bussen ${booking.vehicleId} hämtar dig där.`;
      case 'boarding': return `Visa koden vid dörren och kliv på. Bussen åker om ${times.boardingLeftSec} s.`;
      case 'riding': return `Luta dig tillbaka – bussen kör själv till ${booking.to.name}.`;
      case 'completed': return 'Tack för att du åkte med en autonom anropsbuss!';
      case 'cancelled': return 'Bussen har släppts till andra resenärer.';
    }
  });
</script>

<div class="stack">
  <section class="card map-card">
    <BusMap
      {stops}
      vehicles={fleet.vehicles}
      from={booking ? booking.from : selectedFrom}
      to={booking ? booking.to : selectedTo}
      assignedId={booking && ongoing ? booking.vehicleId : null}
    />
    <div class="fleet">
      <span>{freeCount} av {fleet.vehicles.length} bussar lediga</span>
      <span class="legend">
        <span><i class="free"></i>Ledig</span>
        <span><i class="busy"></i>Upptagen</span>
        <span><i class="mine"></i>Din buss</span>
      </span>
    </div>
  </section>

  {#if booking && times}
    <section class="card status">
      <div class="status-top">
        <span class="pill {booking.status}">Buss {booking.vehicleId}</span>
        {#if ongoing && booking.status !== 'boarding'}
          <span class="arrival">Ankomst ca {clockIn(times.dropoffSec)}</span>
        {/if}
      </div>

      <h2>{headline}</h2>
      <p class="detail">{detail}</p>

      {#if booking.status !== 'cancelled'}
        <ol class="steps">
          {#each STEPS as step, i}
            <li class:done={i < STEP_INDEX[booking.status]} class:current={i === STEP_INDEX[booking.status]}>
              {step}
            </li>
          {/each}
        </ol>
      {/if}

      <dl>
        <div><dt>Från</dt><dd>{booking.from.name}</dd></div>
        <div><dt>Till</dt><dd>{booking.to.name}</dd></div>
        <div><dt>Resenärer</dt><dd>{booking.passengers}</dd></div>
        <div><dt>Sträcka</dt><dd>{(tripDistanceMeters(booking) / 1000).toFixed(1).replace('.', ',')} km</dd></div>
      </dl>

      {#if ongoing}
        <div class="code">
          <span>Påstigningskod</span>
          <strong>{booking.code}</strong>
        </div>
      {/if}

      {#if booking.status === 'to_pickup' || booking.status === 'boarding'}
        <button class="btn secondary" onclick={cancelMyTrip}>Avboka</button>
      {:else if !ongoing}
        <button class="btn" onclick={reset}>Beställ en ny resa</button>
      {/if}
    </section>
  {:else}
    <form class="card order" onsubmit={order}>
      <h2>Beställ en förarlös buss</h2>
      <p class="intro">
        Anropsbussen kör utan förare inom trafikområdet. Välj var du vill bli hämtad och vart du ska,
        så skickas närmaste lediga buss.
      </p>

      <div class="route-fields">
        <label class="field">
          Från
          <select bind:value={fromId}>
            {#each stops as stop (stop.id)}<option value={stop.id}>{stop.name}</option>{/each}
          </select>
        </label>
        <button type="button" class="swap" onclick={swap} aria-label="Byt plats på Från och Till">
          <Icon name="swap" size={20} />
        </button>
        <label class="field">
          Till
          <select bind:value={toId}>
            {#each stops as stop (stop.id)}<option value={stop.id}>{stop.name}</option>{/each}
          </select>
        </label>
      </div>

      <label class="field">
        Antal resenärer
        <select bind:value={passengers}>
          {#each passengerOptions as n}<option value={n}>{n}</option>{/each}
        </select>
      </label>

      {#if error}<p class="error">{error}</p>{/if}

      <button class="btn" type="submit" disabled={fromId === toId}>Beställ buss</button>
      {#if fromId === toId}<p class="hint">Välj två olika hållplatser.</p>{/if}
      <p class="hint">Prototyp – tiden i simuleringen går snabbare än i verkligheten.</p>
    </form>
  {/if}
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .map-card {
    padding: 8px;
  }

  .fleet {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 12px;
    margin: 6px 6px 2px;
    font-size: 0.78rem;
    color: var(--muted);
  }

  .legend {
    display: flex;
    gap: 10px;
  }

  .legend span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .legend i {
    width: 10px;
    height: 7px;
    border-radius: 2px;
  }

  .legend .free {
    background: var(--green);
  }

  .legend .busy {
    background: #8a94a3;
  }

  .legend .mine {
    background: var(--blue);
  }

  h2 {
    margin: 0 0 6px;
    font-size: 1.15rem;
  }

  .intro,
  .detail {
    margin: 0 0 14px;
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.4;
  }

  .order {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .order .intro {
    margin: 0;
  }

  .route-fields {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: 8px;
  }

  .route-fields select {
    min-width: 0;
    width: 100%;
  }

  .swap {
    display: grid;
    place-items: center;
    width: 40px;
    height: 46px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fff;
    color: var(--blue);
    cursor: pointer;
  }

  .hint {
    margin: 0;
    font-size: 0.78rem;
    color: var(--muted);
    text-align: center;
  }

  .error {
    margin: 0;
    padding: 10px 12px;
    border-radius: 10px;
    background: #fde8ef;
    color: #9b0047;
    font-size: 0.9rem;
  }

  .status-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .pill {
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--blue-light);
    color: var(--blue);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .pill.completed {
    background: #e2f5ec;
    color: var(--green);
  }

  .pill.cancelled {
    background: #eef0f3;
    color: var(--muted);
  }

  .arrival {
    font-size: 0.85rem;
    color: var(--muted);
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
    font-size: 0.7rem;
    color: var(--muted);
    text-align: center;
  }

  .steps li {
    padding-top: 8px;
    border-top: 4px solid var(--border);
  }

  .steps li.done {
    border-color: var(--blue);
    color: var(--text);
  }

  .steps li.current {
    border-color: var(--blue);
    color: var(--blue);
    font-weight: 700;
    animation: blink 1.2s ease-in-out infinite alternate;
  }

  @keyframes blink {
    to {
      border-color: var(--blue-light);
    }
  }

  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 0 0 16px;
  }

  dt {
    font-size: 0.75rem;
    color: var(--muted);
  }

  dd {
    margin: 0;
    font-weight: 600;
  }

  .code {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: 10px;
    background: var(--blue);
    color: #fff;
  }

  .code strong {
    font-size: 1.5rem;
    letter-spacing: 0.2em;
  }
</style>
