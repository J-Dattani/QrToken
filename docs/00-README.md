# QRToken.in — Phase-Wise Development Plan

**Engineering execution roadmap — from repo #1 to a 2-million-merchant platform**

Covers: Super Admin Console · Restaurant Owner Dashboard · Customer Ordering Website

v1.0 · July 2026 · Confidential

---

## How this plan is structured

This plan turns the QRToken.in product roadmap into buildable engineering phases. Every phase file lists the workstreams, what gets built in each, who owns it, and the exit criteria that decide whether the team moves to the next phase. It covers all three surfaces the platform needs from day one:

- **Super Admin Console** — the control tower over every merchant, subscription, and rupee moving through the platform
- **Restaurant Owner Dashboard** — the day-to-day operating screen for tea stalls, dhabas, and restaurants
- **Customer Ordering Website** — the scan-to-pay experience a diner sees on their own phone

Phases 0–3 are the build-from-zero MVP (roughly the first 90 days). Phases 4–6 track the business roadmap's Growth, Scale, and Ecosystem stages already defined in the master documentation, translated into engineering terms.

## Files in this plan

| File | Phase | Duration | Merchant target |
|---|---|---|---|
| [`01-engineering-principles.md`](./01-engineering-principles.md) | — | — | Principles that hold across every phase |
| [`phase-0-foundation.md`](./phase-0-foundation.md) | Phase 0 — Foundation & Architecture | Weeks 1–2 | 0 |
| [`phase-1-mvp-core.md`](./phase-1-mvp-core.md) | Phase 1 — MVP Core: Order → Pay → Token | Weeks 3–8 | First pilot merchant |
| [`phase-2-owner-dashboard.md`](./phase-2-owner-dashboard.md) | Phase 2 — Owner Dashboard Completion | Weeks 9–12 | 10 pilots |
| [`phase-3-super-admin.md`](./phase-3-super-admin.md) | Phase 3 — Super Admin Console | Weeks 13–15 | Launch-ready |
| [`phase-4-growth.md`](./phase-4-growth.md) | Phase 4 — Growth Features | Months 4–9 | 3,000 |
| [`phase-5-scale.md`](./phase-5-scale.md) | Phase 5 — Scale Features | Months 10–24 | 15,000 |
| [`phase-6-ecosystem.md`](./phase-6-ecosystem.md) | Phase 6 — Ecosystem | 24+ months | 2,000,000 (vision) |
| [`delivery-timeline.md`](./delivery-timeline.md) | — | — | Full timeline at a glance |
| [`companion-ui-mockups.md`](./companion-ui-mockups.md) | — | — | What ships alongside each phase |

## Delivery timeline at a glance

| Phase | Duration | Merchant target | Headline outcome |
|---|---|---|---|
| Phase 0 | Weeks 1–2 | 0 | Architecture + design system live |
| Phase 1 | Weeks 3–8 | First pilot merchant | End-to-end order → pay → token works |
| Phase 2 | Weeks 9–12 | 10 pilots | Full owner dashboard + analytics v1 |
| Phase 3 | Weeks 13–15 | Launch-ready | Super Admin console live — public launch |
| Phase 4 | Months 4–9 | 3,000 | Bill split, table QR, loyalty, KDS, mobile app |
| Phase 5 | Months 10–24 | 15,000 | Inventory, GST, AI forecasting, B2B API |
| Phase 6 | 24+ months | 2,000,000 (vision) | Wallet, white-label, franchise, ecosystem |
