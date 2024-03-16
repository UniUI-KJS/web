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

/* --- */

export function tdrawFrom(input: string): boolean[][] {
	const [sizeStr, drawingStr] = input.split(';');

	const [w, h] = sizeStr.split('x');
	if (!w || !h || +w != +h || +w > 32 || +h > 32) return [];

	let drawing = Array(+w)
		.fill(null)
		.map(() => Array(+h).fill(false));
	drawingStr.split('').forEach((char, i) => (drawing[Math.floor(i / +w)][i % +w] = char == '1'));

	return drawing;
}

export function tdrawTo(input: boolean[][], { w, h } = { w: 0, h: 0 }): string {
	return `${w}x${h};${input.map((row) => row.map((char) => (char ? '1' : '0')).join('')).join('')}`;
}
