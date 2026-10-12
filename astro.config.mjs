// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://shahzaib.ai',
  // Serve /about (not /about/): pages build to about.html, matching sitemap and canonical URLs.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});