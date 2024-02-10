import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'
import { addIconSelectors } from '@iconify/tailwind';
import { Theme } from './theme'
import forms from '@tailwindcss/forms'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			screens: {
				'phone-m': '375px',
				'phone-l': '425px',
				'mobile-limit': '720px'
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem'
			},
		},
	},
	plugins: [
		forms,
		addIconSelectors(["ri", "hugeicons", "material-symbols-light", "ion", "svg-spinners", "tabler"]),
		skeleton({
			themes: {
				custom: [
					Theme
				]
			},
		}),
	],
} satisfies Config;
