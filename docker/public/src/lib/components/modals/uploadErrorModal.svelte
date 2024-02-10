<script lang="ts">
	import type { SvelteComponent } from "svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";

	export let parent: SvelteComponent;

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
    <div id="warningModal" class="bg-slate-800 rounded-lg w-64 h-96 flex flex-col justify-center items-center">
        <div><button id="closebtn" class="border-none hover:bg-slate-700 h-6 relative bottom-3 left-[108px]" on:click={parent.onClose}><span class="material-symbols-outlined">close</span></button></div>
        <div>The file you uploaded is empty 😢</div>
        <div class="mb-7">Please upload another one</div>
        <div style="width:100%;height:0;padding-bottom:75%;position:relative;left:5%">
            <iframe title="funny gif" src="https://giphy.com/embed/3o6MbgfQ9r8l5VuSc0" width="90%" height="100%" frameBorder="0" class="giphy-embed absolute"></iframe>
        </div>
    </div>
{/if}