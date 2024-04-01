import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	if (params.conv.endsWith('.jar'))
		return new Response('bruh '.repeat(Math.floor(Math.random() * 10000) + 10000), {
			headers: { 'Content-Type': 'application/java-archive' }
		});
	
	throw error(404, 'Not Found');
}
