# 13 — Smart Import Engine (Caterer View)

---

## Purpose

Smart Import helps the caterer auto-fill fields by extracting data from uploaded documents. It is not a standalone sidebar item. It appears contextually inside each relevant section when a document is uploaded.

**Critical rule: No extracted value is ever applied without explicit human review and confirmation.**

---

## Where Smart Import Appears

Smart Import is triggered inside sections — not from a global menu:

| Section | Smart Import Triggered By |
|---------|--------------------------|
| Profile | Upload of KBIS / company registry extract |
| Banking | Upload of RIB or bank statement |
| My Clients — Schools | Upload of school list PDF or CSV |
| My Clients — Daycares | Upload of daycare / CPE list PDF or CSV |
| Menus — School Menus | Upload of school menu PDF or XLSX |
| Menus — Rotating Cycle | Upload of rotating cycle document |
| Menus — Daycare Menus | Upload of daycare menu PDF |
| Menus — Daycare Packages | Upload of package document |
| Menus — Camp Menus | Upload of camp menu PDF |
| Modules — Accounting | Upload of accounting file or code list |
| Modules — ReportIQ | Upload of report template or recipient list |

---

## What the Caterer Sees

### Step 1 — Upload
Caterer uploads a file. System shows "Processing document…" indicator.

### Step 2 — Extraction Results
After processing, the caterer sees a field-by-field review panel:

| Field | Detected Value | Confidence | Action |
|-------|---------------|------------|--------|
| School Name | "École Sainte-Marie" | 94% | Confirm / Edit / Reject |
| Contact Email | "direction@sainte-marie.ca" | 87% | Confirm / Edit / Reject |
| Student Count | "312" | 72% | Confirm / Edit / Reject |
| Closure Date | "2026-12-24" | 61% | Confirm / Edit / Reject |

### Step 3 — Per-Field Actions

| Action | What Happens |
|--------|-------------|
| Confirm | `smart_import_fields.status → 'confirmed'`, `applied_value = mapped_value` |
| Edit | Caterer types corrected value, `status → 'manually_edited'`, `applied_value = caterer's value` |
| Reject | `status → 'rejected'`, field is not applied — caterer must fill manually |

The caterer must act on every field before the section can be submitted.

### Step 4 — Applied to Section
After all fields are reviewed:
- Confirmed and edited values are applied to the relevant section fields
- Section shows pre-filled data with "Imported" label
- Caterer reviews the full section once more before submitting to admin

---

## Confidence Score Display

| Score | What Caterer Sees | Colour |
|-------|------------------|--------|
| 0.85 – 1.00 | High confidence — green bar | Green |
| 0.70 – 0.84 | Good match — suggested | Blue |
| 0.50 – 0.69 | Low confidence — review carefully | Yellow |
| Below 0.50 | Very low — flagged, likely wrong | Red |

Scores below 0.70 are shown with a warning: "Please verify this value carefully."
No threshold auto-applies. Every field — regardless of score — requires caterer action.

---

## Module-Aware Behaviour

Smart Import only offers fields relevant to active modules:

| Module Active | Smart Import Extracts |
|---------------|----------------------|
| School Meals | School names, CSS districts, contacts, menu items, cutoff dates |
| Daycare / CPE | Daycare names, contacts, package names, menu items |
| Camp Meals | Camp names, dates, menu items |
| Accounting | Software type, account codes, VAT number |
| ReportIQ | Report types, recipient emails, frequency |

If a module is not active — its field types are never extracted or shown.

---

## What Smart Import Does NOT Do

- Does not apply any value automatically
- Does not submit sections — caterer still submits manually
- Does not create validation items — admin does that after caterer submits
- Does not replace human judgment — it assists only

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `smart_import_jobs` | `caterer_id`, `section`, `source_document_id`, `detected_doc_type`, `status`, `confirmed_by`, `confirmed_at`, `applied_at` |
| `smart_import_fields` | `job_id`, `field_name`, `detected_value`, `mapped_value`, `confidence_score`, `status`, `applied_value`, `edited_by` |
| `documents` | `smart_import_job_id` — links uploaded file to job |
| `caterer_modules` | `status` — controls which field types are extracted |
