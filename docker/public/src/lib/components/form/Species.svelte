<script lang="ts">
    import { getModalStore, Modal } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';

    import { DateInput } from 'date-picker-svelte';

    import Svelecte from 'svelecte';

    import PickerModal from '$lib/components/modals/speciesPickModal.svelte';
    import MoveModal from '$lib/components/modals/moveSelectModal.svelte';
    import { usedMoves } from '$lib/imports';
    import { getLocations } from '$lib/assets/ts/locations';
    import { getArtwork } from '$lib/assets/ts/images';
    import { getEntry } from '$lib/assets/ts/pokedex_entry';
    import { getTypes } from '$lib/assets/ts/type';
    import { getNationalDex } from '$lib/assets/ts/species';
    import dates from "$lib/assets/json/dates.json";
    
    import { onMount } from 'svelte';

    export let gen: number;
    export let game: string;
    export let data: any;

    data.evSpecial = 0;
    data.evSpecDef = 0;
    data.evSpecAtk = 0;

    let chosenMon: number | null = null;

    let shiny: boolean = false;

    let shinyToggle: (e: Event) => void = (e) => { e.preventDefault(); shiny = !shiny; };

    $: data.species = chosenMon ?? "";

    $: data.isShiny = shiny;

    $: data.moves = [...$usedMoves.map(move => move.value)];

    onMount(() => {
        usedMoves.set([]);
    });

    const modalStore: ModalStore = getModalStore();
    const pickModal: ModalComponent = { 
        ref: PickerModal
    };

    let moveModal: ModalComponent = {
        ref: MoveModal
    }

    async function triggerSpeciesModal(): Promise<void> {
        let modalSettings: ModalSettings;
        let promise: string = await new Promise<string>((resolve) => {
            modalSettings = {
                type: 'component',
                component: pickModal,
                meta: { game: game, gen: gen },
                response: (r: string) => {
                    resolve(r);
                }
            }
            modalStore.trigger(modalSettings);
        });
        chosenMon = getNationalDex(promise);
    }

    let modalSettings: ModalSettings;

    let level: string = "0";

    $: data.level = level;

    $: modalSettings = {
        type: "component",
        component: moveModal,
        meta: { mon: chosenMon, game: game, level: level }
    };
    
    interface ReleaseDate {
        game_title: string;
        release_date: string;
    };

    const releaseDates: ReleaseDate[] = dates;

    let modalTrigger: (e: Event) => void = (e: Event) => { 
        e.preventDefault();
        if (chosenMon != null) {
            modalStore.trigger(modalSettings);
        }
     };

</script>

