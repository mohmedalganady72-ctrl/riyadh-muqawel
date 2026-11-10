// Client behaviour only. All markup and copy are rendered at build time (src/lib/views.js, src/data/site.js).
import { $, $$, RM } from './core.js';
import { initHero } from './hero.js';

const root = document.documentElement, store = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch (e) { return null; } };

// Theme: saved choice → system preference (set before paint in Layout). Follows system changes until the user chooses.
// App bar colour (<meta name="theme-color">): follows theme + (on home) whether the transparent header is still over the hero.
const bar = $('meta[name="theme-color"]');
const paintBar = () => { if (!bar) return; const o = bar.dataset, c = (o.home === '1' && scrollY <= 40) ? o.hero : (root.dataset.theme === 'dark' ? o.dark : o.light); if (bar.content !== c) bar.content = c; };
const tb = $('#theme');
const setTheme = (v, save) => { root.dataset.theme = v; tb.setAttribute('aria-pressed', v === 'dark'); if (save) store('theme', v); paintBar(); };
tb.setAttribute('aria-pressed', root.dataset.theme === 'dark');
tb.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!store('theme')) setTheme(e.matches ? 'dark' : 'light'); });

// Navigation
const closeDD = () => $$('#menu .has').forEach((x) => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
$$('#menu .has>button').forEach((b) => b.onclick = () => { const li = b.parentElement, o = !li.classList.contains('open'); closeDD(); li.classList.toggle('open', o); b.setAttribute('aria-expanded', o); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDD(); $('#nav').classList.remove('open'); $('#bg').setAttribute('aria-expanded', 'false'); } });
document.addEventListener('click', (e) => { if (!e.target.closest('#menu .has')) closeDD(); });
const bg = $('#bg');
bg.onclick = () => { const o = $('#nav').classList.toggle('open'); bg.setAttribute('aria-expanded', o); bg.setAttribute('aria-label', o ? bg.dataset.close : bg.dataset.open); };
const sc = () => { document.body.classList.toggle('sc', scrollY > 40); paintBar(); };
addEventListener('scroll', sc, { passive: true }); sc();

// Reveal on scroll. Hooks (all added in the markup, all hidden only when JS + motion are available):
//  .rv       a block that fades up once
//  .rv-seq   a card / group whose children (.sq, ordered by --k) enter one after another, top → bottom
//  .rv-mask  an image that is unveiled (see global.css); it is revealed together with its .rv-seq card (or its parent)
const rv = $$('.rv, .rv-seq, .rv-mask');
// Under reduced motion the CSS turns these into plain fades, so they still go through the observer.
if (!('IntersectionObserver' in window)) rv.forEach((e) => e.classList.add('in'));
else {
  // A clipped element reports no intersection, so a .rv-mask image is observed through its host and revealed with it.
  const kids = new Map();
  const R = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    if (e.target.matches('.rv, .rv-seq')) e.target.classList.add('in');
    (kids.get(e.target) || []).forEach((k) => k.classList.add('in'));
    R.unobserve(e.target);
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  rv.forEach((e) => { if (e.matches('.rv-mask')) { const p = e.closest('.rv-seq') || e.parentElement; kids.set(p, [...(kids.get(p) || []), e]); R.observe(p); } else R.observe(e); });
}

// Count-up
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; cio.unobserve(e.target); const n = +e.target.dataset.n;
  if (RM) { e.target.textContent = n; return; }
  let t0; const f = (t) => { t0 ??= t; const k = Math.min((t - t0) / 1400, 1); e.target.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f);
}), { threshold: .5 });
$$('[data-n]').forEach((x) => { if (RM) x.textContent = x.dataset.n; else cio.observe(x); });

// Signature scroll moment (home): one rAF-throttled listener, active only while visible
(function sig() {
  const b = $('.sigbox'); if (!b) return;
  if (RM || matchMedia('(max-width:760px)').matches) { b.style.setProperty('--p', 1); return; }
  let t = 0, on = false;
  const u = () => { t = 0; const r = b.getBoundingClientRect(), h = innerHeight; b.style.setProperty('--p', Math.min(1, Math.max(0, (h * .95 - r.top) / (h * .6))).toFixed(3)); };
  const f = () => { if (!t) t = requestAnimationFrame(u); };
  u();
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !on) { on = true; addEventListener('scroll', f, { passive: true }); u(); } else if (!e.isIntersecting && on) { on = false; removeEventListener('scroll', f); } }), { rootMargin: '100px' }).observe(b);
})();

// Contact form: validates, then opens WhatsApp with the message prefilled (no server needed)
const cf = $('#cf');
if (cf) cf.onsubmit = (e) => {
  e.preventDefault(); let ok = true;
  ['name', 'phone', 'msg'].forEach((k) => {
    const el = $('#' + k), v = el.value.trim(), bad = !v || (k === 'phone' && !/^(?:\+?966|00966|0)?5\d{8}$/.test(v.replace(/[\s-]/g, '')));
    el.setAttribute('aria-invalid', bad); $('#e-' + k).textContent = bad ? cf.dataset['e' + k[0].toUpperCase() + k.slice(1)] : '';
    if (bad && ok) { el.focus(); ok = false; }
  });
  if (ok) {
    const d = cf.dataset, text = [d.greet, d.lName + ': ' + $('#name').value.trim(), d.lPhone + ': ' + $('#phone').value.trim(), d.lTopic + ': ' + $('#topic').value, d.lMsg + ': ' + $('#msg').value.trim()].join('\n');
    window.open('https://wa.me/' + d.wa + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    $('#fs').innerHTML = '<p class="ok"></p>'; $('#fs p').textContent = cf.dataset.ok; cf.reset();
  }
};

initHero();

// Language switch keeps your place. The language link opens the same page in the other language (a new static page, so it would
// start at the top). On click we remember which block of <main> sits at the top of the screen and how far through it we are;
// the other page has the same blocks in the same order, so it scrolls to the matching spot (more exact than a % of page height).
{
  const KEY = 'lang-pos', units = () => [...document.querySelectorAll('main > *')], ss = (fn) => { try { return fn(sessionStorage); } catch (e) { return null; } };
  const lgLink = $('.hr .lg');
  if (lgLink) lgLink.addEventListener('click', () => {
    const us = units(), y = scrollY; let i = 0;
    us.forEach((el, n) => { if (el.getBoundingClientRect().top + y <= y + 1) i = n; });
    const el = us[i], r = el.getBoundingClientRect(), f = r.height ? Math.min(1, Math.max(0, (y - (r.top + y)) / r.height)) : 0;
    ss((s) => s.setItem(KEY, JSON.stringify({ to: lgLink.pathname, i, f })));
  });
  const saved = ss((s) => { const v = s.getItem(KEY); s.removeItem(KEY); return v && JSON.parse(v); });
  if (saved && saved.to === location.pathname && !location.hash) {
    let moved = false;
    const go = () => { const el = units()[saved.i]; if (!el) return; const top = el.getBoundingClientRect().top + scrollY; scrollTo({ top: top + saved.f * el.offsetHeight, behavior: 'instant' }); };
    go();
    // fonts and images can shift the layout after first paint: re-apply once on load, unless the visitor already scrolled
    addEventListener('wheel', () => (moved = true), { once: true, passive: true });
    addEventListener('touchmove', () => (moved = true), { once: true, passive: true });
    addEventListener('keydown', () => (moved = true), { once: true });
    addEventListener('load', () => { if (!moved) go(); }, { once: true });
  }
}
