# Model: menus (admin view)

**Storage:** MongoDB · **Admin screen:** Caterer → Menus & Packages · Validation Center
**One line:** Menu records per caterer; admin validates or rejects them.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `establishment_id` | uuid | FK → establishments — NULL = applies to all |
| `type` | enum | `school` · `daycare` · `camp` · **`rotating_cycle`** · **`common_meals`** |
| `name` | varchar | |
| `status` | enum | `draft` · `submitted` · `under_review` · `validated` · `rejected` |
| `smart_import_job_id` | uuid | FK → smart_import_jobs (if imported) |

## Admin reads / writes
- **Reads:** menu list with name/type/status; a menu validation item on submit.
- **Writes:** validates / rejects (`status`).

## Note
Canonical `type` includes **`rotating_cycle`** and **`common_meals`** — so these are **menu types**, not separate models. This resolves the earlier "packages / common meals" doubt (reconciliation #5). Dishes are a finer-grained caterer-side table (`dishes`) not separately listed in admin doc 11 (#13).
