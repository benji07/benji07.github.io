---
layout: post
title: "Symfony2: Redirection de l'utilisateur en fonction de son rôle"
---

Dans une application que je suis en train de faire, je devais rediriger un utilisateur directement sur l'interface d'administration du site. Après quelques recherche j'ai trouvé cet article "[More Sophisticated Symfony2 Login Redirection](http://www.dobervich.com/2011/05/19/more-sophisticated-symfony2-login-redirection/)".

Le problème avec le code de l'article de Dustin Dobervich, c'est qu'il utilise 2 évênements alors qu'il existe une configuration dans le fichier **security.yml** pour faire la même chose.

    [yml]
    security:
        firewalls:
            main:
                form-login:
                    success_handler: my.success_handler

La propriété **success_handler** a besoin d'un service pour fonctionner.

    [xml]
    <?xml version="1.0" encoding="UTF-8"?>

    <container xmlns="http://symfony.com/schema/dic/services"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd">

        <parameters>
            <parameter key="my.success_handler.class">My\UserBundle\Authentication\SuccessHandler</parameter>
        </parameters>

        <services>
            <service id="my.success_handler" class="%my.success_handler.class%" public="false">
                <argument type="service" id="router"></argument>
            </service>
        </services>
    </container>    

Dans mon exemple ci-dessous, je redirige les utilisateurs qui sont super admin vers l'interface d'administration et les autres vers la page d'accueil du site.

    [php]
    <?php

    namespace My\UserBundle\Authentication;

    use Symfony\Component\Routing\RouterInterface,
        Symfony\Component\HttpFoundation\RedirectResponse,
        Symfony\Component\HttpFoundation\Request,
        Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface,
        Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

    class SuccessHandler implements AuthenticationSuccessHandlerInterface
    {
        protected $router;

        public function __construct(RouterInterface $router)
        {
            $this->router = $router;
        }

        public function onAuthenticationSuccess(Request $request, TokenInterface $token)
        {
            if ($token->getUser()->isSuperAdmin()) {
                return new RedirectResponse($this->router->generate('admin'));
            }
            else {
                return new RedirectResponse($this->router->generate('homepage'));
            }
        }
    }