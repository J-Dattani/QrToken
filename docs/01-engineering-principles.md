# 01 · Engineering Principles

These principles hold across every phase of the plan — they are the guardrails that keep three surfaces (Admin, Owner, Customer) feeling like one product as the team scales from 1 merchant to 2 million.

- **Mobile-first, browser-only.** No app download for customers, ever. Owner and Admin can be responsive web first, native later.
- **Cash and Digital are equal, first-class order types** from the very first sprint — not digital-then-cash-later.
- **Every screen ships with its empty state and its error state**, not just the happy path.
- **One design system, three surfaces.** Admin, Owner, and Customer share tokens, components, and a component library so the platform feels like one product.
- **Multi-tenant from day one.** Every table, every query is scoped by `merchant_id`, even in the MVP, to avoid a costly re-architecture at Phase 3.

---
[← Back to plan index](./00-README.md) · [Next: Phase 0 — Foundation & Architecture →](./phase-0-foundation.md)
