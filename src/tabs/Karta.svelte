<script>
  import ScreenHeader from '../lib/ScreenHeader.svelte';
  import BusMap from '../lib/BusMap.svelte';
  import { fleet, myTrip, isLive } from '../lib/autobuss.svelte.js';

  const trip = $derived(myTrip());
  const live = $derived(isLive(trip));
</script>

<ScreenHeader title="Karta" />

<div class="stack">
  <section class="card">
    <BusMap
      vehicles={fleet.vehicles}
      from={live ? trip?.from : null}
      to={live ? trip?.to : null}
      assignedId={live ? trip?.vehicleId : null}
    />
  </section>
  <p class="note">
    Autonoma anropsbussar i Barkarby just nu. De grå linjerna är ordinarie busslinjer – den autonoma
    bussen kör dit du behöver inom trafikområdet.
  </p>
</div>

<style>
  .note {
    margin: 0 4px;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.4;
  }
</style>
