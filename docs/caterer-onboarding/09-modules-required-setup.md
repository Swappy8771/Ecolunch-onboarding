# 09 — Modules & Required Setup

---

## Purpose

This section shows the caterer exactly what must be completed for each activated module. The caterer does not select or price modules here — that is done by EcoLunch Admin only. The caterer sees: which modules are active, what is still missing, what documents are needed, what corrections exist, and what is blocking Go-live.

**Renamed from:** Modules & Pricing Summary → **Modules & Required Setup**

---

## What the Caterer Sees Per Module

For each activated module:
- Module name and active status
- Setup completion % (done / total required items)
- Required setup checklist — item by item
- Missing items highlighted in red
- Linked documents with approval status
- Linked corrections (open ones)
- Linked Go-live blockers
- Linked EcoLoop conversations (if any)

Inactive modules appear as greyed-out stubs: "Required setup will appear once this module is activated."

---

## School Meals — Setup Checklist

| Setup Item | Required |
|-----------|----------|
| Register all schools | Yes |
| Link schools to CSS districts | Yes |
| Add school contacts | Yes |
| Upload closure calendars (all schools) | Yes |
| Upload school menus | Yes |
| Upload common meals | Yes |
| Upload rotating cycle | If applicable |
| Confirm cutoff rules | Yes |
| Submit allergen protocol | Yes |
| Confirm nutritional standards compliance | Yes |
| Submit HACCP certification | Yes |
| Confirm label requirements | If applicable |
| Confirm production requirements | If applicable |
| Confirm school / CSS reporting requirements | If applicable |

---

## Daycare / CPE Meals — Setup Checklist

| Setup Item | Required |
|-----------|----------|
| Register all daycares / CPEs | Yes |
| Add daycare contacts | Yes |
| Upload closure calendars (all daycares) | Yes |
| Upload daycare menus | Yes |
| Upload daycare packages | Yes |
| Complete package pricing | If applicable |
| Confirm days / frequency | Yes |
| Confirm absence / adjustment rules | If applicable |
| Submit DDASS certification | Yes |
| Submit infant nutrition protocol | Yes |
| Obtain CPE menu approval | Yes |
| Confirm daycare reporting requirements | If applicable |

---

## Camp Meals — Setup Checklist

| Setup Item | Required |
|-----------|----------|
| Register all camps | Yes |
| Add camp contacts | Yes |
| Upload camp menus | Yes |
| Upload camp packages | If applicable |
| Confirm camp dates / weeks | Yes |
| Upload camp calendars | Yes |
| Confirm reporting requirements | If applicable |

---

## Accounting — Setup Checklist

| Setup Item | Required |
|-----------|----------|
| Select accounting software | Yes |
| Upload annual financial report | Yes |
| Confirm VAT registration | Yes |
| Submit tax clearance certificate | Yes |
| Confirm accounting codes | If applicable |
| Confirm export preference | Yes |
| Confirm tax setup | If applicable |
| Confirm accounting mapping | If applicable |

---

## ReportIQ — Setup Checklist

| Setup Item | Required |
|-----------|----------|
| Select required report types | Yes |
| Confirm report recipients | Yes |
| Confirm report frequency | Yes |
| Confirm report format | Yes |
| Link establishments to reports | Yes |
| Confirm automation needs | Yes |

---

## Setup Item Status Values

| Status | Meaning |
|--------|---------|
| `complete` | Item is done and accepted |
| `pending` | Caterer has submitted, awaiting admin review |
| `missing` | Not yet done — blocks Go-live |
| `blocked` | Cannot complete — depends on another item first |

---

## Module Card Layout

Each module card shows:

```
[Module Name]         Active ●        X blockers   Y corrections   Z unread
[subtitle]
─────────────────────────────────────────────────────
Required Setup — N of M complete           [XX%]
  ● Register all schools          Complete
  ● Link schools to CSS           Complete
  ⚠ Upload closure calendars      Pending (1 calendar missing)
  ✕ Submit allergen protocol      Missing
  ✕ Upload rotating cycle         Missing
─────────────────────────────────────────────────────
Missing Items | Linked Documents | Linked Corrections | Go-live Blockers | EcoLoop
```

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `caterer_modules` | `module_id`, `status`, `effective_date`, `cutoff_rules`, `credit_rules` |
| `modules` | `key`, `name`, `type` |
| `caterer_onboarding_files` | `modules_status` |
| `documents` | Linked per module — `category` matches module |
| `corrections` | `status = 'open'` linked to module sections |
| `golive_checklist_items` | Items blocking Go-live per module |
| `ecoloop_tickets` | Linked conversations per module |
