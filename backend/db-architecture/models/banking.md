# Model: Banking  ⭐ (the only PostgreSQL model)

## In one line
The caterer's bank account details — kept in PostgreSQL because it's money-related and sensitive (the account numbers are encrypted).

## Where it lives
- **Database:** PostgreSQL (everything else is in MongoDB)
- **Table:** `caterer_banking` (one row per caterer)
- Plus a helper table `banking_outbox` (explained at the bottom)

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `id` | UUID | yes | Unique id for this banking record. |
| `caterer_id` | UUID | yes | Which caterer it belongs to (one record per caterer). |
| `bank_name` | text | yes | Name of the bank. |
| `branch_name` | text | no | Branch name. |
| `branch_code` | text | no | Branch code. |
| `bic_swift` | text | yes | International bank code (8 or 11 characters). |
| `bank_country` | text | yes | Country of the bank (2-letter code). |
| `account_holder` | text | yes | Name on the account. |
| `account_type` | enum | yes | `checking`, `savings`, or `business`. |
| `currency` | text | yes | Account currency (e.g. CAD, EUR). |
| `iban` 🔒 | encrypted | yes | The IBAN — **stored encrypted**, never shown in full. |
| `account_number` 🔒 | encrypted | yes | The account number — **stored encrypted**. |
| `iban_last4` | text | — | Last 4 characters, used to show a masked value like `FR76 •••• 1234`. |
| `account_number_last4` | text | — | Last 4 of the account number, for masking. |
| `transit_number` | text | (Quebec) | 5-digit transit number. |
| `institution_number` | text | (Quebec) | 3-digit institution number. |
| `code_etablissement` | text | (France) | 5-digit bank code. |
| `code_guichet` | text | (France) | 5-digit branch code. |
| `cle_rib` | text | (France) | 2-digit RIB key. |
| `sepa_compliant` | yes/no | no | Whether the account supports SEPA. |
| `rib_document_id` | UUID | yes | Link to the uploaded RIB document. |
| `bank_statement_doc_id` | UUID | yes | Link to the recent bank statement. |
| `authorization_letter_id` | UUID | yes | Link to the bank authorization letter. |
| `submitted_at` | datetime | no | When the caterer submitted banking for review. |
| `created_at` / `updated_at` | datetime | yes | Timestamps. |

🔒 = encrypted at rest with AES-256. The real value is never returned by the API — only the masked `last4` version.

## How it connects
- **One caterer → one banking record.**
- Points to three [documents](./document.md) (RIB, bank statement, authorization letter).
- Its review status is **not** stored here — it lives in the [onboarding-file](./onboarding-file.md) as `banking_status`.

## The Quebec-vs-France rule
A caterer is in one region, so the record must have **either**:
- the **Quebec** pair: `transit_number` + `institution_number`, **or**
- the **France** set: `code_etablissement` + `code_guichet` + `cle_rib`.

Not both empty. The database enforces this.

## Rules & checks
- `iban` and `account_number` are **encrypted before saving** and **never returned raw** — only `last4`.
- `iban` must pass the standard checksum; the France `cle_rib` must match the account.
- `bic_swift`, `currency`, and `bank_country` must be in the correct format.
- Each of the three document links must be a real [document](./document.md) of the same caterer with category "banking".
- Only EcoLunch admins (through a special, logged action) can ever reveal the full numbers.

## Lifecycle
```
caterer fills bank details + uploads 3 docs ──► submits
   └► we save to PostgreSQL AND queue a message for MongoDB (see "the bridge" below)
        └► a banking validation item appears for admin ──► admin approves ──► banking_status = validated
```

## The bridge to MongoDB (why `banking_outbox` exists)
Because banking is in PostgreSQL but the **status** and **approval queue** are in MongoDB, a single "submit" touches both databases. To keep them in sync safely:

1. In **one** PostgreSQL save we write the banking row **and** a row in `banking_outbox` (a to-do note).
2. A small background worker reads `banking_outbox` and creates the matching records in MongoDB (a [validation-item](./validation-item.md) + updates `banking_status` to `under_review`).
3. The note is marked done. If anything crashes, it safely retries — nothing is lost or duplicated.

This is the **only** place the two databases talk to each other.

## Schema (for developers)
```sql
CREATE TABLE caterer_banking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL UNIQUE,        -- app-level link to caterers (MongoDB)
  bank_name TEXT NOT NULL,
  branch_name TEXT, branch_code TEXT,
  bic_swift TEXT NOT NULL,
  bank_country CHAR(2) NOT NULL,
  account_holder TEXT NOT NULL,
  account_type TEXT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'CAD',
  iban_encrypted BYTEA, iban_last4 CHAR(4),
  account_number_encrypted BYTEA, account_number_last4 CHAR(4),
  enc_key_id TEXT,
  transit_number TEXT, institution_number TEXT,           -- Quebec
  code_etablissement TEXT, code_guichet TEXT, cle_rib TEXT, -- France
  sepa_compliant BOOLEAN,
  rib_document_id UUID, bank_statement_doc_id UUID, authorization_letter_id UUID,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_region CHECK (
    (transit_number IS NOT NULL AND institution_number IS NOT NULL)
    OR (code_etablissement IS NOT NULL AND code_guichet IS NOT NULL AND cle_rib IS NOT NULL)
  ),
  CONSTRAINT chk_bic CHECK (bic_swift ~ '^[A-Z0-9]{8}([A-Z0-9]{3})?$')
);

CREATE TABLE banking_outbox (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL,
  event_type TEXT NOT NULL,        -- banking.submitted | banking.updated | banking.smartimport_applied
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,        -- NULL = not yet copied to MongoDB
  attempts INT NOT NULL DEFAULT 0,
  last_error TEXT
);
CREATE INDEX ix_outbox_todo ON banking_outbox (created_at) WHERE processed_at IS NULL;
```
