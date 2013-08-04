---
layout: post
title: "Mettez un poney dans votre Symfony2"
---

Cela fait quelque temps que j'essaie de faire respecter les *coding rules* de Symfony2 à mes collègues, pour les faire respecter j'ai décidé d'utiliser des hooks de pre-commit, mais il n'existe pas vraiment de méthode pour les installer facilement sur la machine de tous les développeurs (et puis ces règles peuvent changer suivant les projets).

Je me suis dit que j'allais créer un outil permettant d'effectuer l'installation de ces hooks ainsi que l'automatisation de certaines tâches pour les projets Symfony2.

Ce script est inspiré du projet Ciboulette de Knplabs. Le nom du script a été défini après une longue discussion avec mes collègues de bureau, afin de trouver un nom simple et facile à retenir.

## Installation

    cd ~/bin
    git clone git://github.com/benji07/poney.git poney

Ajouter le script `poney` dans son `PATH`

    export PATH=~/bin/poney/bin:$PATH

## Ajouter des hooks

Dans le dépôt, j'ai ajouté 2 hooks de pre-commit, car je les utilise sur tous mes projets symfony2 (un pour vérifier la syntaxe et l'autre pour vérifier le style des fichiers).

Pour faire fonctionner ces hooks, il faut les ajouter au niveau de son application dans le dossier `bin/hooks/pre-commit`

## Utilisation

Dans mon script, j'ai défini cinq commandes que l'on a besoin d'exécuter assez régulièrement dans un projet.

### Installation du projet

Lorsque l'on clone un projet, on doit créer un fichier parameters.yml (ou parameters.ini suivant la version de Symfony2), ensuite on doit récupérer les vendors, créer la base de données, la remplir avec des fixtures et d'ajouter des hooks.

    $ poney install
    Copy parameters.yml from parameters.yml.sample                  [ok]
    Enter your password for chmod cache and logs
    Password:
    app/cache & app/logs been properly chmod‘ed for benji07 and _www[ok]
    Run composer install                                            [ok]
    Create database                                                 [ok]
    Drop schema                                                     [ok]
    Create schema                                                   [ok]
    Load fixtures                                                   [ok]
    Install assets with symlink                                     [ok]
    Installing hooks
    Install pre-commit hooks inside .git/hooks/pre-commit.d         [ok]

### Mise à jour de la base de données

De temps en temps il y a des modifications au niveau de la base de données, lorsque cela arrive, on doit recréer les tables et recharger les fixtures.

    $ poney update
    Create database                                                 [ok]
    Drop schema                                                     [ok]
    Create schema                                                   [ok]
    Load fixtures                                                   [ok]
    Install assets with symlink                                     [ok]

### Mise à jour des vendors

Il peut arriver que l'on ajoute des dépendances dans son projet, donc on doit mettre à jour ces vendors (en utilisant `bin/vendors update` ou `composer update`)

    $ poney vendors
    Run composer update                                             [ok]
    Install assets with symlink                                     [ok]

### Rechargement des fixtures

    $ poney fixtures
    Load fixtures                                                   [ok]

### Installation des hooks git

Si l'on ne veut pas mettre du code sale dans son dépôts, il faut installer des hooks pour empêcher les développeurs de commiter n'importe quoi.

    $ poney hooks
    Installing hooks
    Install pre-commit hooks inside .git/hooks/pre-commit.d         [ok]