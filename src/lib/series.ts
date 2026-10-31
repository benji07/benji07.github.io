import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Series = CollectionEntry<'series'>;
export type SeriesPhoto = Series['data']['photos'][number] & { slug: string };

export const FORMAT_LABELS: Record<Series['data']['format'], string> = {
  '135': '135',
  '6x6': '6×6',
  polaroid: 'Polaroid',
};

// Les séries publiées, la plus récente d'abord. Les brouillons restent
// visibles en `astro dev` pour pouvoir les relire.
export async function getSeries(): Promise<Series[]> {
  const entries = await getCollection('series', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Slug d'une photo = nom de son fichier sans extension (./07.jpg -> 07).
function fileSlug(file: string): string {
  const name = file.split('/').pop() ?? '';
  return name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getPhotos(series: Series): SeriesPhoto[] {
  const seen = new Map<string, number>();
  return series.data.photos.map((photo, index) => {
    let slug = fileSlug(photo.file) || String(index + 1);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count + 1}`;
    return { ...photo, slug };
  });
}

export function getCover(series: Series): ImageMetadata {
  return series.data.cover ?? series.data.photos[0].src;
}

export function seriesMeta(series: Series): string {
  const { format, year, film } = series.data;
  return [FORMAT_LABELS[format], year, film].filter(Boolean).join(' · ');
}

export function photoAlt(series: Series, photo: SeriesPhoto, index: number): string {
  return photo.alt ?? photo.title ?? `${series.data.title}, photo ${index + 1}`;
}
