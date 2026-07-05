# Model: ecoloop_tickets + ecoloop_messages (admin view)

**Storage:** MongoDB · **Admin screen:** EcoLoop
**One line:** Support threads between admin and caterer; the admin can also add internal-only notes.

## `ecoloop_tickets`
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `subject` | varchar | |
| `status` | enum | `open` · `pending` · `resolved` · `closed` |
| `priority` | enum | `high` · `medium` · `low` |
| `type` | enum | `correction_request` · `validation_followup` · `general` · `contract` · `document` |
| `assigned_to` | uuid | FK → users |
| `linked_validation_item_id` / `linked_document_id` / `linked_contract_id` | uuid | contextual links |
| `unread_count_admin` / `unread_count_client` | int | |

## `ecoloop_messages`
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `ticket_id` | uuid | FK → ecoloop_tickets |
| `sender_id` | uuid | FK → users |
| `body` | text | |
| `type` | enum | `admin_to_client` · `client_to_admin` · **`internal_note`** · `system_action` |
| `linked_document_id` | uuid | optional attachment |
| `read_at` | timestamptz | NULL = unread |
| `created_at` | timestamptz | |

## Admin reads / writes
- **Writes:** replies, creates tickets, assigns, and adds **`internal_note`** messages.
- **Critical:** `type='internal_note'` is admin-only — it must **never** be returned to the caterer's API.
- A ticket flagged blocking keeps `golive_checklist_items.ecoloop_blockers_closed` incomplete until closed.
