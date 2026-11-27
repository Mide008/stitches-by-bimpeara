// src/data/site.ts
// Single source of truth for brand facts, contact details and navigation.
export const site = {
  name: 'Stitches by Bimpeara',
  handle: 'stitchesbybimpeara',
  designer: 'Adebimpe',
  tagline: 'One designer. Your whole look.',
  strap: 'Made to measure. Made to match. Shipped worldwide.',
  description:
    'Adebimpe designs bespoke clothing, ready to wear, jewellery and sunglasses in Nigeria. Made to measure, made to match, shipped worldwide.',
  email: 'adewoleadebimpe418@gmail.com',
  phoneDisplay: '+234 703 285 2990',
  whatsapp: '2347032852990',
  instagram: 'https://www.instagram.com/stitchesbybimpeara',
  location: 'Nigeria · Shipping worldwide',
};

export const categories = [
  { slug: 'bespoke-sewing', label: 'Bespoke Sewing', short: 'Bespoke', blurb: 'Made to your measurements, from first sketch to final fitting.' },
  { slug: 'ready-to-wear', label: 'Ready to Wear', short: 'Ready to Wear', blurb: 'Finished pieces in stock, cut to the same standard.' },
  { slug: 'jewellery', label: 'Jewellery', short: 'Jewellery', blurb: 'Small, heavy, hand finished. Made to sit beside the clothes.' },
  { slug: 'sunglasses', label: 'Sunglasses', short: 'Sunglasses', blurb: 'Frames chosen for the face, not the trend.' },
] as const;

export const nav = [
  ...categories.map((c) => ({ href: `/${c.slug}`, label: c.short })),
  { href: '/about', label: 'About' },
  { href: '/lookbook', label: 'Lookbook' },
];

export const waLink = (text = 'Hello Adebimpe, I found you online and I would like to make an enquiry.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
