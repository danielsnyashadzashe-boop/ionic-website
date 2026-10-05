/**
 * The service taxonomy.
 *
 * Two pillars, seven services. The split matters commercially: most firms do
 * one side or the other, and the gap between them is where transformation
 * programmes are lost. Strategy consultancies stop at the recommendation;
 * software houses start at the specification. Nobody owns the translation.
 *
 * Each service is an anchor on /services/ rather than its own page for now.
 * When one of them has enough delivered work behind it to carry a page of its
 * own, it should get one; a thin page per service is worse than a thick page
 * with seven sections.
 */

export interface Service {
  slug: string;
  /** Animated motif in the left column. See Glyph.astro. */
  glyph: 'strategy' | 'process' | 'change' | 'erp' | 'software' | 'ai' | 'run';
  pillar: 'business' | 'digital';
  name: string;
  summary: string;
  /** What is actually delivered. Concrete, not adjectives. */
  includes: string[];
  /** Case study slug or ledger client that evidences this service. */
  evidence?: { label: string; href: string };
}

export const pillars = {
  business: {
    label: 'Business transformation',
    heading: 'How the business runs',
    lede: 'Strategy, structure, process and people. The largest gains often need no new software at all, which is an awkward thing for a software company to say and true often enough that we say it.',
  },
  digital: {
    label: 'Digital transformation',
    heading: 'The systems it runs on',
    lede: 'When technology is genuinely the right answer, we build it, connect it and keep it running. We hold no reseller licences, so nothing rides on which technology that turns out to be.',
  },
} as const;

export const services: Service[] = [
  {
    slug: 'strategy',
    glyph: 'strategy',
    pillar: 'business',
    name: 'Strategy and roadmap',
    summary:
      'Where the business is trying to get to, what stands in the way, and the order things should happen in. Delivered as a sequence with costs attached, not as a deck.',
    includes: [
      'Operating model and structure review',
      'Transformation roadmap with sequencing and cost',
      'Business case and benefit tracking',
      'Build, buy or leave-alone assessment',
    ],
  },
  {
    slug: 'process',
    glyph: 'process',
    pillar: 'business',
    name: 'Process redesign and automation',
    summary:
      'Mapping how work actually runs, workarounds included, then redesigning it. Automating a process nobody has understood only produces wrong answers faster.',
    includes: [
      'Process discovery and as-is mapping in BPMN',
      'Bottleneck, rework and exception analysis',
      'To-be design grounded in Lean and Six Sigma practice',
      'Build-ready requirements and user stories',
    ],
    evidence: { label: 'Sirago and Genric', href: '/case-studies/sirago/' },
  },
  {
    slug: 'change',
    glyph: 'change',
    pillar: 'business',
    name: 'Change management and training',
    summary:
      'The half of a programme that decides whether any of the rest of it survives. A system nobody adopts is an expense, not a transformation.',
    includes: [
      'Stakeholder and impact assessment',
      'Training built around the new process, not the new screens',
      'Adoption tracking through the first operating cycles',
      'Process skills that stay with your people',
    ],
    evidence: { label: 'Tippa field rollout', href: '/case-studies/tippa/' },
  },
  {
    slug: 'erp',
    glyph: 'erp',
    pillar: 'digital',
    name: 'ERP and operations platforms',
    summary:
      'One system covering how the business actually operates, rather than a product you reshape the business around.',
    includes: [
      'Operations, logistics, finance and reporting',
      'Scheduling, jobs, assets, fleet and field work',
      'Health and safety, quality and compliance',
      'Migration off systems you cannot easily leave',
    ],
    evidence: { label: 'Kruse Group, sixteen functions', href: '/case-studies/kruse-group/' },
  },
  {
    slug: 'software',
    glyph: 'software',
    pillar: 'digital',
    name: 'Custom software, apps and integration',
    summary:
      'Built when nothing off the shelf fits, and only then. Including the boundaries where your systems have to speak to someone else’s.',
    includes: [
      'Web and mobile applications',
      'Customer and partner portals',
      'Integration with SAP, Oracle, Microsoft, CRM and legacy systems',
      'Payment and banking integration',
    ],
    evidence: { label: 'Depot in Durban, ten-day onboarding', href: '/case-studies/depot-durban/' },
  },
  {
    slug: 'ai',
    glyph: 'ai',
    pillar: 'digital',
    name: 'Data, AI and reporting',
    summary:
      'Decisions made on evidence rather than on whoever spoke last. Including document extraction, anomaly detection and reporting that writes itself.',
    includes: [
      'Document extraction, classification and validation',
      'Anomaly and fraud detection',
      'Real-time dashboards for cycle time and compliance',
      'AI-assisted reporting from field and operational data',
    ],
    evidence: { label: '3Sixty Health, fraud and waste monitoring', href: '/case-studies/3sixty-health/' },
  },
  {
    slug: 'run',
    glyph: 'run',
    pillar: 'digital',
    name: 'Managed operations and support',
    summary:
      'Staying after go-live. Sometimes that is support and maintenance; sometimes it is our people embedded in the business running the thing day to day.',
    includes: [
      'Application support and maintenance',
      'Embedded operations teams',
      'Infrastructure stabilisation and service delivery',
      'Monitoring, incident handling and continuous improvement',
    ],
    evidence: { label: 'Nogada Security', href: '/#work' },
  },
];

export const servicesByPillar = {
  business: services.filter((s) => s.pillar === 'business'),
  digital: services.filter((s) => s.pillar === 'digital'),
};
