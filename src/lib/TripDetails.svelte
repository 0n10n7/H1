<script>
  // The "Autonom buss" summary card used on the confirm and booking screens.
  import Icon from './Icon.svelte';
  import { formatDate, formatTime } from './format.js';

  /**
   * @type {{
   *   from: import('./places.js').Place,
   *   to: import('./places.js').Place,
   *   departure: number,
   *   durationMin: number,
   *   subtitle: string,
   * }}
   */
  let { from, to, departure, durationMin, subtitle } = $props();
</script>

<section class="card details">
  <div class="head">
    <span class="tile"><Icon name="bus" size={30} /></span>
    <div>
      <h2>Autonom buss</h2>
      <p>{subtitle}</p>
    </div>
  </div>
  <ul>
    <li>
      <Icon name="pin" />
      <span class="text route">{from.name} <Icon name="arrow-right" size={18} /> {to.name}</span>
    </li>
    <li><Icon name="calendar" /><span class="text">{formatDate(departure)}</span></li>
    <li><Icon name="clock" /><span class="text">Avgång ca {formatTime(departure)}</span></li>
    <li><Icon name="hourglass" /><span class="text">Restid ca {durationMin} min</span></li>
  </ul>
</section>

<style>
  .head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }

  .tile {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: var(--accent-soft);
    color: var(--accent);
  }

  h2 {
    margin: 0;
    font-size: 1.35rem;
  }

  .head p {
    margin: 2px 0 0;
    color: var(--muted);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-left: 2px;
    font-size: 1.05rem;
  }

  li > :global(svg) {
    flex: none;
    color: var(--muted);
  }

  .text {
    flex: 1;
    padding: 13px 0;
  }

  li + li .text {
    border-top: 1px solid var(--border);
  }

  .route {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
</style>
