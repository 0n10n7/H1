<script>
  // "Sök resa" tab: a small navigation stack
  // search -> results -> confirm (autonomous bus) -> booking, plus Trafikläget.
  import ScreenHeader from '../lib/ScreenHeader.svelte';
  import Placeholder from '../lib/Placeholder.svelte';
  import SearchScreen from './sokresa/SearchScreen.svelte';
  import ResultsScreen from './sokresa/ResultsScreen.svelte';
  import ConfirmScreen from './sokresa/ConfirmScreen.svelte';
  import BookingScreen from './sokresa/BookingScreen.svelte';
  import { searchTrips } from '../lib/planner.js';
  import { ceilToHalfHour, toDateInput, toTimeInput } from '../lib/format.js';

  /**
   * @typedef {import('../lib/planner.js').Query} Query
   * @typedef {import('../lib/planner.js').Suggestion} Suggestion
   * @typedef {'search' | 'results' | 'confirm' | 'booking' | 'traffic'} Screen
   */

  /** @type {Screen} */
  let screen = $state('search');

  const nextHalfHour = ceilToHalfHour(Date.now());
  let form = $state({
    from: 'Barkarby station',
    to: 'Barkarbystaden C',
    /** @type {'now' | 'later'} */
    mode: 'now',
    date: toDateInput(nextHalfHour),
    time: toTimeInput(nextHalfHour),
  });

  /** @type {Query | null} */
  let query = $state(null);
  /** @type {Suggestion[]} */
  let suggestions = $state([]);
  /** @type {string | null} */
  let selectedId = $state(null);
  const chosen = $derived(suggestions.find((s) => s.id === selectedId) ?? null);

  /** @param {Screen} next */
  function go(next) {
    screen = next;
    window.scrollTo(0, 0);
  }

  /** @param {Query} q */
  function search(q) {
    query = q;
    suggestions = searchTrips(q);
    selectedId = suggestions[0]?.id ?? null;
    go('results');
  }

  /** @param {Suggestion} s */
  function select(s) {
    selectedId = s.id;
    if (s.kind === 'autonomous') go('confirm');
  }
</script>

{#if screen === 'search'}
  <SearchScreen bind:form onsearch={search} ontraffic={() => go('traffic')} onopenbooking={() => go('booking')} />
{:else if screen === 'results' && query}
  <ResultsScreen {query} {suggestions} {selectedId} onback={() => go('search')} onselect={select} />
{:else if screen === 'confirm' && chosen}
  <ConfirmScreen suggestion={chosen} onback={() => go('results')} onconfirmed={() => go('booking')} />
{:else if screen === 'booking'}
  <BookingScreen onback={() => go('search')} />
{:else}
  <ScreenHeader title="Trafikläget" backLabel="Sök resa" onback={() => go('search')} />
  <Placeholder icon="alert" title="Inga störningar" text="Störningsinformation ingår inte i prototypen." />
{/if}
