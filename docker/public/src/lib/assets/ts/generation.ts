import { GameClient, type Generation, type NamedAPIResource } from "pokenode-ts";

const client = new GameClient();

export async function getMonsInGen(gen: number): Promise<string[]> {
    let generation: Generation = await client.getGenerationById(gen);
    let speciesList: string[] = generation.pokemon_species.sort((a: NamedAPIResource, b: NamedAPIResource) => sortList(a, b)).map((s: NamedAPIResource) => s.name);
    return speciesList;
}

function sortList(a: NamedAPIResource, b: NamedAPIResource): number {
    let firstNum: number = parseInt(a.url.split("/").at(-2)!);
    let secondNum: number = parseInt(b.url.split("/").at(-2)!);
    return firstNum - secondNum;
}