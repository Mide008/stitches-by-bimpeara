// src/data/content.ts
// All page copy lives here so you can edit the words without touching layout.
// Anything marked PLACEHOLDER must be confirmed or replaced with real material before launch.

export const heroCards = {
  left: [1, 4, 3, 6, 9, 7, 5],
  right: [8, 10, 2, 5, 1, 4, 6],
};
export const cardInfo: Record<number, { href: string; alt: string }> = {
  1: { href: '/bespoke-sewing', alt: 'A burgundy gown, made to measure' }, 2: { href: '/sunglasses', alt: 'Round gold framed sunglasses' },
  3: { href: '/jewellery', alt: 'A pair of gold hoop earrings' }, 4: { href: '/ready-to-wear', alt: 'A navy tailored jacket' },
  5: { href: '/jewellery', alt: 'Layered gold necklaces with a pearl' }, 6: { href: '/ready-to-wear', alt: 'A terracotta kaftan' },
  7: { href: '/sunglasses', alt: 'Aviator sunglasses' }, 8: { href: '/jewellery', alt: 'Stacked gold cuffs' },
  9: { href: '/bespoke-sewing', alt: 'An emerald evening gown' }, 10: { href: '/ready-to-wear', alt: 'Wide leg tailored trousers' },
};

export const statement =
  'Adebimpe designs for the way you actually live. She listens first: how you move, what you are dressing for, where in the world you will wear it. Then she builds the garment, and the gold and glass that finish it.';

export const process = [
  { n: '01', title: 'Tell her the occasion', body: 'A message on WhatsApp or the enquiry form. Share the event, the date, the mood and any pictures you love.' },
  { n: '02', title: 'Measure and agree', body: 'Measurements are taken in person or sent with her guide. You approve the design before a single cut is made.' },
  { n: '03', title: 'Cut and stitched by hand', body: 'Your piece is made in her studio, with progress shared along the way so nothing is a surprise.' },
  { n: '04', title: 'Fitted, finished, shipped', body: 'Final adjustments, then it travels to you, wherever you are.' },
];

// PLACEHOLDER testimonials. Replace with real client words and real places before launch.
export const testimonials = [
  { quote: 'I sent three photos and a date. What arrived looked like it had been waiting for me. I have been stopped in the street about it.', name: 'Tolani A.', place: 'London' },
  { quote: 'Ordering from another continent felt risky. It was the easiest part of the whole wedding. The fit needed no changes at all.', name: 'Ifeoma N.', place: 'Houston' },
  { quote: 'I came for a dress and left with the earrings and the sunglasses too. Everything sat together as if it had been planned.', name: 'Zainab M.', place: 'Dubai' },
];

// PLACEHOLDER prices: every price: value above is an invented starting price in NGN. Replace with Adebimpe's real prices before launch.
// PLACEHOLDER answers. Confirm each with Adebimpe before launch.
export const homeFaqs = [
  { q: 'What is Stitches by Bimpeara?', a: 'Stitches by Bimpeara is the fashion house of Adebimpe, a designer in Nigeria. She makes bespoke clothing, ready to wear, jewellery and sunglasses, and ships worldwide.' },
  { q: 'What does she make?', a: 'Four things: bespoke sewing made to your measurements, ready to wear pieces, jewellery, and sunglasses chosen to finish the look.' },
  { q: 'Can I order from outside Nigeria?', a: 'Yes. Orders ship worldwide. Measurements can be taken remotely, and she confirms shipping details with you before anything is made.' },
  { q: 'How long does a bespoke piece take?', a: 'It depends on the design and how close your date is. Tell her the occasion when you enquire and she will confirm a realistic timeline before you commit.' },
  { q: 'Do I pay before the work begins?', a: 'She agrees the price and payment steps with you in writing first. Nothing is cut until you are happy with the plan.' },
  { q: 'What if I am not sure what I want?', a: 'Send what you have: a mood, a colour, a picture, a date. Helping you decide is part of the work.' },
];

// price is the starting price in NGN (see BASE in currency.ts). prices lets you fix an exact price for one currency, for example { GBP: 195 }.
export type Piece = { name: string; note: string; photo: string; price: number; prices?: Partial<Record<string, number>> };
export type Category = {
  slug: string; label: string; interest: string; eyebrow: string;
  title: string[]; intro: string; metaDescription: string;
  heroPhoto: string; heroAlt: string;
  piecesTitle: string; pieces: Piece[];
  detailTitle: string; details: { h: string; p: string }[];
  faqs: { q: string; a: string }[];
  cta: string;
};

