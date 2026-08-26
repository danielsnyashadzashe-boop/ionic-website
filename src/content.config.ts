import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const tone = z.enum(['d1', 'd2', 'd3', 'd4', 'd5', 'd6']);

/** Key into the photo registry in src/data/photos.ts. */
const photo = z.enum([
  'nightEngineering',
  'analyticsBriefing',
  'codeReview',
  'aiInterface',
  'modelMonitoring',
  'deliveryTeam',
  'programmeDelivery',
]);

/**
 * Products. Four entries today; adding a fifth is a Markdown file, not a
 * new page template. Zod fails the build on malformed content, so a typo
 * in frontmatter can never reach production.
 */
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    order: z.number(),
    flagship: z.boolean().default(false),
    tone,
    kicker: z.string(),
    summary: z.string(),
    lede: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    capabilities: z
      .array(
        z.object({
          name: z.string(),
          detail: z.string(),
        }),
      )
      .min(1),
    traction: z.object({
      heading: z.string(),
      items: z.array(
        z.object({
          client: z.string(),
          detail: z.string(),
        }),
      ),
    }),
    showMetrics: z.boolean().default(false),
    homeProof: z.string(),
    photo: photo.optional(),
  }),
});

/**
 * Case studies. Seeded from the six one-line testimonials on the old site,
 * each of which was carrying a real engagement it had no room to describe.
 */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    client: z.string(),
    title: z.string(),
    engagement: z.string(),
    products: z.array(z.string()),
    tone,
    sector: z.string(),
    region: z.string(),
    stage: z.enum(['Production', 'Pilot', 'Partner', 'Prospect']),
    order: z.number(),
    summary: z.string(),
    quote: z.string(),
    /** Company-attributed on the old site; no individual was ever named. */
    quoteAttribution: z.string(),
    highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    featured: z.boolean().default(false),
  }),
});

/** Insights. Empty-tolerant so the section can ship before it has volume. */
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Ionic'),
    topics: z.array(z.string()).default([]),
    readingMinutes: z.number(),
    draft: z.boolean().default(false),
    photo: photo.optional(),
  }),
});

export const collections = { products, caseStudies, insights };
