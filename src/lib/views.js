// Server-side views (run at build time → real, crawlable HTML per language). Copy lives in src/data/site.js.
import { UI, NAV, HERO, PJ, PJD, NEWS, STATS, BIZ, SUS, HOMET, PAGES, CONTACT, LEGAL_UPDATED } from '../data/site.js';

const POS = { crane: 'center 40%', plant: 'center 55%', bridge: 'center 35%', tower: 'center', site: 'center 62%', wind: 'left 70%', facade: 'center 45%', terrace: 'center 50%', majlis: 'center 50%', team: '25% 40%', plans: '30% center', pergola: '62% center', cracks: 'center', scaffold: '35% center', hall: '40% center' };
// Why-us cards, in SUS order: free inspection (magnifier with a check), warranty (shield with a check), local coverage (map pin).
const ICON = ['<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M7.5 10.6l2.2 2.2 3.8-4.2"/>', '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6z"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>', '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'];
const EVERY = { en: ' Every project is followed by a dedicated team from the free inspection to handover.', ar: ' يتابع كل مشروع فريق مختص من المعاينة المجانية حتى التسليم.' };
// Photo files in public/images (new photography): size for width/height attributes, and a descriptive alt text per language.
const IMG = {
  facade: [1448, 1086, 'Modern villa facade in Riyadh clad in stone, lit warmly at dusk', 'واجهة فيلا حديثة في الرياض مكسوّة بالحجر وبإضاءة دافئة وقت الغروب'],
  terrace: [1448, 1086, 'Villa roof terrace with a glass balustrade and the Riyadh skyline behind', 'تراس على سطح فيلا بحاجز زجاجي وأفق مدينة الرياض في الخلفية'],
  majlis: [1600, 900, 'Finished villa majlis with marble tables, gold lighting and cream seating', 'مجلس فيلا مكتمل التشطيب بطاولات رخامية وإضاءة ذهبية ومقاعد بلون كريمي'],
  team: [1600, 900, 'Two site engineers reviewing a villa under construction', 'مهندسان في الموقع يراجعان فيلا قيد التنفيذ'],
  plans: [1600, 900, 'Hard hat, plans and tape measure on a site table in front of a villa under construction', 'خوذة ومخططات ومتر قياس على طاولة في الموقع أمام فيلا قيد التنفيذ'],
  pergola: [1600, 900, 'Worker laying floor tiles under a modern outdoor annex with a timber ceiling', 'عامل يركّب بلاط الأرضية تحت ملحق خارجي حديث بسقف خشبي'],
  cracks: [1600, 900, 'Cracked, peeling facade on an older villa with a hard hat and inspection notes', 'واجهة فيلا قديمة متشققة ومتقشرة مع خوذة وأوراق معاينة'],
  scaffold: [1600, 900, 'Villa extension under construction with scaffolding and building blocks', 'توسعة فيلا قيد البناء بالسقالات وكتل البناء'],
  hall: [1600, 900, 'Double-height villa hall being finished, with tall windows and scaffolding', 'صالة دبل هاي في فيلا قيد التشطيب بنوافذ عالية وسقالات'],
};
const bg = (k) => `background-image:var(--img-${k});background-position:${POS[k]}`;
const mk = (s) => s.replace(/\{\{(.+?)\}\}/g, '<mark class="mk">$1</mark>'), plain = (s) => s.replace(/\{\{|\}\}/g, '');
const NO_EVERY = ['about', 'process', 'warranty', 'careers']; // their lead text already says it
const SERVICES = ['services', 'renovation', 'annexes', 'expansion'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;');
export const href = (l, id = 'home') => (id === 'home' ? `/${l}/` : `/${l}/${id}/`);

export function views(l) {
  const t = (o) => o[l], u = (k) => UI[k][l];
  const arr = `<span aria-hidden="true">${l === 'ar' ? '←' : '→'}</span>`;
  const h = (id) => href(l, id);
  // Photos are real <img> elements (alt text, width/height, lazy loading); the focus point comes from POS.
  const pic = (k) => { const m = IMG[k]; return `<img src="/images/${k}.webp" width="${m[0]}" height="${m[1]}" alt="${m[l === 'ar' ? 3 : 2]}" loading="lazy" decoding="async" style="object-position:${POS[k]}">`; };
  const ph = (k, c = '', inner = '') => `<div class="ph im ${c}">${pic(k)}${inner}</div>`;
  const phz = ph;
  const d = (i, c = 3, s = 70) => `style="--d:${(i % c) * s}ms"`;
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  const HOME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20V9.5l6-5 6 5V20M10 20v-5.5h4V20"/></svg>';
  const sq = (k, c = '') => `class="${c ? c + ' ' : ''}sq" style="--k:${k}"`;
  const pjCard = (p, i) => `<a class="card pj rv-seq" ${d(i)} href="${h('projects/' + p[5])}"><div class="ci">${phz(p[4], 'rv-mask', `<span class="tag">${t(p[1])}</span>`)}<div class="cb"><h3 ${sq(1)}>${t(p[0])}</h3><ul ${sq(2, 'mt')}><li>${PIN}<span><small>${u('fLoc')}</small><b>${t(p[2])}</b></span></li><li>${HOME}<span><small>${u('fScope')}</small><b>${t(p[3])}</b></span></li></ul><div ${sq(3, 'cf')}><span class="lnk">${u('viewProject')} ${arr}</span></div></div></div></a>`;
  const ltr = (x) => (/[\u0600-\u06FF]/.test(x) ? x : `<bdi dir="ltr">${x}</bdi>`);
  const stats = `<div class="stats rv">${STATS.map((s) => `<div class="st"><b>${ltr(`<span data-n="${s[0]}">0</span>${t(s[1])}`)}</b><h3>${t(s[2])}</h3><p>${t(s[3])}</p></div>`).join('')}</div>`;
  const newsBlock = () => { const n = NEWS[0]; return `<div class="news"><a class="card ft rv-seq" href="${h('contact')}"><div class="ci">${phz(n[4], 'rv-mask')}<div class="cb"><div ${sq(1)}><span class="cat">${t(n[0])}</span> <span class="meta">${t(n[1])}</span></div><h2 ${sq(2, 'nh')}>${t(n[2])}</h2><p ${sq(3, 'lead')}>${t(n[3])}</p><div ${sq(4, 'cf')}><span class="lnk">${u('more')} ${arr}</span></div></div></div></a><div class="nlist">${NEWS.slice(1).map((x, i) => `<a class="ni rv-seq" ${d(i)} href="${h('contact')}"><span ${sq(0, 'no')}>0${i + 1}</span><div class="nb"><div ${sq(1)}><span class="cat">${t(x[0])}</span> <span class="meta">${t(x[1])}</span></div><h3 ${sq(2)}>${t(x[2])}</h3><div ${sq(3)}><span class="lnk">${u('more')} ${arr}</span></div></div></a>`).join('')}</div></div>`; };
  const cta = () => `<section class="dark cta"><div class="wrap rv"><h2>${mk(u('cta'))}</h2><a class="btn" href="${h('contact')}">${u('contact')}</a></div></section>`;
  const head = (a, b) => `<div class="head rv"><h2>${a}</h2>${b}</div>`;
  const lnk = (id, x) => `<a class="lnk" href="${h(id)}">${x} ${arr}</a>`;
  const su = (a) => a.map((s, i) => `<div class="su-i rv-seq" ${d(i)}>${ph(s.img, 'rv-mask', '', t(s.t))}<div class="cb"><svg ${sq(1)} viewBox="0 0 24 24" aria-hidden="true">${ICON[i]}</svg><h3 ${sq(2)}>${t(s.t)}</h3>${s.p ? `<p ${sq(3, 'lead')}>${t(s.p)}</p>` : ''}<strong ${sq(4)}>${ltr(t(s.v))}</strong><span ${sq(5, 'meta')}>${t(s.m)}</span></div></div>`).join('');
  const susData = SUS.map((s) => ({ t: s[0], p: s[1], v: s[2], m: s[3], img: s[4] }));
  const hd = (p, crumbs = []) => `<div class="ph-hd"><div class="wrap"><p class="meta"><a href="${h('home')}">${u('home')}</a> / ${crumbs.map((c) => `<a href="${h(c[0])}">${c[1]}</a> / `).join('')}${t(p.t)}</p><h1>${mk(t(p.h))}</h1><p class="lead">${t(p.d)}</p></div></div>`;
  const fmtDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString(l === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const cut = (s, n = 155) => (s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, '') + '…');

  function heroMarkup() {
    const sc = HERO.scenes, s = sc[0], title = (a) => a.map((x) => `<span>${t(x)}</span>`).join('');
    const data = { base: HERO.base, scenes: sc.map((x) => ({ v: x.video, e: t(x.eyebrow), l: x.lines.map(t) })) };
    return `<section class="hero" id="hero" aria-roledescription="carousel" aria-label="${u('heroLabel')}" style="--hero-dur:${HERO.duration}ms" data-hero='${esc(JSON.stringify(data))}'>
<div class="hv" aria-hidden="true">${sc.map((x, i) => `<div class="hs${i ? '' : ' on'}" style="--poster:var(--ph-${x.poster});--pos:${x.pos}"><video muted loop playsinline tabindex="-1" preload="${i ? 'none' : 'metadata'}" ${i ? '' : 'autoplay'}></video></div>`).join('')}</div>
<div class="hov" aria-hidden="true"></div>
<div class="hc"><div id="ht"><p class="he hi" id="he">${t(s.eyebrow)}</p><h1 class="hi" id="hh" style="--d:90ms">${title(s.lines)}</h1></div><a class="btn hi" style="--d:260ms" href="${h('projects')}">${u('heroCta')} ${arr}</a></div>
<div class="hp" role="group" aria-label="${u('scenes')}">${sc.map((x, i) => `<button type="button" aria-label="${u('scene')} ${i + 1}: ${x.lines.map(t).join(' ')}" ${i ? '' : 'aria-current="true"'}>0${i + 1}<span class="bar"><i></i></span></button>`).join('')}</div>
<button class="hsc" id="hsc" type="button">${u('scroll')} <span aria-hidden="true">↓</span></button></section>`;
  }

  function home() {
    const H = HOMET;
    return `${heroMarkup()}
<section><div class="wrap g split"><div class="t6 rv-seq"><h2 ${sq(0)}>${mk(t(H.h))}</h2><p ${sq(1, 'lead sp')}>${t(H.p)}</p><div ${sq(2)}>${lnk('about', t(H.about))}</div></div><div class="t6">${ph('team', 'rv-mask', '', plain(t(HOMET.h)))}</div></div></section>
<section class="alt tight"><div class="wrap">${stats}</div></section>
<section class="sig"><div class="sigbox"><div class="sigimg ph">${pic('majlis')}</div><div class="sigtx"><div class="wrap"><h2>${t(H.sig)}</h2></div></div></div></section>
<section><div class="wrap">${head(t(H.biz), lnk('services', t(H.bizA)))}<div class="cards biz">${BIZ.map((c, i) => `<a class="card rv-seq" ${d(i)} href="${h(c[0])}"><div class="ci">${phz(c[3], 'rv-mask')}<div class="cb"><h3 ${sq(1)}>${t(c[1])}</h3><p ${sq(2)}>${t(c[2])}</p><div ${sq(3, 'cf')}><span class="lnk">${u('explore')} ${arr}</span></div></div></div></a>`).join('')}</div></div></section>
<section class="alt"><div class="wrap">${head(t(H.pj), lnk('projects', t(H.pjA)))}<div class="cards mos">${PJ.map(pjCard).join('')}</div></div></section>
<section><div class="wrap">${head(t(H.su), lnk('why-us', t(H.suA)))}<div class="su">${su(susData)}</div></div></section>
<section class="alt"><div class="wrap">${head(t(H.nw), lnk('guides', t(H.nwA)))}${newsBlock()}</div></section>${cta()}`;
  }

  // /projects/<slug>/ : one page per project. Copy comes from PJ (card data) and PJD (brief + what was done).
  function project(slug) {
    const i = PJ.findIndex((x) => x[5] === slug), x = PJ[i], dt = PJD[slug];
    if (!x || !dt) return null;
    const prev = PJ[(i + PJ.length - 1) % PJ.length], next = PJ[(i + 1) % PJ.length];
    const p = { t: x[0], h: x[0], d: L2(x) };
    const facts = [[u('fSector'), t(x[1])], [u('fLoc'), t(x[2])], [u('fScope'), t(x[3])]];
    const b = `<section><div class="wrap g split"><div class="t6">${ph(x[4], 'rv-mask', '', t(x[0]))}</div><div class="t6 rv-seq" style="--d:100ms"><h2 ${sq(0)}>${u('pjBrief')}</h2><p ${sq(1, 'lead sp')}>${t(dt.brief)}</p><dl ${sq(2, 'facts')} aria-label="${u('pjFacts')}">${facts.map((f) => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl></div></div></section>
<section class="alt"><div class="wrap"><h2 class="oh rv">${u('pjDid')}</h2><div class="pts rv">${dt.did.map((y) => `<div class="pt"><h3>${t(y[0])}</h3><p>${t(y[1])}</p></div>`).join('')}</div></div></section>
<section class="tight"><div class="wrap"><nav class="pn rv" aria-label="${u('pjAll')}"><a href="${h('projects/' + prev[5])}" rel="prev"><small>${u('pjPrev')}</small><b>${t(prev[0])}</b></a><a class="all" href="${h('projects')}">${u('pjAll')}</a><a href="${h('projects/' + next[5])}" rel="next"><small>${u('pjNext')}</small><b>${t(next[0])}</b></a></nav></div></section>`;
    return { html: hd(p, [['projects', t(NAV[2].t)]]) + b + cta(), title: t(x[0]), desc: cut(t(dt.brief)), img: x[4] };
  }
  const L2 = (x) => ({ en: `${x[1].en} · ${x[2].en}. ${x[3].en}.`, ar: `${x[1].ar} · ${x[2].ar}. ${x[3].ar}.` });

  function page(id) {
    if (id.startsWith('projects/')) return project(id.slice(9));
    const p = PAGES[id]; if (!p) return null;
    let b = '';
    if (p.kind === 'projects') b = `<section><div class="wrap"><h2 class="sr">${t(p.t)}</h2><div class="cards mos">${PJ.map(pjCard).join('')}</div></div></section>`;
    else if (p.kind === 'sustainability') b = `<section><div class="wrap"><h2 class="sr">${t(p.t)}</h2><div class="su">${su(susData.map((s) => ({ ...s, p: null })))}</div></div></section><section class="alt"><div class="wrap">${stats}</div></section>`;
    else if (p.kind === 'media') b = `<section><div class="wrap">${newsBlock()}</div></section>`;
    else if (p.kind === 'legal') b = `<section><div class="wrap"><div class="legal"><p class="meta">${u('updated')}: <time datetime="${LEGAL_UPDATED}">${fmtDate(LEGAL_UPDATED)}</time></p>${p.sec.map((s, i) => `<h2 class="rv">${t(s[0])}</h2><p class="rv">${t(s[1])}</p>`).join('')}</div></div></section>`;
    else if (p.kind === 'contact') {
      const f = (k, lab, type, ac) => `<div class="fld"><label for="${k}">${lab}</label><input id="${k}" name="${k}" type="${type}" autocomplete="${ac}" required aria-describedby="e-${k}"><div class="err" id="e-${k}"></div></div>`;
      b = `<section><div class="wrap g"><h2 class="sr">${u('speak')}</h2><form class="form t6" id="cf" novalidate data-ok="${u('sent')}" data-e-name="${u('eName')}" data-e-phone="${u('ePhone')}" data-e-msg="${u('eMsg')}" data-wa="${CONTACT.wa}" data-greet="${u('waGreet')}" data-l-name="${u('fName')}" data-l-phone="${u('fPhone')}" data-l-topic="${u('fTopic')}" data-l-msg="${u('fMsg')}">${f('name', u('fName'), 'text', 'name')}${f('phone', u('fPhone'), 'tel', 'tel')}<div class="fld"><label for="topic">${u('fTopic')}</label><select id="topic">${UI.topics.map((x) => `<option>${t(x)}</option>`).join('')}</select></div><div class="fld"><label for="msg">${u('fMsg')}</label><textarea id="msg" required aria-describedby="e-msg"></textarea><div class="err" id="e-msg"></div></div><div><button class="btn" type="submit">${u('fSend')}</button></div><div id="fs" role="status"></div></form><div class="t4 side"><h3>${u('hq')}</h3><p class="lead sp2">${u('addr')}</p><h3>${u('gen')}</h3><p class="lead sp3"><a href="tel:${CONTACT.tel}"><bdi dir="ltr">${CONTACT.phone}</bdi></a><br><a href="https://wa.me/${CONTACT.wa}" rel="noopener"><bdi dir="ltr">${u('wa')}: ${CONTACT.phone}</bdi></a><br><a href="mailto:${CONTACT.email}"><bdi dir="ltr">${CONTACT.email}</bdi></a></p></div></div></section>`;
    } else {
      b = `<section><div class="wrap g split"><div class="t6">${ph(p.img, 'rv-mask', '', plain(t(p.t)))}</div><div class="t6 rv-seq" style="--d:100ms"><h2 ${sq(0)}>${plain(t(p.h))}</h2><p ${sq(1, 'lead sp')}>${t(p.d)}${NO_EVERY.includes(id) ? '' : EVERY[l]}</p><div ${sq(2)}>${lnk('contact', u('speak'))}</div></div></div></section>`;
      if (p.pts) b += `<section class="alt"><div class="wrap"><div class="pts rv">${p.pts.map((x) => `<div class="pt"><h3>${t(x[0])}</h3><p>${t(x[1])}</p></div>`).join('')}</div></div></section>`;
      if (p.tl) b += `<section class="alt"><div class="wrap"><ul class="tl">${p.tl.map((x) => `<li><b>${x[0]}</b><p class="lead">${t(x[1])}</p></li>`).join('')}</ul></div></section>`;
      if (p.ppl) b += `<section><div class="wrap"><div class="ppl">${p.ppl.map((x, i) => `<div class="rv" ${d(i, 4)}><div class="ph" style="${bg('tower')}" aria-hidden="true">${[...t(x[0])][0]}</div><h3>${t(x[0])}</h3><p class="meta">${t(x[1])}</p></div>`).join('')}</div></div></section>`;
      if (p.jobs) b += `<section><div class="wrap"><h2 class="oh">${u('openRoles')}</h2><ul class="tl">${p.jobs.map((x) => `<li><span class="jb"><a class="lnk" href="${h('contact')}">${t(x)} ${arr}</a></span></li>`).join('')}</ul></div></section>`;
    }
    return { html: hd(p) + b + (id === 'contact' ? '' : cta()), title: t(p.t), desc: cut(t(p.d), 210), img: p.img };
  }
  return { home, page };
}
