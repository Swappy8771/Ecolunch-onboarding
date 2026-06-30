# Model: modules + caterer_modules (admin view)

**Storage:** MongoDB · **Admin screen:** Modules & Pricing · Modules Config
**One line:** The feature catalogue (`modules`) and each caterer's activation + pricing (`caterer_modules`). **Only the admin writes these.**

## `modules` (global catalogue)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `key` | varchar | `school_meals` · `daycare_cpe` · `camp_meals` · `reportiq` · `accounting` · `parent_subscriptions` · `css_reporting` |
| `name` | varchar | display name |
| `type` | enum | `commercial` · `infrastructure` |
| `is_active` | bool | globally available |

## `caterer_modules` (per caterer)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `module_id` | uuid | FK → modules |
| `status` | enum | `active` · `inactive` · **`pending`** |
| `effective_date` | date | when it becomes live |
| `monthly_price_cents` | int | |
| `setup_fee_cents` | int | |
| `founding_partner_free` | bool | |
| `discount_pct` | decimal | |
| `cutoff_rules` / `payout_rules` / `credit_rules` | jsonb | operational rules |
| `notification_settings` / `report_settings` | jsonb | |
| `configured_by` | uuid | FK → users (which admin set it) |

## Admin reads / writes
- **Writes:** the **only** writer of `caterer_modules` (activate, price, configure). The caterer is read-only.
- These values feed contract **merge fields** and the `modules_configured` / `pricing_configured` Go-live checks.

## Note
`status` includes **`pending`** (caterer model had only active/inactive). `configured_by` records the admin. Reconciliation #6.
