# Model: EcoLoop (Tickets + Messages)

## In one line
The support chat between the caterer and EcoLunch — organised into tickets (threads) with messages inside.

## Where it lives
- **Database:** MongoDB
- **Collections:** `ecoloop_tickets` (the threads) and `ecoloop_messages` (the messages)

## Why two collections?
A ticket is one conversation; it can have many messages. Messages are kept separate so a long chat doesn't bloat the ticket, and so we can easily hide admin-only notes from the caterer.

## What it stores — `ecoloop_tickets`

| Field | Type | Meaning (plain English) |
|-------|------|--------------------------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer. |
| `subject` | text | What the thread is about. |
| `status` | enum | Where the conversation stands (see below). |
| `priority` | enum | `high` / `medium` / `low`. |
| `type` | enum | What kind of ticket (see below). |
| `assigned_to` | UUID | Which admin owns it. |
| `blocks_golive` | yes/no | If true, this conversation must be resolved before Go-live. |
| `linked_validation_item_id` | UUID | A related review, if any. |
| `linked_document_id` | UUID | A related document, if any. |
| `linked_contract_id` | UUID | A related contract, if any. |
| `linked_smart_import_job_id` | UUID | A related import job, if any. |
| `unread_count_admin` | number | Unread messages for the admin. |
| `unread_count_client` | number | Unread messages for the caterer. |
| `last_message_at` | datetime | When the last message arrived. |
| `created_at` | datetime | When the ticket was opened. |

## What it stores — `ecoloop_messages`

| Field | Type | Meaning |
|-------|------|---------|
| `_id` | UUID | Unique id. |
| `ticket_id` | UUID | Which thread it belongs to. |
| `caterer_id` | UUID | Owner caterer. |
| `sender_id` | UUID | Who sent it. |
| `body` | text | The message text. |
| `type` | enum | Kind of message (see below). |
| `linked_document_id` | UUID | An attached document, if any. |
| `read_at` | datetime | When it was read. |
| `created_at` | datetime | When it was sent. |

## Ticket status — `status`

| Value | What it means |
|-------|---------------|
| `open` | Active, needs attention. |
| `pending` | Waiting on the caterer to reply. |
| `resolved` | Sorted out. |
| `closed` | Finished, no more messages. |

## Ticket type — `type`
`correction_request` · `validation_followup` · `contract` · `document` · `general`

## Message type — `type`

| Value | Who sees it |
|-------|-------------|
| `admin_to_client` | Both the admin and the caterer. |
| `client_to_admin` | Both. |
| `internal_note` | **Admins only — the caterer must never see these.** |
| `system_action` | Both (auto messages like "Contract sent"). |

## How it connects
- Belongs to one [caterer](./caterer.md).
- Tickets link to a [validation-item](./validation-item.md), [document](./document.md), [contract](./contract.md), or import job.
- Correction tickets pair with a [correction](./correction.md).
- A `blocks_golive` ticket affects the [golive-checklist](./golive-checklist.md).

## Rules & checks
- **The caterer's view always hides `internal_note` messages.** This is the single most important rule for this model.
- When the caterer sends a message, it's type `client_to_admin` and bumps `unread_count_admin`.
- The caterer can't set `blocks_golive` — only admins can.
- Closing a `blocks_golive` ticket re-checks Go-live.

## Lifecycle
```
open ──► pending (waiting on caterer) ──► open (caterer replies) ──► resolved ──► closed
```

## Schema (for developers)
```js
// tickets
status:   enum ["open","pending","resolved","closed"]
priority: enum ["high","medium","low"]
type:     enum ["correction_request","validation_followup","contract","document","general"]
{ caterer_id: 1, status: 1 }

// messages
type: enum ["admin_to_client","client_to_admin","internal_note","system_action"]
{ ticket_id: 1, created_at: 1 }
// caterer queries MUST add: type != "internal_note"
```
