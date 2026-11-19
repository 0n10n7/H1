<script>
  import Icon from '../../lib/Icon.svelte';
  import ScreenHeader from '../../lib/ScreenHeader.svelte';
  import { places, findPlace } from '../../lib/places.js';
  import { myTrip, isOngoing } from '../../lib/autobuss.svelte.js';
  import { formatDate, formatTime, fromInputs, toDateInput } from '../../lib/format.js';

  /**
   * @type {{
   *   form: { from: string, to: string, mode: 'now' | 'later', date: string, time: string },
   *   onsearch: (query: import('../../lib/planner.js').Query) => void,
   *   ontraffic: () => void,
   *   onopenbooking: () => void,
   * }}
   */
  let { form = $bindable(), onsearch, ontraffic, onopenbooking } = $props();

  let whenOpen = $state(true);
  let error = $state('');
  const today = toDateInput(Date.now());
  const booking = $derived(myTrip());
  const chosenTime = $derived(form.date && form.time ? fromInputs(form.date, form.time) : null);
  const whenSummary = $derived(
    form.mode === 'later' && chosenTime ? `${formatDate(chosenTime, false)}, ${form.time}` : 'Åka nu',
  );

  function swap() {
    [form.from, form.to] = [form.to, form.from];
  }

  // Opens the browser's own date/time picker when the styled field is clicked.
  /** @param {MouseEvent & { currentTarget: HTMLInputElement }} event */
  function openPicker(event) {
    try {
      event.currentTarget.showPicker();
    } catch {
      // Older browsers: the input still gets focus and can be typed into.
    }
  }

  /** @param {SubmitEvent} event */
  function submit(event) {
    event.preventDefault();
    error = '';
    const from = findPlace(form.from);
    const to = findPlace(form.to);
    const later = form.mode === 'later';

    if (!from || !to) {
      error = 'Välj hållplatser från listan.';
    } else if (from === to) {
      error = 'Välj två olika hållplatser.';
    } else if (later && !chosenTime) {
      error = 'Välj datum och tid.';
    } else if (later && chosenTime && chosenTime < Date.now() - 60_000) {
      error = 'Den tiden har redan passerat.';
    } else {
      onsearch({ from, to, when: later ? chosenTime : null });
    }
  }
</script>

<ScreenHeader title="Sök resa">
  {#snippet action()}
    <button class="traffic" onclick={ontraffic}>Trafikläget <Icon name="alert" size={20} /></button>
  {/snippet}
</ScreenHeader>

<form class="stack" onsubmit={submit}>
  {#if booking && isOngoing(booking)}
    <button type="button" class="card booked" onclick={onopenbooking}>
      <span class="booked-icon"><Icon name="bus" /></span>
      <span class="booked-text">
        <strong>Din bokade resa</strong>
        <span>{booking.from.name} – {booking.to.name}, {formatTime(booking.departure)}</span>
      </span>
      <Icon name="chevron-right" />
    </button>
  {/if}

  <div class="card route">
    <label class="row">
      <span>Från</span>
      <input list="stops" bind:value={form.from} placeholder="Hållplats" autocomplete="off" />
    </label>
    <label class="row">
      <span>Till</span>
      <input list="stops" bind:value={form.to} placeholder="Hållplats" autocomplete="off" />
    </label>
    <button type="button" class="swap" onclick={swap} aria-label="Byt plats på Från och Till">
      <Icon name="swap" />
    </button>
    <datalist id="stops">
      {#each places as place (place.id)}<option value={place.name}></option>{/each}
    </datalist>
  </div>

  <button type="button" class="when-toggle" onclick={() => (whenOpen = !whenOpen)} aria-expanded={whenOpen}>
    <Icon name="clock" />
    <span class="question">När vill du åka?</span>
    <span class="summary">{whenSummary}</span>
    <Icon name={whenOpen ? 'chevron-up' : 'chevron-down'} size={20} />
  </button>

  {#if whenOpen}
    <div class="card when">
      <label class="option" class:selected={form.mode === 'now'}>
        <input type="radio" bind:group={form.mode} value="now" />
        Åka nu
      </label>
      <div class="option-group" class:selected={form.mode === 'later'}>
        <label class="option">
          <input type="radio" bind:group={form.mode} value="later" />
          Välj datum och tid
        </label>
        {#if form.mode === 'later'}
          <div class="pickers">
            <label>
              <span class="picker-label">Datum</span>
              <span class="picker">
                <Icon name="calendar" size={20} />
                <span class="value">{chosenTime ? formatDate(chosenTime) : 'Välj datum'}</span>
                <Icon name="chevron-right" size={18} />
                <input type="date" bind:value={form.date} min={today} onclick={openPicker} />
              </span>
            </label>
            <label>
              <span class="picker-label">Tid</span>
              <span class="picker">
                <Icon name="clock" size={20} />
                <span class="value">{form.time || 'Välj tid'}</span>
                <Icon name="chevron-right" size={18} />
                <input type="time" bind:value={form.time} onclick={openPicker} />
              </span>
            </label>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if error}<p class="error">{error}</p>{/if}

  <button class="btn" type="submit">Sök</button>
</form>

<style>
  .traffic {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    color: var(--accent);
    font-size: 1rem;
  }

  .booked {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    border: 1.5px solid var(--primary);
    text-align: left;
    color: var(--text);
  }

  .booked-icon {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--accent-soft);
    color: var(--accent);
  }

  .booked-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .booked-text strong {
    color: var(--text);
    font-size: 1rem;
  }

  .route {
    position: relative;
    padding: 0 16px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-right: 56px; /* room for the swap button */
  }

  .row + .row {
    border-top: 1px solid var(--border);
  }

  .row span {
    width: 40px;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .row input {
    flex: 1;
    min-width: 0;
    padding: 20px 0;
    border: none;
    outline: none;
    background: none;
    font-size: 1.1rem;
  }

  .swap {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--surface-2);
    color: var(--accent);
  }

  .when-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 2px;
    border: none;
    background: none;
    color: var(--accent);
    font-size: 1.1rem;
  }

  .question {
    flex: 1;
    text-align: left;
    font-weight: 600;
  }

  .summary {
    font-weight: 600;
  }

  .when {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 12px;
    border-radius: 12px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .option-group {
    border: 2px solid transparent;
    border-radius: 14px;
  }

  .option-group.selected {
    border-color: var(--primary);
  }

  .option-group.selected .option {
    background: var(--accent-soft);
    border-radius: 12px 12px 0 0;
    font-weight: 700;
  }

  input[type='radio'] {
    appearance: none;
    flex: none;
    width: 26px;
    height: 26px;
    margin: 0;
    border: 2px solid var(--muted);
    border-radius: 50%;
    cursor: pointer;
  }

  input[type='radio']:checked {
    border-color: var(--primary);
    background: radial-gradient(var(--primary) 0 45%, #fff 50%);
  }

  .pickers {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 12px;
    padding: 12px;
  }

  .picker-label {
    display: block;
    margin-bottom: 6px;
    font-weight: 700;
  }

  .picker {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface-2);
    color: var(--muted);
  }

  .picker .value {
    flex: 1;
    color: var(--text);
    white-space: nowrap;
  }

  /* The real input covers the styled field invisibly, so clicks reach the native picker. */
  .picker input {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
</style>
