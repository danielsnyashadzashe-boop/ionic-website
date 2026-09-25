---
client: Tippa Payment Solutions
title: Cashless tipping for people who were losing income to the decline of coins
engagement: Digital payment platform, mobile app and field rollout
products:
  - Custom platform build
tone: d3
sector: Digital payments
region: South Africa
stage: Production
order: 1
featured: true
summary: >-
  A tipping and payments platform for car guards, live at 10 malls and centres:
  a customer-facing QR flow with no app to download, a wallet app in every
  guard's hand, an operations portal, and automated bank reconciliation.
# PLACEHOLDER. John Arvanitakis has not said this and has not approved it.
# Replace with his own words, or delete both lines, before this site is
# published. `quotePending` makes every build print a warning until it goes.
quote: >-
  They built the platform, then stayed on site until people were actually
  using it. The second part is the one that made the difference.
quotePending: true
quoteAttribution: John Arvanitakis, Tippa Payment Solutions
highlights:
  - label: Sites live
    value: '10'
  - label: Customer setup
    value: None
  - label: Reconciliation
    value: Every 5 min
---

## The problem is arithmetic, not technology

Car guards, CTAs, are paid in coins. Fewer people carry coins every year. The
result is that a CTA earns less each year through no fault of their own, while
a customer who genuinely wants to tip regularly has nothing in their pocket to
give with.

That is the whole of it. There is no behaviour to change on either side. The
willingness is already there and the money simply cannot move.

## What was built

**A tip takes one scan.** Every registered CTA wears a lanyard with a QR card.
The customer scans it with their phone camera and lands on a payment page
showing that CTA's name and photo, so they can see exactly who they are paying.
They choose an amount and pay by card or instant EFT. There is no app to
download, no account to create and no registration. For a payment flow aimed at
a stranger in a car park, anything more than that is a flow nobody completes.

**The CTA sees the money arrive.** Each guard has the app on their own phone,
signing in with a phone number and a six digit code rather than an email
address and a password, because the login has to work for someone who does not
carry an email account around. They can show their QR code full screen if the
lanyard card is not to hand, watch their balance, today's earnings and the
week's, and read a full transaction history with money in and money out
separated.

That immediacy is the part that does the most work. A CTA is not waiting until
the end of the week to find out whether anything came in.

**Payouts are self-service and tracked.** A guard requests a payout from their
balance, from R10 upward in multiples of R10, and follows it through pending,
approved, processing and completed. A rejection shows its reason. A failed
transfer refunds automatically rather than leaving money in limbo. Auto payout
raises the request for them once their balance passes a threshold.

The wallet also buys airtime, electricity tokens and vouchers, which is the
direction the product is heading: somewhere money is used, not only somewhere
it arrives.

## The half that decides whether a site works

The operations portal is where the programme is actually run: registration and
approval, identity documents and passports, banking details, site and manager
assignment, QR generation, bulk card printing for a whole site, balances,
transfers between CTAs, payout actioning, archiving, and reporting that exports
to formatted Excel behind role-gated permissions.

Two details in it are worth naming, because both exist for reasons that only
show up once real people are using the thing.

A **duplicate identity checker** scans every registration, flagging exact
matches in red and near matches up to three digits apart in amber, with the
differing digits highlighted. That catches fraud, but mostly it catches typing
errors, which are far more common and just as damaging.

**Transfers are atomic and paired.** Moving a balance between CTAs writes a
matched debit and credit under a shared reference, and either completes on both
sides or not at all. There is no state in which money exists in one place and
not the other.

Reconciliation runs itself. Every five minutes the system pulls the bank
statement, matches credits to the right CTA and updates balances with nobody
touching it. A sweep of the last fourteen days catches anything that cleared at
the bank but never reflected in the app.

## Software was half the job

The other half is field work, and it is the half that decides whether a site
succeeds. For every new site we load each CTA onto the system, generate and
link QR codes, produce and issue the lanyards, install the app on each guard's
own phone one at a time, and train them individually and on the floor: how to
present the code, how to walk a customer through a tip, how to confirm it
landed, how to request a payout, and what to do when something goes wrong.

Then we stay. Repeat sessions, monitoring whether tips are actually flowing,
working alongside site managers, and handling the practical failures that
decide adoption. A phone that will not install. A lost lanyard. A guard who has
not understood payouts. A customer who scanned and is not sure it worked.

That method is now repeatable enough to take a new site from nothing to trained
and trading in a week.

## What it comes to

A CTA who depended entirely on whether a customer happened to be carrying coins
can now be paid by anyone with a phone, can see what they have earned at any
moment, and can spend it from the same wallet.

Tippa takes a commission on tips, which is how the platform funds itself and is
the one honest disadvantage against a personal eWallet, which is free. We would
rather state that than leave it for someone to find.
