# Model: Caterer

## In one line
The food company being onboarded — and the center of the whole system. Every other record belongs to a caterer.

## Where it lives
- **Database:** MongoDB
- **Collection:** `caterers`

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | The caterer's unique id. Every other record uses this as `caterer_id`. |
| `company_name` | text | yes | The name used day-to-day. |
| `legal_name` | text | yes | The official registered company name. |
| `trading_name` | text | yes | The brand/operating name. |
| `organization_type` | text | yes | Company type (e.g. SARL, SAS, Inc.). |
| `logo_url` | text | yes | Link to the logo file (stored in Dropbox). |
| `website` | text | no | Company website. |
| `founded_year` | number | no | Year the company started. |
| `industry_sector` | text | yes | Usually "Institutional Catering". |
| `employee_count` | number | yes | How many staff. |
| `annual_capacity_meals` | number | yes | How many meals they can make per year. |
| `service_types` | list | yes | Types of service they offer (driven by their modules). |
| `kitchen_locations` | number | yes | How many kitchens. |
| `primary_contact` | object | yes | Main contact: `name`, `title`, `email`, `phone`. |
| `secondary_contact` | object | no | Backup contact: `name`, `email`. |
| `address` | object | yes | `registered`, `city`, `postal_code`, `country`, `region`, `operating`. |
| `tax` | object | yes | Tax ids: `neq_number`, `siren_number`, `vat_number`, `ape_naf_code`, `rcs_registration`. |
| `status` | enum | yes | Where the caterer is in its life (see below). |
| `phase` | enum | yes | Onboarding phase `1` or `2`. |
| `verticals` | list | no | Which markets they serve (schools, daycares, camps). |
| `assigned_admin_id` | UUID | no | The EcoLunch admin looking after them. |
| `plan_type` | text | no | Their plan (set around Go-live). |
| `go_live_at` | datetime | no | When they went live. Empty until approved. |
| `created_at` / `updated_at` | datetime | yes | Bookkeeping timestamps. |

## Statuses explained — `status`

| Value | What it means | Set by |
|-------|---------------|--------|
| `onboarding` | Still being set up. This is the value during the whole onboarding journey. | system (at creation) |
| `active` | Approved and live on the platform. | system, only at Go-live approval |
| `paused` | Temporarily switched off. | admin |
| `archived` | No longer active; kept for records. | admin |

> **Important:** `status` becomes `active` **only** when an admin approves Go-live. It must never be set to `active` earlier.

## How it connects
- A caterer **has one** [banking](./banking.md) record.
- A caterer **has many** [users](./user.md), [establishments](./establishment.md), [menus](./menu.md), [documents](./document.md), [contracts](./contract.md), and so on.
- A caterer **has one** [onboarding-file](./onboarding-file.md) that tracks its progress.
- The profile fields here are filled in the portal's **Profile** section.

## Rules & checks
- The caterer fills the profile fields; only an admin can set `status`, `plan_type`, and `go_live_at`.
- Emails must look like real emails. Tax ids depend on country (Quebec uses NEQ; France uses SIREN/SIRET/NAF).
- A caterer can only ever see and edit **its own** record.

## Lifecycle
```
created (onboarding) ──► fills profile ──► admin validates ──► …rest of onboarding… ──► Go-live approved (active)
                                                                                    └► paused / archived (later, by admin)
```

## Schema (for developers)
```js
// validator highlights
required: ["_id","legal_name","company_name","status","created_at"]
status: enum ["onboarding","active","paused","archived"]
phase:  enum [1,2]
"primary_contact.email": pattern ^[^@\s]+@[^@\s]+\.[^@\s]+$

// indexes
{ status: 1 }
{ assigned_admin_id: 1 }
```
