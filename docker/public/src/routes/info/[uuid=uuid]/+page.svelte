<script lang="ts">
    import { Radar } from "svelte-chartjs";
    import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, RadialLinearScale, LineElement, Filler } from 'chart.js';
    import type { ChartData } from "chart.js";

    import { ProgressRadial } from '@skeletonlabs/skeleton';

    import Svelecte from "svelecte";

    import { page } from "$app/stores";
    import { browser } from "$app/environment";

    import { getArtwork } from "$lib/assets/ts/images";
    import { getCharacteristics, getCry, getBaseStats, getSpeciesName } from "$lib/assets/ts/species";
    import { getTypes } from "$lib/assets/ts/type";
    import { getVersionName } from "$lib/assets/ts/game";
    import dates from "$lib/assets/json/dates.json";

    import { capitalise } from "$lib/imports";

    import { getEntry } from "$lib/assets/ts/pokedex_entry";

    ChartJS.register(Title, Tooltip, Legend, PointElement, RadialLinearScale, LineElement, Filler);
    
    export let data;

    let title: string = "";
    
    let saveUuid: string = data.uuid;

    let artLoaded: boolean = false;

    let soundIconVisible: boolean = false
    let playing: boolean = false;

    const dropdownOptions: { value: string, text: string }[] = [
        { value: "evs", text: "EVs" },
        { value: "ivs", text: "IVs" },
        { value: "base", text: "Base Stats" }
    ];

    let options: any = {
        responsive: false,
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    display: false
                },
                grid: {
                    color: "rgba(0,0,0,0.7)"
                },
                angleLines: {
                    color: "rgba(0,0,0,0.7)"
                },
                pointLabels: {
                    color: "rgba(0,0,0,0.7)"
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    let boxIndex: string | null = $page.url.searchParams.get("i");
    let boxSlot: string | null = $page.url.searchParams.get("s");

    let moveFormat = (move: string) => { return move.split(/(?=[A-Z])/).map(section => section.charAt(0).toUpperCase() + section.slice(1)).join(" ") };

    interface Pokemon {
        species: number;
        generation: number;
        sex: string;
        form: string;
        isShiny: boolean;
        nickname: string;
        game: string;
        ot: string;
        metdate: Date | null;
        exp: number;
        level: number;
        moves: string[];
        evs: number[];
        ivs: number[];
    }

    interface ReleaseDate {
        game_title: string;
        release_date: string;
    }

    function getReleaseDate(game: string): string {
        let releaseDates: ReleaseDate[] = dates;
        for (let date of releaseDates) {
            if (game == date.game_title) {
                return new Date(date.release_date).toLocaleDateString("en-us");
            }
        }
        return "";
    }

    async function getPokemon(index: string, slot: string): Promise<Pokemon | null> {
        var req: Response = await fetch(`/api/get-pkm-from-save/${saveUuid}?boxindex=${parseInt(index)}&boxslot=${parseInt(slot)}`);
        if (!req.ok) {
            title = "Not Found";
            return null;
        } 
        var resp: Pokemon = await req.json();
        if (resp.nickname.length > 0) {
            title = `${resp.nickname} (${getSpeciesName(resp.species, true)})`;
        } else {
            title = `${getSpeciesName(resp.species, true)} (${capitalise(resp.game)})`;
        }
        return resp;
    }

    function play(elem: HTMLAudioElement): void {
        elem.volume = 0.5;
        elem.play();
        playing = true;
        elem.onended = () => { playing = false };
    }

    async function loadCry(src: string): Promise<HTMLAudioElement> {
        return new Promise<HTMLAudioElement>((resolve) => {
            let audio: HTMLAudioElement = new Audio(src);
            audio.oncanplay = () => { resolve(audio) };
        });
    }

    type ChartDataSet = "ivs" | "evs" | "base";

    let value: ChartDataSet = "evs";

    let baseStats: number[];

    $: (async () => {
        if (browser) {
            if (boxIndex !== null && boxSlot !== null) {
                let pk: number | undefined = (await getPokemon(boxIndex, boxSlot))?.species;
                if (pk != undefined) baseStats = await getBaseStats(pk);
            }
        }
    })();

    function getChartData(pk: Pokemon, type: ChartDataSet): ChartData<"radar", number[], unknown> {
        let stats: number[] = [];
        let bgColour: string;
        let borderColour: string;
        let label: string;
        switch (type) {
            case "ivs":
                label = "IVs";
                stats = pk.ivs;
                bgColour = "rgba(255, 140, 0, 0.2)";
                borderColour = "rgb(255, 140, 0)"
                break;
            case "evs":
                label = "EVs";
                stats = pk.evs
                bgColour = "rgba(135, 206, 235, 0.2)";
                borderColour = "rgb(135, 206, 235)";
                break;
            case "base":
                label = "Base";
                stats = baseStats;
                bgColour = "rgba(0, 128, 0, 0.2)";
                borderColour = "rgb(0, 128, 0)";
                break;
        }
        
        let r: ChartData<"radar", number[], unknown> =  {
            labels: ["HP", "Attack", "Defense", "Speed", "Sp. Atk", "Sp. Def"],
            datasets: [
                {
                    label: label,
                    data: stats,
                    fill: true,
                    backgroundColor: bgColour,
                    borderColor: borderColour
                }
            ]
        };
        return r;
    }
</script>

<svelte:head>
    {#if title != ""}
        <title>PokéVault - {title}</title>
    {/if}
</svelte:head>

{#if boxIndex !== null && boxSlot !== null}
    {#await getPokemon(boxIndex, boxSlot)}
        <div class="flex flex-col justify-center items-center text-center min-h-[100vh]">
            <ProgressRadial />
            <div class="flex mt-4">
                Loading
                <div class="loader"></div>
            </div>
        </div>
    {:then mon}
        {#if mon == null}
            <div class="flex flex-col justify-center items-center text-center min-h-[100vh]">
                <p class="text-red-600">Invalid Input</p>
            </div>
        {:else}
            <div class="w-48 mt-10 ml-auto mr-auto flex flex-col">
                <div>
                    {#if mon.sex == "male"}
                        <span class="iconify material-symbols-light--male float-left h-5 w-5 select-none"></span>
                    {:else if mon.sex == "female"}
                        <span class="iconify material-symbols-light--female float-left h-5 w-5 select-none"></span>
                    {:else}
                        <span class="iconify material-symbols-light--agender float-left h-5 w-5 select-none"></span>
                    {/if}
                    {#if mon.isShiny}
                        <span class="iconify hugeicons--stars bg-yellow-500 float-right h-5 w-5 select-none"></span>
                    {/if}
                </div>
                <div>
                    <div class="h-48 w-48 placeholder rounded-lg animate-pulse" class:hidden={artLoaded}></div>
                    <img src={getArtwork(mon.species, mon.isShiny)} alt="Artwork Not Found" class="select-none" class:hidden={!artLoaded} on:load={() => { artLoaded = true }}>
                </div>
                <div class="self-center">
                    <strong class="text-center underline ml-auto mr-auto">{getSpeciesName(mon.species, true)}</strong>
                </div>
            </div>
            <div class="w-11/12 grid grid-cols-1 max-sm:grid-rows-4 sm:grid-cols-2 md:grid-cols-3 ml-auto mr-auto mt-6 gap-y-8 gap-x-8 pb-12">
                <div class="w-full h-80 bg-surface-700 shadow-lg rounded-lg max-sm:order-1">
                    <div class="flex flex-col">
                        <strong class="text-center w-full mt-1">Species</strong>
                        <div class="grid grid-cols-2 grid-rows-2 gap-y-4 justify-center">
                            <div id="types">
                                <p class="text-white font-bold text-center mb-2">Types</p>
                                {#await getTypes(mon.species)}
                                    <div class="w-24 placeholder animate-pulse ml-auto mr-auto"></div>
                                {:then types}
                                    <p class="min-w-[6rem] text-center text-sm">{types.join(" / ")}</p>
                                {/await}
                            </div>
                            <div id="cry" class="grid">
                                <p class="text-white font-bold text-center mb-2">Cry</p>
                                {#await getCry(mon.species)}
                                    <div class="w-24 placeholder animate-pulse ml-auto mr-auto"></div>
                                {:then cry}
                                    {#await loadCry(cry)}
                                        <button class="bg-surface-800 bg-opacity-70 w-10 h-6 relative ml-auto mr-auto rounded-full" disabled>
                                            <div class="w-10 h-6 rounded-full flex justify-center items-center">
                                                <span class="iconify svg-spinners--90-ring"></span>
                                            </div>
                                        </button>
                                    {:then audioElem}
                                        <button class="bg-surface-800 bg-opacity-70 w-10 h-6 relative ml-auto mr-auto rounded-full overflow-hidden transition-all hover:w-24 ease-in-out duration-500" on:mouseenter={() => { soundIconVisible = true }} on:mouseleave={() => { soundIconVisible = false }} on:touchend={() => { soundIconVisible = false }} on:click={() => play(audioElem)}>
                                            <div class="w-10 h-6 rounded-full flex justify-center items-center">
                                                <span class="iconify ri--play-fill"></span>
                                            </div>
                                            {#if soundIconVisible && playing}
                                                <span class="iconify svg-spinners--bars-scale-middle absolute top-1"></span>
                                            {:else if soundIconVisible && !playing}
                                                <span class="iconify tabler--antenna-bars-1 absolute top-1"></span>
                                            {/if}
                                        </button>
                                    {/await}
                                {/await}
                            </div>
                            {#await getCharacteristics(mon.species)}
                                <div>
                                    <p class="text-white font-bold text-center">Height</p>
                                    <span class="placeholder animate-pulse ml-auto mr-auto"></span>
                                </div>
                                <div>
                                    <p class="text-white font-bold text-center">Weight</p>
                                    <span class="placeholder animate-pulse ml-auto mr-auto"></span>
                                </div>
                            {:then values}
                                <div id="height">
                                    <p class="text-white font-bold text-center mb-2">Height</p>
                                    <p class="text-center text-sm">{values.height / 10} metres</p>
                                </div>
                                <div id="weight">
                                    <p class="text-white font-bold text-center mb-2">Weight</p>
                                    <p class="text-center text-sm">{values.weight / 10} kg</p>
                                </div>
                            {/await}
                            <div id="entry" class="col-span-2">
                                {#if mon.game == "rby"}
                                    <p class="text-white font-bold text-center mb-2">PokéDex Entry <sup class="italic">(Red)</sup></p>
                                    {#await getEntry(mon.species, "red")}
                                        <div class="col-span-2 placeholder animate-pulse"></div>
                                    {:then entry}
                                        <div class="bg-surface-500 w-[90%] col-span-2 ml-auto mr-auto rounded-lg shadow-md">
                                            <p class="text-center py-3 text-sm opacity-80">{entry}</p>
                                        </div>
                                    {/await}
                                {:else if mon.game == "gsc"}
                                    <p class="text-white font-bold text-center mb-2">PokéDex Entry <sup class="italic">(Gold)</sup></p>
                                    {#await getEntry(mon.species, "gold")}
                                        <div class="col-span-2 placeholder animate-pulse"></div>
                                    {:then entry}
                                        <div class="bg-surface-500 w-[90%] col-span-2 ml-auto mr-auto rounded-lg shadow-md">
                                            <p class="text-center py-3 text-sm opacity-80">{entry}</p>
                                        </div>
                                    {/await}
                                {:else}
                                    <p class="text-white font-bold text-center mb-2">PokéDex Entry</p>
                                    {#await getEntry(mon.species, mon.game)}
                                        <div class="col-span-2 placeholder animate-pulse"></div>
                                    {:then entry}
                                        {#if entry == ""}
                                            <div class="bg-surface-500 w-[90%] col-span-2 ml-auto mr-auto rounded-lg shadow-md">
                                                <p class="text-center py-3 text-sm opacity-80">Entry Not Found</p>
                                            </div>
                                        {:else}
                                            <div class="bg-surface-500 w-[90%] col-span-2 ml-auto mr-auto rounded-lg shadow-md">
                                                <p class="text-center py-3 text-sm opacity-80">{entry}</p>
                                            </div>
                                        {/if}
                                    {/await}
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-80 bg-surface-700 shadow-lg rounded-lg md:col-start-3 max-sm:order-2">
                    <div class="flex flex-col gap-y-3">
                        <strong class="text-center w-full mt-1">Stats</strong>
                        <Svelecte options={dropdownOptions} searchable={false} bind:value class="w-3/4 ml-auto mr-auto shadow-md"/>
                        {#key value}
                            <Radar data={getChartData(mon, value)} {options} class="bg-surface-500 ml-auto mr-auto rounded-lg shadow-md py-2 md:min-w-[200px]" style="width: 75%; height: calc(75% * 5/4); max-height: 200px; min-height: 150px; max-width: 300px;"/>
                        {/key}
                    </div>
                </div>
                <div class="w-full sm:h-64 bg-surface-700 shadow-lg rounded-lg md:col-start-1 md:row-start-2 max-sm:order-3">
                    <div class="flex flex-col items-center">
                        <strong class="text-center w-full mt-1">Moves</strong>
                        <div class="bg-surface-500 w-[90%] h-52 rounded-lg shadow-md max-sm:mt-6">
                            <div class="flex flex-col gap-y-4 w-[90%] ml-auto mr-auto mt-4">
                                {#each mon.moves as move, i}
                                    {#if move == "None"}
                                        <div class="bg-surface-600 rounded-full h-full text-center">Move #{i+1}</div>
                                    {:else}
                                        <div class="bg-surface-600 rounded-full h-full text-center">{moveFormat(move)}</div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full sm:h-64 bg-surface-700 shadow-lg rounded-lg md:row-start-2 md:col-span-2 max-sm:order-4">
                    <div class="flex flex-col items-center">
                        <strong class="text-center w-full mt-1">Info</strong>
                        <div class="bg-surface-500 rounded-lg shadow-md w-[90%] h-52 max-sm:mt-6">
                            <div id="misc" class="w-[90%] h-full ml-auto mr-auto grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-x-3 items-center">
                                <div>
                                    {#if mon.game == "rby"}
                                        <p><strong>Original Game: </strong><span class="text-sm">Red/Blue/Yellow</span></p>
                                    {:else if mon.game == "gsc"}
                                        <p><strong>Original Game: </strong><span class="text-sm">Gold/Silver/Crystal</span></p>
                                    {:else}
                                        {#await getVersionName(mon.game)}
                                            <div class="h-full w-full placeholder animate-pulse"></div>
                                        {:then version}
                                            <p><strong>Original Game: </strong>{version}</p>
                                        {/await}
                                    {/if}
                                </div>
                                <div>
                                    <p><strong>OT Nickname: </strong>{mon.ot}</p>
                                </div>
                                <div>
                                    {#if mon.metdate != null}
                                        <p><strong>Met Date: </strong>{mon.metdate}</p>
                                    {:else}
                                        {#if mon.game == "rby"}
                                            <p><strong>Met Date <sup class="italic">(Red)</sup>: </strong>{getReleaseDate("red")}</p>
                                        {:else if mon.game == "gsc"}
                                            <p><strong>Met Date <sup class="italic">(Gold)</sup>: </strong>{getReleaseDate("gold")}</p>
                                        {:else}
                                            <p><strong>Met Date: </strong>{getReleaseDate(mon.game)}</p>
                                        {/if}
                                    {/if}
                                </div>
                                <div class="md:col-span-3">
                                    <p><strong>Bulbapedia Link: </strong><a class="text-blue-700 underline" href={`https://bulbapedia.bulbagarden.net/wiki/${getSpeciesName(mon.species, true)}_(Pok%C3%A9mon)`} target="_blank" rel="noopener noreferrer">Here</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    {/await}
{/if}

<style>
    :root {
        --sv-min-height: 3rem;
        --sv-border-radius: 0.5rem;
        --sv-bg: #425181;
        --sv-border: none;
        --sv-dropdown-active-bg: #2563eb;
        --sv-dropdown-selected-bg: #166534;
    }

    #misc p {
        text-align: center;
    }

     /* From https://css-loaders.com/dots/ */
    .loader {
        width: 15px;
        aspect-ratio: 4;
        --_g: no-repeat radial-gradient(circle closest-side,#fff 90%,#0000);
        background: 
            var(--_g) 0%   50%,
            var(--_g) 50%  50%,
            var(--_g) 100% 50%;
        background-size: calc(100%/3) 100%;
        animation: l7 1s infinite linear;
        align-self: end;
        margin-bottom: 2px;
        margin-left: 2px;
    }

    @keyframes l7 {
        33%{background-size:calc(100%/3) 0%  ,calc(100%/3) 100%,calc(100%/3) 100%}
        50%{background-size:calc(100%/3) 100%,calc(100%/3) 0%  ,calc(100%/3) 100%}
        66%{background-size:calc(100%/3) 100%,calc(100%/3) 100%,calc(100%/3) 0%  }
    }
</style>