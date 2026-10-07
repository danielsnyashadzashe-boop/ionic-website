/**
 * Single source of truth for site-wide facts.
 *
 * On the old site the contact email appeared on six pages and the headline
 * metrics on two. Changing either meant hunting through markup. Everything
 * factual now lives here and is imported.
 */

import reneilHarilall from '@/assets/people/reneil-harilall.jpg';

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
    /** Falls back to `initials` wherever this is absent. */
    photo: reneilHarilall,
    initials: 'RH',
    /** TEAM: add the LinkedIn URL. */
    linkedin: '',
    lede: 'Built Ionic Innovate to work the opposite way round from the consultancies he came from.',
    /**
     * First person, and signed. The third-person version read as copy
     * written about him rather than a note from him, which is the whole
     * point of a founder's note.
     */
    founderNote: [
      "I spent my career in consulting, at EY and at boutique firms, working across almost every sector and business unit. The clients ranged from mining houses such as Anglo American, Glencore, Exxaro and Ivanhoe Mines, to Sasol, PepsiCo, Tiger Brands, Johnson & Johnson, McDonald's, Discovery and the South African Reserve Bank. The work took me through Africa, Europe, Australia and Canada.",
      'Over those years I watched a pattern repeat. Clients paid for buzzwords, and for recommendations that lined up neatly with whichever technology the consultancy had partnered with. Every business is different, and transformation that ignores what makes a company itself rarely lasts.',
      "I started Ionic Innovate to work the other way round. We are technology-agnostic. We take the time to understand the business, its objectives and what sets it apart, and we recommend what fits. Sometimes that is a better paper form. Sometimes it is advanced AI. Usually it is a combination, and the company's foundations stay intact.",
      'I built Process Genesis so that this approach works at every level, from a blue chip to a business of ten people. Your people keep doing what they do best, and the platform turns their knowledge into transformation work without asking them to become technical experts overnight.',
      'Everyone needs to digitise and automate. Not everyone can pay what that usually costs. Having been part of the leadership in one of the large firms, I know what that work is billed at. With Process Genesis we deliver comparable results for up to 90% less, and the business stays in control.',
    ],
    bio: [],
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
/**
 * The Process Genesis taster.
 *
 * Built in the PG repository on `website/pg-taster`: a five-question, AI-backed
 * "try it" that draws your process, suggests the improved flow and generates a
 * one-screen preview of the system behind it.
 *
 * `host` is the PG deployment that serves `/taster.html` and `/taster-embed.js`.
 * While it is empty the component renders nothing, which is deliberate: a live
 * page should not carry an iframe pointed at a host that does not answer.
 *
 * Before this is switched on, three things have to be true on the PG side:
 * the backend needs `TASTER_ENABLED=true`, it needs a real API-key provider
 * (their own notes forbid serving the public with the `claude_code` provider),
 * and the deployment has to be publicly reachable over https.
 */
export const taster = {
  /** TEAM: set to the PG deployment origin, e.g. https://app.ionicinnovate.com */
  host: '',
} as const;

export const nav = {
  primary: [
    { label: 'Platforms', href: '/#platforms', children: true },
    { label: 'Services', href: '/services/' },
    { label: 'Try Process Genesis', href: '/try-process-genesis/' },
    // Case studies and insights are off the site for now; their routes
    // are parked under src/pages/_case-studies and _insights. Put these
    // two back at the same time as the folders.
    // { label: 'Case studies', href: '/case-studies/' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'About', href: '/about/' },
    // { label: 'Insights', href: '/insights/' },
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
    { label: 'Try Process Genesis', href: '/try-process-genesis/' },
    { label: 'Engagement ledger', href: '/#work' },
    // { label: 'Case studies', href: '/case-studies/' },
    // { label: 'Insights', href: '/insights/' },
    { label: 'Process Compass', href: '/process-genesis/#compass' },
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
