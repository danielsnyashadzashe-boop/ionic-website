/**
 * The two home markets.
 *
 * Content-driven rather than two hand-written pages, for the same reason the
 * platforms are: a third market becomes an entry here, not a new template.
 *
 * These three pages (the global home, /ca/ and /za/) are genuine alternates
 * of one another and carry hreflang between them. Nothing else on the site
 * does, because nothing else has a regional variant.
 */

export interface Region {
  slug: 'ca' | 'za';
  code: 'CA' | 'ZA';
  country: string;
  /** For the `en-XX` hreflang and the `inLanguage` on the service schema. */
  lang: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  lede: string;
  /** Who runs delivery here, matched by name against `leadership`. */
  leadName: string;
  leadLine: string;
  /** Cities we can genuinely claim, used for `areaServed`. */
  cities: string[];
  /** Reached from the core, named for search rather than claimed as offices. */
  alsoServing: string[];
  /**
   * Postal node for the service schema. Region and country only: local search
   * reads this even without a street address, and inventing one would be
   * worse than leaving it partial.
   */
  address: { addressRegion?: string; addressCountry: string };
  /** Headline figures scoped to this market. */
  proof: { value: string; label: string }[];
  /** Sectors with real delivered work behind them in this market. */
  sectors: string[];
  /** Case study slugs to surface, in order. */
  studies: string[];
  /** Ledger clients without a full write-up, named here. */
  alsoHere: string[];
  /** Data protection regime that applies to a client in this market. */
  law: string;
  lawFull: string;
}

export const regions: Region[] = [
  {
    slug: 'ca',
    code: 'CA',
    country: 'Canada',
    lang: 'en-CA',
    title: 'Digital and business transformation in Canada.',
    seoTitle: 'Digital Transformation Consultancy Canada | Alberta | Ionic Innovate',
    seoDescription:
      'Technology-agnostic digital and business transformation from our Alberta head office, serving clients across Canada. Process automation, ERP, custom software and AI, with the Process Genesis platform.',
    lede:
      'Our head office is in Alberta and our founder runs delivery from here. The full journey, from strategy and process work through to ERP, custom software and the people who keep it running.',
    leadName: 'Reneil Harilall',
    leadLine: 'Founder and Global CEO, based in Alberta',
    cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
    alsoServing: ['Vancouver', 'Saskatoon', 'Regina', 'Winnipeg', 'Toronto', 'Ottawa', 'Montreal'],
    address: { addressRegion: 'AB', addressCountry: 'CA' },
    proof: [
      { value: '16 → 1', label: 'Business functions onto one platform at the Kruse Group' },
      { value: 'Removed', label: 'Vendor lock-in on the Kruse commercial operation' },
      { value: '20', label: 'Doctors in the ExpenseFlow pilot' },
    ],
    sectors: ['Construction and fabrication', 'Professional services', 'Healthcare administration'],
    studies: ['kruse-group'],
    alsoHere: ['Canadian medical group', 'Two Canadian accounting firms', 'Niche Consulting'],
    law: 'PIPEDA',
    lawFull: 'Personal Information Protection and Electronic Documents Act, and applicable provincial law',
  },
  {
    slug: 'za',
    code: 'ZA',
    country: 'South Africa',
    lang: 'en-ZA',
    title: 'Digital and business transformation in South Africa.',
    seoTitle: 'Digital Transformation Consultancy South Africa | Ionic Innovate',
    seoDescription:
      'Business and digital transformation for enterprise and mid-market clients across South Africa, in insurance, manufacturing, logistics, payments and security. Led by Rabind Deoraj.',
    lede:
      'Our longest-running work is here, across insurance, manufacturing, logistics, payments, field marketing and security. Delivery in South Africa is led by Rabind Deoraj.',
    leadName: 'Rabind Deoraj',
    leadLine: 'CEO, South Africa',
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
    alsoServing: ['Gqeberha', 'Bloemfontein'],
    address: { addressCountry: 'ZA' },
    proof: [
      { value: '8 mo → <1', label: 'Analysis per process at Sirago, Old Mutual Group' },
      { value: '10 days', label: 'To onboard a new client at Depot in Durban' },
      { value: '50%+', label: 'Below the closest competing quote on that ERP build' },
      { value: 'National', label: 'Tippa live countrywide' },
    ],
    sectors: [
      'Insurance',
      'Manufacturing',
      'Logistics and warehousing',
      'Digital payments',
      'Field marketing',
      'Security services',
    ],
    studies: ['sirago', 'depot-durban', 'tippa'],
    alsoHere: ['Sappi', 'Tradeway', 'Vision', 'National Video Vision', 'Nogada Security'],
    law: 'POPIA',
    lawFull: 'Protection of Personal Information Act',
  },
];

export const regionBySlug = new Map(regions.map((r) => [r.slug, r]));
