---
layout: post
title: "Formater un nombre avec PHP 5.3 (l10n partie 1)"
old: 6
---

Lorsque l'on crée un site multilingue on doit s'occuper de la *localisation* et  de l'*internationalisation* de l'application. Dans cette série d'article je ne parlerai que de la *localisation* d'une application avec l'extension **[Intl](http://www.php.net/manual/en/intro.intl.php)** de PHP 5.3.

Dans cette première partie, je présenterai le fonctionnement de la régionalisation des nombres et des devises avec la classe `NumberFormatter`.

### Formater un nombre décimal###

**Formater un nombre décimal suivant une langue défini :**

{% highlight php %}
<?php
$formatter = new NumberFormatter('fr', NumberFormatter::DECIMAL);
echo 'Français: ' , $formatter->format(12345.67) , "\n";

$formatter = new NumberFormatter('en', NumberFormatter::DECIMAL);
echo 'Anglais: ' , $formatter->format(12345.67) , "\n";

$formatter = new NumberFormatter('de', NumberFormatter::DECIMAL);
echo 'Allemand: ', $formatter->format(12345.67) , "\n";
{% endhighlight %}

Renverra :

    Français: 12 345,67
    Anglais: 12,345.67
    Allemand: 12.345,67

### Formater un nombre de devise ###

**Formater un nombre suivant la langue de l'utilisateur et la devise utilisée dans l'application.**

Pour formater les nombres monétaires, il faut indiquer le code de la devise comme défini dans la norme [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217).

{% highlight php %}
<?php
echo "Français\n";
$formatter = new NumberFormatter('fr', NumberFormatter::CURRENCY);
echo $formatter->formatCurrency(12345, 'EUR'), "\n";
echo $formatter->formatCurrency(12345, 'USD'), "\n";
echo $formatter->formatCurrency(12345, 'GBP'), "\n";

echo "Anglais\n";
$formatter = new NumberFormatter('en', NumberFormatter::CURRENCY);
echo $formatter->formatCurrency(12345, 'EUR'), "\n";
echo $formatter->formatCurrency(12345, 'USD'), "\n";
echo $formatter->formatCurrency(12345, 'GBP'), "\n";

echo "Allemand\n";
$formatter = new NumberFormatter('de', NumberFormatter::CURRENCY);
echo $formatter->formatCurrency(12345, 'EUR'), "\n";
echo $formatter->formatCurrency(12345, 'USD'), "\n";
echo $formatter->formatCurrency(12345, 'GBP'), "\n";
{% endhighlight %}

Renverra:

    Français
    12 345,00 €
    12 345,00 $US
    12 345,00 £UK

    Anglais
    €12,345.00
    $12,345.00
    £12,345.00

    Allemand
    12.345,00 €
    12.345,00 $
    12.345,00 UK£

La classe `NumberFormatter` permet d'afficher également d'autre type de chiffre comme des pourcentages, des nombres utilisant les notations scientifiques...

Retrouver toutes les informations à propos de cette classe sur la [documentation PHP](http://www.php.net/manual/en/class.numberformatter.php).
