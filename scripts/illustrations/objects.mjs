// scripts/illustrations/objects.mjs
// Vector product illustrations used as stand-in imagery. Each returns SVG markup for a 900 x 1125 canvas.
const defs = (id, c) => `
<linearGradient id="${id}f" x1="0" x2="1"><stop offset="0" stop-color="${c.dark}"/><stop offset=".35" stop-color="${c.mid}"/><stop offset=".55" stop-color="${c.light}"/><stop offset=".8" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient>
<linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>`;
const gold = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c2"/><stop offset=".3" stop-color="#d9b36a"/><stop offset=".6" stop-color="#9a7430"/><stop offset=".85" stop-color="#e8c887"/><stop offset="1" stop-color="#a47c34"/></linearGradient>`;
const blur = (id, s) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
const shadow = (cy, rx = 300) => `<ellipse cx="450" cy="${cy}" rx="${rx}" ry="26" fill="#000" opacity=".3" filter="url(#bl14)"/>`;
const folds = (pts, y0, id) => pts.map((x, i) => `<path d="M450 ${y0} Q ${(450 + x) / 2 + (i % 2 ? 20 : -20)} ${y0 + 260} ${x} 1000" stroke="#000" stroke-opacity=".16" stroke-width="${26 + (i % 3) * 8}" fill="none" filter="url(#bl8)"/><path d="M450 ${y0} Q ${(450 + x) / 2 + (i % 2 ? -10 : 14)} ${y0 + 260} ${x + 30} 1000" stroke="#fff" stroke-opacity=".12" stroke-width="14" fill="none" filter="url(#bl8)"/>`).join('');

