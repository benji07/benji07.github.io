# Ajouter une série au portfolio

Une série = **un dossier** dans `src/content/series/`. Le nom du dossier
devient l'URL : `src/content/series/lyon-la-nuit/` → `/portfolio/lyon-la-nuit/`.

```
src/content/series/lyon-la-nuit/
├── index.md      ← titre, métadonnées, liste des photos, texte de présentation
├── 01.jpg
├── 02.jpg
└── 03.jpg
```

## Les images

- Exporte-les déjà compressées (JPEG, ~2500 px sur le grand côté, qualité 80
  à 85 suffisent). Astro génère ensuite les tailles plus petites au build.
- Le nom du fichier devient l'URL de la photo : `07.jpg` →
  `/portfolio/lyon-la-nuit/07/`. Évite de renommer un fichier déjà publié.
- Chaque photo garde son format d'origine : pas de recadrage, pas de bordure
  ajoutée. Pour les Polaroid, scanne le cliché avec son cadre blanc.

## Le fichier `index.md`

```yaml
---
title: "Lyon la nuit"
format: "135"            # 135 | 6x6 | polaroid — une série n'a qu'un format
year: 2025               # affiché sous le titre
film: "Kodak Portra 800" # facultatif
date: 2025-11-02         # date de publication : ordonne les séries, la plus récente d'abord
cover: ./03.jpg          # facultatif, sinon la première photo
draft: false             # true : visible en local (npm run dev), masquée en ligne
photos:
  - src: ./01.jpg
  - src: ./02.jpg
    title: "Quai Saint-Antoine"     # tout le reste est facultatif
    description: "Un texte libre, affiché sur la page de la photo."
    camera: "Nikon FM2, 50 mm"
    film: "Cinestill 800T"          # remplace la pellicule de la série
    print: "RA-4, 24×30"
    date: "novembre 2025"
    alt: "Description de l'image pour les lecteurs d'écran"
  - src: ./03.jpg
---

Un ou deux paragraphes qui présentent la série : où, quand, pourquoi.

Ils s'affichent à côté des photos sur la page de la série.
```

Le schéma est validé au build : un champ manquant ou une image introuvable fait
échouer le build avec un message qui pointe le problème.

## Vérifier avant de pousser

```bash
npm run dev     # http://localhost:4321/portfolio/
npm run build   # échoue si index.md est mal rempli
```
