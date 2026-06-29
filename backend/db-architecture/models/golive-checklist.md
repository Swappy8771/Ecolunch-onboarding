# Model: Go-Live Checklist Item

## In one line
The checklist that must be 100% complete before a caterer can go live. One row per requirement.

## Where it lives
- **Database:** MongoDB
- **Collection:** `golive_checklist_items`

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Owner caterer. |
| `requirement` | text | yes | Which requirement this is (e.g. `banking_validated`). |
| `status` | enum | yes | Whether it's done (see below). |
| `blocking_reason` | text | no | If blocked, why — shown to the caterer. |
| `linked_entity_type` | text | no | What's blocking it (e.g. `correction`, `ecoloop_ticket`). |
| `linked_entity_id` | UUID | no | The id of that blocker. |
| `checked_by` | UUID | no | Who/what last evaluated it. |
| `checked_at` | datetime | no | When it was last checked. |

## Status — `status`

| Value | What it means | Color |
|-------|---------------|-------|
| `complete` | This requirement is satisfied. | green |
| `incomplete` | Not done yet. | yellow |
| `blocked` | Can't be completed — there's a reason in `blocking_reason`. | red |
| `waived` | An admin chose to skip it (with a logged reason). | grey |

## The requirements
**Always required (every caterer):**
`account_created` · `profile_validated` · `banking_validated` · `documents_approved` · `contracts_signed` · `corrections_closed` · `ecoloop_blockers_closed`

**Added based on active modules:**
- School Meals → `establishments_confirmed`, `menus_validated`, `modules_configured`, `pricing_configured`
- Daycare / Camp / Accounting / ReportIQ → their own equivalents

So **the checklist is different for each caterer**, depending on their modules.

## How it connects
- Belongs to one [caterer](./caterer.md).
- Each item is recalculated when its source changes — e.g. `banking_validated` updates when the [banking](./banking.md) [validation-item](./validation-item.md) is approved.
- The overall result is stored as `golive_status` in the [onboarding-file](./onboarding-file.md).

## Rules & checks
- The system recalculates items automatically; the caterer can't edit them.
- `waived` requires an admin reason (saved to the [audit-log](./audit-log.md)).
- **Go-live is all-or-nothing:** every applicable item must be `complete` (or `waived`). No partial Go-live.
- The caterer can **never** approve their own Go-live — only an admin can.

## Lifecycle
```
incomplete ──► complete           (when its requirement is met)
incomplete ──► blocked            (when something is in the way)
any        ──► waived             (admin override, with reason)

When ALL applicable items are complete/waived → golive_status = ready → admin approves → caterer goes active
```

## Schema (for developers)
```js
required: ["_id","caterer_id","requirement","status"]
status: enum ["complete","incomplete","blocked","waived"]
// index
{ caterer_id: 1, requirement: 1 } UNIQUE
```
