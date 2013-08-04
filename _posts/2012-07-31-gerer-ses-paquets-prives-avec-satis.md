---
layout: post
title: "Gérer ses paquets privés avec Satis"
---

## Qu'est ce que Satis ?

Satis est un outil qui permet de créer un "dépôt" composer statique, permettant de gérer tous vos dépôts (privés et public) à l'intérieur, mais il est généralement utilisé pour les dépôts privés.
Il permet donc d'utiliser plus facilement des dépôts privés à l'intérieur de ses projets,  il n’est de ce fait, plus nécessaire  d'indiquer l'url de tous les dépôts que l'on souhaite utiliser dans un projet.

Satis permet ainsi de répondre à plusieurs problématiques:

- Vous disposez d'un code que vous ne souhaitez pas rendre publique mais avez envie de bénéficier des avantages de composer.
- Votre application évolue dans un environnement "fermé" ne permettant pas de faire de requêtes vers des dépots externes au réseau local.
- Les dépôts que vous récupérez sont volumineux et vous souhaitez profiter de la rapidité du réseau local.

[Satis][] utilise [Composer][] afin de collecter toutes les informations sur les dépôts que l'on a configuré.

## Qu'est ce que Composer ?

[Composer][] est un outil qui permet de gérer les dépendances d'un projet en PHP. Il vous permet de déclarer les librairies dont vous avez besoin et de les installer dans votre projet.

Tout ça à partir d'un fichier `composer.json` comme celui-ci :

    {
        "name": "elao/my-application",
        "require": {
            "php": ">=5.3.3",
            "silex/silex": "1.0.*"
        },
        "minimum-stability": "dev",
        "autoload": {
            "psr-0": { "": "src/" }
        }
    }

## Installation

La première chose a faire est de récupérer l'outil via composer justement:

    wget http://getcomposer.org/composer.phar
    composer.phar create-project composer/satis

### Configuration

Il y a ensuite un peu de configuration à faire, il faut lui fournir un fichier json, où l'on défini des dépôts de source.

Exemple d'un fichier de configuration simple :

    # Fichier config.json
    {
        "name": "Elao Repository",
        "homepage": "https://satis.elao.com",
        "repositories": [
            { "type": "vcs", "url": "http://github.com/mycompany/privaterepo" },
            { "type": "vcs", "url": "http://svn.example.org/private/repo" },
            { "type": "vcs", "url": "http://github.com/mycompany/privaterepo2" }
        ],
        "require-all": true
    }

Dans ce fichier, on doit déclarer les dépôts que l'on souhaite voir apparaitre dans le tableau `repositories`.

Composer supporte différents types de [dépôts](http://getcomposer.org/doc/05-repositories.md), on les défini ici comme `vcs`, ce qui permet a Composer de déterminer automatiquement sur quel support ce trouve le dépôt (git, subversion, mercurial, github ou BitBucket).

On ajoute ensuite l'option `require-all` afin d'indiquer que l'on souhaite pouvoir utiliser toutes les versions de nos dépôts, si cette option n'est pas spécifiée, il faut définir l'ensemble des versions que l'on veut rendre disponibles à l'aide de la directive `require`

Exemple:

    {
        "require": {
            "company/package": "*",
            "company/package2": "2.0.0"
        }
    }

Dans l'exemple ci-dessus on indique que l'on veut disposer de toutes les versions de `company/package`, mais uniquement la version `2.0.0` de `company/package2`.

### Création du dépôt

    php bin/satis build <configuration file> <build dir>

    php bin/satis build config.json web/

L'exécution des ces commandes va générer 3 fichiers (packages.json, index.html et style.css), seul le premier est utile car c'est lui qui contient toutes les informations sur nos dépôts (les 2 autres ne sont qu'une représentation html du fichier packages.json).

### Publication

Pour être utilisable, votre fichier `packages.json` doit être accessible sur internet/intranet (à l'aide d'un serveur web quelconque). A noter également qu'il faut que ce fichier soit accessible pour l'utilisateur qui lance la commande `composer install/update`.

### Utilisation

A présent, dans votre `composer.json`, au lieu de déclarer un repository différent pour chacun de vos dépôts privés, il vous suffit d'en ajouter un de type composer et de définir l'url vers votre fichier `packages.json`, vous aurez ainsi accès automatiquement a tous vos dépôts.

    {
        "repositories": [
            { "type": "composer", "url": "https://satis.elao.com/" }
        ],
        "require": {
            "company/package": "1.2.0",
            "company/package2": "1.5.2",
            "company/package3": "dev-master"
        }
    }


[Satis]: http://getcomposer.org/doc/articles/handling-private-packages-with-satis.md
[composer]: http://getcomposer.org/