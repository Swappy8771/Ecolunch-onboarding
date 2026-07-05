# Model: Smart Import (Jobs + Fields)

## In one line
When a caterer uploads a file (a void cheque, a menu, a registration doc), Smart Import reads it and **suggests** field values — but a human must confirm each one before it's used.

## Where it lives
- **Database:** MongoDB
- **Collection:** `smart_import_jobs`
- The suggested values are kept **inside** each job (`fields`).

## What it stores — `smart_import_jobs`

| Field | Type | Meaning (plain English) |
|-------|------|--------------------------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer. |
| `section` | text | Which section it's filling (profile, banking, menus…). |
| `source_document_id` | UUID | The uploaded file it read. |
| `detected_doc_type` | text | What kind of doc it thinks it is (e.g. `rib`, `kbis`, `menu_pdf`). |
| `status` | enum | Where the job is (see below). |
| `fields` | list | The suggested values (each described below). |
| `confirmed_by` | UUID | Who reviewed the suggestions. |
| `confirmed_at` | datetime | When review finished. |
| `applied_at` | datetime | When the values were applied to the section. |
| `created_at` | datetime | When the job started. |

## Each item in `fields`

| Field | Meaning |
|-------|---------|
| `field_name` | Which field this is (e.g. `iban`, `company_name`). |
| `detected_value` | The raw value read from the document. |
| `mapped_value` | The cleaned-up value in the right format. |
| `confidence_score` | How sure we are, from 0.00 to 1.00. |
| `status` | What the caterer decided (see below). |
| `applied_value` | The final value actually used. |
| `edited_by` | Who edited it, if they changed it. |

## Job status — `status`
`uploaded` → `processing` → `extraction_complete` → `needs_review` → (`partially_mapped` / `mapped`) → `confirmed` → `applied`
Other endings: `rejected`, `correction_requested`, `archived`.

## Field status — `fields[].status`

| Value | What it means |
|-------|---------------|
| `detected` / `mapped` / `low_confidence` | The system's first guess (low_confidence = unsure). |
| `needs_review` | Waiting for the caterer to decide. |
| `confirmed` | The caterer accepted the suggestion. |
| `edited` | The caterer changed it to something else. |
| `rejected` | The caterer said "no, ignore this". |
| `applied` | The accepted value was written into the section. |

## The golden rule: no auto-apply
**Nothing is filled in automatically.** Every field needs an explicit *confirm*, *edit*, or *reject* from the caterer before it counts. The `confidence_score` only colours the screen (green/yellow/red) to help them — it never decides on its own.

## How it connects
- Belongs to one [caterer](./caterer.md), reads one [document](./document.md).
- Fills fields in a section: [caterer](./caterer.md) (profile), [banking](./banking.md), [menu](./menu.md), [establishment](./establishment.md).
- For the **banking** section, applying values writes to PostgreSQL through the [banking](./banking.md) bridge.

## Rules & checks
- The source document must belong to the same caterer.
- `confidence_score` is always between 0 and 1.
- Applying requires every field to be actioned (confirmed/edited/rejected).
- Applying fills the fields — it does **not** mark the section validated. The caterer still submits it normally.

## Lifecycle
```
upload ──► processing ──► needs_review ──► caterer confirms/edits/rejects each field ──► applied
```

## Schema (for developers)
```js
required: ["_id","caterer_id","section","status"]
status: enum ["uploaded","processing","extraction_complete","needs_review",
              "partially_mapped","mapped","confirmed","applied","rejected",
              "correction_requested","archived"]
fields[].confidence_score: 0.0 .. 1.0
fields[].status: enum ["detected","mapped","low_confidence","needs_review",
                       "confirmed","edited","rejected","applied"]
// index
{ caterer_id: 1, section: 1 }
```
