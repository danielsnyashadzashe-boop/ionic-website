/**
 * Demo data for the Process Genesis preview.
 *
 * Every list, band, rate and default below is transcribed from
 * docs/WEBSITE_DEMO_SPEC.md in the ProcessGenesisSirago repository. Nothing
 * here is invented: if a figure needs to change it changes in that spec
 * first, because the footnote on the result page publishes the assumption
 * and the whole point of the exercise is that the arithmetic is defensible.
 */

export interface Process {
  name: string;
  desc: string;
}

/** Spec 4.2 and 4.3. Six per industry, seeded from the Industry choice. */
export const PROCESSES: Record<string, Process[]> = {
  "Manufacturing": [
    { name: "Purchase requisition to order", desc: "Raising, approving and placing a purchase" },
    { name: "Goods receipt and matching", desc: "Receiving stock and matching it to the order" },
    { name: "Production scheduling", desc: "Turning demand into a build plan" },
    { name: "Quality non-conformance", desc: "Raising, investigating and closing a defect" },
    { name: "Maintenance work orders", desc: "Requesting and completing equipment work" },
    { name: "Customer order to delivery", desc: "Taking an order through to despatch" },
  ],
  "Construction": [
    { name: "Subcontractor onboarding", desc: "Vetting, approving and setting up a subcontractor" },
    { name: "Site progress reporting", desc: "Capturing daily progress from site to office" },
    { name: "Variation and change orders", desc: "Raising, pricing and approving a change" },
    { name: "Material requisition to site", desc: "Ordering and delivering materials to a site" },
    { name: "Health and safety incidents", desc: "Reporting, investigating and closing an incident" },
    { name: "Progress claims and valuations", desc: "Preparing and submitting a claim" },
  ],
  "Professional services": [
    { name: "Client onboarding", desc: "From signed proposal to active engagement" },
    { name: "Timesheet to invoice", desc: "Capturing time through to a sent invoice" },
    { name: "Proposal and bid preparation", desc: "Producing and approving a client proposal" },
    { name: "Resource allocation", desc: "Matching people to engagements" },
    { name: "Engagement close and handover", desc: "Wrapping up and handing over a project" },
    { name: "Expense claims", desc: "Submitting, approving and reimbursing" },
  ],
  "Healthcare": [
    { name: "Patient intake and registration", desc: "First contact through to a complete record" },
    { name: "Appointment scheduling", desc: "Booking, confirming and rescheduling" },
    { name: "Clinical documentation", desc: "Capturing and filing the clinical record" },
    { name: "Claims and billing", desc: "From episode of care to a submitted claim" },
    { name: "Supply and consumables ordering", desc: "Requesting and replenishing stock" },
    { name: "Referral management", desc: "Receiving, triaging and routing a referral" },
  ],
  "Logistics": [
    { name: "Order to despatch", desc: "Picking, packing and releasing an order" },
    { name: "Proof of delivery", desc: "Capturing and returning delivery confirmation" },
    { name: "Fleet maintenance scheduling", desc: "Planning and recording vehicle work" },
    { name: "Returns and exceptions", desc: "Handling a failed or returned delivery" },
    { name: "Carrier selection and booking", desc: "Choosing and booking the carrier" },
    { name: "Inbound receiving", desc: "Booking in and checking an inbound load" },
  ],
  "Retail and e-commerce": [
    { name: "Order fulfilment", desc: "From placed order to shipped parcel" },
    { name: "Returns and refunds", desc: "Processing a customer return" },
    { name: "Stock replenishment", desc: "Triggering and receiving a restock" },
    { name: "New product setup", desc: "Creating a product across systems" },
    { name: "Supplier onboarding", desc: "Vetting and setting up a new supplier" },
    { name: "Customer enquiry handling", desc: "Receiving and resolving a query" },
  ],
  "Financial services": [
    { name: "Client onboarding and KYC", desc: "Identity, checks and account opening" },
    { name: "Loan or credit application", desc: "Application through to a decision" },
    { name: "Payment exception handling", desc: "Investigating and resolving a failed payment" },
    { name: "Regulatory reporting", desc: "Collecting, checking and submitting a return" },
    { name: "Complaint handling", desc: "Logging, investigating and resolving" },
    { name: "Account changes and maintenance", desc: "Processing a change to an account" },
  ],
  "Property": [
    { name: "Tenant onboarding", desc: "Application through to move-in" },
    { name: "Maintenance request to resolution", desc: "Logging and closing a repair" },
    { name: "Lease renewal", desc: "Triggering, negotiating and signing" },
    { name: "Rent collection and arrears", desc: "Collecting and chasing payment" },
    { name: "Property inspections", desc: "Scheduling, conducting and reporting" },
    { name: "Vacancy to let", desc: "Marketing a unit through to signed lease" },
  ],
  "Other": [
    { name: "Purchase to pay", desc: "Requesting, approving and paying for something" },
    { name: "Hire to onboard", desc: "Offer accepted through to a productive first week" },
    { name: "Quote to cash", desc: "Quoting, delivering and getting paid" },
    { name: "Customer request handling", desc: "Receiving and resolving a request" },
    { name: "Approval and sign-off", desc: "Getting a decision made and recorded" },
    { name: "Monthly reporting", desc: "Collecting, checking and distributing a report" },
  ],
};

