// src/scripts/main.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './enquiry';
import './lookbook';
import './pieces';
import { initCursor } from './cursor';
import { track } from './track';
import { initCurrency } from './currency';
import { initTapeMeasure } from './tapemeasure';
import { initSilk } from './silk';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const w = window as any;
let introDelay = 0;

/* ---------- smooth scroll ---------- */
function initLenis() {
  if (reduce || w.__lenis) return;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  w.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- theme ---------- */
function setTheme(t: string) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch { /* private mode */ }
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-label', `Switch to ${t === 'navy' ? 'ivory' : 'navy'} theme`));
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', t === 'navy' ? '#0f1524' : '#f5f1e9');
  track('theme_set', { theme: t });
}

function toggleTheme(btn: HTMLElement) {
  const next = document.documentElement.dataset.theme === 'navy' ? 'ivory' : 'navy';
  const doc = document as any;
  if (!doc.startViewTransition || reduce) return setTheme(next);
  const r = btn.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.documentElement.classList.add('theme-switching');
  const vt = doc.startViewTransition(() => setTheme(next));
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
    );
  });
  vt.finished.finally(() => document.documentElement.classList.remove('theme-switching'));
}

/* ---------- menu ---------- */
function setMenu(open: boolean) {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const btn = document.querySelector<HTMLElement>('[data-menu-btn]');
  if (!menu || !btn) return;
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  btn.setAttribute('aria-expanded', String(open));
  const label = btn.querySelector('[data-menu-label]'); if (label) label.textContent = open ? 'Close' : 'Menu';
  if (open) document.querySelector('[data-nav]')?.classList.remove('hide');
}

/* ---------- global listeners, bound once ---------- */
function bindGlobal() {
  if (w.__globalBound) return;
  w.__globalBound = true;

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const th = t.closest<HTMLElement>('[data-theme-toggle]');
    if (th) { toggleTheme(th); return; }

    const a = t.closest<HTMLAnchorElement>('a[href]');
    if (a) {
      if (a.href.startsWith('https://wa.me/')) track('whatsapp_click', { where: a.classList.contains('wa-fab') ? 'floating' : 'page' });
      else if (a.href.startsWith('mailto:')) track('email_click');
      else if (a.href.includes('instagram.com')) track('instagram_click');
      else if (a.href.startsWith('tel:')) track('call_click');
    }

    const mb = t.closest('[data-menu-btn]');
    if (mb) { setMenu(mb.getAttribute('aria-expanded') !== 'true'); return; }
    // any choice inside the menu, or a click outside it, closes it
    if (t.closest('[data-menu] a, [data-menu] [data-open-enquiry]') || (!t.closest('[data-menu]') && document.querySelector('[data-menu].open'))) setMenu(false);

    const cp = t.closest<HTMLElement>('[data-copy]');
    if (cp) { navigator.clipboard?.writeText(cp.dataset.copy!).then(() => { cp.textContent = 'Copied'; setTimeout(() => (cp.textContent = 'Copy address'), 1800); }); return; }
    if (t.closest('[data-to-top]')) w.__lenis ? w.__lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: 'smooth' });

    const hash = t.closest<HTMLAnchorElement>('a[href^="#"]');
    if (hash && hash.getAttribute('href')!.length > 1) {
      const target = document.querySelector<HTMLElement>(hash.getAttribute('href')!);
      if (target) { e.preventDefault(); w.__lenis ? w.__lenis.scrollTo(target, { offset: -70, duration: 1.4 }) : target.scrollIntoView({ behavior: 'smooth' }); }
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // nav hides on scroll down, returns on scroll up
  let last = 0;
  addEventListener('scroll', () => {
    const nav = document.querySelector('[data-nav]');
    if (!nav) return;
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > 240 && y > last && !document.querySelector('[data-menu].open'));
    last = y;
  }, { passive: true });

  // the ticker speeds up with scroll speed, then settles
  let lastY = scrollY, rate = 1;
  addEventListener('scroll', () => {
    const v = Math.abs(scrollY - lastY); lastY = scrollY;
    rate = Math.min(6, 1 + v / 14);
    document.querySelectorAll<HTMLElement>('.marquee-track').forEach((t) => t.getAnimations().forEach((a) => { a.playbackRate = rate; }));
  }, { passive: true });
  gsap.ticker.add(() => { if (rate > 1.02) { rate += (1 - rate) * 0.06; document.querySelectorAll<HTMLElement>('.marquee-track').forEach((t) => t.getAnimations().forEach((a) => { a.playbackRate = rate; })); } });

  // measuring tape progress (desktop)
  const tape = () => {
    const mark = document.querySelector<HTMLElement>('[data-tape-mark]'); const num = document.querySelector<HTMLElement>('[data-tape-num]');
    const box = document.querySelector<HTMLElement>('[data-tape]');
    if (!mark || !num || !box) return;
    const max = document.documentElement.scrollHeight - innerHeight; const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    mark.style.transform = `translateY(${p * (box.clientHeight - 2)}px)`;
    num.textContent = String(Math.round(p * 100)).padStart(3, '0');
  };
  addEventListener('scroll', tape, { passive: true }); addEventListener('resize', tape);
  initCursor();
}

