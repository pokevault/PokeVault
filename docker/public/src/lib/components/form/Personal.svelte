<script lang="ts">
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';

    import TrainerCard from '$lib/components/form/Trainer.svelte';

    import type { FormSchema } from '$lib/schema';

    export let data: FormSchema;

    const OTinputPopup: PopupSettings = {
        event: 'focus-click',
        target: 'OTinputPopup',
        placement: 'right'
    };

    const IDinputPopup: PopupSettings = {
        event: 'focus-click',
        target: 'IDinputPopup',
        placement: 'right'
    };

</script>

<div class="max-md:grid max-md:grid-rows-2 max-md:justify-items-center">
    <div class="max-md:mt-10 md:absolute md:left-22 lg:left-32 phone-l:max-md:left-[15%] max-md:left-3 md:mt-14">
        <TrainerCard bind:currentTrainer={data.trainerGender} />
    </div>
    <div>
        <div class="w-2/3 max-md:pt-14 md:absolute md:left-72 md:top-80">
            <div class="grid max-md:grid-rows-2 md:grid-cols-2 md:justify-items-center max-md:gap-y-8">
                <div>
                    <label for="otinput">OT</label>
                    <input type="text" name="otinput" class="formoption" placeholder="Enter Your Trainer Name..." bind:value={data.trainerNickName}>
                </div>
                <div>
                    <label for="idnoinput">IDNo.</label>
                    <input type="number" name="idnoinput" class="formoption" placeholder="Enter Your Trainer IDNo..." bind:value={data.trainerID}>
                </div>
            </div>
        </div>
    </div>
</div>