export const INDUSTRIES = Object.keys(PROCESSES);

/** Spec 3.3. */
export const BANDS = ['1-10', '11-50', '51-200', '201-1000', '1000+'] as const;

/** Spec 5.3. Volume, minutes, people, rework %, by headcount band. */
export const BAND_DEFAULTS: Record<string, { volume: number; minutes: number; people: number; rework: number }> = {
  '1-10': { volume: 25, minutes: 60, people: 2, rework: 12 },
  '11-50': { volume: 60, minutes: 75, people: 3, rework: 14 },
  '51-200': { volume: 120, minutes: 95, people: 4, rework: 15 },
  '201-1000': { volume: 400, minutes: 110, people: 5, rework: 16 },
  '1000+': { volume: 900, minutes: 120, people: 6, rework: 18 },
};

/**
 * Spec 7.4. Placeholders in the spec, and flagged there as needing
 * validation against a published source before launch. The footnote says
 * 'a typical office rate', which is the honest description of these.
 */
export const RATES: Record<string, { currency: string; symbol: string; rate: number }> = {
  "United States": { currency: 'USD', symbol: '$', rate: 42 },
  "United Kingdom": { currency: 'GBP', symbol: '£', rate: 32 },
  "South Africa": { currency: 'ZAR', symbol: 'R', rate: 320 },
  "Canada": { currency: 'CAD', symbol: 'CA$', rate: 45 },
  "Australia": { currency: 'AUD', symbol: 'A$', rate: 50 },
};

export const COUNTRIES = Object.keys(RATES);

/** Spec 5.3. An approval runs far more often than an onboarding. */
export const VOLUME_MULTIPLIERS: { words: string[]; factor: number }[] = [
  { words: ['order', 'despatch', 'fulfilment', 'payment', 'approval', 'timesheet', 'enquiry'], factor: 2.0 },
  { words: ['onboarding', 'renewal', 'setup', 'hire', 'scheduling'], factor: 0.3 },
  { words: ['requisition', 'receipt', 'claim', 'invoice', 'inspection', 'incident'], factor: 1.0 },
];

/** Spec 7.1. Fixed, published, and quoted in the footnote. */
export const TARGET_REDUCTION = 0.35;

/** Spec 6.1. The real stage names from the product. */
export const STAGES: { name: string; detail: string }[] = [
  { name: "Foundation", detail: "identity, scope, actors, systems" },
  { name: "Current state", detail: "how the work happens today" },
  { name: "Target state", detail: "how it should work" },
  { name: "Quantification", detail: "the drivers everything computes from" },
  { name: "Business case", detail: "the numbers" },
];
