import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const { id } = params;

	const gist = await fetch('https://api.github.com/gists/' + id).then((res) => res.json());

	if (!('ui.json' in (gist?.files || {}))) throw error(404, 'Not found');

	const ui = await fetch(gist.files['ui.json'].raw_url).then((res) => res.text());
	return { ui: atob(ui), hub: gist.html_url };
};
