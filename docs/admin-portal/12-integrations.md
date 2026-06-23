# 12 — Integrations

---

## Overview

The Admin Onboarding Portal relies on two external Dropbox services:

| Service | Role |
|---------|------|
| **Dropbox Storage** | Binary file storage — all documents, PDFs, signed contracts |
| **Dropbox Sign** | E-signature workflow — template merge, PDF generation, signing UX, audit trail |

These are two separate products from Dropbox. They serve different purposes and are used differently.

---

## Dropbox Storage

### What It Is

Dropbox Storage is the file system for all documents in the portal. EcoLunch does not store binary files in its own database or servers. All files go to Dropbox.

### What Goes There

Every file uploaded anywhere in the portal:
- Documents uploaded to the Document Vault
- Smart Import source files
- Signed contract PDFs (downloaded from Dropbox Sign after signing, then re-uploaded here)
- Dropbox Sign audit trail PDFs
- Any admin-uploaded internal documents

### Folder Structure (Recommended)

```
/Onboarding/
  Caterers/
    {id}_{caterer_name}/
      01_Profile/
      02_Legal/
      03_Banking/
      04_Compliance/
      05_Insurance/
      06_Establishments/
      07_Menus/
      08_Modules/
      09_Contracts_Signatures/
      10_Golive/
      11_Internal/
```

### What the Database Stores

The `documents` table stores only:
- `dropbox_file_id` — Dropbox's unique file identifier
- `dropbox_file_path` — The path in Dropbox

The app server never holds binary files. Viewing a document means generating a short-lived Dropbox link and redirecting the user — not streaming the file through the app.

### Upload Flow

```
User uploads file in portal
        │
        ▼
Backend receives file
        │
        ▼
Backend uploads file to Dropbox Storage
        │
        ▼
Dropbox returns dropbox_file_id + path
        │
        ▼
Backend creates documents record (dropbox_file_id, path, category, source, status, caterer_id)
        │
        ▼
File never touches app database binary storage
```

---

## Dropbox Sign

### What It Is

Dropbox Sign (formerly HelloSign) is the e-signature platform. EcoLunch uses it to:
- Store contract templates with merge fields
- Send contracts to signers
- Handle the signing experience
- Generate signed PDFs with certificates of completion
- Fire webhooks back to EcoLunch when events happen

### Contract Templates

Contract templates are created and maintained inside the Dropbox Sign dashboard by EcoLunch. Each template has a `template_id`. These IDs are stored as **application config / environment variables** — not hardcoded in migration files or source code.

Each template has pre-defined merge fields:

| Merge Field | Populated From |
|-------------|---------------|
| `client_name` | `caterers.company_name` |
| `legal_name` | `caterers.legal_name` |
| `monthly_rate` | `caterer_modules.monthly_price_cents` |
| `start_date` | `caterer_modules.effective_date` |
| `module_name` | `modules.name` |
| `fee_percentage` | `caterer_modules.payout_rules` |
| `signatory_email` | Confirmed by admin |
| `signatory_name` | Confirmed by admin |

### Sending a Contract — API Call

```http
POST https://api.hellosign.com/v3/signature_request/send_with_template
Authorization: Basic {api_key}

{
  "template_id": "abc123",
  "subject": "EcoLunch Master Service Agreement",
  "message": "Please review and sign your MSA.",
  "signers": [
    {
      "email_address": "signatory@caterer.com",
      "name": "Jean Tremblay",
      "role": "Caterer"
    }
  ],
  "custom_fields": {
    "client_name": "Traiteur ABC",
    "monthly_rate": "$299",
    "start_date": "2025-09-01",
    ...
  }
}
```

Response includes `signature_request_id` — stored in `contracts.dropbox_sign_request_id` and `signature_requests.dropbox_sign_request_id`.

### Webhook Events

Dropbox Sign fires webhooks to EcoLunch at: `POST /webhooks/dropbox-sign`

EcoLunch must handle all of these:

| Event | What EcoLunch Does |
|-------|--------------------|
| `signature_request_sent` | Update `contracts.status` → `sent`. Log to audit. |
| `signature_request_viewed` | Update `signature_requests.status` → `viewed`. Log. |
| `signature_request_signed` | Update individual signer status. Log. |
| `signature_request_all_signed` | **Primary event.** Download signed PDF + audit trail. Upload to Dropbox Storage. Update `contracts.status` → `signed`. Create `documents` records. Re-evaluate go-live checklist. Create validation item. Log. |
| `signature_request_declined` | Update status → `declined`. Create EcoLoop ticket. Notify admin. Log. |
| `signature_request_expired` | Update status → `expired`. Notify admin. Log. |
| `signature_request_canceled` | Update status → `cancelled`. Log. |
| `signature_request_error` | Update status → `error`. Alert admin. Log. |

### After `signature_request_all_signed` — Full Flow

```
Webhook received: signature_request_all_signed
        │
        ▼
Verify webhook signature (Dropbox Sign provides HMAC verification)
        │
        ▼
Download signed PDF from Dropbox Sign API
Download audit trail PDF from Dropbox Sign API
        │
        ▼
Upload both PDFs to Dropbox Storage at /09_Contracts_Signatures/
        │
        ▼
Create two documents records (source: contract_signed):
  - Signed PDF document
  - Audit trail document
        │
        ▼
Update contracts:
  - status → signed
  - signed_at → now
  - signed_document_id → new documents.id
  - audit_trail_document_id → new documents.id
        │
        ▼
Update signature_requests.status → signed
        │
        ▼
Re-evaluate golive_checklist_items where requirement = contracts_signed
        │
        ▼
Create validation_item (type: contract, priority: critical)
        │
        ▼
Create audit_log entry (entity: contract, action: signed)
```

---

## Why Two Separate Dropbox Services?

| Question | Answer |
|----------|--------|
| Why not store signed contracts directly from Dropbox Sign? | Dropbox Sign retains its own copies, but EcoLunch needs the files in its own controlled Dropbox Storage for document vault access, versioning, and audit. |
| Why not store binary PDFs in the app database? | Scale, cost, and simplicity. Database is for relational data. Blob storage is for files. |
| Why Dropbox Sign instead of building our own signing? | Building a legally compliant e-signature system with certificate of completion, audit trail, and multi-country validity is a multi-year project. Dropbox Sign is the established solution. |

---

## Environment Config Required

| Variable | Used For |
|----------|---------|
| `DROPBOX_ACCESS_TOKEN` | Dropbox Storage API authentication |
| `DROPBOX_SIGN_API_KEY` | Dropbox Sign API authentication |
| `DROPBOX_SIGN_CLIENT_ID` | Dropbox Sign OAuth (if used) |
| `DROPBOX_SIGN_WEBHOOK_SECRET` | HMAC verification for incoming webhooks |
| `CONTRACT_TEMPLATE_MSA_ID` | Dropbox Sign template_id for MSA |
| `CONTRACT_TEMPLATE_NDA_ID` | Dropbox Sign template_id for NDA |
| `CONTRACT_TEMPLATE_DPA_ID` | Dropbox Sign template_id for DPA |
| `CONTRACT_TEMPLATE_PLATFORM_TERMS_ID` | Dropbox Sign template_id for Platform Terms |
| `CONTRACT_TEMPLATE_FOOD_SAFETY_ID` | Dropbox Sign template_id for Food Safety Annex |
| `CONTRACT_TEMPLATE_MODULE_ANNEX_ID` | Dropbox Sign template_id for Module Annex |
| `CONTRACT_TEMPLATE_FEE_SCHEDULE_ID` | Dropbox Sign template_id for Fee Schedule |
