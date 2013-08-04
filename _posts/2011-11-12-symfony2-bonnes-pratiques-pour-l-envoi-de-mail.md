---
layout: post
title: "Symfony2 - Bonnes pratiques pour l'envoi de mail"
---

En regardant le [FOSUserBundle](https://github.com/FriendsOfSymfony/FOSUserBundle), j'ai découvert une technique très int"ressante pour gérer les mails d'une application ou d'un bundle. Dans ce bundle, ils utilisent un service pour envoyer tous leur mails, ce qui apporte une couche d'abstraction supplémentaire au-dessus de Swift Mailer. Et ce là permet de garder le code des contrôleurs relativement propre.

J'ai appliqué cette même technique pour l'envoi des mails de ce blog, voici le code de la page "À propos" de mon site.

    [php]
    public function aboutAction()
    {
        $form = $this->createForm(new ContactType);
        
        if ('POST' === $this->getRequest()->getMethod()) {
            $form->bindRequest($this->getRequest());
            
            if ($form->isValid()) {
                $this->get('benji07.mailer')->sendContactMessage($form->getData());
                
                return $this->redirect('/about');
            }
        }
        
        return array('form' => $form->createView());
    }

Comme vous pouvez le voir dans cette action, on sait seulement que l'on doit envoyer un message à partir des informations saisies dans le formulaire de contact, mais on ne sais pas comment celui-ci va être envoyé. On pourrait très bien l'envoyer via Swift Mailer ou alors directement via `mail()`.

Dans mon cas, j'ai suivi l'implémentation faite dans [FOSUserBundle](https://github.com/FriendsOfSymfony/FOSUserBundle) en ajoutant une dépendance afin de générer des mails en html :

    [php]
    use Symfony\Component\Templating\EngineInterface;

    class Mailer
    {
        protected $mailer;

        protected $templating;

        public function __construct(\Swift_Mailer $mailer, EngineInterface $templating)
        {
            $this->mailer = $mailer;

            $this->templating = $templating;
        }

        public function sendContactMessage($contact)
        {
            $template = 'Benji07MainBundle:Mail:contact.html.twig';

            $from = $contact->getEmail();

            $to = 'admin@example.com';

            $subject = '[benjamin.leveque.me] Formulaire de contact';

            $body = $this->templating->render($template, array('contact' => $contact));

            $this->sendMessage($from, $to, $subject, $body);
        }

        protected function sendMessage($from, $to, $subject, $body)
        {
            $mail = \Swift_Message::newInstance();

            $mail
                ->setFrom($from)
                ->setTo($to)
                ->setSubject($subject)
                ->setBody($body)
                ->setContentType('text/html');

            $this->mailer->send($mail);
        }
    }
    
Avec cette technique, on peut facilement redéfinir la façon d'envoyer les mails et leur contenu sans toucher à la logique métier.