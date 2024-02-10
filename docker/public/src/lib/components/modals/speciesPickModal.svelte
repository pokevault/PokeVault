<script lang='ts'>
    import { getModalStore, type ModalStore } from '@skeletonlabs/skeleton';
    import { Autocomplete, type AutocompleteOption } from "@skeletonlabs/skeleton";

    import { SvelteComponent, onMount } from 'svelte';
    
    import { capitalise } from "$lib/imports";

    import storage from "localstorage-slim";

    import { getMonsInGen } from '$lib/assets/ts/generation';

    const modalStore: ModalStore = getModalStore();
    var pkAutocomplete: AutocompleteOption<string>[] = [];

    var chosenSpecies: string = "";
    export var parent: SvelteComponent;

    var submitPokemon: boolean = false;

    const redExclusive: string[] = ["ekans", "arbok", "oddish", "gloom", "vileplume", "mankey", "primeape", "growlithe", "arcanine", "scyther", "electabuzz"];
    const blueExclusive: string[] = ["sandshrew", "sandslash", "vulpix", "ninetales", "meowth", "persian", "bellsprout", "weepinbell", "victreebel", "magmar", "pinsir"];
    const yellowMissing: string[] = ["weedle", "kakuna", "beedrill", "ekans", "arbok", "raichu", "meowth", "persian", "koffing", "weezing", "jynx", "electabuzz", "magmar"];
    const goldExclusive: string[] = ["mankey", "primeape", "growlithe", "arcanine", "spinarak", "ariados", "gligar", "teddiursa", "ursaring", "mantine"];
    const silverExclusive: string[] = ["vulpix", "ninetales", "meowth", "persian", "ledyba", "ledian", "delibird", "skarmony", "phanpy", "donphan"];
    const crystalMissing: string[] = ["vulpix", "ninetales", "mankey", "primeape", "mareep", "flaaffy", "ampharos", "girafarig", "remoraid", "octillery", "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "omanyte", "omastar", "kabuto", "kabutops", "articuno", "zapdos", "moltres", "mewtwo", "mew"];
    const rubyExclusive: string[] = ["seedot", "nuzleaf", "shiftry", "mawile", "zongoose", "solrock", "latios", "groudon"];
    const sapphireExclusive: string[] = ["lotad", "lombre", "ludicolo", "sableye", "seviper", "lunatone", "latias", "kyogre"];
    const emeraldMissing: string[] = ["surskit", "masquerain", "meditite", "medicham", "roselia", "zangoose", "lunatone"];
    const fireredExclusive: string[] = ["ekans", "arbok", "oddish", "gloom", "vileplume", "psyduck", "golduck", "growlithe", "arcanine", "shellder", "cloyster", "scyther", "electabuzz", "bellossom", "wooper", "quagsire", "murkrow", "qwilfish", "scizor", "delibird", "skarmony", "elekid"];
    const leafgreenExclusive: string[] = ["sandshrew", "sandslash", "vulpix", "ninetales", "bellsprout", "weepinbell", "victreebel", "slowpoke", "slowbro", "staryu", "starmie", "magmar", "pinsir", "marill", "azumarill", "slowking", "misdreavus", "sneasel", "remoraid", "octillery", "mantine", "magby", "azurill"];
    const diamondExclusive: string[] = ["seel", "dewgong", "scyther", "murkrow", "scizor", "larvitar", "pupitar", "tyranitar", "poochyena", "mightyena", "aron", "lairon", "aggron", "kecleon", "cranidos", "rampardos", "honchkrow", "stunky", "skuntank", "dialga"];
    const pearlExclusive: string[] = ["slowpoke", "slowbro", "pinsir", "slowking", "misdreavus", "houndour", "houndoom", "stantler", "spheal", "sealeo", "walrein", "bagon", "shelgon", "salamence", "shieldon", "bastiodon", "mismagius", "glameow", "purugly", "palkia"];
    const platinumExclusive: string[] = ["rotom", "gligar", "gliscor", "nosepass", "probopass", "ralts", "kirlia", "gardevoir", "gallade", "lickitung", "lickilicky", "eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "swablu", "altaria", "togepi", "togetic", "togekiss", "houndour", "houndoom", "magnemite", "magneton", "magnezone", "tangela", "tangrowth", "yanma", "yanmega", "tropius", "rhyhorn", "rhydon", "rhyperior", "duskull", "dusclops", "dusknoir", "porygon", "porygon2", "porygon-z", "scyther", "scizor", "elekid", "electabuzz", "electivire", "magby", "magmar", "magmortar", "swinub", "piloswine", "mamoswine", "snorunt", "glalie", "froslass", "absol", "giratina"];
    const platinumMissing: string[] = ["murkrow", "misdreavus", "trapinch", "vibrava", "flygon", "clamperl", "huntail", "gorebyss", "mismagius", "honchkrow", "glameow", "purugly", "stunky", "skuntank"];
    const heartgoldExclusive: string[] = ["mankey", "primeape", "growlithe", "arcanine", "omanyte", "omastar", "spinarak", "ariados", "gligar", "mantine", "phanpy", "donphan", "sableye", "baltoy", "claydol", "anorith", "armaldo", "latias", "kyogre", "mantyke", "gliscor"];
    const soulsilverExclusive: string[] = ["vulpix", "ninetales", "meowth", "persian", "kabuto", "kabutops", "ledyba", "ledian", "teddiursa", "ursaring", "delibird", "skarmony", "mawile", "gulpin", "swalot", "lileep", "cradily", "latios", "groudon"];
    const blackExclusive: string[] = ["weedle", "kakuna", "beedrill", "murkrow", "houndour", "houndoom", "shroomish", "breloom", "plusle", "honchkrow", "gothita", "gothorita", "gothitelle", "vullaby", "mandibuzz", "tornadus", "reshiram"];
    const whiteExclusive: string[] = ["caterpie", "metapod", "butterfree", "paras", "misdreavus", "poochyena", "mightyena", "minun", "mismagius", "solosis", "duosion", "reuniclus", "rufflet", "braviary", "thundurus", "zekrom"];
    const black2Exclusive: string[] = ["weedle", "kakuna", "beedrill", "magmar", "spinarak", "ariados", "sudowoodo", "magby", "plusle", "spoink", "grumpig", "registeel", "latios", "buneary", "lopunny", "stunky", "skuntank", "bonsly", "gible", "gabite", "garchomp", "magmortar", "gothita", "gothorita", "gothitelle", "vullaby", "mandibuzz", "zekrom"];
    const white2Exclusive: string[] = ["caterpie", "metapod", "butterfree", "mr-mime", "electabuzz", "ledyba", "ledian", "elekid", "skitty", "delcatty", "minun", "numel", "camerupt", "regice", "latias", "glameow", "purugly", "mime-jr", "electivire", "solosis", "duosion", "reuniclus", "rufflet", "braviary", "reshiram"];
    const xExclusive: string[] = ["staryu", "starmie", "houndour", "houndoom", "aron", "lairon", "aggron", "lileep", "cradily", "anorith", "armaldo", "clauncher", "clawitzer", "xerneas"];
    const yExclusive: string[] = ["omanyte", "omastar", "kabuto", "kabutops", "electrike", "manectric", "skrelp", "dragalge", "yveltal"];
    const omegarubyExclusive: string[] = ["kabuto", "kabutops", "ho-oh", "seedot", "nuzleaf", "shiftry", "mawile", "zangoose", "solrock", "latios", "groudon", "shieldon", "bastiodon", "palkia", "throh", "archen", "archeops", "tornadus", "reshiram", "skrelp", "dragalge"];
    const alphasapphireExclusive: string[] = ["omanyte", "omastar", "lugia", "lotad", "lombre", "ludicolo", "sableye", "seviper", "lunatone", "latias", "kyogre", "cranidos", "rampardos", "dialga", "sawk", "tirtouga", "carracosta", "thundurus", "zekrom", "clauncher", "clawitzer"];
    const sunExclusive: string[] = ["vulpix", "ninetales", "cranidos", "rampardos", "cottonee", "whimsicott", "tirtouga", "carracosta", "rufflet", "braviary", "passimian", "turtonator", "solgaleo", "buzzwole", "kartana"];
    const moonExclusive: string[] = ["sandshrew", "sandslash", "shieldon", "bastiodon", "petilil", "lilligant", "archen", "archeops", "vullaby", "mandibuzz", "oranguru", "drampa", "lunala", "pheromosa", "celesteela"];
    const ultrasunExclusive: string[] = ["vulpix", "ninetales", "houndour", "houndoom", "raikou", "ho-oh", "latios", "groudon", "dialga", "heatran", "cottonee", "whimsicott", "golett", "golurk", "rufflet", "braviary", "tornadus", "reshiram", "clauncher", "clawitzer", "xerneas", "passimian", "turtonator", "solgaleo", "buzzwole", "kartana", "blacephalon"];
    const ultramoonExclusive: string[] = ["sandshrew", "sandslash", "entei", "lugia", "electrike", "manectric", "baltoy", "claydol", "latias", "kyogre", "palkia", "regigigas", "petilil", "lilligant", "vullaby", "mandibuzz", "thundurus", "zekrom", "skrelp", "dragalge", "yveltal", "oranguru", "drampa", "lunala", "pheromosa", "celesteela", "stakataka"];
    const lgpExclusive: string[] = ["sandshrew", "sandslash", "oddish", "gloom", "vileplume", "mankey", "primeape", "growlithe", "grimer", "muk", "scyther"];
    const lgeExclusive: string[] = ["ekans", "arbok", "vulpix", "ninetales", "meowth", "persian", "bellsprout", "weepinbell", "victreebel", "koffing", "weezing", "pinsir"];
    const swordExclusive: string[] = ["farfetch'd", "seedot", "nuzleaf", "shiftry", "mawile", "solrock", "darumaka", "darmanitan", "scraggy", "scrafty", "gothita", "gothorita", "gothitelle", "rufflet", "braviary", "deino", "zweilous", "hydreigon", "swirlix", "slurpuff", "passimian", "turtonator", "jangmo-o", "hakamo-o", "kommo-o", "flapple", "sirfetch'd", "stonjourner", "zacian", "pinsir", "clauncher", "clawitzer", "omanyte", " omastar", " ho-oh", "bagon", "shelgon", "salamence", "latios", "groudon", "dialga", "tornadus", "reshiram", "xerneas", "solgaleo"];
    const shieldExclusive: string[] = ["ponyta", "rapidash", "corsola", "larvitar", "pupitar", "tyranitar", "lotad", "lombre", "ludicolo", "sableye", "lunatone", "croagunk", "toxicroak", "solosis", "duosion", "reuniclus", "vullaby", "mandibuzz", "spritzee", "aromatisse", "goomy", "sliggoo", "goodra", "oranguru", "drampa", "appletun", "cursola", "eiscue", "zamazenta", "heracross", "skrelp", "dragalge", "kabuto", "kabutops", "lugia", "latias", "kyogre", "gible", "gabite", "garchomp", "palkia", "thundurus", "zekrom", "yveltal", "lunala"];
    const brilliantdiamondExclusive: string[] = ["caterpie", "metapod", "butterfree", "ekans", "arbok", "growlithe", "arcanine", "seel", "dewgong", "scyther", "electabuzz", "murkrow", "gligar", "scizor", "elekid", "raikou", "entei", "suicine", "larvitar", "pupitar", "tyranitar", "ho-oh", "seedot", "nuzleaf", "shiftry", "mawile", "zangoose", "solrock", "kecleon", "cranidos", "rampardos", "honchkrow", "stunky", "skuntank", "electivire", "gliscor", "dialga"];
    const shiningpearlExclusive: string[] = ["weedle", "kakuna", "beedrill", "sandshrew", "sandslash", "vulpix", "ninetales", "slowpoke", "slowbro", "magmar", "pinsir", "articuno", "zapdos", "moltres", "slowking", "misdreavus", "teddiursa", "ursaring", "stantler", "magby", "lugia", "lotad", "lombre", "ludicolo", "sableye", "seviper", "lunatone", "bagon", "shelgon", "salamence", "shieldon", "bastiodon", "mismagius", "glameow", "purugly", "magmortar", "palkia"];
    const scarletExclusive: string[] = ["larvitar", "pupitar", "tyranitar", "drifloon", "drifblim", "stunky", "skuntank", "dialga", "deino", "zweilous", "hydreigon", "skrelp", "dragalge", "oranguru", "stonjourner", "great-tusk", "scream-tail", "brute-bonnet", "flutter-mane", "slither-wing", "sandy-shocks", "roaring-moon", "koraidon", "walking-wake", "gligar", "gliscor", "cramorant", "vulpix-alola", "ninetales-alola", "raikou", "entei", "suicine", "ho-oh", "latios", "groudon", "cranidos", "rampardos", "reshiram", "solgaleo", "glastrier", "gouging-fire", "raging-bolt"];
    const violetExclusive: string[] = ["misdreavus", "gulpin", "swalot", "bagon", "shelgon", "salamence", "mismagius", "palkia", "clauncher", "clawitzer", "passimian", "eiscue", "dreepy", "drakloak", "iron-treads", "iron-bundle", "iron-hands", "iron-jugulis", "iron-moth", "iron-thorns", "iron-valiant", "miraidon", "iron-leaves", "aipom", "ambipom", "morpeko", "sandshrew-alola", "sandslash-alola", "lugia", "latias", "kyogre", "shieldon", "bastiodon", "cobalion", "terrakion", "virizion", "zekrom", "lunala", "spectrier", "iron-boulder", "iron-crown"];

    function getExclusives(game: string): string[] {
        switch(game) {
            case "red":
                return [...blueExclusive];
            case "blue":
                return [...redExclusive];
            case "yellow":
                return [...yellowMissing];
            case "gold":
                return [...silverExclusive];
            case "silver":
                return [...goldExclusive];
            case "crystal":
                return [...crystalMissing];
            case "ruby":
                return [...sapphireExclusive];
            case "sapphire":
                return [...rubyExclusive];
            case "emerald":
                return [...emeraldMissing];
            case "firered":
                return [...leafgreenExclusive];
            case "leafgreen":
                return [...fireredExclusive];
            case "diamond":
                return [...pearlExclusive, ...platinumExclusive];
            case "pearl":
                return [...diamondExclusive, ...platinumExclusive];
            case "platinum":
                return [...diamondExclusive, ...pearlExclusive, ...platinumMissing];
            case "heartgold":
                return [...soulsilverExclusive];
            case "soulsilver":
                return [...heartgoldExclusive];
            case "black":
                return [...whiteExclusive];
            case "white":
                return [...blackExclusive];
            case "black-2":
                return [...white2Exclusive];
            case "white-2":
                return [...black2Exclusive];
            case "x":
                return [...yExclusive];
            case "y":
                return [...xExclusive];
            case "omega-ruby":
                return [...alphasapphireExclusive];
            case "alpha-sapphire":
                return [...omegarubyExclusive];
            case "sun":
                return [...moonExclusive];
            case "moon":
                return [...sunExclusive];
            case "ultra-sun":
                return [...ultramoonExclusive];
            case "ultra-moon":
                return [...ultrasunExclusive];
            case "lets-go-pikachu":
                return [...lgeExclusive];
            case "lets-go-eevee":
                return [...lgpExclusive];
            case "sword":
                return [...shieldExclusive];
            case "shield":
                return [...swordExclusive];
            case "brilliant-diamond":
                return [...shiningpearlExclusive];
            case "shining-pearl":
                return [...brilliantdiamondExclusive];
            case "scarlet":
                return [...violetExclusive];
            case "violet":
                return [...scarletExclusive];
            default:
                return [];

        }
    }

    onMount(async () => {
        await getPokemonList($modalStore[0].meta.gen);
    })

    async function getPokemonList(gen: number): Promise<void> {
        const cache: string[] | null = storage.get(`gen-${gen}`);
        if (cache != null) {
            pkAutocomplete = populateOptions(cache);
        } else {
            let pokemon: string[] = await getMonsInGen(gen);
            storage.set(`gen-${gen}`, pokemon);
            pkAutocomplete = populateOptions(pokemon);
        }
    }

    function populateOptions(list: any[]): AutocompleteOption<string>[] {
        var newOptions: AutocompleteOption<string>[] = [];
        for (var i of list) {
            if (getExclusives($modalStore[0].meta.game).includes(i)) {
                continue;
            } else {
                var option: AutocompleteOption<string> = {
                    label: capitalise(i),
                    value: i
                }
                newOptions.push(option);
            }
        }
        return newOptions;
    }

    var visible: boolean = true;
    function toggleAutocomplete() {
        if (visible) {
            visible = false;
        } else {
            visible = true;
        }
    }

    async function onPokemonSelection(event: any): Promise<void>  {
        chosenSpecies = event.detail.label;
        toggleAutocomplete();
        submitPokemon = true;
    }

    function onSubmit(e: Event): void {
        e.preventDefault();
        if ($modalStore[0] && typeof $modalStore[0].response == "function") {
            $modalStore[0].response(chosenSpecies.toLowerCase());
            parent.onClose();
        }
    }
</script>

{#if $modalStore[0]}
    <div id="warningModal" class="bg-slate-800 grid grid-cols-1 grid-rows-2 grid-flow-col justify-items-center rounded-lg w-modal h-56 relative bottom-36">
        <div>
            <h2 class="mt-4 text-lg font-semibold text-center">Select a Pokémon</h2>
            <p class="mt-4 text-sm text-gray-400 text-center">Choose any Pokémon from your selected Generation & Game</p>
        </div>
        <div>
            <input class="input sm:w-96 phone-m:w-72 w-64 max-w-sm max-h-12 mb-2" bind:value={chosenSpecies} type="text" placeholder="Search..." on:focusin={() => { if (visible) { toggleAutocomplete() } }} />
            <div class="absolute right-10 sm:bottom-8 bottom-4">
                <button disabled={!submitPokemon} class="bg-primary-800 z-20 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed w-16 h-8 rounded-lg" on:click={onSubmit}>Sure?</button>
            </div>
            <div class="card w-full max-w-sm max-h-48 p-4 relative z-10 overflow-y-auto" tabindex="-1" class:invisible={visible}>
                <Autocomplete bind:input={chosenSpecies} options={pkAutocomplete} on:selection={async (e) => {await onPokemonSelection(e)}}/>
            </div>
        </div>
    </div>
{/if}