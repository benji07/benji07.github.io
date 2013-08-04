---
layout: post
title: "Symfony2 : Validation groups"
---

Les groupes de validations sont une fonctionnalité qui n'est pas suffisamment mis en avant sur la documentation de Symfony2, pourtant il s'agit d'un truc qui sert souvent.

Prenons l'exemple qui est sur le site de [symfony](http://symfony.com/doc/current/book/validation.html#validation-groups) :

    [php]
    // src/Acme/BlogBundle/Entity/User.php
    namespace Acme\BlogBundle\Entity;

    use Symfony\Component\Security\Core\User\UserInterface;
    use Symfony\Component\Validator\Constraints as Assert;

    class User implements UserInterface
    {
        /**
        * @Assert\Email(groups={"registration"})
        */
        private $email;

        /**
        * @Assert\NotBlank(groups={"registration"})
        * @Assert\MinLength(limit=7, groups={"registration"})
        */
        private $password;

        /**
        * @Assert\MinLength(2)
        */
        private $city;
    }

Lorsque l'on veut valider son objet, on va utiliser la méthode suivante

    [php]
    $errors = $validator->validate($author, array('registration'));

Ou

    [php]
    $errors = $validator->validate($author);

Mais dans ces deux cas, on n'aura jamais toutes les contraintes de l'objet, pour toutes les avoir il faut utiliser la ligne suivante :

    [php]
    $errors = $validator->validate($author, array('registration', 'Default'));

Vous pouvez également définir le groupe de validation au niveau d'un FormType dans les options par défaut

    [php]
    public function getDefaultOptions()
    {
        return array(
            'validation_groups' => array('registration', 'Default')
        );
    }

Ou au moment de la création de l'objet Form

    [php]
    $this->createForm($formType, null, array('validation_groups' => array('registration', 'Default')))