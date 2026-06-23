# 06 — Contract Management

---

## Purpose

Contract Management handles the full lifecycle of every legal agreement between EcoLunch and a caterer. This includes creating and sending contracts, tracking who has signed, storing signed PDFs, managing annexes, and maintaining a complete contract audit trail.

**Why separated from Document Vault?**
- Document Vault = where files are stored and reviewed
- Contract Management = the workflow that governs how a specific type of file (contracts) is created, sent, signed, and tracked

Signed contract PDFs end up in the Document Vault's `Contracts & Signatures` category — but the workflow that got them there lives here.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Sends contracts, monitors signing status, manages templates, views all contract history. |
| **Caterer** | ❌ Does not use this section. They receive a Dropbox Sign email and sign inside Dropbox Sign's own interface. They can view their signed contracts in their Caterer Portal. |

---

## Standard Contract Types

Every caterer goes through a set of standard contracts. The exact set depends on their verticals and modules, but the types are fixed:

| Contract Type | Purpose |
|---------------|---------|
| Master Service Agreement (MSA) | Core service relationship between EcoLunch and caterer |
| Non-Disclosure Agreement (NDA) | Confidentiality of business information |
| Data Processing Agreement (DPA) | GDPR/privacy compliance for personal data handling |
| EcoLunch Platform Terms | Terms of use for the EcoLunch platform |
| Food Safety Compliance Annex | Caterer's commitment to food safety standards |
| Module Annexes | One annex per activated commercial module |
| Fee Schedule Annexes | Pricing schedules tied to each module/service |

---

## Section Structure

The Contract Management section is organized into sub-views:

| Sub-view | What It Shows |
|----------|--------------|
| Contracts by Caterer | All contracts grouped by caterer |
| Contract Templates | Dropbox Sign template registry — template_id per contract type |
| Dropbox Sign Requests | All live signature requests and their current status |
| Sent Contracts | Contracts that have been sent but not yet signed |
| Signed Contracts | Fully executed agreements |
| Declined / Expired / Cancelled | Contracts that did not complete |
| Module Annexes | All module-specific annexes across caterers |
| Fee Schedule Annexes | All pricing annexes across caterers |
| Versions | Version history for any contract that was reissued |
| Contract Audit | Complete audit trail for all contract activity |

---

## The Dropbox Sign Signing Workflow — Step by Step

> **Why Dropbox Sign?** EcoLunch does not build its own PDF generation or e-signature flow. Dropbox Sign handles template merge, PDF generation, email delivery, signing UX, audit trail, and certificate of completion.

### Step 1 — Pre-requisite: Modules Must Be Configured First
Before sending a contract, the caterer's modules and pricing must be configured in Section 07. Contract merge fields like `monthly_rate`, `module_name`, `effective_date`, and `fee_percentage` come from `caterer_modules`. Sending a contract before module configuration will produce incorrect merge field values.

### Step 2 — Admin Selects Contract Type
Admin picks a contract type. The system looks up the `template_id` for that type from application config (environment variable — not hardcoded).

### Step 3 — Admin Confirms Merge Fields
Admin reviews and confirms the merge field values that will be injected into the template:

| Merge Field | Source |
|-------------|--------|
| `client_name` | `caterers.company_name` |
| `legal_name` | `caterers.legal_name` |
| `monthly_rate` | `caterer_modules.monthly_price_cents` |
| `start_date` | `caterer_modules.effective_date` |
| `module_name` | `modules.name` |
| `fee_percentage` | `caterer_modules.payout_rules` or discount fields |
| `signatory_email` | Confirmed by admin from caterer contacts |
| `signatory_name` | Confirmed by admin |

### Step 4 — Backend Sends to Dropbox Sign
```
POST /signature_request/send_with_template
{
  template_id: "...",
  signers: [{ email_address, name, role }],
  custom_fields: { client_name, monthly_rate, start_date, ... }
}
```
- System stores `dropbox_sign_request_id` in `contracts` and `signature_requests`
- `contracts.status` → `sent`

### Step 5 — Dropbox Sign Handles Everything Else
- Merges the template with the provided field values
- Generates the PDF
- Emails the signatory with a signing link
- Handles the signing UX (Dropbox Sign's own interface)
- Maintains its own audit trail and certificate of completion

### Step 6 — Caterer Receives Email and Signs
The caterer receives an email from Dropbox Sign. They click the link. They sign inside Dropbox Sign — **not inside EcoLunch**. EcoLunch is not involved in the signing experience.

### Step 7 — Dropbox Sign Fires a Webhook
When the signer completes their signature, Dropbox Sign sends a webhook to EcoLunch's backend endpoint: `POST /webhooks/dropbox-sign`.

### Step 8 — Backend Processes the Webhook
On receiving `signature_request_all_signed`:
1. Download the signed PDF from Dropbox Sign API
2. Download the audit trail PDF from Dropbox Sign API
3. Upload both files to Dropbox Storage at `/09_Contracts_Signatures/`
4. Create `documents` records for both files (with `source: contract_signed`)
5. Update `contracts.status` → `signed`, `contracts.signed_at` → now
6. Update `signature_requests.status` → `signed`
7. Update `contracts.signed_document_id` and `contracts.audit_trail_document_id`
8. Re-evaluate `golive_checklist_items` where `requirement: contracts_signed`
9. Create validation item (type: `contract`) in Validation Center for admin review
10. Create `audit_log` entry

### Step 9 — Admin Reviews the Signed Contract
A new validation item of type `contract` appears in the Validation Center. Admin opens it, views the signed PDF, and approves it.

---

## Webhook Events to Handle

| Event | What It Means | Action Required |
|-------|--------------|-----------------|
| `signature_request_sent` | Dropbox Sign confirmed receipt | Log, update status |
| `signature_request_viewed` | Signer opened the document | Log, update status |
| `signature_request_signed` | One signer (of possibly many) has signed | Log |
| `signature_request_all_signed` | All required signers have signed | Download PDF, upload to Dropbox, update DB |
| `signature_request_declined` | Signer declined to sign | Status → `declined`, notify admin, EcoLoop ticket |
| `signature_request_expired` | Signing deadline passed | Status → `expired`, notify admin |
| `signature_request_canceled` | Admin cancelled the request | Status → `cancelled`, log |
| `signature_request_error` | API-level error | Status → `error`, alert admin |

---

## Critical Rule — Signing Does Not Activate the Caterer

A signed contract does **not** directly activate a caterer.

The chain is:
```
Contract signed
     │
     ▼
Backend processes webhook
     │
     ▼
contracts.status → signed
     │
     ▼
golive_checklist_items re-evaluated (contracts_signed requirement)
     │
     ▼
If ALL 11 checklist items complete → Go-live Monitor shows "Ready"
     │
     ▼
Admin reviews Go-live Monitor → clicks "Validate Go-live"
     │
     ▼
Caterer activated
```

Activation is always a manual admin decision.

---

## Admin vs Caterer Role Summary

| Action | Admin | Caterer |
|--------|-------|---------|
| Configure templates in Dropbox Sign | ✅ (in Dropbox Sign dashboard) | ❌ |
| Send contracts | ✅ | ❌ |
| Confirm merge fields before sending | ✅ | ❌ |
| Sign contracts | ❌ | ✅ (in Dropbox Sign email) |
| View signed contracts | ✅ Full access | ✅ Their own signed copies |
| Track signing status | ✅ | Limited — notified when complete |
| Handle declined/expired contracts | ✅ Must resend or escalate | Initiates decline if they click "Decline" |
| View contract audit trail | ✅ | ✅ Their own contracts |