<svelte:head>
    {#if chosenMon != null || chosenMon != undefined} 
        <link rel="preload" as="image" href={getArtwork(chosenMon)}>
        <link rel="preload" as="image" href={getArtwork(chosenMon, shiny)}>
    {/if}
</svelte:head>

<Modal />
{#if chosenMon === null || chosenMon === undefined}
    <div id="species-info" class="ml-auto mr-auto w-64">
        <div id="select" class="bg-surface-800 h-28 w-64 rounded-lg">
            <p class="text-center relative top-5">Choose a Pokémon</p>
            <button class="w-22 h-8 bg-primary-700 rounded-full relative left-1/2 top-7 -translate-x-1/2" type="button" on:click={() => { triggerSpeciesModal() }}>
                Choose
            </button>
        </div>
    </div>
{:else}
    <div id="frame">
        <figure class="w-fit ml-auto mr-auto">
            <div id="artwork" class="w-fit ml-auto mr-auto">
                <div>
                    <button class="float-right" on:click={shinyToggle}>
                        <span class="iconify hugeicons--stars" class:bg-yellow-500={shiny}></span>
                    </button>
                </div>
                {#key shiny}
                    <img src={getArtwork(chosenMon, shiny)} alt="" class="h-32 w-32 ml-auto mr-auto">
                {/key}
            </div>
            {#await getEntry(chosenMon, game)}
                <figcaption class="text-sm text-gray-500 text-center">
                    Retrieving entry
                    <span class="iconify svg-spinners--90-ring"></span>
                </figcaption>
            {:then entry}
                <figcaption class="text-sm text-gray-500 text-center">{entry}</figcaption>
            {/await}
        </figure>
    </div>
    <div class="relative top-8 grid md:grid-cols-4 max-md:grid-cols-2 max-md:grid-rows-2 max-md:gap-y-6 max-md:gap-x-3">
        <div id="types">
            <div class="text-center">Types</div>
            {#await getTypes(chosenMon)}
				<div class="flex justify-center">
					<span class="iconify svg-spinners--90-ring"></span>
				</div>
            {:then types}
                <div class="text-center font-bold text-lg">{types.join(" / ")}</div>
            {/await}
        </div>
        <div id="level">
            <div class="text-center">Level</div>
            <div class="w-full flex justify-center">
                <input type="number" class="formoption text-center text-sm w-44 h-8" bind:value={level}>
            </div>
        </div>
        <div id="met_date">
            <div class="text-center">Met Date</div>
            <div class="w-full flex justify-center">
				<span class="max-phone-l:hidden">
					<DateInput bind:value={data.metDate} min={new Date(releaseDates.filter(date => date.game_title == game)[0].release_date)} max={new Date()} format="yyyy/MM/dd"/>
				</span>
				<span class="phone-l:hidden">
					<input type="date" class="formoption h-8" min={new Date(releaseDates.filter(date => date.game_title == game)[0].release_date).toISOString().split("T")[0]} max={new Date().toISOString().split("T")[0]} bind:value={data.metDate} />
				</span>
            </div>
        </div>
        <div id="met_location">
            <div class="text-center">Met Location</div>
            {#await getLocations(chosenMon, game)}
                <div class="flex justify-center">
                    <span class="iconify svg-spinners--90-ring"></span>
                </div>
            {:then locations}
                <div class="flex justify-center">
                    <span class="w-44" style="--sv-min-height: 2rem;"><Svelecte options={locations} bind:value={data.metLocation} searchable={locations.length > 1} /></span>
                </div>
            {/await}
        </div>
    </div>
    <div class="grid mobile-limit:grid-cols-2 max-mobile-limit:grid-cols-1 grid-rows-1 justify-items-center relative top-24 pb-14">
        <div id="stats" class="w-fit bg-surface-800 rounded-xl" style="--tw-bg-opacity: 0.25">
            <div class="text-center font-bold mb-3 pt-2">EV Stats</div>
            <div class="grid grid-rows-5 grid-cols-[3rem,1fr] gap-y-2 justify-items-center items-center w-72 relative left-8 bottom-3">
                <div>HP:</div>
                <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evHp}></div>
                <div>Attack:</div>
                <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evAttack}></div>
                <div>Defense:</div>
                <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evDefense}></div>
                <div>Speed:</div>
                <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evSpeed}></div>
                {#if gen == 1}
                    <div>Special:</div>
                    <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evSpecial}></div>
                {:else}
                    <div>Spec. Defense:</div>
                    <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evSpecDef}></div>
                    <div>Spec. Attack:</div>
                    <div class="pb-3"><input type="number" class="formoption w-32" bind:value={data.evSpecAtk}></div>
                {/if}
            </div>
        </div>
        <div id="moves" class="w-44 min-h-[3rem] h-fit max-mobile-limit:mb-12 bg-surface-800 rounded-xl max-mobile-limit:order-first" style="--tw-bg-opacity: 0.5">
            <div class="border-b-2 border-surface-700 h-fit" style="--tw-border-opacity: 0.5">
                <div class="grid grid-cols-4 justify-items-center">
                    <div>
                        <button on:click={modalTrigger} class:hidden={$usedMoves.length === 4}>
                            <span class="iconify material-symbols-light--add float-left h-6 w-6 relative top-0.5"></span>
                        </button>
                    </div>
                    <div class="h-full text-center col-span-3 relative top-0.5" class:col-span-4={$usedMoves.length === 4} class:right-4={$usedMoves.length !== 4}>Moves</div>
                </div>
            </div>
            <ul class="list-disc my-2">
                {#each $usedMoves as move}
                    <li class="relative left-9">{move.label}</li>
                {/each}
            </ul>
        </div>
    </div>
{/if}

<style>
    :root {
        --date-picker-background: #242c46;
        --date-picker-foreground: white;
        --date-input-width: theme(width.44);
    }
	
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	  -webkit-appearance: none;
	  margin: 0;
	}

	input[type=number] {
	  -moz-appearance: textfield;
	}
</style>