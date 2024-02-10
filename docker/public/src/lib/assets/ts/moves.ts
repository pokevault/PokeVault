import { PokemonClient } from "pokenode-ts";

import version_groups from "../json/version_group.json";

const groups: Record<string, string[]> = version_groups;

const titleCase: (s: string[]) => string = function(s: string[]) { return s.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") };

const client = new PokemonClient();

export interface PokemonMove {
    value: string,
    label: string
}

export async function getMoves(mon: string, game: string, mon_level: number): Promise<PokemonMove[]> {
    const pk = await client.getPokemonByName(mon);
    let moves: PokemonMove[] = [];
    for (var move of pk.moves) {
        for (var details of move.version_group_details) {
            if (groups[details.version_group.name].includes(game) && details.level_learned_at <= mon_level) {
                moves.push({ value: move.move.name, label: titleCase(move.move.name.split("-")) });
            }
        }
    }
    return moves.sort((a: PokemonMove, b: PokemonMove) => a.label.localeCompare(b.label));
}