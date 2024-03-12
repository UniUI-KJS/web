<script lang="ts">
	import DrawArea from '$lib/components/DrawArea.svelte';
	import TilePreview from '$lib/components/TilePreview.svelte';
	import tiles from '$lib/components/tiles';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import _ from 'lodash';
	import { ArrowLeftIcon, BrushIcon, ArrowRightIcon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const drawerStore = getDrawerStore();
	export let tileToAdd: any;
	export let toolbox: any[] = [];
</script>

<Drawer
	rounded="rounded-xl"
	padding="p-2"
	width={tileToAdd['_'] != undefined ? 'w-[1024px]' : 'w-fit'}
	bgDrawer="border bg-surface-900"
	duration={200}
	opacityTransition={false}
>
	{#if $drawerStore.id == 'addTile' || $drawerStore.id == 'modifyTile'}
		{@const tileK = Object.keys(tiles)[tileToAdd['_']]}
		{@const tileV = Object.values(tiles)[tileToAdd['_']]}

		<div class="flex gap-6 p-4">
			<div class="space-y-1">
				{#each Object.values(tiles) as tile, i (tile)}
					<button
						class="card grid aspect-square place-items-center p-2 transition-colors disabled:opacity-50 disabled:brightness-90 {i ==
							tileToAdd['_'] && 'variant-filled-surface z-10 scale-110 drop-shadow-lg transition-[transform_filter]'}"
						disabled={$drawerStore.id == 'modifyTile'}
						in:fly={{ y: 20, duration: 500 }}
						on:click={() => ((tileToAdd['_'] = i), (tileToAdd.options = _.cloneDeep(Object.values(tiles)[i]?.initialOpts || {})))}
					>
						<!-- TODO: fsr this likes to take the last edited tile's options -->
						<TilePreview tile={tile.comp} tileProps={Object.values(tiles)[i]?.initialOpts || {}} />
					</button>
				{/each}
				<p class="text-center text-xs">More soon</p>
			</div>

			{#if tileToAdd['_'] != undefined}
				<div class="flex grow flex-col gap-6">
					<h2 class="h2">{$drawerStore.id == 'addTile' ? 'Adding' : 'Modifying'} {tileK}</h2>

					<label class="label">
						<span>Name</span>
						<input class="input" type="text" bind:value={tileToAdd['name']} />
					</label>

					<hr />

					{#if tileV?.options}
						{#each Object.entries(tileV?.options) as [opt, val]}
							<label class="flex {['boolean', 'number', 'size'].includes(val.type) ? 'justify-between' : 'flex-col'}">
								<div>
									<p>{opt}</p>
									<p class="{['boolean', 'number', 'size'].includes(val.type) ? 'my-auto' : 'mb-2'} text-sm opacity-75">
										{@html val.description.replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br>')}
									</p>
								</div>

								<div class="flex items-center gap-2">
									{#if val.type == 'string'}
										<input type="input" bind:value={tileToAdd.options[opt]} placeholder={val.placeholder} class="input" />
									{:else if val.type == 'boolean'}
										<input type="checkbox" bind:checked={tileToAdd.options[opt]} class="checkbox size-8" />
									{:else if val.type == 'draw'}
										<DrawArea bind:canvas={tileToAdd.options[opt]} />
										<ArrowLeftIcon class="ml-8" />
										<BrushIcon />
									{:else if val.type == 'color'}
										<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
											<div class="input-group-shim !p-1">
												<input class="input !size-9" type="color" bind:value={tileToAdd.options[opt]} />
											</div>
											<input class="input" type="text" bind:value={tileToAdd.options[opt]} readonly tabindex="-1" />
											{#if val.meta}
												<div class="input-group-shim flex gap-1 !p-1">
													{#each val.meta as color}
														<button
															class="size-9 rounded-token"
															style="background-color: {color};"
															on:click={() => (tileToAdd.options[opt] = color)}
														/>
													{/each}
												</div>
											{/if}
										</div>
									{:else if val.type == 'select'}
										<select bind:value={tileToAdd.options[opt]} class="select w-full">
											{#each val.meta as opt}
												<option value={opt}>{opt}</option>
											{/each}
										</select>
									{:else if val.type == 'number'}
										<input
											type="number"
											bind:value={tileToAdd.options[opt]}
											min={val.meta[0]}
											max={val.meta[1]}
											placeholder={val.meta[0].toString()}
											class="input"
										/>
									{:else if val.type == 'size'}
										<div class="flex gap-2">
											<div class="input-group input-group-divider grid-cols-[1fr_auto]">
												<input
													type="number"
													bind:value={tileToAdd.options[opt][0]}
													min={val.meta[0][0]}
													max={val.meta[0][1]}
													placeholder={val.meta[0][0].toString()}
													class="input"
												/>
												<div class="input-group-shim">w</div>
											</div>

											<div class="input-group input-group-divider grid-cols-[auto_1fr]">
												<input
													type="number"
													bind:value={tileToAdd.options[opt][1]}
													min={val.meta[1][0]}
													max={val.meta[1][1]}
													placeholder={val.meta[1][0].toString()}
													class="input"
												/>
												<div class="input-group-shim">h</div>
											</div>
										</div>
									{/if}
								</div>
							</label>
						{/each}
					{:else}
						<p class="text-center text-error-500">No options exist for {tileK}</p>
					{/if}

					<hr />

					{#if !tileToAdd.name}
						<p class="text-center text-error-500">Please name this tile</p>
					{/if}

					<div class="mx-auto flex items-center gap-4">
						<ArrowRightIcon />
						<button
							disabled={!tileToAdd['name'] || !tileK}
							on:click={() => {
								if ($drawerStore.id == 'modifyTile') {
									toolbox.splice($drawerStore.meta, 1, {
										id: toolbox[$drawerStore.meta].id,
										comp: tileK,
										name: tileToAdd['name'],
										options: tileToAdd.options
									});

									toolbox = toolbox;
									return drawerStore.close();
								}

								toolbox = [
									...toolbox,
									{
										id: Math.random().toString(16).slice(2),
										comp: tileK,
										name: tileToAdd['name'],
										options: tileToAdd.options
									}
								];
								drawerStore.close();
							}}
							class="variant-soft-primary btn !p-24"
						>
							<TilePreview tile={tileV.comp} tileProps={tileToAdd.options} />
						</button>
						<ArrowLeftIcon />
					</div>
				</div>
			{/if}
		</div>
	{:else if $drawerStore.id == 'tileActions'}
		{@const tileK = Object.keys(tiles)[tileToAdd['_']]}
		{@const tileV = Object.values(tiles)[tileToAdd['_']]}

		<div class="mx-auto flex h-full w-64 flex-col items-center justify-center gap-2 [&>button]:w-full">
			<TilePreview tile={tileV.comp} tileProps={tileToAdd.options} size={{ h: 128, w: 128 }} class="m-8" />

			<button
				disabled={!tileToAdd['name'] || !tileK}
				on:click={() => {
					drawerStore.open({ id: 'modifyTile', meta: $drawerStore.meta });
				}}
				class="variant-soft-primary btn"
			>
				Modify this tile
			</button>

			<button
				disabled={!tileToAdd['name'] || !tileK}
				on:click={() => {
					toolbox = [
						...toolbox,
						{
							id: Math.random().toString(16).slice(2),
							comp: tileK,
							name: tileToAdd['name'],
							options: _.cloneDeep(tileToAdd.options)
						}
					];
					toolbox = toolbox;
					drawerStore.close();
				}}
				class="variant-soft-primary btn"
			>
				Clone this tile
			</button>

			<button
				disabled={!tileToAdd['name'] || !tileK}
				on:click={() => {
					toolbox.splice($drawerStore.meta, 1);
					toolbox = toolbox;
					drawerStore.close();
				}}
				class="variant-soft-primary btn"
			>
				Remove this tile
			</button>
		</div>
	{/if}
</Drawer>
