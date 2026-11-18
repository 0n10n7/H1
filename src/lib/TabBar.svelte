<script>
  import Icon from './Icon.svelte';

  let { tabs, active, onselect } = $props();
</script>

<nav class="tabbar">
  {#each tabs as tab (tab.id)}
    <button
      class:active={tab.id === active}
      class:new={tab.isNew}
      aria-current={tab.id === active ? 'page' : undefined}
      onclick={() => onselect(tab.id)}
    >
      <span class="icon">
        <Icon name={tab.icon} />
        {#if tab.isNew}<span class="badge">Ny</span>{/if}
      </span>
      <span class="label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .tabbar {
    position: sticky;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    border-top: 1px solid var(--border);
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 2px 10px;
    border: none;
    background: none;
    color: var(--muted);
    font-size: 0.68rem;
    cursor: pointer;
  }

  button.active {
    color: var(--blue);
    font-weight: 600;
  }

  .icon {
    position: relative;
    display: grid;
    place-items: center;
    width: 48px;
    height: 30px;
    border-radius: 999px;
  }

  button.active .icon {
    background: var(--blue-light);
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -2px;
    padding: 1px 5px;
    border-radius: 999px;
    background: var(--pink);
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
  }

  .label {
    white-space: nowrap;
  }
</style>
