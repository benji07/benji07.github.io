# benjamin.leveque.me

Mon site perso : présentation, initiations au tirage couleur, portfolio de
photos argentiques et archives du blog (2009–2016).

Site statique [Astro](https://astro.build), déployé sur GitHub Pages par
GitHub Actions à chaque push sur `master` et chaque nuit (pour les photos
Instagram de l'accueil).

| Page | Source |
| --- | --- |
| `/` | `src/pages/index.astro` (textes) et `src/lib/site.ts` (liens, projets) |
| `/initiations/` | `src/pages/initiations.astro` et `src/content/initiations/index.md` (vidéo, photos) |
| `/portfolio/` | une série par dossier dans `src/content/series/`, voir [docs/PORTFOLIO.md](docs/PORTFOLIO.md) |
| `/blog/` | `src/content/blog/`, articles d'origine, non modifiés |

Les anciennes URL du blog Jekyll (`/mon-article.html`) redirigent vers
`/blog/mon-article/`, et le flux reste à `/rss.xml`.

Photos Instagram de l'accueil : voir [docs/INSTAGRAM.md](docs/INSTAGRAM.md).

## Développement

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build de production dans dist/
npm run preview  # sert le build
```
