---
layout: post
title: "Générer correctement les liens dans une tâches symfony"
old: 32
---

Au début de votre taches, il suffit de définir les variables suivantes :

{% highlight php %}
<?php
public function execute($arguments = array(), $options = array())
{
    $_SERVER['HTTP_HOST'] = sfConfig::get('app_host');
    $_SERVER['SCRIPT_NAME'] = '';
    $_SERVER['PATH_INFO'] = '/';
{% endhighlight %}

`HTTP_HOST` permet de définir le nom de domaine (ne pas mettre http://).

`SCRIPT_NAME` contient *symfony* car on exécute une tâche.

`PATH_INFO` contient le chemin par défaut vers l'application, dans la plupart des cas il faut mettre `/`
