// src/data/currency.ts
// Shared by the build (first paint) and the browser (live conversion). Pure functions only.

export const BASE = 'NGN'; // the currency prices are written in, in src/data/content.ts

export const currencies: Record<string, { name: string; fallbackPerUSD: number }> = {
  NGN: { name: 'Nigerian naira', fallbackPerUSD: 1500 },
  USD: { name: 'US dollar', fallbackPerUSD: 1 },
  GBP: { name: 'British pound', fallbackPerUSD: 0.78 },
  EUR: { name: 'Euro', fallbackPerUSD: 0.92 },
  JPY: { name: 'Japanese yen', fallbackPerUSD: 150 },
  CNY: { name: 'Chinese yuan', fallbackPerUSD: 7.2 },
  CAD: { name: 'Canadian dollar', fallbackPerUSD: 1.37 },
  AUD: { name: 'Australian dollar', fallbackPerUSD: 1.52 },
  NZD: { name: 'New Zealand dollar', fallbackPerUSD: 1.65 },
  AED: { name: 'UAE dirham', fallbackPerUSD: 3.67 },
  SAR: { name: 'Saudi riyal', fallbackPerUSD: 3.75 },
  ZAR: { name: 'South African rand', fallbackPerUSD: 18.3 },
  GHS: { name: 'Ghanaian cedi', fallbackPerUSD: 14.5 },
  KES: { name: 'Kenyan shilling', fallbackPerUSD: 129 },
  SGD: { name: 'Singapore dollar', fallbackPerUSD: 1.34 },
  HKD: { name: 'Hong Kong dollar', fallbackPerUSD: 7.8 },
  KRW: { name: 'South Korean won', fallbackPerUSD: 1380 },
  INR: { name: 'Indian rupee', fallbackPerUSD: 84 },
  CHF: { name: 'Swiss franc', fallbackPerUSD: 0.88 },
  BRL: { name: 'Brazilian real', fallbackPerUSD: 5.5 },
  MXN: { name: 'Mexican peso', fallbackPerUSD: 18.5 },
};

const euro = 'AT BE CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES HR'.split(' ');
const regionToCurrency: Record<string, string> = {
  GB: 'GBP', US: 'USD', CA: 'CAD', AU: 'AUD', NZ: 'NZD', JP: 'JPY', CN: 'CNY', HK: 'HKD', SG: 'SGD', IN: 'INR', AE: 'AED', SA: 'SAR',
  ZA: 'ZAR', GH: 'GHS', KE: 'KES', NG: 'NGN', CH: 'CHF', KR: 'KRW', BR: 'BRL', MX: 'MXN', ...Object.fromEntries(euro.map((c) => [c, 'EUR'])),
};

// Time zone is the best signal we have without asking for location or calling an IP service.
const zoneToRegion: Record<string, string> = {
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
  'Europe/Vienna': 'AT', 'Europe/Lisbon': 'PT', 'Europe/Athens': 'GR', 'Europe/Helsinki': 'FI', 'Europe/Zurich': 'CH', 'Europe/Luxembourg': 'LU', 'Europe/Malta': 'MT',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US', 'America/Detroit': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'America/Montreal': 'CA',
  'America/Mexico_City': 'MX', 'America/Sao_Paulo': 'BR', 'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Chongqing': 'CN', 'Asia/Hong_Kong': 'HK', 'Asia/Singapore': 'SG', 'Asia/Seoul': 'KR',
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU',
  'Australia/Adelaide': 'AU', 'Pacific/Auckland': 'NZ', 'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Nairobi': 'KE', 'Africa/Johannesburg': 'ZA',
};

/** Best guess at the visitor's currency. Time zone first, then browser language region, then US dollars. */
export function detectCurrency(zone: string | undefined, languages: readonly string[]): string {
  const byZone = zone ? zoneToRegion[zone] : undefined;
  if (byZone && regionToCurrency[byZone]) return regionToCurrency[byZone];
  for (const l of languages) {
    const region = l.split('-')[1]?.toUpperCase();
    if (region && regionToCurrency[region]) return regionToCurrency[region];
  }
  return 'USD';
}

export type Rates = Record<string, number>; // units of each currency per 1 USD
export const fallbackRates: Rates = Object.fromEntries(Object.entries(currencies).map(([k, v]) => [k, v.fallbackPerUSD]));

/** Convert from the base currency, rounded to a clean two significant figure price. */
export function convert(amountBase: number, to: string, rates: Rates, override?: Partial<Record<string, number>>): number {
  if (override?.[to] !== undefined) return override[to]!;
  if (to === BASE) return amountBase;
  const raw = (amountBase / rates[BASE]) * (rates[to] ?? 1);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)) - 1);
  let v = Math.round(raw / mag) * mag;
  if (v < 1000) v = Math.round(v / 5) * 5 || 5;
  return v;
}

export function format(amount: number, currency: string, locale?: string): string {
  const make = (l?: string) => new Intl.NumberFormat(l, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  try { return make(locale); }
  catch { try { return make(undefined); } catch { return `${currency} ${Math.round(amount).toLocaleString()}`; } }
}
