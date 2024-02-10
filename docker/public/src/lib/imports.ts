import type { PokemonMove } from "$lib/assets/ts/moves";

import { writable, type Writable } from "svelte/store";

export function capitalise(target: string | undefined): string {
    if (target == undefined) return "";
    return target.charAt(0).toUpperCase() + target.slice(1);
}

export const genStore: Writable<number> = writable(1);
export const saveFileStore: Writable<string> = writable("");
export const usedMoves: Writable<PokemonMove[]> = writable([]);