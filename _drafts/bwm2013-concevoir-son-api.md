---
layout: post
title: "Blend Web Mix 2013 - Concevoir son API"
---

La présentation que j'attendais le plus lors du BlendWebMix, avoir un retour d'expérience et toute les bonnes pratiques qu'une personne utilise dans son travail de tout les jours, et je dois avouer que je n'ai pas était déçu.

J'ai regrouper toute les bonnes pratiques suivant 3 grandes parties.

### Convention

C'est toujours important de définir une convention (ou d'utiliser une convention existante) lorsque l'on crée une api ou toute autre style d'application.

Versionning: Eric est parti dans la direction opposé de ce qui est préconisé dans les service Restful, il ajoute le numéro de version dans l'url au lieu de passer la version dans l'entete de la requete, c'est en effet plus simple d'avoir la version dans l'url (Twitter utilisé également cette convention)

Construction des url: il faut éviter le camelCase, utiliser plutot des underscore, il ne faut pas utiliser de caractères spéciaux

Date: Il faut tout le jour utiliser des champs datetime avec timezone, sinon on risque d'avoir des problème si notre api est utilisé partout dans le monde

Encoding: ne pas ce poser de question et toujours utiliser de l'UTF8

Paramètre: utiliser le moins de paramètres optionnels possible, rester cohérent sur l'ensemble de l'API, par exemple le paramètre sort permet de trier sur toute les urls de l'API

Pagination: point le plus discutable, Eric conseil d'utiliser 2 paramètres, un qui indique l'identifiant du dernier élements renvoyé pour la page précédente, et le nombre d'élément a renvoyer. Il utiliser cette méthode afin de gérer les ajouts de nouveau éléments entre 2 appel a l'API. Je ne trouve pas cette méthode très pratique car elle va complexifié le code dans le cas d'un tri spécifique (autre que sur l'identifiant)

**Il faut penser au client en premier**

### Livrable

Il faut au minimum fournir un environnement de test, pour que les utilisateurs puissent tester leur appels a l'API, mais on peu aller beaucoup plus loin en fournissant des exemples d'utilisation de l'API (comme le fait twitter), ou alors carrement fournir un outils qui permet de générer du code (un peu comme le fait twilio, ou encore mieux http://apiary.io/)

Il faudrait également fournir un SDK, ainsi qu'une application d'exemple qui utilise ce SDK.

### Sécurité

Lorsque l'on va commencer a développer une API REST (ou HTTP°, on ne doit pas ce poser de question, celle-ci doit être en HTTPS.

Si l'on a besoin d'une quelconque authentification, il faut partir sur du HTTP Basic, ou alors sur de l'OAuth (seulement dans des cas bien spécifique).

Surtout il ne faut pas essayé de mettre une solution d'authentification personnel (ne surtout pas réinventer la roue).

Lorsque vous allez livrer votre SDK, il ne faut surtout pas permettre de désactivier la verification SSL

Il peut être intérressant de mettre en place une clé d'API (pour faire des statistiques d'utilisation, pour implémenter des quotas, de accès par clé, ...)

<iframe src="http://www.slideshare.net/slideshow/embed_code/26779580" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe>
