# 01 — Overall Flow & Scope

---

## What This Portal Covers

The Admin Onboarding Portal manages the complete lifecycle of bringing a caterer onto the EcoLunch platform — from their first registration to the moment they are live and operational.

**In scope:**
- Registering and managing caterers during onboarding
- Configuring which EcoLunch modules each caterer will use and at what price
- Sending, tracking, and archiving contracts via Dropbox Sign
- Receiving, reviewing, approving, or correcting caterer document submissions
- Validating all caterer-submitted data (profile, banking, menus, establishments)
- Monitoring the go-live checklist and approving activation
- Internal communication with caterers via EcoLoop tickets

**Out of scope (separate products):**
- Day-to-day caterer operations after go-live (Caterer Portal)
- Parent-facing ordering and subscriptions (Parent Portal — future)
- School/Daycare administration (School Portal, Daycare Portal — future)
- Accounting and ledger operations post-activation (Ledger module)

---

## The 8-Stage Onboarding Pipeline

Every caterer goes through the same pipeline in the same order. Stages can overlap (e.g., documents can be uploaded while contracts are being signed), but go-live cannot be approved until all stages are complete.

---

### Stage 1 — Register Caterer
**Owner: Admin**

Admin creates the caterer account in EcoLunch. This is the entry point. Nothing else can begin until the caterer exists in the system.

What happens:
- Admin fills in company name, legal name, trading name, NEQ/SIRET, address, verticals (school / daycare / CSS / camp), and assigned admin
- System creates a `caterers` record with `status: onboarding`
- System creates a `caterer_onboarding_files` record tracking progress across all sections
- System creates `golive_checklist_items` rows for all 11 requirements (all `status: incomplete` at start)
- An `audit_log` entry is created: `action: created`

**Admin role:** Does everything at this stage.
**Caterer role:** Not yet involved — they will receive credentials to access their Caterer Portal separately.

---

### Stage 2 — Configure Modules & Pricing
**Owner: Admin**

Before sending contracts, admin selects which EcoLunch commercial modules the caterer will use and sets the pricing and configuration for each.

What happens:
- Admin opens the caterer's Modules, Pricing & Configurations section
- For each module: set status (active/inactive), effective date, monthly price, setup fee, founding partner free flag, discount, cutoff rules, payout rules, credit rules, notification settings
- System saves records to `caterer_modules`
- Go-live checklist items `modules_configured` and `pricing_configured` are evaluated
- Values in `caterer_modules` become the source of truth for contract merge fields

**Admin role:** Selects modules, sets all pricing and config values.
**Caterer role:** No direct action. The configured values are what the caterer will see in their signed contracts.

> **Why this must happen before contracts:** Contract merge fields like `monthly_rate`, `module_name`, `effective_date`, and `fee_percentage` are pulled from `caterer_modules`. If modules are not configured first, the contract cannot be populated correctly.

---

### Stage 3 — Send Contracts
**Owner: Admin**

Admin sends the required contracts to the caterer's signatory via Dropbox Sign.

What happens:
- Admin selects the contract type (MSA, NDA, DPA, Platform Terms, Module Annex, Fee Schedule, etc.)
- Admin confirms merge field values drawn from `caterer_modules` and caterer profile
- Backend calls Dropbox Sign API: `POST /signature_request/send_with_template`
- Dropbox Sign merges the template, generates the PDF, emails the signatory
- System records the `signature_request_id` in `contracts` and `signature_requests`
- `contracts.status` moves to `sent`

**Admin role:** Initiates sending, confirms merge fields, monitors status.
**Caterer role:** Receives the email from Dropbox Sign, views and signs the document inside Dropbox Sign (not inside EcoLunch).

---

### Stage 4 — Caterer Fills Their Portal
**Owner: Caterer** (Admin monitors)

The caterer logs into their Caterer Portal and completes their onboarding sections. Each submission flows back into the Admin Portal as a validation item.

What caterer fills:
- Profile (company details, contacts, legal info)
- Banks & Banking Information (void cheque, transit/institution/account numbers)
- My Clients / Establishments (schools, daycares, camps, CSS districts)
- Menus & Packages

What admin does during this stage:
- Monitors the Validation Center for new pending items
- Can use Smart Import to pre-fill sections from uploaded documents
- Sends reminders or correction requests via EcoLoop

**Admin role:** Passive monitor + reactive corrector. Watches the Validation Center queue fill up.
**Caterer role:** Active filler. Every submission they make creates a validation item in the admin's queue.

---

