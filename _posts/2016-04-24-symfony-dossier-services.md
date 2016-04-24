---
layout: post
title: "Symfony : Mieux structurer ces déclarations de services"
---

Par défaut lorsque l'on crée un bundle, celui-ci ne charge qu'un seul fichier de service via le code suivant:

```php
$loader = new YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
$loader->load('services.yml');
```

Lorsque l'on développe une grosse application, mais qu'on ne souhaite qu'un seul bundle, on se retrouve avec des dizaines de fichiers de services et le fichier `src/AppBundle/DependencyInjection/AppExtension.php` commence à ressembler à cela:

```php
$loader->load('services.yml');
$loader->load('customer.yml');
$loader->load('group.yml');
$loader->load('product.yml');
$loader->load('admin/customer.yml');
$loader->load('admin/group.yml');
$loader->load('admin/product.yml');
...

```

Si l'on charge les fichiers de services depuis le fichier `app/config/config.yml`, on peut importer un dossier ce qui va charger tout les fichiers qu'il contient, mais impossible de modifier les services lorsqu'ils sont chargé de cette façon.

Pour reproduire ce comportement dans un bundle, il suffit de modifier la manière dont sont chargé les fichiers de déclaration de services :

```php
use Symfony\Component\Config\Loader\DelegatingLoader;
use Symfony\Component\Config\Loader\LoaderResolver;
use Symfony\Component\DependencyInjection\Loader\DirectoryLoader;
$resolver = new LoaderResolver([
    new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config')),
    new DirectoryLoader($container, new FileLocator(__DIR__ . '/../Resources/config')),
]);

$loader = new DelegatingLoader($resolver);
$loader->load('services.yml');
```

Avec ce code, vous pouvez maintenant importer des dossiers en plus des fichiers yml.

```yml
# services.yml
imports:
    - { resource: services/ }
```
