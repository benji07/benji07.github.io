---
name: nouvelle-serie
description: Crée une série photo du portfolio à partir d'un dossier d'images — copie et numérote les photos dans src/content/series/<slug>/, pose les questions sur le sujet puis écrit l'index.md. À utiliser quand l'utilisateur fournit un dossier de photos à publier, demande « ajoute une série », « crée une série avec ce dossier », ou tape /nouvelle-serie <dossier>.
argument-hint: <dossier-des-photos>
---

# Créer une série photo

Argument : le chemin du dossier source ($ARGUMENTS). S'il manque, demande-le.

La référence est [docs/PORTFOLIO.md](../../../docs/PORTFOLIO.md) et le schéma
`series` de `src/content.config.ts` : relis-les avant de commencer, ils
priment sur ce skill en cas d'écart.

Règles du dépôt (CLAUDE.md) à respecter tout du long :

- Ne touche qu'au dossier `src/content/series/<slug>/` : ni layouts, ni
  composants, ni autres séries.
- **N'invente jamais de métadonnées** (appareil, pellicule, tirage, date de
  prise de vue, titre de photo). Un champ sans info fournie est omis, pas
  deviné. Les EXIF d'un scan décrivent le scanner, pas l'appareil : ne les
  utilise pas pour `camera`.
- Le dossier source n'est jamais modifié : on copie, on ne déplace pas.

## 1. Inventaire du dossier

1. Liste les images du dossier (jpg, jpeg, png, tif, tiff, heic, webp), triées
   par nom. Ignore les fichiers cachés et le reste ; signale-les.
2. Pour chaque image, relève dimensions et poids :
   `sips -g pixelWidth -g pixelHeight "<fichier>"` et `du -h`.
3. Regarde les images (outil Read) pour comprendre le sujet et pouvoir
   proposer des textes `alt`. Au-delà d'une vingtaine, regarde-en un
   échantillon et les autres seulement pour les `alt`.
4. Déduis le format probable à partir des proportions, sans trancher seul :
   carré (≈1:1) → `6x6` ; cadre blanc avec bande plus large en bas → `polaroid` ;
   ≈3:2 → `135`. Si les proportions sont mélangées, signale-le : une série n'a
   qu'un format.

Présente un résumé court : nombre de photos, format probable, images trop
grandes (> 2500 px sur le grand côté) ou pas en JPEG.

## 2. Questions sur la série

Pose les questions en une ou deux fois, pas une par message.

Avec AskUserQuestion (choix fermés) :

- **Format** : `135`, `6x6`, `polaroid` — mets en premier celui déduit des
  proportions, avec « (Recommandé) ».
- **Publication** : en ligne (`draft: false`) ou brouillon (`draft: true`).
- **Ordre** : ordre alphabétique des fichiers, ou ordre que l'utilisateur
  va donner.
- **Redimensionnement** (seulement si des images dépassent 2500 px ou ne sont
  pas en JPEG) : convertir en JPEG ~2500 px qualité 85, ou copier tel quel.

En texte libre, dans un même message :

- **Titre** de la série.
- **Année** affichée (prise de vue).
- **Pellicule** de la série (facultatif).
- **Le sujet** : où, quand, pourquoi, ce que la série raconte. Quelques notes
  suffisent ; c'est la matière du texte de présentation.
- **Infos par photo** (facultatif) : titre, appareil, pellicule différente,
  tirage, date, description — en référence au nom de fichier d'origine.
- **Couverture** (facultatif) : quelle photo, sinon la première.

Propose ensuite le **slug** (minuscules, sans accents, mots séparés par des
tirets, tiré du titre) et fais-le valider. Vérifie que
`src/content/series/<slug>/` n'existe pas déjà ; s'il existe, demande un autre
slug, n'écrase rien.

## 3. Copie des images

Dans `src/content/series/<slug>/`, numérote sur deux chiffres dans l'ordre
choisi : `01.jpg`, `02.jpg`… (trois chiffres au-delà de 99 photos). Le nom
devient l'URL de la photo, d'où la numérotation neutre.

- Copie simple : `cp "<source>" "src/content/series/<slug>/01.jpg"` (extension
  en minuscules, `.jpeg` → `.jpg`).
- Conversion / redimensionnement, si validé :
  `sips -s format jpeg -s formatOptions 85 -Z 2500 "<source>" --out "src/content/series/<slug>/01.jpg"`
  (`-Z` ne fait que réduire : une image plus petite reste à sa taille).
- Jamais de recadrage ni de bordure.

Garde la correspondance nom d'origine → numéro : elle sert pour les infos par
photo et pour le récapitulatif final.

## 4. Le fichier index.md

```yaml
---
title: "<titre>"
format: "<135|6x6|polaroid>"
year: <année>
film: "<pellicule>"        # omis si non fourni
date: <AAAA-MM-JJ>         # date de publication : aujourd'hui par défaut
cover: ./<nn>.jpg          # omis si c'est la première photo
draft: <true|false>
photos:
  - src: ./01.jpg
    alt: "<texte alternatif>"
  - src: ./02.jpg
    title: "<titre fourni>"
    camera: "<appareil fourni>"
    alt: "<texte alternatif>"
---

<texte de présentation>
```

- Pour chaque photo, n'écris que les champs fournis par l'utilisateur, plus
  `alt`.
- `alt` : une phrase factuelle sur ce qu'on voit (« Une femme traverse un pont
  sous la pluie, de dos »), sans interprétation ni noms propres que
  l'utilisateur n'a pas donnés.
- Texte de présentation : un ou deux paragraphes en français, à la première
  personne, ton sobre, rédigés à partir des notes de l'utilisateur et
  uniquement d'elles. Pas de lieu, de date ou d'anecdote ajoutés.
- Montre l'index.md complet (au moins le texte et les `alt`) et demande
  validation avant de passer à la suite ; corrige si besoin.

## 5. Vérifier

```bash
npm run build
```

Si le build échoue, lis le message (champ manquant, image introuvable), corrige
l'index.md et relance. Ne commite pas sauf demande ; si l'utilisateur le
demande, le build doit être passé.

Termine par un récapitulatif court : chemin de la série, URL
`/portfolio/<slug>/`, nombre de photos, correspondance fichiers d'origine →
numéros, champs laissés vides, et `npm run dev` pour la prévisualiser.
