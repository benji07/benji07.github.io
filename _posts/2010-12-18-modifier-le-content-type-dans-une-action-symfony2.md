---
layout: post
title: "Modifier le Content-Type dans une action Symfony2"
---

Pour mon blog, j'ai eu besoin de modifier le content-type renvoyé par une de mes actions :

    [php]
    $this->get('response')->headers->set('Content-Type', 'application/rss+xml; charset=UTF-8');
    
Ce code est toujours aussi simple que la version pour symfony 1.x :

    [php]
    $this->getResponse()->setContentType('application/rss+xml; charset=UTF-8');