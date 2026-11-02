import type { APIRoute } from 'astro';
import { getSocialCards, socialCardSlug } from '~/utils/social-cards';
import { renderSocialCard } from '~/utils/render-social-card';

export async function getStaticPaths() {
	return (await getSocialCards()).map((card) => ({
		params: { card: socialCardSlug(card) },
		props: { card },
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const png = await renderSocialCard(props.card);
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
