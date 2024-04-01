<script>
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { ArrowDownIcon, Loader2Icon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import InViewport from './InViewport.svelte';
	import { base } from '$app/paths';

	let example = 2;
	let modName = '';
	let step = '';

	$: if (step == 'wait') setTimeout(() => (step = 'dl'), Math.random() * 10000 + 20000);
</script>

<svelte:head>
	<title>Project Pipedreams</title>
</svelte:head>

{#if modName == ''}
	<div class="container relative mx-auto flex h-full items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>
				Old Minecraft versions aren't dead. Important mods for packmakers are.
			</h1>

			<p in:fly|global={{ delay: 600, y: 20 }} class="h3 font-token">
				.. and it's time to fix that. Let's give devs the opportunity to use ANY mod on ANY version.
			</p>
		</div>

		<div class="fixed bottom-8" in:fly|global={{ delay: 800, y: 20 }}>
			<ArrowDownIcon class="size-12 animate-bounce" />
		</div>

		<div class="fixed bottom-2 size-48">
			<div in:fly|global={{ delay: 200, y: 20 }} class="img-bg" />
		</div>
	</div>

	<hr />
	<InViewport class="container relative mx-auto flex min-h-[60vh] items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>Have a look at the top 100 mods.</h1>

			<p in:fly|global={{ delay: 600, y: 20 }} class="h3 text-balance font-token">
				JEI, KubeJS, Mouse Tweaks, GeckoLib, or any of the other 96. I bet'cha like 60% of them got abandoned for older versions. For good
				reason. Mods are hard to maintain across different versions. Some mods don't support them at all, others fix bugs but don't add new
				features. Some only support 1.12.2 (and latest), others only support 1.16.5. The list goes on and on.
			</p>
		</div>

		<div class="fixed bottom-2 size-48">
			<div in:fly|global={{ delay: 200, y: 20 }} class="img-bg" />
		</div>
	</InViewport>

	<hr />
	<InViewport class="container relative mx-auto flex min-h-[60vh] items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>The fix: Project Pipedreams.</h1>

			<p in:fly|global={{ delay: 600, y: 20 }} class="h3 text-balance font-token">
				I spent the last 4 years of my life to create a conversion utility that converts mods to a different version. It does more than just
				changing the metadata. It actually fixes bugs that the conversion could cause. Powered by a fine-tuned algorithm that can write
				code, debug it, and automatically fix it, it's super fast and really effective. From my benchmarks, it's around 200x faster than
				manually porting! Throughout the last 4 years, the successful port rate has gone up from 20% to 99.97%.
			</p>
		</div>

		<div class="fixed bottom-2 size-48">
			<div in:fly|global={{ delay: 200, y: 20 }} class="img-bg" />
		</div>
	</InViewport>

	<hr />
	<InViewport class="container relative mx-auto flex min-h-[60vh] items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>??tryitandsee</h1>

			<p in:fly|global={{ delay: 600, y: 20 }} class="h3 font-token">Wanna use your favorite mod on your favorite version?</p>

			<div in:fly|global={{ delay: 800, y: 20 }}>
				<TabGroup class="max-w-96 text-balance">
					<Tab bind:group={example} name="tab1" value={0}>
						<svelte:fragment slot="lead">
							<img src="https://media.forgecdn.net/avatars/218/214/637010579670184115.png" alt="avatar" class="size-12 rounded-full" />
						</svelte:fragment>

						<span>KubeJS</span>
					</Tab>

					<Tab bind:group={example} name="tab2" value={1}>
						<svelte:fragment slot="lead">
							<img src="https://media.forgecdn.net/avatars/545/351/637878590194850929.png" alt="avatar" class="size-12 rounded-full" />
						</svelte:fragment>

						<span>EMI</span>
					</Tab>

					<Tab bind:group={example} name="tab3" value={2}>
						<svelte:fragment slot="lead">
							<img src="https://media.forgecdn.net/avatars/393/435/637588742363737916.png" alt="avatar" class="size-12 rounded-full" />
						</svelte:fragment>

						<span>Create</span>
					</Tab>

					<Tab bind:group={example} name="tab4" value={-1}>
						<svelte:fragment slot="lead">
							<div class="size-12" />
						</svelte:fragment>

						<span>.. your own!</span>
					</Tab>
					<!-- Tab Panels --->
					<svelte:fragment slot="panel">
						{#if example === 0}
							<p>You can successfully use the new syntax and create custom chest GUIs in 1.16.5!</p>
							<button on:click={() => (modName = 'KubeJS')} class="variant-filled-primary btn mx-auto mt-2 w-fit">
								Convert this mod
							</button>
						{:else if example === 1}
							<p>Use your favorite recipe trees in GTNH (a 1.7.10 pack!)</p>
							<button on:click={() => (modName = 'EMI')} class="variant-filled-primary btn mx-auto mt-2 w-fit"> Convert this mod </button>
						{:else if example === 2}
							<p>Create machines you've never dreamt of with copycats, trains and more. Now available in 1.12.2!</p>
							<button on:click={() => (modName = 'Create')} class="variant-filled-primary btn mx-auto mt-2 w-fit">
								Convert this mod
							</button>
						{:else if example === -1}
							<p>
								Soon available! We have to ensure that this feature can't be exploited before releasing it publicly. Thanks for your
								patience!
							</p>
						{/if}
					</svelte:fragment>
				</TabGroup>
			</div>
		</div>
	</InViewport>
{:else if step == 'dl'}
	<div class="container relative mx-auto flex h-full items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>That's it! Not even kidding.</h1>

			<a
				href="{base}/project-pipedreams/conv-{modName}-{Math.floor(Math.random() * 210983547) + 23023586}.jar"
				target="_blank"
				in:fly|global={{ delay: 600, y: 20 }}
				on:click={() => (step = 'rr')}
				class="variant-filled-primary btn mt-2 w-fit"
			>
				Download {modName}
			</a>
		</div>
	</div>
{:else if step == 'wait'}
	<div class="container relative mx-auto flex h-full items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>
				You'll be able to {modName} in just a moment.
			</h1>

			<p in:fly|global={{ delay: 800, y: 20 }}>This may take a few minutes. Sit back and relax, and keep this tab open.</p>
		</div>
	</div>

	<div class="card variant-soft-success absolute bottom-8 right-8 z-40 p-4">
		<Loader2Icon class="size-8 animate-spin text-success-500" />
	</div>
{:else if step == 'rr'}
	<iframe
		in:fly|global={{ delay: 2000, y: 20 }}
		class="pointer-events-none h-full w-full"
		tabindex="-999"
		src="https://www.youtube.com/embed/2GXlAJPa-KM?autoplay=1"
		title="thing"
		frameborder="0"
		allow="autoplay;"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
{:else}
	<div class="container relative mx-auto flex h-full items-center justify-center overflow-hidden">
		<div class="flex flex-col items-center space-y-10 text-center">
			<h1 class="h1 text-balance" in:fly|global={{ delay: 400, y: 20 }}>
				ooo, {modName}? Bet.
			</h1>

			<select class="select w-fit" in:fly|global={{ delay: 600, y: 20 }} on:change={() => (step = 'wait')}>
				<option>What do you wanna port this to?</option>

				<optgroup label="Forge">
					<option>1.20.1</option>
					<option>1.19.2</option>
					<option>1.18.2</option>
					<option>1.16.5</option>
					<option>1.12.2 (experimental)</option>
					<option>1.7.10 (experimental)</option>
				</optgroup>

				<optgroup label="Fabric">
					<option>1.20.1</option>
					<option>1.19.2 (experimental)</option>
					<option>1.18.2 (experimental)</option>
					<option>1.16.5 (experimental)</option>
				</optgroup>

				<optgroup label="Misc">
					<option>1.20.1 Spigot Plugin (experimental)</option>
					<option>1.20.1 Datapack (will break things)</option>
				</optgroup>
			</select>

			<p in:fly|global={{ delay: 800, y: 20 }}>
				Conversion will start once you select a version. It may take a few minutes, so sit back and relax. Do not close the tab.
			</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	.img-bg {
		@apply size-48 translate-y-40;
		@apply z-[-1] rounded-full blur-[50px];
		@apply bg-primary-500/10;
	}
</style>
