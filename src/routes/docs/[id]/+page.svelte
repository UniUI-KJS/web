<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { TreeView } from '@skeletonlabs/skeleton';
	import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import markdownit from 'markdown-it';
	import { slide } from 'svelte/transition';
	import RecursiveDocsTree from './RecursiveDocsTree.svelte';

	const md = markdownit();

	$: doc = md
		.render($page.data.doc)
		.replace(
			/\(- example ([\-a-zA-z]*) -\)/g,
			`<a href="{base}/editor/importExample/$1" class="btn variant-filled-primary no-underline">Import this example</a>`
		);
	let docs = Object.entries($page.data.docs);
	$: docIndex = docs.findIndex((d) => d[0] == $page.params.id);
</script>

<svelte:head>
	<title>UniUI Documentation</title>
</svelte:head>

<div class="grid h-full gap-4 *:overflow-y-scroll lg:grid-cols-[auto_1fr]">
	<div class="flex flex-col gap-2 bg-surface-800 p-8 lg:w-96" in:slide={{ axis: 'x', delay: 100 }}>
		<div class="flex gap-2">
			<a href="{base}/" class="btn-icon my-auto hover:variant-soft-primary">
				<ArrowLeftIcon />
			</a>
			<h1 class="h3 my-4">Documentation</h1>
		</div>

		<TreeView padding="px-2 py-1">
			<RecursiveDocsTree {docs} />
		</TreeView>
	</div>

	<div class="p-4 lg:p-16">
		{#key doc}
			<div class="rabbity-animation prose prose-cyan max-w-full select-text dark:prose-invert [&_*]:select-text">
				{@html doc}
			</div>

			<div class="mx-auto my-8 grid grid-cols-2 gap-4 2xl:w-1/2">
				{#if docIndex > 0}
					<a href="{base}/docs/{docs[docIndex - 1][0]}" class="card flex gap-2 p-2">
						<ChevronLeftIcon />
						{docs[docIndex - 1][1]}
					</a>
				{:else}
					<div />
				{/if}

				{#if docIndex < docs.length - 1}
					<a href="{base}/docs/{docs[docIndex + 1][0]}" class="card flex gap-2 p-2">
						<ChevronRightIcon />
						{docs[docIndex + 1][1]}
					</a>
				{:else}
					<div />
				{/if}
			</div>
		{/key}
	</div>
</div>
