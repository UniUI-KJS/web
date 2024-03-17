<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { interfacesStore as pr } from '$lib';
	import Previewer from '$lib/components/Previewer.svelte';

	const pi = $pr.findIndex((p) => p.id == $page.params.id);

	export const moveItem = <T,>(data: T[], from: number, to: number): T[] => {
		const f = data.splice(from, 1)[0];
		data.splice(to, 0, f);
		return data;
	};

	let components = Object.keys($pr[pi].images);
</script>

<svelte:head>
	<title>{$pr[pi].name} [Preview]</title>
</svelte:head>

<div class="relative h-full">
	<Previewer bind:components pics={$pr[pi].images} class="h-full" rows={-1} title="" />

	<h1 class="h1 fixed left-8 top-8">{$pr[pi].name}</h1>
	<a href="{base}/editor/{$pr[pi].id}" class="variant-filled-primary btn absolute bottom-8 right-8">Back</a>
</div>
