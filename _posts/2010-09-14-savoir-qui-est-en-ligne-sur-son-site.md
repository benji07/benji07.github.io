---
layout: post
title: "Savoir qui est en ligne sur son site"
old: 27
---

Ce plugin permet de savoir combien d'utilisateurs sont à ligne sur son site, il permet également d'avoir accès aux ids des utilisateurs connectés.

Ce plugin est disponible sur [GitHub](http://github.com/benji07/WhosOnlinePlugin)

## Installation

Vous devez modifier le fichier `filters.yml` de votre application de la manière suivante:

{% highlight yaml %}
rendering: ~
security:  ~

# insert your own filters here
user_online:
  class: WhosOnlineFilter

cache:     ~
execution: ~
{% endhighlight %}

Ensuite, vous devez définir la méthode `getUserId` dans votre classe `myUser` par exemple avec le plugin sfDoctrineGuard ça donne la méthode suivante:

{% highlight php %}
<?php
public function getUserId()
{
  return $this->getAttribute('user_id', null, 'sfGuardSecurityUser')
}
{% endhighlight %}

Vous pouvez également configurer le délai de rafraichissement de la liste des utilisateurs connecté dans le fichier `app.yml`, par défaut les utilisateurs quitte la liste au bout de 10 minutes.

{% highlight yaml %}
all:
  whos_online:
    time:      10 # time in minute
{% endhighlight %}

## Utilisation

Vous pouvez récupérer le nombre d'utilisateur connecté en utilisant la méthode suivante:

{% highlight php %}
<?php
$nb_user = WhosOnlineSessionTable::countOnlineUser();
{% endhighlight %}

Ensuite, vous pouvez récupérer la liste des utilisateurs connecté avec cette méthode:

{% highlight php %}
<?php
$user_ids = WhosOnlineSessionTable::getOnlineUserIds();
{% endhighlight %}
