---
layout: post
title: "SonataAdminBundle - Filtrer en fonction de l'utilisateur courant"
old: 58
---

Dans mon dernier projet, j'ai dû lier une interface admin à un utilisateur, c'est-à-dire que je ne devais afficher que les objets que l'utilisateur a crée. Lorsqu'il crée un nouvel objet, on doit directement l'y associer.

Cette modification s'effectuer en 2 étapes, tous d'abord, on va lier l'utilisateur avec l'objet que l'on crée dans l'admin.

Au niveau de notre classe Admin, on doit définir la méthode `getNewInstance`, ainsi qu'une méthode qui permet d'injecter le security context afin de récupérer l'utilisateur courant.

{% highlight php %}
<?php
class ObjectAdmin extends Admin
{
    private $context;

    public function getNewInstance()
    {
        return new Object($this->getUser());
    }

    public function setSecurityContext($context)
    {
        $this->context = $context;
    }

    public function getUser()
    {
        $token = $this->context->getToken();
        if (null !== $token) {
            return $token->getUser();
        }
        return null;
    }
}
{% endhighlight %}

Ensuite au niveau de notre fichier `services.xml` on doit ajouter le `security context`.

{% highlight xml %}
<service id="admin.object" class="%admin.object.class%">
    <tag name="sonata.admin"/>

    <call method="setSecurityContext">
        <argument type="service" id="security.context"/>
    </call>
</service>
{% endhighlight %}

Deuxième étape, on ne doit afficher que les objets de l'utilisateur, pour ce là, on doit étendre le `ModelManager` et redéfinir la méthode `createQuery`

{% highlight php %}
<?php
use Sonata\AdminBundle\Model\ORM\ModelManager;

class ObjectModelManager extends ModelManager
{
    private $context;

    public function __construct(EntityManager $em, $security_context)
    {
        parent::__construct($em);
        $this->context = $security_context;
    }

    public function getUser()
    {
        $token = $this->context->getToken();
        if (null !== $token) {
            return $token->getUser();
        }
        return null;
    }

    public function createQuery($class, $alias = 'o')
    {
        $qb = parent::createQuery($class, $alias);

        $qb->andWhere($alias.'.user = :user');
        $qb->setParameter('user', $this->getUser());

        return $qb;
    }
}
{% endhighlight %}

Ensuite on doit ajouter un service associé a cette classe

{% highlight xml %}
<service id="admin.object.manager" class="%admin.object.manager%">
    <argument type="service" id="doctrine.orm.entity_manager" />
    <argument type="service" id="security.context" />
</service>
{% endhighlight %}

Et définir dans la configuration du projet que l'on veut utiliser notre classe.

{% highlight yaml %}
# config.yml
sonata_admin:
    admin_services:
        admin.object:
            model_manager: admin.object.manager
{% endhighlight %}
