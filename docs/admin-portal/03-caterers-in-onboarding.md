# 03 — Caterers in Onboarding

---

## Purpose

This is the master list of all caterers currently being onboarded. Each row in the table is the entry point into that caterer's full onboarding file. Every caterer-specific task in the admin portal starts here — open the caterer, then navigate inside their file.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Browses the caterer list. Opens individual caterer files. Monitors progress and blockers. Initiates support access sessions. |
| **Caterer** | ❌ No direct access. They work in their own Caterer Portal, which shows only their own data. |

---

## The Caterer List Table

Each row represents one caterer currently in onboarding.

| Column | What It Shows |
|--------|---------------|
| Caterer Name + Location | Company name and city |
| Verticals | Which services they operate: schools / daycares / CSS / camps |
| Overall Progress % | Computed from `caterer_onboarding_files` section statuses |
| Status | `Onboarding` / `Active` / `Blocked` |
| Open Validations | Count of pending + in-review validation items |
| Open Tickets | Count of open EcoLoop tickets |
| Assigned Admin | Which EcoLunch staff member owns this caterer |
| Last Updated | Timestamp of most recent activity |

### Row Menu Actions

From any caterer's row (three-dot menu):

| Action | Where It Goes |
|--------|---------------|
| Open Onboarding File | Full caterer workspace (see below) |
| Open Validation Items | Filtered Validation Center for this caterer |
| Open Document Vault | This caterer's vault |
| Open Contract Management | This caterer's contracts |
| Open EcoLoop Thread | This caterer's tickets |
| Open Go-live Blockers | Go-live Monitor for this caterer |
| Open Support Access Session | Audited session — see note below |

---

## Support Access Session

When an admin clicks **"Open Support Access Session"**, they enter the caterer's portal as a support observer.

**This is not "Switch to Caterer Portal."**

Rules:
- The session start is logged in `audit_logs` with `action: support_access_start`, `actor_type: support_session`, actor's user ID, timestamp, and reason
- The session end is also logged: `action: support_access_end`
- The admin can see the caterer's portal as the caterer sees it
- All actions taken during a support session are traceable in the audit log

Why this matters: If there is ever a dispute about what was done in a caterer's account, the audit trail must show whether it was the caterer themselves or an admin in a support session.

---

## The Caterer Onboarding File

When admin opens a caterer, they enter that caterer's full onboarding workspace. This workspace has 11 internal sections — these are **not** global sidebar items, they exist only inside the caterer file:

| Section | What It Contains |
|---------|-----------------|
| Overview | Summary progress across all sections, overall % completion, blockers |
| Profile | Company details, legal info, contact persons, address |
| Banks & Banking Information | Bank account details, void cheque, transit/institution/account numbers |
| My Clients / Establishments | All linked schools, daycares, camps, CSS districts |
| Menus & Packages | All submitted menus and their validation status |
| Document Vault | This caterer's documents across 12 categories |
| Contract Management | All contracts sent/signed/pending for this caterer |
| Modules, Pricing & Configurations | Active modules + pricing configured for this caterer |
| Validation & Corrections | All validation items and corrections for this caterer |
| Go-live | This caterer's checklist and readiness status |
| EcoLoop | All tickets and messages between admin and this caterer |
| Audit | Complete action history for this caterer |

---

## Admin vs Caterer Role — Section by Section

| Section | Admin Does | Caterer Does |
|---------|-----------|-------------|
| Overview | Views progress, spots blockers | Views their own progress |
| Profile | Reviews and validates submissions | Fills in and submits |
| Banking | Reviews, validates, approves banking info | Submits banking details and void cheque |
| Establishments | Reviews, confirms entity records | Adds schools / daycares / camps |
| Menus | Reviews and validates submitted menus | Creates and submits menus |
| Document Vault | Reviews, approves, rejects, requests corrections | Uploads documents |
| Contract Management | Sends contracts, monitors signing | Signs contracts via Dropbox Sign email |
| Modules & Pricing | Configures modules and pricing | Views what was configured (in their portal) |
| Validation & Corrections | Reviews, approves, or creates corrections | Resolves correction requests |
| Go-live | Reviews checklist, approves activation | Must complete all requirements first |
| EcoLoop | Sends messages, creates tickets, adds internal notes | Reads messages, responds to corrections |
| Audit | Views full history | Views their own actions only |

---

## Data Connections

- `caterers` — one row per caterer
- `caterer_onboarding_files` — one row per caterer, tracks section statuses
- `users` — each caterer has user accounts linked via `caterer_id`
- `golive_checklist_items` — one row per requirement per caterer
- `audit_logs` — every action on a caterer is logged here
