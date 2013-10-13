---
layout: post
title: "Retour Blend Web Mix 2013"
---

Les 1 et 2 octobre 2013, j'étais présent à la Blend Web Mix Conférence. Et j'ai pu assister pendant deux jours à la majorité des conférences techniques. Vous trouverez dans cet article mon retour sur ces conférences.

Dans l'ensemble, j'ai trouvé cette première édition bien organisé, même s'il manquait selon moi des conférences purement techniques.  Il y avait beaucoup trop de conférence marketing (ou business), ainsi que des conférences techniques mal préparées ou ne correspondant pas au sujet indiqué sur le programme (par exemple la conférence sur Grunt.js qui aurait pu être très intéressante).


## Introduction aux design patterns avec PHP

Sujet interresant
De bon exemple, c'est le point le plus important quand l'on veut expliquer des designs patterns
Ils ont commencer par expliquer le principe SOLID puis il nous ont donnée la définition d'un design pattern et ce qu'ils peuvent appliquer dans une application. Et enfin ils nous ont présenter 5 design pattern

- Composite
- Decorator
- Strategy
- Factory method
- Observer

<div style="width: 427px">
    <script async class="speakerdeck-embed" data-id="0958ca000c9d013165e70e61fb58d462" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>
</div>

## More CSS secrets : 10 things you may not know about CSS

Je ne connaissais pas Lea Verou, je suis allé à cette conférence car un de mes collègues est un de ses fans (il est même reparti avec un autographe). Je dois avouer que j'ai été impressionnée par les différentes techniques que Lea nous a présenté.

Cette présentation était plus une démo qu'une présentation basique. Les slides de cette présentation sont disponibles [ici](http://lea.verou.me/more-css-secrets/).

## Comment recruter un développeur ?

Camille nous à expliquer ce que recherchent les développeurs dans les offres d'emploi, et il ne s'agit pas des informations de la société car les points les plus importants sont la technologie utilisée, l'équipe et l'ambiance qui règnent dans l'entreprise.

Ensuite il nous a fait une présentation de ce qu'est un bon développeur selon lui, il s'agit de quelqu'un qui fait de la veille, qui est ouvert, curieux et qu'il teste son code.

Si vous voulez voir un retour plus complet, celui d'Alexandre Bortolli est très bien ([http://alexbortolotti.com/blendwebmix-lyon/](http://alexbortolotti.com/blendwebmix-lyon/)).

Liens vers [les slides](http://fr.slideshare.net/camilleroux/human-coders-recruter-un-bon-developpeur-blend)

## Concevoir son API

La présentation que j'attendais le plus lors du BlendWebMix, avoir un retour d'expérience et toute les bonnes pratiques qu'une personne utilise dans son travail de tout les jours, et je dois avouer que je n'ai pas était déçu.

J'ai regrouper toute les bonnes pratiques suivant 3 grandes parties.

### Convention

C'est toujours important de définir une convention lorsque l'on crée une api ou toute autre style d'application.

- Versionning
- Construction des url
- Date
- Encoding
- Paramètre
- Pagination

Prévoir le versionning dès le début, avoir un /v1/ au moment de la création de l'api
- Il conseil de mettre le numéro de version dans l'url et d'éviter les en-tete, car c'est le plus simple a tester

- Pensez au client en premier

- pour le construction des url:
    - pas de camelCase, utiliser des underscores
    - pas de caractères spéciaux

- Limiter les parametres optionnels
- Rester coherent au niveau des paramètres (utiliser les même nom de partout, par exemple pour la pagination ou les filtres)

- Ne pas utiliser de date, toujours des datetime, et penser a définir un timezone, de préférence UTC
- Tout faire en UTF8

- Pour la pagination utiliser from et length au lieux de offset
    -> je ne suis pas d'accords avec ce point là, car on ne peut pas gérer le tri

### Mise a disposition / Livrable

- environnement de test
- fournir un sdk -> fournir une application d'exemple
- fournir des exemples (ou un generateur d'exemple, par exemple http://apiary.io/)

### Sécurité

- toujours utiliser de l'https
- empecher la désactivation de la verification du SSL
- utiliser de l'http basic ou du oauth
- mettre une clé d'api
- ne pas faire de truc custom


<iframe src="http://www.slideshare.net/slideshow/embed_code/26779580" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe>
