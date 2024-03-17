<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';

	onMount(() => {
		window.opener.location?.reload();
		setTimeout(() => window.close(), 2000);
	});
</script>

<div class="flex h-full items-center justify-center">
	<h1 class="h1">Signed in!</h1>
</div>

<div class="absolute bottom-1 left-0 right-0 flex">
	<a
		href="http://localhost:5173/{base}/editor/_gh?token={Cookies.get('uniui-token')}"
		class="variant-soft-surface btn btn-sm mx-auto w-fit"
	>
		Use development server
	</a>
</div>
