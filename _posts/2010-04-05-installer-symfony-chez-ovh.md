---
layout: post
title: "Installer symfony chez ovh"
---

Modifier le fichier htaccess pour utiliser php5 au lieu de php4.

    SetEnv PHP_VER 5
    SetEnv SESSION_USE_TRANS_SID 0

La deuxième ligne sert a cacher l'id de session, car par défaut chez ovh elle apparait dans l'url;