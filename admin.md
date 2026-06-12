# Onboarding ADMIN PORTAL — Developer Alignment Document

> **Status:** Working version for developer correction and alignment
> **Scope:** Admin onboarding portal only
> **Core correction:** "Modules, Pricing & Configurations" replaces the previous "Modules & Configurations" wording
> **Storage direction:** Dropbox Storage for documents · Dropbox Sign for signature workflows · EcoLunch database stores references and metadata only

---

## Table of Contents

1. [Document Info](#document-info)
2. [Scope](#1-scope)
3. [Core Principle](#2-core-principle)
4. [Correct Sidebar](#3-correct-sidebar)
5. [Dashboard Onboarding](#4-dashboard-onboarding)
6. [Caterers in Onboarding](#5-caterers-in-onboarding)
7. [Caterer Onboarding File — Admin View](#6-caterer-onboarding-file--admin-view)
8. [Smart Import / Smart Upload Engine](#7-smart-import--smart-upload-engine)
9. [Smart Import Workflow](#8-smart-import-workflow)
10. [Smart Import Examples](#9-smart-import-examples)
11. [Smart Import Statuses](#10-smart-import-statuses)
12. [Document Vault by Caterer](#11-document-vault-by-caterer)
13. [Caterer-Specific Vault](#12-caterer-specific-vault)
14. [Dropbox Storage Rule](#13-dropbox-storage-rule)
15. [Document Storage Flow](#14-document-storage-flow)
16. [Recommended Dropbox Folder Structure](#15-recommended-dropbox-folder-structure)
17. [Required Document Metadata](#16-required-document-metadata)
18. [Contract Management](#17-contract-management)
19. [Contract Management Structure](#18-contract-management-structure)
20. [Contract Automation via Dropbox Sign API](#19-contract-automation-via-dropbox-sign-api--dropbox-storage)
21. [Step 1 — Template Configuration](#20-step-1--template-configuration)
22. [Step 2 — Dropbox Sign API Integration](#21-step-2--dropbox-sign-api-integration)
23. [Step 3 — Webhook Handling](#22-step-3--webhook-handling)
24. [Step 4 — Automated Archiving in Dropbox Storage](#23-step-4--automated-archiving-in-dropbox-storage)
25. [Dropbox Sign Status Tracking](#24-dropbox-sign-status-tracking)
26. [Contract Completion Workflow](#25-contract-completion-workflow)
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
| Core correction | "Modules, Pricing & Configurations" replaces previous "Modules & Configurations" |
| Storage direction | Dropbox Storage for documents; Dropbox Sign for signature workflows; EcoLunch database stores references and metadata only |

---

## 1. Scope

This document defines the **Onboarding ADMIN PORTAL only.**

It does **not** define:
- the full Super Admin
- the caterer operational portal
- the parent portal
- the school portal
- the daycare portal
- the full EcoLoop product
- the full financial control system

The Onboarding ADMIN PORTAL is the **internal EcoLunch admin environment** used to activate signed caterers before Go-live.

**Scope boundary:** All requirements below are limited to the admin-side onboarding environment. The client-facing caterer onboarding portal is intentionally paused and must not be merged into this document.

---

## 2. Core Principle

The onboarding process is **hardcoded and standardized.** EcoLunch does not need an ad hoc document request builder. The same onboarding structure remains in place for every caterer:

- fixed onboarding sections
- fixed required document categories
- fixed validation logic
- fixed Go-live logic
- fixed contract templates
- fixed signature workflows
- client-specific merge fields for rates, pricing, modules, dates and commercial terms

The **only dynamic adjustments** are values such as:
- caterer name
- legal name
- signatory
- activated modules
- module pricing
- monthly rates
- FinTech rates
- Sezzle rates
- Interac rates
- PRS / EcoLunch Connect rates
- start date
- effective dates
- special pricing terms

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

### Remove from the sidebar

- standalone Smart Upload
- standalone Smart Import
- duplicated Document Vault
- duplicated Modules
- Profile as a global admin sidebar item
- Banks as a global admin sidebar item
- My Clients as a global admin sidebar item
- Menus as a global admin sidebar item

> **Rule:** Profile, Banks, My Clients and Menus belong **inside** the selected caterer onboarding file, not in the global Onboarding ADMIN PORTAL sidebar.

---

## 4. Dashboard Onboarding

The Dashboard Onboarding gives EcoLunch a global view of the onboarding engine.

### Must show

- caterers in onboarding
- open validations
- EcoLoop tickets
- blocked Go-live files
- recent updates
- urgent blockers

### Quick access cards

- Caterers in Onboarding
- Validation Center
- Document Vault by Caterer
- Contract Management
- Modules, Pricing & Configurations
- Go-live Monitor
- EcoLoop Onboarding

### Do NOT include

- Smart Import Center as a standalone destination
- Smart Upload as a standalone destination

> Smart Import / Smart Upload is a **contextual engine** used inside onboarding sections.

---

## 5. Caterers in Onboarding

This is the global list of signed caterers currently being activated.

### Keep from the current front-end

- caterer name
- location
- verticals: schools / daycares / CSS / camps
- progress percentage
- status
- validation count
- ticket count
- assigned admin
- last update
- Open onboarding button

### Required card actions

- Open onboarding
- Open validation items
- Open Document Vault
- Open Contract Management
- Open EcoLoop thread
- Open Go-live blockers
- Open Support Access Session

### Rename required

> Replace **"Switch to Caterer Portal"** with **"Open Support Access Session"** or **"Open Caterer Portal as EcoLunch Support."**
> This is **not** a normal user switch. It is an **audited support access session.**

---

## 6. Caterer Onboarding File — Admin View

When EcoLunch opens a caterer, the admin moves from the global list to a specific caterer onboarding file.

```
Caterers in Onboarding
→ Open onboarding
→ Caterer Onboarding File
```

### Caterer onboarding file sections

1. Overview
2. Profile
3. Banks & Banking Information
4. My Clients / Establishments
5. Menus & Packages
6. Document Vault
7. Contract Management
8. Modules, Pricing & Configurations
9. Validation & Corrections
10. Go-live
11. EcoLoop
12. Audit

> These sections are **inside the selected caterer file** and must **not** become global sidebar items.

---

## 7. Smart Import / Smart Upload Engine

> **Final rule:** Smart Import and Smart Upload are the **same engine.** Do not treat them as separate features.

Smart Import / Smart Upload Engine is a **contextual intelligent import engine** used in any onboarding section where a document, file, PDF, image, CSV, Excel file, Acomba export, QuickBooks export, menu, banking document, legal document, client list or structured data can be uploaded to auto-fill fields.

### Where Smart Import appears

- Profile
- Banks & Banking Information
- My Clients / Establishments
- Menus & Packages
- Document Vault
- Contract Management (when applicable)

> It is **not** a standalone sidebar section.

---

## 8. Smart Import Workflow

1. Admin or caterer is inside a specific onboarding section.
2. User clicks **Smart Import**.
3. User uploads a document or structured file.
4. File is stored in Dropbox.
5. System detects document type.
6. System reads the content.
7. System extracts fields.
8. System performs fuzzy matching against EcoLunch fields.
9. System displays a **human review screen.**
10. User confirms, edits or rejects each proposed value.
11. Only confirmed values are applied.
12. Document is classified in the caterer's Document Vault.
13. Validation items are created when required.
14. Full audit trail is created.

> **Critical rule:** No extracted data may be applied automatically without human review.

---

## 9. Smart Import Examples

| Section | Supported files | Auto-fill candidates |
|---|---|---|
| Profile | legal document; NEQ document; company registration; contact sheet | legal name; commercial name; NEQ; address; main contact; phone; email; signatory |
| Banks & Banking Information | void cheque; bank statement; bank confirmation letter | bank name; institution number; transit number; account number; account holder; account type |
| My Clients / Establishments | school list; daycare list; CPE list; camp list; CSS list; CSV; Excel; PDF | establishment name; type; address; contact; CSS link; student / child count; closure calendar |
| Menus & Packages | school menu; rotating cycle; daycare menu; daycare packages; camp menu; Excel; CSV; PDF | meal names; categories; prices; dates; weeks; active days; options; packages |

---

## 10. Smart Import Statuses

| Object | Statuses |
|---|---|
| Import status | Uploaded · Processing · Extraction complete · Needs review · Partially mapped · Mapped · Confirmed · Applied · Rejected · Correction requested · Archived |
| Extracted field status | Detected · Mapped · Low confidence · Needs review · Confirmed · Edited · Rejected · Applied |

---

## 11. Document Vault by Caterer

> **Final rule:** Document Vault must be organized **by caterer.** It cannot be a single mixed list of documents across all caterers.

### Global Document Vault view

```
Document Vault by Caterer
├── Concept Gourmet
├── FL
├── MSN
└── Other caterers
```

### Global view must show

- caterer name
- document count
- documents in review
- documents approved
- documents rejected
- documents in correction
- latest activity
- open vault action

---

## 12. Caterer-Specific Vault

```
Caterer Vault — Concept Gourmet
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

### Actions inside caterer vault

- direct upload document
- Smart Import document
- classify document
- reclassify document
- view file
- view extracted fields
- view linked section
- view validation status
- approve
- reject
- request correction
- send via EcoLoop
- view versions
- view audit
- open in Dropbox

---

## 13. Dropbox Storage Rule

> **Final storage rule:** All onboarding documents must be stored directly in **Dropbox.** EcoLunch must not store heavy PDF files or document binaries on the application backend.

The application database stores **only:**
- Dropbox file ID
- Dropbox file path
- metadata
- status
- linked entity IDs
- audit references

---

## 14. Document Storage Flow

There is no ad hoc document request builder. The onboarding document categories and required files are already **hardcoded.**

The system must support direct upload and classification into the caterer's vault.

### Correct flow

```
Admin or caterer uploads a document from the correct onboarding section
→ file is stored in Dropbox
→ file is indexed in EcoLunch
→ file appears in the caterer's Document Vault
→ Smart Import runs if applicable
→ extracted fields go to human review
→ confirmed fields are applied
→ validation item is created if required
→ admin approves / rejects / requests correction
→ audit is created
```

> **Important:** Document requests are not created manually. The required onboarding documents are predefined by the hardcoded onboarding workflow. Dropbox storage is mandatory.

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

| Field | Description |
|---|---|
| `document_id` | Unique document identifier |
| `caterer_id` | Linked caterer |
| `dropbox_file_id` | Dropbox file reference |
| `dropbox_file_path` | Dropbox file path |
| `category` | Onboarding category |
| `source` | Upload source |
| `status` | Document status |
| `version` | Version number |
| `uploaded_by` | Admin or caterer user |
| `uploaded_at` | Upload timestamp |
| `linked_section` | Onboarding section |
| `linked_validation_item_id` | Linked validation item |
| `linked_contract_id` | Linked contract |
| `linked_signature_request_id` | Linked Dropbox Sign request |
| `extracted_fields` | Smart Import output |
| `smart_import_status` | Smart Import processing status |
| `audit_log_id` | Audit reference |
| `visibility` | `internal` or `client-visible` |

---

## 17. Contract Management

Contract Management is the dedicated section for:
- contract templates
- Dropbox Sign requests
- signature tracking
- executed agreements
- module annexes
- fee schedule annexes
- versions
- contract audit

> **Separation rule:** Document Vault = storage and classification. Contract Management = contract workflow and signature process.

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

## 19. Contract Automation via Dropbox Sign API & Dropbox Storage

| Layer | Responsibility |
|---|---|
| Dropbox Sign | Templates, merge fields, signing workflow |
| Dropbox Storage | Final document archiving |
| EcoLunch database | Metadata and references only |

---

## 20. Step 1 — Template Configuration

- EcoLunch creates and uploads standard base agreements directly in the Dropbox Sign dashboard.
- EcoLunch configures **Merge Fields / Custom Fields** for dynamic variables.
- Developers retrieve the generated `template_id` from Dropbox Sign.
- The `template_id` is stored in EcoLunch configuration for backend use.

### Example merge fields

| Merge field | Description |
|---|---|
| `client_name` | Caterer commercial name |
| `legal_name` | Caterer legal name |
| `monthly_rate` | Monthly SaaS rate |
| `start_date` | Contract start date |
| `module_name` | Activated module name |
| `fee_percentage` | Fee percentage |
| `fixed_fee` | Fixed fee amount |
| `signatory_name` | Signatory full name |
| `signatory_email` | Signatory email address |

> **Important:** Contract templates are standardized. The same base documents are used for all caterers, with client-specific values injected through merge fields.

---

## 21. Step 2 — Dropbox Sign API Integration

When EcoLunch triggers a signing action from Contract Management, the backend should call `signature_request/send_with_template` or use the official Dropbox Sign SDK.

### Required payload example

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
- data merge
- final PDF generation
- email delivery to signer
- signature workflow
- audit trail

If EcoLunch later chooses embedded signing, the backend may request and expose an embedded signing URL.

---

## 22. Step 3 — Webhook Handling

Developers must expose a **secure backend webhook endpoint** for Dropbox Sign events.

### Required events

| Event | Description |
|---|---|
| `signature_request_sent` | Request sent to signer |
| `signature_request_viewed` | Signer opened the request |
| `signature_request_signed` | Signer signed |
| `signature_request_all_signed` | All signers completed |
| `signature_request_declined` | Signer declined |
| `signature_request_expired` | Request expired |
| `signature_request_canceled` | Request canceled |
| `signature_request_error` | Error occurred |

When the backend receives `signature_request_signed` or `signature_request_all_signed`, the application must update:
- signature status
- contract status
- onboarding status
- validation status
- Go-live readiness (if applicable)
- audit log

> **Activation rule:** A signed contract does **not** automatically activate the caterer alone.
> Dropbox Sign completed → contract requirement marked complete → Go-live checklist re-evaluated → client becomes **Active** only when **all** required Go-live items are complete.

---

## 23. Step 4 — Automated Archiving in Dropbox Storage

Once a document is fully executed, the signed PDF, audit trail and signature certificate (if available) must be archived in Dropbox Storage.

### Preferred workflow

```
Dropbox Sign webhook received
→ backend downloads signed PDF and audit trail from Dropbox Sign
→ backend uploads files to Dropbox Storage
→ files are stored in the correct caterer folder
→ EcoLunch stores only Dropbox file ID / path
→ contract record is updated
→ Document Vault is updated
→ audit log is created
```

**Preferred folder:**
```
/Onboarding/Caterers/{caterer_id}_{caterer_name}/09_Contracts_Signatures/
```

> **Final storage rule:** Application backend must **never** store the actual binary PDF as the long-term storage location. Store only `dropbox_file_id`, `dropbox_file_path`, `contract_id`, `signature_request_id`, metadata and audit references.

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

### Display fields

- caterer
- contract name
- contract type
- template used
- signatory name
- signatory email
- Dropbox Sign request ID
- Dropbox Sign status
- sent date
- viewed date
- signed date
- version
- signed file
- audit trail file
- Dropbox file link
- linked modules
- linked fee schedule
- actions

### Actions

- view detail
- send for signature
- resend / remind
- cancel
- download signed document
- download audit trail
- open in Dropbox
- link to module
- link to fee schedule
- link to onboarding file
- view audit

---

## 25. Contract Completion Workflow

1. Admin opens Contract Management.
2. Admin selects caterer.
3. Admin selects standard contract template.
4. Admin confirms merge field values.
5. Backend sends signature request via Dropbox Sign API.
6. Dropbox Sign emails signer.
7. Signer views and signs.
8. Dropbox Sign sends webhook.
9. Backend updates contract/signature status.
10. Backend downloads signed PDF and audit trail.
11. Backend uploads signed files to Dropbox Storage.
12. Backend stores Dropbox references only.
13. Document appears in caterer's Document Vault.
14. Contract requirement is marked complete.
15. Go-live checklist is re-evaluated.
16. Audit log is created.

---

## 26. Validation Center

The Validation Center is the **global admin review queue** across all caterers in onboarding.

### Must allow EcoLunch to review

- field changes
- documents
- Smart Import extracted values
- contracts
- banking information
- menus
- establishments
- module configuration
- pricing configuration
- Go-live blockers

### Required actions

| Action |
|---|
| View detail |
| Approve |
| Request correction |
| Reject |
| Add internal comment |
| Send via EcoLoop |
| View history |

### For Smart Import extracted fields — display

- source document
- target section
- detected field
- current value
- proposed value
- confidence score
- confirmed / edited / rejected status

---

## 27. Modules, Pricing & Configurations

> **Required correction:** The section must be named **"Modules, Pricing & Configurations."** It replaces the previous "Modules & Configurations" wording because **pricing is configured in this section before Go-live.**

### Purpose

This section is where EcoLunch Admin:
- selects the modules activated for a caterer
- configures the pricing and related rules before Go-live

**This section is mandatory because:**
- Contract Management must consume the configured module/pricing values to populate Dropbox Sign templates, module annexes and fee schedules.
- Go-live must block activation if required modules, pricing or configurations are incomplete.

### Activable modules

- School Meals
- Daycare / CPE Meals
- Camp Meals
- ReportIQ
- Accounting
- Parent Subscriptions
- CSS Reporting

### Pricing to configure

- SaaS pricing per activated module
- monthly rate
- setup fee (if applicable)
- Founding Partner free-for-life status (if applicable)
- discounts / exceptions
- effective dates
- start date
- end date (if applicable)
- commercial notes for contract merge fields

### Configurable rules / components

- Payout rules
- Cutoff rules
- Credit rules
- Labels
- Notifications
- Reports

### Infrastructure components — NOT ordinary modules

> The following infrastructure elements may have settings, rates or operational rules elsewhere, but they **must not** be treated as ordinary activable commercial modules inside the onboarding module list.

- EcoLoop
- Ledger
- EcoWallet
- Payment rails:
  - Credit card
  - Apple Pay
  - Google Pay
  - Interac Direct
  - Sezzle

### Module configuration table

| Module | What Admin selects | Pricing / commercial fields | Related configurations |
|---|---|---|---|
| School Meals | Active / inactive; effective date | monthly SaaS price; setup fee; founding partner status | cutoff rules; labels; notifications; reports; calendars |
| Daycare / CPE Meals | Active / inactive; effective date | monthly SaaS price; setup fee; founding partner status | menus; packages; credit rules; reports; labels |
| Camp Meals | Active / inactive; effective date | monthly SaaS price; setup fee if applicable | menus/packages; calendar; reports |
| ReportIQ | Active / inactive; included / billable | monthly module price; discount; effective date | report templates; delivery cadence; export permissions |
| Accounting | Active / inactive; selected accounting stack | monthly module price; implementation fee if applicable | Acomba / QuickBooks / Sage mapping; GL codes; export rules |
| Parent Subscriptions | Active / inactive | monthly module price or included status | subscription settings; recurrence; parent-facing options |
| CSS Reporting | Active / inactive | monthly module price or included status | CSS report formats; access rules; data scope |

### Workflow

1. Admin opens the Onboarding ADMIN PORTAL.
2. Admin opens Caterers in Onboarding.
3. Admin clicks a specific caterer.
4. Admin opens Modules, Pricing & Configurations.
5. Admin selects the activated modules.
6. Admin configures pricing per module.
7. Admin configures related rules and effective dates.
8. Values are saved in the caterer onboarding file.
9. Contract Management consumes these values to populate contracts, module annexes and fee schedules via Dropbox Sign.
10. Go-live Monitor verifies that all required modules, pricing and configurations are complete.
11. At Go-live, selected modules and configured prices become effective in the real operational caterer portal.

### Section separation

| Section | Responsibility |
|---|---|
| Modules, Pricing & Configurations | Defines activated modules, module pricing, commercial exceptions, effective dates and related operational rules |
| Contract Management | Generates and sends contracts, annexes and fee schedules using the values configured in Modules, Pricing & Configurations |
| Document Vault | Stores signed contracts and related files by caterer in Dropbox |
| Go-live Monitor | Blocks activation if modules, pricing or required configurations are incomplete |

### Acceptance criteria

- Admin can select the required activable modules for each caterer.
- Admin can configure pricing for each selected module.
- Admin can mark Founding Partner free-for-life status where applicable.
- Admin can set effective dates and exceptions.
- Configured values are available to Contract Management as merge field data.
- Configured values are visible in the caterer onboarding file.
- Changes are audited.
- Go-live is blocked if required module/pricing fields are incomplete.

---

## 28. Go-live Monitor

The Go-live Monitor verifies if each caterer is ready to be activated.

### Must show

- caterer
- overall progress
- completed steps
- blocking steps
- missing required documents
- unsigned contracts
- open validations
- open corrections
- modules not configured
- pricing not configured
- menus not validated
- establishments not confirmed
- ready / not ready

### Actions

- view blockers
- open blocking section
- send client reminder
- send via EcoLoop
- validate Go-live
- block Go-live
- view audit

---

## 29. Go-live Activation Rule

> **Activation rule:** Go-live can only be triggered when **all** hardcoded required onboarding items are complete.

### Required categories

- [ ] account created
- [ ] profile validated
- [ ] banking information validated
- [ ] establishments confirmed
- [ ] menus / packages validated
- [ ] required documents received and approved
- [ ] required contracts signed
- [ ] modules configured
- [ ] pricing configured
- [ ] corrections closed
- [ ] EcoLoop blockers closed

### After Go-live

- approved data is activated inside the real operational caterer portal
- caterer status becomes **Active**
- modules become effective
- configured pricing and rates become effective
- audit log is created

---

## 30. EcoLoop Onboarding

EcoLoop Onboarding is the **communication and follow-up layer** for onboarding.

### Must include

- tickets by caterer
- conversations by caterer
- correction requests
- internal notes
- client messages
- system actions
- validation follow-up
- linked documents
- linked Smart Import items
- linked contract requests
- linked Go-live blockers

### Actions

- create ticket
- send message
- add internal note
- link to validation item
- link to document
- link to contract
- link to Smart Import item
- link to Go-live blocker
- close ticket
- reassign ticket
- change priority

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

| Priority | Workstream | Required work |
|---|---|---|
| **1** | Navigation cleanup | Remove duplicated Document Vault; remove duplicated Modules; remove standalone Smart Upload / Smart Import from sidebar; add Contract Management; rename "Switch to Caterer Portal"; rename "Modules & Configurations" to "Modules, Pricing & Configurations" |
| **2** | Document architecture | Document Vault by caterer; Dropbox Storage integration; direct upload into hardcoded onboarding categories; document metadata model; document status model; version history; audit |
| **3** | Contract automation | Dropbox Sign template setup; `template_id` configuration; `send_with_template` backend action; merge fields; signature request status tracking; webhook endpoint; signed PDF download; audit trail download; Dropbox Storage upload; Document Vault linking; Go-live re-evaluation |
| **4** | Smart Import engine | Contextual Smart Import; file upload; Dropbox storage; document type detection; field extraction; fuzzy matching; human review; field application; validation item creation; audit trail |
| **5** | Modules / Pricing | Activable modules; pricing per module; founding partner status; effective dates; linked rules; contract merge fields; audit; Go-live blocking |
| **6** | Validation + Go-live | Full validation actions; correction workflow; EcoLoop linkage; automatic Go-live checklist; blockers; audit |

---

## 33. Message to Developers

Team,

We are finalizing **only** the Onboarding ADMIN PORTAL.

The current coded front-end is a good visual base, but the structure must be corrected before backend integration.

The onboarding process is **hardcoded and standardized.** We are not building an ad hoc document request system.

The same onboarding structure applies to every caterer. The same required document categories apply to every caterer. The same contract templates apply to every caterer — with only merge field adjustments such as rates, prices, modules, dates and client-specific values.

### Correct Onboarding ADMIN PORTAL sidebar

1. Dashboard Onboarding
2. Caterers in Onboarding
3. Validation Center
4. Document Vault by Caterer
5. Contract Management
6. Modules, Pricing & Configurations
7. Go-live Monitor
8. EcoLoop Onboarding

**Remove** standalone Smart Upload / Smart Import from the sidebar.

Smart Import and Smart Upload are the **same engine.**

The correct concept is:

> **Smart Import / Smart Upload Engine** = contextual intelligent import engine used in any onboarding section where a document, file or structured data can be uploaded to auto-fill fields.

It must:
- upload the file
- store it in Dropbox
- detect document type
- read content
- extract fields
- perform fuzzy field matching
- map extracted data to EcoLunch fields
- show a human review screen
- allow values to be confirmed, edited or rejected
- apply only confirmed values
- classify the document in the caterer's Document Vault
- create validation items when required
- create a full audit trail

**Document Vault must be organized by caterer.**

All documents must be stored directly in Dropbox. The application backend must only store Dropbox references and metadata — never long-term binary PDFs.

Do not build a manual document request system. The required onboarding document structure is hardcoded. Files are uploaded into the proper onboarding section/category and stored in Dropbox.

**Contract Management** must be added as a dedicated section.

**Modules, Pricing & Configurations** must be added as a dedicated section and must replace the previous "Modules & Configurations" wording.

This section must handle:
- activable modules
- SaaS pricing per module
- monthly rates
- setup fees (if applicable)
- Founding Partner free-for-life status (if applicable)
- discounts / exceptions
- effective dates
- payout rules
- cutoff rules
- credit rules
- labels
- notifications
- reports

Contract Management must consume the values configured in Modules, Pricing & Configurations to populate Dropbox Sign templates, module annexes and fee schedules.

Go-live Monitor must block activation if required modules, pricing or configurations are incomplete.

> **No backend integration should start until the Onboarding ADMIN PORTAL structure, Document Vault by Caterer, Contract Management, Dropbox Storage, Smart Import logic and Modules, Pricing & Configurations section are confirmed.**

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
| Contract Management dependency | Consumes module/pricing values from Modules, Pricing & Configurations |
| Go-live | Automatic readiness logic — all items must be complete |
| Validation Center | Required |
