# 11 — Database Schema

---

## Design Philosophy

The schema is designed to be the **shared foundation** for all portals — current and future. Every table is tagged with which portals use it so developers can see cross-portal data dependencies before making changes.

Portal tags:
- **Admin** — EcoLunch Admin Onboarding Portal (current)
- **Caterer** — Caterer Portal (current / parallel build)
- **School** — School Portal (future)
- **Daycare** — Daycare Portal (future)
- **Parent** — Parent Portal (future)

---

## Table Overview

| Table | Portals | Purpose |
|-------|---------|---------|
| `users` | All | Authentication and role management for all portal users |
| `caterers` | Admin, Caterer, School (future) | Central caterer record — tenant root |
| `caterer_onboarding_files` | Admin, Caterer | Per-caterer onboarding progress tracker |
| `documents` | Admin, Caterer | Document metadata — Dropbox refs only, no binary files |
| `contracts` | Admin, Caterer | Contract lifecycle — type, status, Dropbox Sign refs |
| `signature_requests` | Admin | Per-signer Dropbox Sign request detail |
| `modules` | All | Global module registry |
| `caterer_modules` | Admin, Caterer, School (future) | Per-caterer module activation + pricing + config |
| `validation_items` | Admin, Caterer | Admin review queue items |
| `corrections` | Admin, Caterer | Correction requests linked to validation items |
| `golive_checklist_items` | Admin | 11-item go-live readiness tracker per caterer |
| `ecoloop_tickets` | Admin, Caterer | Support/communication tickets |
| `ecoloop_messages` | Admin, Caterer | Individual messages in ticket threads |
| `smart_import_jobs` | Admin, Caterer | Smart Import processing jobs |
| `smart_import_fields` | Admin, Caterer | Individual extracted field proposals |
| `establishments` | Admin, Caterer, School (future), Daycare (future) | Schools, daycares, camps, CSS districts |
| `menus` | Admin, Caterer, School (future), Parent (future) | Menu records per caterer/establishment |
| `audit_logs` | All | Immutable event log for all portal actions |

---

## Table Definitions

---

### `users`
Portals: **All**

One row per person with portal access. Role determines which portal(s) they can access and what they can see.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `email` | varchar | Unique |
| `role` | enum | `admin`, `caterer_admin`, `caterer_staff`, `school`, `daycare`, `parent`, `support` |
| `caterer_id` | uuid | FK → caterers. NULL for admin and support users |
| `first_name` | varchar | |
| `last_name` | varchar | |
| `phone` | varchar | |
| `status` | enum | `active`, `inactive`, `suspended` |
| `last_login_at` | timestamptz | |
| `created_at` | timestamptz | |

**Key relationship:** `caterer_id` is the link that scopes all caterer-role users to their specific caterer's data. A `caterer_admin` user can only see data where `caterer_id` matches their own.

---

### `caterers`
Portals: **Admin**, **Caterer**, **School** (future)

The central tenant record. Every other table that is caterer-specific references this table via `caterer_id`. This is the tenant root.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK — central tenant ID |
| `company_name` | varchar | |
| `legal_name` | varchar | |
| `trading_name` | varchar | |
| `status` | enum | `onboarding`, `active`, `paused`, `archived` |
| `phase` | int | 1 or 2 — onboarding phase |
| `verticals` | jsonb | e.g. `["school","daycare","css"]` |
| `assigned_admin_id` | uuid | FK → users |
| `onboarding_progress_pct` | int | Computed from section statuses |
| `address` | varchar | |
| `neq_number` | varchar | NEQ (Quebec) or SIRET (France) |
| `go_live_at` | timestamptz | NULL until go-live approved |

---

### `caterer_onboarding_files`
Portals: **Admin**, **Caterer**

One row per caterer. Tracks the status of each section in the onboarding file. This is what drives the overall progress percentage.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `profile_status` | enum | `not_started`, `in_progress`, `validated` |
| `banking_status` | enum | Same pattern |
| `establishments_status` | enum | Same pattern |
| `menus_status` | enum | Same pattern |
| `documents_status` | enum | Same pattern |
| `contracts_status` | enum | Same pattern |
| `modules_status` | enum | Same pattern |
| `golive_status` | enum | `not_ready`, `ready`, `approved`, `blocked` |
| `admin_notes` | text | Internal only — caterer never sees this |

---

### `documents`
Portals: **Admin**, **Caterer**

All document metadata. Binary files are in Dropbox — this table only holds references.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `dropbox_file_id` | varchar | Unique — Dropbox's file identifier |
| `dropbox_file_path` | varchar | Path in Dropbox Storage |
| `category` | enum | `profile`, `legal`, `banking`, `compliance`, `insurance`, `establishments`, `menus`, `modules`, `contracts`, `golive`, `internal` |
| `source` | enum | `admin_upload`, `caterer_upload`, `smart_import`, `contract_signed` |
| `status` | enum | `uploaded`, `under_review`, `approved`, `rejected`, `correction_requested`, `archived` |
| `version` | int | Default 1 |
| `version_of` | uuid | FK → documents (self-referencing — points to original) |
| `uploaded_by` | uuid | FK → users |
| `linked_validation_item_id` | uuid | FK → validation_items |
| `smart_import_job_id` | uuid | FK → smart_import_jobs |
| `visibility` | enum | `internal` (admin only), `client_visible` |

