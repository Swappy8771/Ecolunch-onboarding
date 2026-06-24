# 03 — Profile

---

## Purpose

The Profile section collects all company, contact, address, and tax information for the caterer. This is not module-driven — it is required for every caterer regardless of which modules are activated.

---

## Sections and Fields

### Company Information
| Field | Required | Notes |
|-------|----------|-------|
| Legal Name | Yes | Official registered company name |
| Trading Name | Yes | Name used in operations |
| Organization Type | Yes | SARL, SAS, Inc., etc. |
| Founded Year | No | |
| Website | No | |
| Company Logo | Yes | Uploaded file — stored in Dropbox |

### Business Details
| Field | Required | Notes |
|-------|----------|-------|
| Industry Sector | Yes | Institutional Catering |
| Number of Employees | Yes | |
| Annual Capacity (meals) | Yes | |
| Active Service Types | Yes | Driven by activated modules |
| Kitchen Locations | Yes | Count |
| Delivery Zones | No | |

### Primary Contact Information
| Field | Required | Notes |
|-------|----------|-------|
| Full Name | Yes | |
| Job Title | Yes | |
| Email Address | Yes | |
| Phone Number | Yes | |
| Secondary Contact Name | No | |
| Secondary Contact Email | No | |

### Address Information
| Field | Required | Notes |
|-------|----------|-------|
| Registered Address | Yes | Street address |
| City | Yes | |
| Postal Code | Yes | |
| Country | Yes | |
| Region / Department | No | |
| Operating Address | No | If different from registered |

### Tax Information
| Field | Required | Notes |
|-------|----------|-------|
| SIRET / NEQ Number | Yes | Quebec: NEQ, France: SIRET |
| SIREN Number | Yes | France only |
| VAT Number | Yes | |
| APE / NAF Code | Yes | France activity code |
| RCS Registration | No | |

---

## Validation Flow

```
Caterer fills all required fields
  → Caterer clicks Submit
    → caterer_onboarding_files.profile_status → 'under_review'
      → Admin reviews in Validation Center
        → Approved: profile_status → 'validated'
        → Rejected: profile_status → 'action_required'
                    correction created in corrections table
```

---

## Smart Import in Profile

Smart Import can pre-fill Profile fields from uploaded company documents:
- KBIS extract → auto-fills SIRET, SIREN, Legal Name, Address
- Company registry extract → auto-fills organization type, address
- Human review required before any value is applied

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `caterers` | `company_name`, `legal_name`, `trading_name`, `organization_type`, `founded_year`, `website`, `logo_url`, `industry_sector`, `employee_count`, `annual_capacity_meals`, `service_types`, `kitchen_locations`, `delivery_zones`, `primary_contact_name`, `primary_contact_title`, `primary_contact_email`, `primary_contact_phone`, `secondary_contact_name`, `secondary_contact_email`, `registered_address`, `city`, `postal_code`, `country`, `region`, `neq_number`, `siren_number`, `vat_number`, `ape_naf_code`, `rcs_registration` |
| `caterer_onboarding_files` | `profile_status` |
| `documents` | Logo file reference |
| `validation_items` | `type = 'profile'` |
