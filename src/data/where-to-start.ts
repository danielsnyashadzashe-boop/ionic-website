/**
 * Five questions about one process, and one recommendation.
 *
 * This is the reference prototype's content: its five questions, its five
 * recommendation tracks, its wording for each verdict and each step. What
 * is not the prototype's is the interaction. The first build of this gave
 * every question a draggable SVG instrument — a gauge, a filling tank, a
 * metronome, a chain — and wrapped the whole thing in a product name. That
 * read as a second brand bolted onto the site, and nobody outside the
 * project knew what the name meant. The questions survived that; the
 * apparatus did not. You click an answer and move on.
 *
 * The scalar questions used to be sliders. Each is now the same scale cut
 * into the bands the prototype already labelled, so the thresholds the
 * recommendation turns on are unchanged — a slider at 30 and the
 * "Repeatable" option both read as 30.
 *
 * Shared by the markup and the client script so there is one copy of the
 * questions and one copy of the logic.
 */

export interface Option {
  /** The clickable answer. */
  label: string;
  /** One line under it, saying what that answer means in practice. */
  note: string;
  /** How the answer appears in the recommendation's opening sentence. */
  reads: string;
  /** What the recommendation reasons over. */
  value: number | string;
}

export interface Question {
  key: 'maturity' | 'automation' | 'frequency' | 'handoffs' | 'pain';
  /** Short word beside the number, e.g. "Maturity". */
  marker: string;
  title: string;
  copy: string;
  /** Name for this answer in the summary row at the end. */
  readout: string;
  options: Option[];
}

export const questions: Question[] = [
  {
    key: 'maturity',
    marker: 'Maturity',
    title: 'How settled is the process today?',
    copy: 'Every run improvised at one end; written down, followed and measured at the other.',
    readout: 'Maturity',
    options: [
      { label: 'Ad hoc', note: 'Every run is a little different', reads: 'ad hoc', value: 10 },
      { label: 'Repeatable', note: 'It works, mostly from memory', reads: 'repeatable', value: 30 },
      { label: 'Defined', note: 'Written down and usually followed', reads: 'defined', value: 50 },
      { label: 'Managed', note: 'Followed and measured', reads: 'managed', value: 70 },
      { label: 'Optimised', note: 'Measured and continually improved', reads: 'optimised', value: 90 },
    ],
  },
  {
    key: 'automation',
    marker: 'Automation',
    title: 'How much runs without a person?',
    copy: 'The share of steps that happen on their own. No one typing, copying, forwarding or approving.',
    readout: 'Automated',
    options: [
      { label: 'Almost none', note: 'Almost everything is done by hand', reads: 'almost nothing automated', value: 5 },
      { label: 'A few steps', note: 'A few steps are automated, most are manual', reads: 'a few steps automated', value: 25 },
      { label: 'About half', note: 'About half runs itself', reads: 'about half automated', value: 55 },
      { label: 'Most of it', note: 'Mostly automated, people handle exceptions', reads: 'mostly automated', value: 80 },
      { label: 'Nearly all', note: 'Runs itself; people only watch', reads: 'running itself', value: 95 },
    ],
  },
  {
    key: 'frequency',
    marker: 'Frequency',
    title: 'How often does it run?',
    copy: 'Something that runs once a quarter and something that never stops deserve very different fixes.',
    readout: 'Runs',
    options: [
      { label: 'A few times a year', note: 'Rare enough that people forget the steps', reads: 'a few times a year', value: 1 },
      { label: 'Weekly', note: 'A regular rhythm with quiet days between', reads: 'weekly', value: 2 },
      { label: 'Daily', note: 'Part of the daily routine', reads: 'daily', value: 3 },
      { label: 'Hourly', note: 'Many times a day, every day', reads: 'hourly', value: 4 },
      { label: 'Continuously', note: 'Never stops; a queue is always waiting', reads: 'continuously', value: 5 },
    ],
  },
  {
    key: 'handoffs',
    marker: 'Handoffs',
    title: 'How many hands touch it?',
    copy: 'The people or teams work passes through. Every handoff is somewhere delay and error can get in.',
    readout: 'People',
    options: [
      { label: 'One person', note: 'One person owns it start to finish', reads: 'one person', value: 1 },
      { label: 'Two or three', note: 'A short relay with a couple of handoffs', reads: 'two or three people', value: 3 },
      { label: 'Four or five', note: 'Several desks, several inboxes', reads: 'four or five people', value: 5 },
      { label: 'Six or more', note: 'A long chain where work waits between people', reads: 'six or more people', value: 7 },
    ],
  },
  {
    key: 'pain',
    marker: 'Priority',
    title: 'What hurts most right now?',
    copy: 'Pick the one thing you would fix tomorrow.',
    readout: 'Fix first',
    options: [
      { label: 'It takes too long', note: 'Speed', reads: 'it takes too long', value: 'slow' },
      { label: 'Mistakes slip through', note: 'Accuracy', reads: 'mistakes slip through', value: 'errors' },
      { label: 'It costs too much', note: 'Cost', reads: 'it costs too much', value: 'cost' },
      { label: 'We cannot see what is happening', note: 'Visibility', reads: 'nobody can see what is happening', value: 'visibility' },
    ],
  },
];

