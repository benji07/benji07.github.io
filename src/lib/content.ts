import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

// Texte rendu d'une entrée, tiré de src/content/<collection>/<id>.md.
async function getText<C extends 'pages' | 'labo'>(collection: C, id: string) {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`Texte manquant : src/content/${collection}/${id}.md`);
  const { Content } = await render(entry);
  return { ...entry.data, Content };
}

// Tri des entrées par ordre, puis par titre.
const byOrder = (a: { data: { order: number; title: string } }, b: { data: { order: number; title: string } }) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

export const getPage = (id: string) => getText('pages', id);

export type Workshop = CollectionEntry<'workshops'>;

// Brouillons visibles en dev seulement.
export async function getWorkshops(): Promise<Workshop[]> {
  const entries = await getCollection('workshops', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort(byOrder);
}

export type LaboTool = CollectionEntry<'labo'>;

export async function getLaboTools(): Promise<LaboTool[]> {
  return (await getCollection('labo')).sort(byOrder);
}

export const getLaboTool = (id: string) => getText('labo', id);

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

// https://www.youtube.com/watch?v=ID, https://youtu.be/ID ou /shorts/ID -> ID
export function youtubeId(url: string): string | undefined {
  return url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
}
