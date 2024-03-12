import TBlank from './TBlank.svelte';
import TButton from './TButton.svelte';
import TSlot from './TSlot.svelte';
import options from './options';

export default {
	Blank: { comp: TBlank },
	Button: {
		comp: TButton,
		options: options.Button.options,
		initialOpts: options.Button.initialOpts
	},
	Slot: {
		comp: TSlot,
		options: options.Slot.options,
		initialOpts: options.Slot.initialOpts
	}
} as Record<
	string,
	{
		comp: ConstructorOfATypedSvelteComponent;
		options?: Record<string, { placeholder?: any; description: string; type: string; meta?: any }>;
		initialOpts?: any;
	}
>;
