# Backend — Credentials & Access Required from the Client

**Purpose:** The complete list of accounts, credentials, and access the backend needs — to hand to the third party (between us and the client). Please fill the **Provide** line for each and return.

**Priority key:**
🔴 needed to start / build against · 🟡 needed for integration testing · 🟢 needed before production launch · ⚪ future (post-go-live, not onboarding)

> Reminder: we can begin development immediately using local databases and *mock* integrations. The items below are needed to test and go live with the **real** services — not to start coding.

---

## A. Databases & data infrastructure

**A1. 🔴 MongoDB — connection (MongoDB Atlas recommended)**
Why: 18 of our 19 tables live in MongoDB; must be a **replica set** (Atlas is by default) so our transactions work.
Provide: the **connection string (SRV URI)**, database name, and a DB user with read/write. Preferred **region: Canada** (data residency — see F4).
Provide: ________________________________________

**A2. 🔴 PostgreSQL — connection (managed host: Neon / Supabase / AWS RDS / their infra)**
Why: the **Banking** module (encrypted financial data) runs on PostgreSQL.
Provide: host, port, database, username, password, SSL mode. Region: Canada preferred.
Provide: ________________________________________

**A3. 🟢 Separate instances per environment** — dev / staging / production (or confirm we self-host dev locally).
Provide: ________________________________________

---

## B. Authentication & OAuth

**B1. 🔴 User login model — confirm**
Our default: **email + password** (we hash; we issue JWT). No third-party login needed.
Question: does the client want **SSO / OAuth login** (Google Workspace / Microsoft 365) for admins or caterers? If yes → provide the OAuth **Client ID + Client Secret + allowed redirect URIs** for that provider.
Provide / confirm: ________________________________________

**B2. 🔴 JWT signing secret** — we generate this ourselves (no action needed) unless the client mandates a specific secrets vault (see G1).
Provide (if mandated): ________________________________________

**B3. ⚪ Accounting-integration OAuth** (QuickBooks / Acomba / Sage) — these connect via OAuth; needed only when the **Accounting module** goes live. Provide app Client ID + Secret + redirect URIs at that time.
Provide (future): ________________________________________

---

## C. File storage & e-signature (both use OAuth 2.0)

**C1. 🟡 Dropbox (file storage)** — all uploaded files live here; the DB stores only links.
Why + how: Dropbox API uses **OAuth 2.0**.
Provide: the Dropbox **App key + App secret**, a **refresh token** (or long-lived access token), and the **target team/folder** for onboarding files.
Provide: ________________________________________

**C2. 🟡 Dropbox Sign (e-signatures)** — sends contracts; returns status via webhook.
Provide:
- **API key**
- **Client ID**
- **Webhook signing secret**
- A **template ID for each contract type**: MSA ____ · NDA ____ · DPA ____ · Platform Terms ____ · Food Safety ____ · Module Annex ____ · Fee Schedule ____
Provide / notes: ________________________________________

**C3. 🟡 Public callback URL for webhooks** — Dropbox Sign must reach our API. Fine to use a tunnel (ngrok) in dev; production needs the real API domain (see F1).
Confirm: ________________________________________

---

## D. Email / notifications

**D1. 🟡 Email provider** — first-login invites, correction notices, reminders.
Provide: provider (SendGrid / Postmark / AWS SES / SMTP), **API key or SMTP credentials**, a verified **"from" address**, and **domain verification** (SPF/DKIM DNS records) so mail isn't spam-filtered.
Provide: ________________________________________

---

## E. Smart Import (document OCR / AI) ⚠️

**E1. 🔴 (decision) Extraction engine** — reads void cheques, menus, KBIS/registration docs and *suggests* field values.
Question: does the client already have an engine (**AWS Textract / Google Document AI / an LLM**), or should we **stub it** (manual entry) for the first release and add real extraction later?
If real: provide the provider + **API key/credentials**.
Provide / decision: ________________________________________

---

## F. Hosting, domain & deployment

**F1. 🟢 Backend hosting** — where the Node/Express API runs (Railway / Render / AWS / Azure / their servers).
Provide: platform + account access (or confirm we choose). The **frontend is on Vercel**.
Provide: ________________________________________

**F2. 🟢 API domain / subdomain + SSL** — e.g. `api.ecolunch.<domain>`.
Provide: the domain + DNS access (or who manages DNS).
Provide: ________________________________________

**F3. 🟢 CORS origins** — the exact frontend URL(s) the API should allow.
Provide: ________________________________________

**F4. 🟡 Data-residency requirement** — caterers are Quebec/France. Must data stay in **Canada / EU**? This decides DB + storage regions.
Confirm: ________________________________________

---

## G. Secrets & security

**G1. 🟢 Secrets manager / KMS** — for production secrets (DB passwords, API keys, the banking encryption key).
Provide: which one (AWS KMS / GCP KMS / Vault / platform env vars) + access, or confirm we use the hosting platform's env-var store.
Provide: ________________________________________

**G2. 🟢 Banking encryption key (AES-256)** — encrypts IBAN/account numbers. We can generate a dev key; production key should come from the client's KMS.
Provide (production): ________________________________________

**G3. 🟢 Who may reveal full bank numbers** — confirm which admin role(s) can decrypt (every reveal is audited).
Confirm: ________________________________________

---

## H. Repository & environments

**H1. 🔴 Git repository access** — currently `github.com/Swappy8771/Ecolunch-onboarding`. Confirm this is the backend repo (or provide the separate backend repo) and give us push access.
Provide: ________________________________________

**H2. 🟢 CI/CD** — how deploys happen (GitHub Actions / platform auto-deploy). Confirm preference.
Provide: ________________________________________

---

## I. Future / operational-phase integrations (⚪ not needed for onboarding)

- **I1. Sezzle** (Buy-Now-Pay-Later) — merchant API key/secret, webhook secret. Post-go-live.
- **I2. Payment rails** (credit card / Apple Pay / Google Pay / Interac) — provider (Stripe/etc.) keys. Post-go-live.
- **I3. Parent / School / Daycare portals** — separate products; credentials TBD.
Provide (future): ________________________________________

---

## J. Nice-to-have (optional)

- **J1. Error monitoring** — Sentry DSN (or similar).
- **J2. Uptime/logs** — any required logging/observability tooling.
Provide (optional): ________________________________________

---

### The short "request list" to send now (🔴 first)

1. **MongoDB Atlas** connection string + DB user (Canada region)
2. **PostgreSQL** host + credentials (Canada region)
3. **Confirm login model** — email/password vs SSO (and OAuth creds if SSO)
4. **Smart Import decision** — real OCR engine (which + key) or stub for now
5. **Git repo** confirmation + push access

Then, for testing the real integrations: **Dropbox** (C1), **Dropbox Sign** (C2), **Email** (D1). Everything else is production/future.

*Prepared for the third party. Companion doc: `BACKEND-QUESTIONS.md` (tech decisions) and `OPEN-DESIGN-DOUBTS.md` (spec questions).*
