# PRD: Stitches by Bimpeara website

## 1. Problem
Adebimpe has built a client base across several countries, mostly through an Instagram account and word of mouth. There is no site, so a visitor who is not already convinced has nowhere to judge the work, understand the four services (bespoke sewing, ready to wear, jewellery, sunglasses), or reach her in one step. Evidence so far is anecdotal: enquiries arrive by Instagram DM and WhatsApp with no record of where they came from. This PRD is therefore partly opinion and is flagged as such. Section 5 exists to replace opinion with data within 60 days of launch.

## 2. Goals
1. Turn visitors into qualified enquiries: reach a 4% visitor to enquiry rate within 60 days (enquiry means form submit, WhatsApp click or email click).
2. Make the offer clear in 5 seconds: 70% of first time visitors scroll past the hero or open an enquiry.
3. Serve both audiences: at least 30% of enquiries come from outside Nigeria.
4. Load fast on weak networks: Largest Contentful Paint under 2.5 seconds on a mid range phone on 4G.

## 3. Target users
- **Local client:** a Nigerian bride, guest or professional who found her on Instagram and wants to check she is serious before messaging. Contacts by WhatsApp.
- **Diaspora client:** a Nigerian living in the UK, US, UAE or Canada ordering an occasion outfit from abroad. Needs reassurance on remote measurements, shipping and payment, and prefers a form or email.
- **Design literate visitor:** a stylist, creative director or press contact judging craft and taste. Needs a lookbook worth screenshotting.

Competitive alternative: Instagram alone. It shows work but gives no structure, no process and no trust signals, and it buries the services.

## 4. Requirements
**P0**
- Four category pages and a lookbook that show the work with one clear enquiry action each.
- An enquiry form plus WhatsApp and email routes, reachable in one click from every page.
- A hero that states the offer and the primary action without scrolling on phone and desktop.
- Works at 390, 820 and 1440 pixels with no horizontal scroll, light and dark themes, and reduced motion respected.
- Accessible: WCAG AA contrast, keyboard operable, form errors announced.

**P1**
- Offline fallback so a returning visitor on a poor connection still sees visited pages.
- Structured data, sitemap and per page metadata for search.
- Analytics events for every route into an enquiry (Section 5).

**P2**
- Real testimonials, real photography, and a short film on the About page.
- A second language.

## 5. Success metrics
North Star: **qualified enquiries per week.** An enquiry is a form submit, WhatsApp click or email click.

| Input | Target | Counter metric |
|---|---|---|
| Visitor to enquiry rate | 4% | Enquiry to paid order must not fall below her current rate (she tracks this manually) |
| Hero scroll or action rate | 70% | Bounce rate under 55% |
| Share of enquiries from outside Nigeria | 30% | Median reply time stays under 24 hours |
| Largest Contentful Paint | under 2.5s | No more than 1 layout shift point 0.1 |

Events already instrumented: `enquiry_open` (with interest and piece), `enquiry_submit`, `whatsapp_click`, `email_click`, `instagram_click`, `call_click`, `lookbook_open`, `theme_set`. Set `PUBLIC_PLAUSIBLE_DOMAIN` to switch them on. Each question the numbers should answer: which category drives enquiries, which piece cards get asked about, and whether visitors prefer WhatsApp or the form.

## 6. Out of scope
Online checkout and payments, because every piece is made to order or confirmed individually and shipping rules vary by country. Customer accounts. A blog. Multi language. These can follow once the enquiry data shows demand.

## 7. Open questions
- Does she want prices shown, or quote only? Owner: Adebimpe, before launch.
- What are the real timelines, payment steps and shipping policies behind the FAQ placeholders? Owner: Adebimpe, before launch.
- Who replies to enquiries, and within what time? Owner: Adebimpe, before launch.
- Which real photos and testimonials replace the stand ins? Owner: Mide with Adebimpe, before launch.
