// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ionicinnovate.com',

  // The live site serves directory URLs (/contact/, /ionic-erp/). These two
  // settings preserve them exactly — changing either would 404 every
  // indexed URL and throw away the site's existing search ranking.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  integrations: [
    react(),
    sitemap({
      // contact.php is a form handler, not a page.
      filter: (page) => !page.includes('contact.php'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
