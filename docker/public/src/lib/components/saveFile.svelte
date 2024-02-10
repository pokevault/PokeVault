<script lang="ts">
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    import { saveFileStore } from '$lib/imports';

    import { browser } from '$app/environment';

    export let saveFile;
    export let start: boolean = false;
    export let end: boolean = false;
    export let hasBorder: boolean = true;
    export let condensed: boolean = false;

    const dispatch = createEventDispatcher();

    let mouseIn: boolean = false;
    
    async function deleteSave(filename: string, uuid: string) {
        if (browser) {
            saveFileStore.set("");
            if (confirm(`Are you sure that you want to delete: ${filename}?`)) {
                const resp = await fetch(`api/delete-save/${uuid}`, {
                    method: "DELETE",
                });


                if (resp.status !== 200) {
                    alert("Failed to delete save file");
                } else {
                    dispatch('deleted');
                }
            }
        }
    }
</script>

{#if start}
    <button class="h-9 md:h-18 max-md:w-full max-md:pr-1 bg-inherit hover:bg-surface-hover-token md:rounded-t-lg max-md:rounded-l-lg max-md:border-r relative z-10" class:rounded-b-lg={!hasBorder} class:rounded-l-lg={!hasBorder && !condensed} on:mouseenter={() => mouseIn = true} on:mouseleave={() => mouseIn = false} on:click={() => saveFileStore.set(saveFile.uuid)}>
        <p class="w-full text-center select-none truncate" class:fileMouseEnter={mouseIn && !condensed} class:fileMouseLeave={!mouseIn && !condensed}>{saveFile.name}</p>
        {#if mouseIn && !condensed}
            <p class="h-4 text-xs text-center select-none absolute bottom-4 left-8" in:fade={{ duration: 500 }} out:fade={{ duration: 250 }}>Uploaded: {new Date(Date.parse(saveFile.timestamp)).toLocaleString("en-US")}</p>
            <button class="h-6 w-6 absolute z-20 right-1 top-1" in:fade={{ duration: 500 }} out:fade={{ duration: 250 }} on:click|stopPropagation={() => deleteSave(saveFile.tame, saveFile.uuid)}>
                <span class="iconify material-symbols-light--delete-forever-outline h-full w-full hover:text-red-600"></span>
            </button>
        {/if}
    </button>
{:else if end}
    <button class="h-9 md:h-18 max-md:w-full max-md:pl-1 bg-inherit hover:bg-surface-hover-token relative z-10" on:mouseenter={() => mouseIn = true} on:mouseleave={() => mouseIn = false} on:click={() => saveFileStore.set(saveFile.uuid)}>
        <p class="w-full text-center select-none truncate" class:fileMouseEnter={mouseIn && !condensed} class:fileMouseLeave={!mouseIn && !condensed}>{saveFile.name}</p>
        {#if mouseIn && !condensed}
            <p class="h-4 text-xs text-center select-none absolute bottom-4 left-8" in:fade={{ duration: 500 }} out:fade={{ duration: 250 }}>Uploaded: {new Date(Date.parse(saveFile.timestamp)).toLocaleString("en-US")}</p>
            <button class="h-6 w-6 absolute z-20 right-1 top-1" in:fade={{ duration: 500 }} out:fade={{ duration: 250 }} on:click|stopPropagation={() => deleteSave(saveFile.name, saveFile.uuid)}>
                <span class="iconify material-symbols-light--delete-forever-outline h-full w-full hover:text-red-600"></span>
            </button>
        {/if}
    </button>
{:else}
    <button class="h-9 md:h-18 max-md:w-full px-1 bg-inherit hover:bg-surface-hover-token relative z-10" class:rounded-b-lg={!hasBorder} on:mouseenter={() => mouseIn = true} on:mouseleave={( ) => mouseIn = false} on:click={() => saveFileStore.set(saveFile.uuid)}>
        <p class="w-full text-center select-none truncate" class:fileMouseEnter={mouseIn && !condensed} class:fileMouseLeave={!mouseIn && !condensed}>{saveFile.name}</p>
        {#if mouseIn && !condensed}
            <p class="h-4 text-xs text-center select-none absolute bottom-4 left-8" in:fade={{ duration: 500 }} out:fade={{ duration: 250 }}>Uploaded: {new Date(Date.parse(saveFile.timestamp)).toLocaleString("en-US")}</p>
            <button class="h-6 w-6 absolute z-20 right-1 top-1" in:fade={{ duration: 500 }} out:fade={{ duration: 250 }} on:click|stopPropagation={() => deleteSave(saveFile.name, saveFile.uuid)}>
                <span class="iconify material-symbols-light--delete-forever-outline h-full w-full hover:text-red-600"></span>
            </button>
        {/if}
    </button>
{/if}


<style>
    @keyframes fileMouseEnter {
        from {
            transform: translateY(0);
        }
        
        to {
            transform: translateY(-15px);
        }
    }

    @keyframes fileMouseLeave {
        from {
            transform: translateY(-15px);
        }
        
        to {
            transform: translateY(0);
        }
    }

    .fileMouseEnter {
        animation: fileMouseEnter;
        animation-duration: 500ms;
        animation-fill-mode: forwards;
    }

    .fileMouseLeave {
        animation: fileMouseLeave;
        animation-duration: 500ms;
        animation-fill-mode: forwards;
    }
</style>