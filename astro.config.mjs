import { defineConfig } from 'astro/config';

// Cloudflare supplies CF_PAGES_URL. Set SITE_URL for a custom domain.
export default defineConfig({
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || undefined,
  output: 'static',
  trailingSlash: 'always',
  server: { host: '0.0.0.0', port: 4173 },
  devToolbar: { enabled: false },
  vite: { server: { allowedHosts: ['terminal.local'] } },
});
