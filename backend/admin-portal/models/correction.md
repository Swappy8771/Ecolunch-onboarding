# Model: corrections (admin view)

**Storage:** MongoDB · **Admin screen:** Validation Center → corrections panel · EcoLoop → ticket detail
**One line:** "Please fix this" requests the admin raises when a submission fails review.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `validation_item_id` | uuid | FK → validation_items (the review that triggered it) |
| `description` | text | what to fix |
| `section` | varchar | which section to fix |
| `priority` | enum | `high` · `medium` · `low` |
| `status` | enum | `open` · `in_progress` · `resolved` · `closed` |
| `assigned_to` | uuid | FK → users (admin who owns it) |
| `ecoloop_ticket_id` | uuid | FK → ecoloop_tickets (auto-created thread) |
| `resolved_at` | timestamptz | |

## Admin reads / writes
- **Writes:** **creates** corrections (the caterer cannot); confirms the fix (`status='closed'`).
- The caterer sees `description`, `section`, `priority`, `status` — not `validation_item_id`, `assigned_to`, or internal notes.

## Go-live impact
Any `priority='high'` correction not `closed` keeps `golive_checklist_items.corrections_closed` incomplete.