/* ---------- photo cards: fly in, float, follow the pointer, and shuffle ---------- */
type Slot = { x: number; y: number; r: number; s: number; o: number; b: number; z: number };
const SLOTS: Slot[] = [
  { x: 40, y: 56, r: -4, s: 1, o: 1, b: 0, z: 6 },
  { x: 14, y: 30, r: -9, s: .92, o: 1, b: 0, z: 5 },
  { x: 58, y: 20, r: 6, s: .86, o: .92, b: 1, z: 4 },
  { x: 10, y: 76, r: 8, s: .8, o: .75, b: 2, z: 3 },
  { x: 66, y: 82, r: -7, s: .72, o: .5, b: 3, z: 2 },
];
function slotProps(side: string, k: number, mobile: boolean) {
  const d = SLOTS[Math.min(k, SLOTS.length - 1)]; const m = side === 'right' ? -1 : 1;
  const x = side === 'right' ? 100 - d.x : d.x;
  // on phones the single cluster is a short wide strip, so spread cards across it
  return mobile ? { left: `${14 + k * 18}%`, top: `${[58, 40, 60, 38, 56][k] ?? 50}%`, rotation: d.r, scale: d.s, autoAlpha: d.o, filter: `blur(${d.b * .5}px)`, zIndex: d.z }
                : { left: `${x}%`, top: `${d.y}%`, rotation: d.r * m, scale: d.s, autoAlpha: d.o, filter: `blur(${d.b}px)`, zIndex: d.z };
}

function initCards(cluster: HTMLElement, motion: boolean, hasMouse: boolean, delay: number) {
  const side = cluster.dataset.cluster ?? 'left';
  const isStatic = cluster.hasAttribute('data-static');
  const mobile = matchMedia('(max-width: 899px)').matches && !isStatic;
  const cards = [...cluster.querySelectorAll<HTMLElement>('[data-card]')];
  const visible = isStatic ? cards.length : Math.min(5, cards.length);
  const dir = side === 'right' ? 1 : -1;
  const place = (k: number) => ({ ...slotProps(side, k, mobile), xPercent: -50, yPercent: -50 });
  const order = [...cards];

  cards.forEach((c, k) => gsap.set(c, k < visible ? place(k) : { autoAlpha: 0, xPercent: -50, yPercent: -50, left: `${dir < 0 ? -30 : 130}%`, top: '80%' }));
  if (!motion) return;

  // entrance: cards arrive from the edge with a turn, back cards first
  order.slice(0, visible).reverse().forEach((c, i) => {
    const k = visible - 1 - i; const p = place(k);
    gsap.fromTo(c, { left: `${dir < 0 ? -35 : 135}%`, top: `${(parseFloat(String(p.top)) || 50) + 25}%`, rotation: dir * -28, scale: .7, autoAlpha: 0 },
      { ...p, duration: 1.7, ease: 'expo.out', delay: delay + i * 0.12 });
  });

  // idle float and pointer parallax act on the inner wrapper so they never fight the shuffle
  order.slice(0, visible).forEach((c, k) => {
    const inner = c.querySelector<HTMLElement>('.card-in')!;
    gsap.to(inner, { y: (k % 2 ? -1 : 1) * (7 + k * 2), duration: 3 + k * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: delay + 1.5 });
    if (hasMouse) {
      gsap.set(inner, { transformPerspective: 800 });
      const qx = gsap.quickTo(inner, 'x', { duration: 1.1, ease: 'power3' });
      const qr = gsap.quickTo(inner, 'rotationY', { duration: 1.1, ease: 'power3' });
      const depth = (visible - k) * 5;
      addEventListener('pointermove', (e) => { const f = e.clientX / innerWidth - 0.5; qx(f * depth * -2); qr(f * (visible - k) * 3); });
    }
  });

  if (isStatic || cards.length <= visible || mobile && side === 'right') return;

  // shuffle: front card leaves, the rest move forward, a new card arrives at the back
  const step = () => {
    const out = order[0], incoming = order[visible];
    const tl = gsap.timeline({ onComplete: () => { order.push(order.shift()!); } });
    tl.to(out, { left: `${dir < 0 ? -30 : 130}%`, top: '-8%', rotation: dir * -26, scale: .85, autoAlpha: 0, duration: 1, ease: 'power3.in' }, 0);
    for (let k = 1; k < visible; k++) tl.to(order[k], { ...slotProps(side, k - 1, mobile), duration: 1.3, ease: 'expo.inOut' }, 0.08 + k * 0.05);
    tl.set(incoming, { left: `${dir < 0 ? -30 : 130}%`, top: '92%', rotation: dir * -20, scale: .7, autoAlpha: 0, filter: 'blur(3px)', zIndex: SLOTS[visible - 1].z }, 0.2);
    tl.to(incoming, { ...slotProps(side, visible - 1, mobile), duration: 1.5, ease: 'expo.out' }, 0.35);
  };
  const start = delay + 4 + (side === 'right' ? 1.7 : 0);
  gsap.delayedCall(start, function again() { step(); gsap.delayedCall(3.6, again); });
}

