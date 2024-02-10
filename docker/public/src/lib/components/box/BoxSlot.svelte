<script lang="ts">
    import { getSprite } from '$lib/assets/ts/images';
    import { getSpeciesName } from '$lib/assets/ts/species';

    import { saveFileStore } from '$lib/imports';

    export let mon: { boxSlot: number; species: number; isShiny: boolean; isEgg: boolean };
    export let index: number;

    let loaded: boolean = false;

    let src: string = getSprite(mon.species, mon.isShiny) ?? "https://cdn.jsdelivr.net/gh/pokevault/icons/pokemon/unknown.png";
</script>

<a class="grid items-center max-h-[6rem] min-h-[6rem] overflow-hidden bg-inherit hover:bg-surface-600 rounded-xl" href={`/info/${$saveFileStore}?i=${index}&s=${mon.boxSlot+1}`} target="_blank" rel="noopener noreferrer">
    <img class="ml-auto mr-auto min-h-[2rem]" class:hidden={!loaded} {src} alt={getSpeciesName(mon.species)} on:load={() => loaded = true} on:error={() => loaded = true}>
    <span class="ml-auto mr-auto iconify svg-spinners--90-ring" class:hidden={loaded}></span>
</a>