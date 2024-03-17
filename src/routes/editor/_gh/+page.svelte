<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		window.opener.location?.reload();
		setTimeout(() => window.close(), 2000);
	});
</script>

<div class="flex h-full items-center justify-center">
	<h1 class="h1">Signed in!</h1>
</div>
