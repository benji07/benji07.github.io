---
layout: post
title: "Qualité du code: PHPCS"
old: 66
---

L'un des principaux problèmes rencontrés au cours de projets nécessitants l'intervention de plusieurs développeurs est l'uniformité du code et le respect des conventions de codage, qui ont (normalement) dû être mise en place.
Avec l'avènement de PHP depuis quelques années dans le milieu professionel, de plus en plus d'outils facilitent la vérification de ces normes de codage, leur but étant d'assurer la normalisation du code et leur respect.

Nous pouvons citer, pour PHP [PHP_CodeSniffer][phpcs].
En complément de cet outil, il sera nécessaire de définir un ensemble de règles de configuration, nous utilisons aujourd'hui celles définies pour Symfony2 par [OpenSky][opensky].

[phpcs]: http://pear.php.net/package/PHP_CodeSniffer
[opensky]: http://github.com/opensky/Symfony2-coding-standard

## Installation et Configuration de "PHPCS"

[PHP_CodeSniffer][phpcs] est disponible via PEAR, et est donc relativement facile à installer.

    pear install PHP_CodeSniffer

On doit ensuite ajouter les règles pour Symfony2.

    cd /path/to/pear/PHP/CodeSniffer/Standards
    git clone git://github.com/opensky/Symfony2-coding-standard.git Symfony2
    phpcs --config-set default_standard Symfony2

Pour l'utiliser il suffit à présent de se rendre dans un de nos projets Symfony2 et de taper la commande suivante :

    phpcs src/

Si vous ne respectez pas la norme de codage de Symfony2 PHPCS vous répondra de la manière suivante:

    FILE: .../src/Benji07/BlogBundle/Entity/Post.php
    --------------------------------------------------------------------------------
    FOUND 1 ERROR(S) AFFECTING 1 LINE(S)
    --------------------------------------------------------------------------------
    335 | ERROR | Missing blank line before return statement
    --------------------------------------------------------------------------------

    Time: 3 seconds, Memory: 12.50Mb

## Utilisation avec Git

La mise en place de ce type d'outils est une bonne chose pour qui est soucieux de la qualité de son code. Deux problèmes peuvent  cependant être soulevés avec ce fonctionnement:

- L'exécution manuelle de la commande `phpcs src/`, va vérifier le code de toute l'application et cela peut prendre beaucoup de temps.
- Vous aurez constaté que la vérification du code n'est faite qu'à la demande du développeur, et n'est donc pas systèmatique.

Pour palier au premier problème j'ai une petite commande (inspirée par la commande [`git-php-lint` de ubermuda][git-php-lint]) bien pratique.

    git status --porcelain | grep -E '^[^D\?]{2} .*\.php$' | awk '{print $2}' | xargs -n1 phpcs

Celle-ci va prendre tous les fichiers php qui sont "staged" et va exécuter la commande phpcs dessus (je me suis créé une commande `git-phpcs` que j'ai mis dans mon dossier `bin` pour une utilisation simplifiée), ne sont donc vérifiés que les fichiers que nous nous préparons à commiter.
Nous sommes cependant toujours confronté au second problème, la prochaine étape est donc d'ajouter cette commande dans un hook de pré-commit qui empêchera un développeur de "commiter" s'il y a une erreur dans l'un de ses fichiers.

[git-php-lint]: https://github.com/ubermuda/dotfiles/blob/master/bin/git-php-lint


NB: Cet article est une copie de celui que j'ai publié sur le blog de [elao](http://www.elao.com/blog)
