# Backend — Open Design Doubts to Resolve Before Development

**Project:** EcoLunch — Caterer Onboarding Portal backend
**Difference from `BACKEND-QUESTIONS.md`:** that file is about credentials and setup. *This* file is about **ambiguities in the specification itself** — places where the docs disagree, are silent, or could be read two ways, and where we'd otherwise have to guess. Each item has a **recommended assumption** so, if it's correct, you can just confirm.

Priority: 🔴 = resolve before we start · 🟡 = resolve before we build that specific area.

---

## 🔴 1. Scope of this backend — caterer-only, or also admin?

**The doubt:** The caterer onboarding portal and the admin portal **share the same database**. Many actions the onboarding flow depends on are performed by **admins**, not caterers — for example: approving a submitted section, activating/pricing modules, creating correction requests, sending contracts, and approving Go-live.

So: is this backend the **caterer-facing API only** (and a *separate* admin backend performs all admin writes), or **one unified backend** serving both portals?

**Why it matters:** It decides whether we build endpoints for validation approval, module configuration, correction creation, contract sending, and Go-live recomputation — or whether those live elsewhere and we only react to their results. It affects almost every model.

*Recommended assumption: build a **single unified backend** for both portals (one codebase, role-based access), since they share one database and the workflows are tightly linked.*
Answer: ________________________________________

---

## 🔴 2. Who owns the "auto-recompute" logic (Go-live checklist & section statuses)?

**The doubt:** The Go-live checklist and section statuses are recomputed automatically when upstream things change (a validation is approved, a contract is signed, a correction is closed). If admin and caterer are *separate* backends, an admin action in one backend must trigger recomputation that the other backend reads.

**Why it matters:** Determines whether recomputation is a simple in-process call (unified backend) or needs an event/messaging bridge (split backends). Depends on the answer to #1.

*Recommended assumption: unified backend → recomputation is an internal service call after each triggering event.*
Answer: ________________________________________

---

## 🔴 3. Canonical field definitions — the docs disagree

**The doubt:** Two docs list different fields for the same models. We need ONE authoritative list before writing schemas.

**a) Caterer names.** Profile (doc 03) collects **Legal Name** and **Trading Name**, but the data model also has **`company_name`**, `legal_name`, AND `trading_name` (three name fields). Are `company_name` and `trading_name` the same thing, or different?
*Recommended assumption: `legal_name` = registered name; `trading_name` (a.k.a. `company_name`) = operating name — i.e., two distinct names, and `company_name`/`trading_name` are the same field.*
Answer: ________________________________________

**b) Banking fields.** Doc 04 (the UI) lists `branch_name`, `bank_country`, `account_holder`, `currency`, `account_number`, and the France RIB fields (`code_etablissement`, `code_guichet`, `cle_rib`, `sepa_compliant`). Doc 14 (the table list) does **not** include those — it only lists `bank_name, iban, bic_swift, account_type, transit_number, institution_number, branch_code` + the 3 documents. Which is the real column set? In particular: is **`account_number` separate from `iban`**, and are the **France RIB fields** needed?
*Recommended assumption: use the fuller doc 04 set; `account_number` and `iban` are separate; France RIB fields are included only if France is an active region (see BACKEND-QUESTIONS F1).*
Answer: ________________________________________

---

## 🔴 4. API contract vs the existing frontend

**The doubt:** The React frontend already exists and currently runs on **mock data** (hard-coded shapes in `src/.../services/mock/`). When the backend goes live, the API responses must match what the frontend expects — or the frontend gets refactored to match the backend.

**Why it matters:** It decides field naming and response shapes for every endpoint. Building the API "blind" risks a second pass to realign with the UI.

*Recommended assumption: we define the API to match the documented data model, then adjust the frontend's data layer to consume it (the mock shapes are not a binding contract).*
Answer: ________________________________________

---

## 🔴 5. File upload mechanism — proxy through backend, or direct to Dropbox?

**The doubt:** When a caterer uploads a document, does the file go (a) to our backend, which then uploads to Dropbox and stores the metadata, or (b) directly from the browser to Dropbox, with the frontend sending us only the resulting file id?

**Why it matters:** Affects the upload endpoints, file-size handling, security, and how Smart Import receives files.

*Recommended assumption: backend proxies the upload (browser → backend → Dropbox), so we control validation, virus/size checks, and metadata in one place.*
Answer: ________________________________________

---

## 🟡 6. Menu ↔ establishment relationship (one, many, or all?)

