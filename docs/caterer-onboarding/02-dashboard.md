# 02 — Dashboard Onboarding

---

## Purpose

The Dashboard is the first screen the caterer sees after login. It gives a complete picture of where the onboarding stands — overall progress, section statuses, module readiness, and what needs to be done next.

---

## What the Dashboard Shows

### Overall Progress Bar
- Computed from `caterer_onboarding_files` section statuses
- Shows overall % complete
- Reads `caterers.onboarding_progress_pct`

### Section Status Cards
One card per sidebar section — each showing its current validation status:

| Card | Status Source |
|------|--------------|
| Profile | `caterer_onboarding_files.profile_status` |
| Banks & Banking | `caterer_onboarding_files.banking_status` |
| My Clients / Establishments | `caterer_onboarding_files.establishments_status` |
| Menus & Packages | `caterer_onboarding_files.menus_status` |
| Document Vault | `caterer_onboarding_files.documents_status` |
| Contracts & Signatures | `caterer_onboarding_files.contracts_status` |
| Modules & Required Setup | `caterer_onboarding_files.modules_status` |
| Go-live | `caterer_onboarding_files.golive_status` |

### Active Modules Panel
- Lists all activated modules (`caterer_modules.status = 'active'`)
- Shows setup completion % per module
- Highlights modules with missing items

### Missing Items Alert
- Red alert block listing all sections with `action_required` status
- Tells caterer exactly where to go next

### Go-live Readiness Indicator
- Green if all required items complete
- Red if any Go-live blocker exists
- Reads `caterer_onboarding_files.golive_status`

---

## Status Badge Colors

| Status | Color | Meaning |
|--------|-------|---------|
| `validated` | Green | Admin approved |
| `under_review` | Blue | Submitted, admin reviewing |
| `in_progress` | Yellow | Caterer working on it |
| `not_started` | Grey | Not yet begun |
| `action_required` | Red | Admin flagged a correction |

---

## Database Tables Used

| Table | Fields Read |
|-------|-------------|
| `caterers` | `company_name`, `status`, `phase`, `onboarding_progress_pct`, `go_live_at` |
| `caterer_onboarding_files` | All `*_status` fields, `golive_status` |
| `caterer_modules` | `status`, `effective_date`, `module_id` |
| `modules` | `name`, `key` |
| `corrections` | Count of `status = 'open'` corrections |
| `golive_checklist_items` | Count of incomplete items |
