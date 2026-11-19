<script>
  import Icon from '../../lib/Icon.svelte';
  import ScreenHeader from '../../lib/ScreenHeader.svelte';
  import TripDetails from '../../lib/TripDetails.svelte';
  import { bookMyTrip } from '../../lib/autobuss.svelte.js';

  /**
   * @type {{
   *   suggestion: import('../../lib/planner.js').Suggestion,
   *   onback: () => void,
   *   onconfirmed: () => void,
   * }}
   */
  let { suggestion, onback, onconfirmed } = $props();

  let error = $state('');

  function confirm() {
    error = '';
    try {
      bookMyTrip(suggestion);
      onconfirmed();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<ScreenHeader title="Bekräfta bokning" backLabel="Reseförslag" {onback} />

<div class="stack">
  <TripDetails
    from={suggestion.from}
    to={suggestion.to}
    departure={suggestion.departure}
    durationMin={suggestion.durationMin}
    subtitle="Bokningsbar resa"
  />

  <div class="info">
    <Icon name="info" />
    Bussen körs vid efterfrågan och kan samordnas med andra resenärer i området.
  </div>

  {#if error}<p class="error">{error}</p>{/if}

  <button class="btn green" onclick={confirm}>Bekräfta bokning</button>
  <button class="link" onclick={onback}>Välj annat reseförslag</button>
</div>
