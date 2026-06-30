# Model: golive_checklist_items (admin view)

**Storage:** MongoDB · **Admin screen:** Go-Live Monitor
**One line:** The 11-item readiness tracker per caterer. The admin's final gate before activation.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `requirement` | enum | the 11 keys below |
| `status` | enum | `complete` · `incomplete` · `blocked` · `waived` |
| `blocking_reason` | text | NULL if complete |
| `linked_entity_type` | varchar | polymorphic — what caused this status |
| `linked_entity_id` | uuid | polymorphic — id of that entity |
| `checked_by` | uuid | FK → users — NULL if system-evaluated |
| `checked_at` | timestamptz | |

## The 11 requirements
`account_created` · `profile_validated` · `banking_validated` · `establishments_confirmed` · `menus_validated` · `documents_approved` · `contracts_signed` · `modules_configured` · `pricing_configured` · `corrections_closed` · `ecoloop_blockers_closed`

## Admin reads / writes
- **Reads:** the full checklist; the Blockers panel (`status='blocked'` + reason).
- **Writes:** may `waive` an item (with a logged reason). The system recomputes items automatically after each relevant event.
- **"Validate Go-live"** is allowed only when all 11 are `complete`/`waived` → flips the caterer to `active`.
