# benjamin.leveque.me — guide pour l'agent

Site perso statique (Astro 7), en français, déployé sur GitHub Pages par
`.github/workflows/deploy.yml`. Design minimaliste : fond blanc, Geist et
Geist Mono, un seul accent bleu (#2346d8) réservé aux liens. Pas de
dégradé, pas de fond crème.

## Ajouter une série au portfolio

C'est le cas le plus fréquent. Suis [docs/PORTFOLIO.md](docs/PORTFOLIO.md) :
un dossier `src/content/series/<slug>/` avec un `index.md` et les images.
Ne touche ni aux layouts, ni aux composants, ni aux autres séries, sauf
demande explicite. N'invente jamais de métadonnées (appareil, pellicule,
tirage) : laisse le champ vide si l'info n'est pas fournie.

## À ne pas faire

- Ne crée aucune page sous `/food/`, `/photo-explore/` ou `/film-vault/` :
  ce sont d'autres dépôts servis sur le même domaine.
- Ne modifie pas le contenu des articles de `src/content/blog/` : ce sont
  des archives.
- N'affiche pas d'adresse e-mail : le contact passe par Instagram.

## Vérifier

`npm run build` doit passer avant tout commit.
