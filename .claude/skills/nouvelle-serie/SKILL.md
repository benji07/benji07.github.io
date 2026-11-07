---
name: nouvelle-serie
description: Crée une série photo du portfolio à partir d'un dossier d'images — copie et numérote les photos dans src/content/series/<slug>/, pose les questions sur le sujet puis écrit l'index.md. À utiliser quand l'utilisateur fournit un dossier de photos à publier, demande « ajoute une série », « crée une série avec ce dossier », ou tape /nouvelle-serie <dossier>.
argument-hint: <dossier-des-photos> [notes sur la série]
---

# Créer une série photo

Argument : le chemin du dossier source, souvent suivi de notes libres sur la
série ($ARGUMENTS). Si le chemin manque, demande-le. Les notes répondent déjà
à une partie des questions de l'étape 2 : ne repose pas ce qui y figure.

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
   proposer des textes `alt`. Les scans font souvent 20 Mo et plus : fais
   d'abord des aperçus réduits dans le scratchpad
   (`sips -s format jpeg -Z 1000 "<source>" --out "<scratchpad>/<nom>.jpg"`).
   Au-delà d'une vingtaine d'images, regarde-en un échantillon et les autres
   seulement pour les `alt`.
4. Déduis le format probable à partir des proportions, sans trancher seul :
   carré (≈1:1) → `6x6` ; cadre blanc avec bande plus large en bas → `polaroid` ;
   ≈3:2 → `135`. Si les proportions sont mélangées, signale-le : une série n'a
   qu'un format.

Présente un résumé court, en tableau : fichier, dimensions, poids, ce qu'on
voit. Puis le format probable et les images trop grandes (> 2500 px sur le
grand côté) ou pas en JPEG.

## 2. Questions sur la série

Pose les questions en une ou deux fois, pas une par message, et seulement
celles dont la réponse n'est pas déjà dans les notes.

Avec AskUserQuestion (choix fermés) :

- **Format** : `135`, `6x6`, `polaroid` — mets en premier celui déduit des
  proportions, avec « (Recommandé) ». Il n'est pas affiché sur le site mais
  reste obligatoire (il règle la mise en page des Polaroid).
- **Publication** : brouillon (`draft: true`, en premier : c'est le choix
  habituel) ou en ligne (`draft: false`).
- **Ordre** : ordre alphabétique des fichiers, ou ordre que l'utilisateur
  va donner.
- **Redimensionnement** (seulement si des images dépassent 2500 px ou ne sont
  pas en JPEG) : convertir en JPEG ~2500 px qualité 85 (recommandé), ou copier
  tel quel.

En texte libre, dans un même message :

- **Titre** de la série. S'il n'en a pas, propose-en deux ou trois avec le
  texte (étape 4).
- **Mois et année** de prise de vue (« Juillet 2026 ») : ils donnent `year`
  et `date`. L'utilisateur n'a souvent pas plus précis que le mois.
- **Appareil et objectif**. Son équipement habituel est le Canon A-1 avec un
  50 mm f/1.4 : propose-le, mais ne l'écris que s'il le confirme.
- **Pellicule** (facultatif), avec la sensibilité si elle n'est pas donnée
  (« Kodak Gold » → 200 ou 400 ?).
- **Le sujet** : où, quand, pourquoi, ce que la série raconte. Quelques notes
  suffisent.
- **Infos par photo** (facultatif) : titre, pellicule différente, tirage,
  date, description — en référence au nom de fichier d'origine.
- **Couverture** : quelle photo, sinon la première.
- **Personnes photographiées** : si le dossier ou les notes donnent un
  prénom, ne l'utilise (texte, `alt`, titre, slug) que si l'utilisateur le
  confirme ; sinon, aucune identité.

Noms d'appareils : vérifie la graphie exacte du modèle et signale l'écart
avec celle de l'utilisateur, sans la corriger d'office (« Canon A1 » →
« Canon A-1 » ; l'Olympus « mju II » s'écrit officiellement « μ[mju:]-II »).

