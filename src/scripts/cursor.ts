// src/scripts/cursor.ts
// A needle that trails a live thread. Press and the needle becomes a sewing machine.
// Desktop with a fine pointer only. Respects reduced motion.
export function initCursor() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const w = window as any;
  if (!fine || reduce || w.__cursorOn) return;
  w.__cursorOn = true;

  const root = document.documentElement;
  root.classList.add('has-cursor');
  const needle = document.querySelector<HTMLElement>('[data-needle]');
  const label = document.querySelector<HTMLElement>('[data-needle-label]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-thread-canvas]');
  if (!needle || !canvas) return;
  const ctx = canvas.getContext('2d')!;

  let dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);

  const N = 26, SEG = 8.5;
  let mx = -100, my = -100, nx = mx, ny = my, down = false, running = false, lastMove = 0, upTimer = 0;
  const pts = Array.from({ length: N }, () => ({ x: -100, y: -100 }));

  const anchor = () => (down ? { x: nx - 12, y: ny - 30 } : { x: nx + 29, y: ny + 29 });

  function step() {
    // needle follows the pointer with a tiny lag so it feels held, not glued
    nx += (mx - nx) * 0.45; ny += (my - ny) * 0.45;
    needle!.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
    const a = anchor(); pts[0].x = a.x; pts[0].y = a.y;
    for (let i = 1; i < N; i++) {
      const p = pts[i], q = pts[i - 1];
      p.y += 0.55; // gravity
      const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1;
      if (d > SEG) { p.x = q.x + (dx / d) * SEG; p.y = q.y + (dy / d) * SEG; }
    }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const col = getComputedStyle(root).getPropertyValue('--accent').trim() || '#f2b91d';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 1; i < N; i++) {
      ctx.globalAlpha = 1 - (i / N) * 0.85;
      ctx.lineWidth = 1.7 - (i / N) * 0.9;
      ctx.strokeStyle = col;
      ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (performance.now() - lastMove < 1400) requestAnimationFrame(step); else running = false;
  }
  const wake = () => { lastMove = performance.now(); if (!running) { running = true; requestAnimationFrame(step); } };

  addEventListener('pointermove', (e) => {
    if (nx < 0 && ny < 0) { nx = e.clientX; ny = e.clientY; pts.forEach((p) => { p.x = e.clientX + 29; p.y = e.clientY + 29; }); }
    mx = e.clientX; my = e.clientY; needle.classList.add('is-on'); wake();
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => needle.classList.remove('is-on'));
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    const field = t.closest('input, textarea, select');
    needle.classList.toggle('is-hidden', !!field);
    const tag = t.closest<HTMLElement>('[data-cursor]');
    needle.classList.toggle('has-label', !!tag);
    if (label) label.textContent = tag?.dataset.cursor ?? '';
    needle.classList.toggle('is-link', !!t.closest('a, button, summary, [data-dot]'));
  });
  addEventListener('pointerdown', () => { clearTimeout(upTimer); down = true; needle.classList.add('is-on'); needle.classList.add('is-down'); wake(); });
  addEventListener('pointerup', () => { upTimer = window.setTimeout(() => { down = false; needle.classList.remove('is-down'); wake(); }, 520); });
}
