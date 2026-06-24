# 01 — Flow and Scope

---

## Scope

This document covers the Caterer Onboarding Portal only — the portal at `/client/`.

It begins when a caterer is created by EcoLunch Admin and ends when Go-live is approved.

---

## Full Onboarding Flow

```
Stage 1 — Admin creates caterer record
  Admin creates caterer in Admin Portal
  Admin assigns modules, pricing, effective dates
  System creates caterer user account
  Caterer receives login credentials

Stage 2 — Caterer logs in
  Caterer sees Dashboard Onboarding
  Dashboard shows: activated modules, section statuses, overall progress %, missing items

Stage 3 — Caterer completes Profile
  Company information, business details, contact, address, tax info
  Caterer submits → EcoLunch Admin validates
  Status: not_started → in_progress → validated

Stage 4 — Caterer completes Banking
  Bank details, account info, transit codes
  Required documents uploaded (RIB, bank statement, authorization letter)
  Caterer submits → EcoLunch Admin validates

Stage 5 — Caterer completes My Clients / Establishments
  Module-driven: shows schools, daycares, or camps based on activated modules
  Caterer adds establishments, contacts, links CSS districts
  Uploads closure calendars
  Caterer submits → EcoLunch Admin validates

Stage 6 — Caterer completes Menus & Packages
  Module-driven: shows only menus relevant to activated modules
  Smart Import available for menu documents
  Caterer uploads, reviews Smart Import results, confirms fields
  Caterer submits → EcoLunch Admin validates

Stage 7 — Caterer uploads Documents
  Document Vault shows only categories relevant to activated modules
  Caterer uploads required files per category
  EcoLunch Admin reviews and approves documents

Stage 8 — Contracts signed
  EcoLunch Admin sends contracts via Dropbox Sign
  Caterer receives signing link
  Caterer signs electronically
  Signed documents stored in Document Vault

Stage 9 — Modules & Required Setup completed
  Caterer sees setup checklist per activated module
  Completes missing items, uploads remaining files
  Resolves all corrections flagged by admin

Stage 10 — Corrections resolved
  Admin flags corrections during validation
  Caterer sees corrections in Corrections & Follow-up
  Caterer fixes and resubmits

Stage 11 — Go-live check
  System evaluates all module-driven checklist items
  All items must be complete before Go-live unlocks
  Admin approves Go-live
  caterers.go_live_at is set
  caterers.status changes to 'active'
```

---

## Section Status Values

Every section in the portal has a status:

| Status | Meaning |
|--------|---------|
| `not_started` | Caterer has not begun this section |
| `in_progress` | Caterer has started but not submitted |
| `validated` | Admin has reviewed and approved |
| `under_review` | Submitted by caterer, admin reviewing |
| `action_required` | Admin has flagged a correction |

These statuses are stored in `caterer_onboarding_files` — one row per caterer.

---

## What the Portal Does NOT Do

| Action | Who Does It |
|--------|-------------|
| Activate modules | Admin Portal only |
| Set module pricing | Admin Portal only |
| Set effective dates | Admin Portal only |
| Create correction requests | Admin Portal only |
| Approve validated sections | Admin Portal only |
| Approve Go-live | Admin Portal only |
| Send contracts | Admin Portal only |
| Create caterer record | Admin Portal only |

---

## Module Activation Dependency

The caterer portal sidebar and section content are driven by `caterer_modules` table:

```
caterer_modules.status = 'active'
AND caterer_modules.effective_date <= today
→ Module content appears in caterer portal
```

If neither condition is true — that module's requirements are hidden from the caterer.

---

## Portal Flow Diagram

```
Admin activates modules
        ↓
Caterer logs in → Dashboard shows what must be done
        ↓
Profile → Banking → My Clients → Menus → Documents → Contracts
        ↓
Modules & Required Setup (module-specific checklist)
        ↓
Corrections resolved
        ↓
Go-live checklist complete
        ↓
Admin approves → Go-live
```
