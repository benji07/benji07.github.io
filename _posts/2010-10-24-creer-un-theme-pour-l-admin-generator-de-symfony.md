---
layout: post
title: "Créer un thème pour l'admin-generator de symfony"
old: 36
---

Dans cet article, je vais vous montrer comment créer un thème pour l'admin-generator de symfony 1.4.

## Pourquoi créer un nouveau thème ?

Il peut y avoir plusieurs raisons à ça, la première est que l'on veut modifier le code html qui est généré par le thème par défaut. La deuxième est que l'on veut ajouter des fonctionnalité en plus.

## Création du thème

La première chose à faire, c'est de partir d'une base existante, du thème *admin* du plugin *sfDoctrinePlugin*.

    mkdir -p data/generator/sfDoctrineModule/themeName
    cd !$
    cp -r symfony_dir/lib/plugins/sfDoctrinePlugin/data/generator/sfDoctrineModule/admin/* .

Ensuite si comme moi, vous avez une version de symfony récupérer depuis le svn, il faut penser à enlever les fichier `.svn` qui ont été copié.

    find . -name ".svn" -exec rm -rf {} \;

## Organistions des fichiers du thème

Si on va voir dans le dossiers que l'on vient de créer `data/generator/sfDoctrineModule/themeName`, on voit qu'il y a beaucoup de fichier. Tous ces fichiers sont séparés dans 3 dossiers différents.

    parts/
      actionsConfiguration.php batchAction.php configuration.php createAction.php deleteAction.php
      editAction.php fieldsConfiguration.php filterAction.php filtersAction.php indexAction.php
      newAction.php paginationAction.php paginationConfiguration.php processFormAction.php
      sortingAction.phpsortingConfiguration.php updateAction.php
    skeleton/
      actions/
        actions.class.php
      config/
        generator.yml
      lib/
        configuration.php helper.php
      templates/
    template/
      actions/
        actions.class.php
      lib/
        helper.php
      templates/
        _assets.php _filters_field.php _filters.php _flashes.php _form_actions.php _form_field.php
        _form_fieldset.php _form_footer.php _form_header.php _form.php _list_actions.php
        _list_batch_actions.php _list_field_boolean.php _list_footer.php _list_header.php
        _list_td_actions.php _list_td_batch_actions.php _list_td_stacked.php _list_td_tabular.php
        _list_th_stacked.php _list_th_tabular.php _list.php _pagination.php editSuccess.php
        indexSuccess.php newSuccess.php

### Le dossier "*parts*"

Dans ce dossier, on trouve le contenu du fichier `actions.class.php` qui sera généré dans le cache, si l'on souhaite modifié le comportement du module, comme ajouter des actions, c'est à ce niveau que l'on doit le faire. Ce dossier contient de multiple fichier php, comme ça si l'on veut modifier quelque chose on ne modifie que le fichier qui contient le code qui nous intéresse.

### Le dossier "*skeleton*"

Ce dossier contient les fichiers qui seront créés dans le module au moment où l'on va taper la ligne de commande suivante.

    ./symfony doctrine:generate-admin bo Module --theme=themeName

### Le dossier "*template*"

Ce dossier contient tout le code php qui sera créé dans le dossier de cache, ce sont les fichiers que l'on doit modifier si l'on veut changer le rendu du module. On veut également voir que le fichier `actions.class.php` inclut tous les fichiers qui sont situés dans le dossier *parts*

## Format utilisé pour tous ces fichiers

Les fichiers générés sont au format php, donc il a fallu définir une syntaxe pour générer du code php à partir d'un script php, c'est-à-dire du code qui ne sera pas interprété. Donc les fichiers contiennent le code suivant :

{% highlight php %}
<?php
[?php use_helper('I18N', 'Date') ?]
[?php include_partial('<?php echo $this->getModuleName() ?>/assets') ?]

<div id="sf_admin_container">
<h1>[?php echo <?php echo $this->getI18NString('new.title') ?> ?]</h1>
{% endhighlight %}

Au moment où ce fichier sera créé en cache, tout le php sera interprété et les caractères `[?php ?]` seront convertis en `<?php ?>`. Et donc on aura le fichier suivant dans le cache :

{% highlight php %}
<?php
<?php use_helper('I18N', 'Date') ?>
<?php include_partial('module_name/assets') ?>

<div id="sf_admin_container">
    <h1><?php echo __('mon titre') ?></h1>
{% endhighlight %}

## Comment utiliser le thème que l'on vient de créer

Pour ça il y a deux solutions, soit on a déjà créé le module dans notre back-office et là il faut modifier le fichier `generator.yml`.

{% highlight yaml %}
generator:
  class: sfDoctrineGenerator
  param:
    model_class:           Post
    theme:                 admin
    non_verbose_templates: true
{% endhighlight %}

Soit on doit créer le module en rajoutant l'option thème dans la ligne de commande suivante :

    ./symfony doctrine:generate-admin bo Module --theme=themeName

Pour plus d'information sur l'admin-generator n'hésitait pas à consulter [la documentation](http://www.symfony-project.org/reference/1_4/en/06-Admin-Generator).
