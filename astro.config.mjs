// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import analogjsangular from '@analogjs/astro-angular';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://s23010843.github.io',
  base: '/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [vue(), react(), sitemap(), analogjsangular(), svelte()]
});