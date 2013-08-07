---
layout: post
title: "Formater une date avec PHP 5.3 (l10n partie 2)"
old: 12
---

Dans cette deuxième partie consacrée à la localisation d'une application avec PHP, je vais vous montrait comment afficher différemment une date par rapport la culture de l'utilisateur.

Pour ce faire, nous allons utiliser la classe `IntlDateFormatter`, Dans cette classe, je vais vous présenter la méthode format qui permet de convertir un timestamp en représentation textuelle de la date.

Pour commencer, nous devons instancier la classe comme suis :

{% highlight php %}
<?php
$fmt = new IntlDateFormatter('fr_FR', IntlDateFormatter::LONG, IntlDateFormatter::NONE);
{% endhighlight %}

La classe prend au minimum 3 arguments :

- La culture dans laquelle on veut afficher la date
- Le format à appliquer à la partie *date* du timestamp.
- Le format à appliquer à la partie *time* du timestamp.

Elle peut également prendre 2 arguments en plus :

- le fuseau horaire à appliquer sur la date.
- le format du calendrier.

Pour les formats de la date et du temps, on doit utiliser une des 5 constantes suivantes :

- `IntlDateFormatter::FULL`
- `IntlDateFormatter::LONG`
- `IntlDateFormatter::MEDIUM`
- `IntlDateFormatter::SHORT`
- `IntlDateFormatter::NONE`

Si les formats par défaut ne vous suffisent pas, vous pouvez toujours définir le format de la date avec la méthode `setPattern` ou directement dans le constructeur en mettant un 6ème argument. La liste des formats disponibles se trouvent sur le [site du projet icu](http://www.icu-project.org/apiref/icu4c/classSimpleDateFormat.html#_details)

{% highlight php %}
<?php
// Exemple pour la date qui est affichée sur mon blog
$fmt = new IntlDateFormatter('fr_FR', IntlDateFormatter::MEDIUM, IntlDateFormatter::NONE);
// Renvoi: 30 mai 2010
echo $fmt->format(time());

// Exemple en changeant juste la langue
$fmt = new IntlDateFormatter('en_US', IntlDateFormatter::MEDIUM, IntlDateFormatter::NONE);
// Renvoi: May 30, 2010
echo $fmt->format(time());

// Exemple si on utilise un format spécial
$fmt->setPattern('MMMM yyyy');
// Renvoie: May 2010 ou mai 2010
echo $fmt->format(time());
{% endhighlight %}

Cette classe possèdent également une méthode qui permet de faire l'inverse (`parse`), qui prend une chaine et qui renvoie un timestamp.

Plus d'informations sur cette classe sur la [documentation officielle](http://www.php.net/manual/en/class.intldateformatter.php)