**The doubt:** Doc 06 says a menu links to "which **school(s)**" (plural), but the data model has a single `establishment_id` (with "empty = applies to all"). Can one menu apply to **several specific** establishments (a many-to-many link), or only to one, or to all?

*Recommended assumption: support all three — `establishment_id = null` means "all", otherwise a menu links to a **list** of establishments (many-to-many).*
Answer: ________________________________________

---

## 🟡 7. Packages vs Menus — same model or separate?

**The doubt:** "Daycare Packages" and "Camp Packages" have their own fields (package name, frequency, price, absence rules). The data model folds `package_name` / `package_price_cents` into the **`menus`** table, and the operational portal's `subscriptions.package_id` points at a menu row.

*Recommended assumption: a "package" is a `menus` row with the package fields filled in (not a separate model).*
Answer: ________________________________________

---

## 🟡 8. "Common Meals" — are these just dishes?

**The doubt:** Common Meals (doc 06) have: dish name, available days, price, description, allergens, photo — which is exactly the `dishes` model.

*Recommended assumption: Common Meals are `dishes` records (with `available_days` set); they are not a separate model.*
Answer: ________________________________________

---

## 🟡 9. Closure calendars — uploaded file, structured rows, or both?

**The doubt:** Doc 05 says the caterer "uploads closure calendars" (a file), but there's also a structured `closures` table (one row per closed date). Do we (a) only store the uploaded file, (b) only store structured rows, or (c) store the file and use Smart Import to extract structured `closures` rows from it?

*Recommended assumption: store the uploaded file as a document **and** structured `closures` rows; the rows can be entered manually or extracted via Smart Import.*
Answer: ________________________________________

---

## 🟡 10. Caterer roles — what can `caterer_staff` do vs `caterer_admin`?

**The doubt:** We have two caterer roles but the docs don't define the difference in permissions (e.g., can staff submit sections? view banking? sign contracts?).

*Recommended assumption: `caterer_admin` can do everything for their caterer including submit/sign; `caterer_staff` can view and edit drafts but cannot submit sections, sign contracts, or view full banking. Please confirm or adjust.*
Answer: ________________________________________

---

## 🟡 11. Bilingual content — do menu/dish names need EN + FR?

**The doubt:** The portal UI is bilingual (FR/EN). Is **caterer-entered content** (menu names, dish names, descriptions) stored in a single language, or does it need both English and French versions?

*Recommended assumption: caterer content is single-language (as entered); only the app's UI labels are translated.*
Answer: ________________________________________

---

## 🟡 12. Smart Import field maps (even for the stub)

**The doubt:** Even if extraction is stubbed initially, we need the agreed **mapping of each document type to the fields it fills** — e.g., a void cheque → IBAN/transit/institution; a KBIS → legal name/SIREN/address; a school list → name/address/contact/enrollment.

**Why it matters:** The review screen and "apply" logic need to know which fields belong to which document type.

*Recommended assumption: we'll draft these maps from docs 10 & 13 and send them back for confirmation.*
Answer: ________________________________________

---

## 🟡 13. Validation granularity

**The doubt:** When a caterer submits a section, is **one** validation item created for the whole section, or several (one per issue/field)? And can multiple corrections come from one submission?

*Recommended assumption: one validation item per submitted section; an admin can raise multiple corrections from that one review.*
Answer: ________________________________________

---

## 🟡 14. Editing a validated section

**The doubt:** Once a section is `validated`, can the caterer voluntarily reopen and edit it, or only through an admin-issued correction?

*Recommended assumption: a validated section is locked; it reopens only via a correction (admin-driven).*
Answer: ________________________________________

---

## 🟢 15. Smaller items (can default; confirm later)

- **Establishment `active` status** — assumed to flip to `active` automatically at Go-live.
- **API base path** — routes are currently `/client/...`; assumed API base `/api/caterer/...` and `/api/admin/...`.
- **Audit log retention** — assumed kept indefinitely (append-only) unless a policy is given.
- **Existing data migration** — assumed greenfield (no existing caterer data to import). Confirm if wrong.

Answer / notes: ________________________________________

---

### The four that most affect the start
1. **#1 — Is this backend caterer-only or unified (admin + caterer)?**
2. **#3 — Canonical field lists (caterer names, banking columns).**
3. **#4 — Do we match the existing frontend, or refactor it to match the API?**
4. **#5 — File upload: through the backend or direct to Dropbox?**

*Once these are confirmed, there are no remaining blockers to begin implementation.*
