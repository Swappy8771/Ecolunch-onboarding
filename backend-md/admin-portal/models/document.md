# Model: documents (admin view)

**Storage:** MongoDB (files in Dropbox) · **Admin screen:** Document Vault · Caterer detail sections
**One line:** Metadata for every uploaded file. Admin reviews, sets visibility, and runs Smart Import.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `dropbox_file_id` | varchar | unique — Dropbox id |
| `dropbox_file_path` | varchar | path in Dropbox |
| `category` | enum | `profile` · `legal` · `banking` · `compliance` · `insurance` · `establishments` · `menus` · `modules` · `contracts` · `golive` · **`internal`** |
| `source` | enum | `admin_upload` · `caterer_upload` · `smart_import` · `contract_signed` |
| `status` | enum | `uploaded` · `under_review` · `approved` · `rejected` · `correction_requested` · `archived` |
| `version` | int | default 1 |
| `version_of` | uuid | FK → documents (self-ref) |
| `uploaded_by` | uuid | FK → users |
| `linked_validation_item_id` | uuid | FK → validation_items |
| `smart_import_job_id` | uuid | FK → smart_import_jobs |
| `visibility` | enum | `internal` (admin only) · `client_visible` |

## Admin reads / writes
- **Reads:** the full vault across 11 categories (incl. `internal`); per-section linked docs.
- **Writes:** `status` (approve/reject/correction), `visibility`, uploads internal docs; runs Smart Import.

## Note
Canonical adds **`internal`** category and **`linked_validation_item_id`** (reconciliation #8). The vault UI shows 11 functional categories (+ a Dropbox-path info row).
