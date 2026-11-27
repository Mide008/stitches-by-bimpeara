// src/data/schema.ts
// JSON-LD helpers so Google understands the business, the pages and the FAQs.
import { site, categories } from './site';
import { categoryPages } from './content';

// The live domain comes from astro.config.mjs (set SITE_URL in your host's environment settings)
const base = (import.meta.env.SITE as string).replace(/\/$/, '');

export const business = {
  '@context': 'https://schema.org',
  '@type': ['ClothingStore', 'Organization'],
  '@id': `${base}/#business`,
  name: site.name,
  alternateName: ['Stitches by Bimpeara', 'Bimpeara', 'stitchesbybimpeara'],
  slogan: site.tagline,
  url: base,
  logo: `${base}/icon-512.png`,
  image: `${base}/brand/og.jpg`,
  description: site.description,
  email: site.email,
  telephone: '+2347032852990',
  founder: { '@type': 'Person', '@id': `${base}/about/#adebimpe`, name: site.designer, jobTitle: 'Fashion designer', url: `${base}/about/` },
  address: { '@type': 'PostalAddress', addressCountry: 'NG' },
  areaServed: 'Worldwide',
  knowsAbout: ['Bespoke tailoring', 'Ready to wear fashion', 'Jewellery', 'Sunglasses', 'African fashion'],
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: '+2347032852990', email: site.email, availableLanguage: 'English' }],
  sameAs: [site.instagram],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Collections',
    itemListElement: categoryPages.map((c) => ({ '@type': 'OfferCatalog', name: c.label, url: `${base}/${c.slug}/`, description: c.metaDescription,
      itemListElement: c.pieces.map((p) => ({ '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', minPrice: p.price, priceCurrency: 'NGN' }, itemOffered: { '@type': 'Product', name: p.name, description: p.note, category: c.label, brand: { '@type': 'Brand', name: site.name } } })) })),
  },
};

export const website = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${base}/#website`, url: base, name: site.name, description: site.description, inLanguage: 'en', publisher: { '@id': `${base}/#business` } };

export const pageSchema = (type: string, name: string, path: string, description: string) => ({
  '@context': 'https://schema.org', '@type': type, name, url: base + path, description, isPartOf: { '@id': `${base}/#website` }, about: { '@id': `${base}/#business` }, inLanguage: 'en',
});

export const collectionSchema = (c: { label: string; slug: string; metaDescription: string; pieces: { name: string; note: string }[] }) => ({
  '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.label, url: `${base}/${c.slug}/`, description: c.metaDescription, isPartOf: { '@id': `${base}/#website` },
  mainEntity: { '@type': 'ItemList', itemListElement: c.pieces.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: p.name, description: p.note, category: c.label, brand: { '@type': 'Brand', name: site.name }, url: `${base}/${c.slug}/#pieces` } })) },
});

void categories;

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

export const crumbs = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: base + t.path })),
});
