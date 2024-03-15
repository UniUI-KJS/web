<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { interfacesStore } from '$lib';
	import { toast } from 'svelte-sonner';
	import { blur, fly } from 'svelte/transition';
	import Project from './Project.svelte';

	const newProj = async (e: SubmitEvent, projectId: string) => {
		const target = e.target as HTMLFormElement;
		target.button.disabled = true;

		const projectName = target.projectName.value;

		if ($interfacesStore.find((p) => p.id == projectId)) {
			target.button.disabled = false;
			return toast.error('Project with this name already exists');
		}

		$interfacesStore = [
			...$interfacesStore,
			{
				id: projectId,
				name: projectName,
				toolbox: [],
				components: { Default: Array(9 * (6 + 4)).fill(null) },
				rows: 3,
				greedyExport: false,
				modifyPlayerSlots: false,
				images: {},
				interactions: {}
			}
		];

		setTimeout(() => goto(`${base}/editor/${projectId}/`), 100);
	};
</script>

<svelte:head>
	<title>Projects [UniUI Editor]</title>
</svelte:head>

<p class="fixed bottom-4 left-4 max-w-[33%] text-balance text-surface-300" in:fly|global={{ x: 20, delay: 2000 }}>
	Note: UniUI editor is really opinionated. If you want to use your own UI style, feel free to build your own textures.
</p>
<p class="fixed bottom-4 right-4 max-w-[33%] text-balance text-surface-300" in:fly|global={{ x: -20, delay: 2100 }}>
	Drag and drop editor JSON to import. (todo)
	<!-- TODO: Drag and drop editor JSON to import -->
</p>

<div class="mx-auto h-full max-h-screen max-w-screen-md py-8 {$interfacesStore.length == 0 && 'flex flex-col justify-center'}">
	<div class="space-y-6 {$interfacesStore.length == 0 && 'flex flex-col *:mx-auto'}">
		<a href="{base}/" class="btn w-fit rounded-full hover:variant-soft" in:fly|global={{ x: 20, delay: 200 }}>
			<h1 class={$interfacesStore.length == 0 ? 'h1' : 'h3'}>UniUI</h1>
		</a>

		<!-- / -->

		<div class="flex gap-2">
			<form class="flex w-full gap-2" on:submit|preventDefault={(e) => newProj(e, Math.random().toString(36).substring(2))}>
				<input
					class="input"
					type="text"
					placeholder="My awesome interface"
					required
					id="projectName"
					autocomplete="off"
					spellcheck="false"
					in:fly|global={{ delay: 400, y: 20 }}
				/>
				<button class="variant-filled-primary btn" type="submit" id="button" in:fly|global={{ delay: 500, y: 20 }}>Create</button>
			</form>

			<!-- <div class="divider-vertical mx-0 my-2" in:fly|global={{ delay: 550, y: 20 }} />

			{#if $interfacesStore.some((p) => p.id == 'tutorial')}
				<a href="{base}/editor/tutorial/" class="variant-soft-primary btn" in:fly|global={{ delay: 600, y: 20 }}>Open tutorial</a>
			{:else}
				<form class="flex gap-2" on:submit|preventDefault={(e) => newProj(e, 'tutorial')}>
					<input class="hidden" type="text" id="projectName" value="tutorial" />
					<button class="variant-soft-primary btn" type="submit" id="button" in:fly|global={{ delay: 600, y: 20 }}>Open tutorial</button>
				</form>
			{/if} -->
		</div>

		<!-- / -->

		<div class="flex h-fit flex-col gap-2">
			{#each $interfacesStore as project, i}
				<Project {project} {i} />
			{/each}

			{#if $interfacesStore.length > 5}
				<button
					in:blur|global={{ delay: 3000 }}
					class="anchor mb-2 !text-surface-400"
					on:click={() =>
						toast.warning(`Delete ALL interfaces?`, {
							duration: 5 * 1000,
							description: 'This CANNOT be undone! ALL YOUR WORK WILL BE LOST!',
							action: {
								label: 'Delete ALL!',
								onClick: () => ($interfacesStore.length = 0)
							}
						})}
				>
					Delete all
				</button>
			{/if}
		</div>
	</div>
</div>
