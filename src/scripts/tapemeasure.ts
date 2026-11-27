// src/scripts/tapemeasure.ts
// A tailor's tape measure that slithers across the screen along a wavy path, every 15 seconds.
import gsap from 'gsap';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag: string, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, String(v)));
  return e;
};

export function initTapeMeasure(firstDelay = 0) {
  const w = window as any;
  if (w.__tapeCross || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const host = document.querySelector<HTMLElement>('[data-tape-cross]');
  if (!host) return;
  w.__tapeCross = true;

  const svg = el('svg', { width: '100%', height: '100%', 'aria-hidden': 'true' });
  const defs = el('defs');
  const mask = el('mask', { id: 'tcMask', maskUnits: 'userSpaceOnUse' });
  const maskPath = el('path', { fill: 'none', stroke: '#fff', 'stroke-width': 80, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  mask.appendChild(maskPath); defs.appendChild(mask);
  const g = el('g', { mask: 'url(#tcMask)' });
  const base = el('path', { id: 'tcBase', fill: 'none', stroke: 'var(--tape)', 'stroke-width': 28, 'stroke-linejoin': 'round' });
  const edge = el('path', { fill: 'none', stroke: 'rgba(0,0,0,.16)', 'stroke-width': 30, 'stroke-linejoin': 'round' });
  const minor = el('path', { fill: 'none', stroke: 'var(--tape-ink)', 'stroke-width': 28, 'stroke-dasharray': '0.9 6.1', 'stroke-opacity': 0.55 });
  const major = el('path', { fill: 'none', stroke: 'var(--tape-ink)', 'stroke-width': 28, 'stroke-dasharray': '1.4 68.6', 'stroke-opacity': 0.85 });
  const text = el('text', { class: 'tc-text' });
  const tp = el('textPath', { href: '#tcBase', startOffset: '4' });
  text.appendChild(tp);
  g.append(edge, base, minor, major, text);
  svg.append(defs, g);
  host.appendChild(svg);

  let run = 0;
  const cross = () => {
    const W = innerWidth, H = innerHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    mask.setAttribute('x', '0'); mask.setAttribute('y', '0'); mask.setAttribute('width', String(W)); mask.setAttribute('height', String(H));

    // a fresh wavy route each time, alternating direction
    const leftToRight = run++ % 2 === 0;
    const y0 = H * (0.22 + Math.random() * 0.56);
    const amp = Math.min(H * 0.16, 150) * (0.7 + Math.random() * 0.6);
    const waves = 1.6 + Math.random() * 1.4;
    const phase = Math.random() * Math.PI * 2;
    const steps = 90;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = -220 + (W + 440) * t;
      const y = y0 + amp * Math.sin(phase + t * Math.PI * 2 * waves) + (t - 0.5) * H * 0.12;
      pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    let d = pts.join(' ');
    if (!leftToRight) { // same shape travelled the other way
      const rev = pts.map((p) => p.slice(1).split(' ')).reverse().map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`);
      d = rev.join(' ');
    }
    [maskPath, base, edge, minor, major].forEach((p) => p.setAttribute('d', d));

    const L = (base as unknown as SVGPathElement).getTotalLength();
    const segment = Math.min(L * 0.42, 1100);
    const nums = Math.ceil(L / 70);
    tp.textContent = Array.from({ length: nums }, (_, i) => String((i + 1) * 10)).join(' ');
    text.setAttribute('style', 'word-spacing:48px');

    // the visible window of tape travels along the path: this is the slither
    maskPath.setAttribute('stroke-dasharray', `${segment} ${L * 2}`);
    gsap.fromTo(maskPath, { attr: { 'stroke-dashoffset': segment } }, {
      attr: { 'stroke-dashoffset': -L }, duration: 8.5, ease: 'sine.inOut',
      onComplete: () => { gsap.delayedCall(15 - 8.5, cross); },
    });
  };
  gsap.delayedCall(firstDelay + 4, cross);
}
