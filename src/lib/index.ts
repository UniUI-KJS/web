import { localStorageStore } from '@skeletonlabs/skeleton';
import { linear } from 'svelte/easing';

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export function darken(node: Element, { delay = 0, duration = 400, easing = linear } = {}) {
	return {
		delay,
		duration,
		easing,
		css: (t: number) => `--tw-brightness: brightness(${t})`
	};
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export const interfacesStore = localStorageStore<
	{
		id: string;
		name: string;
		toolbox: { id: string; name: string; comp: string; options: Record<string, any> }[];
		components: Record<string, ([string, number] | null)[]>;
		rows: number;
		greedyExport: boolean;
		modifyPlayerSlots: boolean;
		images: Record<string, string>;
		interactions: Record<number, string>;
	}[]
>('uniuiInterfaces', []);
