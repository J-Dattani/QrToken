# Phase 0 — Foundation & Architecture

*Weeks 1–2 · Pre-build*

**Goal:** Stand up the technical foundation so every later phase builds on solid ground — no rework later.

**Team needed:** 1 backend engineer, 1 frontend engineer, 1 product/design (can be founder)

| Workstream | What gets built | Owner |
|---|---|---|
| Infrastructure | Cloud project setup (DB, object storage, CDN), staging + production environments, CI/CD pipeline | Backend |
| Database schema | Core tables: merchants, users, roles, menu_items, orders, order_items, tokens, payments, sessions — multi-tenant from the start | Backend |
| Auth & roles | Role-based auth: Super Admin, Merchant Owner, Merchant Staff, Customer (guest, no login required) | Backend |
| Design system | Shared token/component library (colors, type scale, buttons, cards, the token-stub card component) used across all 3 surfaces | Design + Frontend |
| Payments sandbox | Razorpay test account, webhook listener scaffolding, sandbox UPI test flow | Backend |
| QR generation | QR code generator tied to merchant_id (+ optional table_id), downloadable in 3 sizes | Backend |

## Exit criteria

A merchant can be created in the DB, a QR code resolves to a live (empty) menu page, and CI/CD deploys to staging on every push.

---
[← Engineering Principles](./01-engineering-principles.md) · [Plan index](./00-README.md) · [Phase 1 — MVP Core →](./phase-1-mvp-core.md)
