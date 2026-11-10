# Villa renovation contractor, Riyadh (Astro): four native experiences

> Content adapted for a villa renovation / annex / expansion contractor in Riyadh. Contact details live in `CONTACT` at the top of `src/data/site.js`. Sample project cards (`PJ`) and the brand name are placeholders to replace. Set the real domain in `astro.config.mjs` and `public/robots.txt` (search for `YOUR-DOMAIN.com`).

Arabic + Light · Arabic + Dark · English + Light · English + Dark. One identity: navy `#17263B` and charcoal with orange `#F36B2B` in light, gold `#FFB81C` in dark (the logo is navy `#042654` + orange `#F36B2B`), each language and theme designed natively rather than translated or recoloured.

## Run
```bash
npm install
npm run dev      # http://localhost:4321  (/ redirects to /en/ or /ar/ by browser language)
npm run build    # static site in dist/
```
Set the real origin in `astro.config.mjs` (`site`) and in `public/robots.txt`: canonical, hreflang and sitemap depend on it.

## Structure
```
src/data/site.js        ALL copy, as L('English','العربية') pairs + page data. Edit text here.
src/lib/views.js        build-time HTML for home + 13 pages (language-aware, RTL-aware arrows, number isolation)
src/pages/[lang]/[...slug].astro   /en/, /ar/, /en/about/, /ar/about/ ... (real static routes, SEO-friendly)
src/pages/index.astro   language entry   ·  404.astro (bilingual, noindex)  ·  sitemap.xml.js (with hreflang)  ·  public/robots.txt
scripts/generate-og.mjs  builds the 1200x630 share images into public/og/<lang>/  (npm run og)
src/layouts/Layout.astro   lang/dir, canonical, hreflang, OG, JSON-LD, per-language font, no-flash theme script
src/components/         Header (logo, nav, language link, theme toggle) · Footer
src/data/logo.js        vector logo geometry (AR + EN lockups, R mark) → inline SVG sprite built in Layout.astro
public/brand/           standalone logo files: logo-ar / logo-en (+ -light for dark backgrounds), mark / mark-light, PNG exports, favicon-512
src/scripts/app.js      theme, nav, reveals, count-up, signature scroll, forms
src/scripts/hero.js     hero behaviour (scene texts arrive via data-hero, rendered per language)
src/styles/global.css   tokens → layout → motion → hero → THEMES → i18n (Arabic/RTL)
```

## How the four experiences work
- **Language** = real URLs (`/ar/…`, `/en/…`), `<html lang dir>`, same slugs in both. The header link switches to the same page in the other language.
- **Theme** = `data-theme="light|dark"` on `<html>`. Order: saved choice → system preference; set before first paint (no flash). Tokens: `:root` (light) and `:root[data-theme=dark]`; `--acc` / `--num` carry the per-theme accent.
- **RTL** uses logical properties (`inset-inline-*`, `margin-inline-*`, `border-inline-*`); arrow glyphs, hover motion (`--x`), progress bars, link underlines and the hero overlay mirror in RTL.
- **Arabic typography**: IBM Plex Sans Arabic, no letter-spacing or uppercase, taller line-height, own hero scale. Numbers stay Latin digits (isolated with `<bdi dir=ltr>` where needed).

## Brand logo
One vector logo per language: Arabic `مقاول الرياض` and English `Riyadh Contractor`, each with the R mark (navy bars, orange building and arc) and the thin orange divider. The mark sits at the inline-start edge (right in Arabic, left in English).
- Ink uses `currentColor` and follows `--logo-ink`: navy on light surfaces, white on dark surfaces, over the home hero and in the footer. The orange follows `--logo-gold` (= `--brand-gold`, `#F36B2B`).
- Colours: `--navy` `#17263B`, `--or` / `--acc` `#F36B2B` and `--gold` `#FFB81C` in `:root` (global.css); `--brand-navy` / `--brand-gold` now drive only the logo. Text-sized orange on white uses `--or-t` (`#C94E12`); on dark it is `#F36B2B`.
- Favicon (`public/favicon.svg`, `apple-touch-icon.png`) is the R mark on a navy tile. JSON-LD `logo` points at `/brand/mark-512.png`.

## Motion hooks (markup → CSS)
`.rv` fade-up block · `.rv-seq` group whose `.sq` children enter top → bottom (`style="--k:N"`) · `.rv-mask` image unveiled top → bottom. See `docs/PROJECT_PLAN.md` → Revision 2.
App-bar colour: `data-hero / data-light / data-dark` on `<meta name="theme-color">` in `src/layouts/Layout.astro`.

