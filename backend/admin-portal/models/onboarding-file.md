# Model: caterer_onboarding_files (admin view)

**Storage:** MongoDB · **Admin screen:** Caterers list (section badges) · Go-Live Monitor
**One line:** One row per caterer tracking how far each section has progressed — plus admin-only notes.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `profile_status` | enum | `not_started` · `in_progress` · `validated` |
| `banking_status` | enum | same |
| `establishments_status` | enum | same |
| `menus_status` | enum | same |
| `documents_status` | enum | same |
| `contracts_status` | enum | same |
| `modules_status` | enum | same |
| `golive_status` | enum | `not_ready` · `ready` · `approved` · **`blocked`** |
| `admin_notes` | text | **internal only — the caterer never sees this** |

## Admin reads / writes
- **Reads:** drives the per-caterer progress badges and the Go-Live readiness indicator.
- **Writes:** `admin_notes`. The `*_status` fields are system-set as reviews resolve.

## Notes
- Doc 11 lists the section enum as just `not_started/in_progress/validated`; the operational flow also uses `submitted/under_review/action_required` (reconciliation #12).
- `golive_status` includes **`blocked`** here (the caterer-side model omitted it).
