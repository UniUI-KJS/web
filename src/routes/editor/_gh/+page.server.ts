import { error, redirect } from '@sveltejs/kit';

export const load = async ({ url: { searchParams }, fetch, cookies }) => {
	if (searchParams.get('error')) throw error(400, searchParams.get('error_description')?.toString() ?? 'Unknown error');

	const authCode = searchParams.get('code');
	if (!authCode) {
		const baseUrl = 'https://github.com/login/oauth/authorize';
		const params = new URLSearchParams({
			scope: 'gist',
			client_id: process.env.GH_CLIENT ?? ''
		});
		throw redirect(302, `${baseUrl}?${params.toString()}`);
	}

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
	if (!scopes.includes('gist')) throw error(400, 'Invalid scope');

	cookies.set('uniui-token', accessToken, {
		path: '/',
		sameSite: 'strict',
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		httpOnly: false
	});
};
