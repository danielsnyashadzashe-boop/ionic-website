/**
 * Single source of truth for site-wide facts.
 *
 * On the old site the contact email appeared on six pages and the headline
 * metrics on two. Changing either meant hunting through markup. Everything
 * factual now lives here and is imported.
 */

export const site = {
  name: 'Ionic',
  legalName: 'Ionic Innovate',
  domain: 'https://www.ionicinnovate.com',
  slogan: 'Digital Transformation. Powered by AI.',
  tagline: 'Strategize. Transform. Scale.',
  description:
    'Digital and business transformation consultancy powered by AI-enabled technology, combining strategic consulting with a portfolio of proprietary SaaS products.',
  responseTime: 'within one business day',
} as const;

export const contact = {
  email: 'info@ionicinnovate.com',
  investorEmail: 'info@ionicinnovate.com',
  /** Handler is plain PHP, kept from the previous site and deployed alongside. */
  formAction: '/contact.php',
} as const;

export const locations = [
  { name: 'South Africa', code: 'ZA', status: 'active' },
  { name: 'Canada', code: 'CA', status: 'active' },
  { name: 'Australia', code: 'AU', status: 'planned', from: '2026' },
] as const;

/**
 * The three figures the business leads with.
 *
 * These are still reported by clients rather than independently measured, and
 * `metricsNote` says so wherever they appear. A percentage with no stated
 * basis is the first thing questioned in procurement, so the basis travels
 * with the number instead of being left to the reader.
 */
export const metrics = [
  { label: 'Faster processing', value: '85', unit: '%' },
  { label: 'Cost reduction', value: '60', unit: '%' },
  { label: 'Accuracy', value: '99', unit: '%+' },
] as const;

export const metricsNote =
  'Reported by clients on their own engagements. Your figure depends on scope, and we put it in writing before you commit.';

/**
 * The cost comparison, kept separate from the three above because it is a
 * comparison rather than a measurement, and it carries its own basis.
 */
export const costComparison = {
  value: 'Up to 90%',
  label: 'Lower than a traditional consultancy programme of similar scope',
  basis:
    'Compared against typical large-consultancy fees for discovery, process design and requirements work. Scope changes the figure.',
} as const;

/**
 * Named leadership.
 *
 * The site ran without a single named person on it, which for a consultancy
 * is a strange omission: the people are what is being bought. Photographs are
 * still outstanding, so each entry carries initials the components fall back
 * to rather than rendering an empty frame.
 */
export const leadership = [
  {
    name: 'Reneil Harilall',
    role: 'Founder and Global CEO',
    base: 'Alberta, Canada',
    initials: 'RH',
    /** TEAM: add the LinkedIn URL. */
    linkedin: '',
    lede: 'Built Ionic Innovate to work the opposite way round from the consultancies he came from.',
    bio: [
      'Reneil spent his career in consulting, at EY and at boutique firms, across almost every sector and business unit. That work took him through Africa, Europe, Australia and Canada.',
      'The pattern he kept seeing was clients paying for buzzwords, and for recommendations that lined up neatly with whichever technology the consultancy had partnered with. Every business is different, and transformation that ignores what makes a company itself rarely survives contact with the people who have to live with it.',
      'He started Ionic Innovate to do it the other way round: understand the business and what sets it apart, then recommend what fits. Sometimes that is a better paper form. Sometimes it is advanced AI. Usually it is a combination, and the foundations stay intact.',
      'He built Process Genesis so the approach works at every size, from a listed group to a business of ten people, without asking anyone to become a technical expert overnight.',
    ],
  },
  {
    name: 'Rabind Deoraj',
    role: 'CEO, South Africa',
    base: 'South Africa',
    initials: 'RD',
    linkedin: 'https://www.linkedin.com/in/rabind-deoraj-16454721/',
    lede: 'Twenty years keeping business-critical systems running where downtime was not an option.',
    bio: [
      "Rabind has spent nearly twenty years running IT infrastructure and operations in some of South Africa's most demanding environments. At Engen he led manufacturing IT, including refinery operations, and went on to head infrastructure and operations.",
      'Before that he held regional service delivery leadership roles at SAB and Shell South Africa.',
      'He knows what it takes to keep business-critical systems running when downtime is not an option, and brings that discipline to every South African engagement: governance, service delivery and solution architecture that holds up in production.',
    ],
    qualification: 'BCom Information Systems, University of South Africa',
  },
] as const;

