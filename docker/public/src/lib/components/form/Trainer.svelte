<script lang='ts'>
    import { onDestroy } from 'svelte';
    import { genStore } from '$lib/imports';

    import Carousel from '$lib/components/carousel/Carousel.svelte';
    import type { HTMLImgAttributes } from 'svelte/elements';
    import ControlButton from '$lib/components/carousel/ControlButton.svelte';

    let gen: number = 1;
    const unsubscribe = genStore.subscribe(value => { gen = value });
    onDestroy(() => { unsubscribe() })
    var player: any;

    interface Trainer {
        gen: number,
        gender: string,
        name: string,
        url: string,
    };

    export let currentTrainer: string;
    currentTrainer = "m";
    
    var trainerSelect = () => {
        if (currentTrainer == "f") {
            currentTrainer = "m";
        } else {
            currentTrainer = "f";
        }
    }

    const CarouselTrainers: number[] = [5, 7, 8];
    
    const alt: string = "Pokémon Trainer";
    const gen2CarouselF: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/2/25/HeartGold_SoulSilver_Lyra.png&mod=0.9", title: "Lyra" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/e/e1/Crystal_Kris.png&mod=0.9", title: "Kris" },
    ];

    const gen5CarouselM: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/a/a4/Black_White_Hilbert.png&mod=0.9", title: "Hilbert" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/6/61/Black_2_White_2_Nate.png&mod=0.9", title: "Nate" }
    ];
    const gen5CarouselF: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/6/6f/Black_White_Hilda.png&mod=0.9", title: "Hilda" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/f/f2/Black_2_White_2_Rosa.png&mod=0.9", title: "Rosa" }
    ];

    const gen7CarouselM: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/d/db/Sun_Moon_Elio.png&mod=0.9", title: "Elio" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/4/41/Lets_Go_Pikachu_Eevee_Chase.png&mod=0.9", title: "Chase" },
    ];
    const gen7CarouselF: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/6/64/Sun_Moon_Selene.png&mod=0.9", title: "Selene" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/b/b7/Lets_Go_Pikachu_Eevee_Elaine.png&mod=0.9", title: "Elaine" }
    ];

    const gen8CarouselM: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/1/1f/Sword_Shield_Victor.png&mod=0.9", title: "Victor" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/6/68/Legends_Arceus_Rei.png&mod=0.9", title: "Rei" }
    ];
    const gen8CarouselF: HTMLImgAttributes[] = [
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/c/cd/Sword_Shield_Gloria.png&mod=0.9", title: "Gloria" },
        { alt: alt, src: "https://wsrv.nl/?url=archives.bulbagarden.net/media/upload/3/38/Legends_Arceus_Akari.png&mod=0.9", title: "Akari" }
    ];

    const trainers: Trainer[] = [
        { gen: 1, gender: "m", name: "Red", url: "https://archives.bulbagarden.net/media/upload/8/83/FireRed_LeafGreen_Red.png" },
        { gen: 1, gender: "f", name: "Leaf", url: "https://archives.bulbagarden.net/media/upload/4/48/FireRed_LeafGreen_Leaf.png" },
        { gen: 2, gender: "m", name: "Ethan", url: "https://archives.bulbagarden.net/media/upload/c/c0/HeartGold_SoulSilver_Ethan.png" },
        { gen: 2, gender: "f", name: "Kris", url: "https://archives.bulbagarden.net/media/upload/e/e1/Crystal_Kris.png" },
        { gen: 2, gender: "f", name: "Lyra", url: "https://archives.bulbagarden.net/media/upload/2/25/HeartGold_SoulSilver_Lyra.png" },
        { gen: 3, gender: "m", name: "Brendan", url: "https://archives.bulbagarden.net/media/upload/f/f1/Omega_Ruby_Alpha_Sapphire_Brendan.png" },
        { gen: 3, gender: "f", name: "May", url: "https://archives.bulbagarden.net/media/upload/a/a0/Omega_Ruby_Alpha_Sapphire_May.png" },
        { gen: 4, gender: "m", name: "Lucas", url: "https://archives.bulbagarden.net/media/upload/2/2f/Platinum_Lucas.png" },
        { gen: 4, gender: "f", name: "Dawn", url: "https://archives.bulbagarden.net/media/upload/6/6f/Platinum_Dawn.png" },
        { gen: 5, gender: "m", name: "Hilbert", url: "https://archives.bulbagarden.net/media/upload/a/a4/Black_White_Hilbert.png" },
        { gen: 5, gender: "m", name: "Nate", url: "https://archives.bulbagarden.net/media/upload/6/61/Black_2_White_2_Nate.png"},
        { gen: 5, gender: "f", name: "Hilda", url: "https://archives.bulbagarden.net/media/upload/6/6f/Black_White_Hilda.png" },
        { gen: 5, gender: "f", name: "Rosa", url: "https://archives.bulbagarden.net/media/upload/f/f2/Black_2_White_2_Rosa.png" },
        { gen: 6, gender: "m", name: "Calem", url: "https://archives.bulbagarden.net/media/upload/4/48/XY_Calem.png" },
        { gen: 6, gender: "f", name: "Serena", url: "https://archives.bulbagarden.net/media/upload/e/e1/XY_Serena.png" },
        { gen: 7, gender: "m", name: "Elio", url: "https://archives.bulbagarden.net/media/upload/d/db/Sun_Moon_Elio.png" },
        { gen: 7, gender: "m", name: "Chase", url: "https://archives.bulbagarden.net/media/upload/4/41/Lets_Go_Pikachu_Eevee_Chase.png" },
        { gen: 7, gender: "f", name: "Selene", url: "https://archives.bulbagarden.net/media/upload/6/64/Sun_Moon_Selene.png" },
        { gen: 7, gender: "f", name: "Elaine", url: "https://archives.bulbagarden.net/media/upload/b/b7/Lets_Go_Pikachu_Eevee_Elaine.png" },
        { gen: 8, gender: "m", name: "Victor", url: "https://archives.bulbagarden.net/media/upload/1/1f/Sword_Shield_Victor.png" },
        { gen: 8, gender: "m", name: "Rei", url: "https://archives.bulbagarden.net/media/upload/6/68/Legends_Arceus_Rei.png" },
        { gen: 8, gender: "f", name: "Gloria", url: "https://archives.bulbagarden.net/media/upload/c/cd/Sword_Shield_Gloria.png" },
        { gen: 8, gender: "f", name: "Akari", url: "https://archives.bulbagarden.net/media/upload/3/38/Legends_Arceus_Akari.png" },
        { gen: 9, gender: "m", name: "Florian", url: "https://archives.bulbagarden.net/media/upload/c/c1/Violet_Male_Trainer.png" },
        { gen: 9, gender: "f", name: "Juliana", url: "https://archives.bulbagarden.net/media/upload/3/3d/Violet_Female_Trainer.png" }
    ];

    let transformUrl: (url: string) => string = (url: string) => "https://wsrv.nl/?url="+url+"&mod=0.9";

    function getTrainerArt(gen: number, gender: string): HTMLImgAttributes[] | null {
        if (gender === "m") {
            if (CarouselTrainers.includes(gen)) {
                switch (gen) {
                    case 5:
                        return gen5CarouselM;
                    case 7:
                        return gen7CarouselM;
                    case 8:
                        return gen8CarouselM;
                }
            } else {
                for (var trainer of trainers) {
                        if (trainer.gen == gen && trainer.gender == gender) {
                            return [{ src: transformUrl(trainer.url), title: trainer.name }];
                        }
                    }
            }
        } else if (gender === "f") {
            if (CarouselTrainers.includes(gen) || gen === 2) {
                switch (gen) {
                    case 2:
                        return gen2CarouselF;
                    case 5:
                        return gen5CarouselF;
                    case 7:
                        return gen7CarouselF;
                    case 8:
                        return gen8CarouselF;
                }
            } else {
                for (var trainer of trainers) {
                        if (trainer.gen == gen && trainer.gender == gender) {
                            return [{ src: transformUrl(trainer.url), title: trainer.name }];
                        }
                    }
            }
        }
        return null;
    }

    let images: HTMLImgAttributes[] | null;

    $: images = getTrainerArt(gen, currentTrainer);
