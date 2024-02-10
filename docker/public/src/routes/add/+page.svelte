<script lang="ts">
    import { Stepper, Step } from '@skeletonlabs/skeleton';

    import Svelecte from "svelecte";
    
    import { genStore } from "$lib/imports";
    import Personal from '$lib/components/form/Personal.svelte';
    import Species from '$lib/components/form/Species.svelte';
    import Submitted from "$lib/components/form/Submitted.svelte";

    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import SuperDebug, { superForm } from "sveltekit-superforms";

    export let data;

    const {
        form,
        allErrors,
        message,
        enhance
    } = superForm(data.form, {
        dataType: "json",
        resetForm: false,
        onResult() {
            submitted = true;
            formParam = false;
        }
    });

    const {
        form: notes,
        allErrors: notesAllErrors,
        message: notesMessage,
        capture,
        restore,
        enhance: notesEnhance
    } = superForm(data.notes, {
        dataType: "json",
        onResult() {
            submitted = true;
            notesParam = false;
        }
    });

    export const snapshot = { capture, restore };

    interface GameOptions {
        value: string;
        text: string;
    }

    interface GenOptions {
        value: number;
        text: string;
        disabled?: boolean;
    }

    let formParam: boolean | null;
    let notesParam: boolean | null;
    let submitted: boolean = false;

    $: {
        formParam = $page.url.searchParams.get("form") as boolean | null;
        notesParam = $page.url.searchParams.get("notes") as boolean | null;
    }

    function reset() {
        formParam = false;
        notesParam = false;
        submitted = false;
    }

    let chosenGame: string = "red";
    let chosenGen: number = 1;
    $: $form.game = chosenGame;
    $: $form.generation = chosenGen;
    genStore.subscribe(value => { chosenGen = value });

    const gameNames: Record<number, string[]> = {
        1: ["Red", "Blue", "Yellow"],
        2: ["Gold", "Silver", "Crystal"],
        3: ["Ruby", "Sapphire", "Emerald", "FireRed", "LeafGreen"],
        4: ["Diamond", "Pearl", "Platinum", "HeartGold", "SoulSilver"],
        5: ["Black", "White", "Black2", "White2"],
        6: ["X", "Y", "OmegaRuby", "AlphaSapphire"],
        7: ["Sun", "Moon", "Ultra Sun", "Ultra Moon", "Lets Go: Pikachu", "Lets Go: Eevee"],
        8: ["Sword", "Shield", "BrilliantDiamond", "ShiningPearl", "Legends: Arceus"],
        9: ["Scarlet", "Violet"]
    };

    const gameValues: Record<number, string[]> = {
        1: ["red", "blue", "yellow"],
        2: ["gold", "silver", "crystal"],
        3: ["ruby", "sapphire", "emerald", "firered", "leafgreen"],
        4: ["diamond", "pearl", "platinum", "heartgold", "soulsilver"],
        5: ["black", "white", "black-2", "white-2"],
        6: ["x", "y", "omega-ruby", "alpha-sapphire"],
        7: ["sun", "moon", "ultra-sun", "ultra-moon", "lets-go-pikachu", "lets-go-eevee"],
        8: ["sword", "shield", "brilliant-diamond", "shining-pearl", "legends-arceus"],
        9: ["scarlet", "violet"]
    };

    const generations: number[] = [1,2,3,4,5,6,7,8,9];

    function getGames(game_list: string[], names: string[]): GameOptions[] {
        let gameOptions: GameOptions[] = [];
        for (let i of game_list) {
            for (let j of names) {
                if (game_list.indexOf(i) == names.indexOf(j)) {
                    gameOptions.push({value: i, text: j});
                }
            }
        }
        return gameOptions;
    }

    function getGens(): GenOptions[] {
        let genOptions: GenOptions[] = [];
        for (let i of generations) {
            if (i < 3) {
                genOptions.push({value: i, text: `Generation ${i}`});
            } else {
                genOptions.push({value: i, text: `Generation ${i}`, disabled: true});
            }
        }
        return genOptions;
    }
</script>

<svelte:head>
    <title>PokéVault | Add a Pokémon Manually</title>
</svelte:head>

