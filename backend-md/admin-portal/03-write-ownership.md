# 03 — Write Ownership (who writes what)

Both portals share one database. They never conflict because each table has a clear **write owner**. This is the single most important table for understanding how admin + caterer coexist.

Legend: **Admin** = EcoLunch staff · **Caterer** = the company onboarding · **System** = automatic (recomputes, webhooks, outbox, audit).

| Table | Admin writes | Caterer writes | System writes |
|-------|--------------|----------------|---------------|
| `caterers` | creates it; sets `status`, `assigned_admin`, Go-live fields | fills profile fields | `onboarding_progress_pct`; `status='active'` at Go-live |
| `users` | creates the caterer's account | sets password on first login; profile name | `last_login_at` |
| `caterer_banking` *(PostgreSQL)* | — (reviews only) | **all bank fields** + uploads | `submitted_at`; encryption |
| `caterer_onboarding_files` | `admin_notes` | — | every `*_status`, `golive_status` |
| `establishments` | confirms (`status`) | **adds schools/daycares/camps** | — |
| `closures` | — | adds/uploads | Smart Import rows |
| `menus` / `dishes` | validates (`status`) | **creates menus & dishes** | Smart Import results |
| `documents` | uploads internal docs; sets `status`, `visibility` | **uploads their files** | Smart Import + signed-contract PDFs |
| `contracts` | **creates & sends**; archives | — | status from Dropbox Sign webhooks |
| `signature_requests` | — (created on send) | — | created on send; status from webhooks |
| `modules` | seed/catalogue only | — | — |
| `caterer_modules` | **the only writer** (activate + price + rules) | — (read-only) | becomes `active` at Go-live |
| `validation_items` | **decides** (approve/reject/correct) + `internal_notes` | — | created on each caterer submit |
| `corrections` | **creates them** | sets `in_progress` / `resolved` | `closed` on re-approval |
| `golive_checklist_items` | may `waive` (with reason) | — | **recomputed automatically** |
| `ecoloop_tickets` | creates; assigns; sets `blocks_golive` | creates general tickets | auto-created on correction |
| `ecoloop_messages` | replies + **`internal_note`** | replies (`client_to_admin`) | `system_action` entries |
| `smart_import_jobs` | runs & confirms | runs & confirms (own section) | extraction + status |
| `smart_import_fields` | confirm/edit/reject | confirm/edit/reject | detection + confidence |
| `report_schedules` | — | fills setup | — |
| `audit_logs` | — (read only) | — (read only) | **every action** (append-only) |

---

## The three writes only the admin can make

If you remember nothing else, remember these — they are the decisions the caterer is structurally prevented from making:

1. **`caterer_modules`** — activating a module and setting its price.
2. **`validation_items` → approved** (and `corrections`) — accepting or rejecting a submission.
3. **`caterers.status = 'active'`** — approving Go-live.

Everything the caterer does is *proposing* data; everything the admin does is *deciding* on it. The system just keeps score (statuses, checklist, audit).

---

## How a single action ripples across both portals

Example — caterer submits Banking:

```
CATERER  → writes caterer_banking (PostgreSQL) + outbox
SYSTEM   → creates validation_items(type:banking) + sets banking_status='under_review'
ADMIN    → opens it in Validation Center → Approve
SYSTEM   → banking_status='validated' → recomputes golive_checklist_items(banking_validated)
```

Three actors, one record's journey — and no write ever collides because each step is owned by exactly one of them.
