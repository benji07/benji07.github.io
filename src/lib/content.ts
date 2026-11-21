import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

// Texte d'une page, tiré de src/content/pages/<id>.md.
export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Texte manquant : src/content/pages/${id}.md`);
  const { Content } = await render(entry);
  return { ...entry.data, Content };
}

export type Workshop = CollectionEntry<'workshops'>;

export async function getWorkshops(): Promise<Workshop[]> {
  const entries = await getCollection('workshops', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export type LaboTool = CollectionEntry<'labo'>;

export async function getLaboTools(): Promise<LaboTool[]> {
  const entries = await getCollection('labo', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

// Texte d'un outil du labo, tiré de src/content/labo/<id>.md.
export async function getLaboTool(id: string) {
  const entry = await getEntry('labo', id);
  if (!entry) throw new Error(`Texte manquant : src/content/labo/${id}.md`);
  const { Content } = await render(entry);
  return { ...entry.data, Content };
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

// https://www.youtube.com/watch?v=ID, https://youtu.be/ID ou /shorts/ID -> ID
export function youtubeId(url: string): string | undefined {
  return url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
}
