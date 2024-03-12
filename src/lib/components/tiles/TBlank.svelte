<script lang="ts">
	export let pos = { x: 0, y: 0 };
</script>

<g style="transform: translateX({pos.x}px) translateY({pos.y}px);" {...$$restProps}>
	<!-- background -->
	<rect width="18" height="18" fill="#C6C6C6" />
</g>
