<script lang="ts">
	import { base } from '$app/paths';
	import { interfacesStore, type ArrayElement } from '$lib';
	import { toast } from 'svelte-sonner';
	import { fly, slide } from 'svelte/transition';

	export let project: ArrayElement<typeof $interfacesStore>;
	export let i: number;
</script>

<div class="card flex items-center px-3" in:fly|global={{ delay: 700 + i * 50, y: 10 }}>
	<a href="{base}/editor/{project.id}/" class="grow py-3">
		{project.name}
	</a>

	<div class="my-1 flex border-l border-[rgba(255,255,255,0.2)] pl-3 *:my-2" in:slide|global={{ axis: 'x', delay: 1000 + i * 20 }}>
		<button
			class="variant-soft-error btn btn-sm mx-auto"
			on:click={() =>
				toast.warning(`Delete interface '${project.name}'?`, {
					duration: 5 * 1000,
					description: 'This cannot be undone!',
					action: {
						label: 'Delete',
						onClick: () => ($interfacesStore = $interfacesStore.filter((p) => p.id != project.id))
					}
				})}
		>
			Delete
		</button>
	</div>
</div>
