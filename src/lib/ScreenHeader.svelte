<script>
  import Icon from './Icon.svelte';

  /** @type {{ title: string, backLabel?: string, onback?: () => void, action?: import('svelte').Snippet }} */
  let { title, backLabel = 'Tillbaka', onback, action } = $props();
</script>

<header>
  <div class="bar">
    {#if onback}
      <button class="back" onclick={onback}>
        <Icon name="chevron-left" size={28} />
        {backLabel}
      </button>
    {:else}
      <span></span>
    {/if}
    {@render action?.()}
  </div>
  <h1>{title}</h1>
</header>

<style>
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
  }

  .back {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: -8px;
    padding: 6px 8px 6px 0;
    border: none;
    background: none;
    color: var(--accent);
    font-size: 1.15rem;
  }

  h1 {
    margin: 10px 0 20px;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
</style>
