# Model: Audit Log

## In one line
A permanent, read-only record of every important action — who did what, when, and what changed. Used for security and accountability.

## Where it lives
- **Database:** MongoDB
- **Collection:** `audit_logs` (append-only — entries are never changed or deleted)

## What it stores

| Field | Type | Meaning (plain English) |
|-------|------|--------------------------|
| `_id` | UUID | Unique id. |
| `entity_type` | text | What kind of thing was acted on (e.g. `caterer_banking`, `contract`). |
| `entity_id` | UUID | The id of that thing. |
| `caterer_id` | UUID | Which caterer it relates to. |
| `actor_id` | UUID | Who did it. |
| `actor_type` | enum | What kind of actor (see below). |
| `action` | text | What happened (e.g. `banking.submitted`, `golive.approved`). |
| `old_value` | object | What it was before (if a change). |
| `new_value` | object | What it became. |
| `ip_address` | text | Where the action came from. |
| `created_at` | datetime | When it happened. |

## Who did it — `actor_type`

| Value | What it means |
|-------|---------------|
| `admin` | An EcoLunch staff member. |
| `caterer` | A caterer user. |
| `system` | An automatic process (e.g. the outbox worker). |
| `support_session` | An admin acting inside an audited support-access session. |

## Example actions
`banking.submitted` · `banking.revealed` · `golive.approved` · `contract.signed` · `correction.created` · `support_access_start` · `support_access_end`

## How it connects
- Can reference **any** model via `entity_type` + `entity_id`.
- Every model's important changes should write an entry here.

## Rules & checks
- **Append-only:** entries are never updated or deleted.
- Sensitive reveals (like viewing a full bank number) **must** be logged here.
- Only admins read the audit log; caterers never see it.

## Schema (for developers)
```js
actor_type: enum ["admin","caterer","system","support_session"]
// indexes
{ caterer_id: 1, created_at: -1 }
{ entity_type: 1, entity_id: 1 }
```
