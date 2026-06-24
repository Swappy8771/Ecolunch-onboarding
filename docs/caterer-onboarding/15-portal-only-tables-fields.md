# 15 — Portal-Only Tables: Field Reference

---

## Onboarding Caterer Portal Only Tables

These tables exist only in the Onboarding Caterer Portal. The Main Caterer Portal never reads or writes them.

---

### `caterer_onboarding_files`

Tracks the completion status of every onboarding section per caterer.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `profile_status` | enum | `not_started` / `in_progress` / `submitted` / `validated` / `action_required` |
| `banking_status` | enum | Same values as above |
| `establishments_status` | enum | Same values as above |
| `menus_status` | enum | Same values as above |
| `documents_status` | enum | Same values as above |
| `contracts_status` | enum | Same values as above |
| `modules_status` | enum | Same values as above |
| `golive_status` | enum | `not_ready` / `ready` / `approved` |
| `updated_at` | timestamp | Last update time |

---

### `golive_checklist_items`

One row per Go-live requirement per caterer. Requirements vary based on active modules.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `requirement` | string | Requirement key (e.g. `profile_validated`, `menus_validated`) |
| `status` | enum | `complete` / `incomplete` / `blocked` / `waived` |
| `blocking_reason` | text | Shown to caterer when `status = 'blocked'` |
| `linked_entity_type` | string | What is blocking — e.g. `ecoloop_ticket`, `correction` |
| `linked_entity_id` | uuid | ID of the blocking entity |
| `checked_at` | timestamp | When the requirement was last evaluated |

---

### `corrections`

Correction requests created by admin when a submitted section fails validation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `description` | text | What the caterer needs to fix |
| `section` | string | Which section the correction belongs to (e.g. `profile`, `menus`) |
| `priority` | enum | `high` / `medium` / `low` |
| `status` | enum | `open` / `in_progress` / `resolved` / `closed` |
| `ecoloop_ticket_id` | uuid | Linked EcoLoop thread for this correction |
| `created_by` | uuid | Admin user who created the correction |
| `created_at` | timestamp | When the correction was created |

---

### `smart_import_jobs`

One job per document upload that triggers Smart Import extraction.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `section` | string | Which section triggered the import (e.g. `profile`, `banking`, `menus`) |
| `source_document_id` | uuid | Uploaded document that was processed |
| `detected_doc_type` | string | What type of document was detected (e.g. `kbis`, `rib`, `menu_pdf`) |
| `status` | enum | `processing` / `ready_for_review` / `completed` / `failed` |
| `confirmed_by` | uuid | Caterer user who confirmed the extracted fields |
| `confirmed_at` | timestamp | When caterer completed review |
| `applied_at` | timestamp | When fields were applied to the section |

---

### `smart_import_fields`

One row per extracted field per Smart Import job.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `job_id` | uuid | Links to `smart_import_jobs` |
| `field_name` | string | Name of the field extracted (e.g. `company_name`, `iban`) |
| `detected_value` | text | Raw value extracted from the document |
| `mapped_value` | text | Value mapped to the correct field format |
| `confidence_score` | decimal | 0.00 to 1.00 — extraction confidence |
| `status` | enum | `pending` / `confirmed` / `manually_edited` / `rejected` |
| `applied_value` | text | Final value applied to the section (after caterer action) |
| `edited_by` | uuid | Caterer user if status is `manually_edited` |

---

## Main Caterer Portal Only Tables

These tables are created after Go-live. The Onboarding Caterer Portal never touches them.

---

### `orders`

One row per meal order placed by a parent.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `parent_id` | uuid | Parent who placed the order |
| `child_id` | uuid | Child the meal is for |
| `establishment_id` | uuid | School or daycare the order is for |
| `dish_id` | uuid | Dish ordered |
| `date` | date | Meal date |
| `status` | enum | `pending` / `confirmed` / `produced` / `delivered` / `cancelled` |
| `total_cents` | integer | Order total in cents |
| `quantity` | integer | Number of meals |
| `payment_status` | enum | `unpaid` / `paid` / `refunded` |
| `created_at` | timestamp | When the order was placed |

---

### `parents`

