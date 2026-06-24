# 14 — Shared Tables: Onboarding Caterer Portal vs Main Caterer Portal

Both portals use the same database. `—` means that field is not present/shown in that portal.

---

### `caterers`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `company_name` | `company_name` |
| `legal_name` | `legal_name` |
| `organization_type` | — |
| `logo_url` | `logo_url` |
| `website` | `website` |
| `founded_year` | — |
| `industry_sector` | — |
| `employee_count` | — |
| `annual_capacity_meals` | — |
| `service_types` | — |
| `primary_contact_name` | `primary_contact_name` |
| `primary_contact_title` | — |
| `primary_contact_email` | `primary_contact_email` |
| `primary_contact_phone` | `primary_contact_phone` |
| `address` | — |
| `city` | `city` |
| `postal_code` | — |
| `country` | — |
| `region` | `region` |
| `siren_number` | — |
| `vat_number` | `vat_number` |
| `ape_naf_code` | — |
| `rcs_registration` | — |
| `business_number_neq` | `business_number_neq` |
| — | `status` (Active badge) |
| — | `plan_type` (Premium badge) |
| — | `go_live_at` |

---

### `caterer_banking`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `bank_name` | — |
| `iban` | — |
| `bic_swift` | — |
| `account_type` | — |
| `transit_number` | — |
| `institution_number` | — |
| `branch_code` | — |
| `rib_document_id` | — |
| `bank_statement_doc_id` | — |
| `authorization_letter_id` | — |

---

### `establishments` — Schools
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `name` | `name` |
| `type` | — |
| `address` | — |
| `city` | `city` |
| `contact_name` | `contact_name` |
| `contact_email` | `contact_email` |
| `student_count` | `student_count` |
| `css_district_id` | `css_district_id` |
| — | `status` (confirmed / active) |

---

### `establishments` — Daycares
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `name` | `name` |
| `type` | — |
| `city` | `city` |
| `contact_name` | `contact_name` |
| `contact_email` | `contact_email` |
| `manager_name` | `manager_name` |
| — | `status` (Active / On Hold) |

---

### `establishments` — Camps
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `name` | `name` |
| `type` | — |
| `city` | `city` |
| `contact_name` | `contact_name` |
| `session_dates` | `session_dates` |
| — | `status` |

---

### `closures`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `caterer_id` | `caterer_id` |
| `establishment_id` | `establishment_id` |
| `date` | `date` |
| `reason` | `reason` |
| `type` | `type` |
| `source` | `source` |

---

### `menus`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `type` | `type` |
| `rotation_weeks` | `rotation_weeks` |
| `choices_per_day` | `choices_per_day` |
| `caterer_id` | `caterer_id` |
| `package_name` | `package_name` |
| `package_price_cents` | `package_price_cents` |
| — | `status` (validated / published) |

---

### `menu_schedule`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `menu_id` | `menu_id` |
| `week_number` | `week_number` |
| `day_of_week` | `day_of_week` |
| `choice_slot` | `choice_slot` |
| `dish_id` | `dish_id` |
| `price_cents` | `price_cents` |

---

### `dishes`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `name` | `name` |
| `description` | `description` |
| `price_cents` | `price_cents` |
| `category` | `category` |
| `caterer_id` | `caterer_id` |

---

### `dish_allergens`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `dish_id` | `dish_id` |
| `allergen_code` | `allergen_code` |
| `is_trace` | `is_trace` |

---

### `caterer_modules`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `module_id` (read only) | `module_id` (read only) |
| `status` (read only) | `status` (read only) |
| `effective_date` (read only) | `effective_date` (read only) |
| `monthly_price_cents` (read only) | `monthly_price_cents` (read only) |

---

### `ecoloop_tickets`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `subject` | `subject` |
| `status` | `status` |
| `type` | `type` |
| `priority` | `priority` |
| `unread_count_client` | `unread_count_client` |
| `blocks_golive` | — |

---

