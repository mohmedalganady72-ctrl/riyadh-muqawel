// Opening animation (shown whenever a visitor enters the site, or on demand with ?splash). Markup only; the look and timing are in global.css
// ("Opening splash"); the show / hide logic is the small inline script in Layout.astro. Reuses the vector logo from src/data/logo.js.
import { LOGO } from '../data/logo.js';

export function splashHtml(lang) {
  const g = LOGO[lang];
  // The mark appears alone in the centre first; --sx is how far (in % of the logo's own width) the full lockup is shifted so the mark sits
  // on the screen centre, and it slides to its final centred position while the wordmark is revealed.
  const sx = (((g.w / 2) - (g.markX + LOGO.mark.w / 2)) / g.w * 100).toFixed(2);
  return `<div class="sp-p" id="sp-t"></div><div class="sp-p" id="sp-b"></div><div class="sp-glow"></div>`
    + `<svg class="sp-lg" viewBox="0 0 ${g.w} ${g.h}" style="--sx:${sx}%" focusable="false">`
    + `<path class="sp-wd" d="${g.word}"/>`
    + `<rect class="sp-bar" x="${g.barX}" y="${LOGO.barTop}" width="${LOGO.barW}" height="${LOGO.barH}"/>`
    + `<g transform="translate(${g.markX} 0)"><path class="sp-nv" d="${LOGO.mark.navy}"/><path class="sp-gd" d="${LOGO.mark.gold}"/></g>`
    + `</svg>`;
}
