---
layout: post
title: "Blend Web Mix 2013 - Concevoir son API"
---

La présentation que j'attendais le plus lors du BlendWebMix, avoir un retour d'expérience et toute les bonnes pratiques qu'une personne utilise dans son travail de tout les jours, et je dois avouer que je n'ai pas était déçu.

J'ai regrouper toute les bonnes pratiques suivant 3 grandes parties.

### Définir une convention

C'est toujours important de définir une convention lorsque l'on crée une api ou toute autre style d'application.

- Versionning: Eric est parti dans la direction opposé de ce qui est préconisé dans les service Restful, il ajoute le numéro de version dans l'url au lieu de passer la version dans l'entete de la requete, c'est en effet plus simple d'avoir la version dans l'url (Twitter utilisé également cette convention)
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
