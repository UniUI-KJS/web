<script lang="ts">
	import { tweened } from 'svelte/motion';
	import ExportedSvg from './ExportedSvg.svelte';
	import { quartOut as easing } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { blur, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { interfacesStore } from '$lib';

	const scale = tweened(15, {
		duration: 2000,
		easing
	});
	onMount(() => scale.set(1));

	const projectId = $page.params.id;
	const pr = $interfacesStore.find((p) => p.id == projectId);
</script>

<svelte:head>
	<title>{pr?.name} [Exported]</title>
</svelte:head>

<div class="h-full w-full overflow-hidden bg-black">
	<div id="stars" style="opacity: {$scale > 2 ? 0 : 1}" class="transition-opacity duration-1000" />
	<ExportedSvg class="fixed inset-0 mx-auto my-auto h-[70vh]" style="transform: scale({$scale})" />

	{#if $scale <= 2}
		<div class="fixed left-0 right-0 top-8 grid w-full justify-items-center">
			<div class="space-y-4 *:mx-auto *:text-center">
				<h1 class="h1" in:fly={{ y: -100, duration: 600, delay: 200 }}>Exported!</h1>
				<p class="text-surface-400" in:blur={{ duration: 1000, delay: 2000 }}>Continue in your terminal.</p>
			</div>
		</div>

		<div class="fixed bottom-8 left-0 right-0 grid w-full justify-items-center">
			<div class="space-x-4">
				<a class="variant-filled-primary btn" href="{base}/docs/post-export" in:fly={{ y: -20, duration: 600, delay: 400 }}> Next steps </a>

				<button
					class="variant-soft-primary btn"
					in:fly={{ y: -20, duration: 600, delay: 600 }}
					on:click={() => {
						scale.set(15);
						setTimeout(() => goto(`${base}/editor/${projectId}`), 2000);
					}}
				>
					Return to editor
				</button>
			</div>
		</div>
	{/if}
</div>
