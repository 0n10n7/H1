<script>
  import Icon from './Icon.svelte';

  let { tabs, active, onselect } = $props();
</script>

<nav class="tabbar">
  {#each tabs as tab (tab.id)}
    <button
      class:active={tab.id === active}
      aria-current={tab.id === active ? 'page' : undefined}
      onclick={() => onselect(tab.id)}
    >
      <Icon name={tab.icon} size={26} />
      <span>{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .tabbar {
    position: fixed;
    left: 50%;
    bottom: max(12px, env(safe-area-inset-bottom));
    transform: translateX(-50%);
    width: min(408px, calc(100% - 24px));
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 6px;
    border: 1px solid var(--border);
    border-radius: 30px;
    background: rgb(255 255 255 / 0.94);
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.1);
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 4px;
    border: none;
    border-radius: 24px;
    background: none;
    color: var(--muted);
    font-size: 0.8rem;
  }

  button.active {
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 600;
  }
</style>
