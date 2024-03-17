<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { interfacesStore } from '$lib';
	import { toast } from 'svelte-sonner';
	import { blur, fly, slide } from 'svelte/transition';
	import Cookies from 'js-cookie';

	const newProj = async (e: SubmitEvent, projectId: string) => {
		const target = e.target as HTMLFormElement;
		target.button.disabled = true;

		const projectName = target.projectName.value;

		if ($interfacesStore.find((p) => p.id == projectId)) {
			target.button.disabled = false;
			return toast.error('Project with this name already exists');
		}

		$interfacesStore = [
			...$interfacesStore,
			{
				id: projectId,
				name: projectName,
				toolbox: [],
				components: { Default: Array(9 * (6 + 4)).fill(null) },
				rows: 3,
				greedyExport: false,
				modifyPlayerSlots: false,
				images: {},
				interactions: {}
			}
		];

		setTimeout(() => goto(`${base}/editor/${projectId}/`), 100);
	};

	let remoteInterfaces = fetch(base + '/editor/_gh/mine');
</script>

<svelte:head>
	<title>Projects [UniUI Editor]</title>
</svelte:head>

<p class="fixed bottom-4 left-4 max-w-[33%] text-balance text-surface-300" in:fly|global={{ x: 20, delay: 2000 }}>
	Note: UniUI editor is really opinionated. If you want to use your own UI style, feel free to build your own textures.
</p>
<p class="fixed bottom-4 right-4 max-w-[33%] text-balance text-surface-300" in:fly|global={{ x: -20, delay: 2100 }}>
	Drag and drop editor JSON to import. (todo)
	<!-- TODO: Drag and drop editor JSON to import -->
</p>

<div class="mx-auto h-full max-h-screen max-w-screen-md py-8 {$interfacesStore.length == 0 && 'flex flex-col justify-center'}">
	<div class="space-y-6 {$interfacesStore.length == 0 && 'flex flex-col *:mx-auto'}">
		<a href="{base}/" class="btn w-fit rounded-full hover:variant-soft" in:fly|global={{ x: 20, delay: 200 }}>
			<h1 class={$interfacesStore.length == 0 ? 'h1' : 'h3'}>UniUI</h1>
		</a>

		<!-- / -->

		<div class="flex gap-2">
			<form class="flex w-full gap-2" on:submit|preventDefault={(e) => newProj(e, Math.random().toString(36).substring(2))}>
				<input
					class="input"
					type="text"
					placeholder="My awesome interface"
					required
					id="projectName"
					autocomplete="off"
					spellcheck="false"
					in:fly|global={{ delay: 400, y: 20 }}
				/>
				<button class="variant-filled-primary btn" type="submit" id="button" in:fly|global={{ delay: 500, y: 20 }}>Create</button>
			</form>

			<!-- <div class="divider-vertical mx-0 my-2" in:fly|global={{ delay: 550, y: 20 }} />

			{#if $interfacesStore.some((p) => p.id == 'tutorial')}
				<a href="{base}/editor/tutorial/" class="variant-soft-primary btn" in:fly|global={{ delay: 600, y: 20 }}>Open tutorial</a>
			{:else}
				<form class="flex gap-2" on:submit|preventDefault={(e) => newProj(e, 'tutorial')}>
					<input class="hidden" type="text" id="projectName" value="tutorial" />
					<button class="variant-soft-primary btn" type="submit" id="button" in:fly|global={{ delay: 600, y: 20 }}>Open tutorial</button>
				</form>
			{/if} -->
		</div>

		<!-- / -->

		{#if $interfacesStore.length > 0}
			<div class="flex h-fit flex-col gap-2">
				{#each $interfacesStore as project, i}
					<div class="card flex items-center px-3" in:fly|global={{ delay: 700 + i * 50, y: 10 }}>
						<a href="{base}/editor/{project.id}/" class="grow py-3">
							{project.name}
						</a>

						<div
							class="my-1 flex gap-2 border-l border-[rgba(255,255,255,0.2)] pl-3 *:my-2"
							in:slide|global={{ axis: 'x', delay: 1000 + i * 20 }}
						>
							{#if project.origin}
								<a class="variant-soft-surface btn btn-sm mx-auto" href="{base}/editor/_gh/{project.origin}"> Origin </a>
							{/if}

							<button
								class="variant-soft-error btn btn-sm mx-auto"
								on:click={() =>
									toast.warning(`Delete interface '${project.name}'?`, {
										duration: 5 * 1000,
										description: 'This cannot be undone!',
										action: {
											label: 'Delete',
											onClick: () => ($interfacesStore = $interfacesStore.filter((p) => p.id != project.id))
										}
									})}
							>
								Delete
							</button>
						</div>
					</div>
				{/each}

				{#await remoteInterfaces then remote}
					{#if remote.ok}
						{#await remote.json() then me}
							<hr class="my-1" in:fly|global={{ delay: 1000, y: 10 }} />

							{#each me.interfaces as project, i}
								<div class="card flex items-center px-3" in:fly|global={{ delay: 1000 + i * 50, y: 10 }}>
									<a href="{base}/editor/_gh/{project.id}/" class="grow py-3">
										{project.name}
									</a>

									<div
										class="my-1 flex gap-2 border-l border-[rgba(255,255,255,0.2)] pl-3 *:my-2"
										in:slide|global={{ axis: 'x', delay: 1000 + i * 20 }}
									>
										<button
											class="variant-soft-error btn btn-sm mx-auto"
											on:click={() =>
												toast.warning(`Unpublish interface '${project.name}'?`, {
													duration: 5 * 1000,
													description: 'This cannot be undone!',
													action: {
														label: 'mhm!',
														onClick: () =>
															fetch('https://api.github.com/gists/' + project.id, {
																method: 'DELETE',
																headers: {
																	Authorization: 'Bearer ' + Cookies.get('uniui-token')
																}
															}).then((r) => {
																remoteInterfaces = fetch(base + '/editor/_gh/mine');
																if (r.ok)
																	toast.warning('Interface unpublished', {
																		description: 'Invalidated share link.'
																	});
																else
																	toast.error('Failed to unpublish interface.', {
																		description: 'Please check gists.github.com and manually unpublish.'
																	});
															})
													}
												})}
										>
											Unpublish
										</button>
									</div>
								</div>
							{:else}
								<p class="text-surface-300">(no interfaces published)</p>
							{/each}

							<button
								in:fly|global={{ delay: 1300, y: 10 }}
								class="variant-soft-surface btn btn-sm mx-auto w-fit"
								on:click={() => (Cookies.remove('uniui-token'), window.location.reload())}
							>
								Not {me.user.name}?
							</button>
						{/await}
					{:else}
						<button
							class="variant-soft-surface btn btn-sm mx-auto mt-1 w-fit"
							on:click={() => open(base + '/editor/_gh', '_blank', 'popup=1,width=300,height=500')}
							in:fly|global={{ delay: 1000, y: 10 }}
						>
							View my published interfaces
						</button>
					{/if}
				{/await}
			</div>
		{/if}
	</div>
</div>
