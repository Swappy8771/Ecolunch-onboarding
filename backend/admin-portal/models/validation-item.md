# Model: validation_items (admin view)

**Storage:** MongoDB · **Admin screen:** Validation Center
**One line:** The admin's review queue — one row per caterer submission needing a decision. **This is the core admin workspace.**

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `type` | enum | `profile` · `banking` · `document` · `contract` · `menu` · `module` · `pricing` · `establishment` · `golive` |
| `priority` | enum | `critical` · `high` · `medium` · `low` |
| `status` | enum | `pending_review` · `in_review` · `approved` · `rejected` · `correction_requested` · `closed` |
| `section` | varchar | which onboarding section it came from |
| `data_snapshot` | jsonb | the submitted values at review time |
| `linked_document_id` | uuid | FK → documents |
| `smart_import_job_id` | uuid | FK → smart_import_jobs |
| `reviewed_by` | uuid | FK → users (admin) |
| `internal_notes` | text | **admin-only** |

## Admin reads / writes
- **Reads:** the global queue across all caterers (priority, type, status); the detail drawer with `data_snapshot`.
- **Writes:** the **decision** — approve / reject / request correction; `reviewed_by`, `internal_notes`. On `correction_requested` → creates a `correction` + EcoLoop ticket; then recomputes the matching Go-live check.

## Note
For a banking item, the submitted data lives in PostgreSQL — the item carries a pointer back (`source_db='postgres'`, `source_record_id`) set by the outbox relay.
