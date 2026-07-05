# Model: Onboarding File (the status board)

## In one line
A single card per caterer that shows how far along each section is. It's the "progress board" the dashboard reads.

## Where it lives
- **Database:** MongoDB
- **Collection:** `caterer_onboarding_files` (one row per caterer)

## What it stores

| Field | Type | Meaning (plain English) |
|-------|------|--------------------------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer (one row each). |
| `profile_status` | enum | How far the Profile section is. |
| `banking_status` | enum | How far Banking is. |
| `establishments_status` | enum | How far My Clients is. |
| `menus_status` | enum | How far Menus is. |
| `documents_status` | enum | How far Documents are. |
| `contracts_status` | enum | How far Contracts are. |
| `modules_status` | enum | How far Module setup is. |
| `golive_status` | enum | Overall Go-live readiness. |
| `updated_at` | datetime | Last change. |

## Section status (the `*_status` fields) — explained

| Value | What it means | Set by |
|-------|---------------|--------|
| `not_started` | The caterer hasn't opened this section. | system (default) |
| `in_progress` | Started filling it, not submitted yet. | caterer |
| `submitted` | Just submitted (a brief moment before review). | system |
| `under_review` | Submitted and an admin is checking it. | system |
| `validated` | Admin approved — this section is done. | admin |
| `action_required` | Admin found a problem; the caterer must fix something. | admin |

## Go-live status — `golive_status`

| Value | What it means |
|-------|---------------|
| `not_ready` | Some checklist items are still incomplete. |
| `ready` | Everything's done — waiting for the admin to approve. |
| `approved` | Go-live approved; the caterer is now active. |

## How it connects
- One per [caterer](./caterer.md).
- Each `*_status` mirrors the latest result from that section's [validation-item](./validation-item.md).
- `golive_status` is the rollup of the [golive-checklist](./golive-checklist.md).
- This is the **only place section status lives** — even Banking (which is in PostgreSQL) keeps its `banking_status` here.

## Rules & checks
- The caterer can't edit these directly — they change as a result of submitting and admin review.
- Submitting is only allowed from `in_progress` or `action_required`.
- `under_review` and `validated` are set by the system/admin, never the caterer.

## Lifecycle (each section)
```
not_started ──► in_progress ──► (submit) ──► under_review ──► validated
                                      └──────────────────────► action_required ──► (resubmit) ──► under_review
```

## Schema (for developers)
```js
required: ["_id","caterer_id","golive_status"]
*_status:     enum ["not_started","in_progress","submitted","under_review","validated","action_required"]
golive_status: enum ["not_ready","ready","approved"]
// index
{ caterer_id: 1 } UNIQUE
```