### Stage 5 — Admin Validates
**Owner: Admin** (Caterer responds to corrections)

For every item the caterer submits, admin reviews and takes one of three actions: approve, reject, or request correction.

What happens per validation item:
- Admin opens the item in Validation Center
- Reviews submitted data (profile fields, banking details, documents, etc.)
- Takes action: Approve / Reject / Request Correction
- If correction requested: a `corrections` record is created, an EcoLoop ticket is auto-created, caterer is notified
- Caterer fixes the issue and resubmits → creates a new validation item
- Cycle repeats until approved

**Admin role:** Reviews every submission. Is the decision-maker — nothing is approved without admin action.
**Caterer role:** Receives correction requests via EcoLoop, fixes issues, resubmits.

---

### Stage 6 — Review Documents in Vault
**Owner: Admin**

All uploaded documents (caterer-uploaded and admin-uploaded) are reviewed in the Document Vault. This is separate from profile/field validation in Stage 5 — this is about actual document files.

What happens:
- Admin opens the caterer's Document Vault
- Reviews documents across 12 categories
- Approves, rejects, or requests correction on each document
- Can use Smart Import on documents to extract field values (e.g., void cheque → auto-populate banking fields)
- Approved documents satisfy document requirements in the go-live checklist

**Admin role:** Reviews, classifies, and takes action on all documents.
**Caterer role:** Uploads documents to the vault. Receives correction requests via EcoLoop if a document is rejected.

---

### Stage 7 — Go-live Check
**Owner: Admin**

Admin opens the Go-live Monitor for the caterer and reviews the 11-point checklist. Every item must be `complete` before activation can proceed.

What happens:
- System has been evaluating checklist items automatically after each relevant event
- Admin reviews the current state — green for complete, red for blocking
- For any blocking item: admin can click through to the relevant section to resolve it
- Once all 11 items are complete: the "Validate Go-live" button becomes active

**Admin role:** Final reviewer. Must manually click "Validate Go-live" — activation is never automatic.
**Caterer role:** No direct action. But their outstanding items (unsigned contracts, missing documents, open corrections) directly determine whether checklist items are blocked.

---

### Stage 8 — Approve & Activate
**Owner: Admin**

Admin clicks "Validate Go-live." This is a one-way action — it activates the caterer.

What happens immediately after approval:
- `caterers.status` → `active`
- `caterers.go_live_at` → current timestamp
- All configured modules become effective (`caterer_modules.status` → `active` for each)
- Configured pricing and rates become effective
- Caterer Portal switches from onboarding mode to operational mode
- A comprehensive audit log entry is created covering all changes
- EcoLoop ticket created if there are post-activation notes

**Admin role:** Sole decision-maker for activation.
**Caterer role:** Receives notification that they are now live.

---

## How Sections Connect

```
Caterer Registration
        │
        ▼
Modules & Pricing ──────────────► Contract merge fields
        │
        ▼
Contract Management ──────────── Dropbox Sign API
        │ (caterer signs)
        ▼
Caterer fills portal ────────────► Validation Center ◄─── Document Vault
        │                                  │
        │                                  ▼
        │                          Corrections → EcoLoop
        │
        ▼
Go-live Monitor (evaluates all of the above)
        │
        ▼
Activation
```

---

## Portal-Wide Status Values

### Caterer Status
| Status | Meaning |
|--------|---------|
| `onboarding` | Currently going through the pipeline |
| `active` | Go-live approved, operational |
| `paused` | Temporarily suspended post-activation |
| `archived` | Permanently deactivated |

### Validation Item Status
| Status | Meaning |
|--------|---------|
| `pending_review` | Submitted, waiting for admin |
| `in_review` | Admin has opened it |
| `approved` | Accepted |
| `rejected` | Permanently declined |
| `correction_requested` | Sent back to caterer |
| `closed` | Resolved (covers rejected + approved after correction) |

### Document Status
| Status | Meaning |
|--------|---------|
| `uploaded` | File received, not yet reviewed |
| `under_review` | Admin is reviewing |
| `approved` | Accepted |
| `rejected` | Not accepted |
| `correction_requested` | Caterer must re-upload |
| `archived` | Superseded by a newer version |

### Go-live Checklist Item Status
| Status | Meaning |
|--------|---------|
| `complete` | Requirement satisfied |
| `incomplete` | Not yet done |
| `blocked` | A dependency is broken (open correction, unsigned contract, etc.) |
| `waived` | Admin manually waived this requirement (exceptional, logged) |
