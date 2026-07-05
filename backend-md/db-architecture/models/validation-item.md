# Model: Validation Item

## In one line
A "please review this" entry. Every time a caterer submits a section, one of these is created for an EcoLunch admin to approve or reject.

## Where it lives
- **Database:** MongoDB
- **Collection:** `validation_items`

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Owner caterer. |
| `type` | enum | yes | What is being reviewed (see below). |
| `priority` | enum | yes | How urgent (see below). |
| `status` | enum | yes | Where the review is (see below). |
| `section` | text | no | Which portal section it came from. |
| `data_snapshot` | object | no | A copy of what was submitted, for the admin to look at. |
| `linked_document_id` | UUID | no | A related document, if any. |
| `smart_import_job_id` | UUID | no | A related auto-import job, if any. |
| `source_db` | enum | yes | `mongo` or `postgres` — which database the submitted data lives in. |
| `source_record_id` | UUID | no | The id of that record (for banking, the PostgreSQL banking row). |
| `reviewed_by` | UUID | no | Which admin handled it. |
| `internal_notes` | text | no | Admin-only notes. |
| `created_at` / `updated_at` | datetime | yes | Timestamps. |

## What's being reviewed — `type`
`profile` · `banking` · `document` · `contract` · `menu` · `establishment` · `module` · `pricing` · `golive`

(Each matches a portal section, e.g. `banking` = the caterer's bank details.)

## Urgency — `priority`

| Value | What it means |
|-------|---------------|
| `critical` | Blocks Go-live; must be handled. |
| `high` | Blocks a major section. |
| `medium` | Important but not blocking. |
| `low` | Minor. |

## Review status — `status`

| Value | What it means | Set by |
|-------|---------------|--------|
| `pending_review` | Waiting for an admin to pick it up. | system |
| `in_review` | An admin is looking at it. | admin |
| `approved` | Accepted — the section becomes "validated". | admin |
| `rejected` | Not accepted. | admin |
| `correction_requested` | Admin wants a fix → creates a [correction](./correction.md). | admin |
| `closed` | Finished/closed out. | system/admin |

## How it connects
- Belongs to one [caterer](./caterer.md).
- For banking, `source_db = postgres` and `source_record_id` points to the [banking](./banking.md) row in PostgreSQL.
- `correction_requested` creates a [correction](./correction.md) and an [ecoloop](./ecoloop.md) ticket.
- Approving one re-checks the [golive-checklist](./golive-checklist.md).

## Rules & checks
- One is created automatically whenever a caterer submits a section.
- The caterer doesn't see these directly — they see the **result** (their section status changing, or a correction appearing).

## Lifecycle
```
pending_review ──► in_review ──► approved        (section validated)
                          ├──► rejected           (section needs work)
                          └──► correction_requested (creates a correction + chat ticket)
```

## Schema (for developers)
```js
required: ["_id","caterer_id","type","priority","status"]
type:     enum ["profile","banking","document","contract","menu","establishment","module","pricing","golive"]
priority: enum ["critical","high","medium","low"]
status:   enum ["pending_review","in_review","approved","rejected","correction_requested","closed"]
source_db: enum ["mongo","postgres"]
// indexes
{ status: 1, priority: 1 }
{ caterer_id: 1 }
```
