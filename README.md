# Stitches by Bimpeara

Astro 5. Plain page loads (no client router), so every link is a normal navigation. Ivory and navy themes, Cormorant Garamond type, minimal menu, photo card hero.

## Run it
    npm install
    npm run dev          # http://localhost:4321
    npm run build        # outputs /dist
    npm run preview
    npm run check        # type check every .astro and .ts file
    npm run qa           # after a build: links, titles, descriptions, h1, alt text, sitemap
    npx playwright install chromium   # once
    npm run test:e2e     # smoke tests: every page, theme, enquiry form, lookbook, hero
    npm run test:visual:update        # create visual baselines on YOUR machine (first time only)
    npm run test:visual               # compare against baselines after every change

Node 20.3 or newer works. Newer Node (22) is fine too. Stay on Astro 5 until after launch.

## Photos
Every image is a named slot (src/data/photo-slots.json). The folder src/assets/photos holds 52 illustrated stand-ins (clothes, sunglasses, jewellery), drawn as vectors. They are not photographs. Real photos with the same file names replace them automatically.
1. Get a free key at pexels.com/api, copy .env.example to .env and paste it in.
2. Delete the stand-ins you want replaced, then run `npm run photos` to download a photo for each empty slot.
3. Or drop her own photos in with the same file name (hero-1.jpg, jewellery-3.jpg, about-1.jpg, and so on).
Astro converts to WebP with responsive sizes automatically.

## Where to edit
    src/data/site.ts       contact details, nav
    src/data/content.ts    every headline, paragraph, testimonial, FAQ, piece name, bio
    src/data/schema.ts     structured data (set the live domain)
    src/styles/            global.css (tokens, cursor, tape), sections.css (layouts)
    src/scripts/           main.ts (motion), cursor.ts (needle and thread), enquiry.ts, lookbook.ts
    DESIGN.md              the design system on one page

## Deploy
Vercel: import the repo, framework Astro, no settings. vercel.json adds security and cache headers.
Cloudflare Pages: build command `npm run build`, output `dist`. public/_headers applies the same headers.
Netlify: same build settings, public/_headers is read automatically.

## Before launch
Replace the PLACEHOLDER testimonials, biography and FAQ answers in content.ts. Set the real domain in astro.config.mjs, public/robots.txt and src/data/schema.ts. Add PUBLIC_WEB3FORMS_KEY so the form emails her. Swap in the SVG logo when you have it.

## Also in the box
- docs/PRD.md: goals, users, requirements, metrics. Replace the placeholder targets with real numbers after 60 days.
- Analytics: set PUBLIC_PLAUSIBLE_DOMAIN. Events: enquiry_open, enquiry_submit, whatsapp_click, email_click, instagram_click, call_click, lookbook_open, theme_set.
- Hero cards use slots card-1 to card-10. The menu holds the collections, so the top bar stays minimal.
- Offline: public pages cache as visitors browse. sw.js is generated at build time. Unvisited pages fall back to /offline/.
- Visual baselines depend on your operating system and fonts, so they are not shipped. Generate them once, commit them, and re-run after each change.

## Search and AI discoverability (built in)
- Per page titles, descriptions, canonical links and social preview images (the preview uses the page's own hero photo).
- Structured data: business, website, collections with every piece, FAQs, breadcrumbs, About and Contact pages.
- /robots.txt welcomes search engines and AI assistants (edit src/pages/robots.txt.ts to block any of them).
- /llms.txt, /llms-full.txt and /catalogue.json give AI assistants a clean summary, the full text and structured data. All are generated from src/data, so they never go out of date.
- The domain comes from SITE_URL. See docs/EDITING.md.

## Prices, currency and the tape measure
See docs/EDITING.md. Prices are placeholders until Adebimpe confirms them.

## Release checks (all in this project)
    npm run check          # types
    npm run lint:motion    # motion linter (motion-site-suite): every motion file grades A+
    npm run qa             # static SEO, links and AI files, after a build
    npm run launch-check   # lists every placeholder and unverified claim still on the site (add --strict to fail a build)
    npm run test:e2e       # browser tests
The loader screen was removed on purpose: nothing meaningful sits behind a decorative animation.
The motion linter and tokens are from the MIT licensed motion-site-builder project (tools/ and config/).

## Security and privacy of the build (read before launch)
- Needs Node 22.23.4 or newer (the framework was upgraded to clear security advisories).
- Strict headers are generated on every build: a Content Security Policy that only allows this site's own scripts (by hash), HSTS, no framing, no sniffing, a locked down permissions policy. `npm run build` also rewrites `vercel.json`. **Commit `vercel.json` after each build.** Cloudflare Pages and Netlify read `dist/_headers` automatically.
- The build output carries no framework name: no named folders or files, no generator tag, no source maps, no default icons. Check with `grep -ril astro dist` (should print nothing). Keep the GitHub repository **private**, because `package.json` names the framework.
- The shipped site has no server, database or login, so there is nothing to break into on the site itself. The real risks are the accounts behind it: turn on two factor sign in for GitHub, your host (Vercel, Cloudflare or Netlify) and your domain registrar, and restrict the Web3Forms key to your domain in its dashboard.
- Known advisory: `npm audit` reports a regular expression issue in a build time file matcher (picomatch) with no patched release yet. It runs only while building on your machine, never in visitors' browsers. Re-run `npm audit` every month.
- Form protection: hidden trap field, a minimum time before sending, a pause between sends, length limits, control character stripping. Exchange rates are checked for sane values before use.
- A security contact is published at /.well-known/security.txt.
- Honest limit: no site can be made impossible to fingerprint. A determined person can still recognise the hosting provider from network responses and common code libraries from their behaviour. The protection comes from there being nothing to attack, not from hiding.