/**
 * Where the business actually operates from.
 *
 * Street addresses and phone numbers are still outstanding. Until they land,
 * this is at least more than the nothing that was here before.
 */
export const offices = [
  {
    code: 'CA',
    region: 'Canada',
    heading: 'Alberta head office',
    detail: 'Serving clients Canada-wide',
    cities: ['Calgary', 'Edmonton'],
    /** TEAM: add street address and phone. */
    address: '',
    phone: '',
  },
  {
    code: 'ZA',
    region: 'South Africa',
    heading: 'Nationwide',
    detail: 'Enterprise and mid-market clients across the country',
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
    address: '',
    phone: '',
  },
] as const;

/**
 * Data protection regimes we work within. Named rather than gestured at,
 * because "bank-grade" is not a regulation and buyers in insurance and
 * healthcare ask which one applies to them.
 */
export const compliance = [
  {
    code: 'ZA',
    law: 'POPIA',
    full: 'Protection of Personal Information Act',
    region: 'South Africa',
  },
  {
    code: 'CA',
    law: 'PIPEDA',
    full: 'Personal Information Protection and Electronic Documents Act',
    region: 'Canada',
    note: 'and applicable provincial law',
  },
] as const;

/**
 * Industries we see most often.
 *
 * Deliberately separate from a region's `sectors`, which lists only where
 * there is delivered work behind the name. This is the broader list, and the
 * pages that show it say which is which. Conflating the two would turn
 * "we have done this" into "we would take this on".
 */
export const industries = [
  'Construction and fabrication',
  'Manufacturing',
  'Energy and resources',
  'Financial services and insurance',
  'Healthcare and professional practices',
  'Professional services',
  'Logistics and distribution',
  'Retail and consumer',
  'Trades and field services',
  'Events and hospitality',
] as const;

/**
 * Experience the team brings from before Ionic.
 *
 * Sectors and continents only. The named clients behind this belong to former
 * employers, and listing them next to our own client work would read as ours.
 */
export const priorExperience = {
  sectors: ['mining', 'energy', 'financial services', 'consumer goods', 'healthcare'],
  regions: ['Canada', 'Africa', 'Europe', 'Australia'],
} as const;

export const expertise = [
  'Digital transformation',
  'Business process automation',
  'Artificial intelligence',
  'Enterprise software',
  'Governance, risk and compliance',
] as const;

/** Logos shown in the "in production at" band. */
export const marquee = ['Sirago', 'Kruse Group', 'Depot in Durban', 'Sappi', 'Tippa'] as const;

/**
 * Navigation. This is the only source: Header.astro reads `primary` and
 * Footer.astro reads `footer`. The header used to keep its own array, which
 * drifted out of step and meant a new page could be added here and still be
 * unreachable from the nav.
 *
 * `children: true` marks the entry that opens the mega menu rather than
 * being a plain link; the header skips it and renders that markup itself.
 */
export const nav = {
  primary: [
    { label: 'Platforms', href: '/#platforms', children: true },
    { label: 'Services', href: '/services/' },
    { label: 'Case studies', href: '/case-studies/' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'About', href: '/about/' },
    { label: 'Insights', href: '/insights/' },
  ],
  /** The two home markets. Rendered as a compact switch, not as nav items. */
  regions: [
    { label: 'CA', href: '/ca/', title: 'Canada' },
    { label: 'ZA', href: '/za/', title: 'South Africa' },
  ],
  footer: [
    { label: 'About', href: '/about/' },
    { label: 'Ionic in Canada', href: '/ca/' },
    { label: 'Ionic in South Africa', href: '/za/' },
    { label: 'Services', href: '/services/' },
    { label: 'Platforms', href: '/#platforms' },
    { label: 'Engagement ledger', href: '/#work' },
    { label: 'Case studies', href: '/case-studies/' },
    { label: 'Insights', href: '/insights/' },
    { label: 'Privacy', href: '/privacy/' },
    { label: 'Contact', href: '/contact/' },
  ],
} as const;

/** Data-viz hues from global.css. Products and charts share one set so a
    legend and a product page read as the same system. */
export type Tone = 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6';

export const localityLine = locations
  .map((l) => (l.status === 'planned' ? `${l.name} (${l.from})` : l.name))
  .join(' · ');
