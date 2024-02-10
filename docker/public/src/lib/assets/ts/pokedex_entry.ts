import { PokemonClient, type PokemonSpecies, type FlavorText } from "pokenode-ts";

import { getSpeciesName } from "./species";

const client = new PokemonClient();

export async function getEntry(mon: number, game: string): Promise<string> {
    let species: PokemonSpecies = await client.getPokemonSpeciesByName(getSpeciesName(mon));
    let entries: FlavorText[] = species.flavor_text_entries;
    for (var entry of entries) {
        if (entry.version.name == game && entry.language.name == "en") {
            return entry.flavor_text.replace(/\f/g, '\n').replace(/\u00ad\n/g, '').replace(/\u00ad/g, '').replace(/ -\n/g, ' - ').replace(/-\n/g, '-').replace(/\n/g, ' ').replace(/\xad /g, '').replace(/\x0c/g, ' ');
        }
    }
    return "";
}