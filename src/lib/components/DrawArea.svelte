<script lang="ts">
	export let renderSize = 24;
	export let canvas: boolean[][] = [];

	let mouseMoveMode: false | 'w' | 'b' = false;

	function handleClick(row: number, col: number) {
		canvas[row][col] = !canvas[row][col];
		canvas = canvas;
	}
</script>

<svelte:body on:mouseup={() => (mouseMoveMode = false)} />

<div class="relative w-fit overflow-hidden rounded-container-token">
	<div class="center-point" />

	{#each canvas || [] as row, rowIndex}
		<div class="flex w-full">
			{#each row as pixel, colIndex}
				<button
					style="width: {renderSize}px; height: {renderSize}px; background-color: {!pixel ? 'black' : 'white'};"
					class="border-primary-500 hover:border-2"
					on:mousedown={() => (handleClick(rowIndex, colIndex), (mouseMoveMode = !pixel ? 'b' : 'w'))}
					on:mouseenter={() => mouseMoveMode && pixel == (mouseMoveMode == 'w') && handleClick(rowIndex, colIndex)}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
	.center-point {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: #2f2f2f;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		pointer-events: none;
		z-index: 100;
	}
</style>
