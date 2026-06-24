# Caterer Onboarding Portal — Developer Reference

---

## What This Portal Is

The Caterer Onboarding Portal is the **client-facing onboarding environment** used by the caterer to complete its own onboarding before Go-live.

URL: `http://localhost:5173/client/`

This portal is **not** the operational caterer portal. It is not the admin portal. It covers only the onboarding journey — from first login to Go-live approval.

---

## What This Portal Is NOT

- Not the Admin Onboarding Portal
- Not the global Validation Center
- Not the Admin Contract Management
- Not the Support Access Console
- Not the full operational caterer portal (Orders, Production, Sezzle)
- Not the Parent, School, or Daycare portal

The caterer must only see its own onboarding file. No other caterer's data is ever visible.

---

## Core Rule

```
EcoLunch Admin activates modules
  → Caterer portal displays required setup items
    → Caterer completes / uploads required information
      → Smart Import helps auto-fill fields
        → EcoLunch validates
          → Go-live unlocks only when all required module setup items are complete
```

The caterer does **not** select or price modules. The caterer only:
- Completes required setup information
- Uploads required files
- Reviews Smart Import auto-filled values
- Submits sections for EcoLunch validation

---

## Sidebar Structure

```
Caterer Onboarding Portal
├── Dashboard Onboarding
├── Profile
├── Banks & Banking Information
├── My Clients / Establishments
├── Menus & Packages
├── Document Vault
├── Contracts & Signatures
├── Modules & Required Setup
├── Corrections & Follow-up
├── Go-live
└── EcoLoop
```

---

## Module-Driven Principle

Everything in this portal adapts to the modules EcoLunch Admin has activated:

| Module Activated | What Changes in the Portal |
|------------------|---------------------------|
| School Meals | My Clients shows schools + CSS; Menus shows school menus; Document Vault shows school docs; Go-live adds school checks |
| Daycare / CPE Meals | My Clients shows daycares; Menus shows daycare menus + packages; Document Vault adds daycare docs |
| Camp Meals | My Clients shows camps; Menus shows camp menus; Document Vault adds camp docs |
| Accounting | Modules & Required Setup adds accounting checklist; Document Vault adds accounting docs |
| ReportIQ | Modules & Required Setup adds ReportIQ checklist; Document Vault adds reporting docs |

If a module is not active — its content is hidden or shown as inactive. No irrelevant blocks are shown to the caterer.

---

## File Index

| File | Covers |
|------|--------|
| [01-flow-and-scope.md](01-flow-and-scope.md) | Overall flow, scope, module-driven principle |
| [02-dashboard.md](02-dashboard.md) | Dashboard Onboarding |
| [03-profile.md](03-profile.md) | Profile — company, contact, address, tax |
| [04-banking.md](04-banking.md) | Banks & Banking Information |
| [05-my-clients.md](05-my-clients.md) | My Clients / Establishments — module-driven |
| [06-menus-packages.md](06-menus-packages.md) | Menus & Packages — dynamic per module |
| [07-document-vault.md](07-document-vault.md) | Document Vault — module-aware categories |
| [08-contracts.md](08-contracts.md) | Contracts & Signatures |
| [09-modules-required-setup.md](09-modules-required-setup.md) | Modules & Required Setup |
| [10-corrections.md](10-corrections.md) | Corrections & Follow-up |
| [11-golive.md](11-golive.md) | Go-live — module-driven checklist |
| [12-ecoloop.md](12-ecoloop.md) | EcoLoop |
| [13-smart-import.md](13-smart-import.md) | Smart Import — contextual and module-aware |
| [14-shared-tables-onboarding-vs-operational.md](14-shared-tables-onboarding-vs-operational.md) | Shared tables: what onboarding writes, what operational portal reads |
| [15-portal-only-tables-fields.md](15-portal-only-tables-fields.md) | Field reference for tables exclusive to Client Portal and tables exclusive to Caterer Portal |

---

## Six Core Rules Every Developer Must Know

1. **Module-driven everything** — sections, documents, checklist items, and Go-live requirements all come from activated modules. No module = nothing shown for that module.
2. **Caterer never selects modules** — admin activates them. Caterer only sees what to complete.
3. **No auto-apply on Smart Import** — every extracted field requires explicit human review before it is applied.
4. **Caterer sees only its own data** — every query is scoped by `caterer_id`.
5. **Go-live is blocked** until all required setup items for all activated modules are complete.
6. **Corrections & Document Vault** are also module-aware — only show what is relevant to active modules.
