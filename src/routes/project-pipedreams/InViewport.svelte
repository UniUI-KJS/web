<script lang="ts">
	let element: HTMLElement;
	let observer: IntersectionObserver;
	let isVisible = false;

	$: if (element) {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				isVisible = entry.isIntersecting;
			});
		});
		observer.observe(element);
	}
</script>

<div bind:this={element} {...$$restProps}>
	{#if isVisible}
		<slot />
	{/if}
</div>
