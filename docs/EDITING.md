# Editing guide

## Replace the images
1. Run `npm run images` to see every image slot, where it appears and which are still stand-ins.
2. Save each photo into `src/assets/photos/` using the slot name (for example `jewellery-3.jpg`). It replaces the stand-in automatically. Portrait 4:5, 1600px wide or more is ideal. JPG, PNG and WebP all work.
3. Run `npm run dev` and check. Astro resizes and converts everything for speed, so large originals are fine.
Order of importance: `hero-1` (it is the link preview on WhatsApp and Google), `card-1` to `card-10` (home hero), `about-1`, then the four `*-hero` images, then the rest.

## Change words, contact details and links
- Contact details and navigation: `src/data/site.ts`
- Every headline, paragraph, FAQ, piece name, testimonial and biography: `src/data/content.ts` (placeholders are marked PLACEHOLDER)
- Hero headline: `src/pages/index.astro` (search for "One designer")

## Domain
Set the environment variable `SITE_URL` (for example `https://stitchesbybimpeara.com`) in Vercel, Cloudflare or Netlify project settings. The sitemap, canonical links, social previews, structured data, robots.txt and llms.txt all update from it. Nothing else to edit.

## Turn on the extras
- Enquiry emails: add `PUBLIC_WEB3FORMS_KEY` (free at web3forms.com).
- Visitor and enquiry analytics: add `PUBLIC_PLAUSIBLE_DOMAIN`.

## After launch
Add the site to Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`. Add a Google Business Profile for local search. Link the website from Instagram.

## Prices and currencies
- Every piece has a starting price in Nigerian naira in `src/data/content.ts` (the `price:` values). **They are placeholders. Replace them with Adebimpe's real prices before launch.**
- Visitors see their own currency automatically (time zone first, browser language second, US dollars if unknown) and can change it with the Currency menu in the top menu or on any collection page. The choice is remembered. No cookies, no location prompt.
- Live exchange rates load once a day from open.er-api.com and are cached in the browser. If that is unreachable the site uses the approximate rates in `src/data/currency.ts`. Update those occasionally.
- Converted prices are rounded to clean numbers and shown as approximate. To fix an exact price in one currency, add `prices: { GBP: 195, USD: 250 }` to that piece.
- To hide all prices, remove the price lines in `src/pages/[category].astro`, the "From" lines in `src/pages/index.astro` and the price line in `src/components/PieceModal.astro`.
- To add a currency, add it to the list in `src/data/currency.ts`.

## The tape measure
It crosses the page every 15 seconds, along a different wavy route each time. Settings are at the top of `src/scripts/tapemeasure.ts` (route height, waviness, speed 8.5s, gap 15s). It switches itself off for visitors who prefer reduced motion. Colours are `--tape` and `--tape-ink` in `src/styles/global.css`.

## Security checklist after launch
1. Private repository. 2. Two factor sign in on GitHub, the host and the domain registrar. 3. Restrict the form key to your domain. 4. Commit vercel.json after every build. 5. Run `npm audit` monthly and update packages. 6. Replace the placeholder privacy text with reviewed legal wording.

## Logo
The logo is `src/assets/logo-paths.json` (taken from the supplied SVG) drawn by `src/components/Logo.astro`, so it recolours with the theme: muted bronze on ivory, champagne on navy. To use the exact brand yellow everywhere, change `--logo-1`, `--logo-2` and `--logo-3` in `src/styles/global.css` to #f5b916, #ffd52a and #e9ae08. The original file is kept at `public/brand/logo-original.svg`. The favicon, app icons and social preview image were generated from it with the exact brand yellow on navy.
