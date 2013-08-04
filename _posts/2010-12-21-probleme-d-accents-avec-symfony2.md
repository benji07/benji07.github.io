---
layout: post
title: "Problème d'accents avec Symfony2"
---

Si vous avez une base de données en UTF-8, et que vous avez des problèmes d'accents comme dans la chaine suivante :

> Probl�me d'accents avec Symfony2

Ce problème apparait parce que la connexion a MySQL n'est pas en UTF-8, et que la commande suivante n'est pas executé :

    [sql]
    SET NAMES UTF-8;
    
Tous ce que vous avez a faire pour corriger ce problème, c'est d'ajouter la classe `MysqlSessionInit` dans le gestionnaire d'évènements de Doctrine 2.

Le meilleur endroit pour executer le code suivant est la méthode `boot()` d'un de vos bundle (dans mon blog, le Bundle MainBundle).

    [php]
    <?php

    namespace Application\MainBundle;

    use Symfony\Component\HttpKernel\Bundle\Bundle;
    use Symfony\Component\DependencyInjection\ContainerInterface;
    use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

    use Doctrine\DBAL\Event\Listeners\MysqlSessionInit;

    class MainBundle extends Bundle
    {

        public function boot()
        {
            $this->container->
                get('doctrine.orm.entity_manager')->
                getEventManager()->
                addEventSubscriber(new MysqlSessionInit('utf8', 'utf8_unicode_ci'));
        }

    }