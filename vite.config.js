import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Relative asset paths, so the built site works under any sub-path –
  // e.g. https://<user>.github.io/<repo>/ on GitHub Pages – whatever the repo is called.
  base: './',
});
