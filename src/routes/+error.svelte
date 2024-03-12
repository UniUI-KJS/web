<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<h1 class="h1">Something went wrong - {$page.status}: {$page.error?.message}</h1>

<a href="{base}/" class="variant-filled-primary btn m-8">Go Home</a>
