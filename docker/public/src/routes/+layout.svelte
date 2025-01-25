<script lang="ts">
	import '../app.postcss';
	import webLogo from '$lib/assets/web.png';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';

	import storage from "localstorage-slim";

	let dropdown: boolean = false;
	let clicked: boolean = false;

	let canSpin: boolean = false;

	let click: () => void = () => { dropdown = !dropdown; clicked = true; canSpin = true; setTimeout(() => canSpin = false, 500) };

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	function chooseIcon(): string {
		let icons: string[] = ["ball.png", "great-ball.png", "master-ball.png", "ultra-ball.png"];
		if (storage.get("i") == null) {
			let selection: number = Math.floor(Math.random() * 4);
			storage.set("i", selection, { ttl: 60*60*24 });
			return "/assets/"+icons[selection];
		} else {
			let selection: number | null = storage.get("i");
			return "/assets/"+icons[selection ?? 0];
		}
	}

	let icon: string;

	onMount(() => {
		icon = chooseIcon();
	})
</script>

<svelte:head>
	<link rel="shortcut icon" href={icon} type="image/png">
</svelte:head>

<body>
	<div class="w-[96vw] h-14 bg-surface-800 rounded-lg ml-auto mr-auto mt-3 overflow-hidden" class:show={dropdown && clicked} class:hide={!dropdown && clicked}>
		<div class="h-14 grid grid-cols-3">
			<button class="h-full w-18 hover:bg-surface-hover-token" on:click={() => click()}>
				<span class="iconify material-symbols-light--menu h-8 w-8" class:spin-once={canSpin}></span>
			</button>
			<img src={webLogo} alt="Project Logo" class="h-14 justify-self-center">
		</div>
		<div class="bg-surface-900 w-3/4 h-10 rounded-full ml-auto mr-auto mt-4">
			<div class="h-full grid grid-cols-2 justify-items-center">
				<a data-sveltekit-preload-data="hover" href="/" class="hover:underline h-fit self-center" on:click={() => click()}>Select a Box</a>
				<a data-sveltekit-preload-data="hover" href="/add" class="hover:underline h-fit self-center" on:click={() => click()}>Add a Pokémon</a>
			</div>
		</div>
	</div>
	<slot />
</body>

<style>
	@keyframes spin {
		0% { transform: rotate(0deg); }
		50% { transform: rotate(90deg); }
		100% { transform: rotate(180deg); }
	}

	@keyframes showRoutes {
		from { height: theme(height.14) }
		to { height: theme(height.32) }
	}

	@keyframes hideRoutes {
		from { height: theme(height.32) }
		to { height: theme(height.14) }
	}

	.spin-once {
		animation: spin 500ms linear;
	}

	.show {
		height: theme(height.32);
		animation: showRoutes 500ms linear;
	}

	.hide {
		height: theme(height.14);
		animation: hideRoutes 500ms linear;
	}
</style>