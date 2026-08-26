---
title: Fraud detection belongs inside GRC, not beside it
description: >-
  Splitting compliance from fraud monitoring is an organisational habit, not a
  design decision. It has a predictable cost.
published: 2026-08-18
author: Ionic
topics: [Governance risk & compliance, Fraud]
readingMinutes: 3
photo: modelMonitoring
---

In most organisations, compliance and fraud monitoring live in different systems
owned by different teams. Compliance reports to legal or risk; fraud detection
sits with finance, internal audit, or a specialist unit. Each has its own tooling,
its own cadence, and its own definition of what constitutes an exception.

This split is almost never a deliberate architectural choice. It is a record of
how the two functions were staffed, usually years apart.

## What the split costs

A control framework encodes what should be true. A fraud engine observes what is
actually happening. Held separately, each sees half of the same problem.

Consider a control that exists on paper and is being routinely bypassed in
practice. To the compliance system this is a control gap — a documentation and
remediation issue, scheduled for the next review cycle. To the fraud engine it
is an anomalous pattern of unknown significance, because the engine does not
know the control was supposed to prevent it.

Neither system is wrong. Neither has enough context to escalate correctly. The
finding waits for a human who happens to be looking at both, which is a role
that rarely exists.

## Detection is only as good as the definition of normal

There is a second, more technical reason to combine them.

Anomaly detection depends entirely on a model of expected behaviour. Deploy
detection without that model and you get alerts on behaviour that is unusual but
correct — a legitimate seasonal spike, a new supplier, a policy that changed last
quarter. The predictable result is alert fatigue, and alert fatigue does not
degrade a monitoring system gracefully. It disables it, while leaving the
dashboard green.

The model of normal is exactly what process discovery and a control framework
already contain. Building detection on top of them is not integration for its own
sake; it is the only way the detection has a baseline worth measuring against.

## Continuous evidence as a byproduct

The same combination changes the character of audit preparation.

Where controls are mapped to obligations continuously, evidence accumulates as
work happens rather than being reconstructed from email threads in the six weeks
before an audit. The audit trail stops being a report you generate and becomes a
byproduct of the platform being used.

That distinction is what makes it credible to a regulator. Evidence assembled
retrospectively demonstrates that you can assemble evidence. Evidence that
accrued as the work was done demonstrates the control was operating.
