import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getPosts } from '../lib/blog';
import { SITE } from '../lib/site';

// Flux conservé à son ancienne adresse pour les lecteurs RSS déjà abonnés.
export async function GET(context: APIContext) {
  const posts = await getPosts();
  const container = await AstroContainer.create();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      return {
        title: post.data.title,
        pubDate: post.date,
        link: `/blog/${post.slug}/`,
        content: await container.renderToString(Content),
      };
    }),
  );
  return rss({
    title: SITE.name,
    description: 'Archives du blog (2009–2016)',
    site: context.site!,
    items,
    customData: '<language>fr</language>',
  });
}
