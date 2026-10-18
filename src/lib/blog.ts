import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'> & { slug: string; date: Date };

// 2010-06-13-doctrine-1-data-hydrators -> { date, slug: doctrine-1-data-hydrators }
function parseId(id: string) {
  const match = id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!match) {
    throw new Error(`Nom d'article invalide : ${id} (attendu AAAA-MM-JJ-slug.md)`);
  }
  const [, y, m, d, slug] = match;
  return { date: new Date(`${y}-${m}-${d}T00:00:00Z`), slug };
}

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog');
  return entries
    .map((entry) => ({ ...entry, ...parseId(entry.id) }))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
