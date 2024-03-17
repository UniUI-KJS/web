<script lang="ts">
	import options from './options';
	import _ from 'lodash';

	export let pos = { x: 0, y: 0 };

	export let opts = options.Progress.initialOpts;
	$: props = _.defaults(opts, options.Progress.initialOpts) as typeof options.Progress.initialOpts;

	$: currentCutoff = Math.floor((16 * props.Progress) / 100);
</script>

<g style="transform: translateX({pos.x}px) translateY({pos.y}px);" {...$$restProps}>
	<rect width="18" height="18" fill="#C6C6C6" />

	<!-- icon -->
	<svg width="16" height="17" viewBox="0 0 16 17" x="1" y="0">
		{#each props.Icon as row, rowIndex}
			{#each row as pixel, colIndex}
				{#if pixel}
					<rect x={colIndex} y={rowIndex + 1} width="1" height="1" fill="#686868" />

					{#if (() => {
						if (props.Direction == 'Up') return 16 - currentCutoff <= rowIndex;
						if (props.Direction == 'Right') return currentCutoff >= colIndex;
						if (props.Direction == 'Down') return currentCutoff >= rowIndex;
						if (props.Direction == 'Left') return 16 - currentCutoff <= colIndex;
					})()}
						<rect x={colIndex} y={rowIndex} width="1" height="1" fill="#FFFFFF" />
					{/if}
				{/if}
			{/each}
		{/each}
	</svg>
</g>
