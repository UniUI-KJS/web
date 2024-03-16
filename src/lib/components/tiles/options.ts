export default {
	Button: {
		options: {
			Disabled: { description: 'Whether the button should be in a visually disabled state', type: 'boolean' },
			Accent: {
				description: 'The accent color that the button should use',
				type: 'color',
				meta: ['#c6c6c6', '#d24b50', '#3c89c3', '#5ec24c']
			},
			Icon: {
				description: 'The icon that the button should use (8x8)',
				type: 'draw',
				meta: {
					Cross: '8x8;1100001111100111011111100011110000111100011111101110011111000011',
					Check: '8x8;0000001100000111000011101101110011111000011100000010000000000000',
					Trash: '8x8;0011100011111110000000000111110001010100010101000111110000000000',
					Refresh: '8x8;0111101011111110110011101101111011000000111111100111110000000000',
					ArrowN: '8x8;0001000000111000011111001111111000111000001110000011100000111000',
					ArrowE: '8x8;0000100000001100111111101111111111111110000011000000100000000000',
					ArrowS: '8x8;0011100000111000001110000011100011111110011111000011100000010000',
					ArrowW: '8x8;0001000000110000011111111111111101111111001100000001000000000000'
				}
			},
			IconStyle: { description: 'How the icon should be rendered', type: 'select', meta: ['shadow', 'dark', 'light'] },
			Size: {
				description: 'How large the button should be',
				type: 'size',
				meta: [
					[1, 7],
					[1, 2]
				]
			}
		},
		initialOpts: {
			Disabled: false,
			Accent: '#3c8dc3',
			Icon: Array(8)
				.fill(null)
				.map(() => Array(8).fill(false)),
			IconStyle: 'shadow',
			Size: [1, 1]
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
