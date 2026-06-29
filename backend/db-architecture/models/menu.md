# Model: Menu (+ Dishes)

## In one line
The food the caterer offers — menus, the dishes inside them, and packages — shaped by which modules are active.

## Where it lives
- **Database:** MongoDB
- **Collections:** `menus` and `dishes`

## Why it changes shape
Also **module-driven**:
- School Meals → School Menus + Common Meals + Rotating Cycle
- Daycare/CPE → Daycare Menus + Packages
- Camp → Camp Menus + Packages

A menu can also carry a weekly **schedule** (which dish on which day), so the schedule is kept **inside** the menu.

## What it stores — `menus`

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Owner caterer. |
| `establishment_id` | UUID | no | Which place this menu is for. Empty = applies to all. |
| `name` | text | yes | Menu name. |
| `type` | enum | yes | `school`, `daycare`, or `camp`. |
| `age_group` | text | (daycare) | Infant / Toddler / Pre-school. |
| `session_dates` | list | (camp) | Which camp sessions it covers. |
| `rotation_weeks` | number | (cycle) | Length of a rotating cycle (e.g. 3 weeks). |
| `choices_per_day` | number | (cycle) | How many dish choices each day. |
| `package_name` | text | (package) | Name of a package (e.g. "Full Day"). |
| `package_price_cents` | number | (package) | Package price in cents. |
| `status` | enum | yes | Where the menu is in review (see below). |
| `smart_import_job_id` | UUID | no | The auto-import job that filled this menu, if any. |
| `schedule` | list | no | Weekly plan: each entry has `week_number`, `day_of_week`, `choice_slot`, `dish_id`, `price_cents`. |
| `created_at` / `updated_at` | datetime | yes | Timestamps. |

## What it stores — `dishes`

| Field | Type | Meaning |
|-------|------|---------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer. |
| `name` | text | Dish name. |
| `description` | text | Optional description. |
| `price_cents` | number | Price in cents. |
| `category` | text | Type of dish. |
| `photo_url` | text | Optional photo link. |
| `available_days` | list | Days it's offered (mon–fri). |
| `allergens` | list | Each entry: `allergen_code` + `is_trace` (true = trace amount). |

## Statuses explained — `menus.status`

| Value | What it means | Set by |
|-------|---------------|--------|
| `draft` | Being prepared, not submitted. | caterer |
| `submitted` | Sent in (brief moment before review starts). | system |
| `under_review` | Admin is checking it. | system |
| `validated` | Admin approved it. | admin |
| `published` | Live for parents to see (after Go-live). | system |

## How it connects
- Belongs to one [caterer](./caterer.md); may link to an [establishment](./establishment.md).
- Each schedule entry points to a `dish`.
- May be linked to a [smart-import](./smart-import.md) job.

## Rules & checks
- A menu's `type` must match an active module.
- Schedule entries must point to dishes of the same caterer; `week_number` can't exceed `rotation_weeks`.
- Prices are in cents and can't be negative.
- Cutoff rules shown in this section are **read-only** (they come from the module settings the admin set).
- Auto-imported values must be confirmed by the caterer before they count (see [smart-import](./smart-import.md)).

## Lifecycle
```
draft ──► submit ──► under_review ──► validated ──► (after Go-live) published
```

## Schema (for developers)
```js
// menus
required: ["_id","caterer_id","name","type","status"]
type:   enum ["school","daycare","camp"]
status: enum ["draft","submitted","under_review","validated","published"]
package_price_cents: int >= 0
// indexes
{ caterer_id: 1, type: 1 }

// dishes index
{ caterer_id: 1 }
```
