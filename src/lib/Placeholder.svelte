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
    padding: 40px 24px;
    text-align: center;
    color: var(--muted);
  }

  .circle {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin-bottom: 14px;
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent);
  }

  h2 {
    margin: 0 0 6px;
    font-size: 1.2rem;
    color: var(--text);
  }

  p {
    margin: 0;
    max-width: 28ch;
  }
</style>
