# Model: caterer_banking ★ (admin view)

**Storage:** **PostgreSQL** (the only SQL table) · **Admin screen:** Caterer → Banking · Validation Center
**One line:** The caterer's bank details. The admin **reviews** them (never writes the values); IBAN/account are encrypted.

## Fields (canonical — docs/admin-portal/13)
| Field | Type | Notes |
|-------|------|-------|
| `bank_name` | varchar | |
| `branch_name` | varchar | |
| `swift_bic` | varchar | **canonical name** (caterer model had `bic_swift`) |
| `iban` 🔒 | varchar | encrypted at rest; never returned raw |
| `account_holder` | varchar | |
| `account_type` | varchar | |
| `currency` | varchar | |
| `code_etablissement` | varchar | France |
| `code_guichet` | varchar | France |
| `cle_rib` | varchar | France |
| `sepa_compliant` | bool | |
| `validation_status` | enum | admin review status for this banking record |

Plus our infra: `caterer_id` (FK → caterers, cross-DB), `id` (PK), and the **`banking_outbox`** table that carries a banking submit over to MongoDB (creates the validation item + sets `banking_status`).

## Admin reads / writes
- **Reads:** all fields (a privileged reveal of the full IBAN is audited).
- **Writes:** none to the values — the admin only **approves/rejects** the banking `validation_item` (in MongoDB).

## Notes
- The Quebec transit/institution fields (`transit_number`, `institution_number`) appear in the caterer docs but not in admin doc 13's list — region reconciliation (ties to Doubt #F1).
- Banking review **status** lives in MongoDB (`caterer_onboarding_files.banking_status` + a `validation_item`), not in this table.
