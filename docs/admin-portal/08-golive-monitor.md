# 08 — Go-live Monitor

---

## Purpose

The Go-live Monitor is the final gate before a caterer becomes operational. It tracks 11 specific requirements and verifies that every one of them is complete before allowing activation. Nothing can be skipped or partially completed.

The system evaluates the checklist automatically after every relevant event throughout the onboarding process. Admin does not manually tick boxes — the system updates them. What admin does is review the final state and make the activation decision.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Reviews the checklist. Resolves blockers by navigating to the relevant section. Clicks "Validate Go-live" when all items are complete. |
| **Caterer** | ❌ No direct access to this section. However, everything the caterer does (or fails to do) directly affects whether checklist items are `complete` or `blocked`. |

---

## The 11 Required Checklist Items

Every item must be `complete` for activation to proceed. There are no exceptions unless an item is explicitly `waived` by an admin (logged in audit).

| # | Requirement Key | Complete When |
|---|----------------|---------------|
| 1 | `account_created` | The caterer user account exists and can log in |
| 2 | `profile_validated` | All required profile fields submitted and approved in Validation Center |
| 3 | `banking_validated` | Banking information submitted and approved |
| 4 | `establishments_confirmed` | At least one establishment (school, daycare, camp, or CSS) is confirmed |
| 5 | `menus_validated` | At least one menu submitted and validated |
| 6 | `documents_approved` | All required documents received and approved in the vault |
| 7 | `contracts_signed` | All required contracts fully signed via Dropbox Sign |
| 8 | `modules_configured` | At least one module set to active with effective date |
| 9 | `pricing_configured` | Pricing set for all active modules |
| 10 | `corrections_closed` | No open corrections records — all issues resolved |
| 11 | `ecoloop_blockers_closed` | No EcoLoop tickets marked as blocking go-live |

---

## Checklist Item Status Values

| Status | Meaning |
|--------|---------|
| `incomplete` | Requirement not yet met |
| `complete` | Requirement satisfied |
| `blocked` | A dependency is preventing completion (e.g., open correction, unsigned contract) |
| `waived` | Admin manually waived this requirement — must be logged with reason |

---

## What the Monitor Shows Per Caterer

The Go-live Monitor shows:

| Information | Description |
|-------------|-------------|
| Overall Readiness % | Percentage of completed items out of 11 |
| Completed Steps | List of `complete` checklist items with completion date |
| Blocking Steps | List of `blocked` or `incomplete` items with reason |
| Missing Required Documents | Which document categories still need files |
| Unsigned Contracts | Which contract types are still pending signature |
| Open Validations | Count of validation items still pending admin review |
| Open Corrections | Count of correction records not yet resolved |
| Modules Not Configured | If no module has been activated |
| Pricing Not Set | If any active module has no pricing |
| Establishments Not Confirmed | If no establishment has been confirmed yet |
| Menus Not Validated | If no menu has been validated yet |
| Ready / Not Ready Status | Overall readiness label |

---

## Auto-Evaluation — When Checklist Items Are Re-Evaluated

The system automatically re-evaluates the relevant checklist items whenever:

| Event | Re-evaluates |
|-------|-------------|
| Validation item approved | `profile_validated`, `banking_validated`, `establishments_confirmed`, `menus_validated` |
| Document approved | `documents_approved` |
| Contract webhook received (all_signed) | `contracts_signed` |
| Module configured | `modules_configured` |
| Pricing set | `pricing_configured` |
| Correction closed | `corrections_closed` |
| EcoLoop ticket closed | `ecoloop_blockers_closed` |

Admin does not need to manually refresh. The checklist reflects live state.

---

## Admin Actions in the Monitor

| Action | What Happens |
|--------|-------------|
| **View Blocker Detail** | Expand a blocking item to see exactly what's missing |
| **Open Blocking Section** | One-click navigation to the section that has the blocker (e.g., click on "unsigned contract" → goes to Contract Management for this caterer) |
| **Send Client Reminder** | Triggers a reminder to the caterer for outstanding items |
| **Send via EcoLoop** | Creates an EcoLoop ticket linked to a specific blocker |
| **Validate Go-live** | Activates the caterer — only available when all 11 items are `complete` |
| **Block Go-live** | Manual override to prevent activation even if all items are complete (rare — requires reason, logged) |
| **View Audit Trail** | Full history of checklist evaluations and changes |

---

## The "Validate Go-live" Action — What Happens

When admin clicks "Validate Go-live":

```
1. System confirms all 11 items are still complete (double-check at activation time)
   │
   ├── If not all complete → activation blocked, admin sees which items failed
   │
   └── If all complete → proceed
         │
         ▼
2. caterers.status → active
   caterers.go_live_at → current timestamp
         │
         ▼
3. All caterer_modules with status: pending → active
   All effective_dates become active
         │
         ▼
4. Configured pricing and rates become live
         │
         ▼
5. Caterer Portal switches from onboarding mode to operational mode
         │
         ▼
6. Comprehensive audit_log entry created (entity: caterer, action: activated)
         │
         ▼
7. EcoLoop ticket created if there are post-activation notes
```

This action is **irreversible** through normal UI — deactivating after go-live requires a separate admin process (not in onboarding flow).

---

## Admin vs Caterer Role Summary

| Aspect | Admin | Caterer |
|--------|-------|---------|
| View the checklist | ✅ Full view | ❌ (sees progress in their portal, not the checklist itself) |
| Trigger checklist re-evaluation | ✅ (happens automatically on their actions) | ✅ (their submissions trigger evaluations indirectly) |
| Resolve a blocked item | ✅ Navigates to the blocking section | ✅ Must complete the outstanding action (sign, submit, fix) |
| Click "Validate Go-live" | ✅ Only admin can activate | ❌ |
| Receive notification when activated | ✅ Confirms it themselves | ✅ Notified that they are live |
| Waive a checklist item | ✅ (with logged reason) | ❌ |
