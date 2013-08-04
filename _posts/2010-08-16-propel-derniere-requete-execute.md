---
layout: post
title: "Propel: dernière requête executé"
---

Voilà le code a executer, par contre il faut être dans l'environnement de dev sinon la requête ne s'affichera pas.

    [php]
    echo Propel::getConnection()->getLastExecutedQuery();