/* ---------- collections index: a preview image follows the pointer ---------- */
function initIndex() {
  const list = document.querySelector<HTMLElement>('[data-index]');
  const prev = document.querySelector<HTMLElement>('[data-index-preview]');
  if (!list || !prev) return;
  const imgs = [...prev.querySelectorAll<HTMLElement>('[data-ix-img]')];
  const qx = gsap.quickTo(prev, 'x', { duration: 0.7, ease: 'power3' });
  const qy = gsap.quickTo(prev, 'y', { duration: 0.7, ease: 'power3' });
  list.addEventListener('pointermove', (e) => { qx(e.clientX + 36); qy(e.clientY - prev.offsetHeight / 2); });
  list.querySelectorAll<HTMLElement>('[data-ix]').forEach((row, k) => {
    row.addEventListener('pointerenter', () => {
      imgs.forEach((im, j) => gsap.to(im, { autoAlpha: j === k ? 1 : 0, duration: 0.01 }));
      gsap.fromTo(imgs[k], { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' });
      gsap.to(prev, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    });
  });
  list.addEventListener('pointerleave', () => gsap.to(prev, { autoAlpha: 0, scale: 0.94, duration: 0.35, ease: 'power3.in' }));
}

/* ---------- per page setup ---------- */
function initPage() {
  const mm = gsap.matchMedia();
  mm.add(
    { motion: '(prefers-reduced-motion: no-preference)', still: '(prefers-reduced-motion: reduce)', fine: '(hover: hover) and (pointer: fine)' },
    (ctx) => {
      const { motion, fine: hasMouse } = ctx.conditions as { motion: boolean; fine: boolean };

      if (motion) {
        // headings: each word rises out of a mask as it scrolls into view
        gsap.utils.toArray<HTMLElement>('h2[data-reveal]').forEach((h) => {
          h.removeAttribute('data-reveal');
          const wrap = (node: Node) => {
            [...node.childNodes].forEach((n) => {
              if (n.nodeType === 3) {
                const parts = n.textContent!.split(/(\s+)/);
                n.replaceWith(...parts.map((t) => { if (!t.trim()) return document.createTextNode(t); const o = document.createElement('span'); o.className = 'word'; const i = document.createElement('span'); i.textContent = t; o.appendChild(i); return o; }));
              } else if (n.nodeType === 1) wrap(n);
            });
          };
          wrap(h);
          gsap.from(h.querySelectorAll('.word > span'), { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: h, start: 'top 90%', once: true } });
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, { y: 48, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: Number(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 96%', once: true } });
        });
        gsap.utils.toArray<HTMLElement>('[data-mask]').forEach((el) => {
          const img = el.querySelector('img, .ph');
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 96%', once: true } });
          tl.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' });
          if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
        });
      }

      document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
        const words = el.textContent!.trim().split(/\s+/);
        el.replaceChildren(...words.flatMap((x, k) => { const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = x; return k < words.length - 1 ? [sp, document.createTextNode(' ')] : [sp]; }));
        if (motion) gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.5 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
      });

      if (motion && hasMouse) {
        document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
          const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,.5)' });
          const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,.5)' });
          el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.3); });
          el.addEventListener('pointerleave', () => { mx(0); my(0); });
        });
        initIndex();
        // 3D tilt: cards turn toward the pointer
        document.querySelectorAll<HTMLElement>('[data-tilt3d]').forEach((el) => {
          gsap.set(el, { transformPerspective: 900 });
          const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
          const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
          const lift = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
          el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 12); rx(-((e.clientY - r.top) / r.height - 0.5) * 12); lift(-6); });
          el.addEventListener('pointerleave', () => { rx(0); ry(0); lift(0); });
        });
        initSilk();
      }

      // hero text and cards
      const hero = document.querySelector<HTMLElement>('[data-hero]');
      const delay = introDelay;
      if (hero) {
        const lines = hero.querySelectorAll('.line-in');
        const fades = hero.querySelectorAll('[data-hero-fade]');
        if (motion) {
          gsap.set(lines, { yPercent: 115 }); gsap.set(fades, { autoAlpha: 0, y: 22 });
          const tl = gsap.timeline({ delay, defaults: { ease: 'expo.out' } });
          tl.to(lines, { yPercent: 0, duration: 1.5, stagger: 0.12 }).to(fades, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.45);
        }
        hero.querySelectorAll<HTMLElement>('[data-cluster]').forEach((c) => initCards(c, motion, hasMouse, delay + 0.2));
      }

      document.querySelectorAll<HTMLElement>('[data-rotator]').forEach((root) => rotator(root, motion, hasMouse, 0));
    }
  );
}

