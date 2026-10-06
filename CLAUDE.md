## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### After changing a content collection

Adding or changing a field in `src/content.config.ts`, or in the data it
derives from (`src/data/photos.ts` feeds the photo enum), does **not** reach
a running dev server. Nor does restarting it: Astro caches the synced
collection under `.astro/`, so the field arrives as `undefined` and anything
gated on it silently renders nothing. `astro build` is always correct, which
is what makes this confusing — the page is right in production and missing
on localhost.

```
astro dev stop && rm -rf .astro node_modules/.vite && astro dev --background
```

Symptoms seen so far: a 404 on a page that builds fine, an image that would
not update, and a whole section missing from the hero.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
