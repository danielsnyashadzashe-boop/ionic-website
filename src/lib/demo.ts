/**
 * The Process Genesis preview: arithmetic and content.
 *
 * The architectural rule from the spec is that the words and the numbers come
 * from different places. In the real product a model writes the prose and code
 * computes the money, so a model can never invent a saving. This demo keeps
 * the same split for the same reason, with one difference: there is no model
 * here either. The prose is assembled from templates keyed to the kind of
 * process, which is honest for a preview and cannot drift.
 *
 * Everything in `compute` is spec section 7. Two deliberate departures, both
 * because the spec contradicts itself and the arithmetic has to win:
 *
 *   - 8.2 asks for three cost chips weighted 60/25/15, each rounded to the
 *     nearest 100, that also sum to the headline. Rounding three numbers
 *     independently does not do that: 34,300 + 14,300 + 8,600 is 57,200
 *     against a headline of 57,100. Two are rounded and the third takes the
 *     remainder, so they always sum.
 *   - 7.5 clamps rework up to a minimum of 5%. That silently raises a figure
 *     the visitor typed and inflates their own saving, against the promise in
 *     section 1 that the numbers are theirs. A zero stays a zero here; the
 *     clamp is applied only to keep the saving positive, which it already is.
 *
 * The worked example in 8.1 cannot be produced by the formula in 7.1 either.
 * This follows 7.1, which is the part marked "do not let this move".
 */

import { BAND_DEFAULTS, RATES, TARGET_REDUCTION, VOLUME_MULTIPLIERS } from '@/data/demo';

export interface Inputs {
  volume: number;
  minutes: number;
  people: number;
  rework: number;
}

export interface Figures {
  minutesSaved: number;
  hoursPerYear: number;
  annualValue: number;
  money: (n: number) => string;
  currency: string;
  /** 60 / 25 / 15 of the annual value, guaranteed to sum to it. */
  chips: number[];
  rising: boolean;
  /** True when the annual figure is too small to lead with. Spec 7.5. */
  leadOnMinutes: boolean;
}

const round10 = (n: number) => Math.round(n / 10) * 10;
const round100 = (n: number) => Math.round(n / 100) * 100;

/** Spec 5.3. An approval runs far more often than an onboarding. */
export function volumeFor(band: string, processName: string): number {
  const base = BAND_DEFAULTS[band].volume;
  const n = processName.toLowerCase();
  const hit = VOLUME_MULTIPLIERS.find((m) => m.words.some((w) => n.includes(w)));
  const v = base * (hit?.factor ?? 1);
  return v < 100 ? Math.max(5, Math.round(v / 5) * 5) : Math.round(v / 25) * 25;
}

export function defaultsFor(band: string, processName: string): Inputs {
  const d = BAND_DEFAULTS[band];
  return { volume: volumeFor(band, processName), minutes: d.minutes, people: d.people, rework: d.rework };
}

export function compute(inputs: Inputs, country: string): Figures {
  const { rate, currency, symbol } = RATES[country] ?? RATES['United States'];

  const targetMinutes = inputs.minutes * (1 - TARGET_REDUCTION);
  const minutesSaved = inputs.minutes - targetMinutes;

  const annualRuns = inputs.volume * 12;
  const baseHours = (minutesSaved * annualRuns) / 60;
  const reworkHours = baseHours * (inputs.rework / 100);
  const totalHours = baseHours + reworkHours;

  let annualValue = totalHours * rate;
  const rising = annualValue > 2_000_000;
  if (rising) annualValue = 2_000_000;

  const money = (n: number) => `${symbol}${Math.round(n).toLocaleString('en-US')}`;

  // Two rounded, the third taking the remainder, so the chips always sum to
  // the headline a reader can see directly above them.
  const shown = round100(annualValue);
  const a = round100(shown * 0.6);
  const b = round100(shown * 0.25);
  const chips = [a, b, shown - a - b];

  return {
    minutesSaved: Math.round(minutesSaved),
    hoursPerYear: round10(totalHours),
    annualValue: shown,
    money,
    currency,
    chips,
    rising,
    leadOnMinutes: totalHours < 40,
  };
}

/* ── Content ──────────────────────────────────────────────────────────────
   Templates by the kind of process rather than by its name, so a goods
   receipt and a progress claim read differently while a new industry needs
   no new writing. `subject` is the process in lower case, used as the noun
   the steps act on. */

export interface Step {
  name: string;
  actor: string;
  note: string | null;
}
export interface Pain {
  title: string;
  description: string;
}
export interface Content {
  summary: string;
  current: Step[];
  target: Step[];
  pains: Pain[];
  requirements: string[];
}

