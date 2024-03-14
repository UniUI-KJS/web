<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { darken, interfacesStore as pr } from '$lib';
	import TilePlaceholder from '$lib/components/TilePlaceholder.svelte';
	import TilePreview from '$lib/components/TilePreview.svelte';
	import { FFoot, FHead, FRow } from '$lib/components/outerFrame';
	import tiles from '$lib/components/tiles';
	import { getDrawerStore, popup, Modal, getModalStore } from '@skeletonlabs/skeleton';
	import { PencilLineIcon, ScanEyeIcon, UploadIcon, WrenchIcon, ChevronLeftIcon } from 'lucide-svelte';
	import { elementSizeStore } from 'svelte-legos';
	import { toast } from 'svelte-sonner';
	import { expoOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { readable } from 'svelte/store';
	import { fly, scale, slide } from 'svelte/transition';
	import EditorDrawer from './EditorDrawer.svelte';

	const pi = $pr.findIndex((p) => p.id == $page.params.id);

	let currentTile = -1;
	let localOpts: any = {
		currentComponent: 'Default'
	};
	let tileToAdd: any = {};

	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	$: positionClasses = $drawerStore.open || $modalStore.length > 0 ? 'scale-95' : '';

	let editorElement: HTMLDivElement;
	let editorSize: ReturnType<typeof elementSizeStore> = readable({ width: 0, height: 0 });
	$: editorElement instanceof HTMLDivElement ? (editorSize = elementSizeStore(editorElement)) : null;

	$: getTile = (ind: string | number, layer: string) => {
		const tile = $pr[pi].toolbox.find((it) => it.id == (typeof ind == 'number' ? $pr[pi].components[layer][ind]?.[0] : ind));
		return tile ? { t: tiles[tile.comp].comp, opts: tile.options } : undefined;
	};

	$: highestZ = Math.max(...$pr[pi].components[localOpts.currentComponent].map((c) => c?.[1] ?? 0));

	$: tilePos = [
		...(Array($pr[pi].rows * 9)
			.fill(undefined)
			.map((_, ind) => [17 + Math.floor(ind / 9) * 18, 7 + (ind % 9) * 18]) satisfies [number, number, string?][]),
		...(Array((6 - $pr[pi].rows) * 9)
			.fill(undefined)
			.map(() => [9999, 9999]) satisfies [number, number, string?][]),

		...($pr[pi].modifyPlayerSlots
			? [
					...(Array(3 * 9)
						.fill(undefined)
						.map((_, ind) => [30 + $pr[pi].rows * 18 + Math.floor(ind / 9) * 18, 7 + (ind % 9) * 18, '#fab387']) satisfies [
						number,
						number,
						string?
					][]),

					...(Array(1 * 9)
						.fill(undefined)
						.map((_, ind) => [88 + $pr[pi].rows * 18 + Math.floor(ind / 9) * 18, 7 + (ind % 9) * 18, '#f9e2af']) satisfies [
						number,
						number,
						string?
					][])
				]
			: (Array(4 * 9)
					.fill(undefined)
					.map(() => [9999, 9999]) satisfies [number, number, string?][]))
	] satisfies [number, number, string?][];

	/** [string, number, number] -> tile id, z, ind */
	$: displayContents = $pr[pi].components[localOpts.currentComponent]
		.map((v, i) => ({
			t: v?.[0] ?? '',
			z: v?.[1] ?? 0,
			i
		}))
		.sort((a, b) => {
			if (a.t != '') return a.z - b.z;
			return -1;
		}) satisfies {
		t: string;
		z: number;
		i: number;
	}[];
	/** [string, number, number] -> tile id, z, ind */
	$: displayContentsDefault =
		localOpts.currentComponent == 'Default'
			? []
			: ($pr[pi].components.Default.map((v, i) => ({
					t: v?.[0] ?? '',
					z: v?.[1] ?? 0,
					i
				})).sort((a, b) => {
					if (a.t != '') return a.z - b.z;
					return -1;
				}) satisfies {
					t: string;
					z: number;
					i: number;
				}[]);

	/* --- */

	const footY = tweened(0, {
		duration: 700,
		delay: 300,
		easing: expoOut
	});
	let footering = true;
	const setFootY = async (v: number) => {
		footering = true;
		await footY.set(v);
		footering = false;
	};
	$: rows = $pr[pi].rows;
	$: setFootY(17 + rows * 18);

	let svgElement: SVGSVGElement;
	let canvasElement: HTMLCanvasElement;
	let exporting = false,
		rendering = false;

	const exportComponent = async (comp: string) => {
		const userComponent = localOpts.currentComponent;
		localOpts.currentComponent = comp;

		rendering = true;
		await new Promise<void>((r) => setTimeout(r, 200)); // TODO: do I have to wait for the animation & renderer?

		const svgString = new XMLSerializer().serializeToString(svgElement);
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

		if (!$pr[pi].greedyExport) svgDoc.querySelectorAll<SVGSVGElement>('.render-exclude').forEach((node) => (node.style.display = 'none'));
		svgDoc.querySelectorAll<SVGSVGElement>('.render-exclude-always').forEach((node) => (node.style.display = 'none'));

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
				ctx.drawImage(image, 0, 0, 176, 221);

				$pr[pi].images[comp] = canvasElement.toDataURL();

				DOMURL.revokeObjectURL(url);
				localOpts.currentComponent = userComponent;

				rendering = false;
				resolve();
			};
		});
	};
	const exportAllComponents = async () => {
		const loadingToast = toast.loading('Rendering components...');
		await new Promise<void>((r) => setTimeout(r, 500));

		for (const c of Object.keys($pr[pi].components)) {
			toast.loading(`Rendering component '${c}'...`, { id: loadingToast });
			await exportComponent(c);
		}

		toast.success('Rendered all components!', { id: loadingToast, duration: 3000 });
	};

	$: actionText = (() => {
		if (localOpts.editInteractions) return 'Editing interactions';
		if (currentTile >= 0) return 'Placing ' + $pr[pi].toolbox[currentTile]?.name;
		return '';
	})();
