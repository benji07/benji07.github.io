// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site utilisateur GitHub Pages servi sur le domaine racine : pas de `base`.
// Les autres projets (food, photo-explore, film-vault) sont des sites de
// projet servis sous benjamin.leveque.me/<repo>/ ; ne jamais créer de page
// à ces chemins-là ici.
export default defineConfig({
  site: 'https://benjamin.leveque.me',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    // Images distantes téléchargées et optimisées au build : la photo de
    // profil Gravatar et les dernières photos Instagram.
    remotePatterns: [
      { protocol: 'https', hostname: 'gravatar.com' },
      { protocol: 'https', hostname: '**.gravatar.com' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
