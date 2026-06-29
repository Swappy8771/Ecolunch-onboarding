# Data Relationships (ERD) — How the Models Connect

This is the single map of how every model relates to every other model: which table points at which, and whether it's one-to-one, one-to-many, or many-to-many.

> **Status:** Fields and per-model relationships are defined in each file under [`models/`](./models/). This page consolidates the relations into one view. A few relationships marked **(pending)** depend on answers in [`../OPEN-DESIGN-DOUBTS.md`](../OPEN-DESIGN-DOUBTS.md).

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `1 ── 1` | **One-to-one** — each side has exactly one of the other |
| `1 ──< N` | **One-to-many** — the `1` side has many on the `N` side |
| `N >──< N` | **Many-to-many** — both sides can have many |
| `(embedded)` | Stored *inside* the parent document, not a separate table |
| `⇄ CROSS-DB` | The two records live in **different databases** (link is app-enforced, no FK) |
| `(pending)` | Cardinality not finalized — see Open Design Doubts |

---

## The big picture — everything hangs off the Caterer

```
                                  ┌───────────────┐
                                  │    CATERER     │   (the hub)
                                  └───────┬───────┘
                                          │ caterer_id is on every model below
   ┌──────────┬──────────┬──────────┬────┴─────┬──────────┬───────────┬──────────┐
   │          │          │          │          │          │           │          │
 1──1       1──1       1──<N      1──<N      1──<N      1──<N       1──<N      1──<N
   │          │          │          │          │          │           │          │
BANKING   ONBOARDING   USERS   ESTABLISH-   MENUS     DOCUMENTS   CONTRACTS  CATERER_
(Postgres) FILE                 MENTS                                        MODULES
   ⇄                                │            │           │                   │
   │ 1──<N (3 doc refs)             │            │           │ N──1              │ N──1
   └──────────────────────────────►│            │           ▼                   ▼
                                    │            │       (signed PDF)         MODULE
                              (closures,      (dishes,    DOCUMENT          (catalogue)
                               schedule)      allergens)
```

Plus the workflow models (also all `caterer_id`-scoped): **validation_items**, **corrections**, **golive_checklist_items**, **ecoloop_tickets/messages**, **smart_import_jobs**, **report_schedules**, **audit_logs**.

---

## Full relationship reference

### A. Caterer → everything (the hub)

| From | To | Type | Linking field |
|------|----|------|---------------|
| caterer | banking | `1 ── 1` ⇄ CROSS-DB | `caterer_banking.caterer_id` |
| caterer | onboarding_file | `1 ── 1` | `caterer_onboarding_files.caterer_id` |
| caterer | users | `1 ──< N` | `users.caterer_id` |
| caterer | establishments | `1 ──< N` | `establishments.caterer_id` |
| caterer | closures | `1 ──< N` | `closures.caterer_id` |
| caterer | menus | `1 ──< N` | `menus.caterer_id` |
| caterer | dishes | `1 ──< N` | `dishes.caterer_id` |
| caterer | documents | `1 ──< N` | `documents.caterer_id` |
| caterer | contracts | `1 ──< N` | `contracts.caterer_id` |
| caterer | caterer_modules | `1 ──< N` | `caterer_modules.caterer_id` |
| caterer | validation_items | `1 ──< N` | `validation_items.caterer_id` |
| caterer | corrections | `1 ──< N` | `corrections.caterer_id` |
| caterer | golive_checklist_items | `1 ──< N` | `golive_checklist_items.caterer_id` |
| caterer | ecoloop_tickets | `1 ──< N` | `ecoloop_tickets.caterer_id` |
| caterer | smart_import_jobs | `1 ──< N` | `smart_import_jobs.caterer_id` |
| caterer | report_schedules | `1 ──< N` | `report_schedules.caterer_id` |
| caterer | audit_logs | `1 ──< N` | `audit_logs.caterer_id` |

### B. Establishments & menus

| From | To | Type | Linking field |
|------|----|------|---------------|
| establishment (school) | establishment (css) | `N ──1` (self-reference) | `establishments.css_district_id` |
| establishment | closures | `1 ──< N` | `closures.establishment_id` |
| establishment | menus | `N >──< N` **(pending)** | `menus.establishment_id` (single today; may become a list) |
| menu | schedule entries | `1 ──< N` (embedded) | inside `menus.schedule[]` |
| schedule entry | dish | `N ──1` | `menus.schedule[].dish_id` |
| dish | allergens | `1 ──< N` (embedded) | inside `dishes.allergens[]` |
| menu | smart_import_job | `N ──1` | `menus.smart_import_job_id` |

