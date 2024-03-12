<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { Loader2Icon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	import '../app.postcss';

	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	/* --- */

	let clientSided = false;
	onMount(() => (clientSided = true));

	let navigating = false;
	beforeNavigate(() => (navigating = true));
	afterNavigate(() => (navigating = false));
</script>

<svelte:head>
	<title>UniUI</title>

	<meta content="UniUI" property="og:title" />
	<meta content="Opinionated UI library for KubeJS. Build your own UIs with ease in less than 5 minutes." property="og:description" />
	<meta content="{base}/uniui.png" property="og:image" />
	<meta name="theme-color" content="#b74848" />
</svelte:head>

{#if navigating || !clientSided}
	<div class="card variant-soft-success absolute bottom-8 right-8 z-40 p-4">
		<Loader2Icon class="size-8 animate-spin text-success-500" />
	</div>
{/if}

{#if clientSided}
	{#key $page.route.id}
		<slot />
	{/key}
{/if}

<Toaster richColors theme="dark" />