## Social links, legal pages, project pages, share images
- **Social links**: `SOCIAL` at the top of `src/data/site.js`. Paste the real profile URL; entries left as `''` are hidden. Filled ones appear in the footer and in JSON-LD `sameAs`.
- **Legal pages**: `/ar|en/privacy/` and `/ar|en/terms/` (footer bottom bar, sitemap). Text is in `PAGES.privacy` / `PAGES.terms`; it describes what the site really does (no cookies or analytics, form opens WhatsApp, theme in localStorage, Google Fonts). Have a legal adviser review it, and change `LEGAL_UPDATED` when the text changes.
- **404**: `src/pages/404.astro` becomes `/404.html` (set it as the host's not-found page). Both languages are in the file; a small script shows the one matching the address. `noindex`.
- **Project pages**: `/ar|en/projects/<slug>/`. A project = one row in `PJ` (slug is the 6th item) + one entry in `PJD` (brief and three "what we did" points). Cards on home and Our work link to them; sitemap and breadcrumb JSON-LD include them. Current text is SAMPLE copy.
- **Share images**: `npm run og` writes `public/og/ar|en/<page>.jpg` (and `projects-<slug>.jpg`) from the page titles and photos. Re-run after changing titles, projects or photos, then commit the files. `Layout.astro` adds `og:image`, `twitter:image` (summary_large_image).

## Still to do
See `docs/PROJECT_PLAN.md` → "Status / remaining".

Footer contact list (phone, WhatsApp, email): each row has a small icon chip (`.ci` in global.css). The chip follows the theme accent (`--acc`: orange in light, gold in dark) and fills on hover; the WhatsApp glyph is shared via `WA_PATH` in `src/data/site.js`.


## ⚠️ Placeholder photos: replace before launch / صور مؤقتة يجب استبدالها قبل الإطلاق

**العربية:** الصور التسع الموجودة في `public/images/` (الملفات أدناه) **صور توضيحية مؤقتة مولَّدة بالذكاء الاصطناعي** (عُدِّلت ألوانها قليلًا لتبدو أقرب إلى التصوير الفعلي)، وُضعت فقط ليرى العميل الموقع بشكله النهائي. هي **ليست صور مشاريع منفّذة**، ويجب استبدالها بصور حقيقية من أعمال الشركة قبل نشر الموقع، خصوصًا أنها تظهر تحت عناوين مشاريع وأحياء (النرجس، الملقا، حطين…). نصوص المشاريع في `PJ` و`PJD` والأرقام في `STATS` هي أيضًا عيّنة تحتاج بيانات حقيقية. صور الهيرو (`villa` و`cornice` و`corner`) لم تُمسّ.

**English:** the nine photos below are **AI-generated stand-ins** (lightly colour-graded to feel photographic) so the client can review the site as it will look when finished. They are **not photos of real completed jobs**. Replace each with a real project photo before launch, especially because they sit under project titles and neighbourhoods. The sample project copy (`PJ`, `PJD`) and the numbers in `STATS` also need real data. The hero images (`villa`, `cornice`, `corner`) were not changed.

### How to replace a photo
1. Save the real photo as WebP with the same file name in `public/images/` (e.g. `facade.webp`). Keep the orientation: `facade` and `terrace` are **4:3** (1448×1086); the other seven are **16:9** (1600×900). About 1600 px wide, 150-250 KB each.
2. If the new photo has a different size, update its entry in the `IMG` table at the top of `src/lib/views.js` (width, height, and the alt text in both languages; the alt text must describe the real photo).
3. If the subject sits off-centre, adjust its focus point in `POS` (same file), e.g. `team: '25% 40%'`.
4. Run `npm run og` to rebuild the share images, then commit `public/og/`.

### Where each photo is used
### team.webp
- الرئيسية: صورة المقدمة (بجانب «متخصصون في ترميم الفلل…»)
- مشروع «توسعة فيلا وزيادة مساحتها» (بطاقة الرئيسية وصفحة أعمالنا وصفحة المشروع /projects/villa-expansion-hittin/)
- صفحة /about/ (من نحن)
- صفحة /contact/ (معاينة مجانية)
### majlis.webp
- الرئيسية: الشريط العريض «الفيلا الجيدة تكبر مع الأسرة»
- مشروع «تشطيب فيلا سوبر لوكس» (بطاقة الرئيسية وصفحة أعمالنا وصفحة المشروع /projects/super-deluxe-finishing-al-arid/)
- صفحة /warranty/ (الضمان والجودة)
- صفحة /why-us/ (لماذا نحن)
### cracks.webp
- الرئيسية: بطاقة خدمة «ترميم وتجديد الفلل»
- الرئيسية: بطاقة النصائح الكبيرة «كيف تقرأ علامات الفيلا التي تحتاج ترميمًا»
- صفحة /renovation/ (ترميم وتجديد الفلل)
### pergola.webp
- الرئيسية: بطاقة خدمة «الملاحق والمجالس»
- صفحة /annexes/ (الملاحق والمجالس)
### scaffold.webp
- الرئيسية: بطاقة خدمة «التوسعة والتسقيف»
- صفحة /expansion/ (التوسعة والتسقيف)
- صفحة /terms/ (شروط الاستخدام)
### facade.webp
- مشروع «ترميم فيلا قديمة بالكامل» (بطاقة الرئيسية وصفحة أعمالنا وصفحة المشروع /projects/old-villa-renovation-al-narjis/)
- الرئيسية: بطاقة «الضمان» ضمن «التفاصيل خلف كل تنفيذ»
- صفحة /projects/ (أعمالنا)
### terrace.webp
- مشروع «ملحق خارجي ومجلس» (بطاقة الرئيسية وصفحة أعمالنا وصفحة المشروع /projects/outdoor-annex-majlis-al-malqa/)
- الرئيسية: بطاقة «تغطية محلية» ضمن «التفاصيل خلف كل تنفيذ»
- صفحة /areas/ (الأحياء التي نخدمها)
### hall.webp
- مشروع «تسقيف الدبل هاي» (بطاقة الرئيسية وصفحة أعمالنا وصفحة المشروع /projects/double-height-roofing-al-yasmin/)
- صفحة /services/ (جميع الخدمات)
- صفحة /privacy/ (سياسة الخصوصية)
### plans.webp
- مشروع «تحويل الحوش إلى صالة» (بطاقة الرئيسية وصفحة أعمالنا وصفحة المشروع /projects/courtyard-to-hall-al-qairawan/)
- الرئيسية: بطاقة «معاينة مجانية» ضمن «التفاصيل خلف كل تنفيذ»
- صفحة /process/ (طريقة العمل)
- صفحة /guides/ (نصائح)

The share images for /contact/, /privacy/ and /terms/ use a photo only in their `og:image` (those pages show no photo on screen).
