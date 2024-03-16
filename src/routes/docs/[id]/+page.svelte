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
			/\(- example ([\-a-zA-z0-9]*) -\)/g,
			`<a href="${base}/editor/_gh/$1" class="btn variant-filled-primary no-underline">Import this example</a>`
		);
	let docs = Object.entries($page.data.docs);
</script>

<svelte:head>
	<title>UniUI Documentation</title>
</svelte:head>

<div class="grid h-full gap-4 *:overflow-y-scroll lg:grid-cols-[auto_1fr]">
	<div class="flex flex-col gap-2 bg-surface-800 p-2 lg:w-96 lg:p-8" in:slide={{ axis: 'x', delay: 100 }}>
		<div class="flex gap-2">
			<a href="{base}/" class="btn-icon my-auto hover:variant-soft-primary">
				<ArrowLeftIcon />
			</a>
			<h1 class="h3 my-4">Documentation</h1>
		</div>

		<TreeView padding="px-2 py-1" class="max-h-24 overflow-scroll lg:max-h-full">
			<RecursiveDocsTree {docs} />
		</TreeView>
	</div>

	<div class="p-4 lg:p-16">
		{#key doc}
			<div class="rabbity-animation prose prose-cyan max-w-full select-text dark:prose-invert [&_*]:select-text">
				{@html doc}
			</div>
		{/key}
	</div>
</div>