---

### `contracts`
Portals: **Admin**, **Caterer**

One row per contract per caterer. Tracks the full lifecycle from draft to signed.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `type` | enum | `msa`, `nda`, `dpa`, `platform_terms`, `food_safety`, `module_annex`, `fee_schedule` |
| `template_id` | varchar | Dropbox Sign template_id — from application config |
| `status` | enum | `draft`, `ready_to_send`, `sent`, `viewed`, `partially_signed`, `signed`, `declined`, `expired`, `cancelled`, `error` |
| `version` | int | For reissued contracts |
| `sent_at` | timestamptz | |
| `signed_at` | timestamptz | |
| `dropbox_sign_request_id` | varchar | Unique — from Dropbox Sign API response |
| `signed_document_id` | uuid | FK → documents — the signed PDF |
| `audit_trail_document_id` | uuid | FK → documents — Dropbox Sign audit trail PDF |
| `linked_modules` | jsonb | Array of caterer_module IDs for module annexes |

---

### `signature_requests`
Portals: **Admin**

One row per signer per contract. Stores Dropbox Sign request details and merge field values at time of sending.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `contract_id` | uuid | FK → contracts |
| `caterer_id` | uuid | FK → caterers |
| `dropbox_sign_request_id` | varchar | Unique — from Dropbox Sign |
| `signer_name` | varchar | |
| `signer_email` | varchar | |
| `status` | enum | `sent`, `viewed`, `signed`, `declined`, `expired`, `cancelled`, `error` |
| `merge_fields` | jsonb | Snapshot of merge field values used — `client_name`, `monthly_rate`, `start_date`, etc. |
| `sent_at` | timestamptz | |
| `signed_at` | timestamptz | |

---

### `modules`
Portals: **All**

Global registry of all available modules. Records here do not change per caterer — they define what modules exist.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `key` | varchar | Unique — `school_meals`, `daycare_cpe`, `camp_meals`, `reportiq`, `accounting`, `parent_subscriptions`, `css_reporting` |
| `name` | varchar | Display name |
| `type` | enum | `commercial`, `infrastructure` |
| `is_active` | bool | Globally available for activation |

---

### `caterer_modules`
Portals: **Admin**, **Caterer**, **School** (future)

One row per module per caterer. Stores activation status, pricing, and all operational config. This is the table that contract merge fields are read from.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `module_id` | uuid | FK → modules |
| `status` | enum | `active`, `inactive`, `pending` |
| `effective_date` | date | When the module becomes live |
| `monthly_price_cents` | int | In cents to avoid floating point issues |
| `setup_fee_cents` | int | |
| `founding_partner_free` | bool | If true, module is free permanently |
| `discount_pct` | decimal | |
| `cutoff_rules` | jsonb | Order cutoff logic |
| `payout_rules` | jsonb | Payout timing and rules |
| `credit_rules` | jsonb | Absence credit logic (daycares) |
| `notification_settings` | jsonb | |
| `report_settings` | jsonb | |
| `configured_by` | uuid | FK → users |

---

### `validation_items`
Portals: **Admin**, **Caterer**

The admin's review queue. One row per submission that needs review.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `type` | enum | `profile`, `banking`, `document`, `contract`, `menu`, `module`, `pricing`, `establishment`, `golive` |
| `priority` | enum | `critical`, `high`, `medium`, `low` |
| `status` | enum | `pending_review`, `in_review`, `approved`, `rejected`, `correction_requested`, `closed` |
| `section` | varchar | Which onboarding section this came from |
| `data_snapshot` | jsonb | The submitted values at the time of review |
| `linked_document_id` | uuid | FK → documents |
| `smart_import_job_id` | uuid | FK → smart_import_jobs |
| `reviewed_by` | uuid | FK → users |
| `internal_notes` | text | Admin-only |

---

### `corrections`
Portals: **Admin**, **Caterer**

Tracks correction requests from admin to caterer. Each correction is linked to a validation item and an EcoLoop ticket.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `validation_item_id` | uuid | FK → validation_items |
| `description` | text | What needs to be fixed |
| `section` | varchar | Which section to fix it in |
| `priority` | enum | `high`, `medium`, `low` |
| `status` | enum | `open`, `in_progress`, `resolved`, `closed` |
| `assigned_to` | uuid | FK → users |
| `ecoloop_ticket_id` | uuid | FK → ecoloop_tickets |
| `resolved_at` | timestamptz | |

---

### `golive_checklist_items`
Portals: **Admin**

