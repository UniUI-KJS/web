<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';
	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';
	import TButton from '../tiles/TButton.svelte';
	import { tdrawFrom } from '$lib';
	export let parent: SvelteComponent;

	let doThey = '?';
	const modalStore = getModalStore();

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let svgElement: SVGSVGElement;
	let canvasElement: HTMLCanvasElement;

	onMount(async () => {
		const svgString = new XMLSerializer().serializeToString(svgElement);
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

		const svgBlob = new Blob([svgDoc.documentElement.outerHTML], {
			type: 'image/svg+xml;charset=utf-8'
		});

		const DOMURL = window.URL || window.webkitURL || window;
		const url = DOMURL.createObjectURL(svgBlob);

		const image = new Image();
		image.width = svgElement.width.baseVal.value;
		image.height = svgElement.height.baseVal.value;
		image.src = url;

		await new Promise<void>((resolve) => {
			image.onload = async () => {
				const ctx = canvasElement.getContext('2d');
				if (!ctx) return;

				ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
				ctx.drawImage(image, 0, 0, 18 * 128, 18 * 128);

				DOMURL.revokeObjectURL(url);
				resolve();
			};
		});
	});
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? 'Heya!'}</header>
		<article>{$modalStore[0].body ?? 'Do the two images look similar to each other?'}</article>

		<div class="flex items-center justify-center gap-4">
			<svg viewBox="0 0 18 18" width="18" height="18" class="size-16" bind:this={svgElement}>
				<TButton
					opts={{
						Disabled: false,
						Accent: '#5ec24c',
						Icon: tdrawFrom('8x8;0000000000100100001001000000000000000000010000100011110000000000'),
						IconStyle: 'shadow',
						Size: [1, 1]
					}}
				/>
			</svg>

			<span class="text-xl font-extrabold"> == </span>

			<canvas bind:this={canvasElement} width={18 * 128} height={18 * 128} class="size-16" />

			<span class="text-xl font-extrabold"> ? </span>
		</div>

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Nope :(</button>
			<button class="btn {parent.buttonPositive}" on:click={parent.onConfirm}>Sure do!</button>
		</footer>
	</div>
{/if}
