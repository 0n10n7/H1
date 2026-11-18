<script>
  import Icon from './Icon.svelte';

  let { icon, title, text } = $props();
</script>

<div class="placeholder">
  <div class="circle"><Icon name={icon} size={32} /></div>
  <h2>{title}</h2>
  <p>{text}</p>
</div>

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px;
    text-align: center;
    color: var(--muted);
  }

  .circle {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin-bottom: 12px;
    border-radius: 50%;
    background: var(--blue-light);
    color: var(--blue);
  }

  h2 {
    margin: 0 0 6px;
    font-size: 1.1rem;
    color: var(--text);
  }

  p {
    margin: 0;
    max-width: 28ch;
  }
</style>
