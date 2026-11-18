<script>
  let { name, size = 24 } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'search'}
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16" y2="16" />
  {:else if name === 'clock'}
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  {:else if name === 'bus'}
    <rect x="4" y="4" width="16" height="13" rx="3" />
    <line x1="4" y1="11" x2="20" y2="11" />
    <circle cx="8" cy="14" r="0.6" />
    <circle cx="16" cy="14" r="0.6" />
    <line x1="7" y1="17" x2="7" y2="20" />
    <line x1="17" y1="17" x2="17" y2="20" />
    <path d="M9.5 1.8a4 4 0 0 1 5 0" />
  {:else if name === 'ticket'}
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z" />
    <line x1="14" y1="5" x2="14" y2="19" stroke-dasharray="2 2.5" />
  {:else if name === 'alert'}
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  {:else if name === 'user'}
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  {:else if name === 'swap'}
    <polyline points="7 3 7 21" />
    <polyline points="3 7 7 3 11 7" />
    <polyline points="17 21 17 3" />
    <polyline points="13 17 17 21 21 17" />
  {/if}
</svg>
