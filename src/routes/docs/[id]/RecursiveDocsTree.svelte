<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { TreeViewItem } from '@skeletonlabs/skeleton';

	export let docs: any[];
</script>

{#each docs as [id, data]}
	{#if typeof data == 'string'}
		<TreeViewItem
			checked={id == $page.params.id}
			on:click={() => goto(`${base}/docs/${id}`)}
			class={id == $page.params.id && 'variant-soft'}
		>
			<span class="hover:underline {id == $page.params.id && 'text-primary-500 hover:text-primary-400'}">
				{data}
			</span>
		</TreeViewItem>
	{:else if typeof data == 'object'}
		<TreeViewItem open={Object.keys(data).includes($page.params.id)}>
			{id}

			<svelte:fragment slot="children">
				<svelte:self docs={Object.entries(data)} />
			</svelte:fragment>
		</TreeViewItem>
	{/if}
{/each}
