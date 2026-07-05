# Admin Onboarding Portal — Backend Reference

The internal EcoLunch tool that onboards caterers. It **sees every caterer** and **drives the whole process** — register → configure → send contracts → review → approve Go-live.

> **Important:** the admin portal uses the **same database** as the caterer portal. There are **no admin-only tables**. The tables/collections are defined once in [`../db-architecture/`](../db-architecture/). This folder describes the admin portal's *behavior*: its screens, its flow, and **what it writes**.

---

## The one principle

**Admin decides, caterer fills.** The caterer can never approve, price, or activate anything. Every decision in onboarding is an admin write:

- Activate & price modules
- Send contracts
- Approve / reject / request correction on every submission
- Approve Go-live (the only path to `active`)
- Write internal notes the caterer never sees

---

## Admin screens (the sidebar)

| Screen | What the admin does |
|--------|---------------------|
| **Dashboard** | KPIs across all caterers; jump to anything that needs attention |
| **Caterers in Onboarding** | The master list; open any caterer's full file; start an audited support session |
| **Validation Center** | The review queue — approve / reject / request correction on every submission |
| **Document Vault** | Review uploaded files; approve / reject; run Smart Import |
| **Contract Management** | Send contracts via Dropbox Sign; track signing |
| **Modules & Pricing** | Turn modules on and set prices (the only place this is written) |
| **Go-live Monitor** | The 11-item checklist; click **Validate Go-live** |
| **EcoLoop** | Chat with the caterer; add admin-only internal notes |
| **Smart Import** | Contextual (not a nav item) — review extracted field values before applying |

---

## Files in this folder

| File | Covers |
|------|--------|
| [01-flow-and-scope.md](./01-flow-and-scope.md) | The 8-stage admin pipeline, what happens (and what's written) at each stage |
| [02-screens-and-tables.md](./02-screens-and-tables.md) | Each admin screen → what it reads and writes → which tables |
| [03-write-ownership.md](./03-write-ownership.md) | Table-by-table: who writes what (Admin / Caterer / System) |
| [04-schema-additions.md](./04-schema-additions.md) | Admin-only fields/enums to add to the shared models + reconciliation notes |

---

## Core rules (same as the caterer side — never break these)

1. **No auto-apply** — Smart Import values need explicit admin confirm/edit/reject.
2. **No binary files in the database** — only Dropbox references.
3. **Signing ≠ activation** — a signed contract just ticks one checklist item.
4. **Go-live is 100% or nothing** — all 11 items complete, and only an admin can approve.
5. **Support sessions are audited** — entering a caterer's portal as support logs `support_access_start` / `support_access_end` in `audit_logs` (it is *not* "switch to caterer").
6. **`internal_note` never reaches the caterer** — admin writes and reads it; the caterer API must never return it.
