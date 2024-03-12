<script lang="ts">
	import Color from 'color';
	import options from './options';

	export let pos = { x: 0, y: 0 };
	export let opts = options.Button.initialOpts;

	$: background = !opts.Disabled ? Color(opts.Accent).hex() : Color('#9E9E9E').mix(Color(opts.Accent), 0.4).lighten(-0.1).hex();
	$: darker = !opts.Disabled ? Color(opts.Accent).lighten(-0.3).hex() : Color('#9E9E9E').mix(Color(opts.Accent), 0.4).lighten(0.1).hex();
	$: lighter = !opts.Disabled ? Color(opts.Accent).lighten(0.3).hex() : Color('#9E9E9E').mix(Color(opts.Accent), 0.4).lighten(-0.4).hex();

	$: width = 18 * opts.Size[0];
	$: height = 18 * opts.Size[1];
</script>

<g style="transform: translateX({pos.x}px) translateY({pos.y}px);" {...$$restProps}>
	<rect {width} {height} fill="#C6C6C6" />

	<!-- outline -->
	<path d="M2,2.5h{width - 4}M2,{height - 3}.5h{width - 4}M1.5,3v{height - 6}M{width - 2}.5,3v{height - 6}" stroke="black" />

	<!-- background -->
	<rect x="2" y="3" width={width - 4} height={height - 6} fill={background} />

	<!-- outline shadows -->
	<path d="M{width - 3}.5,4v{height - 8}M3,{height - 4}.5h{width - 5}" stroke={darker} />
	<path d="M2.5,4v{height - 8}M2,3.5h{width - 5}" stroke={lighter} />

	<!-- icon -->
	<svg width="8" height="7" viewBox="0 0 8 7" x={width / 2 - 4} y={height / 2 - 4} style="overflow: visible">
		{#each opts.Icon ?? [] as row, rowIndex}
			{#each row as pixel, colIndex}
				{#if pixel}
					{#if opts.IconStyle == 'shadow'}
						{#if !opts.Disabled}
							<rect x={colIndex} y={rowIndex + 1} width="1" height="1" fill={darker} />
						{/if}
						<rect x={colIndex} y={rowIndex} width="1" height="1" fill={!opts.Disabled ? '#FFFFFF' : lighter} />
					{:else if opts.IconStyle == 'dark'}
						<rect x={colIndex} y={rowIndex} width="1" height="1" fill={darker} />
					{:else if opts.IconStyle == 'light'}
						<rect x={colIndex} y={rowIndex} width="1" height="1" fill={!opts.Disabled ? '#FFFFFF' : lighter} />
					{/if}
				{/if}
			{/each}
		{/each}
	</svg>
</g>
