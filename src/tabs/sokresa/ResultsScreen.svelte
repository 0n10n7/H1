<script>
  import Icon from '../../lib/Icon.svelte';
  import ScreenHeader from '../../lib/ScreenHeader.svelte';
  import { formatDate, formatTime } from '../../lib/format.js';

  /**
   * @type {{
   *   query: import('../../lib/planner.js').Query,
   *   suggestions: import('../../lib/planner.js').Suggestion[],
   *   selectedId: string | null,
   *   onback: () => void,
   *   onselect: (s: import('../../lib/planner.js').Suggestion) => void,
   * }}
   */
  let { query, suggestions, selectedId, onback, onselect } = $props();

  const whenText = $derived(
    query.when === null ? 'Åka nu' : `${formatDate(query.when)}, kl. ${formatTime(query.when)}`,
  );
</script>

<ScreenHeader title="Reseförslag" backLabel="Sök resa" {onback} />

<div class="stack">
  <section class="card summary">
    <dl>
      <dt>Från:</dt><dd>{query.from.name}</dd>
      <dt>Till:</dt><dd>{query.to.name}</dd>
      <dt>När:</dt><dd>{whenText}</dd>
    </dl>
    <button class="change" onclick={onback}>Ändra</button>
  </section>

  {#each suggestions as s, i (s.id)}
    <button class="card trip" class:selected={s.id === selectedId} onclick={() => onselect(s)}>
      <span class="top">
        <span class="title">Reseförslag {i + 1}</span>
        {#if s.kind === 'autonomous'}
          <span class="badge">Bokningsbar</span>
        {:else}
          <span class="badge green">Tillgänglig</span>
        {/if}
      </span>
      <span class="times">{formatTime(s.departure)} – {formatTime(s.arrival)}</span>
      <span class="mode">
        <Icon name="bus" />
        {s.kind === 'autonomous' ? 'Autonom buss' : `Buss ${s.line}`}
      </span>
      <span class="meta">Direktresa · {s.kind === 'autonomous' ? 'ca ' : ''}{s.durationMin} min</span>
    </button>
  {/each}

  <p class="hint">Autonoma bussar kör när någon beställer. Välj ett bokningsbart förslag för att boka.</p>
</div>

<style>
  .summary {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  dl {
    flex: 1;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    margin: 0;
    font-size: 1.05rem;
  }

  dt {
    font-weight: 700;
  }

  dd {
    margin: 0;
  }

  .change {
    border: none;
    background: none;
    color: var(--accent);
    font-size: 1.05rem;
    font-weight: 600;
  }

  .trip {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    width: 100%;
    border: none;
    text-align: left;
    color: var(--text);
  }

  .trip:hover:not(.selected) {
    background: #f7f9fb;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .times {
    font-size: 1.3rem;
    font-weight: 700;
  }

  .mode {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .meta {
    color: var(--muted);
    font-size: 1.05rem;
  }

  .trip.selected {
    background: var(--primary);
    color: #fff;
  }

  .trip.selected .meta {
    color: rgb(255 255 255 / 0.85);
  }

  .trip.selected .badge {
    background: rgb(255 255 255 / 0.2);
    color: #fff;
  }

  .hint {
    margin: 0 4px;
    color: var(--muted);
    font-size: 0.9rem;
  }
</style>
