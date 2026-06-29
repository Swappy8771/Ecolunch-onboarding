# 04 — Admin Additions to the Shared Schema

The admin portal uses the **same tables** as the caterer portal — but a few **fields and enum values** exist mainly for the admin side. They should be reflected in the shared models in [`../db-architecture/models/`](../db-architecture/models/). None of these is a new table.

---

## 1. Fields to add (admin-facing)

| Table | Field to add | Why | Who sees it |
|-------|--------------|-----|-------------|
| `users` | `status` (`active` / `inactive` / `suspended`), `phone` | Admin can suspend accounts | admin |
| `caterer_onboarding_files` | `admin_notes` (text) | Internal notes per caterer file | **admin only** |
| `documents` | `linked_validation_item_id` | Ties a document to the review it belongs to | both |
| `caterer_modules` | `configured_by` (→ user) | Records which admin set the pricing | admin |
| `contracts` | `template_id` | The Dropbox Sign template used | admin only |
| `caterers` | `onboarding_progress_pct` | Computed % shown in the admin list | both |

---

## 2. Enum values to extend

| Table.field | Add value | Meaning |
|-------------|-----------|---------|
| `caterer_onboarding_files.golive_status` | `blocked` | Go-live is actively blocked (not just "not ready") |
| `caterer_modules.status` | `pending` | Module set up but not yet effective |

---

## 3. Reconciliation needed (the spec disagrees with itself)

These are points where the **admin** docs and the **caterer** docs describe the same table differently. They need one agreed answer — most tie back to [`../OPEN-DESIGN-DOUBTS.md`](../OPEN-DESIGN-DOUBTS.md).

| Table.field | Admin docs say | Caterer/our model says | Note |
|-------------|----------------|------------------------|------|
| `establishments.status` | `pending` / `confirmed` / `inactive` | `pending` / `confirmed` / `active` | "active" vs "inactive" — pick the set |
| `menus.type` | adds `rotating_cycle`, `common_meals` | `school` / `daycare` / `camp` | Are rotating cycle & common meals **menu types** or **attributes**? Ties to Doubt #7/#8 |
| `audit_logs.actor_type` | `caterer_staff` | `caterer` | Use one label for caterer actors |
| `caterers` name + address | flat `address`, `neq_number` | nested `address{}`, `tax{}` | Field shape — ties to Doubt #3 |
| `caterer_banking` field names | `swift_bic`, `validation_status` | `bic_swift` (no status stored here) | Naming + where banking status lives (we keep status in `caterer_onboarding_files`) |

---

## 4. Confirmed: no new tables

A few things that *sound* like they need their own table actually don't:

| Concept | How it's stored |
|---------|-----------------|
| **Support Access Session** | Not a table — logged in `audit_logs` (`support_access_start` / `support_access_end`, `actor_type: support_session`) |
| **The caterer "onboarding file" workspace** (11 sections) | Not a table — a UI grouping over the shared tables; status lives in `caterer_onboarding_files` |
| **Internal notes** | Not a table — `caterer_onboarding_files.admin_notes`, `validation_items.internal_notes`, and `ecoloop_messages.type='internal_note'` |
| **Admin dashboard KPIs** | Not a table — computed by counting existing tables |

---

## 5. Action

Once the **reconciliation** answers (section 3) come back from the client, fold sections 1–2 into the model files in `db-architecture/models/` and the changes are complete. Until then, the shared models stand as-is and these are documented additions, not yet applied.
