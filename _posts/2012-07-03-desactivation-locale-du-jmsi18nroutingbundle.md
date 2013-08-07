---
layout: post
title: "Désactivation locale du JMSI18nRoutingBundle"
old: 69
---

Après avoir configuré le [JMSI18nRoutingBundle](https://github.com/schmittjoh/JMSI18nRoutingBundle) pour un projet, je me suis rendu compte d'un problème avec son API, en effet, celle-ci, normalement accessible via /api s'est retrouvée transformée en /en/api.

{% highlight yaml %}
jms_i18n_routing:
    default_locale: en
    locales:        [en, fr]
    strategy:       prefix
{% endhighlight %}

Il n'y a, de plus, aucune indication dans la documentation du Bundle concernant une possible suppression du préfixe de langue, mais en regardant de plus prêt les tests on peut y trouver une option "i18n = false", permettant de désactiver ponctuellement le comportement du bundle.

{% highlight php %}
<?php

/**
 * @Route("/api/users", name="api_users", options={"i18n" = false})
 */
public function usersAction()
{% endhighlight %}

En utilisant `app/console router:debug` on constate bien que la route n'a pas le préfixe de langue

    en__RG__homepage            ANY    /en/
    fr__RG__homepage            ANY    /fr/
    api_users                   ANY    /api/user
