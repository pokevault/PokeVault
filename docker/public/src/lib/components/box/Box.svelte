<script lang="ts">
    import { saveFileStore } from '$lib/imports';

    import BoxSlot from '$lib/components/box/BoxSlot.svelte';

    import { validate, version } from 'uuid';

    import { ProgressRadial } from '@skeletonlabs/skeleton';

    import { browser } from '$app/environment';

    import Svelecte from 'svelecte';
    
    import { onMount } from 'svelte';

    
    let boxSlot: number = 1;

    let slots: number = 40;

    let cache: Cache;

    onMount(async () => {
        cache = await caches.open("box-cache");
    })

    interface Box {
        boxIndex: number;
        boxContents: { boxSlot: number; species: number; isShiny: boolean; isEgg: boolean }[];
    }

    interface Options {
        value: string;
        text: string;
    }

    async function getBoxes(uuid: string): Promise<Box[] | null> {
        if (browser) {
            if ((await caches.keys()).length > 0) {
                let keys: readonly Request[] = await cache.keys();
                if (keys.length > 0) {
                    for (let request of keys) {
                        if (request.url.includes(uuid)) {
                            let resp: Response | undefined = await cache.match(request);
                            if (resp == undefined) return null;
                            if (resp.ok) {
                                return await resp.clone().json();
                            } else {
                                return null;
                            }
                        } else {
                            let resp: Response = await fetch(`api/get-boxes-from-save/${uuid}`);
                            if (resp.ok) {
                                cache.put(uuid, resp.clone());
                                return await resp.json();
                            } else {
                                return null;
                            }
                        }
                    }
                } else {
                    console.log("have to request it");
                    let resp: Response = await fetch(`api/get-boxes-from-save/${uuid}`);
                    if (resp.ok) {
                        cache.put(uuid, resp.clone());
                        return await resp.clone().json();
                    } else {
                        return null;
                    }
                }
            } else {
                return null;
            }
        }
        return null;
    }

    function buildOptions(boxes: Box[] | null): Options[] {
        let options: Options[] = [];
        if (boxes == null) {
            for (let i = 1; i <= 40; i++) {
                options.push({ value: i.toString(), text: `Box ${i}` });
            }
        } else {
            slots = boxes.length;
            for (let i = 1; i <= boxes.length; i++) {
                options.push({ value: i.toString(), text: `Box ${i}` });
            }
        }
        return options;
    }

    $: {
        if (boxSlot > slots) {
            boxSlot = 1;            
        }
    }

</script>

<div class="max-md:relative max-md:right-[20%]">
    <div id="boxSelect" class="grid grid-cols-3 gap-x-2 w-1/2 absolute max-lg:right-[5%] right-[8%] max-md:top-52 top-44">
        <div class="justify-self-end">
            <button type="button" class="h-12 w-16 bg-surface-700 rounded-lg" class:invisible={boxSlot == 1} on:click={() => boxSlot--}>
                <span class="iconify ri--arrow-left-double-line h-6 w-6 relative top-1"></span>
            </button>
        </div>
        {#if validate($saveFileStore) && version($saveFileStore) === 7}
            {#await getBoxes($saveFileStore)}
                <Svelecte options={buildOptions(null)} class="w-full h-12 self-center max-[540px]:invisible" bind:value={boxSlot} searchable={false}/>
            {:then boxes}
                <Svelecte options={buildOptions(boxes)} class="w-full h-12 self-center max-[540px]:invisible" bind:value={boxSlot} searchable={false}/>
            {/await}
        {:else}
            <Svelecte options={buildOptions(null)} class="w-full h-12 self-center max-[540px]:invisible" bind:value={boxSlot} searchable={false}/>
        {/if}
        <div>
            <button type="button" class="h-12 w-16 bg-surface-700 rounded-lg" on:click={() => boxSlot++}>
                <span class="iconify ri--arrow-right-double-line h-6 w-6 relative top-1"></span>
            </button>
        </div>
    </div>
</div>
{#key $saveFileStore}
    {#if validate($saveFileStore) && version($saveFileStore) === 7}
        <div class="bg-surface-700 rounded-xl min-h-[24rem] md:w-1/2 w-3/4 max-phone-l:pb-8 absolute max-md:right-0 max-md:left-0 max-md:m-auto md:max-lg:right-[5%] right-[8%] top-60 max-md:top-[25rem]">
            {#await getBoxes($saveFileStore)}
                <div class="w-36 ml-auto mr-auto mt-[7.5rem]">
                    <ProgressRadial />
                </div>
            {:then boxes}
                {#if boxes == null || boxes.length == 0}
                    <p class="ml-3 mt-3 text-red-800">Error!</p>
                {:else}
                    <div class="grid grid-cols-3 phone-l:grid-cols-4 md:grid-cols-6">
                        {#each boxes as box}
                            {#if box.boxIndex == boxSlot}
                                {#each box.boxContents as mon}
                                    <BoxSlot {mon} index={box.boxIndex}/>
                                {/each}
                            {/if}
                        {/each}
                    </div>
                {/if}
            {/await}
        </div>
    {:else}
        <div class="bg-surface-700 rounded-xl min-h-[24rem] md:w-1/2 w-3/4 max-phone-l:pb-8 absolute max-md:right-0 max-md:left-0 max-md:m-auto md:max-lg:right-[5%] right-[8%] top-60 max-md:top-[25rem]">
            <p class="ml-3 mt-3 text-gray-400">Please select a save file</p>
        </div>
    {/if}
{/key}

<style lang="postcss">
    :root {
        --sv-min-height: 3rem;
        --sv-border-radius: 0.5rem;
        --sv-bg: #37446b;
        --sv-border: none;
        --sv-dropdown-active-bg: #2563eb;
        --sv-dropdown-selected-bg: #166534;
    }
</style>