# Model: contracts + signature_requests (admin view)

**Storage:** MongoDB · **Admin screen:** Contract Management
**One line:** Contracts the admin sends via Dropbox Sign, plus one signer row per contract.

> **`signature_requests` is its OWN table** (one row per signer per contract) — not embedded. This is a correction vs the caterer-side model, which embedded it. (Reconciliation #1.)

## `contracts`
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `type` | enum | `msa` · `nda` · `dpa` · `platform_terms` · `food_safety` · `module_annex` · `fee_schedule` |
| `template_id` | varchar | **Dropbox Sign template id (admin config)** |
| `status` | enum | `draft` · `ready_to_send` · `sent` · `viewed` · `partially_signed` · `signed` · `declined` · `expired` · **`cancelled`** · **`error`** |
| `version` | int | for reissued contracts |
| `sent_at` / `signed_at` | timestamptz | |
| `dropbox_sign_request_id` | varchar | unique — from Dropbox Sign |
| `signed_document_id` | uuid | FK → documents (signed PDF) |
| `audit_trail_document_id` | uuid | FK → documents (Dropbox Sign audit trail) |
| `linked_modules` | jsonb | array of caterer_module ids (module annexes) |

## `signature_requests` (separate table)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `contract_id` | uuid | FK → contracts |
| `caterer_id` | uuid | FK → caterers |
| `dropbox_sign_request_id` | varchar | unique |
| `signer_name` / `signer_email` | varchar | |
| `status` | enum | `sent` · `viewed` · `signed` · `declined` · `expired` · `cancelled` · `error` |
| `merge_fields` | jsonb | snapshot of values used (client_name, monthly_rate, start_date…) |
| `sent_at` / `signed_at` | timestamptz | |

## Webhook events (Dropbox Sign → backend)
`signature_request_sent` · `_viewed` · `_signed` · **`_all_signed`** (download PDF, store in Dropbox, update status, re-eval go-live, create validation item, audit) · `_declined` · `_expired` · `_canceled` · `_error`

## Admin reads / writes
- **Writes:** creates & sends contracts; confirms merge fields from `caterer_modules`. Status updates arrive via webhooks (idempotent on `dropbox_sign_request_id`).
- Caterer-facing projection hides `template_id`, `merge_fields`, `audit_trail_document_id`.
