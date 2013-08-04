---
layout: post
title: "Prefixer les tables dans Doctrine2"
---

Pour faire celà, il suffit d'ajouter au chargement de l'application le code suivant (par exemple dans la méthode `boot` d'un Bundle dans **Symfony2**).

    [php]
    $tablePrefix = new TablePrefix('sf2_');
    
    $entityManager->getEventManager()->
        addEventListener(\Doctrine\ORM\Events::loadClassMetadata, $tablePrefix);
        
Et la classe `TablePrefix` à ajouter dans votre application. Dans la première partie de la méthode `loadClassMetadata`, on ajoute le préfix pour toute les tables. Puis dans la deuxième partie, on modifie le nom des tables pour les relations Many-to-many.

    [php]
    <?php

    use Doctrine\ORM\Event\LoadClassMetadataEventArgs;

    class TablePrefix
    {
        protected $_prefix = '';

        public function __construct($prefix)
        {
            $this->_prefix = (string) $prefix;
        }

        public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs)
        {
            $classMetadata = $eventArgs->getClassMetadata();
            $classMetadata->setTableName($this->_prefix . $classMetadata->getTableName());

            foreach ($classMetadata->getAssociationMappings() as $fieldName => $mapping) {
                if ($mapping['type'] == \Doctrine\ORM\Mapping\ClassMetadataInfo::MANY_TO_MANY) {
                    $tableName = $classMetadata->associationMappings[$fieldName]['joinTable']['name'];
                    $classMetadata->associationMappings[$fieldName]['joinTable']['name'] = $this->_prefix . $tableName;
                }
            }
        }
    }

        
*Source : [Doctrine2 Cookbook: SQL-Table Prefixes](http://www.doctrine-project.org/docs/orm/2.0/en/cookbook/sql-table-prefixes.html)*