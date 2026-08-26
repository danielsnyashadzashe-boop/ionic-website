/**
 * Brands for the marquee.
 *
 * `file` points at `public/logos/<file>` and is optional. Where a real logo
 * asset exists it is used; where one does not, the tile falls back to a
 * monogram. That fallback is deliberate. Drawing an approximation of another
 * company's mark produces a fake logo, which is worse than an honest
 * typographic tile and is a trademark problem besides.
 *
 * To add a real logo: drop an SVG into `public/logos/`, set `file` here. No
 * other change is needed; the tile swaps automatically.
 */

export interface Brand {
  /** Display name. */
  name: string;
  /** Filename inside public/logos/, e.g. 'old-mutual.svg'. */
  file?: string;
  /** Monogram shown when there is no asset yet. */
  mono: string;
  /** Which data hue tints the fallback tile. */
  tone: 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6';
  /** 'client': delivered for. 'system': integrated with. */
  kind: 'client' | 'system';
}

export const brands: Brand[] = [
  // Clients named on the site.
  { name: 'Old Mutual', mono: 'OM', tone: 'd1', kind: 'client' },
  { name: 'Fidelity', mono: 'FD', tone: 'd2', kind: 'client' },
  { name: 'Bidvest Group', mono: 'BV', tone: 'd3', kind: 'client' },
  { name: '3Sixty Health', mono: '3S', tone: 'd6', kind: 'client' },
  { name: 'Momentum', mono: 'MO', tone: 'd4', kind: 'client' },
  { name: 'National Video Vision', mono: 'NV', tone: 'd3', kind: 'client' },
  { name: 'Split Time', mono: 'ST', tone: 'd5', kind: 'client' },
  { name: 'Niche Consulting', mono: 'NC', tone: 'd4', kind: 'client' },

  // Systems the integration hub connects to, per the Process Genesis page.
  { name: 'SAP', mono: 'SA', tone: 'd1', kind: 'system' },
  { name: 'Oracle', mono: 'OR', tone: 'd5', kind: 'system' },
  { name: 'Microsoft', mono: 'MS', tone: 'd2', kind: 'system' },
  { name: 'CRM systems', mono: 'CR', tone: 'd6', kind: 'system' },
  { name: 'Legacy systems', mono: 'LG', tone: 'd4', kind: 'system' },
];

/**
 * Rows for the marquee.
 *
 * Every row carries the FULL list, each starting at a different index. Slicing
 * the list into thirds gave rows of 4-5 tiles, which is narrower than a screen,
 * so the set had to be repeated to fill, and the same brand then appeared
 * two or three times at once. Rotating the whole list instead gives each row
 * ~2.7k px of unique tiles: wide enough to loop seamlessly, with no brand
 * visibly duplicated within a row.
 */
const rotate = (arr: Brand[], by: number) => [...arr.slice(by), ...arr.slice(0, by)];

export const brandRows: Brand[][] = [
  rotate(brands, 0),
  rotate(brands, 5),
  rotate(brands, 9),
];
