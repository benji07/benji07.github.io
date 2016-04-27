---
layout: post
title: "Installer Symfony2 sur une offre perso ovh"
old: 44
---

Rien de plus simple, il faut modifier le fichier .htaccess qui est dans le dossier web/

{% highlight conf %}
SetEnv REGISTER_GLOBALS 0
SetEnv MAGIC_QUOTES 0
SetEnv ZEND_OPTIMIZER 1
SetEnv PHP_VER 5_3
{% endhighlight %}

Il faut redéfinir votre `config.yml` pour ajouter le paramètre `host`:

{% highlight yaml %}
doctrine.dbal:
    dbname:   dbname
    host:     hostname
    user:     username
    password: password
    charset: utf8
{% endhighlight %}

<strike>Problème, vous ne pourrez pas utiliser les classes [intl](http://fr.php.net/manual/en/book.intl.php), car elle sont désactivés par ovh.</strike>

Je mettrais à jour cette article, dès qu'une de mes applications Symfony2 fonctionnera correctement.

**Modification du 23 janvier 2011** :

Ovh vient de mettre à jour sa version de PHP pour son offre *Perso*, et les applications **Symfony2** fonctionnent maintenant correctement

**Modification du 2 mai 2012** : Changement au niveau du PHP_VER
