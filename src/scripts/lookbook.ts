// src/scripts/lookbook.ts
// Category filter and full screen viewer for the lookbook page.
import { track } from './track';
const w = window as any;
if (!w.__lookBound) {
  w.__lookBound = true;
  let items: HTMLElement[] = [], idx = 0, last: HTMLElement | null = null;
  const box = () => document.querySelector<HTMLElement>('[data-viewer]');

  const show = (n: number) => {
    const v = box(); if (!v || !items.length) return;
    idx = (n + items.length) % items.length;
    const src = items[idx].querySelector('img') as HTMLImageElement | null;
    const stage = v.querySelector<HTMLElement>('[data-viewer-stage]')!;
    stage.innerHTML = '';
    if (src) { const c = src.cloneNode() as HTMLImageElement; c.removeAttribute('width'); c.removeAttribute('height'); c.sizes = '100vw'; c.loading = 'eager'; stage.appendChild(c); }
    else { const ph = items[idx].querySelector('.ph')!.cloneNode(true) as HTMLElement; ph.style.position = 'relative'; ph.style.aspectRatio = '4 / 5'; ph.style.height = '80vh'; stage.appendChild(ph); }
    v.querySelector<HTMLElement>('[data-viewer-cap]')!.textContent = items[idx].dataset.caption ?? '';
    v.querySelector<HTMLElement>('[data-viewer-count]')!.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  };
  const open = (el: HTMLElement) => {
    const v = box(); if (!v) return;
    items = [...document.querySelectorAll<HTMLElement>('[data-look]:not([hidden])')];
    track('lookbook_open', { cat: el.dataset.cat ?? '' });
    last = el; v.classList.add('open'); v.setAttribute('aria-hidden', 'false'); w.__lenis?.stop();
    show(items.indexOf(el));
    v.querySelector<HTMLElement>('[data-viewer-close]')!.focus();
  };
  const close = () => { const v = box(); if (!v) return; v.classList.remove('open'); v.setAttribute('aria-hidden', 'true'); w.__lenis?.start(); last?.focus(); };

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const look = t.closest<HTMLElement>('[data-look]'); if (look) { e.preventDefault(); open(look); return; }
    if (t.closest('[data-viewer-close]') || t.matches('[data-viewer]')) return close();
    if (t.closest('[data-viewer-next]')) return show(idx + 1);
    if (t.closest('[data-viewer-prev]')) return show(idx - 1);
    const chip = t.closest<HTMLElement>('[data-filter]');
    if (chip) {
      const f = chip.dataset.filter!;
      document.querySelectorAll<HTMLElement>('[data-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      document.querySelectorAll<HTMLElement>('[data-look]').forEach((el) => {
        const on = f === 'all' || el.dataset.cat === f;
        el.hidden = !on;
      });
      (document.querySelector('[data-look-count]') as HTMLElement | null)?.replaceChildren(String(document.querySelectorAll('[data-look]:not([hidden])').length).padStart(2, '0'));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (!box()?.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1);
  });
}
