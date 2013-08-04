---
layout: post
title: "Symfony2 : Redéfinir les templates d'un Bundle"
---

Pour savoir quel template **Symfony2** doit charger, il regarde dans les dossiers suivants et dans cet ordre bien précis :

    /app/views/%bundle%/%controller%/%name%%format%.%renderer%
    /src/Application/%bundle%/Resources/views/%controller%/%name%%format%.%renderer%
    /src/Bundle/%bundle%/Resources/views/%controller%/%name%%format%.%renderer%
    /src/vendor/symfony/src/Symfony/Bundle/%bundle%/Resources/views/%controller%/%name%%format%.%renderer%
    
Donc si dans une action, vous voulez rendre le template BlogBundle:Default:index.html.twig.

    [php]
    return $this->render('BlogBundle:Default:index.html.twig', array());

 **Symfony2** va essayer de charger les fichiers suivants:

    /app/views/BlogBundle/Default/index.html.twig
    /app/Application/BlogBundle/Resources/views/Default/index.html.twig
    /app/Bundle/BlogBundle/Resources/views/Default/index.html.twig

**Modification du 29 janvier 2011**

Comme me la signalé **GromNaN**, tout le code écrit au dessus ne concerne que la version **PR5** de **Symfony2**.

Voilà, au jour d'aujourd'hui comment fonctionne la redéfinition des templates :

Toujours en partant de l'exemple que j'utilise plus haut `BlogBundle:Default:index.html.twig`

**Symfony2** va d'abord regarder si le fichier suivant existe

    /app/BlogBundle/views/Default/show.html.twig

Si ce fichier n'existe pas, alors le Kernel va essayé de trouver la ressource suivante en prenant en compte la possibilité de redéfinir les Bundles:

    @BlogBundle/Resources/view/Default/show.html.twig