export interface Track {
  title: string;
  summary: string;
  steps: string[];
  time: string;
}

/** The prototype's five recommendations, in its own words. */
export const tracks: Record<string, Track> = {
  map: {
    title: 'Map it and make it dependable',
    summary:
      'Automation multiplies whatever it is given. An unclear process becomes a fast, unclear process. The first win here is agreeing on one way the work should happen, and proving it holds up before any tooling is added.',
    steps: [
      'Walk the process end to end with the people who actually run it.',
      'Write down the one way it should work, including where decisions get made and by whom.',
      'Run it manually the new way for a few cycles and measure time and errors.',
    ],
    time: 'Typically three to five weeks.',
  },
  automate: {
    title: 'Automate the workflow',
    summary:
      'The process is clear enough to trust and runs often enough to pay back the effort, yet most of it is still done by hand. That is the sweet spot for workflow automation: real hours back, quickly, with low risk.',
    steps: [
      'Pick the three steps that consume the most hours or cause the most rework.',
      'Build the automated flow with human checkpoints only where judgement is needed.',
      'Run old and new side by side for two weeks, then switch over.',
    ],
    time: 'Typically four to eight weeks.',
  },
  connect: {
    title: 'Connect the systems',
    summary:
      'Handoffs are where time and accuracy go missing. The fix is usually not more automation inside one tool, but fewer gaps between tools, so work moves without a person carrying it.',
    steps: [
      'List every place data is re-typed, re-sent, or waits in an inbox.',
      'Integrate the systems so each record moves itself to the next stage.',
      'Give every handoff one owner and one visible status.',
    ],
    time: 'Typically five to ten weeks.',
  },
  intelligence: {
    title: 'Add intelligence to the exceptions',
    summary:
      'The process is mature and largely automated. What is left for people is judgement: reading, classifying, deciding, handling exceptions. That is where an AI assistant earns its place, working alongside the team with review built in.',
    steps: [
      'Identify the decisions people still make by hand and how often each occurs.',
      'Put an AI assistant on the highest-volume one, with a human review loop.',
      'Widen its scope step by step as accuracy holds.',
    ],
    time: 'Typically six to twelve weeks.',
  },
  measure: {
    title: 'Measure it, then optimise',
    summary:
      'The machinery is built; what is missing is the instrument panel. Until the process reports on itself, improvements are guesses. Make the numbers visible first, and the next fix becomes obvious.',
    steps: [
      'Define the three numbers that show the process is healthy.',
      'Instrument the workflow so those numbers update themselves.',
      'Review weekly and remove the biggest bottleneck each time.',
    ],
    time: 'Typically three to six weeks.',
  },
};

/** One answered question: the value reasoned over, plus how to say it. */
export interface Answer {
  value: number | string;
  label: string;
  note: string;
  reads: string;
}

export type Answers = Record<string, Answer>;

const num = (a: Answers, k: string) => Number(a[k]?.value ?? 0);

/**
 * The prototype's rule of thumb, unchanged.
 *
 * Order matters: an unsettled process is sent to mapping whatever else is
 * true of it, because tooling would only lock the inconsistency in.
 */
export function choose(a: Answers): string {
  const m = num(a, 'maturity');
  const auto = num(a, 'automation');
  const f = num(a, 'frequency');
  const h = num(a, 'handoffs');
  const p = String(a.pain?.value ?? '');

  if (m < 35) return 'map';
  if (auto < 40) return f >= 2 ? 'automate' : 'map';
  if (h >= 5 && auto < 75) return 'connect';
  if (p === 'visibility') return 'measure';
  if (m >= 60 && auto >= 60) return 'intelligence';
  if (auto >= 75 && p === 'cost') return 'measure';
  return 'automate';
}

/**
 * Why this recommendation and not another, in the visitor's own answers.
 *
 * Reading the reasoning back is the part that makes this worth doing at
 * all: a verdict with no working shown is a horoscope.
 */
export function why(key: string, a: Answers): string {
  const base =
    `Your process reads as ${a.maturity.reads}, ${a.automation.reads}, running ` +
    `${a.frequency.reads}, across ${a.handoffs.reads}. The biggest pain is that ${a.pain.reads}.`;

  const tail: Record<string, string> = {
    map: ' With the process still forming, tooling would lock in the inconsistency.',
    automate: ' The gap between how often it runs and how little runs itself is where the return is.',
    connect: ` With ${a.handoffs.reads} in the chain, the delays live between the tools rather than inside them.`,
    intelligence: ' The routine work is already handled; the remaining effort is judgement.',
    measure: ' The process is running, but nobody can tell how well.',
  };

  return base + tail[key];
}
