// src/scripts/currency.ts
// Shows every price in the visitor's currency. No cookies, no location prompt, no IP lookup:
// time zone and browser language pick the currency, and the visitor can change it in one tap.
import { BASE, currencies, detectCurrency, convert, format, fallbackRates, type Rates } from '../data/currency';
import { track } from './track';

const KEY = 'bimpeara.currency', RKEY = 'bimpeara.rates', RATE_URL = 'https://open.er-api.com/v6/latest/USD';
let rates: Rates = { ...fallbackRates };
let current = BASE;
let live = false;

export const currentCurrency = () => current;
export function priceText(base: number, override?: Partial<Record<string, number>>) {
  return format(convert(base, current, rates, override), current, navigator.language || undefined);
}

function paint() {
  document.querySelectorAll<HTMLElement>('[data-price]').forEach((el) => {
    let over: Partial<Record<string, number>> | undefined;
    try { over = el.dataset.prices ? JSON.parse(el.dataset.prices) : undefined; } catch { /* ignore bad override */ }
    el.textContent = priceText(Number(el.dataset.price), over);
    el.setAttribute('title', current === BASE ? '' : `Approximate, converted from ${BASE}`);
  });
  document.querySelectorAll<HTMLSelectElement>('[data-currency]').forEach((s) => { s.value = current; });
  document.querySelectorAll<HTMLElement>('[data-currency-note]').forEach((n) => {
    n.textContent = current === BASE
      ? 'Prices are starting prices in Nigerian naira. The final price is confirmed when you enquire.'
      : `Prices shown in ${currencies[current].name}${live ? ' at today\u2019s rate' : ', approximate'}. The final price is confirmed when you enquire.`;
  });
  document.documentElement.dataset.currency = current;
  document.dispatchEvent(new CustomEvent('currencychange'));
}

/** Accept only plausible numbers, so a tampered or broken rate feed can never put absurd prices on the page. */
function sane(r: unknown): Rates | undefined {
  if (!r || typeof r !== 'object') return undefined;
  const out: Rates = {};
  for (const [k, v] of Object.entries(r as Record<string, unknown>)) {
    const base = currencies[k]?.fallbackPerUSD;
    if (base && typeof v === 'number' && Number.isFinite(v) && v > base / 4 && v < base * 4) out[k] = v;
  }
  return out;
}

async function loadRates() {
  try {
    const cached = JSON.parse(localStorage.getItem(RKEY) || 'null');
    const c = sane(cached?.rates); if (c?.NGN) { rates = { ...fallbackRates, ...c }; live = true; }
    if (cached && Date.now() - cached.t < 24 * 3600 * 1000) return;
  } catch { /* storage unavailable */ }
  try {
    const res = await fetch(RATE_URL);
    const json = await res.json();
    const clean = sane(json?.rates);
    if (json?.result === 'success' && clean?.NGN) {
      rates = { ...fallbackRates, ...clean }; live = true;
      try { localStorage.setItem(RKEY, JSON.stringify({ t: Date.now(), rates: clean })); } catch { /* ignore */ }
      paint();
    }
  } catch { /* offline: the built in approximate rates stay */ }
}

export function initCurrency() {
  let saved: string | null = null;
  try { saved = localStorage.getItem(KEY); } catch { /* ignore */ }
  current = saved && currencies[saved] ? saved : detectCurrency(Intl.DateTimeFormat().resolvedOptions().timeZone, navigator.languages ?? [navigator.language]);
  paint();
  loadRates();
  const w = window as any;
  if (!w.__curBound) {
    w.__curBound = true;
    document.addEventListener('change', (e) => {
      const s = (e.target as HTMLElement).closest<HTMLSelectElement>('[data-currency]');
      if (!s) return;
      current = s.value;
      try { localStorage.setItem(KEY, current); } catch { /* ignore */ }
      paint(); track('currency_set', { currency: current });
    });
  }
}
