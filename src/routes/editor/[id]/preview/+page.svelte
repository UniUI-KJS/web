<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { interfacesStore as pr } from '$lib';
	import { ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte';
	import { flip } from 'svelte/animate';

	const pi = $pr.findIndex((p) => p.id == $page.params.id);

	export const moveItem = <T,>(data: T[], from: number, to: number): T[] => {
		const f = data.splice(from, 1)[0];
		data.splice(to, 0, f);
		return data;
	};

	let visibleComponents = Object.keys($pr[pi].images);
</script>

<svelte:head>
	<title>{$pr[pi].name} [Preview]</title>
</svelte:head>

<div class="h-full">
	<div class="h-full w-full overflow-scroll">
		<svg viewBox="0 0 256 256" width={256 * 8} height={256 * 8}>
			{#each [...visibleComponents].reverse() as c, i}
				<foreignObject width="256" height="256" x="0" y="0">
					<img src={$pr[pi].images[c]} alt={c} class="h-full w-full" style="image-rendering: pixelated;" />
				</foreignObject>
			{/each}
		</svg>
	</div>

	<h1 class="h1 fixed left-8 top-8">{$pr[pi].name} - Texture preview</h1>

	<a href="{base}/editor/{$pr[pi].id}" class="variant-filled-primary btn absolute bottom-8 right-8">Back</a>

	<div class="fixed bottom-8 left-8 flex w-96 flex-col gap-1">
		{#each visibleComponents as c, i (c)}
			<div class="group card flex items-center justify-between p-1 pl-4" animate:flip={{ duration: 300 }}>
				{c}

				<div class="flex gap-1 opacity-0 transition-[opacity] duration-75 group-hover:opacity-100">
					<button
						class="variant-soft-primary btn-icon"
						disabled={i == 0}
						on:click={() => (visibleComponents = moveItem(visibleComponents, i, i - 1))}
					>
						<ChevronUpIcon class="size-4" />
					</button>
					<button
						class="variant-soft-primary btn-icon"
						disabled={i == visibleComponents.length - 1}
						on:click={() => (visibleComponents = moveItem(visibleComponents, i, i + 1))}
					>
						<ChevronDownIcon class="size-4" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