One row per requirement per caterer. 11 rows per caterer (one per checklist item). System keeps these updated automatically.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `requirement` | enum | `account_created`, `profile_validated`, `banking_validated`, `establishments_confirmed`, `menus_validated`, `documents_approved`, `contracts_signed`, `modules_configured`, `pricing_configured`, `corrections_closed`, `ecoloop_blockers_closed` |
| `status` | enum | `complete`, `incomplete`, `blocked`, `waived` |
| `blocking_reason` | text | NULL if complete |
| `linked_entity_type` | varchar | Polymorphic — what entity caused this status |
| `linked_entity_id` | uuid | Polymorphic — ID of that entity |
| `checked_by` | uuid | FK → users — NULL if system-evaluated |
| `checked_at` | timestamptz | |

---

### `ecoloop_tickets`
Portals: **Admin**, **Caterer**

One row per ticket. Tickets can be linked to items in any other section.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `subject` | varchar | |
| `status` | enum | `open`, `pending`, `resolved`, `closed` |
| `priority` | enum | `high`, `medium`, `low` |
| `type` | enum | `correction_request`, `validation_followup`, `general`, `contract`, `document` |
| `assigned_to` | uuid | FK → users |
| `linked_validation_item_id` | uuid | FK → validation_items |
| `linked_document_id` | uuid | FK → documents |
| `linked_contract_id` | uuid | FK → contracts |
| `unread_count_admin` | int | |
| `unread_count_client` | int | |

---

### `ecoloop_messages`
Portals: **Admin**, **Caterer**

Individual messages within a ticket thread.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `ticket_id` | uuid | FK → ecoloop_tickets |
| `sender_id` | uuid | FK → users |
| `body` | text | Message content |
| `type` | enum | `admin_to_client`, `client_to_admin`, `internal_note`, `system_action` |
| `linked_document_id` | uuid | FK → documents — optional attachment |
| `read_at` | timestamptz | NULL = unread |
| `created_at` | timestamptz | |

---

### `smart_import_jobs`
Portals: **Admin**, **Caterer**

One row per Smart Import session initiated.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `section` | enum | `profile`, `banking`, `establishments`, `menus`, `documents` |
| `source_document_id` | uuid | FK → documents |
| `detected_doc_type` | varchar | e.g. `void_cheque`, `menu_pdf`, `school_list` |
| `status` | enum | See Section 10 for full list |
| `confirmed_by` | uuid | FK → users |
| `confirmed_at` | timestamptz | |
| `applied_at` | timestamptz | |

---

### `smart_import_fields`
Portals: **Admin**, **Caterer**

One row per extracted field per job. This is where individual field proposals and decisions are stored.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `job_id` | uuid | FK → smart_import_jobs |
| `field_name` | varchar | Target EcoLunch field name |
| `detected_value` | text | Raw extracted value from document |
| `mapped_value` | text | After fuzzy matching and formatting |
| `confidence_score` | decimal | 0.00 to 1.00 |
| `status` | enum | See Section 10 for full list |
| `applied_value` | text | Final value after human confirm/edit |
| `edited_by` | uuid | FK → users |

---

### `establishments`
Portals: **Admin**, **Caterer**, **School** (future), **Daycare** (future)

Schools, daycares, camps, and CSS districts linked to a caterer. Future-proofed to become the master entity for School and Daycare portals.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `type` | enum | `school`, `daycare`, `camp`, `css` |
| `name` | varchar | |
| `address` | varchar | |
| `city` | varchar | |
| `contact_name` | varchar | |
| `contact_email` | varchar | |
| `student_count` | int | |
| `css_id` | uuid | FK → establishments (self-ref) — links school to its CSS district |
| `status` | enum | `pending`, `confirmed`, `inactive` |

---

### `menus`
Portals: **Admin**, **Caterer**, **School** (future), **Parent** (future)

Menus per caterer, optionally scoped to a specific establishment.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `establishment_id` | uuid | FK → establishments — NULL means applies to all |
| `type` | enum | `school`, `daycare`, `camp`, `rotating_cycle`, `common_meals` |
| `name` | varchar | |
| `status` | enum | `draft`, `submitted`, `under_review`, `validated`, `rejected` |
| `smart_import_job_id` | uuid | FK → smart_import_jobs — if imported |

---

### `audit_logs`
Portals: **All**

Immutable. Every significant action across all portals is logged here. Rows are never updated or deleted.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `entity_type` | varchar | What was acted on: `caterer`, `document`, `contract`, `validation_item`, `correction`, `caterer_module`, `golive_checklist`, `ecoloop_ticket`, `smart_import_job`, `user` |
| `entity_id` | uuid | ID of the acted-on entity |
| `actor_id` | uuid | FK → users — NULL if system |
| `actor_type` | enum | `admin`, `caterer_staff`, `system`, `support_session` |
| `action` | varchar | `created`, `updated`, `approved`, `rejected`, `sent`, `signed`, `applied`, `activated`, `support_access_start`, `support_access_end` |
| `old_value` | jsonb | State before the action |
| `new_value` | jsonb | State after the action |
| `ip_address` | inet | Request IP |
| `created_at` | timestamptz | Never update this row |

**Critical:** `actor_type: support_session` marks every action taken while an admin was in a support access session. This is how disputes about "who did what" are resolved.
