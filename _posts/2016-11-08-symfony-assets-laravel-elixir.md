---
layout: post
title: "Symfony : Gerer ses assets avec Laravel Elixir"
---

Cela fait un moment que je cherchais comment gérer facilement les assets dans mes projets Symfony, surtout depuis qu'Assetic n'est plus activé par défaut.

Et aujourd'hui je pense que j'ai trouvé la solution, *Laravel Elixir*, il s'agit d'une surcouche à Gulp et qui s'installe très facilement.

```
yarn add --dev gulp laravel-elixir laravel-elixir-browserify-official
```

Ensuite, il faut créer un fichier `gulpfile.js`.

```javascript
const elixir = require('laravel-elixir');

elixir.config.assetsPath = 'app/Resources/assets';
elixir.config.publicPath = 'web/assets';

elixir(function (mix) {
    mix
        .sass('app.scss')
        .browserify('app.js')
        .copy('app/Resources/assets/images', 'web/assets/images')
    ;
});
```

Pour l'utiliser rien de plus simple.

```
gulp
gulp --production
```

Et c'est tout!

Pour avoir plus d'information sur Laravel Elixir, vous pouvez trouver la documentation [ici](https://laravel.com/docs/master/elixir).
