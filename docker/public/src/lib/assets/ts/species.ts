import pokedex from "./pokedex/pokedex.json";

import { PokemonClient, type Pokemon } from "pokenode-ts";

let dex: { pokedex_number: number, species: string, name: string, forms: string[], default?: string }[] = pokedex;

export function getNationalDex(species: string): number | null {
    for (let mon of dex) {
        if (mon.species === species) {
            return mon.pokedex_number;
        }
    }
    return null;
}

export function getSpeciesName(species: number, display: boolean = false): string {
    for (let mon of dex) {
        if (mon.pokedex_number === species) {
            if (display) return mon.name;
            return mon.species;
        }
    }
    return "";
}

interface Characteristics {
    height: number;
    weight: number;
}

export async function getCharacteristics(species: number): Promise<Characteristics> {
    const client = new PokemonClient();
    let pk: Pokemon = await client.getPokemonByName(getSpeciesName(species));
    return { height: pk.height, weight: pk.weight };
}

export async function getCry(species: number): Promise<string> {
    const client = new PokemonClient();
    let pk: Pokemon = await client.getPokemonByName(getSpeciesName(species));
    return pk.cries.latest;
}

export async function getBaseStats(species: number): Promise<number[]> {
    const client = new PokemonClient();
    let pk: Pokemon = await client.getPokemonByName(getSpeciesName(species));
    return [pk.stats[0].base_stat, pk.stats[1].base_stat, pk.stats[2].base_stat, pk.stats[5].base_stat, pk.stats[3].base_stat, pk.stats[4].base_stat]
}