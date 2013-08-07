---
layout: post
title: "Doctrine 1 :  Data Hydrators"
old: 16
---

Les **Data Hydrators** dans doctrine servent à représenter en php les données retournées par une `Doctrine_Query`. Par défaut doctrine définit 8 Hydrators qui permettent de faire pratiquement tout ce que l'on veut, chacune de ces méthodes possèdent des avantages et des inconvénients. Si ces méthodes ne suffisent pas, on peut toujours en créer une nouvelle.

Pour présenter les différentes méthodes d'hydratation, je vais utiliser l'exemple suivant :

{% highlight php %}
<?php
$q = Doctrine_Core::getTable('User')->
        createQuery('u')->
        leftJoin('u.Profile p')->
        where('u.username = ?', 'benji07');
{% endhighlight %}

#### `Doctrine_Core::HYDRATE_RECORD` ####

C'est le type d'hydratation par défaut, lorsqu'on l'exécute sur une `Doctrine_Query` on va récupérer une `Doctrine_Collection` d'objet ou directement un objet de type `Doctrine_Record`. Avec cette méthode, on a accès a toutes les méthodes du modèle de l'objet, mais lorsque l'on veut récupérer plus d'une dizaine d'objets, on se rend compte que l'hydratation de ces objets consomme beaucoup trop de mémoire.

{% highlight php %}
<?php
$user = $q->fetchOne(array(), Doctrine_Core::HYDRATE_RECORD);

echo $user->Profile->firstname;
{% endhighlight %}

#### `Doctrine_Core::HYDRATE_ARRAY` ####

Au lieu de récupérer une `Doctrine_Collection`, avec cette méthode on va récupérer un tableau hiérarchisé avec toutes les données contenues dans la requête. Ce type d'hydratation est pratique lorsque l'on veut récupérer beaucoup de valeurs, car on n'a plus le problème de mémoire, vu que l'on ne crée pas des objets, mais des tableaux.

{% highlight php %}
<?php
$user = $q->fetchOne(array(), Doctrine_Core::HYDRATE_RECORD);

echo $user['Profile']['firstname'];
{% endhighlight %}

Le problème avec cette méthode c'est que l'on n'a plus accès aux méthodes défini au niveau de l'objet.

#### `Doctrine_Core::HYDRATE_SCALAR` ####

Contrairement au mode d'hydratation précédents qui crée un tableau avec plusieurs niveaux, ce mode crée un tableau sans traitement particulier (équivalent a un `$stmt->fetchAll(PDO::FETCH_ASSOC`)). Donc au lieu d'avoir un tableau comme ça :

{% highlight php %}
<?php
$user = array(
  'username'  => 'benji07',
  'password'  => '...',
  'Profile'   => array(
    'firstname' => 'Benjamin',
    'lastname'  => 'Lévêque'
  )
);
{% endhighlight %}

On aura le tableau suivant :

{% highlight php %}
<?php
$user = $q->fetchOne(array(), Doctrine_Core::HYDRATE_SCALAR);

$user = array(
  'u_username'  => 'benji07',
  'u_password'  => '...',
  'p_firstname' => 'Benjamin',
  'p_lastname'  => 'Lévêque'
);
{% endhighlight %}

#### `Doctrine_Core::HYDRATE_NONE` ####

Ce mode d'hydratation retourne les données de la même manière que le mode `HYDRATE_SCALAR`, sauf qu'au lieu de mettre le nom des colonnes il utilise des numéros.

#### `Doctrine_Core::HYDRATE_SINGLE_SCALAR` ####

Encore plus poussé que le mode d'hydratation précédents, celui-ci ne renverra qu'une colonne, c'est surtout pratique lorsque l'on veut récupérer un nombre (comme le nombre de commentaire qu'un utilisateur a publié).

{% highlight php %}
<?php
$q = Doctrine_Core::getTable('User')->
        createQuery('u')->
        select('COUNT(c.id)')->
        leftJoin('u.Comments c')->
        where('u.username = ?', 'benji07');

$nb_comment = $q->fetchOne(array(), Doctrine_Core::HYDRATE_SINGLE_SCALAR);
{% endhighlight %}

#### Autres modes d'hydratation ###

Il existe encore 3 autres type (`HYDRATE_ON_DEMAND`, `HYDRATE_RECORD_HIERARCHY` et `HYDRATE_ARRAY_HIERARCHY`), mais je ne les ai jamais utilisé. Le premier ressemble à l'hydratation `HYDRATE_RECORD`, mais hydrate les données de manière plus intelligentes, car il ne crée l'objet qu'au moment où l'on veut l'utiliser.

Les deux autres permettent des créer des arbres à partir d'objet qui utilise la behavior *NestedSet*.

### Créer sa propre méthode d'hydratation ###

Avec doctrine, on peut créer très simplement sa propre méthode d'hydratation, pour ça, il suffit de créer une classe qui étende `Doctrine_Hydrator_Abstract` et de l'enregistrer dans le `Doctrine_Manager`.

Pour le dernier projet sur lequel j'ai travaillé, j'ai eu besoin de récupérer le nombre de commentaires validés par utilisateur. Pour faire cela, j'ai crée une hydrator qui s'appuie sur la constante `PDO::FETCH_KEY_PAIR`.

{% highlight php %}
<?php
class Doctrine_Hydrator_Pair extends Doctrine_Hydrator_Abstract
{
  public function hydrateResultSet($stmt)
  {
    $data = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    return $data;
  }
}

// puis dans le bootstrap
$manager->registerHydrator('pair', 'Doctrine_Hydrator_Pair');

// et lorsque l'on veut executer la requête
$q->execute(array(), 'pair');
{% endhighlight %}

Retrouver plus d'information sur les Hydrator doctrine dans [la documentation officielle](http://www.doctrine-project.org/projects/orm/1.2/docs/manual/data-hydrators/en#data-hydrators).
