/**
 * Shared controller for staged flows.
 *
 * Every multi-step thing on the site runs through this: the Process Compass,
 * the contact brief, and whatever comes next. A visitor should learn the
 * interaction once. If each flow shipped its own rail, transition and
 * keyboard handling they would read as separate products stitched together,
 * which is exactly the inconsistency this exists to prevent.
 *
 * Markup contract:
 *
 *   <div data-stages>
 *     <div data-stage-rail><b></b></div>
 *     <p data-stage-count></p>
 *     <section data-stage="intro" class="stage is-on">…</section>
 *     <section data-stage="q1" class="stage">… <button data-next>…</button></section>
 *     …
 *   </div>
 *
 * Any element with `data-next` / `data-back` / `data-goto="name"` navigates.
 * Stages named `intro` or `result` are excluded from the counted steps, so
 * the rail reads "2 of 5" rather than "3 of 7".
 */

export interface StageController {
  go(name: string): void;
  next(): void;
  back(): void;
  current(): string;
}

const UNCOUNTED = new Set(['intro', 'result']);

export function mountStages(root: HTMLElement): StageController | null {
  const stages = [...root.querySelectorAll<HTMLElement>('[data-stage]')];
  if (!stages.length) return null;

  const names = stages.map((s) => s.dataset.stage!);
  const counted = names.filter((n) => !UNCOUNTED.has(n));
  const rail = root.querySelector<HTMLElement>('[data-stage-rail] > b');
  const count = root.querySelector<HTMLElement>('[data-stage-count]');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = names.find((_n, i) => stages[i].classList.contains('is-on')) ?? names[0];
  let moving = false;

  // Claim the flow. Until this runs every stage is visible, so the markup
  // still makes sense with no JavaScript.
  root.classList.add('stages-on');
  stages[names.indexOf(current)].classList.add('is-on');

  const paint = () => {
    const idx = counted.indexOf(current);
    if (rail) {
      const done = idx < 0 ? (current === 'result' ? 1 : 0) : (idx + 1) / (counted.length + 1);
      rail.style.width = `${Math.round(done * 100)}%`;
    }
    if (count) count.textContent = idx < 0 ? '' : `${idx + 1} of ${counted.length}`;
  };

  const go = (name: string) => {
    if (moving || name === current || !names.includes(name)) return;
    const from = stages[names.indexOf(current)];
    const to = stages[names.indexOf(name)];

    const settle = () => {
      from.classList.remove('is-on', 'is-off');
      to.classList.add('is-on');
      current = name;
      moving = false;
      paint();
      // Move focus to the new stage so keyboard and screen-reader users are
      // not left behind on a panel that is now display:none.
      const target = to.querySelector<HTMLElement>('h2, h3, [autofocus], input, button');
      target?.focus({ preventScroll: true });
      root.dispatchEvent(new CustomEvent('stagechange', { detail: { stage: name } }));
      const top = root.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    };

    if (reduced) { settle(); return; }
    moving = true;
    from.classList.add('is-off');
    // animationend can be missed if the tab is hidden mid-transition, which
    // would wedge the flow with `moving` stuck true. Time out and settle.
    let done = false;
    const once = () => { if (!done) { done = true; settle(); } };
    from.addEventListener('animationend', once, { once: true });
    window.setTimeout(once, 400);
  };

  const step = (delta: number) => {
    const i = names.indexOf(current) + delta;
    if (i >= 0 && i < names.length) go(names[i]);
  };

  root.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-next],[data-back],[data-goto]');
    if (!el || el.hasAttribute('disabled') || (el as HTMLButtonElement).disabled) return;
    if (el.dataset.goto) go(el.dataset.goto);
    else if (el.hasAttribute('data-next')) step(1);
    else step(-1);
  });

  /**
   * External control, one way.
   *
   * The preview cards on the platform page sit outside this root and need to
   * open a named stage. They have no reference to the controller and nothing
   * is exported to `window`, so they dispatch here instead. An unknown stage
   * name is ignored rather than throwing.
   */
  root.addEventListener('stages:goto', (e) => {
    const name = (e as CustomEvent<{ stage?: string }>).detail?.stage;
    if (name && names.includes(name)) go(name);
  });

  paint();
  return { go, next: () => step(1), back: () => step(-1), current: () => current };
}

/**
 * Pointer dragging over an SVG instrument, in the SVG's own coordinates.
 *
 * The range input underneath stays the accessible control; this only makes
 * the picture directly manipulable for people using a mouse or touch.
 */
export function dragSvg(
  svg: SVGSVGElement,
  onPoint: (x: number, y: number) => void,
  onEnd?: () => void,
): void {
  let active = false;
  const at = (e: PointerEvent): [number, number] => {
    const ctm = svg.getScreenCTM();
    if (!ctm) return [0, 0];
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const q = p.matrixTransform(ctm.inverse());
    return [q.x, q.y];
  };
  svg.addEventListener('pointerdown', (e) => {
    active = true;
    svg.setPointerCapture(e.pointerId);
    onPoint(...at(e));
  });
  svg.addEventListener('pointermove', (e) => { if (active) onPoint(...at(e)); });
  const stop = () => { if (active) { active = false; onEnd?.(); } };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
}
