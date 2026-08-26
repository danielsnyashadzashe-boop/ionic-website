# Ionic — ionicinnovate.com

Marketing site for Ionic. Astro 7 + Tailwind 4 + shadcn/ui, building to static
HTML for Apache hosting on Hetzner.

Replaces the previous hand-written site, where the nav, footer and contact form
were copy-pasted into all seven pages and every product page was a near-identical
duplicate. Here they are components and content entries.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:4321 |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run check` | TypeScript + Astro diagnostics (must be 0 errors) |
| `npm run og` | Regenerate `public/og-default.png` |
| `npm run shots` | Screenshot every page in both themes + mobile/tablet into `.shots/` |
| `npm run responsive` | Audit every page at 9 widths for overflow and small tap targets |
| `npm run hover` | Measure hover-state text contrast on every control, both themes |
| `npm run hoverdiff` | Pixel-diff every hover to catch states that do nothing |
| `npm run hovershots` | Capture each component mid-hover into `.shots/hover/` |

## Deployment

`npm run build`, then upload the **contents of `dist/`** to the web root.

`contact.php`, `.htaccess` and `robots.txt` live in `public/`, so the build
copies them into `dist/` untouched — deployment stays a single-folder upload with
no separate step for the PHP handler.

Requires PHP on the host for the contact form. Everything else is static.

---

## Architecture

```
src/
├── data/
│   ├── site.ts            Site-wide facts: email, locations, metrics, nav
│   └── projects.ts        "Projects worked on" — delivered engagements
├── content.config.ts      Zod schemas — malformed frontmatter fails the build
├── content/
│   ├── products/          4 entries → /[product].astro
│   ├── case-studies/      6 entries → /case-studies/[slug].astro
│   └── insights/          Markdown posts → /insights/[slug].astro
├── layouts/
│   ├── BaseLayout.astro   <head>, meta, JSON-LD, view transitions
│   └── PageLayout.astro   BaseLayout + header + footer
├── components/
│   ├── ui/                shadcn primitives
│   ├── charts/            Recharts islands for the impact section
│   ├── ContactForm.tsx    React island — validation and error states
│   ├── ThemeToggle.astro  Light/dark switch, vanilla JS
│   ├── ProjectsSection.astro  Filterable engagement index
│   ├── ImpactSection.astro    Bento grid of charts
│   └── *.astro            Everything else — zero JS
├── pages/
└── styles/global.css      The whole design system

