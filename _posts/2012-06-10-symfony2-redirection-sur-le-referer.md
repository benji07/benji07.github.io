---
layout: post
title: "Symfony2 Redirection sur le Referer"
---

Je suis toujours en train de cherche comment on doit **rediriger** vers le **referer** dans **Symfony2**, alors je le note ici, je pense que celà peut servir a beaucoup de monde

    [php]
    <?php
    $referer = $this->getRequest()->headers->get('referer');

    return $this->redirect($referer);