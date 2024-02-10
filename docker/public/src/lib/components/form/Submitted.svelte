<script lang="ts">
    import { Confetti } from "svelte-confetti"

    import { createEventDispatcher } from "svelte";

    import { beforeNavigate } from "$app/navigation";

    const dispatch = createEventDispatcher();

    export let errors;
    export let message;

    if (message && !message.success) {
        beforeNavigate(() => dispatch("redirect"));
    }

</script>

{#if message.success}
    <div class="fixed -top-12 left-0 h-screen w-screen flex justify-center overflow-hidden pointer-events-none">
        <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite duration={5000} amount={200} fallDistance="100vh" />
    </div>
{/if}
<div class="w-fit absolute left-1/2 bottom-1/2 -translate-x-1/2">
    <div class="flex flex-col justify-center gap-y-4">
        {#if message}
            {#if message.success}
                <p class="text-center">{message.text}</p>
                <a href="/" data-sveltekit-preload-code="viewport" class="underline text-center">Go Home</a>
                <a href="/add" data-sveltekit-preload-data="hover" class="underline text-center" on:click={() => dispatch("redirect")}>Go back to Form</a> 
            {:else}
                {@html message.text}
            {/if}
        {/if}
        {#if errors.length}
            <ul>
                {#each errors as error}
                    <li class="text-center text-red-500">
                        {error.messages.join(", ")}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
