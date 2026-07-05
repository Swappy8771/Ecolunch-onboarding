# 01 — Admin Flow & Scope

The admin portal drives an **8-stage pipeline**. Every caterer goes through the same stages in the same order. Stages can overlap, but **Go-live cannot be approved until all are complete**.

---

## In scope / out of scope

**In scope:** register caterers · configure & price modules · send/track contracts · review & validate every submission · review documents · monitor & approve Go-live · communicate via EcoLoop.

**Out of scope (other products):** day-to-day operations after Go-live, parent ordering, school/daycare admin, accounting/ledger.

---

## The 8 stages

| # | Stage | Owner | What happens | What gets written |
|---|-------|-------|--------------|-------------------|
| 1 | **Register caterer** | Admin | Admin enters company, legal name, NEQ/SIRET, address, verticals, assigned admin | `caterers` (status `onboarding`) · `caterer_onboarding_files` (all sections `not_started`) · 11 × `golive_checklist_items` (all `incomplete`) · a `user` for the caterer · `audit_log` (`created`) |
| 2 | **Configure modules & pricing** | Admin | For each module: status, effective date, monthly price, setup fee, founding-partner flag, discount, rules | `caterer_modules` (the source of truth for contract merge fields) · recompute `modules_configured` + `pricing_configured` |
| 3 | **Send contracts** | Admin | Pick contract type, confirm merge fields from `caterer_modules`, send via Dropbox Sign | `contracts` (status `sent`) · `signature_requests` (with merge-field snapshot) |
| 4 | **Caterer fills their portal** | Caterer (admin monitors) | Caterer submits Profile, Banking, Establishments, Menus | each submit → a `validation_items` row in the admin queue |
| 5 | **Admin validates** | Admin | For each item: approve / reject / request correction | `validation_items.status` · on correction: `corrections` + `ecoloop_tickets` · recompute related checklist items |
| 6 | **Review documents** | Admin | Review every uploaded file across 12 categories; run Smart Import | `documents.status` · `smart_import_jobs/fields` · recompute `documents_approved` |
| 7 | **Go-live check** | Admin | Review the 11-item checklist; resolve blockers | `golive_checklist_items` (auto-evaluated; admin may `waive` with a reason) |
| 8 | **Approve & activate** | Admin | Click **Validate Go-live** — one-way | `caterers.status` → `active` · `go_live_at` → now · all `caterer_modules` → `active` · `golive_status` → `approved` · `audit_log` (`activated`) |

---

## How the stages connect

```
Register ─► Modules & Pricing ─► Contracts (Dropbox Sign)
                   │                    │ caterer signs
                   ▼                    ▼
            (merge fields)     Caterer fills portal ─► Validation Center ◄─ Document Vault
                                        │                     │
                                        │                     ▼
                                        │              Corrections → EcoLoop
                                        ▼
                              Go-live Monitor (checks everything) ─► Activation
```

---

## Status values the admin works with

| Thing | Values |
|-------|--------|
| Caterer | `onboarding` · `active` · `paused` · `archived` |
| Validation item | `pending_review` · `in_review` · `approved` · `rejected` · `correction_requested` · `closed` |
| Document | `uploaded` · `under_review` · `approved` · `rejected` · `correction_requested` · `archived` |
| Go-live item | `complete` · `incomplete` · `blocked` · `waived` |

---

## The 11 Go-live requirements (admin's final checklist)

`account_created` · `profile_validated` · `banking_validated` · `establishments_confirmed` · `menus_validated` · `documents_approved` · `contracts_signed` · `modules_configured` · `pricing_configured` · `corrections_closed` · `ecoloop_blockers_closed`

The system recomputes these automatically after each relevant event; the admin only **approves** once all are `complete` (or explicitly `waived`).

---

## A caterer's "onboarding file" (admin workspace)

When an admin opens a caterer, they get an 11-section workspace. These are **UI groupings over the shared tables**, not new tables: Overview · Profile · Banking · My Clients · Menus · Document Vault · Contracts · Modules & Pricing · Validation & Corrections · Go-live · EcoLoop · Audit.

**Support Access Session:** an admin can view the caterer's portal as a support observer. This is **not** "switch to caterer" — the start and end are logged in `audit_logs` (`support_access_start` / `support_access_end`, `actor_type: support_session`) so every action is traceable.
