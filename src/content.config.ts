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
    /**
     * Show the five-question "where should this process go next"
     * section. Only the platform the questions are about should carry
     * it; on anything else it would be a quiz with no bearing on the
     * page it sits in.
     */
    whereToStart: z.boolean().default(false),
    homeProof: z.string(),
    photo: photo.optional(),
    /**
     * Questions buyers actually ask about this platform.
     *
     * Rendered on the page and emitted as FAQPage structured data, so an
     * answer can surface in search without the reader opening the site. The
     * answers are the content, not SEO filler: a question nobody asks does
     * not belong here.
     */
    /**
     * The arc a piece of work travels through the platform.
     *
     * Different cut from `capabilities`: that says what the product contains,
     * this says what happens to your process, in order. Buyers follow the
     * second more readily than the first.
     */
    journey: z
      .array(z.object({ stage: z.string(), name: z.string(), detail: z.string() }))
      .default([]),
    /** Who gets what out of it, answered per audience rather than in general. */
    audiences: z
      .array(z.object({ who: z.string(), name: z.string(), detail: z.string() }))
      .default([]),
    /**
     * Films for this platform. An array because Tippa has two of very
     * different shapes, a 16:9 build story and a 9:16 phone explainer, and
     * a single slot could only have held one of them properly.
     *
     * Dimensions and duration are recorded rather than read at runtime: the
     * frame has to reserve its space before anything loads, and VideoObject
     * needs a real duration.
     */
    videos: z
      .array(
        z.object({
          src: z.string(),
          poster: z.string(),
          durationSeconds: z.number(),
          width: z.number(),
          height: z.number(),
          title: z.string(),
          description: z.string(),
          uploadDate: z.string(),
          /**
           * Show as a play control and a line rather than a poster block.
           * The default for a long film: a 16:9 rectangle is a lot of page
           * to spend on something most readers will not watch.
           */
          compact: z.boolean().default(false),
          /** Muted and looping once in view. One per page at most. */
          autoplay: z.boolean().default(false),
          /** WebVTT track. Absent is surfaced on the page, not hidden. */
          captions: z.string().optional(),
        }),
      )
      .default([]),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
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
