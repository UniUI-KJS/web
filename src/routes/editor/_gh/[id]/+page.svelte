<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { interfacesStore, type ArrayElement } from '$lib';
	import Previewer from '$lib/components/Previewer.svelte';
	import { CopyIcon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const ui: ArrayElement<typeof $interfacesStore> = JSON.parse($page.data.ui);
</script>

<svelte:head>
	<title>{ui.name} [Import]</title>
</svelte:head>

<div class="container mx-auto flex max-w-screen-lg flex-col gap-2 px-2 py-4 md:py-8">
	<div class="flex items-center justify-between">
		<h1 class="h2" in:fly|global={{ y: 20, delay: 100 }}>{ui.name}</h1>

		<div class="flex gap-2" in:fly|global={{ y: 20, delay: 600 }}>
			<!-- <a href={$page.data.hub} class="variant-soft-primary btn">
				<GithubIcon class="mr-2 h-6 w-6" /> View Gist
			</a> -->
			<button
				class="variant-filled-primary btn"
				on:click={() => {
					const id = 'imported-' + Math.random().toString(36).substring(2);

					$interfacesStore = [
						...$interfacesStore,
						{
							...ui,
							id
						}
					];

					goto(`${base}/editor/${id}`);
				}}
			>
				<CopyIcon class="mr-2 h-6 w-6" /> Clone
			</button>
		</div>
	</div>

	<p in:fly|global={{ y: 20, delay: 200 }}>User-submitted UniUI interface. All credits go to the original author.</p>

	<div class="relative mt-4 h-full w-full rounded-lg border md:h-[80vh]" in:fly|global={{ y: 20, delay: 400 }}>
		<Previewer pics={ui.images} components={Object.keys(ui.components)} class="h-full pb-16" />
	</div>
</div>
