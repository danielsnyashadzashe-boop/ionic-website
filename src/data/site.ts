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

/** The three figures the business leads with. */
export const metrics = [
  { label: 'Faster processing', value: '85', unit: '%' },
  { label: 'Cost reduction', value: '60', unit: '%' },
  { label: 'Accuracy', value: '99', unit: '%+' },
] as const;

export const expertise = [
  'Digital transformation',
  'Business process automation',
  'Artificial intelligence',
  'Enterprise software',
  'Governance, risk and compliance',
] as const;

/** Logos shown in the "in production at" band. */
export const marquee = ['Old Mutual', 'Fidelity', 'Bidvest', '3Sixty Health'] as const;

export const nav = {
  primary: [
    { label: 'Platforms', href: '/#platforms', children: true },
    { label: 'Case studies', href: '/case-studies/' },
    { label: 'Insights', href: '/insights/' },
    { label: 'About', href: '/#about' },
  ],
  footer: [
    { label: 'About', href: '/#about' },
    { label: 'Platforms', href: '/#platforms' },
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