Contexte extérieur (challenge, événement, lieu) : si l'utilisateur en parle,
cherche en ligne ou lis les documents qu'il fournit (fiches, captures, HEIC à
convertir avec `sips`). Ces documents servent de source pour le texte : ne
les ajoute pas à la série. Si la recherche ne donne rien, dis-le et demande
le nom exact plutôt que de deviner.

Propose ensuite le **slug** (minuscules, sans accents, mots séparés par des
tirets, tiré du titre) et fais-le valider. Vérifie que
`src/content/series/<slug>/` n'existe pas déjà ; s'il existe, demande un autre
slug, n'écrase rien.

## 3. Copie des images

Après validation du slug et de l'index.md (étape 4), dans
`src/content/series/<slug>/`, numérote sur deux chiffres dans l'ordre choisi :
`01.jpg`, `02.jpg`… (trois chiffres au-delà de 99 photos). Le nom devient
l'URL de la photo, d'où la numérotation neutre.

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
year: "<Mois AAAA>"        # texte affiché : « Juillet 2026 »
film: "<pellicule>"        # omis si non fourni
date: <AAAA-MM-JJ>         # jour de prise de vue : sert au tri des séries
cover: ./<nn>.jpg          # omis si c'est la première photo
draft: true
photos:
  - src: ./01.jpg
    camera: "<appareil fourni>"
    alt: "<texte alternatif>"
  - src: ./02.jpg
    title: "<titre fourni>"
    camera: "<appareil fourni>"
    alt: "<texte alternatif>"
---

<texte de présentation>
```

- `year` : le mois et l'année, en texte, majuscule initiale. L'année seule si
  c'est tout ce qu'on sait.
- `date` : le jour de prise de vue s'il est connu, sinon le 1er du mois. Les
  séries sont triées par ce champ, la plus récente d'abord.
- Pour chaque photo, n'écris que les champs fournis par l'utilisateur, plus
  `alt`. Pas de `date` par photo quand elle est la même que celle de la série :
  la fiche photo reprend `year`.
- `alt` : une phrase factuelle sur ce qu'on voit (« Une femme traverse un pont
  sous la pluie, de dos »), sans interprétation ni noms propres que
  l'utilisateur n'a pas validés.

### Texte de présentation

Un ou deux paragraphes en français, à la première personne. Propose **deux ou
trois pistes** (par exemple sobre, raconté avec de l'atmosphère, court) et
laisse l'utilisateur choisir ou mélanger avant d'écrire quoi que ce soit.

- La matière, c'est les notes de l'utilisateur, les documents qu'il a fournis
  et ce qu'on voit sur les photos (la neige, un filet orange, des graffitis).
  Tu peux broder sur l'ambiance à partir de ça.
- N'invente ni lieu, ni anecdote, ni ressenti précis, ni chiffre. Une
  incertitude de l'utilisateur (« 2006 ou 2008 ») se garde floue ou se
  vérifie, elle ne se tranche pas.
- Ne rappelle pas la date de prise de vue : elle est déjà sous le titre.
- Un lien utile (organisateur d'un challenge…) peut aller dans le texte, en
  markdown.

Montre l'index.md complet (au moins le texte et les `alt`) et demande
validation avant de copier les images ; corrige si besoin.

## 5. Vérifier

L'utilisateur a généralement `npm run dev` ouvert : ne lance pas
`npm run build` pendant l'édition. Vérifie plutôt que la page répond :
`curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/portfolio/<slug>/`.
Si elle ne répond pas en 200, lis l'erreur (champ manquant, image
introuvable), corrige l'index.md et revérifie.

Le build n'est nécessaire qu'avant un commit (CLAUDE.md) ; le Node par défaut
peut être trop vieux, utilise la version de `.nvmrc`. Ne commite pas sauf
demande.

Termine par un récapitulatif court : chemin de la série, URL
`/portfolio/<slug>/`, nombre de photos, correspondance fichiers d'origine →
numéros, champs laissés vides, et si elle est en brouillon.
