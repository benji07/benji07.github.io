import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

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

// Textes des pages (accueil, portfolio, blog…) : un fichier markdown par page,
// le corps est le texte affiché, le frontmatter le titre et la description.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const media = ({ image }: { image: () => any }) =>
  z.object({ src: image(), caption: z.string().optional(), alt: z.string().optional() });

// Un workshop = un dossier src/content/workshops/<slug>/ avec son index.md
// (et ses images). Le corps du markdown est le texte de la page.
const workshops = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/workshops' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Affiché sur l'accueil et dans la liste des workshops.
      summary: z.string(),
      // Ligne d'infos pratiques sous le résumé.
      infos: z.string().optional(),
      order: z.number().default(0),
      draft: z.boolean().default(false),
      // Lien de réservation (cal.com…). Sans lien, le bouton renvoie vers Instagram.
      booking: z.string().url().optional(),
      // Lien YouTube, ou chemin d'une vidéo placée dans public/.
      video: z.string().optional(),
      setup: z.array(media({ image })).default([]),
      prints: z.array(media({ image })).default([]),
    }),
});

// Autres projets listés sur l'accueil.
const projects = defineCollection({
  loader: file('./src/content/projects.yaml'),
  schema: z.object({
    name: z.string(),
    hint: z.string(),
    url: z.string().url(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, series, pages, workshops, projects };
