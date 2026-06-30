# Model: audit_logs (admin view)

**Storage:** MongoDB (append-only) · **Admin screen:** Audit trails (per caterer, document, contract…)
**One line:** Immutable record of every significant action across all portals. Never updated or deleted.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `entity_type` | varchar | `caterer` · `document` · `contract` · `validation_item` · `correction` · `caterer_module` · `golive_checklist` · `ecoloop_ticket` · `smart_import_job` · `user` |
| `entity_id` | uuid | id of the acted-on entity |
| `actor_id` | uuid | FK → users — NULL if system |
| `actor_type` | enum | `admin` · **`caterer_staff`** · `system` · `support_session` |
| `action` | varchar | `created` · `updated` · `approved` · `rejected` · `sent` · `signed` · `applied` · `activated` · `support_access_start` · `support_access_end` |
| `old_value` | jsonb | state before |
| `new_value` | jsonb | state after |
| `ip_address` | inet | request IP |
| `created_at` | timestamptz | never updated |

## Admin reads / writes
- **Reads:** full action history (admin-only; the caterer sees only its own actions).
- **Writes:** the system writes every action; nothing edits or deletes a row.

## Note
`actor_type='support_session'` (with `support_access_start`/`support_access_end`) is how a dispute about "who did what" is resolved when an admin views a caterer's portal. Canonical uses `caterer_staff` (the caterer-side model used `caterer`) — reconciliation #11.