export const categoryPages: Category[] = [
  {
    slug: 'bespoke-sewing', label: 'Bespoke Sewing', interest: 'Bespoke Sewing', eyebrow: 'Bespoke',
    title: ['Made for', 'one <em>body</em>.'],
    intro: 'Nothing off a rail. Every bespoke piece begins with a conversation, a set of measurements and a sketch you approve. Then it is cut, stitched and fitted to you alone.',
    metaDescription: 'Bespoke sewing by Adebimpe: wedding attire, occasion wear, tailoring and traditional outfits made to your measurements and shipped worldwide.',
    heroPhoto: 'bespoke-sewing-hero', heroAlt: 'A bespoke gown being fitted in the studio',
    piecesTitle: 'What she makes',
    pieces: [
      { name: 'Wedding and engagement attire', note: 'Gowns, traditional sets and the outfits around them.', photo: 'bespoke-sewing-1', price: 350000 },
      { name: 'Aso ebi and occasion wear', note: 'Coordinated looks for families and groups, each cut to its wearer.', photo: 'bespoke-sewing-2', price: 120000 },
      { name: 'Tailored suits and corporate wear', note: 'Structure, drape and a fit that holds through a long day.', photo: 'bespoke-sewing-3', price: 180000 },
      { name: 'Evening gowns', note: 'Made to move, built to be remembered.', photo: 'bespoke-sewing-4', price: 220000 },
      { name: 'Traditional wear', note: 'Agbada, iro and buba, kaftans and more, made with proper finish.', photo: 'bespoke-sewing-5', price: 150000 },
      { name: 'Family and children sets', note: 'Matching looks that still suit each person in them.', photo: 'bespoke-sewing-6', price: 90000 },
    ],
    detailTitle: 'How a bespoke piece comes together',
    details: [
      { h: 'Designed with you', p: 'You bring the occasion and the mood. She brings the silhouette, the fabric advice and the sketch.' },
      { h: 'Measured properly', p: 'In person in Nigeria, or remotely with her measuring guide for clients abroad.' },
      { h: 'Fitted before it leaves', p: 'Adjustments are made before delivery, not after you have already paid for a compromise.' },
    ],
    faqs: [
      { q: 'Can she copy a design I found online?', a: 'She can take direction from a picture and make it work for your body and your fabric. Share the reference when you enquire.' },
      { q: 'I live abroad. How does the fitting work?', a: 'You send measurements using her guide, and a photo or video call can cover the rest. She confirms everything before cutting.' },
      { q: 'Can I supply my own fabric?', a: 'Yes, or she can source it for you. Mention which you prefer in your enquiry.' },
    ],
    cta: 'Start your bespoke enquiry',
  },
  {
    slug: 'ready-to-wear', label: 'Ready to Wear', interest: 'Ready to Wear', eyebrow: 'Ready to Wear',
    title: ['Ready the', 'moment you <em>are</em>.'],
    intro: 'The same eye for cut and finish, without the wait. Finished pieces from the studio, chosen to be worn on a Tuesday as easily as at a celebration.',
    metaDescription: 'Ready to wear fashion by Adebimpe: finished dresses, co-ord sets, kaftans and separates, shipped worldwide.',
    heroPhoto: 'ready-to-wear-hero', heroAlt: 'A model in a finished ready to wear dress',
    piecesTitle: 'From the rail',
    pieces: [
      { name: 'The shirt dress', note: 'Clean lines, a good collar, a hem that sits right.', photo: 'ready-to-wear-1', price: 65000 },
      { name: 'Co-ord sets', note: 'Two pieces that work alone and better together.', photo: 'ready-to-wear-2', price: 85000 },
      { name: 'Wrap tops', note: 'Soft structure that flatters without effort.', photo: 'ready-to-wear-3', price: 38000 },
      { name: 'Kaftans', note: 'Easy to wear, hard to forget.', photo: 'ready-to-wear-4', price: 55000 },
      { name: 'Wide leg trousers', note: 'Movement in every step, tailored at the waist.', photo: 'ready-to-wear-5', price: 45000 },
      { name: 'Print separates', note: 'African prints cut into pieces you will actually reach for.', photo: 'ready-to-wear-6', price: 40000 },
    ],
    detailTitle: 'Why it is different from the shop down the road',
    details: [
      { h: 'Cut by the same hands', p: 'Ready to wear here follows the same pattern discipline as her bespoke work.' },
      { h: 'Sized with care', p: 'Ask her about fit for your measurements before you commit to a piece.' },
      { h: 'Shipped to you', p: 'Orders go to Nigeria and abroad. She confirms delivery details with you directly.' },
    ],
    faqs: [
      { q: 'How do I know what is available?', a: 'Stock changes. Message her on WhatsApp with the piece you like and she will confirm what is ready.' },
      { q: 'Can a ready to wear piece be altered?', a: 'Often, yes. Ask when you enquire and she will tell you what is possible.' },
      { q: 'Can I turn a ready to wear piece into a bespoke one?', a: 'If you love a design, she can remake it to your measurements. That is a bespoke order.' },
    ],
    cta: 'Ask about a piece',
  },
  {
    slug: 'jewellery', label: 'Jewellery', interest: 'Jewellery', eyebrow: 'Jewellery',
    title: ['Small things,', 'carried <em>far</em>.'],
    intro: 'Pieces designed to sit beside the clothes, or to turn a plain outfit into an occasion. Hand finished, with weight you can feel.',
    metaDescription: 'Jewellery by Adebimpe: statement earrings, necklaces, cuffs and bridal sets, designed to complement her clothing and shipped worldwide.',
    heroPhoto: 'jewellery-hero', heroAlt: 'Gold earrings and a necklace on a dark surface',
    piecesTitle: 'The collection',
    pieces: [
      { name: 'Statement earrings', note: 'Bold enough to lead the outfit.', photo: 'jewellery-1', price: 28000 },
      { name: 'Layered necklaces', note: 'Lengths that stack and still breathe.', photo: 'jewellery-2', price: 45000 },
      { name: 'Cuffs and bangles', note: 'Sculpted pieces for the wrist.', photo: 'jewellery-3', price: 35000 },
      { name: 'Beaded sets', note: 'Colour and craft, matched to your outfit.', photo: 'jewellery-4', price: 30000 },
      { name: 'Rings', note: 'Single pieces made to be noticed.', photo: 'jewellery-5', price: 25000 },
      { name: 'Bridal sets', note: 'Matched pieces for the day itself.', photo: 'jewellery-6', price: 120000 },
    ],
    detailTitle: 'Made to be worn with the clothes',
    details: [
      { h: 'Designed alongside', p: 'Pieces are chosen with her garments in mind, so the whole look agrees with itself.' },
      { h: 'Matched on request', p: 'Tell her the outfit and the colour. She will suggest what finishes it.' },
      { h: 'Packed to travel', p: 'Shipped carefully, to any address you give her.' },
    ],
    faqs: [
      { q: 'Can jewellery be matched to my outfit?', a: 'Yes. Send a photo or describe the outfit and she will recommend a match.' },
      { q: 'Do you make bridal sets?', a: 'Yes. Share the date and the dress, and she will advise.' },
      { q: 'Can I buy jewellery without ordering clothes?', a: 'Absolutely. Enquire about any piece on its own.' },
    ],
    cta: 'Ask about a piece',
  },
  {
    slug: 'sunglasses', label: 'Sunglasses', interest: 'Sunglasses', eyebrow: 'Sunglasses',
    title: ['Frames chosen', 'for the <em>face</em>.'],
    intro: 'The right pair changes the whole outfit, and the wrong pair undoes it. She helps you choose frames for your face, your skin tone and the clothes you wear.',
    metaDescription: 'Sunglasses curated by Adebimpe: cat eye, oversized, round and aviator frames chosen to complete your look, shipped worldwide.',
    heroPhoto: 'sunglasses-hero', heroAlt: 'A pair of fashion sunglasses in warm light',
    piecesTitle: 'The frames',
    pieces: [
      { name: 'Cat eye', note: 'Sharp, feminine and confident.', photo: 'sunglasses-1', price: 32000 },
      { name: 'Oversized square', note: 'Presence without a word.', photo: 'sunglasses-2', price: 30000 },
      { name: 'Round metal', note: 'Light, graphic and quietly elegant.', photo: 'sunglasses-3', price: 28000 },
      { name: 'Wraparound', note: 'Modern lines with real coverage.', photo: 'sunglasses-4', price: 34000 },
      { name: 'Aviators', note: 'The classic, chosen well.', photo: 'sunglasses-5', price: 30000 },
      { name: 'Gold rim classics', note: 'A warm metal edge to finish a look.', photo: 'sunglasses-6', price: 36000 },
    ],
    detailTitle: 'Choosing the right pair',
    details: [
      { h: 'Matched to your face', p: 'Send a photo and she will suggest shapes that suit you.' },
      { h: 'Chosen with the outfit', p: 'Frames are picked to sit with your clothes and jewellery, not against them.' },
      { h: 'Sent safely', p: 'Packed to arrive intact, wherever you live.' },
    ],
    faqs: [
      { q: 'How do I pick a shape that suits me?', a: 'Message her a clear photo of your face. She will recommend two or three shapes.' },
      { q: 'Are the lenses protective?', a: 'Ask for the details of the specific pair when you enquire and she will confirm.' },
      { q: 'Can I buy a pair with an outfit?', a: 'Yes. It is often the easiest way to get the whole look right.' },
    ],
    cta: 'Ask about a pair',
  },
];

