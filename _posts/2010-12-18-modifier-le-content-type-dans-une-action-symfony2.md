---
layout: post
title: "Modifier le Content-Type dans une action Symfony2"
old: 45
---

Pour mon blog, j'ai eu besoin de modifier le content-type renvoyé par une de mes actions :

{% highlight php %}
<?php
$this->get('response')->headers->set('Content-Type', 'application/rss+xml; charset=UTF-8');
{% endhighlight %}

Ce code est toujours aussi simple que la version pour symfony 1.x :

{% highlight php %}
<?php
$this->getResponse()->setContentType('application/rss+xml; charset=UTF-8');
{% endhighlight %}
