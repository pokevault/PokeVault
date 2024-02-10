<script lang='ts'>
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { FileButton } from '@skeletonlabs/skeleton';
    import { initializeStores } from '@skeletonlabs/skeleton';
    import { Modal, getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
    
    import Error from '$lib/components/modals/uploadErrorModal.svelte';

    import FileSelect from '$lib/components/saveFile.svelte';

    import Box from '$lib/components/box/Box.svelte';
    import type { Placement } from '@floating-ui/dom';

    initializeStores();

    const modalStore = getModalStore();
    const registry: Record<string, ModalComponent> = {
        e: { ref: Error },
    };
    
    const errorModal: ModalSettings = {
	    type: 'component',
	    component: 'e'
    };

    let w: number;
    let uploadSave: PopupSettings;

    $:{
        let side: Placement = w < 768 ? "right" : "bottom";
        
        uploadSave = {
            event: 'click',
            target: 'uploadSave',
            placement: side
        };
    }

    let newFiles: number = 0;

    var page: number = 0;

    async function submitForm(e: Event): Promise<void> {
        let form: HTMLFormElement = document.getElementById("uploadForm") as HTMLFormElement;
        let fileButton = e.target as HTMLInputElement;
        let data: FormData = new FormData(form);
        fileButton.value = "";

        let file: File = data.get("save") as File;

        if (file.size == 0) {
            modalStore.trigger(errorModal);
            return;
        }

        const req = await fetch(form.action+"/", {
            method: form.method,
            body: data
        });

        if (!req.ok) {
            console.error("Save Upload failed");
            return;
        } else {
            newFiles++;
        }
    }

    function compareStrings(a: string, b: string): number {
        const aParts = a.split('.');
        const bParts = b.split('.');

        if (aParts[0] === bParts[0]) {
            const pattern: RegExp = new RegExp(/\((\d+)\)/);
            const aNum = parseInt(aParts[1].match(pattern) ? aParts[1].match(pattern)![1] : '0');
            const bNum = parseInt(bParts[1].match(pattern) ? bParts[1].match(pattern)![1] : '0');

            if (aNum && bNum) {
                return aNum - bNum;
            } else if (aNum) {
                return -1;
            } else if (bNum) {
                return 1;
            } else {
                return aParts[1].localeCompare(bParts[1]);
            }
        } else {
            return aParts[0].localeCompare(bParts[0]);
        }
    }

    async function getSaves(): Promise<Array<any>> {
        var req = await fetch("api/get-saves");
        var resp = await req.json();
        (resp.items as any[]).sort((a, b) => compareStrings(a.name as string, b.name as string));
        return resp.items;
    }
</script>

<svelte:window bind:innerWidth={w}/>

<svelte:head>
    <title>PokéVault</title>
</svelte:head>

<Modal components={registry}/>
<div class='upload'>
    <div id='addButton' class='w-8 relative top-16 left-8'>
        <button use:popup={uploadSave} class='bg-gradient-to-r from-tertiary-500 to-tertiary-600 rounded-full w-16 h-8'>
            <div>
                <span class="iconify material-symbols-light--add float-left bg-black h-6 w-6"></span>
                <span class='text-black relative right-1'>Add</span>
            </div>
        </button>
    </div>
	<div class="relative z-20">
		<div class="card p-4 variant-filled-surface h-20" data-popup="uploadSave">
			<div id='uploadComponent' class='flex flex-col justify-center space-y-2'>
				<div class='order-1' title='Submit by uploading a .SAV file'>
					<form id="uploadForm" method="POST" action="api/upload" enctype="multipart/form-data">          
						<FileButton name='save' id='uploadfield' on:change={submitForm}>
							<div class='flex justify-center space-x-2'>
								<span class="iconify ri--upload-2-line h-6 w-6"></span>
								<span>Upload</span>
							</div>
						</FileButton>
					</form>
				</div>
			</div>
			<div class="arrow variant-filled-surface" />
		</div>
	</div>
</div>
{#key newFiles}
    <div id="save-select" class="w-[80vw] md:w-60 relative md:left-[18%] left-1/2 -translate-x-1/2 top-24" class:w-60={w >= 1024} class:w-80={w < 1024}>
        {#await getSaves()}
            <div class="placeholder md:h-fit animate-pulse grid max-md:grid-cols-5 md:grid-rows-5 max-md:mb-1">
                <div class="h-9 md:h-18 bg-surface-800 md:border-b max-md:border-r max-md:rounded-l-lg md:rounded-t-lg"></div>
                <div class="h-9 md:h-18 bg-surface-800 md:border-b max-md:border-r"></div>
                <div class="h-9 md:h-18 bg-surface-800 md:border-b max-md:border-r"></div>
                <div class="h-9 md:h-18 bg-surface-800 md:border-b max-md:border-r"></div>
                <div class="h-9 md:h-18 bg-surface-800 md:rounded-b-lg max-md:rounded-r-lg"></div>
            </div>
            {:then saves}
                <div class="grid max-md:grid-cols-5 w-full max-md:divide-x md:divide-y">
                    {#each saves as save}
                        {@const fiveSaves = saves.slice(0+(page*5), 5+(page*5))}
                        {@const i = fiveSaves.indexOf(save)}
                        {#if fiveSaves.includes(save)}
                            <FileSelect saveFile={save} on:deleted={() => newFiles--} start={ i == 0 } hasBorder={!(i == 0 && fiveSaves.length == 1)} end={i == fiveSaves.length - 1} condensed={w < 768} />
                        {/if}
                    {/each}
                </div>
                {#if saves.length > 1}
                    <div class="w-60 h-8 mt-3 rounded-full bg-surface-400-500-token flex relative left-1/2 -translate-x-1/2 max-md:top-6 max-md:-mb-14">
                        <button class="rounded-l-full text-center pr-4 h-8 w-12 bg-surface-500" on:click={() => page--} class:invisible={page < 1}>
                            <span class="iconify ri--arrow-left-double-fill h-8 w-8"></span>
                        </button>
                        <span class="text-center self-center w-36 select-none">Page {page+1}</span>
                        {#if !(saves.length <= (page+1)*5)}
                            <button class="rounded-r-full text-center pl-4 h-8 w-12 bg-surface-500" on:click={() => page++}>
                                <span class="iconify ri--arrow-right-double-fill h-8 w-8"></span>
                            </button>
                        {/if}
                    </div>
                {/if}
            {/await}
    </div>
{/key}
<Box />