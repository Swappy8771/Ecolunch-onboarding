# 05 — My Clients / Establishments

---

## Purpose

My Clients / Establishments is fully module-driven. What the caterer sees here depends entirely on which modules EcoLunch Admin has activated. The caterer adds their clients — schools, daycares, camps — and provides all required contact and calendar information.

---

## Module-Driven Display Rules

| Module Active | What Shows in This Section |
|---------------|---------------------------|
| School Meals | Schools tab + CSS / School Districts tab |
| Daycare / CPE Meals | Daycares / CPEs tab |
| Camp Meals | Camps tab |
| None active | Section shows empty state — no tabs |

If multiple modules are active, multiple tabs appear.

---

## School Meals Active — What Caterer Must Complete

### Schools Tab
| Field | Required |
|-------|----------|
| School name | Yes |
| Address | Yes |
| City | Yes |
| Primary contact name | Yes |
| Primary contact email | Yes |
| Student count | Yes |
| CSS district linked | Yes |
| Status | Yes — pending / confirmed |

### CSS / School Districts Tab
| Field | Required |
|-------|----------|
| CSS / District name | Yes |
| Address | Yes |
| Contact name | Yes |
| Contact email | Yes |
| Schools linked to this CSS | Yes |

### Closure Calendars (per school)
| Field | Required |
|-------|----------|
| Closure date | Yes |
| Label (Christmas, Professional Day, etc.) | Yes |
| Source (manual / ICS import / prefill) | System-set |

Smart Import available: upload school list PDF or CSV → auto-fills school names, addresses, contacts.

---

## Daycare / CPE Meals Active — What Caterer Must Complete

### Daycares / CPEs Tab
| Field | Required |
|-------|----------|
| Daycare / CPE name | Yes |
| Address | Yes |
| City | Yes |
| Primary contact name | Yes |
| Primary contact email | Yes |
| Child capacity | Yes |
| Status | Yes — pending / confirmed |

### Closure Calendars (per daycare)
Same structure as school closure calendars.

Smart Import available: upload daycare list PDF or CSV → auto-fills daycare names, contacts.

---

## Camp Meals Active — What Caterer Must Complete

### Camps Tab
| Field | Required |
|-------|----------|
| Camp name | Yes |
| Address | Yes |
| Contact name | Yes |
| Contact email | Yes |
| Session dates / weeks | Yes |
| Participant count | Yes |

---

## Validation Flow

```
Caterer adds all establishments + uploads calendars
  → Caterer submits section
    → caterer_onboarding_files.establishments_status → 'under_review'
      → Admin validates in Validation Center
        → Approved: establishments_status → 'validated'
        → Issue: establishments_status → 'action_required'
```

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `establishments` | `name`, `type`, `address`, `city`, `contact_name`, `contact_email`, `student_count`, `css_id`, `status` |
| `caterer_modules` | `status`, `effective_date` — to determine which tabs show |
| `caterer_onboarding_files` | `establishments_status` |
| `closures` | `establishment_id`, `closure_date`, `label`, `source`, `status` |
| `validation_items` | `type = 'establishment'` |
| `smart_import_jobs` | `section = 'establishments'` |
