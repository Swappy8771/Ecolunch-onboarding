# 10 — Smart Import Engine

---

## Purpose

Smart Import (also called Smart Upload) is an intelligent document processing engine. When a document is uploaded — a void cheque, a school list Excel file, a menu PDF, a business registration PDF — Smart Import attempts to extract relevant field values from it and propose them for use in the corresponding EcoLunch section.

The goal is to reduce manual data entry. Instead of an admin typing values from a void cheque into the banking fields, they upload the cheque, Smart Import extracts the transit number, institution number, and account number, and proposes them for human review.

**The human review step is mandatory. No extracted value is ever applied automatically.**

---

## What Smart Import Is NOT

- It is **not a standalone sidebar section**
- It is **not a dashboard card**
- It does **not** appear in the global navigation as its own item
- It is a **contextual tool** — it appears as a button or option inside sections where document-to-field extraction makes sense

---

## Where Smart Import Appears

| Section | What Can Be Imported |
|---------|---------------------|
| Profile | Business registration → company name, legal name, address, NEQ/SIRET |
| Banks & Banking Information | Void cheque → transit number, institution number, account number, bank name |
| My Clients / Establishments | School list Excel/CSV → school names, addresses, contact info, student counts |
| Menus & Packages | Menu PDF or Excel → menu items, prices, categories, portion sizes |
| Document Vault | Any document → classified into correct category + field extraction if applicable |
| Contract Management | Where applicable — pre-populating merge fields from existing docs |

---

## The 14-Step Smart Import Workflow

### Step 1 — Context Entry
User is inside a specific onboarding section. They click **"Smart Import"** or **"Smart Upload"**. This opens the import flow for that specific section.

### Step 2 — File Selection
User selects or drags a file to upload.

Supported file types:
- PDF (most common — cheques, legal docs, menus)
- Excel (.xlsx) — school/daycare lists, menu spreadsheets
- CSV — data exports
- Acomba exports — accounting software exports
- QuickBooks exports

### Step 3 — Upload to Dropbox Storage
The file is immediately uploaded to Dropbox Storage under the caterer's vault folder. A `documents` record is created with `status: uploaded`, `source: smart_import`.

### Step 4 — Document Type Detection
The system analyzes the file content and identifies what kind of document it is:

| Document Type | Example Identifiers |
|---------------|-------------------|
| `void_cheque` | Bank MICR line, "VOID" text, routing numbers |
| `business_registration` | NEQ number, company registry text |
| `menu_pdf` | Table of food items, prices, categories |
| `school_list` | Column headers like "School Name", "Address", "Enrollment" |
| `insurance_certificate` | Policy number, coverage dates, insurer name |
| `legal_document` | Contract language, signature blocks |

### Step 5 — Content Parsing
The system reads the document content using the appropriate parser for the detected type (PDF text extraction, spreadsheet column mapping, etc.).

### Step 6 — Field Extraction
The system extracts candidate values for EcoLunch target fields. Each extracted value is a proposal — it has a raw detected value (exactly as found in the document) and a mapped value (cleaned and formatted for the target field).

### Step 7 — Fuzzy Matching
Extracted values are fuzzy-matched against EcoLunch's known field names and formats:
- "Institution No." → `institution_number`
- "Transit #" → `transit_number`
- "NOM DE L'ÉCOLE" → `school_name`
- Formats are normalized (phone numbers, dates, currency amounts)

A confidence score (0.0 to 1.0) is assigned to each match.

### Step 8 — Human Review Screen
The extracted fields are displayed to the user in a structured review interface.

Each field shows:
| Field | Description |
|-------|-------------|
| Target Field | The EcoLunch field this value would populate |
| Detected Value | Exactly as extracted from the document |
| Mapped Value | After fuzzy matching and formatting |
| Confidence Score | 0.0 (wild guess) to 1.0 (certain) |
| Current Value | What is currently in the EcoLunch system for this field |
| Action | Confirm / Edit / Reject |

Fields with low confidence (typically < 0.7) are flagged for extra attention.

### Step 9 — User Reviews Each Field
For every extracted field, the user takes one of three actions:

| Action | Meaning |
|--------|---------|
| **Confirm** | Accept the proposed value as-is |
| **Edit** | Modify the proposed value before accepting |
| **Reject** | Do not use this extracted value |

The user can also reject the entire job if the document was not useful.

### Step 10 — Only Confirmed Values Are Applied
After the user finishes the review, only fields with status `confirmed` or `edited` are written to the EcoLunch system. Rejected fields are ignored.

This is an absolute rule. There is no bulk "accept all" that bypasses individual review.

### Step 11 — Document Classification
The uploaded document is classified into the correct category in the caterer's Document Vault (e.g., a void cheque → category: `Banks & Banking Information`).

If the document was already classified (e.g., uploaded directly into a specific section), it confirms or updates the category.

### Step 12 — Validation Items Created
For any field that was confirmed or edited and applied, a validation item is created in the Validation Center so admin can review the data change.

This means: even when a caterer runs Smart Import themselves, an admin still has to approve the resulting field values.

### Step 13 — Full Audit Trail
Every action in the Smart Import flow is logged in `audit_logs`:
- File uploaded
- Document type detected
- Each field: detected value, mapped value, confidence score, action taken, applied value, who confirmed it

### Step 14 — Job Marked Applied
The `smart_import_jobs` record is updated to `status: applied`. The job is complete.

---

## Smart Import Job Statuses

| Status | Meaning |
|--------|---------|
| `uploaded` | File received, not yet processed |
| `processing` | System is parsing and extracting |
| `extraction_complete` | Extraction done, ready for human review |
| `needs_review` | Waiting for user to complete the review screen |
| `partially_mapped` | Some fields extracted, some could not be matched |
| `mapped` | All extracted fields have been matched |
| `confirmed` | User has completed review, values confirmed |
| `applied` | Confirmed values have been written to EcoLunch |
| `rejected` | User rejected the entire job |
| `correction_requested` | Admin has requested a correction on extracted values |
| `archived` | Superseded by a newer import for the same fields |

---

## Smart Import Field Statuses

| Status | Meaning |
|--------|---------|
| `detected` | Raw value found in document |
| `mapped` | Matched to a target EcoLunch field |
| `low_confidence` | Confidence score below threshold — needs extra attention |
| `needs_review` | Waiting for user decision |
| `confirmed` | User accepted the mapped value |
| `edited` | User modified the value before accepting |
| `rejected` | User discarded this field |
| `applied` | Value has been written to EcoLunch |

---

## Admin vs Caterer Role

| Action | Admin | Caterer |
|--------|-------|---------|
| Trigger Smart Import | ✅ | ✅ (from their portal sections) |
| Upload the document | ✅ | ✅ |
| Review the extracted fields | ✅ | ✅ (within their own sections) |
| Confirm / Edit / Reject fields | ✅ | ✅ |
| View the resulting validation items | ✅ All caterers | ✅ Their own only |
| Approve applied values in Validation Center | ✅ Only admin | ❌ |
| View audit trail of import jobs | ✅ | ✅ Their own |
