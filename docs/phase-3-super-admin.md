# Phase 3 — Super Admin Console

*Weeks 13–15 · Launch readiness*

**Goal:** Give you a single control tower: onboard, monitor, bill, and support every merchant on the platform without touching the database directly.

**Team needed:** 1 backend, 1 frontend, 1 QA

| Workstream | What gets built | Owner |
|---|---|---|
| Platform Overview | Live KPIs: total merchants, MRR, today's GMV, active live orders, new signups, uptime status | Frontend + Backend |
| Merchant directory | Searchable table of every merchant — plan, city, status, GMV, join date — with a detail drawer | Frontend + Backend |
| Verification / KYC queue | Review and approve new merchant signups: business proof, bank/UPI details, GST (if applicable) | Backend + Frontend |
| Subscription & billing | Plan assignment, upgrade/downgrade, invoice history, revenue-by-plan breakdown | Backend |
| Platform transactions | Cross-merchant transaction feed, Razorpay settlement status, digital vs cash split | Backend |
| Support ticketing | Ticket queue with merchant context attached, status and priority, internal notes | Frontend + Backend |
| Admin roles & audit log | Support-staff sub-roles with limited access, full audit trail of admin actions | Backend |

## Exit criteria

You can onboard a new merchant, verify their KYC, view platform-wide GMV, and resolve a support ticket — all without an engineer's help.

## Companion prototype

The `qrtoken-super-admin.html` mockup covers all seven workstreams above: **Overview**, **Merchants** (searchable directory with a slide-in detail drawer), **Verification** (approve / request-info queue), **Subscriptions & Billing**, **Transactions**, **Support Tickets**, and **Compliance / Settings**.

---
[← Phase 2 — Owner Dashboard Completion](./phase-2-owner-dashboard.md) · [Plan index](./00-README.md) · [Phase 4 — Growth Features →](./phase-4-growth.md)
