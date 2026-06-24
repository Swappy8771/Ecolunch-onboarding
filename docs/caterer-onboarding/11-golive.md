# 11 — Go-live

---

## Purpose

Go-live shows the caterer their readiness checklist. Unlike a static checklist, this is fully module-driven — the requirements shown depend on which modules are activated. Go-live is blocked until every required item is complete. The caterer cannot approve their own Go-live — only EcoLunch Admin can.

---

## Module-Driven Checklist Logic

The checklist is generated from activated modules. Different caterers see different requirements.

### Base Requirements — Always Present

| Requirement | Condition to Complete |
|-------------|----------------------|
| `account_created` | User account exists and is active |
| `profile_validated` | `caterer_onboarding_files.profile_status = 'validated'` |
| `banking_validated` | `caterer_onboarding_files.banking_status = 'validated'` |
| `documents_approved` | All required documents in `documents` table have `status = 'approved'` |
| `contracts_signed` | All sent contracts have `contracts.status = 'signed'` |
| `corrections_closed` | No open high-priority corrections |
| `ecoloop_blockers_closed` | No `ecoloop_tickets` with `blocks_golive = true` still open |

### School Meals Active — Adds These Requirements

| Requirement | Condition to Complete |
|-------------|----------------------|
| `establishments_confirmed` | All schools have `establishments.status = 'confirmed'` |
| `menus_validated` | `caterer_onboarding_files.menus_status = 'validated'` |
| `modules_configured` | School Meals `caterer_modules.status = 'active'` + checklist complete |
| `pricing_configured` | `caterer_modules.monthly_price_cents` is set |

### School Meals + Daycare / CPE Meals Active — Adds

All School Meals requirements above PLUS:
| Requirement | Condition to Complete |
|-------------|----------------------|
| Daycares confirmed | All daycares `establishments.status = 'confirmed'` |
| Daycare menus validated | Daycare menus in `menus` table `status = 'validated'` |
| Daycare packages uploaded | Package docs present in Document Vault |
| Daycare modules configured | Daycare `caterer_modules` checklist complete |

### Camp Meals Active — Adds
| Requirement | Condition to Complete |
|-------------|----------------------|
| Camps confirmed | All camps `establishments.status = 'confirmed'` |
| Camp menus validated | Camp menus `status = 'validated'` |
| Camp dates confirmed | Session dates set on all camp establishments |

### Accounting Active — Adds
| Requirement | Condition to Complete |
|-------------|----------------------|
| Accounting setup complete | Accounting checklist in `caterer_modules` complete |
| Financial documents approved | Annual report, VAT cert, tax clearance approved |

### ReportIQ Active — Adds
| Requirement | Condition to Complete |
|-------------|----------------------|
| ReportIQ setup complete | ReportIQ checklist in `caterer_modules` complete |

---

## Checklist Item Status Values

| Status | Color | Meaning |
|--------|-------|---------|
| `complete` | Green | Done — no action needed |
| `incomplete` | Yellow | Not yet done |
| `blocked` | Red | Cannot complete — has a `blocking_reason` |
| `waived` | Grey | Admin has waived this requirement |

---

## Go-live Approval Flow

```
All checklist items = 'complete'
  → caterer_onboarding_files.golive_status → 'ready'
    → Admin sees caterer in Go-Live Monitor as ready
      → Admin reviews and approves
        → caterers.go_live_at = NOW()
           caterers.status = 'active'
           caterer_onboarding_files.golive_status = 'approved'
```

If any item is `incomplete` or `blocked`:
- Go-live button is disabled for admin
- Caterer sees which items are blocking

---

## Blocking Reason Display

When `status = 'blocked'`, the caterer sees:
- The requirement name
- The `blocking_reason` text (written by admin or system)
- A link to the relevant section or EcoLoop ticket to resolve it

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `golive_checklist_items` | `requirement`, `status`, `blocking_reason`, `linked_entity_type`, `linked_entity_id`, `checked_at` |
| `caterer_onboarding_files` | `golive_status` |
| `caterers` | `go_live_at`, `status` |
| `caterer_modules` | `status` — determines which requirements appear |
| `ecoloop_tickets` | `blocks_golive` — must all be false/closed |
| `corrections` | Open high-priority corrections block `corrections_closed` |
