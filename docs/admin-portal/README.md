# EcoLunch — Admin Onboarding Portal
## Master Index

This folder is the single source of truth for understanding, building, and maintaining the EcoLunch Admin Onboarding Portal.

---

## What This Portal Is

The Admin Onboarding Portal is the internal EcoLunch tool used to onboard caterers (traiteurs) onto the EcoLunch platform. It controls the full process from the moment a caterer is registered to the moment they go live.

One onboarding structure applies to every caterer — same document categories, same contract templates, same go-live checklist. Only the **values** change per caterer (rates, modules, dates, pricing, signatory details).

---

## Core Principles (Never Break These)

| # | Rule |
|---|------|
| 1 | **No auto-apply.** Smart Import extracted data is never applied automatically. Every field must be confirmed, edited, or rejected by a human. |
| 2 | **No binary PDFs in the app database.** All files go to Dropbox Storage. The DB stores only `dropbox_file_id`, `dropbox_file_path`, and metadata. |
| 3 | **Signing a contract does not activate the caterer.** Signed → contract requirement marked complete → go-live checklist re-evaluated → activation only when ALL 11 checklist items pass. |
| 4 | **Go-live requires 100% checklist.** There is no partial activation. |
| 5 | **"Open Support Access Session" is not "Switch to Caterer Portal."** Support sessions are audited — log start, end, actor, reason in `audit_logs`. |
| 6 | **Smart Import is not a sidebar item.** It is a contextual engine that appears inside sections, never as a standalone module in the nav. |

---

## File Index

| File | Covers |
|------|--------|
| [01-flow-and-scope.md](./01-flow-and-scope.md) | Full 8-stage pipeline, scope, portal principles, who owns what at each stage |
| [02-dashboard.md](./02-dashboard.md) | Dashboard — KPIs, quick-access cards, activity feed |
| [03-caterers-in-onboarding.md](./03-caterers-in-onboarding.md) | Caterer list, onboarding file sections, support access sessions |
| [04-validation-center.md](./04-validation-center.md) | Global review queue, item types, status flow, Smart Import review detail |
| [05-document-vault.md](./05-document-vault.md) | 12 fixed categories, Dropbox storage rule, document actions |
| [06-contract-management.md](./06-contract-management.md) | Contract types, Dropbox Sign workflow, webhook events, signing rules |
| [07-modules-pricing-config.md](./07-modules-pricing-config.md) | 7 commercial modules, pricing fields, config options, flow into contracts |
| [08-golive-monitor.md](./08-golive-monitor.md) | 11 checklist requirements, blocker logic, activation chain |
| [09-ecoloop-onboarding.md](./09-ecoloop-onboarding.md) | Ticket structure, message types, linking to other sections |
| [10-smart-import-engine.md](./10-smart-import-engine.md) | 14-step workflow, where it appears, statuses, human review rules |
| [11-database-schema.md](./11-database-schema.md) | All 18 tables, fields, FK relationships, portal usage tags |
| [12-integrations.md](./12-integrations.md) | Dropbox Storage flow, Dropbox Sign API, webhook handling |

---

## Two Users in This System

Every action in this portal is taken by one of two roles:

- **Admin** — EcoLunch internal staff. They register caterers, configure modules, review documents, send contracts, manage the validation queue, and approve go-live.
- **Caterer** — The food service company being onboarded. They fill their profile, submit banking info, upload documents, sign contracts, and respond to correction requests via EcoLoop.

> In the Admin Portal, the admin **sees everything**. The caterer **sees only their own file** through the Caterer Portal (separate product, same underlying data).

---

## Quick Reference: Which Stage Belongs to Whom

| Stage | Who Acts |
|-------|----------|
| Register caterer | Admin only |
| Configure modules + pricing | Admin only |
| Send contracts | Admin only |
| Fill profile, banking, documents | Caterer (admin monitors) |
| Validate submissions | Admin reviews, Caterer corrects |
| Review documents in vault | Admin only |
| Go-live checklist check | Admin only |
| Approve go-live / activate | Admin only |
