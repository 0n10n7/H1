<script>
  // Shown after "Bekräfta bokning": the booked trip, and live tracking once a bus is on its way.
  import ScreenHeader from '../../lib/ScreenHeader.svelte';
  import Placeholder from '../../lib/Placeholder.svelte';
  import TripDetails from '../../lib/TripDetails.svelte';
  import BusMap from '../../lib/BusMap.svelte';
  import {
    fleet,
    myTrip,
    isOngoing,
    isLive,
    tripTimes,
    dispatchMyTrip,
    cancelMyTrip,
    clearMyTrip,
  } from '../../lib/autobuss.svelte.js';
  import { formatTime } from '../../lib/format.js';

  /** @type {{ onback: () => void }} */
  let { onback } = $props();

  const STEPS = ['Bokad', 'Bussen kommer', 'Ombord', 'Framme'];
  /** @type {Record<string, number>} */
  const STEP_INDEX = { scheduled: 1, to_pickup: 1, boarding: 2, riding: 2, completed: 4 };
  /** @type {Record<string, string>} */
  const TITLES = {
    scheduled: 'Resan är bokad',
    to_pickup: 'Bussen är på väg',
    boarding: 'Dags att kliva på',
    riding: 'På väg',
    completed: 'Framme!',
    cancelled: 'Avbokad',
  };

  let error = $state('');

  const trip = $derived(myTrip());
  const live = $derived(isLive(trip));
  const times = $derived(trip ? tripTimes(trip) : null);

  const headline = $derived.by(() => {
    if (!trip || !times) return '';
    switch (trip.status) {
      case 'scheduled': return `Avgång ca ${formatTime(trip.departure)}`;
      case 'to_pickup': return `Bussen är vid ${trip.from.name} om ca ${times.pickupMin} min`;
      case 'boarding': return `Bussen väntar vid ${trip.from.name}`;
      case 'riding': return `Framme om ca ${times.arrivalMin} min`;
      case 'completed': return `Du är framme vid ${trip.to.name}`;
      case 'cancelled': return 'Resan är avbokad';
    }
  });

  const detail = $derived.by(() => {
    if (!trip || !times) return '';
    switch (trip.status) {
      case 'scheduled': return `Bussen skickas automatiskt till ${trip.from.name} i god tid före avgång.`;
      case 'to_pickup': return `Gå till hållplatsen. Den förarlösa bussen ${trip.vehicleId} hämtar dig där.`;
      case 'boarding': return `Visa påstigningskoden vid dörren. Bussen åker om ca ${times.boardingLeftMin} min.`;
      case 'riding': return `Luta dig tillbaka – bussen kör själv till ${trip.to.name}.`;
      case 'completed': return 'Tack för att du åkte med en autonom anropsbuss!';
      case 'cancelled': return 'Bussen har släppts till andra resenärer.';
    }
  });

  function startNow() {
    error = '';
    try {
      dispatchMyTrip();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  function done() {
    clearMyTrip();
    onback();
  }
</script>

<ScreenHeader title={trip ? TITLES[trip.status] : 'Din resa'} backLabel="Sök resa" {onback} />

{#if trip}
  <div class="stack">
    {#if live || trip.status === 'completed'}
      <section class="card">
        <BusMap vehicles={fleet.vehicles} from={trip.from} to={trip.to} assignedId={live ? trip.vehicleId : null} />
      </section>
    {/if}

    <section class="card status">
      <h2>{headline}</h2>
      <p class="detail">{detail}</p>

      {#if trip.status !== 'cancelled'}
        <ol class="steps">
          {#each STEPS as step, i}
            <li class:done={i < STEP_INDEX[trip.status]} class:current={live && i === STEP_INDEX[trip.status]}>
              {step}
            </li>
          {/each}
        </ol>
      {/if}

      {#if isOngoing(trip)}
        <div class="code">
          <span>Påstigningskod</span>
          <strong>{trip.code}</strong>
        </div>
      {/if}
    </section>

    <TripDetails
      from={trip.from}
      to={trip.to}
      departure={trip.departure}
      durationMin={trip.durationMin}
      subtitle={trip.status === 'cancelled' ? 'Avbokad resa' : 'Bokad resa'}
    />

    {#if error}<p class="error">{error}</p>{/if}

    {#if trip.status === 'scheduled'}
      <button class="btn" onclick={startNow}>Starta resan nu (demo)</button>
      <button class="btn outline" onclick={cancelMyTrip}>Avboka</button>
    {:else if trip.status === 'to_pickup' || trip.status === 'boarding'}
      <button class="btn outline" onclick={cancelMyTrip}>Avboka</button>
    {:else if !isOngoing(trip)}
      <button class="btn" onclick={done}>Klar</button>
    {/if}

    {#if live}<p class="hint">Demo: 1 sekund i simuleringen motsvarar 1 minut.</p>{/if}
  </div>
{:else}
  <Placeholder icon="bus" title="Ingen bokning" text="Du har ingen bokad resa just nu." />
{/if}

<style>
  h2 {
    margin: 0 0 6px;
    font-size: 1.25rem;
  }

  .detail {
    margin: 0 0 16px;
    color: var(--muted);
    line-height: 1.4;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
    font-size: 0.72rem;
    color: var(--muted);
    text-align: center;
  }

  .steps li {
    padding-top: 8px;
    border-top: 4px solid var(--border);
  }

  .steps li.done {
    border-color: var(--primary);
    color: var(--text);
  }

  .steps li.current {
    border-color: var(--primary);
    color: var(--primary);
    font-weight: 700;
    animation: blink 1.2s ease-in-out infinite alternate;
  }

  @keyframes blink {
    to {
      border-color: var(--accent-soft);
    }
  }

  .code {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--primary);
    color: #fff;
  }

  .code strong {
    font-size: 1.5rem;
    letter-spacing: 0.2em;
  }

  .hint {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
    text-align: center;
  }
</style>
