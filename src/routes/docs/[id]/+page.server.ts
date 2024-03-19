export const load = async ({ params }) => ({
	doc: await fetch(`https://tizudev.vercel.app/api/uniuiDocs?id=${params.id}&v=4`).then((res) => res.text()),
	docs: await fetch(`https://tizudev.vercel.app/api/uniuiDocs?v=4`).then((res) => res.json())
});
