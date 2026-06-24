# 08 — Contracts & Signatures

---

## Purpose

The caterer views and signs contracts sent by EcoLunch Admin. The caterer does not create or request contracts. Admin sends them via Dropbox Sign — the caterer receives a signing link and completes the signature electronically.

---

## Contract Types the Caterer May Receive

| Type | What It Is |
|------|-----------|
| `msa` | Master Service Agreement — main contract |
| `nda` | Non-Disclosure Agreement |
| `dpa` | Data Processing Agreement |
| `platform_terms` | EcoLunch platform terms of use |
| `food_safety` | Food safety compliance agreement |
| `module_annex` | Annex per activated module (pricing, rules) |
| `fee_schedule` | Fee schedule document |

---

## Contract Lifecycle (caterer view)

| Status | What the Caterer Sees |
|--------|----------------------|
| `draft` | Not visible to caterer |
| `ready_to_send` | Not visible to caterer |
| `sent` | Contract appears — "Signature Requested" badge |
| `viewed` | Badge updates to "Viewed" |
| `partially_signed` | Multiple signers — some signed, waiting for others |
| `signed` | Green "Signed" badge — download available |
| `declined` | Red "Declined" badge — caterer must contact EcoLoop |
| `expired` | Red "Expired" badge — admin must resend |

---

## Signing Flow

```
Admin sends contract via Dropbox Sign
  → Caterer receives email with signing link
    → Caterer clicks "Sign Now" in the portal
      → Redirect to Dropbox Sign hosted signing page
        → Caterer completes electronic signature
          → Dropbox Sign webhook fires
            → Backend updates contracts.status → 'signed'
            → Signed PDF stored in Document Vault (category = 'contracts')
            → caterer_onboarding_files.contracts_status → 'validated'
```

---

## What the Caterer Sees Per Contract

- Contract name and type
- Status badge
- Date sent
- Date signed (once signed)
- "Sign Now" button (if status = `sent` or `viewed`)
- "Download" button (if status = `signed`)
- Version number (if contract was reissued)

The caterer does NOT see:
- Template IDs
- Merge field values used
- Internal admin notes
- Audit trail document (admin only)

---

## Database Tables Used

| Table | Fields Read by Caterer Portal |
|-------|------------------------------|
| `contracts` | `type`, `status`, `sent_at`, `signed_at`, `version` |
| `signature_requests` | `status`, `signer_name`, `signed_at` |
| `documents` | `category = 'contracts'` — signed PDFs only, `visibility = 'client_visible'` |
| `caterer_onboarding_files` | `contracts_status` |
