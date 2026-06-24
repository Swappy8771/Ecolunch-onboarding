# 04 — Banks & Banking Information

---

## Purpose

Collects all banking details required for EcoLunch payment processing. Required for every caterer regardless of activated modules. Contains sensitive financial data — IBAN and account number are encrypted at rest.

---

## Tabs

### Overview Tab
- Completion % across all banking sections
- Per-section validation status badges
- Missing fields alert list
- Missing documents alert list

### Bank Details Tab
Three sub-sections:

**Banking Institution Details**
| Field | Required | Sensitive |
|-------|----------|-----------|
| Bank Name | Yes | No |
| Branch Name | Yes | No |
| Branch Code | Yes | No |
| SWIFT / BIC | Yes | No |
| Bank Country | Yes | No |

**Account Information**
| Field | Required | Sensitive |
|-------|----------|-----------|
| Account Holder | Yes | No |
| IBAN | Yes | Yes — encrypted |
| Account Type | Yes | No |
| Currency | Yes | No |
| Account Number | Yes | Yes — encrypted |

**Transit Information**
| Field | Required | Sensitive |
|-------|----------|-----------|
| Code Établissement | Yes | No |
| Code Guichet | Yes | No |
| Clé RIB | Yes | No |
| SEPA Compliant | No | No |

### Documents Tab
Required banking documents:

| Document | Required | Notes |
|----------|----------|-------|
| RIB (Relevé d'Identité Bancaire) | Yes | Official bank identity doc |
| Recent Bank Statement | Yes | Last 3 months |
| Bank Authorization Letter | Yes | Authorizes EcoLunch transfers |
| KBIS / Company Registry Extract | No | Less than 3 months old |

---

## Validation Flow

```
Caterer fills banking fields + uploads documents
  → Caterer submits
    → caterer_onboarding_files.banking_status → 'under_review'
      → Admin validates in Validation Center
        → Approved: banking_status → 'validated'
        → Issue found: banking_status → 'action_required'
                       correction created (e.g. IBAN format error)
```

---

## Smart Import in Banking

Smart Import can pre-fill banking fields from:
- RIB document → auto-fills IBAN, bank name, branch code, transit codes
- Void cheque → auto-fills account number, transit number

Human review required before any field is applied.

---

## Security Rules

- `iban` and `account_number` fields must be encrypted at rest (AES-256)
- Only authorized EcoLunch admins can view full values
- Caterer sees masked values after submission (e.g. FR76 *****)
- API must never return raw IBAN or account number in any client-side response

---

## Database Tables Used

| Table | Fields |
|-------|--------|
| `caterer_banking` | All fields — full table |
| `caterer_onboarding_files` | `banking_status` |
| `documents` | `category = 'banking'` |
| `validation_items` | `type = 'banking'` |
| `smart_import_jobs` | `section = 'banking'` |
| `smart_import_fields` | Banking field extractions |
