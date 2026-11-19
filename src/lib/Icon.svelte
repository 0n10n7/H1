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
  {:else if name === 'map'}
    <polygon points="2 6 2 21 8.5 18 15.5 21 22 18 22 3 15.5 6 8.5 3 2 6" />
    <line x1="8.5" y1="3" x2="8.5" y2="18" />
    <line x1="15.5" y1="6" x2="15.5" y2="21" />
  {:else if name === 'ticket'}
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <line x1="6.5" y1="10" x2="14" y2="10" />
    <line x1="6.5" y1="14" x2="11" y2="14" />
    <line x1="17.5" y1="8.5" x2="17.5" y2="15.5" stroke-dasharray="1.5 2" />
  {:else if name === 'menu'}
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  {:else if name === 'bus'}
    <rect x="5" y="3" width="14" height="15" rx="3" />
    <line x1="5" y1="11" x2="19" y2="11" />
    <line x1="9" y1="6" x2="15" y2="6" />
    <circle cx="8.5" cy="14.5" r="0.6" />
    <circle cx="15.5" cy="14.5" r="0.6" />
    <line x1="8" y1="18" x2="8" y2="21" />
    <line x1="16" y1="18" x2="16" y2="21" />
  {:else if name === 'clock'}
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  {:else if name === 'calendar'}
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="3.5" y1="10" x2="20.5" y2="10" />
  {:else if name === 'pin'}
    <circle cx="12" cy="8" r="5" />
    <line x1="12" y1="13" x2="12" y2="22" />
  {:else if name === 'hourglass'}
    <line x1="6" y1="2.5" x2="18" y2="2.5" />
    <line x1="6" y1="21.5" x2="18" y2="21.5" />
    <path d="M7.5 2.5c0 5 4.5 6 4.5 9.5s-4.5 4.5-4.5 9.5" />
    <path d="M16.5 2.5c0 5-4.5 6-4.5 9.5s4.5 4.5 4.5 9.5" />
  {:else if name === 'info'}
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
    <line x1="12" y1="11" x2="12" y2="17" stroke="#fff" />
    <line x1="12" y1="7.5" x2="12.01" y2="7.5" stroke="#fff" />
  {:else if name === 'alert'}
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  {:else if name === 'swap'}
    <polyline points="8 20 8 4" />
    <polyline points="4 8 8 4 12 8" />
    <polyline points="16 4 16 20" />
    <polyline points="12 16 16 20 20 16" />
  {:else if name === 'arrow-right'}
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  {:else if name === 'chevron-left'}
    <polyline points="15 18 9 12 15 6" />
  {:else if name === 'chevron-right'}
    <polyline points="9 18 15 12 9 6" />
  {:else if name === 'chevron-up'}
    <polyline points="6 15 12 9 18 15" />
  {:else if name === 'chevron-down'}
    <polyline points="6 9 12 15 18 9" />
  {/if}
</svg>
