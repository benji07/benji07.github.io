import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

// Texte rendu d'une entrée, tiré de src/content/<collection>/<id>.md.
async function getText<C extends 'pages' | 'labo'>(collection: C, id: string) {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`Texte manquant : src/content/${collection}/${id}.md`);
  const { Content } = await render(entry);
  return { ...entry.data, Content };
}

// Entrées publiées (brouillons visibles en dev), triées par ordre puis titre.
async function getPublished<C extends 'workshops' | 'labo'>(collection: C) {
  const entries = await getCollection(collection, ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export const getPage = (id: string) => getText('pages', id);

export type Workshop = CollectionEntry<'workshops'>;

export const getWorkshops = (): Promise<Workshop[]> => getPublished('workshops');

export type LaboTool = CollectionEntry<'labo'>;

export const getLaboTools = (): Promise<LaboTool[]> => getPublished('labo');

export const getLaboTool = (id: string) => getText('labo', id);

// Un outil en brouillon n'est visible qu'en dev : en production, sa page
// redirige vers le sommaire.
export async function isLaboDraft(id: string) {
  return !import.meta.env.DEV && (await getEntry('labo', id))?.data.draft === true;
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

// https://www.youtube.com/watch?v=ID, https://youtu.be/ID ou /shorts/ID -> ID
export function youtubeId(url: string): string | undefined {
  return url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
}
