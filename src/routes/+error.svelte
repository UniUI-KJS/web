<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}'d</title>
</svelte:head>

<div class="grid h-full place-items-center">
	<div>
		<h1 class="h4">Something went wrong - {$page.status}: {$page.error?.message}</h1>
		<a href="{base}/" class="variant-filled-primary btn mt-2">Go Home</a>
	</div>
</div>
