export default {
	Button: {
		options: {
			Disabled: { description: 'Whether the button should be in a visually disabled state', type: 'boolean' },
			Accent: {
				description: 'The accent color that the button should use',
				type: 'color',
				meta: ['#c6c6c6', '#d24b50', '#3c89c3', '#5ec24c']
			},
			Icon: { description: 'The icon that the button should use (8x8)', type: 'draw' },
			IconStyle: { description: 'How the icon should be rendered', type: 'select', meta: ['shadow', 'dark', 'light'] },
			Size: {
				description: 'How large the button should be',
				type: 'size',
				meta: [
					[1, 7],
					[1, 2]
				]
			},
			MultiMode: {
				description: 'The multi mode, used for split buttons and similar',
				type: 'select',
				meta: ['single', 'left', 'center', 'right']
			}
		},
		initialOpts: {
			Disabled: false,
			Accent: '#3c8dc3',
			Icon: Array(8)
				.fill(null)
				.map(() => Array(8).fill(false)),
			IconStyle: 'shadow',
			Size: [1, 1],
			MultiMode: 'single'
		}
	},

	Slot: {
		options: {
			Style: {
				description:
					'The style that the slot should use\n' +
					'- default: A normal slot, just like in the inventory\n' +
					'- output: A slot used as an output, like in the crafting grid',
				type: 'select',
				meta: ['default', 'output']
			},
			Icon: { description: 'The icon that the slot should use (optional, 16x16) - see armor slots in inventory', type: 'draw' }
		},
		initialOpts: {
			Style: 'default',
			Icon: Array(16)
				.fill(null)
				.map(() => Array(16).fill(false))
		}
	}
};
