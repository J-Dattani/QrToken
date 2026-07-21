# Phase 2 — Owner Dashboard Completion

*Weeks 9–12 · Pre-scale hardening*

**Goal:** Round out the owner dashboard into the full daily operating system described in the product spec, and get basic analytics live.

**Team needed:** 2 backend, 2 frontend, 1 QA

| Workstream | What gets built | Owner |
|---|---|---|
| Kitchen Queue screen | Large-font, oldest-first token queue optimised for a kitchen-mounted tablet | Frontend |
| Table Sessions | Group ordering by table, slot-by-slot payment status, split-link sending | Frontend + Backend |
| Cash Management screen | Today's cash placed/collected/pending with running total, manual override | Frontend |
| Analytics v1 | Today live view, daily summary, 7-day trend, peak-hour heatmap, item performance | Backend + Frontend |
| Coupons | Merchant-created % / flat discount codes, usage limits and expiry | Backend + Frontend |
| Refunds | Digital refund initiation (full/partial) with Razorpay refund API, status tracking | Backend |
| Settings | Shop profile, payment mode toggle, QR re-download, plan/billing view | Frontend |

## Exit criteria

10 pilot merchants run a full week each with zero unresolved cash discrepancies and dashboard uptime above 99.5%.

## Companion prototype

The `qrtoken-owner-dashboard.html` mockup's **Kitchen Queue**, **Table Sessions**, **Cash Management**, **Refunds**, **Coupons**, **Analytics**, and **Settings** views map directly to this phase's workstreams — including the "mark ready" clearing interaction on the kitchen queue and the collect/reconcile flow in Cash Management.

---
[← Phase 1 — MVP Core](./phase-1-mvp-core.md) · [Plan index](./00-README.md) · [Phase 3 — Super Admin Console →](./phase-3-super-admin.md)
