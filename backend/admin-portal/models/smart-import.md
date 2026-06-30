# Model: smart_import_jobs + smart_import_fields (admin view)

**Storage:** MongoDB · **Admin screen:** Document Vault · Validation Center (Smart Import review panel)
**One line:** Reads an uploaded document and proposes field values. **Nothing auto-applies** — a human confirms every field.

## `smart_import_jobs`
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `section` | enum | `profile` · `banking` · `establishments` · `menus` · `documents` |
| `source_document_id` | uuid | FK → documents |
| `detected_doc_type` | varchar | e.g. `void_cheque` · `menu_pdf` · `school_list` |
| `status` | enum | job lifecycle (uploaded → … → applied / rejected) |
| `confirmed_by` | uuid | FK → users |
| `confirmed_at` / `applied_at` | timestamptz | |

## `smart_import_fields`
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `job_id` | uuid | FK → smart_import_jobs |
| `field_name` | varchar | target EcoLunch field |
| `detected_value` | text | raw extracted value |
| `mapped_value` | text | after matching/formatting |
| `confidence_score` | decimal | 0.00–1.00 |
| `status` | enum | per-field lifecycle (detected → confirmed/edited/rejected → applied) |
| `applied_value` | text | final value after human action |
| `edited_by` | uuid | FK → users |

## Admin reads / writes
- **Reads:** field-by-field results with confidence bars.
- **Writes:** Confirm / Edit / Reject each field. **Rule:** `confidence_score >= 0.70` shows as a suggestion, `< 0.70` flagged red — neither auto-applies; `applied_value` is written only after explicit admin action.