// PLACEHOLDER biography. Replace with Adebimpe's real story before launch.
export const aboutContent = {
  title: ['The work', 'speaks <em>first</em>.'],
  intro: 'Adebimpe is a fashion designer in Nigeria. She makes clothes, jewellery and eyewear for people who notice the details, and she answers every message herself.',
  story: [
    'She works the way good tailors have always worked: she listens, then measures, then makes. Adebimpe began with a sewing machine and a stubborn eye for fit, and the clothes have done the talking since.',
    'Her clients are brides and bridesmaids, executives and creatives, mothers dressing for their children\'s weddings. They live in Lagos and in London, in Houston and in Dubai. What they share is a wish to be dressed properly, once, by someone who pays attention.',
    'The jewellery and the sunglasses came from the same instinct. A finished look needs a finishing touch, and she would rather make that touch herself than send you somewhere else for it.',
  ],
  principles: [
    { h: 'Fit before fashion', p: 'A trend lasts a season. A garment that fits stays in the wardrobe for years.' },
    { h: 'Finish you can feel', p: 'Seams, linings and hems are done the slow way, because you will notice them eventually.' },
    { h: 'Honest timelines', p: 'She tells you what is realistic before you commit, not after you have paid.' },
    { h: 'One conversation', p: 'You deal with Adebimpe directly, from the first message to the final fitting.' },
  ],
  kit: [
    { name: 'Tape', note: 'Measured twice, always' },
    { name: 'Chalk', note: 'The first line on every pattern' },
    { name: 'Shears', note: 'Reserved for cloth only' },
    { name: 'Needles', note: 'Chosen for the fabric, not the habit' },
    { name: 'Thread', note: 'Matched to the garment, never approximated' },
  ],
};

