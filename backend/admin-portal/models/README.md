# Admin Portal — Model Files (canonical schema)

One file per table, written from the **admin's side**, using the **canonical field names and enums verbatim from `docs/admin-portal/11-database-schema.md`** (the doc the schema calls "the shared foundation for all portals").

> These are the **same shared tables** the caterer portal uses — there is no separate admin database. The caterer-side model docs live in [`../../db-architecture/models/`](../../db-architecture/models/) and describe the caterer's lens; these describe the admin's lens and the full canonical field set.

---

## Table inventory (19)

| # | Table | Storage | Admin screen |
|---|-------|---------|--------------|
| 1 | [user](./user.md) | MongoDB | Header · EcoLoop |
| 2 | [caterer](./caterer.md) | MongoDB | Dashboard · Caterers list |
| 3 | [caterer_banking](./caterer-banking.md) ★ | **PostgreSQL** | Caterer → Banking · Validation Center |
| 4 | [caterer_onboarding_files](./onboarding-file.md) | MongoDB | Caterers list · Go-Live Monitor |
| 5 | [establishments](./establishment.md) | MongoDB | Caterer → My Clients · Validation Center |
| 6 | [menus](./menu.md) | MongoDB | Caterer → Menus · Validation Center |
| 7 | [caterer_modules / modules](./module.md) | MongoDB | Modules & Pricing |
| 8 | [documents](./document.md) | MongoDB | Document Vault |
| 9 | [contracts / signature_requests](./contract.md) | MongoDB | Contract Management |
| 10 | [validation_items](./validation-item.md) | MongoDB | Validation Center |
| 11 | [corrections](./correction.md) | MongoDB | Validation Center · EcoLoop |
| 12 | [golive_checklist_items](./golive-checklist.md) | MongoDB | Go-Live Monitor |
| 13 | [ecoloop_tickets / ecoloop_messages](./ecoloop.md) | MongoDB | EcoLoop |
| 14 | [smart_import_jobs / smart_import_fields](./smart-import.md) | MongoDB | Document Vault · Validation Center |
| 15 | [audit_logs](./audit-log.md) | MongoDB | Audit trails |

---

## ⚠️ Reconciliation — issues found vs the caterer-side models

The recheck of `docs/admin-portal/` found these mismatches between the **canonical admin schema** and the earlier **caterer-side models** in `db-architecture/models/`. Each needs one agreed value (most are simple naming/enum fixes). These admin model files use the **canonical (admin-doc)** value.

| # | Table.field | Canonical (admin doc 11) | Caterer-side model had | Action |
|---|-------------|--------------------------|------------------------|--------|
| 1 | `signature_requests` | **separate table** (one row per signer, FK `contract_id`) | embedded array inside `contracts` | Decide: separate collection vs embedded (Mongo can do either) |
| 2 | `establishments.status` | `pending` / `confirmed` / **`inactive`** | `pending` / `confirmed` / `active` | Align enum |
| 3 | `establishments` self-ref | **`css_id`** | `css_district_id` | Rename to one |
| 4 | banking SWIFT field | **`swift_bic`** | `bic_swift` | Rename to one |
| 5 | `menus.type` | adds **`rotating_cycle`, `common_meals`** | only school/daycare/camp | Adopt full set (resolves the "packages/common meals" doubt) |
| 6 | `caterer_modules.status` | adds **`pending`** | active/inactive | Add `pending` |
| 7 | `caterer_onboarding_files.golive_status` | adds **`blocked`** | not_ready/ready/approved | Add `blocked` |
| 8 | `documents.category` | adds **`internal`** | base + module categories | Add `internal` |
| 9 | `contracts.status` | adds **`cancelled`, `error`**; + `template_id` | shorter set | Adopt full set + field |
| 10 | `caterers` address/tax | **flat** `address`, `neq_number` + `onboarding_progress_pct` | nested `address{}`, `tax{}` | Decide shape (ties to Doubt #3) |
| 11 | `audit_logs.actor_type` | `caterer_staff` | `caterer` | Use one label |
| 12 | section status enum | doc 11 lists only `not_started/in_progress/validated` | fuller set incl. `submitted/under_review/action_required` | Keep fuller operational set; doc 11 abbreviates |
| 13 | granularity | doc 11 has **no** `closures`, `dishes`, `report_schedules` as separate tables | caterer docs (14/15) add them | Keep them (real) — doc 11 simplifies |

> These are listed in `../OPEN-DESIGN-DOUBTS.md` territory — they're spec inconsistencies, not code bugs yet. The admin models below use the canonical admin-doc value so the admin side is internally consistent.

---

## Core rules (admin)

1. **Admin sees all caterers** — queries are not scoped to one `caterer_id`.
2. **No auto-apply · no binary in DB · signing ≠ activation · go-live 100% · support sessions audited · `internal_note` hidden from caterer.**
