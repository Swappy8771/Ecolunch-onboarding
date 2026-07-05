# Model: Report Schedule

## In one line
The setup for automatic reports — what report, how often, to whom, and in what format. The caterer fills the setup; the actual sending happens later (in the live portal).

## Where it lives
- **Database:** MongoDB
- **Collection:** `report_schedules`

## What it stores

| Field | Type | Meaning (plain English) |
|-------|------|--------------------------|
| `_id` | UUID | Unique id. |
| `caterer_id` | UUID | Owner caterer. |
| `report_type` | text | Which report (e.g. orders summary). |
| `frequency` | text | How often (daily, weekly, monthly…). |
| `recipient_emails` | list | Who receives it. |
| `format` | text | File format (PDF, Excel…). |
| `distribution_method` | text | How it's delivered (email, etc.). |
| `accounting_software` | text | The accounting tool to export to, if relevant. |
| `enabled` | yes/no | Whether it's turned on (used in the live portal, not onboarding). |
| `next_shipment_at` | datetime | When the next one goes out (live portal). |
| `last_sent_at` | datetime | When the last one was sent (live portal). |

## How it connects
- Belongs to one [caterer](./caterer.md).
- Used by the **Accounting** and **ReportIQ** modules — only relevant if those modules are active.

## Rules & checks
- During onboarding, the caterer only fills the **setup** fields (`report_type`, `frequency`, `recipient_emails`, `format`, `distribution_method`, `accounting_software`).
- The scheduling fields (`enabled`, `next_shipment_at`, `last_sent_at`) are used after Go-live, by the operational portal.
- `recipient_emails` must be valid emails.

## Schema (for developers)
```js
required: ["_id","caterer_id","report_type"]
// index
{ caterer_id: 1 }
```
