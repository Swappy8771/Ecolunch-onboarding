# EcoLunch Backend — System Overview

**One backend. One database. Two portals.**

EcoLunch onboards caterers onto its platform. There are two front-ends, and this single backend serves both:

| Portal | Who uses it | What they see | What they do |
|--------|-------------|---------------|--------------|
| **Admin Onboarding Portal** | EcoLunch staff | **All** caterers | Register caterers, activate & price modules, send contracts, review & approve, approve Go-live |
| **Caterer Onboarding Portal** | The caterer | **Only their own** data | Fill profile, banking, menus, upload docs, sign contracts, fix corrections |

They are **two faces of the same system** — same Node/Express backend, same database, separated by **role**.

---

## The one rule that makes two portals work on one database

```
Admin users    → can see EVERY caterer · perform the admin actions (approve, activate, send, go-live)
Caterer users  → can see only THEIR OWN caterer · fill and submit their sections
```

Every record carries `caterer_id`. An admin query is *not* filtered by it (they see all); a caterer query *always* is (they see one). That single difference is the whole multi-portal design — no second database, no duplicated tables.

---

## The database (shared by both portals)

| | |
|---|---|
| **PostgreSQL** | the **Banking** module only (`caterer_banking`) — financial, encrypted |
| **MongoDB** | everything else (18 collections) |
| **Bridge** | a transactional outbox keeps the two in sync (banking submit) |

The full schema is the same for both portals — defined once in [`db-architecture/`](./db-architecture/).

---

## Where everything is documented

| Area | Folder | What it is |
|------|--------|-----------|
| **Shared data layer** | [`db-architecture/`](./db-architecture/) | Every table: fields, enums, relationships, ER diagram. Used by **both** portals. |
| **Caterer portal** | [`caterer-portal/`](./caterer-portal/) | Caterer behavior + its own preview → `caterer-architecture.html` |
| **Admin portal** | [`admin-portal/`](./admin-portal/) | Admin screens, 8-stage flow, write-ownership + its own preview → `admin-architecture.html` |
| **Open questions (for client)** | [`BACKEND-QUESTIONS.md`](./BACKEND-QUESTIONS.md) | Credentials, hosting, tech-stack sign-off |
| **Spec ambiguities** | [`OPEN-DESIGN-DOUBTS.md`](./OPEN-DESIGN-DOUBTS.md) | Design questions to resolve before coding |

> **Two separate visual previews** (each its own page/link):
> - **Caterer Portal** → `caterer-portal/caterer-architecture.html` (also at `/caterer-architecture.html` once deployed)
> - **Admin Portal** → `admin-portal/admin-architecture.html` (also at `/admin-architecture.html` once deployed)

---

## Who writes what (the short version)

The two portals never fight over data because each **owns** different writes:

| The Caterer writes | The Admin writes | The System writes |
|--------------------|------------------|-------------------|
| Profile, Banking, Establishments, Menus, Documents (uploads), Contract signatures | Module activation & pricing, Validation decisions, Corrections, Contract sending, Go-live approval, Internal notes | Status recomputes, Go-live checklist, Smart Import results, Audit logs |

Full table-by-table ownership: [`admin-portal/03-write-ownership.md`](./admin-portal/03-write-ownership.md).

---

## End-to-end, both portals together

```
ADMIN registers caterer  ─►  ADMIN activates modules + pricing  ─►  ADMIN sends contracts
        │                                                                  │
        ▼                                                                  ▼
CATERER logs in ─► fills Profile / Banking / Establishments / Menus / Docs ─► signs contracts
        │                                   │
        ▼                                   ▼
   (each submit) ───────────────►  ADMIN reviews in Validation Center ─► approve / correct
                                            │
                                            ▼
                              System recomputes the Go-live checklist
                                            │
                                            ▼
                        ADMIN clicks "Validate Go-live"  ─►  caterer = ACTIVE 🎉
```
