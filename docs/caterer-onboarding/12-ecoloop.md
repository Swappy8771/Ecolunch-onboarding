# 12 — EcoLoop

---

## Purpose

EcoLoop is the communication channel between the caterer and EcoLunch Admin. The caterer uses it to ask questions, respond to admin messages, and track the status of support threads during onboarding. Tickets can be linked to specific sections, documents, or corrections.

---

## What the Caterer Sees

### Ticket List
- All tickets where `ecoloop_tickets.caterer_id = caterer's own id`
- Each ticket shows: subject, status badge, unread count, last message date
- Unread count from `ecoloop_tickets.unread_count_client`

### Ticket Thread
Inside each ticket:
- Full message history — chronological
- Only `type = 'admin_to_client'` and `type = 'client_to_admin'` messages are shown
- `type = 'internal_note'` is **never shown** to the caterer — admin-only
- `type = 'system_action'` entries (e.g. "Contract sent") are shown as system events

### Send Message
- Caterer types a reply and sends
- New message: `type = 'client_to_admin'`, `sender_id = caterer user id`
- `ecoloop_tickets.unread_count_admin` increments by 1

---

## Ticket Status Values

| Status | Caterer Sees | Meaning |
|--------|-------------|---------|
| `open` | Blue — Open | Active thread, admin has not resolved |
| `pending` | Yellow — Waiting | Admin waiting for caterer response |
| `resolved` | Green — Resolved | Admin has resolved the issue |
| `closed` | Grey — Closed | Thread is closed — no more messages |

---

## Ticket Types the Caterer May Receive

| Type | What It Means for Caterer |
|------|--------------------------|
| `correction_request` | Admin flagged something that needs fixing |
| `validation_followup` | Admin has a question about a submitted section |
| `contract` | Admin message about a contract |
| `document` | Admin message about a document |
| `general` | General communication from EcoLunch |

---

## Go-live Blocker Tickets

Some tickets have `blocks_golive = true` — these are highlighted with a red banner in the thread: "This conversation is blocking your Go-live."

The caterer must resolve the issue and the admin must clear the `blocks_golive` flag before Go-live can proceed.

---

## What the Caterer Cannot Do

- Cannot create a ticket (admin creates all tickets)
- Cannot change ticket status
- Cannot set `blocks_golive`
- Cannot see `internal_note` messages
- Cannot see tickets from other caterers

---

## Database Tables Used

| Table | Fields Read |
|-------|-------------|
| `ecoloop_tickets` | `subject`, `status`, `priority`, `type`, `unread_count_client`, `blocks_golive` |
| `ecoloop_messages` | `body`, `type` (filtered: no `internal_note`), `sender_id`, `read_at`, `created_at` |
| `users` | `first_name`, `last_name` — for sender display name |
