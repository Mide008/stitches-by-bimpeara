// src/scripts/silk.ts
// A slow, lit silk drape rendered in a tiny WebGL shader behind the hero. No library.
// Desktop only, half resolution, paused when off screen. If WebGL is unavailable nothing is shown.
const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
const FRAG = `precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
float h(vec2 p){ float v = 0.; vec2 q = p;
  for (int i = 0; i < 4; i++) { float f = float(i); q += .38 * vec2(sin(q.y * 1.7 + t * .12 + f), cos(q.x * 1.3 - t * .10 + f * 1.7)); v += sin(q.x * 2.1 + q.y * 1.15 + t * .16) / (1. + f); }
  return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / r.y * 1.25; float e = .012;
  float a = h(uv); float dx = h(uv + vec2(e, 0.)) - a; float dy = h(uv + vec2(0., e)) - a;
  vec3 n = normalize(vec3(-dx * 22., -dy * 22., 1.));
  vec3 L = normalize(vec3(m.x - .5, m.y - .25, .75));
  float d = clamp(dot(n, L), 0., 1.);
  float s = pow(clamp(dot(n, normalize(L + vec3(0., 0., 1.))), 0., 1.), 28.);
  vec3 col = mix(c1, c2, d) + c3 * s * .55;
  gl_FragColor = vec4(col, 1.);
}`;

const hex = (v: string, fb: [number, number, number]): [number, number, number] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(v.trim());
  if (!m) return fb;
  const n = parseInt(m[1], 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};

export function initSilk() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-silk]');
  const w = window as any;
  if (!canvas || w.__silk) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover) and (min-width: 900px)').matches) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = mk(gl.VERTEX_SHADER, VERT), fs = mk(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  w.__silk = true;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uR = u('r'), uT = u('t'), uM = u('m'), uC1 = u('c1'), uC2 = u('c2'), uC3 = u('c3');

  const colours = () => {
    const cs = getComputedStyle(document.documentElement);
    const navy = document.documentElement.dataset.theme === 'navy';
    gl.uniform3fv(uC1, hex(cs.getPropertyValue('--bg-2'), navy ? [.08, .11, .19] : [.93, .9, .85]));
    gl.uniform3fv(uC2, hex(cs.getPropertyValue('--bg'), navy ? [.12, .16, .26] : [1, .99, .97]));
    gl.uniform3fv(uC3, hex(cs.getPropertyValue('--accent-2'), [.72, .6, .36]));
  };
  colours();
  new MutationObserver(colours).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const size = () => { canvas.width = Math.max(2, Math.round(innerWidth * 0.5)); canvas.height = Math.max(2, Math.round(innerHeight * 0.5)); gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uR, canvas.width, canvas.height); };
  size(); addEventListener('resize', size);

  let mx = .5, my = .5, tx = .5, ty = .5, visible = true, raf = 0, frame = 0;
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(draw); });

  function draw(now: number) {
    raf = 0;
    if (!visible || document.hidden) return;
    if (frame++ % 2 === 0) { // about 30 frames a second is plenty for a slow drape
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      gl!.uniform1f(uT, now / 1000); gl!.uniform2f(uM, mx, my);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    raf = requestAnimationFrame(draw);
  }
  canvas.classList.add('on');
  raf = requestAnimationFrame(draw);
}
