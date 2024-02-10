import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit(), purgeCss()]
};

export default defineConfig({
	plugins: [sveltekit(), purgeCss()]
});