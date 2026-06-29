# 02 — Admin Screens → Tables

Each admin screen, what the admin does there, and which shared tables it **reads** and **writes**. (All tables are defined in [`../db-architecture/models/`](../db-architecture/models/).)

---

## 1. Dashboard
**Does:** shows KPIs across all caterers and links to anything needing attention.
- **Reads:** `caterers`, `validation_items`, `ecoloop_tickets`, `golive_checklist_items`
- **Writes:** nothing (navigation + situational awareness only)

## 2. Caterers in Onboarding
**Does:** the master caterer list; opens each caterer's full file; starts support sessions.
- **Reads:** `caterers`, `caterer_onboarding_files`, `users`, `golive_checklist_items`
- **Writes:** on **register** → `caterers` + `caterer_onboarding_files` + 11 `golive_checklist_items` + `users` + `audit_logs`; on **support session** → `audit_logs` (`support_access_start/end`)

## 3. Validation Center
**Does:** the review queue — the heart of the admin job. Approve / reject / request correction.
- **Reads:** `validation_items` (+ `data_snapshot`), `documents`, `smart_import_jobs`
- **Writes:** `validation_items.status`, `reviewed_by`, `internal_notes`; on correction → `corrections` + `ecoloop_tickets`; then recompute the matching `golive_checklist_items`

## 4. Document Vault
**Does:** review every uploaded file across 12 categories; run Smart Import; set visibility.
- **Reads:** `documents`, `smart_import_jobs`, `smart_import_fields`
- **Writes:** `documents.status` / `visibility` / `linked_validation_item_id`; Smart Import results; recompute `documents_approved`

## 5. Contract Management
**Does:** send contracts via Dropbox Sign and track signing.
- **Reads:** `contracts`, `signature_requests`, `caterer_modules` (for merge fields), `caterers`
- **Writes:** `contracts` (create/send), `signature_requests` (+ merge-field snapshot); webhooks update `contracts.status` and store the signed PDF in `documents`; recompute `contracts_signed`

## 6. Modules & Pricing (+ Config)
**Does:** turn modules on/off and set all pricing & operational rules. **This is the only screen that writes module/pricing data.**
- **Reads:** `modules`, `caterer_modules`
- **Writes:** `caterer_modules` (status, effective date, prices, cutoff/payout/credit rules, `configured_by`); recompute `modules_configured` + `pricing_configured`

## 7. Go-live Monitor
**Does:** review the 11-item checklist; resolve blockers; **Validate Go-live**.
- **Reads:** `golive_checklist_items`, `caterer_onboarding_files`, and the underlying sections
- **Writes:** may `waive` an item (with reason); on **Validate Go-live** → `caterers.status='active'` + `go_live_at` + all `caterer_modules='active'` + `golive_status='approved'` + `audit_logs('activated')`

## 8. EcoLoop
**Does:** message the caterer, create tickets, add admin-only internal notes.
- **Reads:** `ecoloop_tickets`, `ecoloop_messages`, `users`
- **Writes:** `ecoloop_tickets`, `ecoloop_messages` (incl. `internal_note` — **never** sent to the caterer), unread counts, `blocks_golive`

## 9. Smart Import (contextual — not a sidebar item)
**Does:** appears inside Document Vault / Validation Center; review extracted fields and apply.
- **Reads:** `smart_import_jobs`, `smart_import_fields`, `documents`
- **Writes:** per field confirm/edit/reject → `smart_import_fields.status` + `applied_value`; on apply → the target section table; **no field auto-applies**

---

## Screen → table summary

| Admin screen | Main tables touched |
|--------------|---------------------|
| Dashboard | caterers, validation_items, ecoloop_tickets, golive_checklist_items *(read only)* |
| Caterers in Onboarding | caterers, caterer_onboarding_files, users, golive_checklist_items, audit_logs |
| Validation Center | validation_items, corrections, ecoloop_tickets, documents |
| Document Vault | documents, smart_import_jobs, smart_import_fields |
| Contract Management | contracts, signature_requests, caterer_modules, documents |
| Modules & Pricing | caterer_modules, modules |
| Go-live Monitor | golive_checklist_items, caterers, caterer_modules, caterer_onboarding_files |
| EcoLoop | ecoloop_tickets, ecoloop_messages, corrections |
| Smart Import | smart_import_jobs, smart_import_fields, + target section table |
