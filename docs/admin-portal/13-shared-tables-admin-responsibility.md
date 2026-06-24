# 13 — Shared Tables: Admin Portal UI Reference

---

## Purpose

This document maps every shared table to the **admin portal screen** where it appears.
For each table: which screen uses it, what the screen shows, and which fields the admin portal reads or writes.

Caterer portal screen mapping is excluded — we do not have complete knowledge of the caterer portal UI.

---

## 1. `users`

**Admin Screen:** Top navigation bar (all screens) · EcoLoop message thread

What the admin portal shows:
- Logged-in admin name and role in the header
- Message sender name per message in EcoLoop thread

Admin fields used: `email`, `first_name`, `last_name`, `role`, `status`

---

## 2. `caterers`

**Admin Screen:** Dashboard · Caterers in Onboarding

What the admin portal shows:
- Dashboard: caterer cards with company name, status badge, onboarding progress %, assigned admin
- Caterers list: table rows with name, phase, current status, go-live date

Admin fields used: `company_name`, `trading_name`, `status`, `phase`, `onboarding_progress_pct`, `assigned_admin_id`, `go_live_at`

---

## 3. `caterer_banking`

**Admin Screen:** Caterer detail → Banking section · Validation Center

What the admin portal shows:
- Banking section: all banking fields with per-field validation status badges
- Validation Center: banking validation item in the review queue when caterer submits

Admin fields used: `bank_name`, `branch_name`, `swift_bic`, `iban`, `account_holder`, `account_type`, `currency`, `code_etablissement`, `code_guichet`, `cle_rib`, `sepa_compliant`, `validation_status`

---

## 4. `caterer_onboarding_files`

**Admin Screen:** Caterers in Onboarding · Go-Live Monitor

What the admin portal shows:
- Caterers list: per-section completion badges on each caterer row (Profile ✓, Banking ⚠, etc.)
- Go-Live Monitor: `golive_status` drives the readiness indicator per caterer

Admin fields used: `profile_status`, `banking_status`, `establishments_status`, `menus_status`, `documents_status`, `contracts_status`, `modules_status`, `golive_status`, `admin_notes`

---

## 5. `establishments`

**Admin Screen:** Caterer detail → My Clients section · Validation Center

What the admin portal shows:
- My Clients: list of schools and daycares linked to the caterer — name, type, student count, contact
- Validation Center: establishment validation item when caterer submits a new establishment

Admin fields used: `name`, `type`, `status`, `student_count`, `contact_name`, `contact_email`, `address`, `city`, `css_id`

---

## 6. `menus`

**Admin Screen:** Caterer detail → Menus & Packages · Validation Center

What the admin portal shows:
- Menus & Packages: menu list with name, type, status — admin validates or rejects
- Validation Center: menu validation item in the review queue

Admin fields used: `name`, `type`, `status`, `establishment_id`, `smart_import_job_id`

---

## 7. `caterer_modules`

**Admin Screen:** Modules & Pricing · Modules Config

What the admin portal shows:
- Modules & Pricing: module cards with activation toggle, monthly price, effective date
- Modules Config: detailed config screens — cutoff rules, payout rules, credit rules, founding partner flag

Admin fields used: `module_id`, `status`, `effective_date`, `monthly_price_cents`, `setup_fee_cents`, `founding_partner_free`, `discount_pct`, `cutoff_rules`, `payout_rules`, `credit_rules`, `configured_by`

---

## 8. `modules`

**Admin Screen:** Modules & Pricing

What the admin portal shows:
- Module names and types in the activation panel for selection

Admin fields used: `key`, `name`, `type`, `is_active`

---

## 9. `documents`

**Admin Screen:** Document Vault · Caterer detail (any section)

What the admin portal shows:
- Document Vault: full document table — all categories, status, source, visibility toggle, version
- Caterer detail sections: section-linked documents with review status

Admin fields used: `category`, `status`, `source`, `visibility`, `dropbox_file_id`, `dropbox_file_path`, `version`, `uploaded_by`, `linked_validation_item_id`, `smart_import_job_id`

---

## 10. `contracts`

**Admin Screen:** Contract Management

What the admin portal shows:
- Contract table: all contracts per caterer — type, status, sent date, signed date
- Send Wizard: create contract, select template, set merge fields from `caterer_modules`, send via Dropbox Sign

Admin fields used: `type`, `template_id`, `status`, `version`, `sent_at`, `signed_at`, `dropbox_sign_request_id`, `signed_document_id`, `audit_trail_document_id`, `linked_modules`

---

## 11. `signature_requests`

**Admin Screen:** Contract Management → contract detail

What the admin portal shows:
- Per-signer status alongside the contract record
- Merge field snapshot at time of sending (what values were used when contract was sent)

