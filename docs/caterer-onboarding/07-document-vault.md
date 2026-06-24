# 07 — Document Vault

---

## Purpose

The caterer's Document Vault shows all documents relevant to their onboarding. It is module-aware — only categories for activated modules are shown. The caterer uploads, views, and replaces documents. Admin reviews and approves them.

---

## Base Categories — Always Shown

These categories appear for every caterer regardless of modules:

| Category | What Goes Here |
|----------|---------------|
| Profile | Company logo, KBIS / company registry extract |
| Legal | Legal registration documents, permits |
| Banking | RIB, bank statement, bank authorization letter |
| Compliance & Permits | Health permits, food safety certifications, HACCP |
| Insurance | Liability insurance certificate |
| Contracts & Signatures | Signed contract PDFs, Dropbox Sign audit trails |
| Go-live | Go-live approval documents |

---

## Dynamic Module Categories

These categories appear only when the corresponding module is active:

### School Meals Active
| Category | Documents |
|----------|-----------|
| School Meals | School menu files, rotating cycle files, school list files, CSS list files |
| School Calendars | Closure calendar files per school |
| School Compliance | Cutoff rule files, label setup files, nutritional standards files, allergen protocol |
| School Reporting | CSS reporting files, school direction reporting files (if applicable) |

### Daycare / CPE Meals Active
| Category | Documents |
|----------|-----------|
| Daycare / CPE Meals | Daycare menu files, daycare package files, infant nutrition protocol |
| Daycare Lists | Daycare / CPE list files |
| Daycare Calendars | Closure calendar files per daycare |
| Daycare Compliance | DDASS / DREETS certification, CPE menu approval |
| Daycare Reporting | Daycare reporting files (if applicable) |

### Camp Meals Active
| Category | Documents |
|----------|-----------|
| Camp Meals | Camp menu files, camp package files |
| Camp Lists | Camp list files, session date files |
| Camp Calendars | Camp calendar files |

### Accounting Active
| Category | Documents |
|----------|-----------|
| Accounting | Annual financial report, VAT registration certificate, tax clearance certificate |
| Accounting Setup | Accounting code files, export reference files (if applicable) |

### ReportIQ Active
| Category | Documents |
|----------|-----------|
| ReportIQ | Report templates, recipient lists, reporting requirement files |

---

## Document Status Values

| Status | Meaning | Who Sets It |
|--------|---------|-------------|
| `uploaded` | File uploaded, not yet reviewed | System |
| `under_review` | Admin is reviewing | System |
| `approved` | Admin approved | Admin |
| `rejected` | Admin rejected — reupload required | Admin |
| `correction_requested` | Admin flagged a specific issue | Admin |
| `archived` | Old version — replaced by new upload | System |

---

## Document Visibility Rules

| Visibility | Who Sees It |
|------------|-------------|
| `client_visible` | Both admin and caterer |
| `internal` | Admin only — caterer never sees it |

The caterer's Document Vault only returns documents where `visibility = 'client_visible'`.

---

## Versioning

When a caterer replaces a document:
- Old document: `status → 'archived'`, `version` stays as-is
- New document: new row, `version = old + 1`, `version_of = original document id`
- Admin sees version history in the admin Document Vault

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `documents` | `category`, `status`, `visibility`, `dropbox_file_path`, `source`, `version`, `version_of`, `uploaded_by` |
| `caterer_modules` | `status`, `effective_date` — drives which categories appear |
| `caterer_onboarding_files` | `documents_status` |
| `validation_items` | `type = 'document'`, `linked_document_id` |
