# Model: caterer (admin view)

**Storage:** MongoDB · **Admin screen:** Dashboard · Caterers in Onboarding
**One line:** The central tenant record. The admin sees **all** of these; the caterer sees only its own.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK — central tenant id |
| `company_name` | varchar | |
| `legal_name` | varchar | |
| `trading_name` | varchar | |
| `status` | enum | `onboarding` · `active` · `paused` · `archived` |
| `phase` | int | 1 or 2 |
| `verticals` | jsonb | e.g. `["school","daycare","css"]` |
| `assigned_admin_id` | uuid | FK → users (which admin owns this caterer) |
| `onboarding_progress_pct` | int | Computed from section statuses (shown in the admin list) |
| `address` | varchar | **flat** (single string) |
| `neq_number` | varchar | NEQ (Quebec) or SIRET (France) — **flat** |
| `go_live_at` | timestamptz | NULL until go-live approved |

## Admin reads / writes
- **Reads:** the whole list, sorted/filtered; cards with status + progress + assigned admin.
- **Writes:** **creates** the caterer (Stage 1); sets `assigned_admin_id`; sets `status='active'` + `go_live_at` at Go-live.

## Note
Canonical schema keeps `address`/`neq_number` **flat** (the caterer-side model nested them under `address{}`/`tax{}`). See reconciliation #10.
