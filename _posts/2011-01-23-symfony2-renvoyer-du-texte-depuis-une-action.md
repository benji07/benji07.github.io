---
layout: post
title: "Symfony2 : renvoyer du texte depuis une action"
---

Dans symfony 1, tous le monde utilise la méthode suivante pour renvoyer du texte et/ou du json lors d'un appel ajax.

    [php]
    return $this->renderText(json_encode($data));
    
Je viens juste de trouver l'équivalent pour **Symfony2**:

    [php]
    return $this->createResponse(\json_encode($data));