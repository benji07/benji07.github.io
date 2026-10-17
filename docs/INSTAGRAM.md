# Photos Instagram sur l'accueil

L'accueil affiche les 6 dernières publications de @benji07. Elles sont
récupérées pendant le build, via l'API officielle d'Instagram, puis
téléchargées et servies depuis le site (les URL d'Instagram expirent).
Le workflow de déploiement tourne chaque nuit pour les mettre à jour.

Sans configuration, ou si l'API ne répond pas, l'accueil affiche à la place
les dernières photos du portfolio. Rien ne casse.

## Mise en place (une fois)

1. Le compte Instagram doit être un compte professionnel (Créateur ou
   Entreprise). Un compte Créateur convient.
2. Sur [developers.facebook.com](https://developers.facebook.com/apps), crée
   une app (type « Business » ou cas d'usage « Gérer les messages et le
   contenu sur Instagram »).
3. Ajoute le produit **Instagram** → « Configuration de l'API avec la
   connexion Instagram ».
4. Dans « Générer des jetons d'accès », ajoute le compte benji07 (il faut
   parfois accepter l'invitation de testeur dans l'app Instagram), puis
   clique sur « Générer un jeton ». La permission `instagram_business_basic`
   suffit. L'app peut rester en mode développement : pas de validation
   Meta nécessaire pour ton propre compte.
5. Dans le dépôt GitHub, *Settings → Secrets and variables → Actions*, crée
   le secret `INSTAGRAM_ACCESS_TOKEN` avec ce jeton.

## Renouvellement du jeton

Le jeton expire au bout de 60 jours. Le workflow
`refresh-instagram-token.yml` le prolonge chaque lundi et réécrit le secret.
Il lui faut un second secret, `GH_SECRETS_TOKEN` : un
[fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
limité à ce dépôt, avec la permission **Secrets : Read and write**.

Si le jeton expire quand même (renouvellement en panne plus de 60 jours,
mot de passe Instagram changé…), regénère-le à l'étape 4 et remplace le
secret.
