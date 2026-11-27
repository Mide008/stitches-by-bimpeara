// src/scripts/pieces.ts
// Quick view modal for the piece cards on category pages.
import { openEnquiry } from './enquiry';
import { track } from './track';
import { priceText } from './currency';

const w = window as any;
if (!w.__pmBound) {
  w.__pmBound = true;
  let items: HTMLElement[] = [], idx = 0, last: HTMLElement | null = null;
  const modal = () => document.querySelector<HTMLElement>('[data-pm]');
  const q = <T extends HTMLElement>(s: string) => modal()!.querySelector<T>(s)!;

  const show = (n: number) => {
    const m = modal(); if (!m || !items.length) return;
    idx = (n + items.length) % items.length;
    const card = items[idx];
    const media = q('[data-pm-media]'); media.replaceChildren();
    const img = card.querySelector('img'), ph = card.querySelector('.ph');
    if (img) { const c = img.cloneNode() as HTMLImageElement; c.removeAttribute('width'); c.removeAttribute('height'); c.sizes = '(min-width: 820px) 50vw, 100vw'; c.loading = 'eager'; media.appendChild(c); }
    else if (ph) media.appendChild(ph.cloneNode(true));
    q('[data-pm-cat]').textContent = card.dataset.cat ?? '';
    q('[data-pm-name]').textContent = card.dataset.name ?? '';
    q('[data-pm-note]').textContent = card.dataset.note ?? '';
    let over: Partial<Record<string, number>> | undefined; try { over = JSON.parse(card.dataset.basePrices || '{}'); } catch { /* ignore */ }
    q('[data-pm-price]').textContent = priceText(Number(card.dataset.basePrice), over);
    q('[data-pm-count]').textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    const msg = `Hello Adebimpe, I would like to ask about: ${card.dataset.name} (${card.dataset.cat}), from ${q('[data-pm-price]').textContent}.`;
    q<HTMLAnchorElement>('[data-pm-wa]').href = `${m.dataset.wa}?text=${encodeURIComponent(msg)}`;
  };
  const open = (el: HTMLElement) => {
    const m = modal(); if (!m) return;
    items = [...document.querySelectorAll<HTMLElement>('[data-piece-open]')];
    last = el; show(items.indexOf(el));
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); w.__lenis?.stop();
    track('piece_view', { piece: el.dataset.name ?? '' });
    q('.pm-x').focus();
  };
  const close = () => { const m = modal(); if (!m) return; m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); w.__lenis?.start(); last?.focus(); };

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const card = t.closest<HTMLElement>('[data-piece-open]'); if (card) { open(card); return; }
    if (t.closest('[data-pm-close]')) return close();
    if (t.closest('[data-pm-next]')) return show(idx + 1);
    if (t.closest('[data-pm-prev]')) return show(idx - 1);
    if (t.closest('[data-pm-wa]')) track('whatsapp_click', { where: 'piece_modal' });
    if (t.closest('[data-pm-ask]')) { const c = items[idx]; close(); setTimeout(() => openEnquiry(c.dataset.interest, `${c.dataset.name} (from ${q('[data-pm-price]').textContent})`), 250); }
  });
  document.addEventListener('keydown', (e) => {
    if (!modal()?.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
}
