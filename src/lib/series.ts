import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Series = CollectionEntry<'series'>;
export type SeriesPhoto = Series['data']['photos'][number] & { slug: string };

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

// Lignes affichées sous le titre d'une série : l'année, puis la pellicule.
export function seriesMeta(series: Series): string[] {
  const { year, film } = series.data;
  return [String(year), film].filter((line): line is string => Boolean(line));
}

export function photoAlt(series: Series, photo: SeriesPhoto, index: number): string {
  return photo.alt ?? photo.title ?? `${series.data.title}, photo ${index + 1}`;
}

export function photoCounter(series: Series, index: number): string {
  return `${index + 1} / ${series.data.photos.length}`;
}

// Titre de la page d'une photo (et de l'onglet quand la modale l'affiche).
export function photoTitle(series: Series, photo: SeriesPhoto, index: number): string {
  return photo.title ?? `${series.data.title}, ${photoCounter(series, index)}`;
}

// Détails affichés à côté de la photo ; les champs vides sont omis.
export function photoFacts(series: Series, photo: SeriesPhoto): [string, string][] {
  const facts = [
    ['Appareil', photo.camera],
    ['Pellicule', photo.film ?? series.data.film],
    ['Tirage', photo.print],
    ['Date', photo.date ?? String(series.data.year)],
  ];
  return facts.filter((fact): fact is [string, string] => Boolean(fact[1]));
}
