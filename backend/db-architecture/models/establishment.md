# Model: Establishment (+ Closures)

## In one line
The places a caterer serves — schools, daycares, or camps — plus their closure calendars (days they're closed).

## Where it lives
- **Database:** MongoDB
- **Collections:** `establishments` and `closures`

## Why it changes shape
This model is **module-driven**: what a caterer can add depends on which modules are active.
- School Meals → can add **schools** (and **CSS districts**)
- Daycare/CPE → can add **daycares**
- Camp → can add **camps**

Because schools, daycares, and camps store different things, one flexible model covers them all (this is a reason it's in MongoDB).

## What it stores — `establishments`

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Which caterer it belongs to. |
| `type` | enum | yes | `school`, `daycare`, `camp`, or `css` (see below). |
| `name` | text | yes | Name of the place. |
| `address` | text | depends | Street address. |
| `city` | text | yes | City. |
| `contact_name` | text | depends | Person to contact. |
| `contact_email` | text | depends | Their email. |
| `student_count` | number | (school) | Number of students. |
| `css_district_id` | UUID | (school) | Which CSS district this school belongs to. |
| `manager_name` | text | (daycare) | Daycare manager's name. |
| `child_capacity` | number | (daycare) | How many children. |
| `session_dates` | list | (camp) | Camp sessions: each has `start` and `end`. |
| `participant_count` | number | (camp) | Number of campers. |
| `status` | enum | yes | Setup status (see below). |
| `created_at` / `updated_at` | datetime | yes | Timestamps. |

## Types explained — `type`

| Value | What it means |
|-------|---------------|
| `school` | A school served under School Meals. |
| `css` | A school district ("Centre de services scolaire") that schools belong to. |
| `daycare` | A daycare / CPE. |
| `camp` | A seasonal camp. |

## Statuses explained — `status`

| Value | What it means | Set by |
|-------|---------------|--------|
| `pending` | Added by the caterer, not yet confirmed. | caterer |
| `confirmed` | Checked and accepted. | admin |
| `active` | Live and serving. | system at Go-live |

## What it stores — `closures`

| Field | Type | Meaning |
|-------|------|---------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer. |
| `establishment_id` | UUID | Which place is closed. |
| `date` | date | The closed day. |
| `reason` | text | Why (holiday, etc.). |
| `type` | text | Kind of closure. |
| `source` | text | Where this came from (manual, imported…). |

## How it connects
- Belongs to one [caterer](./caterer.md).
- A `school` links to a `css` establishment via `css_district_id`.
- Each closure links to one establishment.
- [Menus](./menu.md) can be linked to specific establishments.

## Rules & checks
- You can only add a `type` whose module is active (e.g. no daycares unless Daycare Meals is on).
- A school must be linked to a CSS district that belongs to the same caterer.
- Camp `session_dates` must have `start` before `end`.
- Go-live needs at least one **confirmed** establishment per active "client" module.

## Lifecycle
```
caterer adds place (pending) ──► admin confirms (confirmed) ──► Go-live (active)
```

## Schema (for developers)
```js
// establishments
required: ["_id","caterer_id","type","name","status"]
type:   enum ["school","daycare","camp","css"]
status: enum ["pending","confirmed","active"]
// indexes
{ caterer_id: 1, type: 1 }
{ css_district_id: 1 }

// closures index
{ caterer_id: 1, establishment_id: 1, date: 1 }
```