export const looks = [
  { slot: 'lookbook-1', cat: 'bespoke-sewing', ratio: '4 / 5', alt: 'A bespoke evening look' },
  { slot: 'lookbook-2', cat: 'ready-to-wear', ratio: '3 / 4', alt: 'A ready to wear set' },
  { slot: 'lookbook-3', cat: 'jewellery', ratio: '1 / 1', alt: 'Gold jewellery detail' },
  { slot: 'lookbook-4', cat: 'sunglasses', ratio: '3 / 4', alt: 'Sunglasses styled with a look' },
  { slot: 'lookbook-5', cat: 'bespoke-sewing', ratio: '4 / 5', alt: 'A bespoke gown' },
  { slot: 'lookbook-6', cat: 'bespoke-sewing', ratio: '3 / 4', alt: 'A tailored occasion outfit' },
  { slot: 'lookbook-7', cat: 'jewellery', ratio: '4 / 5', alt: 'Statement earrings worn' },
  { slot: 'lookbook-8', cat: 'sunglasses', ratio: '1 / 1', alt: 'Gold rimmed sunglasses' },
  { slot: 'lookbook-9', cat: 'ready-to-wear', ratio: '4 / 5', alt: 'A tailored ready to wear jacket' },
];

// Answer first facts. Shown on the home page and repeated in llms.txt so people and AI assistants read the same thing.
export const glance = [
  { k: 'Designer', v: 'Adebimpe' },
  { k: 'Makes', v: 'Bespoke clothing, ready to wear, jewellery, sunglasses' },
  { k: 'Based', v: 'Nigeria' },
  { k: 'Ships to', v: 'Anywhere in the world' },
  { k: 'Order by', v: 'WhatsApp, email or the enquiry form' },
  { k: 'Pricing', v: 'From a starting price, shown in your currency' }, // PLACEHOLDER: confirm with Adebimpe
];