One row per parent account linked to a caterer.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `first_name` | string | Parent first name |
| `last_name` | string | Parent last name |
| `email` | string | Parent email |
| `phone` | string | Parent phone |
| `status` | enum | `active` / `inactive` |
| `registered_at` | timestamp | When parent account was created |

---

### `children`

One row per child linked to a parent.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `parent_id` | uuid | Links to `parents` |
| `caterer_id` | uuid | Links to `caterers` |
| `establishment_id` | uuid | School or daycare the child attends |
| `first_name` | string | Child first name |
| `last_name` | string | Child last name |
| `birth_date` | date | Child date of birth |
| `class_name` | string | Class / group |
| `status` | enum | `active` / `inactive` |

---

### `subscriptions`

One row per parent subscription to a daycare package.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `parent_id` | uuid | Links to `parents` |
| `caterer_id` | uuid | Links to `caterers` |
| `establishment_id` | uuid | Daycare this subscription is for |
| `package_id` | uuid | Package selected (links to `menus`) |
| `start_date` | date | Subscription start |
| `end_date` | date | Subscription end |
| `frequency` | string | Days per week |
| `price_cents` | integer | Subscription price |
| `status` | enum | `active` / `paused` / `cancelled` |

---

### `subscription_children`

Links children to subscriptions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `subscription_id` | uuid | Links to `subscriptions` |
| `child_id` | uuid | Links to `children` |

---

### `dish_reviews`

One row per parent rating of a dish.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `dish_id` | uuid | Links to `dishes` |
| `parent_id` | uuid | Parent who left the review |
| `caterer_id` | uuid | Links to `caterers` |
| `order_id` | uuid | Order this review relates to |
| `rating` | decimal | 1.0 to 5.0 star rating |
| `comment` | text | Optional written review |
| `created_at` | timestamp | When the review was submitted |

---

### `custom_reports`

One row per report built by the caterer in Personal Reports (EcoPulse CC™).

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `name` | string | Report name |
| `description` | text | Optional description |
| `data_source` | string | Source table — `orders` / `schools` / `payments` / `menus` |
| `fields_json` | json | Selected fields list |
| `filters_json` | json | Applied filters |
| `grouping` | string | Grouping selected — `by_date` / `by_school` / `by_caterer` / `by_class` / etc. |
| `visualization_type` | string | `painting` / `bar_chart` / `line_graph` / `metric_maps` / `camembert` |
| `is_shared` | boolean | Whether shared with team |
| `created_by` | uuid | Caterer user who created the report |
| `created_at` | timestamp | When the report was saved |

---

### `caterer_sidebar_preferences`

One row per sidebar module per caterer — stores visibility preference.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `module_key` | string | Sidebar item key (e.g. `orders`, `my_schools`, `reportiq`) |
| `visible` | boolean | Whether caterer has chosen to show this item |
| `updated_at` | timestamp | Last change |

---

### `sezzle_transactions`

One row per Sezzle payment event.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `parent_id` | uuid | Parent this transaction relates to |
| `order_id` | uuid | Order this payment covers |
| `amount_cents` | integer | Transaction amount |
| `type` | enum | `charge` / `refund` / `adjustment` |
| `status` | enum | `pending` / `completed` / `failed` |
| `sezzle_reference_id` | string | Sezzle's own transaction ID |
| `created_at` | timestamp | When the transaction occurred |

---

### `sezzle_plans`

One instalment plan per parent subscription (BNPL — 4 instalments).

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `parent_id` | uuid | Parent paying in instalments |
| `subscription_id` | uuid | Subscription being paid for |
| `total_amount_cents` | integer | Total plan value |
| `installments` | integer | Number of instalments (default 4) |
| `status` | enum | `active` / `completed` / `defaulted` |
| `sezzle_plan_id` | string | Sezzle's own plan ID |
| `created_at` | timestamp | When the plan was created |

---

### `sezzle_settlements`

One row per periodic payout from Sezzle to the caterer.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `caterer_id` | uuid | Links to `caterers` |
| `amount_cents` | integer | Amount paid out |
| `status` | enum | `pending` / `paid` / `failed` |
| `settlement_date` | date | Date of payout |
| `sezzle_reference_id` | string | Sezzle's own settlement ID |
| `created_at` | timestamp | When the settlement record was created |