</script>

<div id="trainercard" class="bg-surface-800 h-72 w-48 rounded-xl -mt-5">
    <div class="w-8 h-8">
        <button id="trainer_gender" type="button" class="rounded-br-lg h-8 w-8 hover:bg-surface-900" on:click={trainerSelect}>
            {#if currentTrainer == "m"}
                <span class="iconify material-symbols-light--male h-5 w-5 relative top-0.5"></span>
            {:else}
                <span class="iconify material-symbols-light--female h-5 w-5 relative top-0.5"></span>
            {/if}
        </button>
    </div>
    <div class="h-52 w-28 ml-auto mr-auto relative max-mobile-limit:bottom-2 md:bottom-5">
        {#key images}
            {#if images != null}
                <Carousel {images} ariaLabel="Pokémon Trainer Carousel" let:Controls on:change={({ detail }) => ( player = detail )}>
                    {#if images.length > 1}
                        <Controls let:changeSlide>
                            <ControlButton name="Previous" forward={false} on:click={() => {changeSlide(false)}} class="absolute max-mobile-limit:-left-12 mobile-limit:-left-14 top-2" />
                            <ControlButton name="Next" forward={true} on:click={() => {changeSlide(true)}} class="absolute max-mobile-limit:-right-16 mobile-limit:-right-14 top-2" />
                        </Controls>
                    {/if}
                </Carousel>
            {/if}
        {/key}
    </div>
    {#each trainers as trainer}
        {#if trainer.gen == gen && trainer.gender == currentTrainer && trainer.name == player?.title }
            <p id="characterName" class="text-sm whitespace-nowrap italic relative z-40 left-14 -bottom-4 text-gray-400">Trainer {trainer.name}</p>
        {/if}
    {/each}
</div>