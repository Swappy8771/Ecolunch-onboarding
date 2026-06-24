# 10 — Corrections & Follow-up

---

## Purpose

Corrections are created by EcoLunch Admin when a submitted section fails validation. The caterer sees the list of open corrections, understands what needs to be fixed, goes back to the relevant section, fixes it, and resubmits. The caterer does not create corrections — only admin does.

---

## What the Caterer Sees Per Correction

| Field | Shown To Caterer |
|-------|-----------------|
| Description | Yes — what needs to be fixed |
| Section | Yes — which section to go fix it in |
| Priority | Yes — high / medium / low |
| Status | Yes — open / in-progress / resolved |
| Linked EcoLoop ticket | Yes — click to open conversation |

The caterer does NOT see:
- `assigned_to` (internal admin assignment)
- `validation_item_id` (internal reference)
- Admin internal notes

---

## Correction Status Values

| Status | Meaning | Who Updates It |
|--------|---------|---------------|
| `open` | Admin flagged — caterer must fix | Created by admin |
| `in_progress` | Caterer is working on it | Caterer |
| `resolved` | Caterer has resubmitted — awaiting admin review | System / caterer |
| `closed` | Admin confirmed fix — correction done | Admin only |

---

## Priority Colors

| Priority | Color | Urgency |
|----------|-------|---------|
| `high` | Red | Blocks Go-live — fix first |
| `medium` | Yellow | Must fix before Go-live |
| `low` | Blue | Nice to have — may not block |

---

## Correction Flow

```
Admin reviews submitted section → finds issue
  → Admin creates correction in Validation Center
    → correction.status = 'open'
      → Caterer sees correction in Corrections & Follow-up
        → Caterer goes to the flagged section → fixes the issue
          → Caterer resubmits the section
            → correction.status → 'resolved'
              → Admin reviews fix
                → Accepted: correction.status → 'closed'
                             validation_item.status → 'approved'
                → Not fixed: correction.status → 'open' again
                              new correction message added
```

---

## Go-live Block Rule

If any correction with `priority = 'high'` has `status != 'closed'` — Go-live is blocked.
`golive_checklist_items` requirement `corrections_closed` stays `incomplete` until all high-priority corrections are closed.

---

## Database Tables Used

| Table | Fields Read |
|-------|-------------|
| `corrections` | `description`, `section`, `priority`, `status`, `ecoloop_ticket_id` |
| `ecoloop_tickets` | `subject`, `status`, `unread_count_client` |
| `caterer_onboarding_files` | No direct field — corrections affect `golive_status` indirectly |
| `golive_checklist_items` | `requirement = 'corrections_closed'`, `status` |
