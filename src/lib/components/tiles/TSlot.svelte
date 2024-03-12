<script lang="ts">
	import options from './options';

	export let pos = { x: 0, y: 0 };
	export let opts = options.Slot.initialOpts;
</script>

<g style="transform: translateX({pos.x}px) translateY({pos.y}px);" {...$$restProps}>
	{#if opts.Style == 'default'}
		<!-- background -->
		<rect width="18" height="18" fill="#8B8B8B" />

		<!-- outline shadows -->
		<path d="M0,0.5h17M0.5,1v16" stroke="#373737" />
		<path d="M17.5,1v16M1,17.5h17" stroke="#FFFFFF" />
	{:else if opts.Style == 'output'}
		<g style="transform: translateX(-4px) translateY(-4px);">
			<!-- background -->
			<rect width="26" height="26" fill="#8B8B8B" />

			<!-- outline shadows -->
			<path d="M0,0.5h25M0.5,1v24" stroke="#373737" />
			<path d="M25.5,1v24M1,25.5h25" stroke="#FFFFFF" />
		</g>
	{/if}

	<!-- icon -->
	<svg width="16" height="16" viewBox="0 0 16 16" x="1" y="1">
		{#each opts.Icon ?? [] as row, rowIndex}
			{#each row as pixel, colIndex}
				{#if pixel}
					<rect x={colIndex} y={rowIndex} width="1" height="1" fill="#555555" />
				{/if}
			{/each}
		{/each}
	</svg>
</g>
