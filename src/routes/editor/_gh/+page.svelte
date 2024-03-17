<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';
	import { fade } from 'svelte/transition';

	onMount(() => {
		window.opener.location?.reload();
		setTimeout(() => window.close(), 2000);
	});
</script>

<div class="flex h-full items-center justify-center">
	<h1 class="h1">Signed in!</h1>
</div>

<div class="absolute bottom-1 left-1 right-1 flex" in:fade|global={{ duration: 1, delay: 2000 }}>
	<a
		href="http://localhost:5173/{base}/editor/_gh?token={Cookies.get('uniui-token')}"
		class="variant-ghost-surface btn btn-sm mx-auto w-fit"
	>
		Use development server
	</a>
</div>
