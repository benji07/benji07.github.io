---
layout: post
title: "Doctrine 1 : tri par défaut d'une relation"
old: 56
---

Je viens tous juste de trouver cette astuce, car elle n'est pas documenté sur le site de doctrine.

Au moment de la définition de votre modèle, il d'ajouter un `orderBy` au niveau d'une relations de type Many-to-One

{% highlight yaml %}
Produit:
  columns:
    nom: string(255)
    position: integer(4)
    categorie_id: integer
  relations:
    Categorie:
      onDelete: CASCADE

Categorie:
  columns:
    nom: string(255)
  relations:
    Produits:
      type: many
      class: Produit
      local: id
      foreign: categorie_id
      orderBy: position ASC
{% endhighlight %}

Avec le code suivant, vous n'avez plus besoin d'écrire la requête qui permet de récupérer les produits trié, il vous suffit d'écrire le code suivant :

{% highlight php %}
<?php
$categorie->Produits;
{% endhighlight %}

Source: [@TheKeyboard](http://www.littlehart.net/atthekeyboard/2010/02/04/sorting-relationship-results-in-doctrine-1-2-2)
