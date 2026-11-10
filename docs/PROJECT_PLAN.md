# Riyadh Contractor — Project Plan

No PROJECT_PLAN.md existed before this pass, so this file records the build and adds the Motion Design System section.

## Delivered
- Astro static site: home + 13 pages × 2 languages (AR/EN) × 2 themes (light/dark), real routes, one design system.
- Photography: four WebP files in `public/images` mapped to `--img-*` variables.

## Motion Design System

Principle: less motion, better motion. The layout must work with every animation off.

### Tokens (`:root`)
| Token | Value | Use |
|---|---|---|
| `--ease` | cubic-bezier(.22,1,.36,1) | type, images, reveals, major moves |
| `--ease-ui` | cubic-bezier(.25,.8,.25,1) | header, links, crossfade |
| `--t-fast` | 200ms | hovers, arrows, close of menus |
| `--t-link` | 300ms | underline draw |
| `--t-std` | 400ms | header, dropdown, mobile menu |
| `--t-hover` | 600ms | image zoom |
| `--t-rev` | 800ms | scroll reveals, hero text |
| `--t-mask` | 800ms | image mask reveal (cards, service images, hero scene wipe) |
| `--reveal-from` | `inset(0 100% 0 0)` (LTR) / `inset(0 0 0 100%)` (RTL) | where the mask starts: the inline-start edge, so Arabic reveals right→left |
| `--mk`, `--mk-skew`, `--mk-h`, `--mk-y` | light theme on white: gold #FFB81C mixed 72% with white; dark theme and dark surfaces (page header, CTA): full gold #FFB81C. Text on it is always #17191C · .28em · .7em · .2em | skewed highlight colour, slant, band height and offset |
| `--t-major` | 1200ms | hero crossfade |
| `--hero-dur` | 8000ms | scene length / progress line |
| `--dist` | 24px | reveal distance (hero 30px, page hero 20px, mobile menu 8px) |
| `--hover-scale` | 1.03 | image hover |

### Levels
1. **Major** – hero entrance (headline 0ms, text 130ms, CTA 280ms), hero text out (−20px) / in (+20px), 1200ms video/scene crossfade, signature scroll moment.
2. **Content** – one reveal pattern (`.rv`: 24px + fade, once), images add scale 1.02→1 (`.rv-i`), one mask reveal (`.rv-mask`: home intro, project and sector cards, service-page image), grid stagger 70ms capped at 3, count-up 1.4s.
3. **Micro** – link underline draws left→right, arrows move 5px, buttons scale 1.01, card images 1.03, form border colour, footer underline.

### Utilities
`.hi` hero entrance · `.rv` / `.rv-i` / `.rv-mask` reveals (added by `reveal()` via one IntersectionObserver) · `sig()` signature moment (one rAF-throttled scroll listener, active only while visible) · `pageIn()` page transition · `@keyframes up/fade/prog`.

### Decisions
- Skewed highlight `.mk`: written `{{phrase}}` in `site.js` headings, rendered as `<mark class="mk">` by `mk()` in `views.js`. Pure CSS (two slanted gradient caps + solid middle, `box-decoration-break: clone`), so it wraps across lines and works in RTL. Static, no animation, always behind the text. Used on: home h2, CTA, About/Business/Energy/Infrastructure/Buildings/Contact h1. Page body h2 strips the markers (`plain()`) so a page never shows it twice. One phrase per heading.
- Image mask reveal `.rv-mask`: clip-path inset wipe, once, 800ms, staggered by the card's `--d`. A clipped element reports no intersection, so `app.js` observes its parent. Hidden state only applies with JS, clip-path support and motion allowed. Hero: the first scene paints instantly (LCP); later scenes enter with the same wipe (`.hs.wipe`) while the previous scene stays underneath.
- Hero progress line (thin, brand gold) drives autoplay via `animationend`; hover or focus pauses it. No dots, no arrows and no play/pause button (removed).
- Header is transparent over the hero, solid after 40px scroll (colour/border transition only, no height change, no blur).
- Dropdown: fade + 6px drop, 40ms link stagger, faster close. Mobile menu: fade + 8px, 40ms stagger.
- Page transition: removed (multi-page routes now); candidate for Astro View Transitions.
- Signature moment: home full-bleed image widens from inset to full width as it scrolls in, with the statement rising 24px. Static on mobile and reduced motion.
- No custom cursor, no parallax, no splash screen. Footer is static apart from hover.
- Reduced motion: all transitions and animations off, count-up shows final value, reveals not applied (content visible), no autoplay, no scroll-linked effect.
- Mobile (<=760px): signature effect off, no hover dependence; menu 400ms.

### Review checklist
Hero sequence calm and ordered · only one mask reveal · nothing animates twice · reduced motion usable · static design holds up · hover effects under 1.04 scale.

