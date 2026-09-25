// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ionicinnovate.com',

  // The live site serves directory URLs (/contact/, /ionic-erp/). These two
  // settings preserve them exactly. Changing either would 404 every
  // indexed URL and throw away the site's existing search ranking.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  // The Process Compass moved onto the platform it belongs to. This URL was
  // shared before the move, so it redirects rather than 404s.
  redirects: {
    '/compass': '/process-genesis/#compass',
  },

  integrations: [
    react(),
    sitemap({
      // contact.php is a form handler, not a page. /compass/ is a redirect
      // stub, and indexing it would compete with the page it points at.
      filter: (page) => !page.includes('contact.php') && !page.includes('/compass/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
