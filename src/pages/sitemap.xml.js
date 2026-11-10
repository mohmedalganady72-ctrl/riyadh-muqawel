import { LANGS, PAGES, PJ_IDS } from '../data/site.js';
import { href } from '../lib/views.js';
export function GET({ site }) {
  const o = site.origin, ids = ['home', ...Object.keys(PAGES), ...PJ_IDS];
  const alt = (id) => LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${o}${href(l, id)}"/>`).join('');
  const urls = ids.flatMap((id) => LANGS.map((l) => `<url><loc>${o}${href(l, id)}</loc>${alt(id)}</url>`)).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
