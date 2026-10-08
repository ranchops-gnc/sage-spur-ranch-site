import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sagespurranch.farm',
  integrations: [sitemap()],
  output: 'static'
});
