import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/DeolaneSanPaolo/',
  plugins: [svelte()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
