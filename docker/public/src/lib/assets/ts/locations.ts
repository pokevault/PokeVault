import { PokemonClient, LocationClient, type LocationAreaEncounter, type LocationArea, type Pokemon } from "pokenode-ts";

import { EvolutionClient, type EvolutionChain } from "pokenode-ts";

import { getSpeciesName } from "./species";

const client = new PokemonClient();
const evolutionClient = new EvolutionClient();

export interface LocationInfo {
    value: string,
    text: string
}

export async function getLocations(mon: number, game: string): Promise<LocationInfo[]> {
    const pk: Pokemon = await client.getPokemonByName(getSpeciesName(mon));
    let locationAreas: LocationAreaEncounter[] = await client.getPokemonLocationAreaById(pk.id);
    if (locationAreas.length === 0) {
        let evolutionChainId: string | undefined = (await client.getPokemonSpeciesByName(getSpeciesName(mon))).evolution_chain.url.split("/").at(-2);
        if (evolutionChainId != undefined) {
            let evolutionChain: EvolutionChain = await evolutionClient.getEvolutionChainById(parseInt(evolutionChainId));
            let basePk: Pokemon = await client.getPokemonByName(evolutionChain.chain.species.name);
            locationAreas = await client.getPokemonLocationAreaById(basePk.id);
        }
    }
    let areas: LocationInfo[] = [];
    
    for (var area of locationAreas) {
        for (var details of area.version_details) {
            if (details.version.name == game) {
                let name: string = await getLocationName(area.location_area.name);
                areas.push({ value: area.location_area.name, text: name.replace("Road", "Route") });
            }
        }
    }
    return areas.sort((a: LocationInfo, b: LocationInfo) => {
        if (a.text.includes("Route") && b.text.includes("Route")) {
            return parseInt(a.text.split(" ")[-1]) - parseInt(b.text.split(" ")[-1]);
        } else {
            return a.text.localeCompare(b.text);
        }
    });
}

async function getLocationName(area: string): Promise<string> {
    let locationClient = new LocationClient();
    let loc: LocationArea = await locationClient.getLocationAreaByName(area);
    for (var name of loc.names) {
        if (name.language.name == "en") {
            return name.name
        }
    }
    return "";
}