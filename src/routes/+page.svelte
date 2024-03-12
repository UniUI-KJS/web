<script>
	import { base } from '$app/paths';
	import { fly, blur } from 'svelte/transition';
</script>

<svelte:head>
	<title>Say hello to UniUI.</title>
</svelte:head>

<div class="container mx-auto flex h-full items-center justify-center">
	<div class="flex flex-col items-center space-y-10 text-center">
		<h1 class="h1" in:fly|global={{ delay: 400, y: 20 }}>Say hello to UniUI.</h1>

		<figure in:fly|global={{ delay: 200, y: 20 }}>
			<section class="img-bg" />
			<img src="{base}/uniui.png" alt="logo" />
		</figure>

		<p in:fly|global={{ delay: 600, y: 20 }}>Opinionated UI library for KubeJS</p>

		<!-- / -->

		<div class="flex flex-wrap justify-center gap-2">
			<a class="variant-filled-primary btn" href="{base}/docs/getting-started" in:blur|global={{ delay: 800 }}> Getting Started </a>
			<a class="variant-soft-primary btn" href="{base}/editor/" in:blur|global={{ delay: 900 }}>
				Launch Editor <span class="inline lg:hidden">&nbsp;(use bigger screen!)</span>
			</a>
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply relative flex flex-col;
	}
	figure img,
	.img-bg {
		@apply h-64 w-64 md:h-80 md:w-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation:
			pulse 5s ease-in-out infinite,
			glow 3s linear infinite;
	}
	figure img {
		animation-timeline: auto;
		animation-range-start: normal;
		animation-range-end: normal;
		animation: 10s ease-in-out 0s infinite normal none running float;
	}
	@keyframes float {
		0% {
			transform: translateY(-10px);
		}
		50% {
			transform: translateY(10px);
		}
		100% {
			transform: translateY(-10px);
		}
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
