import type { APIContext } from 'astro';
import { getPosts } from '../lib/blog';
import { redirectPage } from '../lib/redirect';

// Anciennes URL Jekyll (permalink: none) : /mon-article.html -> /blog/mon-article/
export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.slug } }));
}

export function GET({ params }: APIContext) {
  return redirectPage(`/blog/${params.slug}/`);
}
