---
layout: post
title: "Parser facilement des fichier csv"
old: 3
---

Parce que tout le monde a déjà eu à importer des données depuis un fichier CSV et à chaque fois il faut réécrire le même code, traiter les mêmes erreurs et qu'il y a tout le temps un problème au niveau de l'encodage des caractères, je vais vous présenter une classe que j'ai créé.

Lorsque vous voulez traiter un fichier CSV, la plupart du temps vous écrivez le code suivant (sans gestion d'erreur n'y support d'encodage du fichier).

{% highlight php %}
<?php
$f = fopen($filename,'rb');

while($line = fgetcsv($f,1024,';')){
  // traitement d'une ligne
}

fclose($f);
{% endhighlight %}

Le code pour traiter un fichier CSV, n'est pas très compliqué. Ce qui est difficile c'est l'écriture du traitement d'une ligne, car la variable `$line` est un tableau.

Prenons un exemple simple, l'importation de produits pour une boutique en ligne, vous avez le fichier CSV suivant :

    reference;nom;categorie;prix_ht;tva;
    22FF22;"Iphone 3gs";"Téléphone";390.9;19.6

Avec le code précèdent, il faudrait traiter le tableau suivant :

{% highlight php %}
<?php
$line = array(
  0 => "22FF22",
  1 => "Iphone 3gs",
  2 => "Téléphone",
  3 => "390.9",
  4 => "19.6"
);
{% endhighlight %}

Le problème avec ce code, c'est que si on veut modifier le format du fichier CSV pour ajouter des informations il faut reprendre toute la partie traitement pour vérifier les indices du tableau.

Le code précédent est très simple, mais il n'intègre aucune gestion de l'encodage du fichier, il ne possède pas non plus de gestion d'erreur. Comme je voulais avoir un code à la fois simple et orienté objet, je me suis dit que j'allais créer une classe que l'on devrait étendre pour traiter un fichier. On obtient le code suivant pour traiter le fichier CSV décrit plus haut.

{% highlight php %}
<?php
class ProduitParser extends CsvParser{

  protected $_columns = array('reference','nom','categorie','prix_ht','tva');

  protected $_ignoreFirstLine = true;

  public function parseLine(stdClass $line){
    // traitement d'une ligne
  }
}

$parser = new ProduitParser();
$parser->parse($filename);
{% endhighlight %}

Avec ces quelques lignes, on ne traite plus un simple tableau, mais un objet de type `stdClass` que l'on peut représenter de la manière suivante :

{% highlight php %}
<?php
$line = array(
  'reference'  => '22FF22',
  'nom'        =>  'Iphone 3gs',
  'categorie'  =>  'Téléphone',
  'prix_ht'    =>  '390.9',
  'tva'        =>  '19.6'
);
{% endhighlight %}

 Avec ce code, on obtient quelque chose qui est plus simple à maintenir, car le code est découpé en deux parties, une classe qui contient toute la logique métier et quelque ligne à placer dans une action (par exemple).

Vous pouvez retrouver le code de la classe CsvParser sur [github][].

[github]: http://www.github.com/benji07/CsvParser
