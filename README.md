# benjamin.leveque.me

Mon site perso : présentation, workshops de tirage couleur, portfolio de
photos argentiques et archives du blog (2009–2016).

Site statique [Astro](https://astro.build), déployé sur GitHub Pages par
GitHub Actions à chaque push sur `master` et chaque nuit (pour les photos
Instagram de l'accueil).

Tout le contenu est dans `src/content/`, en markdown ; les pages
(`src/pages/`) ne font que le mettre en forme.

| Contenu | Fichier |
| --- | --- |
| Textes des pages (accueil, workshop, portfolio, blog, 404) | `src/content/pages/<page>.md` |
| Workshops (`/workshop/<slug>/`) | un dossier par workshop dans `src/content/workshops/` |
| Portfolio (`/portfolio/<slug>/`) | un dossier par série dans `src/content/series/`, voir [docs/PORTFOLIO.md](docs/PORTFOLIO.md) |
| Projets listés sur l'accueil | `src/content/projects.yaml` |
| Blog (`/blog/`) | `src/content/blog/`, articles d'origine, non modifiés |
| Liens (Instagram, GitHub, LinkedIn) | `src/lib/site.ts` |

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
