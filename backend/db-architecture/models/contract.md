# Model: Contract

## In one line
A legal agreement EcoLunch sends to the caterer to sign electronically (through Dropbox Sign).

## Where it lives
- **Database:** MongoDB
- **Collection:** `contracts`
- The list of signers is kept **inside** each contract (`signature_requests`).

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Owner caterer. |
| `type` | enum | yes | Which contract (see below). |
| `status` | enum | yes | Where it is in the signing process (see below). |
| `version` | number | yes | Version (if re-sent). |
| `sent_at` | datetime | no | When it was sent. |
| `signed_at` | datetime | no | When it was fully signed. |
| `dropbox_sign_request_id` | text | no | The id in Dropbox Sign (used to match webhook updates). |
| `signed_document_id` | UUID | no | Link to the signed PDF in [documents](./document.md). |
| `audit_trail_document_id` | UUID | no | Link to the signing audit trail (admin only). |
| `linked_modules` | list | no | Which modules this contract covers. |
| `merge_fields` | object | no | The values filled into the template (admin only — hidden from caterer). |
| `signature_requests` | list | no | The signers: each has `signer_name`, `signer_email`, `status`, `order`, `viewed_at`, `signed_at`. |
| `created_at` / `updated_at` | datetime | yes | Timestamps. |

## Contract types — `type`

| Value | What it is |
|-------|-----------|
| `msa` | Master Service Agreement (the main contract). |
| `nda` | Non-Disclosure Agreement. |
| `dpa` | Data Processing Agreement. |
| `platform_terms` | EcoLunch platform terms of use. |
| `food_safety` | Food safety compliance agreement. |
| `module_annex` | An add-on for a specific module (pricing, rules). |
| `fee_schedule` | The fee schedule document. |

## Signing status — `status`

| Value | What the caterer sees | 
|-------|----------------------|
| `draft` | (hidden — caterer doesn't see it) |
| `ready_to_send` | (hidden) |
| `sent` | "Signature Requested" — ready to sign. |
| `viewed` | "Viewed" — they opened it. |
| `partially_signed` | Some signers done, waiting for others. |
| `signed` | "Signed" — done, downloadable. |
| `declined` | Someone declined — contact support. |
| `expired` | The request expired — admin must resend. |
| `canceled` | The request was canceled. |

## How it connects
- Belongs to one [caterer](./caterer.md).
- When signed, the PDF is saved as a [document](./document.md) (category "contracts").
- Completing all required contracts ticks the `contracts_signed` item on the [golive-checklist](./golive-checklist.md).

## Rules & checks
- The caterer **only views and signs** — they can't create, send, or cancel contracts (admins do that).
- The caterer never sees `merge_fields`, the audit trail, or template ids.
- `draft` and `ready_to_send` contracts are not shown to the caterer at all.
- Status updates come from **Dropbox Sign webhooks** (we verify they're genuine).
- If the same webhook arrives twice, it updates the same contract once (matched by `dropbox_sign_request_id`).

## Lifecycle
```
admin creates (draft) ──► sends (sent) ──► caterer opens (viewed) ──► signs ──► (signed)
                                                            └► declined / expired / canceled
on "fully signed": save signed PDF, mark contracts_status = validated, re-check Go-live
```

## Schema (for developers)
```js
required: ["_id","caterer_id","type","status"]
type:   enum ["msa","nda","dpa","platform_terms","food_safety","module_annex","fee_schedule"]
status: enum ["draft","ready_to_send","sent","viewed","partially_signed","signed","declined","expired","canceled"]
// indexes
{ caterer_id: 1 }
{ dropbox_sign_request_id: 1 } UNIQUE SPARSE
```
