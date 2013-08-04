---
layout: post
title: "Symfony2 - Executer une commande depuis un controller"
---

Il n'existe pas vraiment de méthode toute faite, il faut créer une application à partir du kernel et appeler la méthode doRun.

    [php]

    use Symfony\Bundle\FrameworkBundle\Console\Application;
    use Symfony\Component\Console\Input\ArrayInput;
    use Symfony\Component\Console\Output\NullOutput;

    public function runCommand($command, $arguments = array())
    {
        $kernel = $this->container->get('kernel');
        $app = new Application($kernel);

        $args = array_merge(array('command' => $command), $arguments);

        $input = new ArrayInput($args);
        $output = new NullOutput();

        return $app->doRun($input, $output);
    }

Après au niveau de votre contrôleur vous pouvez faire

    [php]
    public function sendMailAction()
    {
        $this->runCommand('app:send-mail');
    }

### Modification du 23/01/12

Attention cette méthode ne correspond pas a une bonne pratique, pour faire plus propre, vous pouvez définir un service qui contient votre logique métier, et l'appeler dans la tâche et dans l'action.