export const objects = {
  gown: (c, id) => `<defs>${defs(id, c)}${gold(id + 'g')}</defs>${shadow(1010, 330)}
    <path d="M410 190 h80 l8 70 h-96z" fill="#d8cbb6"/>
    <path d="M352 250 Q450 215 548 250 L538 420 Q520 480 512 520 Q640 760 712 985 Q450 1030 188 985 Q262 760 388 520 Q380 480 362 420Z" fill="url(#${id}f)"/>
    <path d="M352 250 Q450 215 548 250 L538 420 Q520 480 512 520 Q640 760 712 985 Q450 1030 188 985 Q262 760 388 520 Q380 480 362 420Z" fill="url(#${id}v)"/>
    <path d="M395 245 Q450 372 505 245 Q450 230 395 245Z" fill="#d8cbb6"/>
    ${folds([230, 310, 390, 450, 510, 590, 670], 520, id)}
    <path d="M384 520 Q450 548 516 520 L520 556 Q450 586 380 556Z" fill="url(#${id}g)"/>`,
  jacket: (c, id) => `<defs>${defs(id, c)}${gold(id + 'g')}</defs>${shadow(1030, 260)}
    <path d="M450 150 q0 -50 40 -50 q40 0 40 40" fill="none" stroke="#b9a889" stroke-width="9" stroke-linecap="round"/><path d="M450 152 L190 290 Q450 330 710 290Z" fill="none" stroke="#b9a889" stroke-width="7" stroke-linejoin="round"/>
    <path d="M410 262 Q300 270 250 300 Q200 330 215 520 L205 850 L300 860 L330 470 L335 900 Q450 925 565 900 L570 470 L600 860 L695 850 L685 520 Q700 330 650 300 Q600 270 490 262 L450 330Z" fill="url(#${id}f)"/>
    <path d="M410 262 Q300 270 250 300 Q200 330 215 520 L205 850 L300 860 L330 470 L335 900 Q450 925 565 900 L570 470 L600 860 L695 850 L685 520 Q700 330 650 300 Q600 270 490 262 L450 330Z" fill="url(#${id}v)"/>
    <path d="M410 262 L450 600 L330 520 L360 330Z" fill="#fff" opacity=".1"/><path d="M490 262 L450 600 L570 520 L540 330Z" fill="#000" opacity=".12"/>
    <path d="M410 262 L450 330 L490 262" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/><path d="M450 330 L450 905" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
    <circle cx="450" cy="640" r="14" fill="url(#${id}g)"/><circle cx="450" cy="740" r="14" fill="url(#${id}g)"/>
    <path d="M345 760 h95 M460 760 h95" stroke="#000" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>`,
  kaftan: (c, id) => `<defs>${defs(id, c)}${gold(id + 'g')}</defs>${shadow(1020, 320)}
    <path d="M330 250 Q450 280 570 250 L800 330 L840 600 L660 600 L690 1000 L210 1000 L240 600 L60 600 L100 330Z" fill="url(#${id}f)"/>
    <path d="M330 250 Q450 280 570 250 L800 330 L840 600 L660 600 L690 1000 L210 1000 L240 600 L60 600 L100 330Z" fill="url(#${id}v)"/>
    <ellipse cx="450" cy="262" rx="82" ry="30" fill="#0008"/><ellipse cx="450" cy="256" rx="82" ry="28" fill="#d8cbb6"/>
    <path d="M450 290 V780" stroke="url(#${id}g)" stroke-width="46"/><path d="M450 290 V780" stroke="#000" stroke-opacity=".25" stroke-width="46" stroke-dasharray="3 16"/>
    <path d="M70 600 H240 M660 600 H830" stroke="url(#${id}g)" stroke-width="14"/>${folds([270, 360, 540, 630], 560, id)}`,
  trousers: (c, id) => `<defs>${defs(id, c)}${gold(id + 'g')}</defs>${shadow(1030, 330)}
    <path d="M290 250 H610 L640 470 Q700 760 735 1010 H475 L450 560 L425 1010 H165 Q200 760 260 470Z" fill="url(#${id}f)"/>
    <path d="M290 250 H610 L640 470 Q700 760 735 1010 H475 L450 560 L425 1010 H165 Q200 760 260 470Z" fill="url(#${id}v)"/>
    <rect x="288" y="244" width="324" height="54" rx="6" fill="#000" opacity=".25"/><rect x="288" y="244" width="324" height="50" rx="6" fill="url(#${id}f)"/>
    <rect x="428" y="250" width="44" height="38" rx="5" fill="none" stroke="url(#${id}g)" stroke-width="7"/>
    <path d="M330 300 Q300 640 295 1000 M570 300 Q600 640 605 1000" stroke="#000" stroke-opacity=".2" stroke-width="3" fill="none"/>${folds([230, 320, 580, 670], 520, id)}`,
  sunglasses: (c, id, o = {}) => { const frame = o.frame ?? `url(#${id}g)`; const lens = o.shape ?? 'cat';
    const L = { cat: 'M120 520 C120 470 200 435 285 448 C365 460 405 492 412 545 C418 605 372 655 292 655 C205 655 128 620 120 520Z',
      square: 'M130 470 Q130 450 150 450 H385 Q410 450 410 475 V600 Q410 650 360 650 H175 Q130 650 130 600Z',
      round: 'M270 440 a140 140 0 1 0 0.1 0Z', aviator: 'M125 470 Q130 450 160 452 H395 Q420 455 410 500 Q395 640 300 655 Q190 660 140 560 Q122 520 125 470Z' }[lens];
    const mirror = `<g>${shadow(900, 340)}<path d="M120 520 L40 505 M780 520 L860 505" stroke="${frame}" stroke-width="22" stroke-linecap="round"/>
      <g><path d="${L}" fill="url(#${id}l)" stroke="${frame}" stroke-width="${lens === 'round' ? 12 : 22}" stroke-linejoin="round"/></g>
      <g transform="translate(900 0) scale(-1 1)"><path d="${L}" fill="url(#${id}l)" stroke="${frame}" stroke-width="${lens === 'round' ? 12 : 22}" stroke-linejoin="round"/></g>
      <path d="M410 520 Q450 490 490 520" stroke="${frame}" stroke-width="${lens === 'round' ? 10 : 20}" fill="none" stroke-linecap="round"/></g>`;
    return `<defs>${gold(id + 'g')}<linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o.lens ?? '#2a2118'}"/><stop offset=".55" stop-color="#0c0a09"/><stop offset="1" stop-color="${o.lens ?? '#2a2118'}"/></linearGradient></defs>
      <g transform="translate(0 40)">${mirror}</g><g transform="translate(0 40)" opacity=".22"><path d="M160 480 L235 465 L175 600Z M740 480 L665 465 L725 600Z" fill="#fff"/></g>`; },
  hoops: (c, id) => `<defs>${gold(id + 'g')}</defs>${shadow(900, 300)}
    <g fill="none" stroke="url(#${id}g)" stroke-linecap="round"><circle cx="235" cy="560" r="150" stroke-width="34"/><circle cx="665" cy="560" r="150" stroke-width="34"/><circle cx="235" cy="560" r="150" stroke="#fff" stroke-opacity=".25" stroke-width="6" transform="translate(-9 -9)"/><circle cx="665" cy="560" r="150" stroke="#fff" stroke-opacity=".25" stroke-width="6" transform="translate(-9 -9)"/></g>
    <circle cx="235" cy="410" r="20" fill="url(#${id}g)"/><circle cx="665" cy="410" r="20" fill="url(#${id}g)"/>`,
  drops: (c, id) => `<defs>${gold(id + 'g')}<radialGradient id="${id}p" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#e9e1d6"/><stop offset="1" stop-color="#a99d8d"/></radialGradient></defs>${shadow(1000, 280)}
    ${[300, 600].map((x) => `<circle cx="${x}" cy="330" r="30" fill="url(#${id}g)"/><path d="M${x} 360 V470" stroke="url(#${id}g)" stroke-width="10"/><path d="M${x} 470 q-86 150 0 270 q86 -120 0 -270z" fill="url(#${id}g)"/><path d="M${x} 500 q-60 110 0 205 q60 -95 0 -205z" fill="#000" opacity=".18"/><circle cx="${x}" cy="800" r="46" fill="url(#${id}p)"/>`).join('')}`,
  necklace: (c, id) => `<defs>${gold(id + 'g')}<radialGradient id="${id}p" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#eee6da"/><stop offset="1" stop-color="#a99d8d"/></radialGradient></defs>${shadow(1060, 300)}
    <path d="M170 1125 Q190 840 340 760 Q400 735 400 690 V560 Q400 480 450 480 Q500 480 500 560 V690 Q500 735 560 760 Q710 840 730 1125Z" fill="#d8c9b3"/>
    <path d="M400 690 Q450 730 500 690 V560 Q500 480 450 480 Q400 480 400 560Z" fill="#000" opacity=".08"/>
    <g fill="none" stroke="url(#${id}g)" stroke-linecap="round"><path d="M360 640 Q450 840 540 640" stroke-width="7" stroke-dasharray="2 9"/><path d="M345 668 Q450 930 555 668" stroke-width="8" stroke-dasharray="2 10"/><path d="M335 700 Q450 1010 565 700" stroke-width="6"/></g>
    <circle cx="450" cy="905" r="34" fill="url(#${id}g)"/><circle cx="450" cy="905" r="22" fill="url(#${id}p)"/>`,
  cuffs: (c, id) => `<defs>${gold(id + 'g')}</defs>${shadow(960, 320)}
    ${[[450, 760, 250, 96, 54], [450, 590, 230, 88, 40], [450, 430, 210, 80, 26]].map(([x, y, rx, ry, w]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="${w}" transform="translate(0 10)"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#${id}g)" stroke-width="${w}"/>`).join('')}`,
  ring: (c, id) => `<defs>${gold(id + 'g')}<linearGradient id="${id}d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#cfe1ee"/><stop offset="1" stop-color="#8fa8bd"/></linearGradient></defs>${shadow(900, 260)}
    <rect x="360" y="700" width="180" height="190" rx="12" fill="#e5dccd"/><rect x="360" y="700" width="180" height="40" rx="12" fill="#fff" opacity=".35"/>
    <ellipse cx="450" cy="560" rx="150" ry="180" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="40" transform="translate(0 12)"/><ellipse cx="450" cy="560" rx="150" ry="180" fill="none" stroke="url(#${id}g)" stroke-width="40"/>
    <path d="M395 395 L450 330 L505 395 L450 450Z" fill="url(#${id}d)" stroke="url(#${id}g)" stroke-width="10" stroke-linejoin="round"/><path d="M395 395 H505 M450 330 V450" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>`,
  form: (c, id) => `<defs>${defs(id, c)}${gold(id + 'g')}</defs>${shadow(1040, 260)}
    <path d="M450 150 V300" stroke="#8a7a62" stroke-width="12"/><path d="M450 150 q0 -40 34 -40" stroke="url(#${id}g)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M400 210 Q450 190 500 210 L510 250 Q580 270 600 330 L570 470 Q580 540 540 640 Q450 680 360 640 Q320 540 330 470 L300 330 Q320 270 390 250Z" fill="url(#${id}f)"/>
    <path d="M400 210 Q450 190 500 210 L510 250 Q580 270 600 330 L570 470 Q580 540 540 640 Q450 680 360 640 Q320 540 330 470 L300 330 Q320 270 390 250Z" fill="url(#${id}v)"/>
    <path d="M450 215 V640" stroke="#000" stroke-opacity=".25" stroke-width="3" stroke-dasharray="6 8"/><path d="M450 640 V960" stroke="#6d5e48" stroke-width="22"/><ellipse cx="450" cy="1000" rx="170" ry="30" fill="url(#${id}g)"/>`,
};
export const fabrics = {
  ivory: { dark: '#9c8f7a', mid: '#d6cab4', light: '#f6efe2' }, navy: { dark: '#0b1226', mid: '#1c2848', light: '#3d4f80' }, green: { dark: '#08241c', mid: '#14513f', light: '#2e8a6c' },
  burgundy: { dark: '#2a0814', mid: '#6b1730', light: '#b03a58' }, camel: { dark: '#5b4126', mid: '#a67c4e', light: '#dcb98a' }, terracotta: { dark: '#4a1d0f', mid: '#9a4527', light: '#d9835a' },
  black: { dark: '#050505', mid: '#1b1b1f', light: '#4a4a52' }, champagne: { dark: '#7c6a45', mid: '#c9b27d', light: '#f0e2bd' }, sage: { dark: '#3a4535', mid: '#7d8f72', light: '#b9c6ac' },
};
export const backdrops = {
  stone: ['#ece4d6', '#c8b99f'], navy: ['#2c3656', '#0f1626'], sand: ['#dcc7b3', '#b08f76'], mist: ['#e9e6df', '#b9b4a8'], wine: ['#40222e', '#190c13'], sage: ['#d2d8c8', '#97a38b'], noir: ['#26262b', '#09090b'], cream: ['#f4eee3', '#d9cdb8'],
};
export const scene = (kind, fabric, bg, opts = {}) => {
  const id = `s${Math.random().toString(36).slice(2, 7)}`;
  const [a, b] = backdrops[bg];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
  <defs><radialGradient id="bgr" cx=".5" cy=".38" r=".85"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>
  ${blur('bl14', 14)}${blur('bl8', 8)}
  <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/></filter>
  <radialGradient id="vg" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>
  <rect width="900" height="1125" fill="url(#bgr)"/>
  <g transform="translate(${opts.dx ?? 0} ${opts.dy ?? 0}) scale(${opts.s ?? ({ gown: 1.12, jacket: 1.1, kaftan: 1.05, trousers: 1.08, sunglasses: 1.15, necklace: 1, form: 1.05 }[kind] ?? 1)}) " style="transform-origin:450px 560px">${objects[kind](fabrics[fabric] ?? fabrics.ivory, id, opts)}</g>
  <rect width="900" height="1125" filter="url(#gr)" opacity=".16"/><rect width="900" height="1125" fill="url(#vg)"/></svg>`;
};
