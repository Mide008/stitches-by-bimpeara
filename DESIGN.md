# Design system: Stitches by Bimpeara

Direction: boutique atelier, editorial and luxurious. Dials (taste skill): variance 8, motion 6, density 3.
Signature devices: a running stitch that draws itself, a needle and live thread cursor that becomes a sewing machine on press, a measuring tape scroll marker, pattern drafting registration marks, arched image frames, time zone clocks.

## Colour (tokens in src/styles/global.css)
Two themes. Ivory is the default, navy is the evening version. The gold is a muted champagne and bronze, never a bright yellow. Primary buttons are ink pills, not coloured.
| Token | Ivory | Navy |
|---|---|---|
| --bg | #f5f1e9 | #0f1524 |
| --surface | #fffdf8 | #1b2339 |
| --ink | #16130f | #f3eee3 |
| --muted | #655e53 | #a3a9ba |
| --accent | #85692f | #c9aa6b |

## Type
Display: Cormorant Garamond (light and italic). Body: Jost. Signature accent: Pinyon Script, used only for the "Stitches by" mark.
Hero clamp(3.4rem, 8.4vw, 8rem) at weight 300. Smallest text 12px.

## Motion rules
Ease out for entrances (expo.out), ease in out for wipes. Press feedback scale .97. Everything reverts on page change and is off under prefers-reduced-motion. No infinite loops except the marquee and the pressed machine.

## Layout
Container max 1440px, fluid padding clamp(1.25rem, 4vw, 3.5rem). Breakpoints 640, 800, 900, 980, 1100, 1200. Checked at 390, 820 and 1440 with zero horizontal overflow.

## Motion rules (linted)
Ease tokens match the motion suite: quint-out cubic-bezier(0.22, 1, 0.36, 1). Hover effects are gated behind (hover: hover). Every pressable element has press feedback. No layout property is animated. Reduced motion is honoured in CSS and in every script.
