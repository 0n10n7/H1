<script>
  import TabBar from './lib/TabBar.svelte';
  import SokResa from './tabs/SokResa.svelte';
  import Karta from './tabs/Karta.svelte';
  import Biljetter from './tabs/Biljetter.svelte';
  import Mer from './tabs/Mer.svelte';

  const tabs = [
    { id: 'sok', label: 'Sök resa', icon: 'search', component: SokResa },
    { id: 'karta', label: 'Karta', icon: 'map', component: Karta },
    { id: 'biljetter', label: 'Biljetter', icon: 'ticket', component: Biljetter },
    { id: 'mer', label: 'Mer', icon: 'menu', component: Mer },
  ];

  // The active tab is kept in the URL hash so a reload stays on the same tab.
  const tabFromHash = () => {
    const id = location.hash.slice(1);
    return tabs.some((t) => t.id === id) ? id : 'sok';
  };

  let active = $state(tabFromHash());

  /** @param {string} id */
  function select(id) {
    active = id;
    history.replaceState(null, '', `#${id}`);
    window.scrollTo(0, 0);
  }
</script>

<svelte:window onhashchange={() => (active = tabFromHash())} />

<div class="app">
  <!-- All tabs stay mounted (just hidden), so each keeps its place like in a native app. -->
  <main>
    {#each tabs as tab (tab.id)}
      <div hidden={tab.id !== active}>
        <tab.component />
      </div>
    {/each}
  </main>

  <TabBar {tabs} {active} onselect={select} />
</div>

<style>
  .app {
    max-width: 440px;
    min-height: 100dvh;
    margin: 0 auto;
    background: var(--bg);
    box-shadow: 0 0 40px rgb(0 0 0 / 0.15);
  }

  main {
    padding: 8px 16px 120px;
    padding-top: max(8px, env(safe-area-inset-top));
  }
</style>
