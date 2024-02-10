<script lang="ts">
    import { Autocomplete, type AutocompleteOption } from "@skeletonlabs/skeleton";
    import { type ModalStore, getModalStore } from "@skeletonlabs/skeleton";

    import { type PokemonMove, getMoves } from "$lib/assets/ts/moves";

    import { usedMoves } from "$lib/imports";
    
    import type { SvelteComponent } from "svelte";

    const store: ModalStore = getModalStore();
    export let parent: SvelteComponent;

    async function getAvailableMoves(mon: string, game: string, level: number): Promise<PokemonMove[] | null> {
        if (mon !== "") {
            let moves: PokemonMove[] = await getMoves(mon, game, level);
            return moves.filter(move => moveListFilter(move));
        }
        return null;
    }

    function moveListFilter(move: PokemonMove): boolean {
        for (let i = 0; i < $usedMoves.length; i++) {
            if ($usedMoves[i].value === move.value) {
                return false;
            }
        }
        return true;
    }

    function onSelection(event: CustomEvent<AutocompleteOption<any>>): void {
        chosen_move = event.detail.label;
        toggleAutocomplete();
        submit = true;
    }

    let chosen_move: string = "";
    let visible: boolean = true;
    let submit: boolean = false;

    function toggleAutocomplete() {
        visible = !visible;
    }

    function submitChoice(e: Event) {
        e.preventDefault();
        getAvailableMoves($store[0].meta.mon, $store[0].meta.game, $store[0].meta.level)
        .then(moves => {
            let usedMove: PokemonMove | undefined = moves?.find(move => move.label === chosen_move);
            console.log("move.find: ", usedMove);
            if (usedMove != undefined) {
                usedMoves.update(value => [...value, usedMove]);
            } else {
                console.log("no usedMove");
            }
        });
        parent.onClose();
    }
</script>

{#if $store[0]}
    <div class="bg-slate-800 rounded-lg w-modal h-56 relative bottom-36">
        <div class="relative top-12 grid grid-rows-2 justify-items-center">
            <div>Choose A Move</div>
            <input type="text" bind:value={chosen_move} class="input sm:w-96 phone-m:w-72 w-64 max-w-sm max-h-12 mb-2" placeholder="Search..." on:focusin={() => { if (visible) toggleAutocomplete() }} />
            <div class="card z-10 sm:w-96 phone-m:w-72 w-64 max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1" class:hidden={visible}>
                {#await getAvailableMoves($store[0].meta.mon, $store[0].meta.game, $store[0].meta.level) then moves}
                    {#if moves != null}
                        <Autocomplete bind:input={chosen_move} options={moves} on:selection={onSelection}/>
                    {/if}
                {/await}
            </div>
        </div>
        <div class="absolute bottom-8 float-right right-14">
            <button disabled={!submit} class="bg-primary-800 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed z-20 w-16 h-8 rounded-full" on:click={submitChoice}>Sure?</button>
        </div>
    </div>
{/if}