import { interfacesStore } from '$lib';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageServerLoadEvent } from './$types.js';
import { base } from '$app/paths';

export const load = async (ctx) => {
	const {
		url: { searchParams }
	} = ctx;

	if (searchParams.get('error')) throw error(400, searchParams.get('error_description')?.toString() ?? 'Unknown error');

	const authCode = searchParams.get('code');
	if (!authCode) throw error(400, 'No auth code');

	const task = searchParams.get('task');
	if (!task || !Object.keys(tasks).includes(task)) throw error(404, 'Task not found');

	return await tasks[task]({ ...ctx, authCode });
};

const tasks: Record<string, (p: PageServerLoadEvent & { authCode: string }) => Promise<any>> = {
	export: async ({ url: { searchParams }, authCode, fetch, cookies }) => {
		const refCode = searchParams.get('ref');
		if (!refCode) throw error(400, 'No ref code');

		const res = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				client_id: process.env.GH_CLIENT,
				client_secret: process.env.GH_SECRET,
				code: authCode
			})
		}).then(async (res) => Object.fromEntries(new URLSearchParams(await res.text())));

		const accessToken = res.access_token;
		if (!accessToken) throw error(400, 'No access token');

		const scopes = res.scope?.split(',') ?? [];
		if (!scopes.includes('gist')) throw error(400, 'No gist scope');

		cookies.set('uniui-token', accessToken, {
			path: '/',
			sameSite: 'strict',
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			httpOnly: false
		});
		throw redirect(302, `${base}/editor/${refCode}?welcomer=${encodeURIComponent(`Signed in - try publishing again!`)}`);
	}
};
