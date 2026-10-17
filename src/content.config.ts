import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Archives du blog (2009–2016), migrées telles quelles depuis Jekyll.
// Le nom de fichier porte la date : 2010-06-13-doctrine-1-data-hydrators.md
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Ancien identifiant Disqus, inutilisé mais conservé dans les fichiers.
    old: z.number().optional(),
  }),
});

// Une photo d'une série. Seul `src` est obligatoire.
// `file` garde le chemin tel qu'écrit (./07.jpg) : il donne l'URL de la photo.
const photo = ({ image }: { image: () => any }) =>
  z.preprocess(
    (value) =>
      value && typeof value === 'object' && 'src' in value ? { ...value, file: String(value.src) } : value,
    z.object({
    src: image(),
    file: z.string(),
    title: z.string().optional(),
    // Texte libre affiché sur la page de la photo.
    description: z.string().optional(),
    camera: z.string().optional(),
    // Remplace la pellicule de la série pour cette photo.
    film: z.string().optional(),
    // Ex : "RA-4, 24×30".
    print: z.string().optional(),
    // Texte libre : "mars 2025", "été 2024"…
    date: z.string().optional(),
    alt: z.string().optional(),
    }),
  );

// Une série du portfolio = un dossier src/content/series/<slug>/ contenant
// un index.md et ses images. Le corps du markdown (1 ou 2 paragraphes)
// présente la série. Voir docs/PORTFOLIO.md.
const series = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/series' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Une série = un seul format.
      format: z.enum(['135', '6x6', 'polaroid']),
      year: z.union([z.number().int(), z.string()]),
      film: z.string().optional(),
      // Date de publication : ordonne les séries (la plus récente d'abord).
      date: z.coerce.date(),
      // Couverture de la liste ; par défaut, la première photo.
      cover: image().optional(),
      draft: z.boolean().default(false),
      photos: z.array(photo({ image })).min(1),
    }),
});

// Contenu de la page /initiations/ : vidéo, photos du setup, exemples de tirages.
// Chaque bloc est masqué tant qu'il est vide.
const initiations = defineCollection({
  loader: glob({ pattern: 'index.md', base: './src/content/initiations' }),
  schema: ({ image }) =>
    z.object({
      // Lien YouTube, ou chemin d'une vidéo placée dans public/ (ex : /videos/initiation.mp4).
      video: z.string().optional(),
      setup: z
        .array(z.object({ src: image(), caption: z.string().optional(), alt: z.string().optional() }))
        .default([]),
      prints: z
        .array(z.object({ src: image(), caption: z.string().optional(), alt: z.string().optional() }))
        .default([]),
    }),
});

export const collections = { blog, series, initiations };
