<script>
	import { onMount } from 'svelte';

	onMount(() => {
		window.opener.location.reload();
		window.close();
	});
</script>

<p>You can close this tab now.</p>
