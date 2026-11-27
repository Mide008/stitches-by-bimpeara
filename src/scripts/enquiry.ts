// src/scripts/enquiry.ts
import { site, waLink } from '../data/site';
import { track } from './track';

const KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined;
let lastFocus: HTMLElement | null = null;
const loadedAt = Date.now();
let lastSent = 0;
// strip control characters and cap length so nothing odd reaches the inbox
const clean = (t: string, n: number) => t.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, n);

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);

export function openEnquiry(interest?: string, piece?: string) {
  const d = $('[data-drawer]');
  if (!d) return;
  lastFocus = document.activeElement as HTMLElement;
  if (interest) {
    const sel = d.querySelector<HTMLSelectElement>('select[name=interest]');
    if (sel && [...sel.options].some((o) => o.value === interest)) sel.value = interest;
  }
  track('enquiry_open', { interest: interest ?? 'none', piece: piece ?? 'none' });
  const msg = d.querySelector<HTMLTextAreaElement>('textarea[name=message]');
  if (msg && piece && !msg.value.trim()) msg.value = `I would like to ask about: ${piece}.`;
  // a second enquiry must start from a clean form, not the previous thank you screen
  d.querySelector<HTMLElement>('[data-enquiry-form]')!.hidden = false;
  d.querySelector<HTMLElement>('[data-enq-done]')!.hidden = true;
  d.classList.add('open');
  d.setAttribute('aria-hidden', 'false');
  (window as any).__lenis?.stop();
  setTimeout(() => d.querySelector<HTMLInputElement>('input[name=name]')?.focus({ preventScroll: true }), 450);
}

export function closeEnquiry() {
  const d = $('[data-drawer]');
  if (!d) return;
  d.classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
  (window as any).__lenis?.start();
  lastFocus?.focus?.({ preventScroll: true });
}

function values(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form)) as Record<string, string>;
}

function validate(form: HTMLFormElement) {
  const fail = (name: string, msg: string) => {
    const i = form.querySelector<HTMLInputElement>(`[name=${name}]`)!;
    const e = form.querySelector<HTMLElement>(`#e-${name}`)!;
    i.classList.add('bad'); i.setAttribute('aria-invalid', 'true'); e.textContent = msg; e.hidden = false;
    return i;
  };
  form.querySelectorAll<HTMLInputElement>('input').forEach((i) => { i.classList.remove('bad'); i.removeAttribute('aria-invalid'); });
  form.querySelectorAll<HTMLElement>('.field-err').forEach((e) => { e.hidden = true; });
  const v = values(form);
  const bad: HTMLInputElement[] = [];
  if (!v.name?.trim()) bad.push(fail('name', 'Please tell her your name.'));
  const c = (v.contact ?? '').trim();
  if (!c) bad.push(fail('contact', 'Add an email or WhatsApp number so she can reply.'));
  else if (!/^\S+@\S+\.\S+$/.test(c) && c.replace(/\D/g, '').length < 7) bad.push(fail('contact', 'That does not look like an email or phone number.'));
  bad[0]?.focus();
  return bad.length === 0;
}

function waText(v: Record<string, string>) {
  return [
    `Hello Adebimpe, my name is ${v.name || '(name)'}.`,
    v.interest ? `I am interested in: ${v.interest}.` : '',
    v.country ? `I am based in ${v.country}.` : '',
    v.when ? `Timing: ${v.when}.` : '',
    v.message || '',
  ].filter(Boolean).join(' ');
}

async function submit(form: HTMLFormElement) {
  const root = form.closest<HTMLElement>('[data-enq-root]')!;
  const err = root.querySelector<HTMLElement>('[data-enq-error]')!;
  err.hidden = true;
  const v = values(form);
  if (v.botcheck) return; // bots fill the hidden field
  for (const k of Object.keys(v)) v[k] = clean(String(v[k]), k === 'message' ? 1500 : 120);
  if (!validate(form)) return;
  if (Date.now() - loadedAt < 2500 || Date.now() - lastSent < 15000) { err.textContent = 'One moment, then press send again.'; err.hidden = false; return; } // too fast to be a person, or sending twice in a row

  const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  btn.disabled = true; btn.setAttribute('aria-busy', 'true');
  const label = btn.querySelector('span'); const idle = label?.textContent ?? ''; if (label) label.textContent = 'Sending…';
  try {
    if (!KEY) {
      // No key set yet: fall back to the visitor's email app so no lead is ever lost.
      const body = encodeURIComponent(`${waText(v)}\n\nContact: ${v.contact}`);
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('New enquiry: ' + v.interest)}&body=${body}`;
    } else {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: KEY, subject: `New enquiry: ${v.interest} (${v.name})`, from_name: site.name, ...v }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Request failed');
    }
    lastSent = Date.now();
    track('enquiry_submit', { interest: v.interest ?? '', method: KEY ? 'form' : 'email_fallback' });
    form.hidden = true;
    const done = root.querySelector<HTMLElement>('[data-enq-done]')!;
    const note = done.querySelector<HTMLElement>('[data-done-note]');
    if (note) note.textContent = KEY ? 'Adebimpe will reply to the contact you left. If it is urgent, message her on WhatsApp.' : 'Your email app should have opened with the message ready. Press send there, or use WhatsApp below.';
    done.hidden = false;
    form.reset();
  } catch {
    err.textContent = 'That did not go through. Press send again, or use the WhatsApp button to reach her now.';
    err.hidden = false;
  } finally {
    btn.disabled = false; btn.removeAttribute('aria-busy'); if (label) label.textContent = idle;
  }
}

if (!(window as any).__enqBound) {
  (window as any).__enqBound = true;
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const open = t.closest<HTMLElement>('[data-open-enquiry]');
    if (open) { e.preventDefault(); closeMenu(); openEnquiry(open.dataset.interest, open.dataset.piece); return; }
    if (t.closest('[data-close-enquiry]')) { closeEnquiry(); return; }
    if (t.closest('[data-wa-send]')) {
      const form = t.closest<HTMLElement>('[data-enq-root]')!.querySelector<HTMLFormElement>('[data-enquiry-form]')!;
      window.open(waLink(waText(values(form))), '_blank', 'noopener');
    }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target as HTMLFormElement;
    if (f.matches('[data-enquiry-form]')) { e.preventDefault(); submit(f); }
  });
  document.addEventListener('keydown', (e) => {
    const d = $('[data-drawer]');
    if (!d?.classList.contains('open')) return;
    if (e.key === 'Escape') closeEnquiry();
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = [...d.querySelectorAll<HTMLElement>('button, a[href], input:not(.hp), select, textarea')].filter((x) => !x.hasAttribute('disabled') && x.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function closeMenu() {
  document.querySelector('[data-menu]')?.classList.remove('open');
  document.querySelector('[data-burger]')?.setAttribute('aria-expanded', 'false');
}
