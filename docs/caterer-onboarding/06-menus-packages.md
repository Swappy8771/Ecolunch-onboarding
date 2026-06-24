# 06 — Menus & Packages

---

## Purpose

Menus & Packages is fully dynamic. The content shown depends on which modules are active. If a module is not active, its menu block is hidden entirely. The caterer uploads menus, reviews Smart Import auto-filled values, and submits for validation.

---

## Module-Driven Display Rules

| Module Active | Menu Block Shown |
|---------------|-----------------|
| School Meals | School Menus + Common Meals + Rotating Cycle |
| Daycare / CPE Meals | Daycare Menus + Daycare Packages |
| Camp Meals | Camp Menus + Camp Packages (if applicable) |
| Module not active | Block hidden — not shown to caterer |

---

## School Meals Active

### School Menus
| Field | Required | Notes |
|-------|----------|-------|
| Menu name | Yes | |
| Establishment linked | Yes | Which school(s) this menu applies to |
| Type | Yes | `school` |
| Status | System-set | draft → submitted → under_review → validated |
| File upload | Yes | PDF or XLSX |
| Smart Import | Yes | Extracts dish names, dates, allergens |

### Common Meals
| Field | Required | Notes |
|-------|----------|-------|
| Dish name | Yes | |
| Available days | Yes | Monday–Friday |
| Price | Yes | |
| Description | No | |
| Allergens | Yes | |
| Photo | No | |

Common meals automatically appear every day in the parent portal after Go-live.

### Rotating Cycle
| Field | Required | Notes |
|-------|----------|-------|
| Cycle length (weeks) | Yes | e.g. 3-week cycle |
| Dishes per day | Yes | |
| File upload | Yes | PDF or XLSX |
| Smart Import | Yes | Extracts full cycle from document |

Cutoff rules — read from `caterer_modules.cutoff_rules` (set by admin). Caterer sees and confirms cutoff rules but does not set them.

---

## Daycare / CPE Meals Active

### Daycare Menus
| Field | Required | Notes |
|-------|----------|-------|
| Menu name | Yes | |
| Establishment linked | Yes | Which daycare(s) |
| Type | Yes | `daycare` |
| Age group | Yes | Infant / Toddler / Pre-school |
| File upload | Yes | |
| Smart Import | Yes | |

### Daycare Packages
| Field | Required | Notes |
|-------|----------|-------|
| Package name | Yes | e.g. "Full Day", "Half Day" |
| Days / frequency | Yes | |
| Price | Yes | If applicable |
| Establishment linked | Yes | |
| Absence / adjustment rules | If applicable | Read from `caterer_modules.credit_rules` |

---

## Camp Meals Active

### Camp Menus
| Field | Required | Notes |
|-------|----------|-------|
| Menu name | Yes | |
| Camp linked | Yes | |
| Session dates | Yes | |
| File upload | Yes | |
| Smart Import | Yes | |

### Camp Packages
| Field | Required | Notes |
|-------|----------|-------|
| Package name | Yes | |
| Session dates | Yes | |
| Price | If applicable | |

---

## Validation Flow

```
Caterer uploads menu files → Smart Import runs
  → Caterer reviews extracted fields, confirms or edits each one
    → Caterer submits section
      → caterer_onboarding_files.menus_status → 'under_review'
        → Admin validates
          → Approved: menus_status → 'validated'
          → Issue: menus_status → 'action_required' + correction created
```

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `menus` | `name`, `type`, `establishment_id`, `status`, `smart_import_job_id` |
| `caterer_modules` | `status`, `effective_date`, `cutoff_rules`, `credit_rules` — drives which blocks appear |
| `caterer_onboarding_files` | `menus_status` |
| `documents` | `category = 'menus'` |
| `validation_items` | `type = 'menu'` |
| `smart_import_jobs` | `section = 'menus'` |
| `smart_import_fields` | Menu field extractions |
