<script>
  import TabBar from './lib/TabBar.svelte';
  import Icon from './lib/Icon.svelte';
  import SokResa from './tabs/SokResa.svelte';
  import Avgangar from './tabs/Avgangar.svelte';
  import Anropsbuss from './tabs/Anropsbuss.svelte';
  import Biljetter from './tabs/Biljetter.svelte';
  import Trafiklaget from './tabs/Trafiklaget.svelte';

  const tabs = [
    { id: 'sok', label: 'Sök resa', icon: 'search', component: SokResa },
    { id: 'avgangar', label: 'Avgångar', icon: 'clock', component: Avgangar },
    { id: 'anropsbuss', label: 'Anropsbuss', title: 'Autonom anropsbuss', icon: 'bus', component: Anropsbuss, isNew: true },
    { id: 'biljetter', label: 'Biljetter', icon: 'ticket', component: Biljetter },
    { id: 'trafiklaget', label: 'Trafikläget', icon: 'alert', component: Trafiklaget },
  ];

  // The active tab is kept in the URL hash so a reload stays on the same tab.
  const tabFromHash = () => {
    const id = location.hash.slice(1);
    return tabs.some((t) => t.id === id) ? id : 'sok';
  };

  let active = $state(tabFromHash());
  const current = $derived(tabs.find((t) => t.id === active) ?? tabs[0]);
  const Current = $derived(current.component);

  /** @param {string} id */
  function select(id) {
    active = id;
    history.replaceState(null, '', `#${id}`);
  }
</script>

<svelte:window onhashchange={() => (active = tabFromHash())} />

<div class="app">
  <header class="topbar">
    <h1>{current.title ?? current.label}</h1>
    <button class="account" aria-label="Mitt konto"><Icon name="user" /></button>
  </header>

  <main>
    <Current />
  </main>

  <TabBar {tabs} {active} onselect={select} />
</div>

<style>
  .app {
    max-width: 440px;
    min-height: 100dvh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    box-shadow: 0 0 40px rgb(0 0 0 / 0.15);
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    padding-top: max(14px, env(safe-area-inset-top));
    background: var(--blue);
    color: #fff;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  .account {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.15);
    color: #fff;
    cursor: pointer;
  }

  main {
    flex: 1;
    padding: 16px;
  }
</style>
