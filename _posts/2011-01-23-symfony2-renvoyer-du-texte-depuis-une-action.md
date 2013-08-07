---
layout: post
title: "Symfony2 : renvoyer du texte depuis une action"
old: 51
---

Dans symfony 1, tous le monde utilise la méthode suivante pour renvoyer du texte et/ou du json lors d'un appel ajax.

{% highlight php %}
<?php
return $this->renderText(json_encode($data));
{% endhighlight %}

Je viens juste de trouver l'équivalent pour **Symfony2**:

{% highlight php %}
<?php
return $this->createResponse(\json_encode($data));
{% endhighlight %}
