
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const Theme: CustomThemeConfig = {
    name: 'theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "var(--color-primary-200)",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "var(--color-warning-100)",
		"--on-surface": "var(--color-surface-200)",
		// =~= Theme Colors  =~=
		// primary | #0fb86f 
		"--color-primary-50": "219 244 233", // #dbf4e9
		"--color-primary-100": "207 241 226", // #cff1e2
		"--color-primary-200": "195 237 219", // #c3eddb
		"--color-primary-300": "159 227 197", // #9fe3c5
		"--color-primary-400": "87 205 154", // #57cd9a
		"--color-primary-500": "15 184 111", // #0fb86f
		"--color-primary-600": "14 166 100", // #0ea664
		"--color-primary-700": "11 138 83", // #0b8a53
		"--color-primary-800": "9 110 67", // #096e43
		"--color-primary-900": "7 90 54", // #075a36
		// secondary | #4F46E5 
		"--color-secondary-50": "229 227 251", // #e5e3fb
		"--color-secondary-100": "220 218 250", // #dcdafa
		"--color-secondary-200": "211 209 249", // #d3d1f9
		"--color-secondary-300": "185 181 245", // #b9b5f5
		"--color-secondary-400": "132 126 237", // #847eed
		"--color-secondary-500": "79 70 229", // #4F46E5
		"--color-secondary-600": "71 63 206", // #473fce
		"--color-secondary-700": "59 53 172", // #3b35ac
		"--color-secondary-800": "47 42 137", // #2f2a89
		"--color-secondary-900": "39 34 112", // #272270
		// tertiary | #0EA5E9 
		"--color-tertiary-50": "219 242 252", // #dbf2fc
		"--color-tertiary-100": "207 237 251", // #cfedfb
		"--color-tertiary-200": "195 233 250", // #c3e9fa
		"--color-tertiary-300": "159 219 246", // #9fdbf6
		"--color-tertiary-400": "86 192 240", // #56c0f0
		"--color-tertiary-500": "14 165 233", // #0EA5E9
		"--color-tertiary-600": "13 149 210", // #0d95d2
		"--color-tertiary-700": "11 124 175", // #0b7caf
		"--color-tertiary-800": "8 99 140", // #08638c
		"--color-tertiary-900": "7 81 114", // #075172
		// success | #2bcb15 
		"--color-success-50": "223 247 220", // #dff7dc
		"--color-success-100": "213 245 208", // #d5f5d0
		"--color-success-200": "202 242 197", // #caf2c5
		"--color-success-300": "170 234 161", // #aaeaa1
		"--color-success-400": "107 219 91", // #6bdb5b
		"--color-success-500": "43 203 21", // #2bcb15
		"--color-success-600": "39 183 19", // #27b713
		"--color-success-700": "32 152 16", // #209810
		"--color-success-800": "26 122 13", // #1a7a0d
		"--color-success-900": "21 99 10", // #15630a
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #d21922 
		"--color-error-50": "248 221 222", // #f8ddde
		"--color-error-100": "246 209 211", // #f6d1d3
		"--color-error-200": "244 198 200", // #f4c6c8
		"--color-error-300": "237 163 167", // #eda3a7
		"--color-error-400": "224 94 100", // #e05e64
		"--color-error-500": "210 25 34", // #d21922
		"--color-error-600": "189 23 31", // #bd171f
		"--color-error-700": "158 19 26", // #9e131a
		"--color-error-800": "126 15 20", // #7e0f14
		"--color-error-900": "103 12 17", // #670c11
		// surface | #495a8f 
		"--color-surface-50": "228 230 238", // #e4e6ee
		"--color-surface-100": "219 222 233", // #dbdee9
		"--color-surface-200": "210 214 227", // #d2d6e3
		"--color-surface-300": "182 189 210", // #b6bdd2
		"--color-surface-400": "128 140 177", // #808cb1
		"--color-surface-500": "73 90 143", // #495a8f
		"--color-surface-600": "66 81 129", // #425181
		"--color-surface-700": "55 68 107", // #37446b
		"--color-surface-800": "44 54 86", // #2c3656
		"--color-surface-900": "36 44 70", // #242c46
		
	}
}