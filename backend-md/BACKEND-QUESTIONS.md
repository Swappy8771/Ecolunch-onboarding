# Backend Development — Questions & Requirements for Confirmation

**Project:** EcoLunch — Caterer Onboarding Portal backend
**Stack (already decided):** Node.js + Express · **PostgreSQL** for the Banking module · **MongoDB** for all other models
**Purpose of this document:** A checklist of decisions, credentials, and clarifications we need confirmed before/while building the backend. Please fill in the **Answer** line under each item. Items marked ⚠️ are blocking for that area.

> Note: We can begin development immediately using local test databases and *mock* versions of the third-party services. The credentials below are needed to test and go live with the real integrations — not to start.

---

## Section A — Technical stack decisions

**A1. Programming language — TypeScript or JavaScript?**
*Recommendation: TypeScript (matches the existing React/TypeScript frontend and is safer with our data models).*
Answer: ________________________________________

**A2. Data-layer libraries?**
*Recommendation: Mongoose (for MongoDB models) + Prisma (for the PostgreSQL banking table and migrations).*
Alternatives: Mongoose + Knex (hand-written SQL), or native drivers only.
Answer: ________________________________________

**A3. API style — REST?**
*Recommendation: REST (the documentation already describes REST-style `/api/...` endpoints).*
Answer: ________________________________________

**A4. Node.js version and package manager?**
*Recommendation: Node 20 LTS + npm (frontend already uses npm).*
Answer: ________________________________________

---

## Section B — Databases & hosting

**B1. Where do the databases run during development?**
*Recommendation: Local via Docker (we provide a docker-compose; no accounts needed to start).*
Alternatives: Managed cloud now (MongoDB Atlas + a Postgres host), or use existing servers.
Answer: ________________________________________

**B2. ⚠️ MongoDB must run as a replica set** (required for multi-document transactions). Is that acceptable for both dev and production?
Answer: ________________________________________

**B3. Production hosting for the backend** (Railway / Render / AWS / Azure / other)?
*The frontend is currently on Vercel.*
Answer: ________________________________________

**B4. Production database providers** — who hosts Postgres and MongoDB in production (e.g., MongoDB Atlas, Neon/Supabase/RDS for Postgres)?
Answer: ________________________________________

---

## Section C — Third-party service credentials  ⚠️

**C1. Dropbox Storage** (all uploaded files are stored here; the database only keeps links).
Needed: App key + secret (or an access token), and the target folder/team account.
Answer: ________________________________________

**C2. Dropbox Sign** (sends contracts for e-signature; status returns via webhook).
Needed: API key, Client ID, **Webhook secret**, and a **template ID for each contract type**:
- MSA (Master Service Agreement): __________
- NDA: __________
- DPA: __________
- Platform Terms: __________
- Food Safety: __________
- Module Annex: __________
- Fee Schedule: __________
Answer / notes: ________________________________________

**C3. Email provider** (first-login invites, correction notices, notifications).
Needed: Provider (SendGrid / Postmark / SMTP), API key or SMTP credentials, and a "from" address.
Answer: ________________________________________

**C4. ⚠️ Smart Import extraction engine** — this is the feature that reads uploaded PDFs/cheques/menus and *suggests* field values. It needs an OCR/AI engine.
Question: Do you already have one (e.g., AWS Textract, Google Document AI, an LLM service), or should we build a **stub** (manual entry, no auto-extraction) for now and add real extraction later?
*Recommendation: Stub it for the first release so onboarding works; add real extraction as a follow-up.*
Answer: ________________________________________

---

## Section D — Security

**D1. Banking encryption key** — bank IBAN/account numbers are encrypted (AES-256). Who manages the key (a secret manager / KMS), or should we generate and store it in environment config?
*Recommendation: Generate a dev key now; use a managed secret (KMS) in production.*
Answer: ________________________________________

**D2. Who is allowed to view the *full* bank account numbers?** (By design, only specific admins, and every reveal is logged.) Please confirm which admin role(s).
Answer: ________________________________________

**D3. JWT / session secret management** — env variable now, secret manager in production. Confirm acceptable.
Answer: ________________________________________

---

## Section E — Authentication & users

**E1. Login flow** — confirm: Admin creates the caterer → system emails a login link → the caterer sets their password on first login. Correct?
Answer: ________________________________________

**E2. Who triggers the invite email** — automatically when the admin creates the caterer, or manually by the admin?
Answer: ________________________________________

**E3. Single login or team logins** for a caterer during onboarding? (We support a main account `caterer_admin` and additional `caterer_staff`.)
Answer: ________________________________________

**E4. Password policy / two-factor authentication** — any requirements (minimum length, 2FA)?
Answer: ________________________________________

---

## Section F — Product & business rules

**F1. ⚠️ Regions** — are both **Quebec** and **France** active now, or only one? (This decides the banking and tax field rules: Quebec uses NEQ + transit/institution numbers; France uses SIREN/SIRET/NAF + RIB.)
Answer: ________________________________________

**F2. Default currency** for banking/pricing (CAD, EUR, both)?
Answer: ________________________________________

**F3. Module catalogue** — confirm the commercial modules to seed: School Meals, Daycare/CPE Meals, Camp Meals, ReportIQ, Accounting, Parent Subscriptions, CSS Reporting. Any changes?
Answer: ________________________________________

**F4. Go-live rule** — confirm: activation is all-or-nothing (every checklist item complete), only an admin can approve, and it cannot be undone through the normal UI. Correct?
Answer: ________________________________________

---

## Section G — Integrations & webhooks

**G1. Webhook testing in development** — Dropbox Sign needs to call a public URL. OK to use a tunnel (e.g., ngrok) during development?
Answer: ________________________________________

**G2. Any existing systems to integrate** beyond Dropbox (accounting software like Acomba/QuickBooks/Sage, payment providers, etc.) for the onboarding phase specifically?
Answer: ________________________________________

---

## Section H — Scope & delivery

**H1. First milestone** — preferred build order?
*Recommendation: (1) Scaffold the project + databases + auth, (2) Profile, (3) Banking (the Postgres module), (4) the rest section by section.*
Answer: ________________________________________

**H2. Is there a deadline or priority module** the third party cares about most?
Answer: ________________________________________

**H3. Environments** — how many do we need (development, staging, production)?
Answer: ________________________________________

---

## Section I — Anything else

**I1. Any constraints we should know** (data residency / privacy rules, existing API contracts the frontend already expects, naming conventions, branching/repo workflow)?
Answer: ________________________________________

---

### Summary of what is *blocking* vs *not blocking*

| Can start without | Needed to test real features | Needed before production |
|---|---|---|
| Stack decisions (A), local DBs (B1), region rule (F1) | Dropbox (C1), Dropbox Sign (C2), Email (C3) | Real encryption key (D1), prod hosting (B3/B4), secret management (D3) |
| Mock integrations for Dropbox/Sign/Email/Smart-Import | Smart Import engine decision (C4) | Webhook public URL on the real domain |

*Prepared for third-party confirmation. Once these are answered, we can finalize configuration and begin implementation.*