/* ---------- rotator: testimonials (autoplay, progress dots, pause on hover) ---------- */
function rotator(root: HTMLElement, motion: boolean, hasMouse: boolean, startAfter: number) {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [...root.querySelectorAll<HTMLElement>('[data-dot]')];
  const n = slides.length;
  if (n < 2) return;
  const interval = Number(root.dataset.interval || 6000) / 1000;
  let i = 0, busy = false;
  let timer: gsap.core.Tween | undefined;
  gsap.set(slides.slice(1), { autoAlpha: 0 });

  const mark = (k: number) => {
    dots.forEach((d, j) => { d.classList.toggle('is-active', j === k); const bar = d.querySelector('i'); if (bar) gsap.set(bar, { scaleX: motion ? 0 : j === k ? 1 : 0 }); });
    slides.forEach((s, j) => s.setAttribute('aria-hidden', String(j !== k)));
  };
  const start = () => {
    if (!motion) return;
    timer?.kill();
    const bar = dots[i]?.querySelector('i');
    timer = gsap.fromTo(bar ?? {}, { scaleX: 0 }, { scaleX: 1, duration: interval, ease: 'none', onComplete: () => go((i + 1) % n) });
  };
  const go = (k: number) => {
    if (k === i || busy) return;
    timer?.kill(); mark(k);
    const out = slides[i], inn = slides[k];
    if (!motion) { gsap.set(out, { autoAlpha: 0 }); gsap.set(inn, { autoAlpha: 1 }); i = k; return; }
    busy = true;
    gsap.timeline({ onComplete: () => { i = k; busy = false; start(); } })
      .to(out, { autoAlpha: 0, y: -16, duration: 0.6, ease: 'power2.in' }, 0)
      .fromTo(inn, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.45);
  };
  dots.forEach((d, j) => d.addEventListener('click', () => go(j)));
  if (hasMouse) { root.addEventListener('pointerenter', () => timer?.pause()); root.addEventListener('pointerleave', () => timer?.resume()); }
  root.addEventListener('focusin', () => timer?.pause()); root.addEventListener('focusout', () => timer?.resume());
  if (motion) ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? timer?.resume() : timer?.pause()) });
  mark(0);
  if (motion) gsap.delayedCall(startAfter, start);
}

/* ---------- offline support (production only) ---------- */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => { /* offline support is a bonus, never an error */ }));
}

/* ---------- boot: every page is a plain page load, so there is no router state to go stale ---------- */
initLenis();
bindGlobal();
initCurrency();
initPage();
initTapeMeasure(introDelay);
requestAnimationFrame(() => ScrollTrigger.refresh());