{#if !(formParam || notesParam || submitted)}
    <div id="selection" class="w-96 relative top-36 left-1/2 -translate-x-48">
        <h1 class="text-center pb-4">Welcome to the Pokémon Selection Form</h1>
        <div id="pick" class="grid grid-rows-3 gap-y-4 justify-items-center">
            <button class="w-52 h-8 bg-primary-700 rounded-full" on:click={() => { goto("?form=true") }}>Continue to the Form</button>
            <span class="text-center inline-block">
                <span class="inline-block w-22 h-0.5 bg-gray-400 align-middle opacity-10 mr-0.5"></span>
                or
                <span class="inline-block w-22 h-0.5 bg-gray-400 align-middle opacity-10 ml-0.5"></span>
            </span>
            <button class="w-52 h-8 bg-primary-700 rounded-full" on:click={() => { goto("?notes=true") }}>Write Notes</button>
        </div>
    </div>
{/if}

{#if formParam && !submitted}
    <form class="w-11/12 ml-auto mr-auto mt-16" method="POST" action="/add?/form" use:enhance>
        <Stepper active="variant-filled-primary" buttonCompleteType="submit" stepTerm="Section">
            <Step buttonBack="invisible" buttonNext="variant-filled-primary fixed bottom-5 max-md:right-4 md:right-12">
                <svelte:fragment slot="header">
                    <span class="iconify hugeicons--pokeball h-7 w-7 float-left mr-2 relative top-1"></span>
                    Game Information
                </svelte:fragment>
                <div>
                    <div class="grid justify-items-center max-mobile-limit:grid-rows-1 mobile-limit:grid-cols-2 max-mobile-limit:grid-flow-row mobile-limit:grid-flow-col max-mobile-limit:gap-y-4">
                        <div id="gen_dropdown">
                            <Svelecte options={getGens()} placeholder="Select a Generation" searchable={false} disabledField="disabled" class="w-56 h-12" bind:value={chosenGen} on:change={() => { genStore.set(chosenGen) }} />
                        </div>
                        <div id="game_dropdown">
                             {#if chosenGen >= 1}
                                <Svelecte options={getGames(gameValues[chosenGen], gameNames[chosenGen])} class="w-56 h-12" searchable={false} bind:value={chosenGame} />
                             {/if}
                        </div>
                    </div>
                </div>
            </Step>
            <Step buttonBack="variant-ghost fixed bottom-5" buttonNext="variant-filled-primary fixed bottom-5 max-md:right-5 md:right-12">
                <svelte:fragment slot="header">
                    <span class="iconify ri--information-2-line h-7 float-left mr-2 relative top-1"></span>
                    Personal Details
                </svelte:fragment>
                <Personal bind:data={$form}/>
            </Step>
            <Step buttonNext="variant-filled-primary fixed bottom-5 max-md:right-5 md:right-12" buttonBack="variant-ghost fixed bottom-5">
                <svelte:fragment slot="header">
                    <span class="iconify ion--paw h-7 w-7 float-left mr-2 relative top-1"></span>
                    Species Details
                </svelte:fragment>
                <Species gen={chosenGen} game={chosenGame} bind:data={$form} />
            </Step>
            <Step buttonBack="variant-ghost fixed bottom-5" buttonComplete="variant-filled-primary fixed bottom-5 max-md:right-5 md:right-12">
                <svelte:fragment slot="header">
                    <span class="iconify material-symbols-light--add-notes-outline-sharp h-7 w-7 float-left mr-2 relative top-1"></span>
                    Additional Info
                </svelte:fragment>
                <textarea name="add_details" class="textarea ml-auto mr-auto resize-none" rows="10" bind:value={$form.additionalNotes} placeholder="Add any additional information about the Pokémon that may have been missed from the form."></textarea>
            </Step>
        </Stepper>
    </form>
{:else if notesParam && !submitted }
    <SuperDebug data={$notes}/>
    <form id="notesform" action="/add?/notes" method="POST" use:notesEnhance>
        <h2 class="w-6 relative left-4 phone-m:left-6 phone-l:left-8 md:left-10 lg:left-14 xl:left-20 top-16">Notes:</h2>
        <textarea name="add_details" class="w-[90vw] textarea relative left-1/2 top-18 -translate-x-[45vw] resize-none" rows="10" placeholder="Feel free to write as little or as much about your Pokémon as you please" bind:value={$notes.notes}></textarea>
        <button type="submit" class="w-24 bg-primary-700 relative top-32 right-12 xl:right-6 rounded-full">Submit</button>
    </form>
{:else if submitted && ($message || $notesMessage)}
    {#if $message}
        <Submitted errors={$allErrors} message={$message} on:redirect={reset} />
    {:else if $notesMessage}
        <Submitted errors={$notesAllErrors} message={$notesMessage} on:redirect={reset} />
    {/if}
{/if}


<style lang="postcss">
    :root {
        --sv-min-height: 3rem;
        --sv-border-radius: 0.5rem;
        --sv-bg: #37446b;
        --sv-border: none;
        --sv-dropdown-active-bg: #2563eb;
        --sv-dropdown-selected-bg: #166534;
    }
</style>
