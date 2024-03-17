<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}'d</title>
</svelte:head>

<div class="grid h-full place-items-center">
	<div>
		<h1 class="h4">{$page.status}: {$page.error?.message}</h1>
		<a href="{base}/" class="variant-soft-primary btn btn-sm mt-2 w-full">Go Home</a>
	</div>
</div>
