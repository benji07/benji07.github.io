---
layout: post
title: "Integration du Zend Framework dans symfony 1.2+"
---

Symfony possèdent déjà beaucoup de fonctionnalité, mais comme il n'y en a jamais assez et que l'on peut toujours avoir besoin d'intégrer un moteur de recherche comme Lucene, ou de faire de la génération de fichier PDF. 

Il suffit de rajouter ces quelques lignes dans votre *ProjectConfiguration.class.php* et de mettre les fichiers du Framework dans le répertoire lib/vendor de votre application pour avoir accès aux classes du Zend Framework

    [php]
    sfToolkit::addIncludePath(sfConfig::get('sf_lib_dir').'/vendor');
    
    require_once 'Zend/Loader/Autoloader.php';
    
    spl_autoload_register(array('Zend_Loader_Autoloader','autoload'));

Dans la prochaine version de Symfony (la 2.0), il n'y aura plus de besoin de ces lignes-là, car Symfony et le Zend Framework utiliseront le même [autoloader][]

[autoloader]: http://github.com/symfony/symfony/blob/master/src/Symfony/Foundation/UniversalClassLoader.php