scripts/
├── og.mjs                 Generates public/og-default.png
└── shots.mjs              Screenshots every page in both themes
```

### Adding content

**A fifth product:** drop a Markdown file in `src/content/products/` with the
required frontmatter. It appears in the nav dropdown, the homepage grid, the
footer, the 404 page and gets its own route automatically. No template changes.

**A case study or post:** same — a Markdown file in the relevant folder.

**Changing the contact email or a headline metric:** edit `src/data/site.ts`
only. On the old site the email appeared in six places and the metrics in two.

### Design system

Everything lives in `src/styles/global.css`. The direction is an **instrument
panel**: dark-first, dimensional, data-forward, precise.

**What the rejected reference got wrong was flatness, not hue.** Mid-blue
panels on a mid-blue ground, every surface at the same depth, so nothing read
as foreground. The fix here is not a different colour, it is depth: a very dark
base, surfaces that step up in measured increments (`base → raised → panel →
float`), and a lit top edge plus a soft drop on every panel. That one pair —
`--edge-lit` / `--edge-shade` — is what stops a card reading as a flat
rectangle.

**Type:** Geist and Geist Mono. One family, two voices — the sans carries UI
and headlines at tight tracking, the mono carries every label, figure and
telemetry readout. Mixing a display face into dense data is where the reference
started to feel noisy. Self-hosted; no Google Fonts request.

**Theme:** dark by default, light as an opt-in class on `<html>`. Resolved
before first paint by an inline script, reapplied on `astro:after-swap`, and
persisted in `localStorage`. Both matter — losing either means a flash or a
silent revert on navigation.

The light theme is **not** the dark ramp inverted. Dark steps up from the
ground; light cannot, because white is the ceiling. Pinning both `panel` and
`float` to pure white made every hover that filled with `panel` invisible on a
white card. Light now puts the page at a soft grey, cards at white, and
hover/recessed fills step *down* into tint.

**Colour:** one primary (signal cyan) plus six data hues at matched perceived
weight. Products, chart series, status dots and the ledger all draw from the
same `--d1..--d6` set, so a legend in the dashboard matches a product dot in
the nav.

### Motion

Restrained on purpose — the brief asked for sleek, not busy.

**Launch sequence** (`BootSequence.astro`) — the anime.js cue, taken as intent
rather than visuals: a lot of small elements resolving into order on a tight
staggered clock. ~1.4s, once per session, skippable by any key, click or
scroll, and the page underneath is already rendered and interactive, so a slow
device or a JS failure costs nothing.

**Hero lattice** (`HeroVisual.astro`) — nodes on concentric rings with routes
between them and traffic running along the routes. Pure SVG and CSS: no canvas,
no WebGL, no animation library, because it is decoration and decoration should
not cost a runtime.

**Cinematic depth** — the Active Theory cue, used only on the case-study tiles:
each pushes forward on hover with its own tone-keyed light, kept to transform
and opacity so it stays on the compositor.

**Tactility** — the Resn/Lusion cue, kept to a single effect: a pointer-tracked
light with a trailing follow, so it reads as weight rather than a hard cursor.
Fine pointers only.

Everything stops under `prefers-reduced-motion: reduce`.

### JavaScript budget

React is loaded **only** by the contact form and the charts, both via
`client:visible`, so it arrives when the reader scrolls to them and never on
first paint.

Measured over the wire on a cold homepage load, before scrolling:

| | Size |
|---|---|
| CSS | ~83 KB (one file, both themes, whole design system) |
| JS on first paint | ~16 KB (view-transition router only) |
| React + form + 7 charts | on intersection, never on first paint |

The boot sequence, header, mega menu, theme switch, ledger filter and command
palette are all vanilla JS inside Astro components. React is reserved for the
contact form and the charts, where it earns its place.

The header (sticky bar, dropdown, mobile panel, scroll progress), the theme
toggle and the project filter are all deliberately vanilla JS inside Astro
components rather than React — hydrating a framework on every page to serve a
few dozen lines of behaviour costs more than it returns. React is reserved for
the contact form and the charts, where it earns its place.

### Logo marquee

`LogoMarquee.astro` — three offset rows of brand tiles sliding horizontally
behind an edge fade.

What makes it read as designed rather than as a loop:

- Rows run at **different speeds** and the middle one runs the other way, so
  the block never resolves into one moving slab.
- Each row starts at a **different offset**, so tiles never line up in columns.
- The track is duplicated **exactly once** and translated `-50%`. Any other
  duplication count makes the wrap jump.
- One `mask-image` across the whole band, so all three rows dissolve on the
  same line rather than each fading independently.
- Pauses on hover — the whole band together, because pausing one row while its
  neighbours keep moving looks broken.
- Under `prefers-reduced-motion` it stops and becomes a plain horizontally
  scrollable strip, so the content stays reachable.

**Each row carries the full brand list, rotated to a different start.** The
first attempt sliced the list into thirds, which gave rows of 4–5 tiles —
narrower than a screen, so the wrap point was visible as a gap, and padding it
out by repeating the set meant the same brand appeared two or three times at
once. Rotating the whole list gives every row ~2.7k px of unique tiles.

#### Logos

Tiles render a real asset from `public/logos/` when `file` is set in
`src/data/brands.ts`, and fall back to a tinted monogram when it is not.

That fallback is deliberate. The previous site shipped no client logo assets,
and drawing an approximation of another company's mark produces a fake logo —
worse than an honest typographic tile, and a trademark problem besides. Drop
licensed SVGs into `public/logos/`, set `file`, and the tile swaps
automatically. See `public/logos/README.md`.

Worth recording: the BDO / Huawei / Nivea / Naspers wall in the reference
screenshots belongs to **scrums.com**, not Ionic. Ionic's named clients are Old
Mutual, Fidelity, Bidvest, 3Sixty Health, Momentum, National Video Vision,
Split Time and Niche Consulting; the systems row comes from the integration
hub's stated connectors (SAP, Oracle, Microsoft, CRM, legacy).

### Photography

Seven photographs live in `src/assets/photos/`, registered with alt text and
captions in `src/data/photos.ts` and rendered through `Figure.astro`.

They go through `astro:assets`, so the build emits responsive AVIF/WebP from a
2560px master and the browser picks a width from `sizes`. The originals were
5–16 MB each (62 MB total); what is committed is **2.9 MB**, and a page ships
roughly 200 KB of image.

`Figure.astro` frames each photo as a surface like any other panel — same
border, radius and lit edge — with a tint scrim so stock photography sinks into
the palette instead of sitting on the page as a bright rectangle.

**Every caption carries an "Illustrative" marker, and that is load-bearing.**
These are stock photographs: not Ionic staff, not client premises, not any
named engagement. Captioning them as though they were would be fabricating
evidence on a page clients read. `alt` describes what is actually in the frame
for a screen reader; `caption` carries the editorial line.

Where they are used:

| Photo | Placement |
|---|---|
| `deliveryTeam` | Homepage — Approach |
| `programmeDelivery` | Homepage — Method, and Ionic ERP |
| `aiInterface` | Process Genesis |
| `codeReview` | Ionic GRC |
| `modelMonitoring` | ExpenseFlow, and the GRC/fraud post |
| `nightEngineering` | Integration post |
| `analyticsBriefing` | Discovery post |

To add one: drop the file in `src/assets/photos/`, add an entry to
`src/data/photos.ts` with real `alt` and `caption`, add the key to the `photo`
enum in `src/content.config.ts`, then set `photo:` in frontmatter or drop a
`<Figure photo="…" />` where you want it.

### Charts

`src/components/charts/` — `Gauge`, `BarsH`, `BarsV`, `Donut`, `Trend`. All
**static SVG rendered at build time**. No charting library, no React, no
client JavaScript.

They were React/Recharts islands and they shipped broken. Two separate faults,
both caught by measuring rather than looking:

**Astro server-renders Recharts at a hardcoded `320px x 200px`** — there is no
DOM for it to measure — so the pre-hydration markup was a wrongly-sized, empty
chart stuffed into its well. Because `overflow-x: auto` also computes
`overflow-y: auto`, that produced the stray scrollbars visible in the panels.

**On 6x CPU throttling plus slow 3G the charts never appeared at all.** ~400 KB
of React and Recharts had to download and execute before a single pixel was
drawn.

Every series here is known at build time, so rendering it in the browser was
the mistake. Now measured: **27 chart marks present in the HTML at
`DOMContentLoaded`, with JavaScript disabled, and on slow 3G.** Removing
Recharts also took total page JS from ~640 KB to **249 KB**.

Interactivity that survived: `<title>` elements give native tooltips on
segments and bars, and every chart animates in on scroll via CSS
`animation-timeline: view()`, stopping under `prefers-reduced-motion`.

Two data decisions worth keeping:

The discipline chart uses one hue at varying intensity rather than cycling six.
Cycling implied a categorical grouping that does not exist, and repeated after
six rows so two unrelated disciplines shared a colour.

The pipeline panel is deliberately **not** a time series. The site publishes no
engagement dates, and inventing a timeline on a page clients read is not a
cosmetic liberty — it charts the cumulative shape of the pipeline instead.

---

## The contact form

`public/contact.php` is carried over from the previous site. Its wire format is a
hard contract — `ContactForm.tsx` must keep sending exactly these:

- `name`, `email`, `company`, `message`
- `website` — honeypot, must stay empty
- `form_ts` — client timestamp for the timing trap
- `source` — which page the enquiry came from
- `return` — local path for the no-JS redirect
- header `X-Requested-With: fetch` — switches the handler to JSON instead of a 303

The form is a real `<form>` with a real `action`, server-rendered before React
loads, so it works with JavaScript disabled.

### Three bugs fixed while porting

**Clock skew silently discarded enquiries.** The timing trap read
`(time() - $ts) < 3`, which is also true when the delta is *negative* — i.e.
whenever a visitor's clock ran fast. Those people saw "message sent" and no email
was ever delivered. Reproduced against a clock two hours out. Now requires a
non-negative delta.

**Validation was unreachable for the same visitors.** The trap ran *before*
validation, so a skewed clock also meant genuine validation errors were never
shown. Fixed by the above.

**`display_errors` corrupted the JSON response.** A `mail()` warning printed
before the JSON body, so the client's `res.json()` threw and the real error was
replaced by a generic one — and the server's absolute filesystem path leaked to
anyone who submitted the form. Now suppressed and logged instead.

Verified against PHP 8.4: 0–2s fills trap as bot, 4s+ pass, skewed clocks reach
`mail()` correctly, honeypot still returns a decoy success.

---

## URL compatibility

`trailingSlash: 'always'` and `build.format: 'directory'` in `astro.config.mjs`
are **load-bearing**. The live site serves `/contact/` and `/ionic-erp/`; changing
either setting would 404 every indexed URL and discard the site's search ranking.

New routes added in this rebuild: `/case-studies/`, `/insights/`, `/404`,
`/rss.xml`.

---

## Known gaps

Carried over from the old site and worth deciding on:

- **No phone number or physical address** anywhere, despite claiming offices in
  two countries. Email is the only channel.
- **Testimonials are attributed to companies only** — no individual names or
  titles on any of the six.
- **The 85% / 60% / 99%+ metrics carry no published methodology.** The metric band
  now says "available on request", which is a promise someone has to be able to keep.
- **No analytics installed.** The privacy policy has been reworded to say so
  accurately rather than describing tracking that does not exist.
- **The three insight posts are seed content** written from the existing site's
  positioning. Review them as editorial voice before publishing.
- **`src/data/projects.ts` carries no dates.** The source material never states
  engagement years, and inventing a timeline on a page clients will read is not
  a cosmetic liberty. Add real dates when you have them.
