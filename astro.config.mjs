import { defineConfig } from 'astro/config';

// Set the real production origin: used for canonical, hreflang and sitemap.
export default defineConfig({ site: 'https://riyadh-moqawel.vercel.app', trailingSlash: 'always', build: { format: 'directory' } });