Admin fields used: `signer_name`, `signer_email`, `status`, `merge_fields`, `sent_at`, `signed_at`, `dropbox_sign_request_id`

---

## 12. `validation_items`

**Admin Screen:** Validation Center

What the admin portal shows:
- Full review queue: every submitted item across all caterers — priority, type, section, status
- Detail drawer: data snapshot of what the caterer submitted, with approve / reject / correction actions

Admin fields used: `type`, `priority`, `status`, `section`, `data_snapshot`, `linked_document_id`, `smart_import_job_id`, `reviewed_by`, `internal_notes`

---

## 13. `corrections`

**Admin Screen:** Validation Center → corrections panel · EcoLoop → ticket detail

What the admin portal shows:
- Validation Center: correction requests per caterer — description, section, priority, status
- EcoLoop ticket detail: linked corrections shown inside the ticket thread

Admin fields used: `description`, `section`, `priority`, `status`, `validation_item_id`, `assigned_to`, `ecoloop_ticket_id`, `resolved_at`

---

## 14. `golive_checklist_items`

**Admin Screen:** Go-Live Monitor

What the admin portal shows:
- Full 11-item checklist per caterer — each requirement with status, blocking reason, and checked date
- Blockers panel: items with `status = blocked` displayed with `blocking_reason`

Admin fields used: `requirement`, `status`, `blocking_reason`, `linked_entity_type`, `linked_entity_id`, `checked_by`, `checked_at`

---

## 15. `ecoloop_tickets`

**Admin Screen:** EcoLoop

What the admin portal shows:
- Ticket list: all tickets — subject, status, priority, type, assigned admin, unread count
- Ticket detail panel: linked validation items, linked documents, linked contracts, correction requests

Admin fields used: `subject`, `status`, `priority`, `type`, `assigned_to`, `linked_validation_item_id`, `linked_document_id`, `linked_contract_id`, `unread_count_admin`, `unread_count_client`, `blocks_golive`

---

## 16. `ecoloop_messages`

**Admin Screen:** EcoLoop → ticket thread

What the admin portal shows:
- Full message thread: admin replies, internal notes (admin-only, never visible to caterer), system action entries

Admin fields used: `body`, `type` (all four: `admin_to_client`, `client_to_admin`, `internal_note`, `system_action`), `sender_id`, `linked_document_id`, `read_at`, `created_at`

> `type = internal_note` — admin portal writes it, admin portal displays it. This type must never be returned in any API response to the caterer portal.

---

## 17. `smart_import_jobs`

**Admin Screen:** Document Vault · Validation Center

What the admin portal shows:
- Document Vault: Smart Import status badge on each uploaded document (Queued / Processing / Review Ready / Applied)
- Validation Center: job status shown inside the linked validation item detail

Admin fields used: `section`, `source_document_id`, `detected_doc_type`, `status`, `confirmed_by`, `confirmed_at`, `applied_at`

---

## 18. `smart_import_fields`

**Admin Screen:** Smart Import review panel (within Validation Center or Document Vault)

What the admin portal shows:
- Field-by-field extraction results: field name, detected value, mapped value, confidence score bar
- Per-field action: Confirm / Edit / Reject — admin must act on every field before it is applied

Admin fields used: `field_name`, `detected_value`, `mapped_value`, `confidence_score`, `status`, `applied_value`, `edited_by`

> Confidence score rule: `>= 0.70` shows as a suggestion (highlighted). `< 0.70` is flagged red. Neither threshold auto-applies. Every field requires explicit admin action before `applied_value` is written.

---

## Summary Table

| Table | Admin Portal Screen |
|-------|-------------------|
| `users` | Header (all screens) · EcoLoop thread |
| `caterers` | Dashboard · Caterers in Onboarding |
| `caterer_banking` | Caterer detail → Banking · Validation Center |
| `caterer_onboarding_files` | Caterers list (badges) · Go-Live Monitor |
| `establishments` | Caterer detail → My Clients · Validation Center |
| `menus` | Caterer detail → Menus & Packages · Validation Center |
| `caterer_modules` | Modules & Pricing · Modules Config |
| `modules` | Modules & Pricing |
| `documents` | Document Vault · Caterer detail sections |
| `contracts` | Contract Management |
| `signature_requests` | Contract Management → contract detail |
| `validation_items` | Validation Center |
| `corrections` | Validation Center · EcoLoop ticket detail |
| `golive_checklist_items` | Go-Live Monitor |
| `ecoloop_tickets` | EcoLoop |
| `ecoloop_messages` | EcoLoop → ticket thread |
| `smart_import_jobs` | Document Vault · Validation Center |
| `smart_import_fields` | Smart Import review panel |
