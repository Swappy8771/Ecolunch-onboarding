# Onboarding ADMIN PORTAL — Developer Alignment Document

---

## Table of Contents

1. [Document Info](#document-info)
2. [Scope](#1-scope)
3. [Core Principle](#2-core-principle)
4. [Correct Sidebar](#3-correct-sidebar)
5. [Dashboard Onboarding](#4-dashboard-onboarding)
6. [Caterers in Onboarding](#5-caterers-in-onboarding)
7. [Caterer Onboarding File (Admin View)](#6-caterer-onboarding-file-admin-view)
8. [Smart Import / Smart Upload Engine](#7-smart-import--smart-upload-engine)
9. [Smart Import Workflow (14 Steps)](#8-smart-import-workflow-14-steps)
10. [Smart Import Examples](#9-smart-import-examples)
11. [Smart Import Statuses](#10-smart-import-statuses)
12. [Document Vault by Caterer](#11-document-vault-by-caterer)
13. [Caterer-Specific Vault Structure](#12-caterer-specific-vault-structure)
14. [Dropbox Storage Rule](#13-dropbox-storage-rule)
15. [Document Storage Flow](#14-document-storage-flow)
16. [Recommended Dropbox Folder Structure](#15-recommended-dropbox-folder-structure)
17. [Required Document Metadata](#16-required-document-metadata)
18. [Contract Management](#17-contract-management)
19. [Contract Management Structure](#18-contract-management-structure)
20. [Contract Automation](#19-contract-automation)
21. [Step 1 — Template Configuration](#20-step-1--template-configuration)
22. [Step 2 — Dropbox Sign API Integration](#21-step-2--dropbox-sign-api-integration)
23. [Step 3 — Webhook Handling](#22-step-3--webhook-handling)
24. [Step 4 — Automated Archiving in Dropbox Storage](#23-step-4--automated-archiving-in-dropbox-storage)
25. [Dropbox Sign Status Tracking](#24-dropbox-sign-status-tracking)
26. [Contract Completion Workflow (16 Steps)](#25-contract-completion-workflow-16-steps)
27. [Validation Center](#26-validation-center)
28. [Modules, Pricing & Configurations](#27-modules-pricing--configurations)
29. [Go-live Monitor](#28-go-live-monitor)
30. [Go-live Activation Rule](#29-go-live-activation-rule)
31. [EcoLoop Onboarding](#30-ecoloop-onboarding)
32. [Final Onboarding ADMIN PORTAL Structure](#31-final-onboarding-admin-portal-structure)
33. [Developer Implementation Priorities](#32-developer-implementation-priorities)
34. [Message to Developers](#33-message-to-developers)
35. [Final Decisions](#34-final-decisions)

---

## Document Info

| Field | Value |
|---|---|
| Document name | Onboarding ADMIN PORTAL — Developer Alignment Document |
| Scope | Admin onboarding portal only |
| Status | Working version for developer correction and alignment |
| Core correction | Modules, Pricing & Configurations replaces previous "Modules & Configurations" |
| Storage direction | Dropbox Storage for documents; Dropbox Sign for signature workflows; EcoLunch database stores references and metadata only |

---

## 1. Scope

This document defines the **Onboarding ADMIN PORTAL only**. Not the Super Admin, caterer portal, parent portal, school portal, daycare portal, EcoLoop product, or financial control system.

The **Onboarding ADMIN PORTAL** is the internal EcoLunch admin environment to activate signed caterers before Go-live.

**Scope boundary:** all requirements are admin-side only. Client-facing caterer onboarding portal is intentionally paused.

---

## 2. Core Principle

The onboarding process is **hardcoded and standardized**. No ad hoc document request builder.

Same structure for every caterer:

- Fixed onboarding sections
- Fixed required document categories
- Fixed validation logic
- Fixed Go-live logic
- Fixed contract templates
- Fixed signature workflows
- Client-specific merge fields for rates, pricing, modules, dates and commercial terms

**Dynamic adjustments only:**

- Caterer name
- Legal name
- Signatory
- Activated modules
- Module pricing
- Monthly rates
- FinTech rates
- Sezzle rates
- Interac rates
- PRS/EcoLunch Connect rates
- Start date
- Effective dates
- Special pricing terms

---

## 3. Correct Sidebar

```
Onboarding ADMIN PORTAL
├── Dashboard Onboarding
├── Caterers in Onboarding
├── Validation Center
├── Document Vault by Caterer
├── Contract Management
├── Modules, Pricing & Configurations
├── Go-live Monitor
└── EcoLoop Onboarding
```

### Items to Remove from Sidebar

- Standalone Smart Upload
- Standalone Smart Import
- Duplicated Document Vault
- Duplicated Modules
- Profile (as global admin sidebar item)
- Banks (as global admin sidebar item)
- My Clients (as global admin sidebar item)
- Menus (as global admin sidebar item)

> **Note:** Profile, Banks, My Clients, and Menus belong **inside** the selected caterer onboarding file, not the global sidebar.

---

## 4. Dashboard Onboarding

### Must Show

- Caterers in onboarding
- Open validations
- EcoLoop tickets
- Blocked Go-live files
- Recent updates
- Urgent blockers

### Quick Access Cards

| Card |
|---|
| Caterers in Onboarding |
| Validation Center |
| Document Vault by Caterer |
| Contract Management |
| Modules Pricing & Configurations |
| Go-live Monitor |
| EcoLoop Onboarding |

> **Do NOT include** Smart Import Center or Smart Upload as standalone destinations. They are contextual engines inside onboarding sections.

---

## 5. Caterers in Onboarding

Global list of signed caterers being activated.

### Keep from Current Front-End

| Field |
|---|
| Caterer name |
| Location |
| Verticals (schools / daycares / CSS / camps) |
| Progress percentage |
| Status |
| Validation count |
| Ticket count |
| Assigned admin |
| Last update |
| Open onboarding button |

### Required Card Actions

- Open onboarding
- Open validation items
- Open Document Vault
- Open Contract Management
- Open EcoLoop thread
- Open Go-live blockers
- Open Support Access Session

### Rename Rule

> **Replace** "Switch to Caterer Portal" **with** "Open Support Access Session" or "Open Caterer Portal as EcoLunch Support."
>
> This is an **audited support access session**, not a normal user switch.

---

## 6. Caterer Onboarding File (Admin View)

When EcoLunch opens a caterer, admin moves from the global list to a specific caterer onboarding file.

### Sections Inside Caterer File

1. Overview
2. Profile
3. Banks & Banking Information
4. My Clients / Establishments
5. Menus & Packages
6. Document Vault
7. Contract Management
8. Modules Pricing & Configurations
9. Validation & Corrections
10. Go-live
11. EcoLoop
12. Audit

> **These sections must NOT become global sidebar items.**

---

## 7. Smart Import / Smart Upload Engine

**FINAL RULE:** Smart Import and Smart Upload are the **SAME engine**. Do not treat them as separate features.

It is a **contextual intelligent import engine** used in any onboarding section where a document, file, PDF, image, CSV, Excel, Acomba export, QuickBooks export, menu, banking document, legal document, client list or structured data can be uploaded to auto-fill fields.

### Where It Appears

- Profile
- Banks & Banking Information
- My Clients / Establishments
- Menus & Packages
- Document Vault
- Contract Management (when applicable)

> **It is NOT a standalone sidebar section.**

---

## 8. Smart Import Workflow (14 Steps)

1. Admin/caterer is inside a specific onboarding section.
2. User clicks **Smart Import**.
3. User uploads document or structured file.
4. File stored in Dropbox.
5. System detects document type.
6. System reads content.
7. System extracts fields.
8. System performs fuzzy matching against EcoLunch fields.
9. System displays human review screen.
10. User confirms, edits or rejects each proposed value.
11. Only confirmed values are applied.
12. Document classified in caterer Document Vault.
13. Validation items created when required.
14. Full audit trail created.

> **CRITICAL RULE:** No extracted data may be applied automatically without human review.

---

## 9. Smart Import Examples

| Section | Supported Files | Auto-fill Candidates |
|---|---|---|
| Profile | Legal document; NEQ document; company registration; contact sheet | Legal name; commercial name; NEQ; address; main contact; phone; email; signatory |
| Banks & Banking Information | Void cheque; bank statement; bank confirmation letter | Bank name; institution number; transit number; account number; account holder; account type |
| My Clients / Establishments | School list; daycare list; CPE list; camp list; CSS list; CSV; Excel; PDF | Establishment name; type; address; contact; CSS link; student/child count; closure calendar |
| Menus & Packages | School menu; rotating cycle; daycare menu; daycare packages; camp menu; Excel; CSV; PDF | Meal names; categories; prices; dates; weeks; active days; options; packages |

---

## 10. Smart Import Statuses

### Import Status

| Status |
|---|
| Uploaded |
| Processing |
| Extraction complete |
| Needs review |
| Partially mapped |
| Mapped |
| Confirmed |
| Applied |
| Rejected |
| Correction requested |
| Archived |

### Extracted Field Status

| Status |
|---|
| Detected |
| Mapped |
| Low confidence |
| Needs review |
| Confirmed |
| Edited |
| Rejected |
| Applied |

---

## 11. Document Vault by Caterer

**FINAL RULE:** Document Vault must be organized **by caterer**. Cannot be a single mixed list across all caterers.

### Global View Must Show

| Field |
|---|
| Caterer name |
| Document count |
| Documents in review / approved / rejected / in correction |
| Latest activity |
| Open vault action |

### Global Structure

```
Document Vault by Caterer
├── Concept Gourmet
├── FL
├── MSN
└── Other caterers
```

---

## 12. Caterer-Specific Vault Structure

Example: Concept Gourmet

```
Concept Gourmet
├── Profile / General Information
├── Legal Information
├── Banks & Banking Information
├── Compliance & Permits
├── Insurance
├── My Clients / Establishments
├── Menus & Packages
├── Modules
├── Contracts & Signatures
├── Go-live
└── Internal Documents
```

### Available Actions

- Direct upload
- Smart Import
- Classify
- Reclassify
- View file
- View extracted fields
- View linked section
- View validation status
- Approve
- Reject
- Request correction
- Send via EcoLoop
- View versions
- View audit
- Open in Dropbox

---

## 13. Dropbox Storage Rule

All onboarding documents must be stored **directly in Dropbox**.

EcoLunch must **not** store heavy PDF files or document binaries on the application backend.

The application database stores only:

- Dropbox file ID
- Dropbox file path
- Metadata
- Status
- Linked entity IDs
- Audit references

---

## 14. Document Storage Flow

No ad hoc document request builder. Document categories and required files are hardcoded. System must support direct upload and classification into caterer vault.

### Correct Flow

1. Admin uploads doc from correct onboarding section
2. File stored in Dropbox
3. File indexed in EcoLunch
4. File appears in caterer Document Vault
5. Smart Import runs if applicable
6. Extracted fields go to human review
7. Confirmed fields applied
8. Validation item created if required
9. Admin approves / rejects / requests correction
10. Audit created

> **IMPORTANT:** Document requests are not created manually. Required onboarding documents are predefined. Dropbox storage is mandatory.

---

## 15. Recommended Dropbox Folder Structure

```
Dropbox / EcoLunch
└── Onboarding
    └── Caterers
        └── {caterer_id}_{caterer_name}
            ├── 01_Profile
            ├── 02_Legal
            ├── 03_Banking
            ├── 04_Compliance_Permits
            ├── 05_Insurance
            ├── 06_Establishments
            ├── 07_Menus_Packages
            ├── 08_Modules
            ├── 09_Contracts_Signatures
            ├── 10_GoLive
            └── 99_Internal
```

---

## 16. Required Document Metadata

| Field |
|---|
| document_id |
| caterer_id |
| dropbox_file_id |
| dropbox_file_path |
| category |
| source |
| status |
| version |
| uploaded_by |
| uploaded_at |
| linked_section |
| linked_validation_item_id |
| linked_contract_id |
| linked_signature_request_id |
| extracted_fields |
| smart_import_status |
| audit_log_id |
| visibility (internal / client-visible) |

---

## 17. Contract Management

Dedicated section for contract templates, Dropbox Sign requests, signature tracking, executed agreements, module annexes, fee schedule annexes, versions and contract audit.

**SEPARATION RULE:**

| Section | Purpose |
|---|---|
| Document Vault | Storage and classification |
| Contract Management | Contract workflow and signature process |

---

## 18. Contract Management Structure

```
Contract Management
├── Contracts by Caterer
├── Contract Templates
├── Dropbox Sign Requests
├── Sent Contracts
├── Signed Contracts
├── Declined / Expired / Cancelled
├── Module Annexes
├── Fee Schedule Annexes
├── Versions
└── Contract Audit
```

---

## 19. Contract Automation

| Tool | Role |
|---|---|
| Dropbox Sign | Templates, merge fields, signing workflow |
| Dropbox Storage | Final document archiving |
| EcoLunch database | Metadata and references only |

---

## 20. Step 1 — Template Configuration

- EcoLunch creates and uploads standard base agreements in Dropbox Sign dashboard.
- Configures Merge Fields / Custom Fields.
- Developers retrieve `template_id` from Dropbox Sign.
- `template_id` stored in EcoLunch configuration.

### Example Merge Fields

| Merge Field |
|---|
| client_name |
| legal_name |
| monthly_rate |
| start_date |
| module_name |
| fee_percentage |
| fixed_fee |
| signatory_name |
| signatory_email |

> **IMPORTANT:** Templates are standardized — same base documents for all caterers with client-specific values injected via merge fields.

---

## 21. Step 2 — Dropbox Sign API Integration

Backend calls `signature_request/send_with_template` or the official Dropbox Sign SDK.

### Required Payload Example

```json
{
  "template_id": "dropbox_sign_template_id",
  "signers": [
    {
      "name": "Client Signatory",
      "email_address": "client@example.com",
      "role": "Client"
    }
  ],
  "custom_fields": [
    { "name": "client_name", "value": "Concept Gourmet" },
    { "name": "monthly_rate", "value": "$150" },
    { "name": "start_date", "value": "2026-09-01" }
  ]
}
```

Dropbox Sign handles:

- Data merge
- Final PDF generation
- Email delivery
- Signature workflow
- Audit trail

> Backend may request embedded signing URL if needed.

---

## 22. Step 3 — Webhook Handling

Developers must expose a secure backend webhook endpoint.

### Required Events

| Event |
|---|
| signature_request_sent |
| signature_request_viewed |
| signature_request_signed |
| signature_request_all_signed |
| signature_request_declined |
| signature_request_expired |
| signature_request_canceled |
| signature_request_error |

### When Receiving signed / all_signed

Update all of the following:

- Signature status
- Contract status
- Onboarding status
- Validation status
- Go-live readiness
- Audit log

### Activation Rule

> Signed contract does **NOT** automatically activate caterer alone.
>
> Dropbox Sign completed → contract requirement marked complete → Go-live checklist re-evaluated → client Active **only when ALL required Go-live items are complete**.

---

## 23. Step 4 — Automated Archiving in Dropbox Storage

Once executed, signed PDF, audit trail and signature certificate must be archived in Dropbox Storage.

### Preferred Workflow

1. Dropbox Sign webhook received
2. Backend downloads signed PDF and audit trail from Dropbox Sign
3. Backend uploads to Dropbox Storage
4. Files stored in correct caterer folder
5. EcoLunch stores only Dropbox file ID / path
6. Contract record updated
7. Document Vault updated
8. Audit log created

**Preferred folder:** `/Onboarding/Caterers/{caterer_id}_{caterer_name}/09_Contracts_Signatures/`

> **FINAL STORAGE RULE:** Backend must **NEVER** store actual binary PDF as long-term storage. Store only:
> - dropbox_file_id
> - dropbox_file_path
> - contract_id
> - signature_request_id
> - metadata
> - audit references

---

## 24. Dropbox Sign Status Tracking

### Statuses

| Status |
|---|
| Draft |
| Ready to send |
| Sent |
| Viewed |
| Partially signed |
| Signed |
| Declined |
| Expired |
| Cancelled |
| Error |

### Display Fields

| Field |
|---|
| Caterer |
| Contract name |
| Contract type |
| Template used |
| Signatory name |
| Signatory email |
| Dropbox Sign request ID |
| Dropbox Sign status |
| Sent date |
| Viewed date |
| Signed date |
| Version |
| Signed file |
| Audit trail file |
| Dropbox file link |
| Linked modules |
| Linked fee schedule |
| Actions |

### Actions

- View detail
- Send for signature
- Resend / remind
- Cancel
- Download signed document
- Download audit trail
- Open in Dropbox
- Link to module
- Link to fee schedule
- Link to onboarding file
- View audit

---

## 25. Contract Completion Workflow (16 Steps)

1. Admin opens Contract Management.
2. Admin selects caterer.
3. Admin selects standard contract template.
4. Admin confirms merge field values.
5. Backend sends signature request via Dropbox Sign API.
6. Dropbox Sign emails signer.
7. Signer views and signs.
8. Dropbox Sign sends webhook.
9. Backend updates contract / signature status.
10. Backend downloads signed PDF and audit trail.
11. Backend uploads signed files to Dropbox Storage.
12. Backend stores Dropbox references only.
13. Document appears in caterer Document Vault.
14. Contract requirement marked complete.
15. Go-live checklist re-evaluated.
16. Audit log created.

---

## 26. Validation Center

Global admin review queue across all caterers in onboarding.

### Must Allow EcoLunch to Review

- Field changes
- Documents
- Smart Import extracted values
- Contracts
- Banking information
- Menus
- Establishments
- Module configuration
- Pricing configuration
- Go-live blockers

### Required Actions

- View detail
- Approve
- Request correction
- Reject
- Add internal comment
- Send via EcoLoop
- View history

### For Smart Import Extracted Fields — Show

| Column |
|---|
| Source document |
| Target section |
| Detected field |
| Current value |
| Proposed value |
| Confidence score |
| Confirmed / edited / rejected status |

---

## 27. Modules, Pricing & Configurations

**REQUIRED CORRECTION:** This section must be named **"Modules, Pricing & Configurations"** — not "Modules & Configurations."

### Purpose

EcoLunch Admin selects modules activated for a caterer and configures pricing and related rules before Go-live.

### Why This Section Is Mandatory

- Contract Management must consume configured module/pricing values to populate Dropbox Sign templates, module annexes and fee schedules.
- Go-live must block activation if required modules, pricing or configurations are incomplete.

---

### Activable Modules

| Module |
|---|
| School Meals |
| Daycare/CPE Meals |
| Camp Meals |
| ReportIQ |
| Accounting |
| Parent Subscriptions |
| CSS Reporting |

---

### Pricing to Configure

- SaaS pricing per activated module
- Monthly rate
- Setup fee (if applicable)
- Founding Partner free-for-life status (if applicable)
- Discounts / exceptions
- Effective dates
- Start date
- End date (if applicable)
- Commercial notes for contract merge fields

---

### Configurable Rules / Components

- Payout rules
- Cutoff rules
- Credit rules
- Labels
- Notifications
- Reports

---

### Infrastructure Components

> **NOT ordinary modules — do not list as activable commercial modules.**

| Component |
|---|
| EcoLoop |
| Ledger |
| EcoWallet |
| Payment rails (Credit card, Apple Pay, Google Pay, Interac Direct, Sezzle) |

---

### Module Configuration Table

| Module | Status & Dates | Pricing | Configurable Rules / Components |
|---|---|---|---|
| School Meals | Active/inactive; effective date | Monthly SaaS price; setup fee; founding partner status | Cutoff rules; labels; notifications; reports; calendars |
| Daycare/CPE Meals | Active/inactive; effective date | Monthly SaaS price; setup fee; founding partner status | Menus; packages; credit rules; reports; labels |
| Camp Meals | Active/inactive; effective date | Monthly SaaS price; setup fee if applicable | Menus/packages; calendar; reports |
| ReportIQ | Active/inactive; included/billable | Monthly module price; discount; effective date | Report templates; delivery cadence; export permissions |
| Accounting | Active/inactive; selected accounting stack | Monthly module price; implementation fee if applicable | Acomba/QuickBooks/Sage mapping; GL codes; export rules |
| Parent Subscriptions | Active/inactive | Monthly module price or included status | Subscription settings; recurrence; parent-facing options |
| CSS Reporting | Active/inactive | Monthly module price or included status | CSS report formats; access rules; data scope |

---

### Workflow (11 Steps)

1. Admin opens Onboarding ADMIN PORTAL.
2. Admin opens Caterers in Onboarding.
3. Admin clicks specific caterer.
4. Admin opens Modules, Pricing & Configurations.
5. Admin selects activated modules.
6. Admin configures pricing per module.
7. Admin configures related rules and effective dates.
8. Values saved in caterer onboarding file.
9. Contract Management consumes values for contracts, module annexes, fee schedules via Dropbox Sign.
10. Go-live Monitor verifies all required modules / pricing / configurations are complete.
11. At Go-live, selected modules and configured prices become effective in real operational caterer portal.

---

### Section Separation

| Section | Purpose |
|---|---|
| Modules, Pricing & Configurations | Defines activated modules, module pricing, commercial exceptions, effective dates and related operational rules |
| Contract Management | Generates and sends contracts, annexes and fee schedules using values configured in Modules, Pricing & Configurations |
| Document Vault | Stores signed contracts and related files by caterer in Dropbox |
| Go-live Monitor | Blocks activation if modules, pricing or required configurations are incomplete |

---

### Acceptance Criteria

- Admin can select required activable modules per caterer.
- Admin can configure pricing for each selected module.
- Admin can mark Founding Partner free-for-life status.
- Admin can set effective dates and exceptions.
- Configured values are available to Contract Management as merge field data.
- Configured values are visible in caterer onboarding file.
- Changes are audited.
- Go-live is blocked if required module / pricing fields are incomplete.

---

## 28. Go-live Monitor

Verifies if each caterer is ready to be activated.

### Must Show

| Field |
|---|
| Caterer |
| Overall progress |
| Completed steps |
| Blocking steps |
| Missing required documents |
| Unsigned contracts |
| Open validations |
| Open corrections |
| Modules not configured |
| Pricing not configured |
| Menus not validated |
| Establishments not confirmed |
| Ready / not ready |

### Actions

- View blockers
- Open blocking section
- Send client reminder
- Send via EcoLoop
- Validate Go-live
- Block Go-live
- View audit

---

## 29. Go-live Activation Rule

Go-live can **ONLY** be triggered when **ALL** hardcoded required onboarding items are complete.

### Required Categories

| Category |
|---|
| Account created |
| Profile validated |
| Banking information validated |
| Establishments confirmed |
| Menus / packages validated |
| Required documents received and approved |
| Required contracts signed |
| Modules configured |
| Pricing configured |
| Corrections closed |
| EcoLoop blockers closed |

### After Go-live

- Approved data activated in real operational caterer portal
- Caterer status becomes **Active**
- Modules become effective
- Configured pricing and rates become effective
- Audit log created

---

## 30. EcoLoop Onboarding

Communication and follow-up layer for onboarding.

### Must Include

- Tickets by caterer
- Conversations by caterer
- Correction requests
- Internal notes
- Client messages
- System actions
- Validation follow-up
- Linked documents
- Linked Smart Import items
- Linked contract requests
- Linked Go-live blockers

### Actions

- Create ticket
- Send message
- Add internal note
- Link to validation item
- Link to document
- Link to contract
- Link to Smart Import item
- Link to Go-live blocker
- Close ticket
- Reassign ticket
- Change priority

---

## 31. Final Onboarding ADMIN PORTAL Structure

```
Onboarding ADMIN PORTAL
├── Dashboard Onboarding
├── Caterers in Onboarding
├── Validation Center
├── Document Vault by Caterer
├── Contract Management
├── Modules, Pricing & Configurations
├── Go-live Monitor
└── EcoLoop Onboarding
```

---

## 32. Developer Implementation Priorities

| Priority | Area | Tasks |
|---|---|---|
| Priority 1 | Navigation cleanup | Remove duplicated Document Vault; remove duplicated Modules; remove standalone Smart Upload/Smart Import from sidebar; add Contract Management; rename "Switch to Caterer Portal"; rename "Modules & Configurations" to "Modules, Pricing & Configurations" |
| Priority 2 | Document architecture | Document Vault by caterer; Dropbox Storage integration; direct upload into hardcoded onboarding categories; document metadata model; document status model; version history; audit |
| Priority 3 | Contract automation | Dropbox Sign template setup; template_id configuration; send_with_template backend action; merge fields; signature request status tracking; webhook endpoint; signed PDF download; audit trail download; Dropbox Storage upload; Document Vault linking; Go-live re-evaluation |
| Priority 4 | Smart Import engine | Contextual Smart Import; file upload; Dropbox storage; document type detection; field extraction; fuzzy matching; human review; field application; validation item creation; audit trail |
| Priority 5 | Modules / Pricing | Activable modules; pricing per module; founding partner status; effective dates; linked rules; contract merge fields; audit; Go-live blocking |
| Priority 6 | Validation + Go-live | Full validation actions; correction workflow; EcoLoop linkage; automatic Go-live checklist; blockers; audit |

---

## 33. Message to Developers

We are finalizing only the **Onboarding ADMIN PORTAL**.

The current coded front-end is a good visual base but the structure must be corrected before backend integration begins.

### Key Points

- The onboarding process is **hardcoded and standardized** — not an ad hoc document request system.
- Same onboarding structure, same required document categories, same contract templates for every caterer — only merge field adjustments for rates, prices, modules, dates and client-specific values.
- Correct sidebar order is listed in [Section 3](#3-correct-sidebar).
- Remove standalone Smart Upload / Smart Import from the sidebar.
- **Smart Import and Smart Upload are the SAME engine.**
- The Smart Import / Smart Upload Engine is contextual: it uploads a file, stores it in Dropbox, detects the document type, reads content, extracts fields, performs fuzzy matching, maps to EcoLunch fields, shows a human review screen, allows confirm/edit/reject, applies only confirmed values, classifies the document in the Document Vault, creates validation items when required, and creates a full audit trail.
- **Document Vault must be organized by caterer.**
- All documents stored directly in Dropbox — backend only stores Dropbox references and metadata, never long-term binary PDFs.
- Do not build a manual document request system — document structure is hardcoded; files are uploaded into the proper onboarding section/category and stored in Dropbox.
- **Contract Management must be added as a dedicated section.**
- **Modules, Pricing & Configurations must be added as a dedicated section** (replaces "Modules & Configurations").

### Modules, Pricing & Configurations Must Handle

- Activable modules
- SaaS pricing per module
- Monthly rates
- Setup fees
- Founding Partner status
- Discounts / exceptions
- Effective dates
- Payout rules
- Cutoff rules
- Credit rules
- Labels
- Notifications
- Reports

### Critical Dependencies

- Contract Management consumes values from Modules, Pricing & Configurations to populate Dropbox Sign templates, module annexes and fee schedules.
- Go-live Monitor must block activation if required modules, pricing or configurations are incomplete.

> **No backend integration should start until the following are confirmed:** structure, Document Vault by Caterer, Contract Management, Dropbox Storage, Smart Import logic, and Modules, Pricing & Configurations section.

---

## 34. Final Decisions

| Decision | Rule |
|---|---|
| Document Vault | By caterer |
| Ad hoc document request system | None — not built |
| Required onboarding documents | Hardcoded |
| Contract Management | Required section |
| Contract signature requests | Created through Dropbox Sign |
| Contract templates | Standardized |
| Contract values | Injected through merge fields |
| Dropbox Storage | Required document archive |
| Smart Import / Smart Upload | One contextual auto-fill engine |
| Standalone Smart Import / Smart Upload | Removed from sidebar |
| Modules, Pricing & Configurations | Required section |
| Contract Management source data | Consumes module/pricing values |
| Go-live logic | Automatic readiness logic |
| Validation Center | Required |
