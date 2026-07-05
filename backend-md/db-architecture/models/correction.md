# Model: Correction

## In one line
A "please fix this" request. When an admin finds a problem during review, they create a correction telling the caterer what to fix.

## Where it lives
- **Database:** MongoDB
- **Collection:** `corrections`

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Owner caterer. |
| `validation_item_id` | UUID | no | The review that caused this (hidden from caterer). |
| `description` | text | yes | What the caterer needs to fix. |
| `section` | text | yes | Which section to fix (profile, menus…). |
| `priority` | enum | yes | How urgent (see below). |
| `status` | enum | yes | Where the fix is (see below). |
| `ecoloop_ticket_id` | UUID | no | The chat thread for this correction. |
| `created_by` | UUID | yes | The admin who created it. |
| `created_at` | datetime | yes | When. |
| `resolved_at` | datetime | no | When it was fixed. |

## Urgency — `priority`

| Value | What it means | Color in UI |
|-------|---------------|-------------|
| `high` | Must fix first — blocks Go-live. | red |
| `medium` | Must fix before Go-live. | yellow |
| `low` | Nice to fix. | blue |

## Status — `status`

| Value | What it means | Set by |
|-------|---------------|--------|
| `open` | Flagged; the caterer needs to act. | admin |
| `in_progress` | The caterer is working on it. | caterer |
| `resolved` | The caterer fixed it and resubmitted. | caterer |
| `closed` | The admin confirmed the fix. | admin |

## How it connects
- Belongs to one [caterer](./caterer.md).
- Created from a [validation-item](./validation-item.md) marked `correction_requested`.
- Has a linked [ecoloop](./ecoloop.md) ticket for discussion.

## Rules & checks
- **Only admins create corrections** — the caterer can't.
- The caterer sees `description`, `section`, `priority`, `status`, and the linked chat — but not the internal review id or admin notes.
- **Go-live is blocked** while any `high` priority correction is not `closed`.

## Lifecycle
```
admin flags (open) ──► caterer works (in_progress) ──► caterer resubmits (resolved) ──► admin confirms (closed)
```

## Schema (for developers)
```js
required: ["_id","caterer_id","description","section","priority","status"]
priority: enum ["high","medium","low"]
status:   enum ["open","in_progress","resolved","closed"]
// index
{ caterer_id: 1, status: 1 }
```
