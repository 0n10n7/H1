<script>
  import Placeholder from '../lib/Placeholder.svelte';
</script>

<form class="card search" onsubmit={(e) => e.preventDefault()}>
  <label class="field">Från<input placeholder="Hållplats, adress eller plats" /></label>
  <label class="field">Till<input placeholder="Hållplats, adress eller plats" /></label>
  <button class="btn" type="submit" disabled>Sök resa</button>
</form>

<Placeholder icon="search" title="Reseplaneraren" text="Ingår inte i prototypen. Testa fliken Anropsbuss!" />

<style>
  .search {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
