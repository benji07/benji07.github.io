# Ajouter une série au portfolio

Une série = **un dossier** dans `src/content/series/`. Le nom du dossier
devient l'URL : `src/content/series/lyon-la-nuit/` → `/portfolio/lyon-la-nuit/`.

Avec Claude Code, `/nouvelle-serie <dossier>` fait tout ça à partir d'un
dossier de photos : il copie et numérote les images, pose les questions sur
la série et écrit l'`index.md` (voir `.claude/skills/nouvelle-serie/`).

```
src/content/series/lyon-la-nuit/
├── index.md      ← titre, métadonnées, liste des photos, texte de présentation
├── 01.jpg
├── 02.jpg
└── 03.jpg
```

## Les images

- Passe-les dans `node scripts/compress-photo.mjs <source> <destination.jpg>` :
  JPEG, 2500 px max sur le grand côté, qualité 80 (500 à 800 ko par photo).
  Un export en qualité maximale pèse ~2 Mo, trop lourd pour le dépôt. Astro
  génère ensuite les tailles plus petites au build.
- Le nom du fichier devient l'URL de la photo : `07.jpg` →
  `/portfolio/lyon-la-nuit/07/`. Évite de renommer un fichier déjà publié.
  Sur la page de la série, un clic ouvre la photo dans une modale qui prend
  cette adresse ; la page de la photo sert aux liens directs et au partage.
- Chaque photo garde son format d'origine : pas de recadrage, pas de bordure
  ajoutée. Pour les Polaroid, scanne le cliché avec son cadre blanc.

## Le fichier `index.md`

```yaml
---
title: "Lyon la nuit"
format: "135"            # 135 | 6x6 | polaroid — une série n'a qu'un format (non affiché)
year: "Novembre 2025"    # texte affiché sous le titre : mois et année, ou l'année seule
film: "Kodak Portra 800" # facultatif
date: 2025-11-02         # jour de prise de vue (ou 1er du mois) : ordonne les séries, la plus récente d'abord
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
    date: "2 novembre 2025"         # seulement si différente de la série
    alt: "Description de l'image pour les lecteurs d'écran"
  - src: ./03.jpg
---

Un ou deux paragraphes qui présentent la série : où, pourquoi, ce qu'elle
raconte. Inutile de rappeler la date, elle est déjà sous le titre.

Ils s'affichent à côté des photos sur la page de la série.
```

Le schéma est validé au build : un champ manquant ou une image introuvable fait
échouer le build avec un message qui pointe le problème.

## Vérifier avant de pousser

```bash
npm run dev     # http://localhost:4321/portfolio/
npm run build   # échoue si index.md est mal rempli
```