type Family = 'approval' | 'order' | 'onboarding' | 'claim' | 'incident' | 'reporting' | 'generic';

function familyOf(name: string): Family {
  const n = name.toLowerCase();
  if (/requisition|approval|sign-off|variation|change order/.test(n)) return 'approval';
  if (/order|despatch|delivery|fulfil|quote to cash|receipt|dispatch/.test(n)) return 'order';
  if (/onboard|hire|setup|set-up|renewal/.test(n)) return 'onboarding';
  if (/claim|invoice|payment|valuation|billing|purchase to pay/.test(n)) return 'claim';
  if (/incident|non-conformance|quality|complaint|defect|safety/.test(n)) return 'incident';
  if (/report|scheduling|plan|forecast/.test(n)) return 'reporting';
  return 'generic';
}

const TEMPLATES: Record<Family, (s: string) => Omit<Content, 'summary'>> = {
  approval: (s) => ({
    current: [
      { name: 'Raise the request', actor: 'Requester', note: 'Free-text, so detail is missing from the start' },
      { name: 'Find the right approver', actor: 'Requester', note: 'Thresholds live in a policy nobody reads' },
      { name: 'Email for approval', actor: 'Requester', note: 'No record of when it was sent' },
      { name: 'Chase the approver', actor: 'Requester', note: 'The single largest time cost' },
      { name: 'Second approval if over threshold', actor: 'Manager', note: null },
      { name: 'Re-key into the system', actor: 'Administrator', note: 'The same detail typed twice' },
      { name: 'File the paperwork', actor: 'Administrator', note: null },
    ],
    target: [
      { name: 'Submit on a structured form', actor: 'Requester', note: 'Required fields captured once' },
      { name: 'Route by value and category', actor: 'System', note: 'The policy is the routing rule' },
      { name: 'Approve in one click', actor: 'Approver', note: 'With the context attached' },
      { name: 'Escalate automatically when late', actor: 'System', note: 'Nobody has to chase' },
      { name: 'Write straight to the system of record', actor: 'System', note: 'No re-keying' },
    ],
    pains: [
      { title: 'Chasing approvals', description: 'Most of the elapsed time is spent waiting and following up, not deciding.' },
      { title: 'Finding the right approver', description: 'Thresholds and delegations are held in policy documents rather than in the flow itself.' },
      { title: 'The same detail entered twice', description: 'What was typed into the request is typed again into the system of record.' },
    ],
    requirements: [
      'Capture the request on a structured form with required fields',
      'Route to an approver from value, category and delegation rules',
      'Escalate automatically when an approval passes its target time',
      'Write the approved record to the system of record without re-keying',
    ],
  }),
  order: (s) => ({
    current: [
      { name: 'Receive the order', actor: 'Coordinator', note: 'Arrives by email, phone and portal' },
      { name: 'Check stock and availability', actor: 'Coordinator', note: 'Two systems, neither authoritative' },
      { name: 'Confirm back to the customer', actor: 'Coordinator', note: null },
      { name: 'Pick and prepare', actor: 'Warehouse', note: 'Paper pick list, errors found late' },
      { name: 'Book the despatch', actor: 'Logistics', note: 'Re-keyed into the carrier system' },
      { name: 'Capture proof of delivery', actor: 'Driver', note: 'Paper, often missing or illegible' },
      { name: 'Reconcile and invoice', actor: 'Finance', note: 'Held up by missing paperwork' },
    ],
    target: [
      { name: 'Capture every order in one queue', actor: 'System', note: 'Whatever channel it arrives on' },
      { name: 'Check stock against one source', actor: 'System', note: null },
      { name: 'Confirm automatically on acceptance', actor: 'System', note: 'The customer is told without being asked' },
      { name: 'Pick against a handheld list', actor: 'Warehouse', note: 'Errors caught at the shelf' },
      { name: 'Capture proof of delivery on a phone', actor: 'Driver', note: 'Photo and signature, timestamped' },
      { name: 'Invoice on confirmed delivery', actor: 'System', note: 'Nothing waits for paperwork' },
    ],
    pains: [
      { title: 'Orders arriving on three channels', description: 'Email, phone and portal each need a person to transcribe them into the same place.' },
      { title: 'Proof of delivery going missing', description: 'Paper confirmations are lost or unreadable, and invoicing waits on them.' },
      { title: 'Stock checked in two systems', description: 'Neither is authoritative, so availability is confirmed twice and still gets it wrong.' },
    ],
    requirements: [
      'Capture orders from every channel into one queue',
      'Check availability against a single source of stock',
      'Capture proof of delivery with a photo and a timestamp',
      'Raise the invoice automatically on confirmed delivery',
    ],
  }),
  onboarding: (s) => ({
    current: [
      { name: 'Collect documents by email', actor: 'Coordinator', note: 'Chased one at a time' },
      { name: 'Check the documents', actor: 'Coordinator', note: 'Against a checklist held locally' },
      { name: 'Verify credentials and insurance', actor: 'Compliance', note: 'Expiry dates tracked in a spreadsheet' },
      { name: 'Set up accounts and access', actor: 'IT', note: 'A ticket per system' },
      { name: 'Get the approvals', actor: 'Manager', note: null },
      { name: 'Record in the master list', actor: 'Administrator', note: 'Re-keyed from the forms' },
      { name: 'Hand over to the team', actor: 'Manager', note: 'Nothing confirms it happened' },
    ],
    target: [
      { name: 'Invite to a guided portal', actor: 'System', note: 'The checklist drives the request' },
      { name: 'Validate documents on upload', actor: 'System', note: 'Missing or expired items flagged at once' },
      { name: 'Track expiry dates automatically', actor: 'System', note: 'Renewals prompt themselves' },
      { name: 'Provision access from the role', actor: 'System', note: 'One request, every system' },
      { name: 'Confirm readiness before day one', actor: 'Manager', note: 'A single status, not an inbox search' },
    ],
    pains: [
      { title: 'Chasing documents one at a time', description: 'Each missing item is a separate email and a separate wait.' },
      { title: 'Expiry dates in a spreadsheet', description: 'Insurance and credentials lapse unnoticed until someone checks.' },
      { title: 'Access set up system by system', description: 'A ticket per system means the first week is spent waiting for logins.' },
    ],
    requirements: [
      'Request every required document from one guided portal',
      'Validate documents on upload and flag what is missing or expired',
      'Track credential expiry and prompt renewal automatically',
      'Provision system access from the role rather than per request',
    ],
  }),
  claim: (s) => ({
    current: [
      { name: 'Assemble the backup', actor: 'Administrator', note: 'Gathered from several places' },
      { name: 'Check it against the agreement', actor: 'Reviewer', note: 'Manual, line by line' },
      { name: 'Query the discrepancies', actor: 'Reviewer', note: 'By email, with no audit trail' },
      { name: 'Wait for the response', actor: 'Counterparty', note: 'The largest single delay' },
      { name: 'Correct and resubmit', actor: 'Administrator', note: 'The whole pack goes round again' },
      { name: 'Approve for payment', actor: 'Finance', note: null },
      { name: 'Post to the ledger', actor: 'Finance', note: 'Re-keyed from the approved pack' },
    ],
    target: [
      { name: 'Submit against the agreement', actor: 'Submitter', note: 'Lines are validated as they are entered' },
      { name: 'Match automatically', actor: 'System', note: 'Only exceptions reach a person' },
      { name: 'Raise queries in the record', actor: 'Reviewer', note: 'With the history attached' },
      { name: 'Correct the line, not the pack', actor: 'Submitter', note: 'Nothing resubmits in full' },
      { name: 'Post on approval', actor: 'System', note: 'No re-keying into the ledger' },
    ],
    pains: [
      { title: 'Line-by-line checking', description: 'Every line is compared by hand against the agreement, including the ones that always match.' },
      { title: 'Queries with no trail', description: 'Discrepancies are resolved over email, so the reason for a decision is lost.' },
      { title: 'Resubmitting the whole pack', description: 'One wrong line sends the entire claim round the loop again.' },
    ],
    requirements: [
      'Validate claim lines against the agreement at entry',
      'Match automatically and route only exceptions to a reviewer',
      'Hold queries and their resolution against the claim record',
      'Post approved claims to the ledger without re-keying',
    ],
  }),
  incident: (s) => ({
    current: [
      { name: 'Report it', actor: 'Reporter', note: 'Paper form or a phone call' },
      { name: 'Transcribe into the register', actor: 'Administrator', note: 'Days later, detail already lost' },
      { name: 'Assign an investigator', actor: 'Manager', note: null },
      { name: 'Investigate and write up', actor: 'Investigator', note: 'Format varies by person' },
      { name: 'Agree the corrective action', actor: 'Manager', note: null },
      { name: 'Chase the action to completion', actor: 'Administrator', note: 'Tracked in a spreadsheet' },
      { name: 'Close and report', actor: 'Administrator', note: 'Compiled by hand each month' },
    ],
    target: [
      { name: 'Report on a phone, at the point it happens', actor: 'Reporter', note: 'Photo and location captured' },
      { name: 'Classify and route on submission', actor: 'System', note: 'Severity drives who is told' },
      { name: 'Investigate against a standard template', actor: 'Investigator', note: 'Comparable between cases' },
      { name: 'Track corrective actions to a date', actor: 'System', note: 'Overdue items escalate themselves' },
      { name: 'Report from the register', actor: 'System', note: 'Nothing compiled by hand' },
    ],
    pains: [
      { title: 'Reported late, recorded later', description: 'Detail is lost between the event and the moment it reaches the register.' },
      { title: 'Write-ups that cannot be compared', description: 'Each investigator uses a different format, so patterns across cases stay invisible.' },
      { title: 'Corrective actions chased by hand', description: 'A spreadsheet of open actions, followed up by one person.' },
    ],
    requirements: [
      'Capture a report at the point it happens, with photo and location',
      'Classify and route on submission from severity',
      'Record investigations against one template so cases compare',
      'Track corrective actions to a date and escalate when overdue',
    ],
  }),
  reporting: (s) => ({
    current: [
      { name: 'Request the inputs', actor: 'Analyst', note: 'The same request every period' },
      { name: 'Chase the late ones', actor: 'Analyst', note: 'A material part of the cycle' },
      { name: 'Consolidate the spreadsheets', actor: 'Analyst', note: 'Formats differ between contributors' },
      { name: 'Check the figures', actor: 'Analyst', note: 'Errors found late, or not at all' },
      { name: 'Query back to the source', actor: 'Analyst', note: null },
      { name: 'Format and distribute', actor: 'Analyst', note: 'By hand, every period' },
      { name: 'Answer the follow-up questions', actor: 'Analyst', note: 'Same questions each time' },
    ],
    target: [
      { name: 'Collect from the source systems', actor: 'System', note: 'No request, no chase' },
      { name: 'Validate on arrival', actor: 'System', note: 'Breaks flagged to the contributor' },
      { name: 'Consolidate to one model', actor: 'System', note: 'One format, by construction' },
      { name: 'Review the exceptions only', actor: 'Analyst', note: 'Judgement, not assembly' },
      { name: 'Publish on a schedule', actor: 'System', note: 'With the detail available underneath' },
    ],
    pains: [
      { title: 'Chasing the same inputs every period', description: 'The request and the follow-up are identical each cycle and still done by hand.' },
      { title: 'Spreadsheets that do not line up', description: 'Each contributor formats differently, so consolidation is manual every time.' },
      { title: 'Errors found after publication', description: 'Checking happens at the end, when correcting is most expensive.' },
    ],
    requirements: [
      'Collect inputs from the source systems on a schedule',
      'Validate figures on arrival and return breaks to the contributor',
      'Consolidate to one model rather than one spreadsheet per contributor',
      'Publish on a schedule with the supporting detail attached',
    ],
  }),
  generic: (s) => ({
    current: [
      { name: 'Receive the request', actor: 'Coordinator', note: 'Arrives in more than one place' },
      { name: 'Work out who owns it', actor: 'Coordinator', note: null },
      { name: 'Gather what is missing', actor: 'Coordinator', note: 'By email, one item at a time' },
      { name: 'Do the work', actor: 'Specialist', note: null },
      { name: 'Get it checked', actor: 'Manager', note: 'Waiting, not reviewing' },
      { name: 'Record the outcome', actor: 'Administrator', note: 'Re-keyed from the request' },
      { name: 'Tell whoever asked', actor: 'Coordinator', note: 'Often forgotten' },
    ],
    target: [
      { name: 'Capture every request in one queue', actor: 'System', note: null },
      { name: 'Assign from rules, not memory', actor: 'System', note: null },
      { name: 'Request what is missing at the start', actor: 'System', note: 'One structured ask' },
      { name: 'Review only what needs judgement', actor: 'Manager', note: null },
      { name: 'Record and notify on completion', actor: 'System', note: 'Nobody has to remember' },
    ],
    pains: [
      { title: 'Requests arriving in several places', description: 'Email, chat and phone each need someone to move the detail into one place.' },
      { title: 'Missing detail found late', description: 'Work starts, stops and restarts because the request was incomplete.' },
      { title: 'Waiting for a check', description: 'Most of the elapsed time is spent in a queue rather than being worked on.' },
    ],
    requirements: [
      'Capture requests from every channel into one queue',
      'Assign ownership from rules rather than from memory',
      'Ask for every required detail once, at the start',
      'Record the outcome and notify the requester automatically',
    ],
  }),
};

export function contentFor(processName: string, industry: string): Content {
  const fam = familyOf(processName);
  const t = TEMPLATES[fam](processName.toLowerCase());
  const where = industry === 'Other' ? 'the business' : industry.toLowerCase();
  return {
    summary: `How ${processName.toLowerCase()} runs today in ${where}, and what it looks like once the waiting and the re-keying come out of it.`,
    ...t,
  };
}
