---
layout: post
title: "Introduction à Gaufrette"
old: 63
---

Cela fait un moment que j'ai envie d'apprendre à me servir de [Gaufrette][0], Donc je me suis dit que j'allais écrire un article sur cette librairie.

## Pourquoi utiliser Gaufrette ?

Gaufrette permet d'ajouter une couche d'abstraction sur son système de fichier, c'est-à-dire qu'il permet de facilement changer de support de stockage. Par exemple on commence un petit site communautaire en posant ces médias sur le même serveur, puis à un moment il faut changer l'endroit où l'on stocke ces médias pour les envoyer sur [AmazonS3][1]

## Installation

Pour installer Gaufrette, il suffit d'ajouter les lignes suivantes dans votre fichier composer.json. Dans cet article je ne vais pas utiliser Gaufrette avec Symfony2 (mais il existe un [bundle][2] pour l'intégrer)

{% highlight json %}
"require": {
    "knplabs/gaufrette": "*"
}
{% endhighlight %}

## Exemple d'utilisation

{% highlight php %}
<?php

use Gaufrette\Filesystem;
use Gaufrette\Adapter\Local as LocalAdapter;

class Importer
{
    protected $filesystem;

    public function __construct(Filesystem $filesystem)
    {
        $this->filesystem = $filesystem;
    }

    public function import($filename, $markAsProcess = false)
    {
        $content = $this->filesystem->read($filename);

        // do whatever you want with the file content

        // mark the file as process
        if ($markAsProcess) {
            $this->filesystem->rename($filename, 'process/'.$filename);
        }
    }
}
{% endhighlight %}

Comme vous pouvez le voir dans le code au-dessus, il s'agit d'une classe pour importer des fichiers, cette classe n'a pas besoin de savoir sur quel support se trouve le fichier (par exemple lors de la phase de développement, le fichier peut se trouver en local sur sa machine, mais lors du passage en production, le fichier pourrait être sur un ftp distant).

{% highlight php %}
<?php
// Import a file from local adapter
$adapter = new LocalAdapter(__DIR__.'/uploads');
$filesystem = new Filesystem($adapter);
$importer = new Importer($filesystem);
$importer->import('monfichier.csv', true);

// Import a file from ftp adapter
$adapter = new FtpAdapter();
$filesystem = new Filesystem($adapter);
$importer = new Importer($filesystem);
$importer->import('monfichier.csv', true);
{% endhighlight %}

[0]: http://knplabs.fr/blog/give-your-projects-a-gaufrette
[1]: http://aws.amazon.com/fr/s3/
[2]: https://github.com/KnpLabs/KnpGaufretteBundle
