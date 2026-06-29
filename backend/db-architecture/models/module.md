# Model: Module (+ Caterer Module)

## In one line
The features a caterer uses (School Meals, Daycare, Accounting…) and their pricing. The admin decides these — the caterer can only look.

## Where it lives
- **Database:** MongoDB
- **Collections:** `modules` (the master list) and `caterer_modules` (what each caterer has)

## Why two collections?
- `modules` = the **catalogue** of all features EcoLunch offers (same for everyone).
- `caterer_modules` = **this caterer's copy**, with its on/off status, price, and settings.

## What it stores — `modules` (the catalogue)

| Field | Type | Meaning |
|-------|------|---------|
| `_id` | UUID | Unique id. |
| `key` | text | Short code (e.g. `school_meals`). |
| `name` | text | Display name. |
| `type` | enum | `commercial` (paid feature) or `infrastructure` (always-on plumbing). |
| `is_active` | yes/no | Whether the feature exists in the catalogue. |

## What it stores — `caterer_modules` (per caterer)

| Field | Type | Meaning (plain English) |
|-------|------|--------------------------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer. |
| `module_id` | UUID | Which catalogue module this is. |
| `status` | enum | `active` or `inactive` for this caterer. |
| `effective_date` | date | The date the module turns on. |
| `monthly_price_cents` | number | Monthly price in cents. |
| `setup_fee_cents` | number | One-time setup fee in cents. |
| `founding_partner_free` | yes/no | Free for a founding partner. |
| `discount_pct` | number | Any discount. |
| `cutoff_rules` | object | Order cut-off rules. |
| `payout_rules` | object | Payout/fee rules. |
| `credit_rules` | object | Absence/credit rules. |
| `notification_settings` | object | Notification preferences. |
| `report_settings` | object | Report preferences. |
| `created_at` / `updated_at` | datetime | Timestamps. |

## The key rule: "module-driven everything"
A module shows its content in the caterer portal **only when both are true**:
```
status = 'active'   AND   effective_date is today or earlier
```
If a module isn't active, its sections, documents, menus, and Go-live items simply don't appear. This is why the portal looks different for each caterer.

## Commercial modules (the paid features)
`school_meals` · `daycare_meals` · `camp_meals` · `reportiq` · `accounting` · `parent_subscriptions` · `css_reporting`

## How it connects
- `caterer_modules` belongs to one [caterer](./caterer.md) and points to one `modules` entry.
- Drives what appears in [establishment](./establishment.md), [menu](./menu.md), [document](./document.md), and [golive-checklist](./golive-checklist.md).

## Rules & checks
- **Read-only in this portal.** The caterer can never turn modules on/off or change prices — only EcoLunch admins can.
- Pricing must be set for every active module before Go-live.

## Schema (for developers)
```js
// modules
{ key, name, type: enum ["commercial","infrastructure"], is_active }
{ key: 1 } UNIQUE

// caterer_modules
required: ["_id","caterer_id","module_id","status"]
status: enum ["active","inactive"]
monthly_price_cents: int >= 0
{ caterer_id: 1, module_id: 1 } UNIQUE
```
