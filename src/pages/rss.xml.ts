import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '@/data/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('insights', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );

  return rss({
    title: `${site.name} — Insights`,
    description:
      'Practical writing on enterprise process automation, governance and risk, and why transformation programmes succeed or fail.',
    site: context.site ?? site.domain,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/insights/${post.id}/`,
      categories: post.data.topics,
      author: post.data.author,
    })),
    customData: '<language>en</language>',
  });
}
