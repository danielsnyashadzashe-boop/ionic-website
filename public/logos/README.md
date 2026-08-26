# Client & system logos

Drop real logo files here, then point at them from `src/data/brands.ts`:

```ts
{ name: 'Old Mutual', file: 'old-mutual.svg', mono: 'OM', tone: 'd1', kind: 'client' },
```

The marquee tile swaps from the monogram fallback to the asset automatically.
No other change is needed.

## What to supply

- **SVG preferred**, PNG at 2x acceptable. Rendered at 20x20 CSS px.
- **Monochrome or single-colour marks work best** against both themes. A full
  colour logo will still render, but check it in the light theme too.
- Trim whitespace from the artboard so the mark fills its box.

## Why these are not already here

The previous site shipped no client logo assets, and drawing an approximation
of another company's mark produces a fake logo, worse than an honest
typographic tile, and a trademark problem. The monogram fallback is deliberate
and ships safely until real, licensed assets are supplied.

Note also: the BDO / Huawei / Nivea / Naspers wall in the reference screenshots
belongs to scrums.com, not Ionic. Ionic's named clients are Old Mutual,
Fidelity, Bidvest, 3Sixty Health, Momentum, National Video Vision, Split Time
and Niche Consulting.