### `ecoloop_messages`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `body` | `body` |
| `type` (no `internal_note`) | `type` (no `internal_note`) |
| `sender_id` | `sender_id` |
| `read_at` | `read_at` |
| `created_at` | `created_at` |

---

### `contracts`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `caterer_id` | `caterer_id` |
| `type` | `type` |
| `status` | `status` |
| `signed_at` | `signed_at` |
| `dropbox_sign_id` | — |
| `version` | `version` |

---

### `documents`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `caterer_id` | `caterer_id` |
| `category` | `category` |
| `status` | `status` |
| `version` | `version` |
| `file_path` | `file_path` |
| `uploaded_at` | `uploaded_at` |

---

### `report_schedules`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `report_type` | `report_type` |
| `frequency` | `frequency` |
| `recipient_emails` | `recipient_emails` |
| `format` | `format` |
| `distribution_method` | `distribution_method` |
| `accounting_software` | `accounting_software` |
| — | `enabled` |
| — | `next_shipment_at` |
| — | `last_sent_at` |

---

### `users`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| `email` | `email` |
| `first_name` | `first_name` |
| `last_name` | `last_name` |
| `password` (set on first login) | — |
| — | `last_login_at` |

---

### `caterer_team_members`
| Onboarding Caterer Portal | Main Caterer Portal |
|--------------|----------------|
| — | `caterer_id` |
| — | `user_id` |
| — | `role` (Admin / Administrator) |
| — | `email` |

---

## Tables Only in Onboarding Caterer Portal

Not present in Main Caterer Portal at all.

| Table | Fields | Why Only in Onboarding Caterer Portal |
|-------|--------|--------------------------|
| `caterer_onboarding_files` | `profile_status`, `banking_status`, `establishments_status`, `menus_status`, `documents_status`, `contracts_status`, `modules_status`, `golive_status` | Onboarding progress tracking — no longer needed after Go-live |
| `golive_checklist_items` | `requirement`, `status`, `blocking_reason`, `linked_entity_type`, `linked_entity_id`, `checked_at` | Go-live screen does not exist in Main Caterer Portal |
| `corrections` | `description`, `section`, `priority`, `status`, `ecoloop_ticket_id` | Corrections section does not exist in Main Caterer Portal — issues go through EcoLoop™ directly |
| `smart_import_jobs` | `caterer_id`, `section`, `source_document_id`, `detected_doc_type`, `status`, `confirmed_by`, `confirmed_at` | Smart Import only runs during Onboarding Caterer Portal setup — not available in Main Caterer Portal |
| `smart_import_fields` | `job_id`, `field_name`, `detected_value`, `mapped_value`, `confidence_score`, `status`, `applied_value`, `edited_by` | Part of Smart Import engine — Onboarding Caterer Portal only |

---

## Tables Only in Main Caterer Portal

Not present in Onboarding Caterer Portal at all.

| Table | Main Caterer Portal Screen |
|-------|-----------------------|
| `orders` | Orders, Production, Dashboard |
| `parents` | My Parents, Dashboard, Consolidated view |
| `children` | My Parents, My Daycares |
| `subscriptions` | My Daycares — package per card |
| `subscription_children` | My Daycares income |
| `dish_reviews` | Statistics — satisfaction, top dishes |
| `custom_reports` | Personal Reports |
| `caterer_sidebar_preferences` | My Account → Displaying the modules |
| `sezzle_transactions` | Sezzle Marchand → Transactions |
| `sezzle_plans` | Sezzle Marchand → Uplift, History |
| `sezzle_settlements` | Sezzle Marchand → History |

---

## Rules

1. `internal_note` — never shown to caterer in either portal.
2. `caterer_modules` — read only for both caterer portals. Admin writes only.
3. `caterers.status = 'active'` — set only after admin Go-live approval. "Live" badge must not appear before that.
4. Every table uses `caterer_id` — a caterer sees only their own rows, never another caterer's data.
5. `caterer_sidebar_preferences` ≠ `caterer_modules`. Modules = feature exists (admin sets). Sidebar preferences = caterer chooses to show it in their menu.
