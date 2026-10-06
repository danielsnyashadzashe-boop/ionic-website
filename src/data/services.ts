/**
 * The service taxonomy.
 *
 * Two pillars, seven services, and the wording is the wording Reneil already
 * signed off in the handover rather than anything written here. An earlier
 * version carried a summary and four bullet points per service that nobody
 * had agreed to: thirty-five claims about what we deliver, generated from a
 * one-line heading. They have been replaced by the real description and, in
 * place of invented capability lists, the clients each service has actually
 * been delivered for.
 *
 * If a service has no client against it, that is the honest state and the
 * page shows nothing rather than filling the gap.
 */

export interface Service {
  slug: string;
  /** Animated motif in the left column. See Glyph.astro. */
  glyph: 'strategy' | 'process' | 'change' | 'erp' | 'software' | 'ai' | 'run';
  pillar: 'business' | 'digital';
  name: string;
  summary: string;
  /** Clients this has been delivered for. Named, not described. */
  seenIn: { label: string; href?: string }[];
}

export const pillars = {
  business: {
    label: 'Business transformation',
    heading: 'How the business runs',
    lede: 'Strategy, structure, processes and people. We start here even when the answer ends up being software, because automating a process nobody has questioned only makes the wrong thing faster.',
  },
  digital: {
    label: 'Digital transformation',
    heading: 'The systems it runs on',
    lede: 'When technology is the right answer, we design it, build it, connect it to what you already have and keep it running. We do not resell licences, so we recommend off-the-shelf where it fits.',
  },
} as const;

export const services: Service[] = [
  {
    slug: 'strategy',
    glyph: 'strategy',
    pillar: 'business',
    name: 'Strategy and roadmap',
    summary:
      'Digital and operating strategy tied to what the business is trying to achieve, and a roadmap that sequences the work by value and effort. Includes operating model and organisation design where structure is part of the problem.',
    seenIn: [{ label: 'Sirago', href: '/case-studies/sirago/' }],
  },
  {
    slug: 'process',
    glyph: 'process',
    pillar: 'business',
    name: 'Process redesign and automation',
    summary:
      'We map how work really runs with Process Genesis, find the bottlenecks, rework and manual effort, then redesign. What is worth automating gets automated; the rest gets simpler.',
    seenIn: [
      { label: 'Sirago', href: '/case-studies/sirago/' },
      { label: 'Kruse Group', href: '/case-studies/kruse-group/' },
    ],
  },
  {
    slug: 'change',
    glyph: 'change',
    pillar: 'business',
    name: 'Change management and training',
    summary:
      'Adoption planning, communication and hands-on training, so people actually use what has been built. Process Genesis teaches process thinking along the way, which leaves skills behind when we step back.',
    seenIn: [
      { label: 'Tippa', href: '/case-studies/tippa/' },
      { label: 'Genric', href: '/case-studies/sirago/' },
    ],
  },
  {
    slug: 'erp',
    glyph: 'erp',
    pillar: 'digital',
    name: 'ERP and operations platforms',
    summary:
      'ERP selection, implementation and replacement, or a custom operations platform when off-the-shelf will not fit how you work. Finance, operations, logistics, jobs, assets, people and reporting in one place.',
    seenIn: [
      { label: 'Kruse Group', href: '/case-studies/kruse-group/' },
      { label: 'Depot in Durban', href: '/case-studies/depot-durban/' },
      { label: 'NVV', href: '/case-studies/national-video-vision/' },
    ],
  },
  {
    slug: 'software',
    glyph: 'software',
    pillar: 'digital',
    name: 'Custom software, apps and integration',
    summary:
      'Web platforms, mobile apps and customer portals, connected to the systems you already run, including SAP, SharePoint and banking partners.',
    seenIn: [
      { label: 'Sappi' },
      { label: 'Tippa', href: '/case-studies/tippa/' },
      { label: 'Tradeway' },
    ],
  },
  {
    slug: 'ai',
    glyph: 'ai',
    pillar: 'digital',
    name: 'Data, AI and reporting',
    summary:
      'Dashboards and reporting that build themselves, document reading and classification, and AI assistants built into the process where they save real time. We use AI where it earns its place, not as a label.',
    seenIn: [{ label: 'Tradeway' }, { label: 'ExpenseFlow', href: '/expenseflow/' }],
  },
  {
    slug: 'run',
    glyph: 'run',
    pillar: 'digital',
    name: 'Managed operations and support',
    summary:
      'Support and maintenance after go-live, IT stabilisation when internal support falls away, and embedded people to run operations where you need them.',
    seenIn: [{ label: 'Nogada Security' }, { label: 'Tippa', href: '/case-studies/tippa/' }],
  },
];

export const servicesByPillar = {
  business: services.filter((s) => s.pillar === 'business'),
  digital: services.filter((s) => s.pillar === 'digital'),
};
