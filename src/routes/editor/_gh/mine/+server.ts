import { error } from '@sveltejs/kit';

export const GET = async ({ fetch, cookies }) => {
	if (!cookies.get('uniui-token')) return new Response('Unauthorized', { status: 401 });

	let gists = await fetch('https://api.github.com/gists', {
		headers: { Authorization: 'Bearer ' + cookies.get('uniui-token') }
	}).then((res) => res.json());
	if (!gists.length) throw error(404, 'User not found');

	const returnValue = gists
		.map((gist: any) => {
			const files = gist?.files || {};

			if (!('ui.json' in files)) return;
			return Object.keys(files)
				.map((fileName) => {
					const regex = /!> (.*?) - a UniUI interface <!/;
					const match = fileName.match(regex);
					if (match && match.length === 2)
						return {
							id: gist.id,
							name: match[1].trim()
						};

					return false;
				})
				.filter(Boolean)[0];
		})
		.filter(Boolean);

	return new Response(
		JSON.stringify({
			user: {
				name: gists[0].owner.login,
				avatar: gists[0].owner.avatar_url,
				url: gists[0].owner.html_url
			},

			interfaces: returnValue
		})
	);
};
