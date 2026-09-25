import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { photos, type PhotoKey } from './data/photos';

const tone = z.enum(['d1', 'd2', 'd3', 'd4', 'd5', 'd6']);

/**
 * Key into the photo registry.
 *
 * Read from the registry rather than retyped. This was a hand-maintained list
 * of the same strings, and adding two photographs failed the build with a
 * schema error that pointed at the content file rather than at the list that
 * had not been updated. Now a new photo is usable the moment it is
 * registered, and a typo in a content file still fails the build.
 */
const photoKeys = Object.keys(photos) as [PhotoKey, ...PhotoKey[]];
const photo = z.enum(photoKeys);

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
    /**
     * Places the Process Compass on this platform's page.
     *
     * The Compass asks five questions about one of your processes, which
     * is Process Genesis's subject and nothing else's. It ran as a
     * standalone /compass/ page, where it sat outside the product it
     * belongs to and had to explain itself from scratch. A flag rather
     * than a slug check in the template, so the template keeps knowing
     * nothing about which platform is which.
     */
    compass: z.boolean().default(false),
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
    /**
     * Optional, because a study may be published before its quote has been
     * cleared. The alternative is writing words for a client, which is not a
     * thing we do. The testimonials section only renders entries that have
     * one, so an empty quote is invisible rather than a hole in the page.
     */
    quote: z.string().optional(),
    /**
     * Company-attributed for every study carried over from the old site; no
     * individual was ever named there. Where a named person has cleared a
     * quote, this is "Name, Company".
     */
    quoteAttribution: z.string(),
    /**
     * Placeholder wording that the attributed person has NOT approved.
     *
     * Attributing words to a named individual who did not say them is a
     * different thing from company boilerplate, so this is tracked rather
     * than trusted to memory: Testimonials.astro prints a build warning
     * listing every pending quote, on every build, until the flag is cleared.
     */
    quotePending: z.boolean().default(false),
    highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    /** Optional cover image. Case studies had no imagery at all before this. */
    photo: photo.optional(),
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
