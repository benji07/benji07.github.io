export const SITE = {
  name: 'Benjamin Lévêque',
  description:
    "Photographie argentique et tirage couleur RA-4 fait maison. Développeur chez Elao. Initiations au tirage couleur, portfolio et projets.",
  instagram: 'https://www.instagram.com/benji07/',
  instagramHandle: '@benji07',
  github: 'https://github.com/benji07',
  linkedin: 'https://www.linkedin.com/in/benjaminleveque/',
  // Hash MD5 de l'adresse perso, utilisé uniquement pour récupérer la photo
  // Gravatar au build (elle est ensuite servie depuis le site lui-même).
  gravatar: 'https://gravatar.com/avatar/b9fe4a1c9e1780bd885841019153e036?s=480',
};

// Les autres projets perso, affichés en liste compacte sur l'accueil.
export const PROJECTS = [
  { name: 'My Film Vault', hint: 'pellicules', url: 'https://benjamin.leveque.me/film-vault/' },
  { name: "benji07's food", hint: 'recettes', url: 'https://benjamin.leveque.me/food/' },
  { name: 'Photo·Explore', hint: 'culture photo', url: 'https://benjamin.leveque.me/photo-explore/' },
  { name: 'Cadre', hint: 'app macOS', url: 'https://github.com/benji07/cadre-app' },
  { name: 'RA-4 Print Flasher', hint: 'Arduino', url: 'https://github.com/benji07/ra4-print-flasher' },
];
