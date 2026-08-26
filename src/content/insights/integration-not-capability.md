---
title: Transformation programmes fail on integration, not capability
description: >-
  The tools almost always work. What breaks is the space between them, and that
  space is where most of the budget quietly goes.
published: 2026-07-14
author: Ionic
topics: [Process automation, Enterprise architecture]
readingMinutes: 4
photo: nightEngineering
---

Ask why a digital transformation programme underdelivered and you will usually
be given a capability answer. The document extraction was not accurate enough.
The workflow engine could not model the exception. The analytics did not have
the fields.

In our experience that diagnosis is nearly always wrong. The individual tools
work. Vendors are selling mature software and it does roughly what the demo
showed. What fails is the space between the tools, and because no single vendor
owns that space, no single vendor is accountable for it.

## The arithmetic of seams

A conventional automation stack has four or five components: process discovery,
document processing, a workflow engine, a decision layer, and reporting. Each is
a reasonable purchase. Each is also a seam.

Every seam needs a data contract, an error-handling policy for when the upstream
system returns something unexpected, a security review, and an owner. Five
components produce ten possible pairings, and while you will not integrate all
of them, you will integrate more than you scoped.

The cost is not the connector. The cost is that the connector is nobody's
product. When it breaks at month-end, two vendors will each demonstrate,
correctly, that their side is behaving as specified.

## Where the budget actually goes

The pattern we see is consistent. Integration work is estimated as a line item
and consumed as a programme. The money comes from the part of the budget that
was allocated to change management, because that is the only line flexible
enough to raid.

This is the quiet failure mode. The technology gets delivered. The adoption
work, which was what made the business case credible, does not. Six months
later the platform is running and the process is unchanged, because nobody was
funded to help anyone work differently.

## What to ask a vendor

Two questions separate integrated platforms from suites assembled through
acquisition:

**Does discovery write into the workflow engine, or export to it?** An export is
a seam wearing a product's badge. If the mapping produced by discovery has to be
re-entered, even semi-automatically, the components were built separately.

**Which single component owns the event stream?** In a genuinely integrated
platform, analytics and the decision layer read the same events the workflow
engine emits. If reporting runs off its own warehouse with its own ingestion
schedule, you will spend a year reconciling two numbers that should be one.

Neither question is about features. Both predict what your integration bill will
be, which is the number that actually determines whether the programme lands.
