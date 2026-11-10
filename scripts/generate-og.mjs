// Share images (Open Graph / Twitter): 1200x630 JPEGs, one per page per language, written to public/og/<lang>/<id>.jpg
// ("projects/<slug>" becomes "projects-<slug>.jpg"). Text and photos come straight from src/data/site.js, so run this whenever
// titles, projects or photos change:   npm run og
// Needs the dev dependencies @resvg/resvg-js and sharp. Fonts are bundled in scripts/fonts (IBM Plex Sans Arabic, Manrope).
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { META, HOMET, PAGES, PJ, PJD, CONTACT, UI } from '../src/data/site.js';
import { LOGO } from '../src/data/logo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = ['IBMPlexSansArabic-Bold.ttf', 'IBMPlexSansArabic-Regular.ttf', 'Manrope-ExtraBold.ttf', 'Manrope-Medium.ttf'].map((f) => path.join(root, 'scripts/fonts', f));
const W = 1200, H = 630, NAVY = '#042654', GOLD = '#F36B2B';
// photo key (same keys as the site) → file, and the crop focus used on the 1200x630 canvas
const PHOTO = { crane: ['villa', 'attention'], plant: ['cornice', 'centre'], bridge: ['corner', 'centre'], site: ['villa', 'centre'], tower: ['banner', 'centre'], wind: ['cornice', 'centre'], facade: ['facade', 'centre'], terrace: ['terrace', 'centre'], majlis: ['majlis', 'centre'], team: ['team', 'west'], plans: ['plans', 'west'], pergola: ['pergola', 'centre'], cracks: ['cracks', 'centre'], scaffold: ['scaffold', 'centre'], hall: ['hall', 'centre'] };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (s) => s.replace(/\{\{|\}\}/g, '');
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, '') + '…');
const firstSentence = (s) => { const m = s.match(/^.+?[.،؛](\s|$)/); return m ? m[0].trim() : s; };

// Greedy word wrap with an average-glyph-width estimate (bold Latin ≈ .56 em, Arabic ≈ .5 em).
function wrap(text, size, maxW, ar, maxLines) {
  const cw = size * (ar ? 0.5 : 0.56), words = text.split(/\s+/), lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1], next = cur ? cur + ' ' + w : w;
    if (next.length * cw <= maxW || !cur) lines[lines.length - 1] = next; else lines.push(w);
  }
  if (lines.length > maxLines) { const keep = lines.slice(0, maxLines); keep[maxLines - 1] = clip(keep[maxLines - 1] + ' ' + lines.slice(maxLines).join(' '), Math.floor(maxW / cw)); return keep; }
  return lines;
}

function overlay(lang, { eyebrow, title, sub }) {
  const ar = lang === 'ar', lg = LOGO[lang], font = ar ? 'IBM Plex Sans Arabic' : 'Manrope';
  const edge = 84, x = ar ? W - edge : edge, anchor = ar ? 'end' : 'start', maxW = 800;
  const tSize = ar ? 66 : 62, lh = ar ? 92 : 76;
  const tl = wrap(title, tSize, maxW, ar, 3), sl = wrap(sub, 30, maxW, ar, 2);
  const logoH = 62, logoW = Math.round((lg.w * logoH) / lg.h), logoX = ar ? W - edge - logoW : edge;
  const blockH = (eyebrow ? 46 : 0) + tl.length * lh + (sub ? 24 + sl.length * 44 : 0);
  let y = Math.round(H / 2 + 36 - blockH / 2) + 40;
  let out = '';
  if (eyebrow) { out += `<text x="${x}" y="${y}" font-family="${font}" font-weight="${ar ? 700 : 800}" font-size="28" fill="${GOLD}" text-anchor="${anchor}" ${ar ? '' : 'letter-spacing="2"'}>${esc(ar ? eyebrow : eyebrow.toUpperCase())}</text>`; y += 46; }
  y += tSize * 0.6;
  for (const l of tl) { out += `<text x="${x}" y="${y}" font-family="${font}" font-weight="${ar ? 700 : 800}" font-size="${tSize}" fill="#fff" text-anchor="${anchor}">${esc(l)}</text>`; y += lh; }
  if (sub) { y += -8; for (const l of sl) { out += `<text x="${x}" y="${y}" font-family="${font}" font-weight="${ar ? 400 : 500}" font-size="30" fill="#d6dce3" text-anchor="${anchor}">${esc(l)}</text>`; y += 44; } }
  const grad = ar ? ['1', '0'] : ['0', '1'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><linearGradient id="g" x1="${grad[0]}" y1="0" x2="${grad[1]}" y2="0"><stop offset="0" stop-color="${NAVY}" stop-opacity=".94"/><stop offset=".55" stop-color="${NAVY}" stop-opacity=".78"/><stop offset="1" stop-color="${NAVY}" stop-opacity=".30"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<svg x="${logoX}" y="52" width="${logoW}" height="${logoH}" viewBox="0 0 ${lg.w} ${lg.h}"><path fill="#fff" d="${lg.word}"/><rect fill="${GOLD}" x="${lg.barX}" y="${LOGO.barTop}" width="${LOGO.barW}" height="${LOGO.barH}"/><g transform="translate(${lg.markX} 0)"><path fill="#fff" d="${LOGO.mark.navy}"/><path fill="${GOLD}" d="${LOGO.mark.gold}"/></g></svg>
${out}
<rect x="0" y="${H - 10}" width="${W}" height="10" fill="${GOLD}"/>
<text x="${x}" y="${H - 44}" font-family="${font}" font-weight="${ar ? 700 : 800}" font-size="26" fill="#fff" text-anchor="${anchor}" direction="ltr" unicode-bidi="plaintext">${esc(CONTACT.phone)}  ·  ${esc(UI.contact[lang])}</text>
</svg>`;
}

async function render(lang, key, photoKey, text) {
  const [file, pos] = PHOTO[photoKey];
  const svg = overlay(lang, text);
  const png = new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: lang === 'ar' ? 'IBM Plex Sans Arabic' : 'Manrope' } }).render().asPng();
  const buf = await sharp(path.join(root, 'public/images', file + '.webp')).resize(W, H, { fit: 'cover', position: pos }).composite([{ input: png }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  const dir = path.join(root, 'public/og', lang); mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, key.replace(/\//g, '-') + '.jpg'), buf);
  return buf.length;
}

const jobs = [];
for (const lang of Object.keys(META)) {
  const brand = META[lang].name;
  jobs.push([lang, 'home', 'crane', { eyebrow: '', title: plain(HOMET.h[lang]).replace(/\.$/, ''), sub: '' }]);
  for (const [id, p] of Object.entries(PAGES)) jobs.push([lang, id, p.img, { eyebrow: brand, title: p.t[lang], sub: clip(firstSentence(p.d[lang]), 130) }]);
  for (const x of PJ) jobs.push([lang, 'projects/' + x[5], x[4], { eyebrow: `${x[1][lang]} · ${x[2][lang]}`, title: x[0][lang], sub: clip(firstSentence(PJD[x[5]].brief[lang]), 130) }]);
}
let total = 0;
for (const j of jobs) total += await render(...j);
console.log(`${jobs.length} images → public/og (${(total / 1024).toFixed(0)} KB total)`);
