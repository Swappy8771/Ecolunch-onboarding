# 09 — EcoLoop Onboarding

---

## Purpose

EcoLoop is the communication and follow-up system for onboarding. It works like a support ticket system combined with threaded messaging — every conversation, correction request, document follow-up, and go-live blocker can be tracked in a ticket that links directly to the relevant item in the portal.

EcoLoop is the primary channel between EcoLunch Admin and the caterer during the onboarding process. It keeps the conversation structured and traceable.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Creates tickets, sends messages, adds internal notes, links items to tickets, manages ticket status. Also responds to messages from caterers. |
| **Caterer** | Reads messages from admin. Responds to correction requests. Asks questions. Uploads files in response to requests. They access EcoLoop from their Caterer Portal. |

---

## When a Ticket Is Created

Tickets are created in two ways:

**Auto-created** (by the system):
- Admin requests a correction in Validation Center → ticket auto-created and linked to the correction
- Admin rejects a document in Document Vault with a correction request → ticket auto-created
- A go-live blocker is flagged → admin can trigger a ticket from the Go-live Monitor

**Manually created** (by admin):
- Admin needs to contact a caterer for any reason not tied to a specific system event
- Admin wants to follow up on a delay or missing item

---

## Ticket Structure

Each ticket contains:

| Field | Description |
|-------|-------------|
| Caterer | Which caterer this ticket belongs to |
| Subject | Short description of the issue or topic |
| Status | Open / Pending / Resolved / Closed |
| Priority | High / Medium / Low |
| Type | Correction Request / Validation Follow-up / General / Contract / Document |
| Assigned Admin | Which admin owns this ticket |
| Conversation Thread | All messages between admin and caterer |
| Internal Notes | Admin-only notes — caterer never sees these |
| System Action Log | Auto-generated entries when system events happen on this ticket |
| Unread Count (Admin) | Number of unread messages for the admin |
| Unread Count (Client) | Number of unread messages for the caterer |

### Linked Items

Each ticket can be linked to items in other sections:

| Link Type | Links To |
|-----------|----------|
| Validation Item | A specific item in the Validation Center |
| Document | A specific file in the Document Vault |
| Contract | A specific contract in Contract Management |
| Smart Import Item | A specific Smart Import job or field |
| Go-live Blocker | A specific checklist item in Go-live Monitor |

Linking means the ticket is contextually connected — admin can click from the ticket directly to the referenced item.

---

## Message Types

Every message in an EcoLoop thread has a type:

| Type | Who Creates It | Who Can See It |
|------|---------------|----------------|
| `admin_to_client` | Admin | Admin + Caterer |
| `client_to_admin` | Caterer | Admin + Caterer |
| `internal_note` | Admin | Admin only |
| `system_action` | System (auto) | Admin + Caterer |

`internal_note` messages are never visible to the caterer. They are for admin-to-admin communication or personal reminders about the ticket.

`system_action` messages are auto-generated entries like: "Correction requested by Admin on [date]", "Caterer submitted updated document on [date]", "Ticket linked to Contract MSA".

---

## Ticket Status Flow

```
Open
  │
  ├── Admin sends message → Pending (waiting for caterer response)
  │
  ├── Caterer responds → Open (back in admin's court)
  │
  ├── Issue resolved → Resolved (can be reopened)
  │
  └── Confirmed resolved → Closed
```

---

## Admin Actions on a Ticket

| Action | What Happens |
|--------|-------------|
| **Create Ticket** | New ticket created, caterer notified |
| **Send Message** | `admin_to_client` message added to thread, caterer notified |
| **Add Internal Note** | `internal_note` added, invisible to caterer |
| **Link to Validation Item** | Ticket references a specific validation item |
| **Link to Document** | Ticket references a specific document in the vault |
| **Link to Contract** | Ticket references a specific contract |
| **Link to Smart Import Item** | Ticket references a specific Smart Import job |
| **Link to Go-live Blocker** | Ticket references a specific checklist item |
| **Close Ticket** | Status → `closed`. All linked corrections marked `resolved`. |
| **Reassign** | Change the assigned admin |
| **Change Priority** | Escalate or de-escalate |

---

## How EcoLoop Connects to Other Sections

EcoLoop does not operate in isolation. It is the communication layer for all other sections:

| Section | EcoLoop Connection |
|---------|-------------------|
| Validation Center | "Request Correction" auto-creates an EcoLoop ticket |
| Document Vault | "Request Correction" on a document auto-creates or links an EcoLoop ticket |
| Contract Management | Declined/expired contracts can trigger EcoLoop tickets |
| Go-live Monitor | "Send via EcoLoop" on a blocker creates a ticket linked to that blocker |
| Smart Import | Ambiguous extracted fields can be discussed via EcoLoop |

---

## Admin vs Caterer Role Summary

| Action | Admin | Caterer |
|--------|-------|---------|
| Create a ticket | ✅ | ❌ (they respond to tickets, they do not create them in this context) |
| Send messages | ✅ | ✅ |
| Add internal notes | ✅ | ❌ |
| View internal notes | ✅ | ❌ |
| Link a ticket to a validation item | ✅ | ❌ |
| Link a ticket to a document | ✅ | ❌ |
| Close a ticket | ✅ | ❌ |
| Reassign a ticket | ✅ | ❌ |
| Receive notification of a new message | ✅ | ✅ |
| View all tickets across all caterers | ✅ | ❌ (caterer sees only their own) |
