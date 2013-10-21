---
layout: post
title: "Blend Web Mix 2013 - Concevoir son API"
---

La présentation que j'attendais le plus lors du BlendWebMix, avoir un retour d'expérience et toutes les bonnes pratiques qu'une personne utilise dans son travail de tous les jours, et je dois avouer que je n'ai pas était déçu.

<iframe src="http://www.slideshare.net/slideshow/embed_code/26779580" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe>

Voici les points que j'ai retenus de cette présentation :

## Convention

- Versionning: ajouter un numéro de version dans l'URL ou dans un sous-domaine (beaucoup plus simple que dans un header), prévoir dès le début.
- Construction de l'url: il faut éviter le camelCase, utiliser plutôt des underscores, il ne faut pas utiliser de caractères spéciaux.
- Gestion des dates: Toujours utiliser des dates avec l'heure et le fuseau horaire.
- Encodage: Il faut toujours utiliser UTF-8.
- Paramètres: il faut limiter l'utilisation des paramètres optionnels, il faut rester cohérent sur l'ensemble de l'API.

## Livrable

- Fournir un environnement de test
- Fournir un SDK avec des exemples d'utilisation
- Fournir un générateur d'exemple, mais ça demande un peu de travail (par exemple [twilio](http://www.twilio.com/docs/api/rest/making-calls) ou [apiary.io](http://docs.themoviedb.apiary.io/#movies)).

### Sécurité

- Toujours utiliser de l'HTTPS
- Authentification Basic ou OAuth (dans les cas bien spécifique)
- Ne pas réinventer la roue
- Empecher la désactivation de la vérification SSL (dans le SDK)