</script>

<svelte:head>
	<title>{$pr[pi].name} [Editor]</title>
</svelte:head>

<Modal />
<EditorDrawer bind:tileToAdd bind:toolbox={$pr[pi].toolbox} />

<div
	class="grid h-full grid-cols-[auto_1fr_auto] py-4 transition-transform duration-300 *:h-full {positionClasses} {exporting &&
		'get-smaller'}"
>
	<div
		class="grid h-full w-80 auto-rows-max grid-cols-1 gap-2 overflow-y-auto bg-surface-900 p-4"
		in:slide|global={{ delay: 1000, axis: 'x' }}
	>
		{#each $pr[pi].toolbox as tile, i}
			<button
				class="card btn flex items-center justify-start gap-4 p-2 transition-colors {i == currentTile &&
					'variant-filled-surface z-10 scale-110 drop-shadow-lg transition-[transform_filter]'}"
				in:fly={{ y: 20, duration: 500 }}
				disabled={localOpts.editInteractions}
				on:click={() => (currentTile == i ? (currentTile = -1) : (currentTile = i))}
				on:contextmenu|preventDefault={() => (
					(currentTile = -1),
					(tileToAdd = {
						_: Object.keys(tiles).indexOf($pr[pi].toolbox[i].comp),
						...$pr[pi].toolbox[i]
					}),
					drawerStore.open({ id: 'tileActions', meta: i })
				)}
			>
				<div class="overflow-hidden p-2">
					<TilePreview tile={tiles[tile.comp].comp} tileProps={tile.options} />
				</div>
				<p>{tile.name}</p>
			</button>
		{/each}

		<button
			class="variant-filled-primary btn p-2"
			in:fly={{ y: 20, duration: 500 }}
			disabled={localOpts.editInteractions}
			on:click={() => ((tileToAdd = {}), drawerStore.open({ id: 'addTile' }))}
		>
			<PencilLineIcon />
			<p>Create new tile</p>
		</button>
	</div>

	<!-- / -->

	<div
		class="fancy-background relative grid grid-cols-1 place-items-center rounded-3xl border p-2"
		in:scale|global={{ delay: 500 }}
		bind:this={editorElement}
	>
		<svg
			class="h-[80%] w-[80%]"
			viewBox="0 0 176 221"
			width="176"
			height="221"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="xMidYMin"
			style="-webkit-transform: scale(1); transform: scale(1)"
			bind:this={svgElement}
		>
			<svg y={0} class={localOpts.currentComponent != 'Default' ? 'render-exclude-always' : 'render-exclude'}><FHead /></svg>

			{#each Array($pr[pi].rows) as _, i (i)}
				<svg
					y={17 + i * 18}
					transition:darken={{ duration: 500, delay: 300 }}
					class={localOpts.currentComponent != 'Default' ? 'render-exclude-always' : 'render-exclude'}
				>
					<FRow />
				</svg>
			{/each}

			<svg
				y={$footY}
				class="{localOpts.currentComponent != 'Default' ? 'render-exclude-always' : 'render-exclude'} transition-[y_transform]"
			>
				<FFoot />
			</svg>

			<!-- / -->

			<text x={8} y={13} fill="#3F3F3F" font-size="10" class="render-exclude-always font-[Minecraft]"> {$pr[pi].name} </text>
			<text x={8} y={$footY + 10} fill="#3F3F3F" font-size="10" class="render-exclude-always font-[Minecraft]"> Inventory </text>

			{#if !footering}
				{#if localOpts.currentComponent != 'Default'}
					<g class="render-exclude-always">
						{#each displayContentsDefault as { t, z, i }}
							<TilePlaceholder
								tile={t ? getTile(t, 'Default') : undefined}
								defaultTile={tilePos[i][2]
									? { t: tiles.Slot.comp, opts: tiles.Slot.initialOpts }
									: { t: tiles.Blank.comp, opts: tiles.Blank.initialOpts }}
								pos={{ x: tilePos[i][1], y: tilePos[i][0] }}
								showLabel={false}
								color={'#00000000'}
							/>
						{/each}
					</g>
				{/if}

				<g>
					{#each displayContents as { t, z, i }}
						<TilePlaceholder
							tile={t ? getTile(t, localOpts.currentComponent) : undefined}
							defaultTile={localOpts.currentComponent == 'Default'
								? tilePos[i][2]
									? { t: tiles.Slot.comp, opts: tiles.Slot.initialOpts }
									: { t: tiles.Blank.comp, opts: tiles.Blank.initialOpts }
								: undefined}
							pos={{ x: tilePos[i][1], y: tilePos[i][0] }}
							label={`i${i} ${z > 0 ? 'z' + z : ''}`}
							showLabel={localOpts.showInd}
							class={currentTile >= 0 && 'hover:darken-all transition-[filter]'}
							color={tilePos[i][2]}
						/>
					{/each}
				</g>

				<g class="render-exclude-always *:pointer-events-none">
					{#each Object.entries($pr[pi].interactions) as [ind, name], i}
						<rect
							x={tilePos[+ind][1]}
							y={tilePos[+ind][0]}
							width="18"
							height="18"
							stroke-width={localOpts.editInteractions ? 1 : 0.5}
							stroke="hsla({((() => {
								const indexOf = Object.values($pr[pi].interactions).indexOf(name);
								if (indexOf == -1) return i;
								return indexOf;
							})() *
								100) %
								360}, 82.1%, 56.3%, {localOpts.editInteractions ? 1 : 0.3})"
							fill="none"
						/>
					{/each}
				</g>

				<g>
					{#each displayContents as { i }}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<svg
							width="18"
							height="18"
							x={tilePos[i][1]}
							y={tilePos[i][0]}
							viewBox="0 0 18 18"
							fill="none"
							tabindex={i + 420}
							role="button"
							on:click={() => {
								if (localOpts.editInteractions)
									return modalStore.trigger({
										type: 'prompt',

										title: 'New interaction name',
										body: 'To remove an interaction, enter an empty string. (WIP! // TODO: autocomplete)',

										value: $pr[pi].interactions[i],
										valueAttr: { type: 'text', maxlength: 128 },

										response: (r) => {
											if (r == '') return delete $pr[pi].interactions[i], ($pr[pi].interactions = $pr[pi].interactions);
											if (!r) return;
											$pr[pi].interactions[i] = r;
										}
									});

								if (currentTile >= 0) $pr[pi].components[localOpts.currentComponent][i] = [$pr[pi].toolbox[currentTile].id, highestZ + 1];
							}}
							on:contextmenu|preventDefault={() => {
								if (localOpts.editInteractions) return delete $pr[pi].interactions[i], ($pr[pi].interactions = $pr[pi].interactions);

								$pr[pi].components[localOpts.currentComponent].splice(i, 1, null);
								$pr[pi].components[localOpts.currentComponent] = $pr[pi].components[localOpts.currentComponent];
							}}
						>
							<rect width="18" height="18" fill="#00000000" fill-opacity="0" />
						</svg>
					{/each}
				</g>
			{/if}
		</svg>

		<h3 class="h3 absolute left-4 top-4">{actionText}</h3>

		{#if localOpts.editInteractions}
			<div class="absolute right-4 top-4">
				{#each Object.entries($pr[pi].interactions).filter(({ 1: name }, i) => Object.values($pr[pi].interactions).indexOf(name) == i) as [_, name], i}
					<div class="flex items-center justify-end gap-1">
						{name}
						<div
							class="h-2 w-6 rounded"
							style="background-color: hsl({((() => {
								const indexOf = Object.values($pr[pi].interactions).indexOf(name);
								if (indexOf == -1) return i;
								return indexOf;
							})() *
								100) %
								360}, 82.1%, 56.3%)"
						/>
					</div>
				{/each}
			</div>
		{/if}

		<div class="absolute bottom-4 left-4 text-surface-400">
			<p>the render above may not be 100% accurate.</p>
			<p>lookin' weird? the exported texture won't have any random borders.</p>
		</div>

		<div class="absolute bottom-4 right-4 flex gap-2" in:slide|global={{ delay: 1500, axis: 'y' }}>
			<button
				class="variant-soft-primary btn"
				on:click={async () => {
					localOpts.noExportButton = true;

					// @ts-expect-error
					await new Promise(async (r) => (await exportAllComponents(), r()));
					goto(base + '/editor/' + $page.params.id + '/preview');
				}}
				disabled={localOpts.noExportButton || exporting}
			>
				<ScanEyeIcon class="mr-2 h-6 w-6" /> Preview
			</button>

			<button
				class="variant-filled-primary btn rounded-br-md"
				on:click={async () => {
					localOpts.noExportButton = true;

					// @ts-expect-error
					await new Promise(async (r) => (await exportAllComponents(), r()));

					try {
						const ws = new WebSocket('ws://localhost:8625');
						ws.onerror = () => {
							toast.error("Run 'npx uniui-kjs@latest generate' before trying to export.");
							localOpts.noExportButton = false;
						};

						ws.onopen = () => {
							exporting = true;
							ws.send(JSON.stringify($pr[pi]));

							setTimeout(() => goto(base + '/editor/' + $page.params.id + '/exported'), 2000);
						};
					} catch (e) {
						toast.error("Run 'npx uniui generate' before trying to export.");
						localOpts.noExportButton = false;
					}
				}}
				disabled={localOpts.noExportButton || exporting}
			>
				<UploadIcon class="mr-2 h-6 w-6" /> Export!
			</button>
		</div>
	</div>

	<canvas bind:this={canvasElement} width="256" height="256" class="hidden" />

	<!-- / -->

	<div class="flex w-80 flex-col justify-between bg-surface-900 p-4 *:space-y-4" in:slide|global={{ delay: 1000, axis: 'x' }}>
		<div>
			<label class="label">
				<span>Project name</span>
				<input class="input" type="text" bind:value={$pr[pi].name} />
			</label>

			<hr />
			<h3 class="h3">Interface Options</h3>

			<label class="flex items-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked={$pr[pi].greedyExport} />
				<span>Greedy export</span>
			</label>

			<label class="flex items-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked={$pr[pi].modifyPlayerSlots} />
				<span>Modify player slots</span>
			</label>

			<label class="label">
				<span>Rows</span>
				<input class="input" type="number" placeholder="3" min="1" max="6" bind:value={$pr[pi].rows} />
			</label>

			<hr />
			<h3 class="h3">Session Options</h3>

			<label class="flex items-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked={localOpts.editInteractions} on:change={() => (currentTile = -1)} />
				<span>Edit interactions</span>
			</label>

			<label class="flex items-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked={localOpts.showInd} />
				<span>Show debug info</span>
			</label>

			<label class="label">
				<span>Component to edit</span>

				<div class="flex gap-1">
					<select class="select" bind:value={localOpts.currentComponent}>
						{#each Object.keys($pr[pi].components) as c}
							<option value={c}>{c}</option>
						{/each}
					</select>
					<button
						class="variant-filled-primary btn-icon rounded-token"
						use:popup={{ event: 'click', target: 'componentManager', closeQuery: '#close', placement: 'left' }}
					>
						<WrenchIcon class="size-6" />
					</button>

					<div class="card max-w-sm p-4" data-popup="componentManager">
						<div class="space-y-6 *:w-full">
							<p class="text-center">// TODO: components in editor</p>

							<hr />

							<form
								class="flex space-x-2"
								on:submit|preventDefault={(e) => {
									// @ts-expect-error
									const name = e.currentTarget[0].value;
									if ($pr[pi].components[name]) return toast.error('Component with this name already exists');

									$pr[pi].components[name] = Array(9 * (6 + 4)).fill(null);
									localOpts.currentComponent = name;
								}}
							>
								<input class="input" type="text" required autocomplete="off" id="componentName" placeholder="New component name" />
								<button class="variant-filled-primary btn" type="submit" id="close">Add</button>
							</form>

							<hr />

							<button
								disabled={localOpts.currentComponent == 'Default'}
								class="variant-soft-error btn"
								on:click={() => {
									delete $pr[pi].components[localOpts.currentComponent];
									localOpts.currentComponent = 'Default';
									$pr[pi].components = $pr[pi].components;
								}}
								id="close"
							>
								Remove component '{localOpts.currentComponent}'
							</button>
						</div>
						<div class="bg-surface-100-800-token arrow" />
					</div>
				</div>
			</label>
		</div>

		<div class="flex justify-center">
			<a href="{base}/editor/" class="btn w-fit rounded-full hover:variant-soft">
				<h1 class="h3">UniUI</h1>
			</a>
		</div>
	</div>
</div>
