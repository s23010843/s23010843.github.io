// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import analogjsangular from '@analogjs/astro-angular';

import svelte from '@astrojs/svelte';

import node from '@astrojs/node';

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoFullName = process.env.GITHUB_REPOSITORY;
const repoName = repoFullName?.split('/')?.[1];
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;

const resolvedSite = repoOwner
  ? `https://${repoOwner}.github.io`
  : 'https://s23010843.github.io';

// For GitHub Pages:
// - User/organization pages repo: <owner>.github.io => base should be '/'
// - Project pages repo: <repo> => base should be '/<repo>'
const resolvedBase =
  isGitHubActions && repoName && repoOwner && repoName !== `${repoOwner}.github.io`
    ? `/${repoName}`
    : '/';

// https://astro.build/config
export default defineConfig({
  site: resolvedSite,
  base: resolvedBase,
  output: isGitHubActions ? 'static' : 'hybrid',
  adapter: isGitHubActions ? undefined : node({
    mode: 'standalone'
  }),

	vite: {
		plugins: [tailwindcss()]
	},

	integrations: [vue(), react(), sitemap(), analogjsangular(), svelte()]
});