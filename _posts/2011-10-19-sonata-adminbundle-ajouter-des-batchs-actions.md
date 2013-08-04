---
layout: post
title: "Sonata AdminBundle: Ajouter des batchs actions"
---

Il faut commencer par redéfinir la méthode `getBatchActions` de votre classe `Admin`

    [php]
    public function getBatchActions()
    {
        $actions = parent::getBatchActions();
        
        $actions['enable'] = array(
            'label' => 'enable all',
            'ask_confirmation' => true
        );
        
        return $actions;
    }
    
Ensuite dans votre controlleur vous devez créer une action `batchActionEnable`.

    [php]
    public function batchActionEnable($query)
    {
        $objects = $query->execute();
        
        // on traite les objets ici.
        
        return new RedirectResponse($this->admin->generateUrl('list', $this->admin->getFilterParameters()));
    }
    
Cette action prend en parametre un objet du type `Sonata\AdminBundle\Datagrid\ProxyQueryInterface`