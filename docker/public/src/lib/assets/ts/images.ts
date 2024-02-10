import pokedex from "./pokedex/pokedex.json";

let dex: { pokedex_number: number, species: string, name: string, forms: string[], default?: string }[] = pokedex;

export function getArtwork(mon: number, shiny: boolean = false): string | null {
    let regular_url: string = "https://wsrv.nl/?url=raw.githubusercontent.com/pokevault/artwork/main/assets/regular/";
    let shiny_url: string = "https://wsrv.nl/?url=raw.githubusercontent.com/pokevault/artwork/main/assets/shiny/";
    for (var entry of dex) {
        let index: number = entry.pokedex_number;
        if (mon === index) {
            return shiny ? shiny_url+mon.toString().padStart(3, "0")+".png" : regular_url+mon.toString().padStart(3, "0")+".png";
        } 
        // else if (entry.forms.includes(mon)) {
        //     return shiny ? shiny_url+mon.toString().padStart(3, "0")+mon.replace(name, "")+".png" : regular_url+mon.toString().padStart(3, "0")+mon.replace(name, "")+".png"
        // }
    }
    return null;
}

export function getSprite(mon: number, shiny: boolean = false): string | null {
    let regular_url: string = "https://cdn.jsdelivr.net/gh/pokevault/icons@HEAD/pokemon/regular/";
    let shiny_url: string = "https://cdn.jsdelivr.net/gh/pokevault/icons@HEAD/pokemon/shiny/";
    for (var entry of dex) {
        let name: number = entry.pokedex_number;
        if (name === mon) {
            return shiny ? shiny_url+mon.toString()+".png" : regular_url+mon.toString()+".png";
        } 
        // else if (entry.forms.includes(mon)) {
        //     return shiny ? shiny_url+mon.toString()+mon.replace(name, "")+".png" : regular_url+mon.toString()+mon.replace(name, "")+".png"
        // }
    }
    return null;
}
