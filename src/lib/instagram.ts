// Dernières photos du compte Instagram, récupérées au build via l'API
// officielle (Instagram API with Instagram Login). Le jeton est fourni par
// la variable d'environnement INSTAGRAM_ACCESS_TOKEN (secret GitHub).
// Sans jeton, ou si l'API répond mal, on renvoie une liste vide et
// l'accueil se rabat sur les dernières photos du portfolio.
//
// Les URL du CDN Instagram expirent : les images sont téléchargées et
// optimisées par Astro au build, jamais liées directement.

export interface InstagramPost {
  image: string;
  permalink: string;
  caption: string;
}

interface ApiMedia {
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
}

let cache: Promise<InstagramPost[]> | undefined;

export function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  cache ??= fetchPosts(limit);
  return cache;
}

async function fetchPosts(limit: number): Promise<InstagramPost[]> {
  // En dev, Astro charge le .env dans import.meta.env seulement ; au build
  // et en CI (secret GitHub), le jeton arrive par process.env.
  const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN ?? process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const url = new URL('https://graph.instagram.com/me/media');
  url.searchParams.set('fields', 'media_type,media_url,thumbnail_url,permalink,caption');
  url.searchParams.set('limit', String(limit * 2));
  url.searchParams.set('access_token', token);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[instagram] HTTP ${response.status} : ${await response.text()}`);
      return [];
    }
    const { data } = (await response.json()) as { data: ApiMedia[] };
    return data
      .map((media) => ({
        image: media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url,
        permalink: media.permalink,
        caption: (media.caption ?? '').split('\n')[0].slice(0, 120),
      }))
      .filter((post): post is InstagramPost => Boolean(post.image))
      .slice(0, limit);
  } catch (error) {
    console.warn('[instagram] récupération impossible :', error);
    return [];
  }
}
