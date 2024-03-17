<script lang="ts">
	import { ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte';
	import { flip } from 'svelte/animate';

	const moveItem = <T,>(data: T[], from: number, to: number): T[] => {
		const f = data.splice(from, 1)[0];
		data.splice(to, 0, f);
		return data;
	};

	export let pics: Record<string, string>;
	export let components: string[];
	export let title: string;
	export let rows: number;
</script>

<div {...$$restProps}>
	<div class="grid h-full w-full place-items-center">
		<svg viewBox="0 0 176 222" class="h-[95%] w-[95%]">
			{#each [...components].reverse() as c, i}
				<foreignObject width="256" height="256" x="0" y="0">
					<img src={pics[c]} alt={c} class="h-full w-full" style="image-rendering: pixelated;" />
				</foreignObject>
			{/each}

			<text x={8} y={13} fill="#3F3F3F" font-size="10" class="font-[Minecraft]"> {title} </text>
			{#if rows > 0}
				<text x={8} y={rows * 18 + 27} fill="#3F3F3F" font-size="10" class="font-[Minecraft]"> Inventory </text>
			{/if}
		</svg>
	</div>

	<div class="fixed bottom-2 left-2 right-2 flex flex-col gap-1 lg:bottom-8 lg:left-8 lg:right-auto lg:w-96">
		{#each components as c, i (c)}
			<div class="group card flex items-center justify-between p-1 pl-4" animate:flip={{ duration: 300 }}>
				{c}

				<div class="flex gap-1 opacity-0 transition-[opacity] duration-75 group-hover:opacity-100">
					<button class="variant-soft-primary btn-icon" disabled={i == 0} on:click={() => (components = moveItem(components, i, i - 1))}>
						<ChevronUpIcon class="size-4" />
					</button>
					<button
						class="variant-soft-primary btn-icon"
						disabled={i == components.length - 1}
						on:click={() => (components = moveItem(components, i, i + 1))}
					>
						<ChevronDownIcon class="size-4" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
