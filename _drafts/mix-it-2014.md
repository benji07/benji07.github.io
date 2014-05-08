---
layout: post
title: "Retour Mix-IT 2014"
---

Cette année je me suis dit que j'allais faire un petit retour de cette conférence qui ce tiens a Lyon depuis maintenant 4 ans. Cette conférence parle principalement d'agilité et de qualité du code, elle est organisé par le [JUG](http://www.lyonjug.org/) et le [CARA Lyon](http://lyon.clubagilerhonealpes.org/).

J'ai personnelement trouvé cette édition bien meilleur que la précedents, car il y a avait beaucoup plus de talk qui m'interressé.

Au niveau de la planning et du rythme, tout c'est déroulé sans accro, il n'y a pas eu un seul moment où je n'ai pas su quoi allé voir. Cette année il y a eu une nouveauté, les talks fait par des "aliens", les "aliens" sont des conférenciers qui ne sont pas dans le monde de l'IT, alors des conférences complétement décalé et je trouve une bonne chose car il a permis de nous montrer la vision des autres sur le monde.

Au final il n'y aura eu qu'une conférence que j'ai détesté, c'est "Party Like It's 1999" qui aurait du être une introduction a ReactJS, le conférencier a passé la majeur partie de son temps a nous montrer des anciennes versions des sites sans jamais nous montrer du code.

J'ai adoré la nourriture que l'on a eu le matin au petit déjeuner et tout au long de la journée, avec des viennoiserie et des crèpes a volonté. Mais j'ai vraiment été déçu par la qualité des sandwichs le midi, j'aurais préféré un petit peu plus d'audace et de goût, car un sandwich avec 2 tranche de rosette et un peu de beurre ce n'est pas très recherché.

Par contre il y a un truc que je trouve regretable, c'est que les conférencier qui font du développement Java continue a dire que PHP c'est de la grosse daube, parce que la seul chose qu'ils connaissent en PHP c'est Wordpress ou Cake PHP (un framework qui a 10 ans). Alors que des Framework recents comme Symfony2 sont de très haut niveau et relativement proche des Framework Java.

Voici une partie des notes que j'ai pu prendre pendant ces 2 jours de conférence

## Des petits pas vers le Continuous Delivery

Présentation de LesFurets.com sur comment ils sont passé d'une mise à jour par mois à a une mise à jour quotidienne de leur application.

Mise en place de la méthode "[Blue/Green Deployement](http://martinfowler.com/bliki/BlueGreenDeployment.html)" pour la mise à jour de leur application, cette méthode consiste a répliquer son environnement de production, a faire transiter tout le trafic sur un seul envirronement, et mettre à jour l'autre, puis faire basculer le trafic sur celui-ci. En utilisant cette technique ils sont passé d'1 heure et demi à 30 minutes par livraison.

Ils ont utiliser la strategy de merge "[octopus](http://stackoverflow.com/a/366940)" de git afin de créer un envirronement de test qui contient l'ensemble des fonctionnalité en cours de développment.

Conférence interressante, même si elle manquait un petit peu de dynamisme et que certain de leur choix technique m'ont surpris, comme le stockage de tout les identifiants de tout leur serveur ce trouver dans leur dépots de source.

## How To Do Kick-Ass Software Development

Présentation par [Sven Peters](http://svenpet.com/) de Atlassian, sur comment mieux developper des applications

Travailler a distance ? il faut laisser la possibilité aux employés de choisir d'où ils veulent travail, certain sont plus éfficace depuis le bureau, alors que d'autre ce sent mieux dans un café, ou sur leur canapé chez eux.

Pourquoi discuter des changements dans le code ? Pour améliorer la qualité, pour apprendre (la partie la plus important d'une revue de code), pour ce sentir mieux, mais pas pour blamer les gens

2 méthodes pour communiquer efficacement dans une équipe:

- par email: car hors-ligne, touche plusieurs personne, asynchrone, possibilité d'ajout facilement des personnes. Mais beaucoup de spam, mauvais pour les conversations, souvent trop long pour obtenir une réponse
- par chat, permet de crée plusieurs salons (par projet, par sujets), fonctionnent très bien pour les conversations distante comme local, On peut mentionner facilement une personne ([10 reasons why every team needs a Chat](http://svenpet.com/2014/04/15/10-reasons-why-every-team-needs-a-chat/))

Si vous souhaitez revoir cette présentation, celle-ci est déjà en ligne : [http://vimeo.com/70102926](http://vimeo.com/70102926)

## Natural Course of Refactoring – a refactoring work

Session présenté par Sieraczkiewicz Mariusz, il nous a présenter ce que l'on doit faire pour refactorer efficacement notre code.

La refactoring ce décompose en 2 phase, une que l'on doit faire tout les jours, et une autre un peu plus couteuse en temps.

Les changements a faire tout les jours, afin de maitenir la qualité du code

- corriger les noms des méthodes et des classes (ne pas avoir de classe qui ce termine par Manager ou Helper car elle indique un non respect du [SRP](http://en.wikipedia.org/wiki/Single_responsibility_principle)
- extraire des méthodes
- déplacer les méthodes et extraires des classes

Les modifications strategiques

- introduire des designs pattern
- Faire des changements architecturaux

La processus de refactoring est le suivant :

0. Comprendre le code (modifier le nom des méthodes)
1. Exprimer un algorithme (extraire des méthodes)
2. Extraire les responsabilité (créer des classes qu'il n'ont qu'une seul responsabilité)
3. Ajouter de la flexibilité (introduire des designs patterns)
4. Faire évoluer l'architecture (ajouter des couches)

Les 3 premières étapes sont des modifications que l'on doit faire tout les jours.

Slides de la conférence : [http://fr.slideshare.net/BNSIT/natural-course-of-refactoring-mixit-lyon](http://fr.slideshare.net/BNSIT/natural-course-of-refactoring-mixit-lyon)

## L’amélioration continue au sein d’une équipe agile

Présentation de Anne-Sophie et Olivier de [TEA](http://www.tea-ebook.com/) sur comment ils ont améliorer leur utilisations de SCRUM au quotidien.

Voici les différents point qu'ils ont abordé pendant leur présentation

- La coupure de sprint (réunion)
    - préparer les démo avant (envoyé un mail avec la liste des fonctionnaltié qui seront présenté)
    - 5 minutes de démo, suivi de 15 min de question (ne pas mélanger la démo et les questions en même temps)
    - ne pas inviter tout le monde pour le découpage des fonctionnalités
- Code review
    - permete de supprimer la majorité des boulette
    - partage de connaissance
    - pair programming
    - au moins 2 personne pour valider une architecture technique

Slides de la conférence : [http://fr.slideshare.net/annso54/lamlioration-continue-au-sein-dune-quipe-agile](http://fr.slideshare.net/annso54/lamlioration-continue-au-sein-dune-quipe-agile)

## I want to be an efficient developer

- les gens heureux sont plus efficaces
- l'opensource rend les gens heurux, car ils écrivent du code juste car ils le veulent, ils ont l'impression de servir a quelque chose
- le déploiement doit être facile (tout le monde doit être capable de déployer, sauf peut être les stagiares)
- le code doit être découper en petit modules, chacun des modules doit être vu comme un service (http ou amqp)
- utiliser une techno qui correspond au besoin, et pas parce qu'elle est hype
- utiliser des produits online (Paas)
- eviter d'utiliser le filesystem du serveur, car on ne peut pas le scaler, ou l'exposer en tant que service, utiliser plutot de l'object storage (S3 Object Storage par exemple)
- ce concentrer sur la lisibilité du code
- aller dans des hackaton ou des coding dojo


Slides de la conférence : [http://fr.slideshare.net/quentinadam/i-want-to-be-more-efficient-apidays](http://fr.slideshare.net/quentinadam/i-want-to-be-more-efficient-apidays)

## Le mythe du framework agile

- vous n'utilisez pas un framework, c'est lui qui vous utilise
- mvc n'est pas une architecture
- une bonne architecture permet de retarder les décisions, minimise le couplace, facile à changer et testable.
- 4 rèles de Ken Beck (http://agile.dzone.com/articles/4-rules-simple-design)
- Regarde du coté du DDD, de l'architecture Hexagonal, de CQRS, Clean architecture
- mettre le métiers au cœur des préocuppations (et non la base de données)
- encapsuler les cas d'utilisations dans des commandes
    - inversion de controle
    - permet de brancher n'importe quoi dessus (web, api, test d'acceptation)
    - permet de déduire de meilleur interface graphique
    - peut être executable sur un autre serveur (voir le bus de commande)
    - pas lié a la base de données

Slides de la conférence : [http://dusseaut.name/le-mythe-du-framework-agile/#/](http://dusseaut.name/le-mythe-du-framework-agile/#/)
