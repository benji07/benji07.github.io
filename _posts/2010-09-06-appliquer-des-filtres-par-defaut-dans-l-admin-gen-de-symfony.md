---
layout: post
title: "Appliquer des filtres par défaut dans l'admin gen de symfony"
old: 25
---

Il suffit d'ajouter la méthode suivante dans la classe moduleGeneratorConfiguration:

{% highlight php %}
<?php
public function getFilterDefaults()
{
  return array(
    'is_valid' => false
  );
}
{% endhighlight %}

Ici on décide d'afficher par défaut tous les éléments qui n'ont pas été validé.