### Revision 2 (cards, reveal, app bar)
- **Image reveal (`.rv-mask`)**: the frame opens top → bottom (1.2s) while the photo settles from a 1.28 zoom (1.8s). Uses the `scale` property, so hover zoom (`transform`) still composes. Hero scene wipe is unchanged (still uses `--reveal-from`).
- **Sequential text (`.rv-seq` + `.sq`)**: inside a card / group, children marked `.sq` enter one after another in the order of `--k` (start `--b` 200ms, step `--sp` 110ms, plus the card's own `--d` stagger). Used by service cards, project cards, why-us cards, tips, the home/page text blocks and the footer (footer: start 0ms, step 70ms, columns offset by 90ms).
- **Cards**: one family (`.card`, `.su-i`, `.ni`): surface + border + 10px radius, service tag on the photo, icon facts, arrow button, accent bar that draws on hover, 6px lift.
- **No empty space**: services = one tall card + two horizontal cards; projects = mosaic 7+5 / 4+4+4 repeating, any leftover card widens to fill the row; tablet = last odd card spans the full row; tips list stretches to the height of the featured card.
- **App bar**: `<meta name="theme-color">` is set before paint and updated by `app.js` (`paintBar`). Colours live as data attributes on that meta in `Layout.astro` (`data-hero`, `data-light`, `data-dark`). Also `html` background follows the page, and the dark scrolled header on home now matches the dark header of inner pages.
- **Page header**: lead text is light on the navy band in both themes; breadcrumb (links, `/` and current page) uses the brand gold.

### Revision 3 (logo and palette)
- **Logo**: the supplied `Riyadh Contractor` / `مقاول الرياض` designs were traced to vectors (`src/data/logo.js`, `public/brand/`). One shared R mark; Arabic wordmark from the one-line Arabic version, English wordmark from the stacked `Riyadh Contractor` version (the `Riyadh Contracting` file was not used: the brand name everywhere else is "Contractor"). English lockup puts the mark first (left); Arabic keeps it on the right, so the mark is always at the inline-start edge.
- **Theming**: ink = `currentColor` (`--logo-ink`), gold = `--logo-gold`; white over the hero and on dark surfaces, navy on light. Logo is defined once per page as an SVG `<symbol>` and reused by Header and Footer.
- **Palette back to orange (light) / gold (dark)**: `--navy` `#17263B`, `--or`/`--acc` `#F36B2B`, `--gold` `#FFB81C` (`--acc` becomes gold in dark). `--or-t` (text-size orange) is `#C94E12` on light and `#F36B2B` on dark; dark-surface focus ring and breadcrumb hover use `#FF8D57`. The logo uses `--brand-navy` `#042654` and `--brand-gold`, now orange `#F36B2B` (brand SVG/PNG files, favicon and share images regenerated).
- **Mobile header**: logo steps down (28 / 24 / 20px) and header controls no longer shrink; no overflow at 320, 360, 390px in AR and EN.
- Favicon and apple-touch-icon replaced with the R mark.

### Revision 4 (links, legal, 404, projects, share images)
- **Social/legal**: `SOCIAL` list (empty URLs are hidden), privacy and terms pages in both languages, legal links in the footer bar, `sameAs` in JSON-LD. Contact column links open with `rel="me noopener"` and a screen-reader "opens in a new tab" note.
- **404**: one bilingual `/404.html`, `noindex`, language chosen from the address. Header language link goes to the home page of the other language.
- **Project detail pages**: 6 routes per language from `PJ` + `PJD`; card links now go to them (was: contact page); card link text is "View project". Page = breadcrumb header, brief + three facts, "what we did" points, previous / all / next, CTA. Header keeps "Our work" highlighted. Breadcrumb JSON-LD added.
- **Share images**: generated, not drawn by hand: navy gradient over the page photo (starts at the inline-start side, so Arabic puts text on the right), logo, title, one-line summary, phone. 42 JPEGs, about 2.9 MB in total.
- Sitemap now lists project pages. Build: 44 pages. Internal link check: 1,627 links, none broken.

### Status / remaining
Done: bilingual content model, `/ar` `/en` routes, hreflang/canonical/OG/JSON-LD/sitemap/robots, light+dark tokens, no-flash theme, logical-property RTL, Arabic type system, build-time HTML, localized forms and ARIA labels.
Verified in revision 3: `npm install && npm run build` (27 pages) and header/footer screenshots in AR/EN, light/dark, desktop and mobile. Still not verified: visual QA of AR+Dark / AR+Light at 360, 768, 1280px, hero in RTL, keyboard and screen-reader pass, contrast audit of gold on `--bg2`.
Remaining: real `site` origin; real photography and per-image alt text; hero videos (`public/videos`); real social profile URLs (`SOCIAL`); legal review of privacy and terms; real project stories, photos and galleries in `PJ` / `PJD`; Arabic copy review by a native editor; visual QA of the new pages (project, legal, 404) in AR+EN, light+dark, 360 / 768 / 1280 px; optional View Transitions for page changes; re-run `npm run og` after the real domain, titles or photos change.
