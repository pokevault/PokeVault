import { PokemonClient, type Pokemon } from "pokenode-ts";
import { capitalise } from "$lib/imports";

import { getSpeciesName } from "./species";

const client = new PokemonClient();

export async function getTypes(mon: number): Promise<string[]> {
    let pokemon: Pokemon = await client.getPokemonByName(getSpeciesName(mon));
    let types: string[] = [];
    for (var type of pokemon.types) {
        types.push(capitalise(type.type.name));
    }
    return types;
}