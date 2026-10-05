# Ionic website: Jira backlog

Everything outstanding on the website rebuild, written as tickets ready to paste
into Jira. Compiled 28 September 2026 from a section by section audit of the
repository, not from memory.

**How to use this file.** Each ticket has a local reference (`WEB-01`) so we can
talk about them before they exist in Jira. Jira will assign its own keys on
creation, so treat these as sequence numbers only. Every ticket carries a type,
priority, component and who it needs an answer from, plus acceptance criteria you
can paste straight into the Jira description field.

**Priorities.** `Blocker` means I would not put the site live with it open.
`High` means it is visibly wrong or costs us credibility. `Medium` is real work
with a real payoff. `Low` is worth doing when there is room.

---

## Contents

| Section | Tickets | Blockers |
|---|---|---|
| [Epics](#epics) | 8 | |
| [A. Launch blockers](#a-launch-blockers) | WEB-01 to WEB-09 | 9 |
| [B. Backend and infrastructure](#b-backend-and-infrastructure) | WEB-10 to WEB-15 | 0 |
| [C. Frontend build](#c-frontend-build) | WEB-16 to WEB-27 | 0 |
| [D. Content](#d-content) | WEB-28 to WEB-35 | 0 |
| [E. Design and assets](#e-design-and-assets) | WEB-36 to WEB-41 | 0 |
| [F. SEO, analytics and measurement](#f-seo-analytics-and-measurement) | WEB-42 to WEB-45 | 0 |
| [G. Technical debt](#g-technical-debt) | WEB-46 to WEB-49 | 0 |
| [H. Spikes and decisions](#h-spikes-and-decisions) | WEB-50 to WEB-56 | 0 |

**Total: 56 tickets, 9 of them blocking launch.**

---

## Epics

Create these first and parent the tickets to them.

| Epic | Name | Covers |
|---|---|---|
| EP-1 | Launch readiness | Everything that must close before the site goes live on the real domain |
| EP-2 | Contact and lead capture | The form, its delivery, its spam handling and where enquiries land |
| EP-3 | Hosting and deployment | Production hosting, domain, build pipeline, repository access |
| EP-4 | Site expansion | New pages we do not have that buyers expect to find |
| EP-5 | Content depth and accuracy | Making what is already published correct, complete and permitted |
| EP-6 | Brand and imagery | Real photography, logos, screenshots, vector assets |
| EP-7 | Measurement | Analytics, social previews, search visibility |
| EP-8 | Maintenance | Dead code, tooling, things that will rot if left |

---

## A. Launch blockers

These nine are the ones I would not launch without. Most need a decision or a
file from a person rather than engineering time.

---

### WEB-01 · Replace the placeholder testimonial attributed to John Arvanitakis

**Type** Bug  **Priority** Blocker  **Epic** EP-1  **Component** Content
**Needs** Nyasha, then John Arvanitakis

The Tippa case study carries a testimonial attributed by name to John
Arvanitakis of Tippa Payment Solutions. He did not write those words and has not
approved them. It was written as filler so the section could be built, and it is
still filler.

Attributing invented words to a named individual is a different order of problem
from generic company boilerplate, so it is tracked rather than trusted to memory:
the build prints a warning on every run naming him and the file, and it will keep
printing until the flag clears.

**Acceptance criteria**

- [ ] John supplies a quote in writing, or we agree to drop the testimonial
- [ ] `quote` in `src/content/case-studies/tippa.md` holds his actual words
- [ ] `quotePending` is set to `false`
- [ ] The placeholder warning comment above the quote is removed
- [ ] `npm run build` completes with no testimonial warning

**Where** `src/content/case-studies/tippa.md`, warning emitted by
`src/components/Testimonials.astro`

---

### WEB-02 · Confirm written permission to name six clients

**Type** Task  **Priority** Blocker  **Epic** EP-1  **Component** Legal, Commercial
**Needs** Whoever owns each client relationship

Old Mutual, Fidelity, Bidvest Group, 3Sixty Health, National Video Vision and
Split Time are all named on the public site with a description of the work and a
headline figure. These were carried over from the previous site. Nobody has
confirmed any of them agreed in writing to be named, and the previous site is not
evidence that they did.

This is the ticket most likely to be waved through and most expensive if it is
wrong. A client discovering their name and metrics on a vendor site without
consent is a relationship problem and potentially a contractual one.

**Acceptance criteria**

- [ ] A written record exists for each of the six confirming they may be named
- [ ] Any client who declines is anonymised to sector and region, in the same
      style already used for the Canadian medical group
- [ ] The record is stored somewhere findable, not in an inbox

**Where** `src/content/case-studies/*.md`, `src/data/projects.ts`

---

### WEB-03 · Verify all 25 platform capabilities actually ship today

**Type** Task  **Priority** Blocker  **Epic** EP-1  **Component** Product
**Needs** Product owner for each platform

The five platform pages list 25 capabilities between them, and every one of them
is presented in the present tense as something the product does now. Nobody has
checked that against the products.

This is the highest value item on the whole list. A capability claimed on the
website and missing in a demo loses the deal at the worst possible moment, in
front of the person who found it. It is invisible on the page and obvious in the
room.

Breakdown: Process Genesis 6, ExpenseFlow 4, Ionic ERP 4, Ionic GRC 4, Tippa 7.

**Acceptance criteria**

- [ ] Each of the 25 capabilities is marked `ships today`, `roadmap` or `cut`
- [ ] Anything marked `cut` is removed from the page
- [ ] We decide whether `roadmap` items are shown with a label or removed
- [ ] The person who signed off is recorded per platform

**Where** `src/content/products/*.md`, `capabilities` array in each

---

### WEB-04 · Attribute or remove the 85 / 60 / 99 percent headline metrics

**Type** Task  **Priority** Blocker  **Epic** EP-1  **Component** Content
**Needs** Nyasha, Delivery

The homepage and the platform pages carry three figures: 85 percent faster
processing, 60 percent cost reduction, 99 percent plus accuracy. They are
labelled "as reported by clients", which is honest about the source but does not
say which clients, on what engagement, measured how.

They will be questioned in procurement and in any due diligence. An unattributed
percentage is worth less than a smaller number with a name against it.

**Acceptance criteria**

- [ ] Each figure traces to a named engagement and a stated measurement basis,
      or is removed from the site
- [ ] If kept, the page says what they are averages of
- [ ] Consistent treatment everywhere the figures appear, not just the homepage

**Where** `metrics` in `src/data/site.ts`, rendered in
`src/components/TelemetryBar.astro` and `src/pages/[product].astro`

---

### WEB-05 · Status ticker claims five regions and six sectors, both wrong

**Type** Bug  **Priority** Blocker  **Epic** EP-1  **Component** Frontend
**Needs** Frontend, then Nyasha to confirm the true numbers

The strip above the navigation on every page reports nine facts. Engagements, in
production and platforms are counted from the content collections and are
correct. Regions and sectors are typed in by hand and are not.

It says 5 regions. The published case studies cover two, South Africa and Canada.
It says 6 sectors. The published case studies cover seven distinct sectors.

So one number oversells us and the other undersells us, in the first element a
visitor sees, on every page. The fix is to derive both the way the other counts
are already derived, so they cannot drift again.

**Acceptance criteria**

- [ ] `regions` and `sectors` are computed from the case study collection
- [ ] No hardcoded counts remain in `TelemetryBar.astro`
- [ ] Adding a case study in a new sector updates the ticker with no code change

**Where** `src/components/TelemetryBar.astro:20-30`

---

### WEB-06 · Fact-check the six inherited case studies

**Type** Task  **Priority** Blocker  **Epic** EP-1  **Component** Content, Delivery
**Needs** Someone who was actually on each engagement

Six of the seven case studies were reconstructed from the one line testimonials
that were all the previous site carried. They read fluently, which is exactly
what makes an inferred detail hard to spot. Nobody who worked on those
engagements has read them.

Word counts, for scale: Tippa 834, Split Time 244, 3Sixty 232, Old Mutual 227,
Fidelity 226, National Video Vision 212, Bidvest 207. Tippa is long because we
had a real brief to write from. The others are short because we did not.

**Acceptance criteria**

- [ ] Each of the six is read by someone who was on the engagement
- [ ] Any inferred or incorrect detail is corrected or cut
- [ ] Each gains 200 to 400 words of what actually happened
- [ ] Highlight figures are confirmed against real numbers

**Where** `src/content/case-studies/` excluding `tippa.md`

---

### WEB-07 · Publish a phone number and at least one registered address

**Type** Task  **Priority** Blocker  **Epic** EP-1  **Component** Content
**Needs** Nyasha, Finance

The site claims delivery across South Africa, Canada and Australia. An email
address is the only way to contact us. There is no phone number and no physical
address anywhere.

Enterprise procurement expects both, and vendor onboarding forms usually require
a registered address and company number. Their absence reads as a much smaller
company than we are, and we are five years into an Old Mutual engagement.

**Acceptance criteria**

- [ ] At least one phone number published and reachable
- [ ] At least one registered address published
- [ ] Company registration number available for onboarding forms
- [ ] `site.ts` carries them so they render consistently, not pasted per page

**Where** `contact` object in `src/data/site.ts:21`, currently email only

---

### WEB-08 · Contact form cannot work on the current deployment

**Type** Bug  **Priority** Blocker  **Epic** EP-2  **Component** Backend
**Needs** Backend, Nyasha to pick a direction

The contact form posts to `/contact.php`, a PHP handler carried over from the
previous site. It validates input, applies a honeypot and time trap, and sends
through PHP `mail()`.

The current deployment is Vercel, which serves static files and does not execute
PHP. So on `ionic-website-blush.vercel.app` the form does not submit, it fetches
a text file. Every enquiry through the site is being lost, silently, with the
user most likely seeing a generic failure.

This has to be resolved before launch whichever way we go. Options, with my
recommendation first:

1. **A serverless function on the host.** Port the handler to a Vercel or
   Netlify function and send through a transactional email API. Keeps the
   single-folder deploy, keeps the validation, works everywhere. Recommended.
2. **A hosted form service.** Fastest to stand up, adds a third party in the
   path of every lead, and some plans put their branding on it.
3. **Move to PHP hosting.** Keeps `contact.php` exactly as it is, but gives up
   the free static hosting and the preview deployments.

**Acceptance criteria**

- [ ] A submission from the live site reaches `info@ionicinnovate.com`
- [ ] A no JavaScript submission still works
- [ ] The honeypot and time trap behaviour is preserved
- [ ] A failed send is logged and alerts someone, rather than failing quietly
- [ ] Tested on the production domain, not only locally

**Where** `public/contact.php`, `formAction` in `src/data/site.ts:24`,
`src/components/ContactSection.astro`

---

### WEB-09 · Add an About page with named leadership

**Type** Story  **Priority** Blocker  **Epic** EP-1  **Component** Frontend, Content
**Needs** Nyasha

There is no About page and not one named person anywhere on the site. A
consultancy sells its people, and this is the page a buyer opens second after the
homepage. Competitors in this market all have one.

Listed as a blocker rather than expansion work because its absence is
conspicuous in a way the other missing pages are not.

**Acceptance criteria**

- [ ] `/about/` exists and is in the primary navigation
- [ ] Who we are, how long we have been trading, where we operate
- [ ] Named leadership with roles, and photographs if approved (see WEB-36)
- [ ] Consistent with the claims already made elsewhere on the site

---

## B. Backend and infrastructure

---

### WEB-10 · Choose production hosting and connect the real domain

**Type** Task  **Priority** High  **Epic** EP-3  **Component** Infrastructure
**Needs** Nyasha

The site is live on a Vercel preview URL. `astro.config.mjs` is configured for
`https://www.ionicinnovate.com`, which is what the sitemap, canonical tags and
structured data all emit, so those are currently pointing at a domain the build
is not served from.

Depends on WEB-08, because the hosting choice and the contact form solution
constrain each other.

**Acceptance criteria**

- [ ] Production host chosen and documented
- [ ] `www.ionicinnovate.com` resolves to the new site
- [ ] HTTPS with automatic renewal
- [ ] Apex to www redirect, or the reverse, consistently
- [ ] Old site either retired or redirected, with the URL map checked

---

### WEB-11 · Preserve existing URLs from the previous site

**Type** Task  **Priority** High  **Epic** EP-3  **Component** Backend, SEO
**Needs** Backend

`trailingSlash: 'always'` and `build.format: 'directory'` are already set
specifically so directory URLs like `/contact/` and `/ionic-erp/` match the old
site exactly. That covers pages that still exist under the same name.

What is not covered is anything the old site had at a different path. A 404 on an
indexed URL throws away that page's search ranking.

**Acceptance criteria**

- [ ] Full URL list of the old site captured before it is taken down
- [ ] Every old URL either resolves or 301s to its closest equivalent
- [ ] Redirect map checked against the live site after cutover
- [ ] Search Console monitored for 404 spikes for two weeks after launch

**Where** `astro.config.mjs`, `redirects` block

---

### WEB-12 · Deliver contact enquiries somewhere better than one inbox

**Type** Story  **Priority** Medium  **Epic** EP-2  **Component** Backend
**Needs** Nyasha

Every enquiry goes to `info@ionicinnovate.com`, including the ones the form marks
as investor enquiries. There is no record of a submission other than the email,
so a lost or filtered email is a lost lead with no trace.

**Acceptance criteria**

- [ ] Submissions are recorded somewhere durable as well as emailed
- [ ] Investor enquiries route separately from general enquiries
- [ ] The one business day reply commitment we publish is actually measurable

---

### WEB-13 · Review spam protection on the contact form

**Type** Task  **Priority** Medium  **Epic** EP-2  **Component** Backend
**Needs** Backend

The handler uses a honeypot field and a time trap. That stops naive bots and will
not stop a targeted one. There is no rate limiting and no captcha.

Worth reviewing as part of WEB-08 rather than separately, since the handler is
being rewritten anyway. Flagging it so it is a decision and not an omission.

**Acceptance criteria**

- [ ] Rate limiting per IP decided on, and implemented or explicitly declined
- [ ] Decision recorded on whether to add a privacy-respecting captcha
- [ ] Honeypot and time trap carried through to the new handler

**Where** `public/contact.php`, lines around the time trap comment

---

### WEB-14 · Consolidate the two GitHub repositories

**Type** Task  **Priority** Medium  **Epic** EP-3  **Component** Infrastructure
**Needs** Nyasha

The project pushes to two remotes, `danielsnyashadzashe-boop/ionic-website` and
`nyashadaniels/ionic-website`, both owned by the same person under different
accounts. Each needs its own access token, and three tokens have expired mid-task
so far, leaving one copy four commits stale at one point.

Both are currently level and current. The risk is that they drift again.

**Acceptance criteria**

- [ ] One repository designated canonical, in writing
- [ ] Either the second is retired, or one account is added as a collaborator on
      the other so a single credential covers both
- [ ] Deployment points at the canonical repository
- [ ] Access tokens are long lived or replaced by SSH keys

---

### WEB-15 · Document the build and deploy process

**Type** Task  **Priority** Low  **Epic** EP-3  **Component** Infrastructure
**Needs** Whoever sets up WEB-10

Right now the deploy process lives in this conversation and nowhere else. If
somebody else has to ship a change, they cannot.

**Acceptance criteria**

- [ ] README or `docs/deploy.md` covers local setup, build, deploy and rollback
- [ ] The audit scripts in `scripts/` are documented, including what each checks
- [ ] Where secrets live and who has access is written down

---

## C. Frontend build

New pages buyers expect to find. Ordered roughly as I would build them.

---

### WEB-16 · Industries section with per-industry pages

**Type** Story  **Priority** High  **Epic** EP-4  **Component** Frontend, Content
**Needs** Nyasha, Commercial

"Do they work in my industry" is the first question a buyer asks, and we answer
it only as a chart label. We deliver across seven distinct sectors and have no
page for any of them.

Competitors in this market run separate pages for farming, manufacturing, medium
business and small business. Ours should follow the sectors we actually have
evidence in, not a generic list.

**Acceptance criteria**

- [ ] `/industries/` index listing the sectors we serve
- [ ] A page per sector, driven by a content collection rather than hand built
- [ ] Each links the case studies and platforms relevant to it
- [ ] No sector listed without at least one piece of real evidence behind it

---

### WEB-17 · FAQs page

**Type** Story  **Priority** High  **Epic** EP-4  **Component** Frontend, Content
**Needs** Nyasha, Commercial

Answers the objections currently handled on a call: how we price, how long things
take, what happens to client data, whether we work with an existing stack, what
happens after go live.

Cheap to build, and it is the page that filters out unsuitable enquiries before
they reach a human.

**Acceptance criteria**

- [ ] `/faqs/` exists with at least ten real questions
- [ ] Questions come from actual sales conversations, not invented
- [ ] `FAQPage` structured data so answers can surface in search
- [ ] Linked from the contact page and the platform pages

---

### WEB-18 · Technology stack page

**Type** Story  **Priority** Medium  **Epic** EP-4  **Component** Frontend, Content
**Needs** Engineering

A technical evaluator wants to know what we build on before they book a call.
Competitors publish theirs. This is credibility we already have and do not show.

The integration hub capability already names SAP, Oracle, Microsoft and CRM
connectors, so some of this content exists in fragments.

**Acceptance criteria**

- [ ] `/stack/` covering languages, platforms, cloud, integration and security
- [ ] Only things we genuinely use
- [ ] Linked from platform pages where relevant

---

### WEB-19 · Security and data handling page

**Type** Story  **Priority** High  **Epic** EP-4  **Component** Frontend, Content
**Needs** Engineering, Legal

We sell GRC and fraud detection into financial services and healthcare, and we
say connectors are secured to bank grade standards. There is no page explaining
what that means.

Competitors do not have one either, but its absence is more conspicuous for us
than for them given what we sell and to whom.

**Acceptance criteria**

- [ ] `/security/` covering data handling, residency, access control and
      certifications where we hold them
- [ ] No claim on the page that cannot be evidenced
- [ ] Reviewed by whoever would answer a security questionnaire

---

### WEB-20 · Service sub-pages

**Type** Story  **Priority** Medium  **Epic** EP-4  **Component** Frontend, Content
**Needs** Nyasha

Our services are three cards on the homepage with no page behind them.
Competitors split theirs into individual pages: AI agents, AI workflow, private
compute, web applications, company portals, automation, virtual CTO,
integration.

This is also most of their search footprint. Each page targets a phrase we
currently rank for nowhere.

**Acceptance criteria**

- [ ] A page per service, driven by a content collection
- [ ] Each links to relevant platforms and case studies
- [ ] Homepage service cards link through to them
- [ ] Navigation restructured to accommodate them without bloating the menu

---

### WEB-21 · Resources section

**Type** Story  **Priority** Low  **Epic** EP-4  **Component** Frontend
**Needs** Nyasha

Competitors group guides, templates and downloads under Resources. We have
Insights and nothing else. Only worth building if WEB-30 lands and we actually
publish regularly.

**Acceptance criteria**

- [ ] Decision taken on whether this is distinct from Insights
- [ ] If built, at least three real resources at launch

---

### WEB-22 · Derive regions and sectors from content

**Type** Task  **Priority** High  **Epic** EP-1  **Component** Frontend
**Needs** Frontend

Implementation half of WEB-05. Kept separate so the bug can be tracked against
the person who owns the number and the fix against the person who writes the
code.

**Acceptance criteria**

- [ ] Both values computed at build time from the case study collection
- [ ] Region strings like "South Africa · Canada" split correctly into two
- [ ] A unit of evidence added so the count cannot silently drift

**Where** `src/components/TelemetryBar.astro`

---

### WEB-23 · Support named individuals on testimonials

**Type** Story  **Priority** Medium  **Epic** EP-5  **Component** Frontend
**Needs** Frontend, after WEB-29

Six of the seven testimonials are attributed to a company with no individual
named. The schema supports `quoteAttribution` as free text but the components
have no concept of a person, a job title or a photograph.

A quote from a named person with a title is materially more persuasive than the
same words against a logo. Build the support so the content can land as soon as
it is collected.

**Acceptance criteria**

- [ ] Schema carries name, role and optional photograph separately
- [ ] Testimonials section and case study pages render a person when present
- [ ] Falls back cleanly to company attribution when not
- [ ] The existing pending quote warning still fires

**Where** `src/content.config.ts`, `src/components/Testimonials.astro`,
`src/pages/case-studies/[slug].astro`

---

### WEB-24 · Render real client logos once files arrive

**Type** Task  **Priority** Medium  **Epic** EP-6  **Component** Frontend
**Needs** Frontend, blocked by WEB-39

`public/logos/README.md` documents exactly how to drop a real logo in and swap it
for the monogram fallback. The mechanism exists and has never been exercised
because we have no licensed files.

**Acceptance criteria**

- [ ] At least one real logo rendering through the documented path
- [ ] Checked in both light and dark themes
- [ ] Monogram fallback still correct for clients who have not supplied one

**Where** `public/logos/`, `src/data/brands.ts`

---

### WEB-25 · Newsletter signup

**Type** Story  **Priority** Low  **Epic** EP-7  **Component** Frontend, Backend
**Needs** Decision from WEB-54

Insights has an RSS feed and no email capture. Cheap to add. Only worth it if
somebody commits to sending something.

**Acceptance criteria**

- [ ] Blocked until WEB-54 is decided
- [ ] If approved, double opt in and an unsubscribe link
- [ ] Privacy policy updated to cover the mailing list

---

### WEB-26 · Cookie consent, only if analytics is approved

**Type** Task  **Priority** Low  **Epic** EP-7  **Component** Frontend, Legal
**Needs** Blocked by WEB-42

The privacy policy currently states plainly that the site runs no analytics,
advertising or third party tracking. That is true today and is the reason there
is no cookie banner.

The moment analytics goes in, that paragraph becomes false and the banner
question becomes live. Do not let these two land separately.

**Acceptance criteria**

- [ ] Only opened if WEB-42 is approved
- [ ] Privacy policy wording updated in the same release as the analytics script
- [ ] Banner only if the chosen tool actually sets non-essential cookies

**Where** `src/pages/privacy.astro`, Analytics and advertising section

---

### WEB-27 · Accessibility pass before launch

**Type** Task  **Priority** Medium  **Epic** EP-1  **Component** Frontend
**Needs** Frontend

The site has had contrast and static text audits run against it through the
scripts in `scripts/`, and the Compass keeps a real range input under every
instrument so it works by keyboard and screen reader. There has been no full
audit.

**Acceptance criteria**

- [ ] Keyboard path through every page including the Compass and the mega menu
- [ ] Screen reader pass on the homepage, a platform page and a case study
- [ ] Contrast audit clean at AA
- [ ] Reduced motion respected everywhere, which the new illustrations already do

---

## D. Content

---

### WEB-28 · Expand the four thin platform pages

**Type** Task  **Priority** High  **Epic** EP-5  **Component** Content
**Needs** Product

Body copy word counts: Tippa 431, Process Genesis 218, Ionic GRC 181, ExpenseFlow
169, Ionic ERP 163. The four originals are roughly half the depth of the one we
wrote from a real brief.

Process Genesis is the flagship and the shortest relative to its importance.

**Acceptance criteria**

- [ ] Each of the four reaches a comparable depth to Tippa
- [ ] Written from real product knowledge, not expanded from the existing copy
- [ ] Each answers: who is it for, what does it replace, what does adoption
      actually involve

**Where** `src/content/products/` excluding `tippa.md`

---

### WEB-29 · Collect named quotes from the six existing clients

**Type** Task  **Priority** Medium  **Epic** EP-5  **Component** Commercial
**Needs** Relationship owners

Pairs with WEB-23, which builds the support. This ticket gets the content.

Ideally a fresh sentence rather than the inherited one, from a named person with
a job title, plus a headshot if they will give one.

**Acceptance criteria**

- [ ] Name and role against each existing quote, or a new quote
- [ ] Written approval to publish name and role
- [ ] Headshot obtained where the person agrees

---

### WEB-30 · Decide an Insights cadence, or remove the dates

**Type** Task  **Priority** Medium  **Epic** EP-5  **Component** Content
**Needs** Nyasha

Three posts, published 14 July, 4 August and 18 August 2026. The newest is 41
days old as of today. A blog whose latest entry is over a month old reads as
abandoned, and the date is visible on every card.

Two honest options. Commit to a cadence with a named author, or remove the dates
so the section ages gracefully. Two short posts a month from whoever is closest
to the work beats one polished piece a quarter.

**Acceptance criteria**

- [ ] Either a named author and a cadence in the calendar, or dates removed
- [ ] If keeping dates, at least one new post before launch

**Where** `src/content/insights/`

---

### WEB-31 · Second reference for Ionic GRC

**Type** Task  **Priority** Medium  **Epic** EP-5  **Component** Product, Commercial
**Needs** Product

Ionic GRC has one traction item. The second was Momentum, which had to be removed
because they are a prospect and not delivered work.

Traction counts across the platforms: Process Genesis 4, ExpenseFlow 3, Ionic ERP
2, Tippa 2, Ionic GRC 1. A platform page carrying a single reference is a hard
sell in procurement.

**Acceptance criteria**

- [ ] A second real reference added, or agreement that it stands on one
- [ ] If none exists, consider whether the page should say so plainly

**Where** `src/content/products/ionic-grc.md`, `traction.items`

---

### WEB-32 · Headline figure for Niche Consulting

**Type** Task  **Priority** Low  **Epic** EP-5  **Component** Content
**Needs** Delivery

Every entry in the engagement ledger carries a headline metric except Niche
Consulting, which renders with a gap where the others have a number.

**Acceptance criteria**

- [ ] A real metric supplied, or the entry restructured so the gap is deliberate

**Where** `src/data/projects.ts`

---

### WEB-33 · Decide whether the anonymised clients can be named

**Type** Task  **Priority** Low  **Epic** EP-5  **Component** Commercial
**Needs** Relationship owners

Two ledger entries are anonymised: a Canadian medical group in pilot, and two
Canadian accounting firms in partnership. Neither has a case study.

Anonymised is the correct default. Worth asking once whether it is necessary,
because a named Canadian client would support the claim that we deliver there.

**Acceptance criteria**

- [ ] Asked and answered for each
- [ ] Named if permitted, otherwise left as is with the decision recorded

**Where** `src/data/projects.ts`

---

### WEB-34 · Keep Momentum out of public content

**Type** Task  **Priority** Medium  **Epic** EP-5  **Component** Content
**Needs** Nobody, this is a standing check

Momentum appears in the ledger with status `In discussion`. They are a prospect,
not delivered work, and naming a company as being in talks with us is not ours to
publish. The filter in `projects.ts` removes anything that is not `Live`, `Pilot`
or `Partner`, so it is handled structurally rather than by remembering.

Raised as a ticket so the constraint is written down somewhere other than a code
comment, and so nobody removes the filter thinking it is dead code.

**Acceptance criteria**

- [ ] The `PUBLISHABLE` filter stays in place
- [ ] Any new status value is explicitly classified before use
- [ ] Momentum does not appear in any published page or chart

**Where** `src/data/projects.ts`, `PUBLISHABLE` set

---

### WEB-35 · Terms of service page

**Type** Task  **Priority** Low  **Epic** EP-1  **Component** Legal
**Needs** Legal

There is a privacy policy and no terms of service. Not strictly required for a
brochure site with no transactions, but usually expected alongside a privacy
policy and cheap to add.

**Acceptance criteria**

- [ ] Decision on whether we need one
- [ ] If yes, published and linked in the footer beside the privacy policy

---

## E. Design and assets

Every photograph on the site is stock. Each carries a quiet "Illustrative"
marker, because none of them shows Ionic staff, an Ionic office or a named
engagement. That marker is honest and it is also a visible admission on every
image we publish.

**Supply the largest original available.** The build generates every responsive
size automatically at widths 480, 800, 1200 and 1800, and serves AVIF and WebP.
Do not pre-resize anything for the web.

---

### WEB-36 · Team headshots

**Type** Task  **Priority** High  **Epic** EP-6  **Component** Design
**Needs** Nyasha

Blocks the About page (WEB-09) and the named testimonials (WEB-23).

**Specification**

| Item | Value |
|---|---|
| Size | 1200 x 1200 minimum |
| Ratio | Square |
| Format | JPG |
| Background | Plain, consistent across everyone |
| Weight | Under 800 KB each |

**Acceptance criteria**

- [ ] One per person appearing on the site
- [ ] Consistent lighting and background across the set
- [ ] Written consent to publish each person's image

---

### WEB-37 · Office and team at work photography

**Type** Task  **Priority** Medium  **Epic** EP-6  **Component** Design
**Needs** Nyasha

Replaces stock on the About page and the Approach section.

**Specification**

| Item | Value |
|---|---|
| Size | 2560 px wide |
| Ratio | Landscape, 16:10 or wider |
| Format | JPG |
| Weight | Under 800 KB |

**Acceptance criteria**

- [ ] At least three usable frames
- [ ] Anyone identifiable has consented
- [ ] No client material visible on screens or whiteboards

---

### WEB-38 · Product screenshots for the five platform pages

**Type** Task  **Priority** High  **Epic** EP-6  **Component** Product, Design
**Needs** Product

The highest value imagery on the list. We sell five platforms and illustrate each
with a photograph of a stranger at a laptop. One real screenshot per platform
would do more for those pages than any amount of rewriting.

**Specification**

| Item | Value |
|---|---|
| Size | 2560 px wide |
| Format | PNG |
| Content | Real interface, realistic but non-client data |
| Theme | Capture in both light and dark if the product supports it |

**Acceptance criteria**

- [ ] At least one per platform, five total
- [ ] No real client data, no real names, no real figures
- [ ] Checked that nothing internal is visible in menus or headers

---

### WEB-39 · Licensed client logo files

**Type** Task  **Priority** Medium  **Epic** EP-6  **Component** Commercial
**Needs** Relationship owners

The logo strip currently shows lettering rather than real marks, deliberately.
Drawing an approximation of a client's logo produces a fake logo and a trademark
problem, so it is licensed files or it stays as lettering. Either is fine. The
current state is the honest version of not having them.

Depends on WEB-02, since permission to show a logo is a separate permission from
permission to be named.

**Specification**

| Item | Value |
|---|---|
| Format | SVG strongly preferred, PNG at 2x acceptable |
| Rendered at | 20 x 20 CSS px |
| Colour | Monochrome or single colour works best across both themes |
| Artboard | Whitespace trimmed so the mark fills its box |

**Acceptance criteria**

- [ ] Files obtained with written permission to use them
- [ ] Brand guidelines checked for each
- [ ] Dropped into `public/logos/` per the README

---

### WEB-40 · Vector version of the Ionic logo

**Type** Task  **Priority** Medium  **Epic** EP-6  **Component** Design
**Needs** Nyasha

We ship four PNG lockups in `public/brand/`. PNG is the wrong format for a logo
that renders at several sizes in the header, the footer and the favicon. An SVG
is sharp at every size and a fraction of the weight.

**Acceptance criteria**

- [ ] SVG lockup and stacked mark, on light and on dark
- [ ] Renders correctly in the header at 124 px wide
- [ ] Favicon and apple touch icon regenerated from the vector

**Where** `public/brand/`, `src/components/Logo.astro`

---

### WEB-41 · Replace stock photography as real images arrive

**Type** Task  **Priority** Low  **Epic** EP-6  **Component** Frontend
**Needs** Frontend, after WEB-36 to WEB-38

Nine photographs are registered and every one is now referenced at least once. As
real imagery arrives, swap it in and drop the "Illustrative" marker for anything
genuine.

**Acceptance criteria**

- [ ] Registry updated as replacements land
- [ ] Marker removed only for genuine images
- [ ] No photograph left registered and unused

**Where** `src/data/photos.ts`, `src/components/Figure.astro`

---

## F. SEO, analytics and measurement

---

### WEB-42 · Decide on and install analytics

**Type** Task  **Priority** High  **Epic** EP-7  **Component** Frontend, Legal
**Needs** Nyasha

No analytics of any kind. We have no idea what anyone does on the site, which
means every conversation like this one runs on opinion.

A privacy respecting tool gives us evidence without the cookie banner burden.
Note that installing anything makes the current privacy policy wording false, so
WEB-26 ships in the same release.

**Acceptance criteria**

- [ ] Tool chosen, with the privacy trade off understood
- [ ] Installed and verified collecting
- [ ] Privacy policy updated in the same release
- [ ] Agreed what we will actually look at, and how often

---

### WEB-43 · Per page social preview images

**Type** Task  **Priority** Medium  **Epic** EP-7  **Component** Frontend
**Needs** Frontend

Every page shares one image, `og-default.png`. So a case study, a platform page
and the homepage all preview identically on LinkedIn, Slack and WhatsApp.

`scripts/og.mjs` already generates the default from SVG through sharp, so the
machinery exists. It needs to run per page with the page title on it.

**Acceptance criteria**

- [ ] Generated card per case study, platform and insight
- [ ] Title rendered onto the card
- [ ] Verified in the LinkedIn post inspector
- [ ] Build time stays reasonable

**Where** `scripts/og.mjs`, `src/layouts/PageLayout.astro`

---

### WEB-44 · Search Console and Bing Webmaster setup

**Type** Task  **Priority** Medium  **Epic** EP-7  **Component** Infrastructure
**Needs** Nyasha

The sitemap is generated and referenced in `robots.txt`, pointing at
`www.ionicinnovate.com`. Nothing is submitted anywhere.

**Acceptance criteria**

- [ ] Domain verified in Google Search Console
- [ ] Sitemap submitted
- [ ] Coverage monitored for the first month after launch

---

### WEB-45 · Post launch SEO baseline

**Type** Task  **Priority** Low  **Epic** EP-7  **Component** SEO
**Needs** Nyasha

Capture where we rank before the new site indexes, so we can tell whether it
helped. Without a baseline any change is unattributable.

**Acceptance criteria**

- [ ] Current rankings recorded for our target phrases before cutover
- [ ] Re-measured at 30 and 90 days

---

## G. Technical debt

---

### WEB-46 · Remove the orphaned logo marquee

**Type** Task  **Priority** Low  **Epic** EP-8  **Component** Frontend
**Needs** Frontend

`src/components/LogoMarquee.astro` is not rendered on any page. It was removed
from the homepage during the redesign and the component was left behind. It is
the only orphaned component in the codebase.

`src/data/brands.ts` is still needed by WEB-24, so it stays.

**Acceptance criteria**

- [ ] Component deleted, or a comment added saying why it is kept
- [ ] `brands.ts` retained
- [ ] Build clean afterwards

---

### WEB-47 · Add the orphan check to the build

**Type** Task  **Priority** Low  **Epic** EP-8  **Component** Frontend
**Needs** Frontend

WEB-46 was found by a one off scan. The same class of problem already bit us once
before, when a registered photograph sat unused on every page for several
releases.

There are already audit scripts in `scripts/` for contrast, hover states,
responsive layout and static text. This is the same kind of check.

**Acceptance criteria**

- [ ] A script reports components, photos and data entries with zero references
- [ ] Wired into the build as a warning, in the style of the pending quote warning
- [ ] Documented alongside the other scripts

---

### WEB-48 · Test coverage for the content constraints

**Type** Task  **Priority** Low  **Epic** EP-8  **Component** Frontend
**Needs** Frontend

Several rules are currently enforced by a comment and a habit: no prospect in
public content, no unapproved quote attributed to a person, no hardcoded count
that content should derive.

The Zod schemas catch malformed frontmatter and the build warns on pending
quotes, both good. The rest is unguarded.

**Acceptance criteria**

- [ ] A check that no non publishable status reaches a rendered page
- [ ] A check that derived counts match the collections they come from
- [ ] Failing the build rather than warning, where the rule is absolute

---

### WEB-49 · Line ending consistency

**Type** Task  **Priority** Low  **Epic** EP-8  **Component** Infrastructure
**Needs** Frontend

Git warns on nearly every commit that LF will be replaced by CRLF. Harmless, and
noisy enough that a real warning could hide in it.

**Acceptance criteria**

- [ ] `.gitattributes` added normalising line endings
- [ ] Warnings gone on a clean commit

---

## H. Spikes and decisions

Not tickets to build, tickets to decide. Each needs a yes or a no with a cost
attached. I would rather we chose deliberately than drifted.

---

### WEB-50 · Should we add a chatbot?

**Type** Spike  **Priority** Medium  **Epic** EP-4  **Needs** Nyasha, team

My honest read is not yet, and possibly not at all.

We already promise a reply from a real person within one business day, which is a
stronger claim than a bot. The Process Compass gives a visitor a substantive
answer without one. And a bot trained on thin content answers thinly, which is
awkward given most of this backlog is about our content being thin.

Worth revisiting once the platform pages and an FAQ exist, because then it would
have something to draw on.

**Decision needed on**

- [ ] Build, buy or decline
- [ ] If built, what it is allowed to claim on our behalf
- [ ] Who monitors the conversations

---

### WEB-51 · Should we publish pricing?

**Type** Spike  **Priority** Medium  **Epic** EP-4  **Needs** Nyasha, Commercial

Nothing published. Competitors mostly do not either.

The middle option is indicative ranges rather than prices, of the kind the
Compass already gives when it says a piece of work is typically three to five
weeks. Ranges filter out unsuitable enquiries before they reach a call, without
committing us to a number.

**Decision needed on**

- [ ] Full pricing, indicative ranges, or nothing
- [ ] If ranges, who owns keeping them honest

---

### WEB-52 · Careers page

**Type** Spike  **Priority** Low  **Epic** EP-4  **Needs** Nyasha

We say we work inside client teams, which implies we have a team. There is no way
to apply to join it.

**Decision needed on**

- [ ] Whether we are hiring
- [ ] A page, or just an email address on the About page

---

### WEB-53 · Gated case study PDFs

**Type** Spike  **Priority** Low  **Epic** EP-7  **Needs** Nyasha, Commercial

Trades a lead for a worse reading experience. My view is no, but it is a
commercial call rather than a design one.

**Decision needed on**

- [ ] Gate, do not gate, or offer an ungated PDF download

---

### WEB-54 · Email list

**Type** Spike  **Priority** Low  **Epic** EP-7  **Needs** Nyasha

Blocks WEB-25. Only worth building if somebody commits to sending something.

**Decision needed on**

- [ ] Whether we will actually send a newsletter
- [ ] Who writes it and how often

---

### WEB-55 · Multi-language support

**Type** Spike  **Priority** Low  **Epic** EP-4  **Needs** Nyasha

We deliver in South Africa, Canada and Australia, all English speaking for
business purposes. Raising it so it is a decision rather than an oversight. My
view is no.

**Decision needed on**

- [ ] Whether any target market needs another language

---

### WEB-56 · Should Tippa sit under our platforms?

**Type** Spike  **Priority** Medium  **Epic** EP-5  **Needs** Nyasha

Tippa is on the platforms section with our own four products. It is a client
platform we built, not a product we own and sell.

I dropped the word "proprietary" from the section heading rather than apply it to
something it is not true of, but that is a workaround and not a decision.

The alternative is splitting the section into products we own and platforms we
have built for clients. That is more honest and it also shows two different
capabilities rather than blurring them into one.

**Decision needed on**

- [ ] Leave as is, split the section, or move Tippa to case studies only

---

## Suggested order

**Before anything else:** WEB-08, because the contact form being broken on the
live deployment means every enquiry since it went up has been lost, and because
the hosting decision in WEB-10 depends on how we fix it.

**Sprint 1, launch blockers:** WEB-01 to WEB-09. Most are waiting on a person
rather than on engineering, so start chasing them now and build around them.

**Sprint 2, infrastructure:** WEB-10, WEB-11, WEB-14, WEB-42.

**Sprint 3, the pages buyers look for:** WEB-16, WEB-17, WEB-19.

**Ongoing, asset collection:** WEB-36 to WEB-40. Long lead times, so brief them
early even though they are not blocking.

**Decide at the next review:** the whole of section H.

---

## I. Reconciliation against the parallel build

On 5 October a second, independently built static site arrived as
`ionic-website.zip`. It is a nine-page hand-written build whose handover notes
cite Reneil directly as the source of fact. Much of its content has now been
merged into this site. These tickets cover what it contradicted rather than
what it added.

**None of these can be closed from the code. Each one needs Reneil.**

---

### WEB-57 · Old Mutual is named directly here and as Sirago and Genric there

**Type** Bug  **Priority** Blocker  **Epic** EP-5  **Component** Content
**Needs** Reneil

Our ledger carries `Old Mutual`, described as "group-wide process automation
across all business units" with a five-year agreement, and a case study to
match. The parallel build names **Sirago**, an underwriting manager within the
Old Mutual Group, and **Genric**, the group company that builds Sirago's
systems. Its handover says the logo tile carries a "Group companies" caption
specifically because the work was done for those two.

The Sirago case study has now been written and leads the site. The existing
Old Mutual entry has deliberately **not** been deleted, because removing a
client claim is not a call to make from a zip file. But the site currently
publishes both, and if they describe the same engagement we are naming the
parent group for work done for two subsidiaries.

**Acceptance criteria**

- [ ] Confirm whether Old Mutual and Sirago and Genric are one engagement
- [ ] If one, remove or rewrite the Old Mutual entry and its case study
- [ ] If separate, confirm the group-wide claim is accurate and permitted
- [ ] Confirm brand approval for using the Old Mutual name at all

**Where** `src/data/projects.ts`, `src/content/case-studies/old-mutual.md`,
`src/content/case-studies/sirago.md`

---

### WEB-58 · Four clients appear only on our side

**Type** Task  **Priority** Blocker  **Epic** EP-5  **Component** Content
**Needs** Reneil

Fidelity, Bidvest Group, 3Sixty Health and Split Time are published here with
case studies and headline figures. None of them appears anywhere in the
parallel build, which otherwise lists thirteen clients including several we
had never recorded.

Ours were reconstructed from one-line testimonials on the previous site, which
is already flagged in WEB-06. This is the second independent reason to check
them.

**Acceptance criteria**

- [ ] Each of the four confirmed as real, current and permitted, or removed
- [ ] Headline figures confirmed against something other than the old site

---

### WEB-59 · National Video Vision is described two different ways

**Type** Bug  **Priority** High  **Epic** EP-5  **Component** Content
**Needs** Reneil

Our ledger: "Expense automation across a 50-person business, two currencies."
The parallel build: a full ERP for scheduling, events, finance, operations,
logistics, assets and inventory, plus a gifting catalogue, in events and
gifting.

Those are not variations on a description. They are different engagements, or
one engagement one of us has wrong.

**Where** `src/data/projects.ts`,
`src/content/case-studies/national-video-vision.md`

---

### WEB-60 · Ionic ERP and Ionic GRC do not exist in the parallel build

**Type** Task  **Priority** Blocker  **Epic** EP-5  **Component** Product
**Needs** Reneil

We publish four proprietary platforms. The parallel build publishes one
platform, Process Genesis, and one product, ExpenseFlow. There is no Ionic ERP
and no Ionic GRC anywhere in it. The ERP work appears there as bespoke client
builds, for Depot in Durban and for NVV, rather than as a product.

Either two real products were omitted there, or bespoke client work has been
productised into platform pages here. WEB-03 already needs every capability
verified and WEB-31 already notes that Ionic GRC rests on a single reference,
so this is the third signal pointing the same way.

**Acceptance criteria**

- [ ] Confirm whether Ionic ERP and Ionic GRC are products we sell
- [ ] If they are bespoke builds, restructure them as case studies
- [ ] If they are products, confirm their capability lists against WEB-03

---

### WEB-61 · Australia is still listed as planned for 2026

**Type** Task  **Priority** Medium  **Epic** EP-5  **Component** Content
**Needs** Reneil

`locations` lists Australia with `status: 'planned', from: '2026'`, so the site
renders "Australia (2026)". It is now October 2026, which makes that read as a
plan that did not happen.

The parallel build describes two home markets, Canada and South Africa, and
mentions Australia only as somewhere the founder has worked. Left in place for
now because withdrawing a market claim is a business decision.

**Where** `src/data/site.ts`, `locations`

---

### WEB-62 · Preview deployments should not be indexable

**Type** Task  **Priority** High  **Epic** EP-3  **Component** Infrastructure
**Needs** Backend

Raised by the parallel build's handover and not previously on this list. Vercel
preview URLs are currently indexable, so a preview can compete with the live
domain in search and split the ranking.

**Acceptance criteria**

- [ ] Preview deployments send `X-Robots-Tag: noindex`
- [ ] Production is unaffected
- [ ] Verified by requesting a preview URL and reading the response headers

---

## Closed by the merge

| Ticket | Status |
|---|---|
| WEB-05, WEB-22 | **Done.** Regions and sectors are now counted from content. The bar reads 2 regions and 10 sectors, both derived. |
| WEB-09 | **Done.** `/about/` is live with Reneil and Rabind, named, with real background and `Person` structured data. |
| WEB-17 | **Mostly done.** Thirteen FAQ entries with `FAQPage` data across `/ca/`, `/za/` and `/process-genesis/`. A standalone `/faqs/` page is no longer needed. |
| WEB-19 | **Partly done.** POPIA and PIPEDA are now named on the regional pages and in the platform FAQ. A full security page is still open. |
| WEB-20 | **Done.** `/services/` carries seven anchored services across two pillars, each with `Service` structured data and, where one exists, the engagement that evidences it. |
| WEB-16 | **Superseded.** Regional pages now carry sector lists with real work behind them. Per-industry pages remain worth doing, but are no longer the gap they were. |
| WEB-07 | **Partly done.** Alberta head office and the South African city list are published. Phone numbers and street addresses are still outstanding. |
| WEB-04 | **Partly done.** The metrics now carry their basis wherever they appear. Attribution to a named engagement is still outstanding. |

---

## J. Local search and citations

From the parallel build's handover. None of this is site work, and the
handover is blunt that the site alone will not get us into the top three
without it.

---

### WEB-63 · Google Business Profile for each region

**Type** Task  **Priority** High  **Epic** EP-7  **Component** Marketing
**Needs** Nyasha

Named as the single biggest lever for local results in Calgary, Edmonton,
Johannesburg, Cape Town and Durban, and it costs nothing. One profile for
Alberta and one for South Africa, the South African one set up as a
service-area business covering the country with the address hidden if there
is no client-facing office. Category "Business management consultant" or
"Software company".

**Acceptance criteria**

- [ ] Both profiles created and verified
- [ ] Categories, service areas and descriptions complete
- [ ] Profiles kept in step with the site's NAP once WEB-07 lands

---

### WEB-64 · Ask every client for a Google review

**Type** Task  **Priority** Medium  **Epic** EP-7  **Component** Commercial
**Needs** Relationship owners

Depends on WEB-63. Reviews are the other half of what moves local ranking,
and we are asking the same people already being asked for quotes in WEB-29,
so the two should go out together rather than as separate requests.

---

### WEB-65 · Location pages for cities we genuinely serve

**Type** Story  **Priority** Medium  **Epic** EP-4  **Component** Frontend, Content
**Needs** Nyasha

Start with Calgary and Edmonton, then Toronto and Vancouver as Canadian work
grows, plus Johannesburg, Cape Town and Durban.

The warning in the handover is the important half: each page needs genuinely
local content, a local client, local sectors, someone on the ground. Thin
duplicated city pages are discounted, so a page without local substance is
worse than no page. The regional template added in this round is the right
place to extend from.

**Acceptance criteria**

- [ ] A city is only given a page when there is something local to say
- [ ] Each page carries a local client or a named person
- [ ] No page is a find-and-replace of another

---

### WEB-66 · Directory listings and citations

**Type** Task  **Priority** Medium  **Epic** EP-7  **Component** Marketing
**Needs** Nyasha

Clutch, GoodFirms, Calgary Economic Development, Edmonton Global, Alberta
Innovates, the Johannesburg, Cape and Durban chambers of commerce, South
African tech directories and Women in Tech community pages. Also worth asking
clients for a "technology partner" link from their own site.

**Acceptance criteria**

- [ ] Listed on at least five, with consistent NAP across all of them
- [ ] Blocked on WEB-07, since the details have to be right before they are
      copied across the internet

---

### WEB-67 · Content cadence with buyer-question articles

**Type** Story  **Priority** Medium  **Epic** EP-5  **Component** Content
**Needs** Nyasha

Pairs with WEB-30, which asks for a cadence. This supplies the first five
titles, each aimed at a question a buyer actually types:

- How much does a custom ERP cost in Alberta?
- ERP versus a custom operations platform for construction companies
- What process mapping actually involves, and what it should cost
- POPIA-compliant automation: what to check before you start
- Bookkeeping for Alberta physicians: what can be automated

Two a month. Each one has a client engagement behind it already, which is
what makes them writable rather than generic.

---

### WEB-68 · Image format and dimensions discipline

**Type** Task  **Priority** Low  **Epic** EP-6  **Component** Frontend
**Needs** Frontend

The handover asks for WebP or AVIF with explicit width and height on every
photograph. Already true here: `astro:assets` emits AVIF and WebP at four
widths with intrinsic dimensions set. Raised so it can be closed as done
rather than rediscovered as a gap.

---

## Also closed by this round

| Ticket | Status |
|---|---|
| WEB-12 | **Partly done.** Enquiries now carry region and topic, so investor enquiries are distinguishable at the point of arrival. Routing them to a different inbox is still open. |

---

## K. Leads, the taster and the CRM

From Reneil, 5 October: embed the Process Genesis taster, no calendar on the
website, a dedicated mailbox people write to and we call back, leads tagged
as coming from the website, fed into the marketing tool so timelines can be
tracked, and a view of where most leads come from.

What landed on our side in this round: first-touch attribution on every page
and in every enquiry, a taster socket that routes to a conversation instead
of a calendar, and a topic on the form for people arriving from the taster.
These are the rest.

---

### WEB-69 · A dedicated enquiries mailbox

**Type** Task  **Priority** High  **Epic** EP-2  **Needs** Nyasha

Everything still goes to `info@ionicinnovate.com`, which is also where
invoices and general post arrive. The brief asks for a mailbox people engage
with and someone works through.

The subject line now carries the topic and the source, so it is already
sortable, but a filter on a shared inbox is not an owner.

**Acceptance criteria**

- [ ] A dedicated address exists with a named owner
- [ ] `RECIPIENT` in `public/contact.php` points at it
- [ ] An agreed response path: who replies, within what time, who calls back

**Where** `public/contact.php`, the TEAM note above `RECIPIENT`

---

### WEB-70 · Deploy and enable the taster, then set the host

**Type** Task  **Priority** High  **Epic** EP-2  **Needs** Backend, Nyasha

`TasterEmbed.astro` is built and renders nothing until `taster.host` is set,
which is deliberate: an iframe pointed at a host that does not answer is a
broken box on a live page.

Three things have to be true first, all on the PG side. `TASTER_ENABLED=true`.
A real API-key provider, because their own notes forbid serving the public
with `claude_code` on a personal Claude subscription. And the deployment has
to be publicly reachable over https, serving `/taster.html`,
`/taster-embed.js` and proxying `/api/taster/`.

Two numbers worth agreeing before it goes live. Each run makes two AI calls
we pay for, capped at 3 per IP per hour and 200 per day. And it takes 39 to
57 seconds end to end, up to 101 seconds under concurrency, which is a long
time to hold someone on a marketing page.

**Acceptance criteria**

- [ ] PG deployment reachable and the taster enabled with an API-key provider
- [ ] `taster.host` set in `src/data/site.ts`
- [ ] Booking CTA verified not to open a calendar (we pass `?book=message`)
- [ ] A run completed end to end from the live site

---

### WEB-71 · The taster's call to action still says "Book a walkthrough"

**Type** Bug  **Priority** High  **Epic** EP-2  **Component** PG repo
**Needs** Whoever owns `website/pg-taster`

We pass `?book=message`, which stops the frame opening a booking URL in a new
tab and makes it post an event instead. We catch that and send the visitor to
our contact form.

The label does not change. The button inside the frame still reads **"Book a
30-minute walkthrough"** next to a calendar icon, and no query parameter
alters it. So the page says calendar and does mailbox, which is worse than
either.

**Acceptance criteria**

- [ ] In `?book=message` mode the button reads something like "Tell us about
      this process" with a non-calendar icon
- [ ] Verified in our embed

**Where** `frontend/vite-project/src/taster/Reveal.jsx`, around line 54

---

### WEB-72 · The taster records no lead source at all

**Type** Bug  **Priority** Blocker  **Epic** EP-2  **Component** PG repo
**Needs** Whoever owns `website/pg-taster`

The brief's central question is where leads come from. A taster lead stores
id, timestamp, name, email, company, phone, consent, consent text and the
visitor's answers. **There is no source, no campaign, no referrer and no
landing page**, and nothing in `taster.py`, `taster_api.py` or
`taster_model.py` reads any.

So every lead that comes through the taster is unattributable, and the
question cannot be answered for exactly the channel we are about to promote.

We already compute this on our side. The cheapest fix is for the embed to
accept it and pass it through: our page knows the attribution, the frame can
take it as a query parameter and include it in the `/lead` body.

**Acceptance criteria**

- [ ] `/api/taster/lead` accepts an optional `source` string, sanitised and
      capped like the other fields
- [ ] It is stored on the lead and shown in the bell row
- [ ] `taster.html` reads it from its own query string so the embedding page
      can supply it
- [ ] Our `TasterEmbed` passes `attributionLine()` through

---

### WEB-73 · Decide where leads actually live

**Type** Spike  **Priority** High  **Epic** EP-2  **Needs** Nyasha, Vashen Mooniyen

The brief asks for leads in the marketing tool with timelines, and asks
whether anyone has built a CRM. Nobody has answered that yet, and until
somebody does there are three half-places a lead can sit: an inbox, the
taster's JSONB document in the website org, and whatever the marketing tool
is.

Worth settling before more plumbing is built, because each of those three is
a different integration.

**Decision needed on**

- [ ] Whether a CRM exists or is being built, and by whom
- [ ] Which system is the system of record for a lead
- [ ] Whether taster leads and form leads land in the same place
- [ ] What "track timelines" means: first contact, response, call booked, won

---

### WEB-74 · Land the taster as its own pull request, not the branch compare

**Type** Task  **Priority** Medium  **Epic** EP-3  **Component** PG repo
**Needs** Whoever owns `website/pg-taster`

The compare link we were sent is `main...website/pg-taster`: **88 commits
ahead, 152 behind, 300 files**, from a merge base dated 21 September. Only 8
of those 88 commits are the taster. The rest are design, operate, strategy,
agents, pm, sourcing and control-room work.

Opening it as one pull request asks for a review of twelve workstreams at
once, which in practice means no review.

The 8 taster commits touch an almost disjoint set of files, so they cherry-
pick onto main cleanly: `backend/taster*.py`, `frontend/vite-project/src/taster/`,
`taster.html`, `taster-embed.js`, `docs/website/TASTER.md`, plus small edits
to `main.py`, `notifications.py`, `tokens.css`, `vite.config.js` and the
route inventory. About 25 files instead of 300.

**Acceptance criteria**

- [ ] The 8 taster commits land on a branch cut from current main
- [ ] That branch is the pull request
- [ ] The rest of `website/pg-taster` is reviewed separately or abandoned
