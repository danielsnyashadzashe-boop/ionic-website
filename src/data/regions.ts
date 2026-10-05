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

export interface RegionFaq {
  q: string;
  a: string;
}

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
  /** Sectors with real delivered work behind them in this market. */
  sectors: string[];
  /** Case study slugs to surface, in order. */
  studies: string[];
  /** Ledger clients without a full write-up, named here. */
  alsoHere: string[];
  /** Data protection regime that applies to a client in this market. */
  law: string;
  lawFull: string;
  body: string[];
  faqs: RegionFaq[];
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
    cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
    sectors: ['Construction and fabrication', 'Professional services', 'Healthcare administration'],
    studies: ['kruse-group'],
    alsoHere: ['Canadian medical group', 'Two Canadian accounting firms', 'Niche Consulting'],
    law: 'PIPEDA',
    lawFull: 'Personal Information Protection and Electronic Documents Act, and applicable provincial law',
    body: [
      'Most of the Canadian work so far has been with owner-run businesses and professional practices rather than with listed groups, and that shapes how we price and how we start. A company of forty people cannot absorb a six-month discovery phase before anything changes, and it should not have to.',
      'The pattern we see most often here is a business that has outgrown its software without noticing. It bought a system that fitted at the time, grew around the parts that did not fit, and now runs on the system plus a layer of spreadsheets, paper and a few people who remember how it all connects. That is not a software problem to be solved by buying more software.',
      'So we map first, including the workarounds, and then recommend. Sometimes the answer is a platform. Sometimes it is a better form and a changed approval rule. We have no licences to resell, so we have nothing riding on which it turns out to be.',
    ],
    faqs: [
      {
        q: 'Do you work outside Alberta?',
        a: 'Yes. The head office is in Alberta and that is where most of our Canadian delivery is run from, but the work is remote-capable and we travel for the parts that benefit from being in the room, which is usually the mapping.',
      },
      {
        q: 'What does an engagement typically cost?',
        a: 'It depends on scope, and we put a figure in writing before you commit to anything. The thing that makes our number different from a large firm is that Process Genesis carries the analysis work that would otherwise be billed as consultant hours.',
      },
      {
        q: 'Where is our data held?',
        a: 'We work within PIPEDA and applicable provincial law, and we agree hosting and data residency with you before anything is loaded. If your sector requires data to stay in Canada, say so at the start and it will shape the architecture rather than being retrofitted.',
      },
      {
        q: 'Can you work with the systems we already have?',
        a: 'Usually, yes, and we would rather. Replacing a system that works is expensive and risky. Most of what we do connects to what is already there, and we will tell you plainly when something genuinely has reached the end of its life.',
      },
    ],
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
    body: [
      'South Africa is where the work started and where most of it still runs. The range is deliberate: an underwriting manager in the Old Mutual Group, a depot operator in Durban, a national payments platform, a paper manufacturer, two field marketing companies and a security firm. Very little of that is the same problem twice.',
      'What does repeat is the seam. In almost every one of these businesses the people who understand how the work runs and the people who change the systems sit in different rooms, sometimes in different companies, and the cost shows up as rework rather than as a line item anybody tracks.',
      'That is the gap Process Genesis was built to close, and Sirago is the clearest demonstration of it we have: analysis that took eight months per process now takes under one, produced by Sirago’s own people and built against by Genric, the group company that maintains their systems.',
    ],
    faqs: [
      {
        q: 'Do you only work with large enterprises?',
        a: 'No. The client list runs from an Old Mutual Group company to an owner-run depot, and the approach is the same at both ends. Process Genesis is sized and priced so a small business can use it as well as a group.',
      },
      {
        q: 'How is our data protected?',
        a: 'We work within POPIA, and we agree hosting and data residency with you before anything is loaded. Where an engagement touches personal information, we say at the outset what is collected, where it sits and who can reach it.',
      },
      {
        q: 'Can our own people run the platform after you leave?',
        a: 'That is the intended outcome rather than an upsell we resist. Sirago’s business teams produce their own process maps and requirements now, and Genric runs the development module as its own delivery tooling. If a client wants us to stay and run operations, as Tippa does, we do that instead.',
      },
      {
        q: 'Which cities do you cover?',
        a: 'We work nationally. Most engagements have involved Johannesburg, Cape Town, Durban and Pretoria, and the mapping phase is the part worth doing on site wherever you are.',
      },
    ],
  },
];

export const regionBySlug = new Map(regions.map((r) => [r.slug, r]));