### C. Documents, contracts, banking

| From | To | Type | Linking field |
|------|----|------|---------------|
| document | document (older version) | `N ──1` (self-reference) | `documents.version_of` |
| document | smart_import_job | `N ──1` | `documents.smart_import_job_id` |
| banking | documents (RIB, statement, auth letter) | `1 ──< N` (3 refs) ⇄ CROSS-DB | `caterer_banking.rib_document_id`, `bank_statement_doc_id`, `authorization_letter_id` |
| contract | signature_requests | `1 ──< N` (embedded) | inside `contracts.signature_requests[]` |
| contract | document (signed PDF) | `N ──1` | `contracts.signed_document_id` |
| contract | document (audit trail) | `N ──1` | `contracts.audit_trail_document_id` |
| contract | modules | references list | `contracts.linked_modules[]` |

### D. Modules

| From | To | Type | Linking field |
|------|----|------|---------------|
| caterer_module | module (catalogue) | `N ──1` | `caterer_modules.module_id` |

### E. Workflow (validation, corrections, go-live, chat, import)

| From | To | Type | Linking field |
|------|----|------|---------------|
| validation_item | document | `N ──1` | `validation_items.linked_document_id` |
| validation_item | smart_import_job | `N ──1` | `validation_items.smart_import_job_id` |
| validation_item | banking row (Postgres) | `N ──1` ⇄ CROSS-DB | `validation_items.source_record_id` (when `source_db = postgres`) |
| correction | validation_item | `N ──1` | `corrections.validation_item_id` |
| correction | ecoloop_ticket | `1 ── 1` | `corrections.ecoloop_ticket_id` |
| golive_checklist_item | (correction / ecoloop_ticket / …) | `N ──1` polymorphic | `golive_checklist_items.linked_entity_type` + `linked_entity_id` |
| ecoloop_ticket | ecoloop_messages | `1 ──< N` | `ecoloop_messages.ticket_id` |
| ecoloop_ticket | validation_item / document / contract / smart_import_job | `N ──1` each | `ecoloop_tickets.linked_*_id` |
| ecoloop_message | document | `N ──1` | `ecoloop_messages.linked_document_id` |
| smart_import_job | fields | `1 ──< N` (embedded) | inside `smart_import_jobs.fields[]` |
| smart_import_job | document (source) | `N ──1` | `smart_import_jobs.source_document_id` |
| audit_log | (any model) | `N ──1` polymorphic | `audit_logs.entity_type` + `entity_id` |

---

## Cross-database relationships (the only links that span two databases)

Because Banking is in PostgreSQL and everything else is in MongoDB, these few links cannot use a normal foreign key — the application checks them instead:

| From (database) | To (database) | Linking field | Checked by |
|-----------------|---------------|---------------|------------|
| `caterer_banking` (Postgres) | `caterers` (Mongo) | `caterer_id` | Banking service confirms the caterer exists |
| `caterer_banking` (Postgres) | `documents` (Mongo) ×3 | the 3 `*_document_id` fields | Banking service confirms each doc is the same caterer + category "banking" |
| `validation_items` (Mongo) | `caterer_banking` (Postgres) | `source_record_id` | Set by the outbox relay when banking is submitted |

Everything else is within a single database, so normal references apply.

---

## What's still open (affects a few relations)

| Relationship | Open question | Where |
|--------------|---------------|-------|
| menu ↔ establishment | One, many, or all? (currently single `establishment_id`) | Doubt #6 |
| package vs menu | Is a "package" a menu row or its own model? | Doubt #7 |
| common meal vs dish | Are common meals just dishes? | Doubt #8 |
| closure file vs rows | File only, structured rows, or both? | Doubt #9 |

Once these four are confirmed (see [`../OPEN-DESIGN-DOUBTS.md`](../OPEN-DESIGN-DOUBTS.md)), the relational map is final.

---

## Quick answer: is the architecture done?

| Piece | Status |
|-------|--------|
| Fields per model (type, required, meaning) | ✅ Done — see each `models/*.md` |
| Enums / statuses explained | ✅ Done |
| Indexes | ✅ Done |
| Relationships (this map) | ✅ Done — pending 4 cardinality confirmations above |
| Canonical field reconciliation (names, banking columns) | ⏳ Waiting on Doubt #3 |
| Visual ER diagram (image) | ◻️ Optional — can generate if you want a picture |
