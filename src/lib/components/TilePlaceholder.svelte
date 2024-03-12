<script lang="ts">
	import { fade } from 'svelte/transition';

	export let size = { w: 18, h: 18 };
	export let pos = { x: 0, y: 0 };
	export let color = '';
	export let label = '';
	export let showLabel = false;
	export let tile: { t: ConstructorOfATypedSvelteComponent; opts: any } | undefined = undefined;
	export let defaultTile: { t: ConstructorOfATypedSvelteComponent; opts: any } | undefined = undefined;
</script>

<svg
	width={size.w}
	height={size.h}
	x={pos.x}
	y={pos.y}
	viewBox="0 0 18 18"
	fill="none"
	style="overflow: visible;"
	xmlns="http://www.w3.org/2000/svg"
	{...$$restProps}
	transition:fade|global={{ duration: 200 }}
>
	{#if tile}
		<g> <svelte:component this={tile.t} opts={tile.opts} /> </g>
	{:else}
		<g>
			{#if defaultTile}
				<svelte:component this={defaultTile.t} opts={defaultTile.opts} />
			{/if}
			<rect x="3.5" y="3.5" width="11" height="11" stroke={color || '#94E2D5'} class="render-exclude-always" opacity="0.8" />
			<rect width="18" height="18" fill={color || '#94E2D5'} fill-opacity="0.3" class="render-exclude-always" />
		</g>
	{/if}

	{#if label && showLabel}
		<text x="9" y="9" text-anchor="middle" dominant-baseline="central" fill="#000" font-size="4" class="render-exclude-always">
			{label}
		</text>
	{/if}
</svg>
