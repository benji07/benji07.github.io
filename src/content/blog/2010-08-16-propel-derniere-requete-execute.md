---
title: "Propel: dernière requête executé"
old: 19
---

Voilà le code a executer, par contre il faut être dans l'environnement de dev sinon la requête ne s'affichera pas.

```php
<?php
echo Propel::getConnection()->getLastExecutedQuery();
```
