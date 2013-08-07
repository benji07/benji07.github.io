---
layout: post
title: "Symfony2 - Custom Validation Constraint et message d'erreur"
old: 59
---

Voilà un exemple de [contrainte](http://symfony.com/doc/current/cookbook/validation/custom_constraint.html) qui permet d'ajouter une erreur sur un champ spécifique, ce qui peut être utile lorsque l'on ajoute des Validator au niveau d'une classe

{% highlight php %}
<?php
class ObjectValidator extends ConstraintValidator
{
    public function isValid($value, Constraint $constraint)
    {
        if ($value->getType() == 1) {
            // si l'objet a un type 1, le champ foo ne doit pas être vide
            if ($value->getFoo() == '') {

                // on récupère la propriété courante
                $oldPath = $this->context->getPropertyPath();

                // on ce place a l'endroit où l'on veut ajouter l'erreur
                $this->context->setPropertyPath(empty($oldPath)? 'data': $oldPath.'.data');
                $this->context->addViolation($constraint->message, array(), null);

                // on revient sur la propriété courante
                $this->context->setPropertyPath($oldPath);
            }
        }

        return true;
    }
}
{% endhighlight %}
