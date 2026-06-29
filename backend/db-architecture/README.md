# EcoLunch Backend — Database Models (Caterer Onboarding)

This folder explains the database **one model at a time**, in plain language.
Each model has its own file under [`models/`](./models/) that tells you everything about it in one place: what it is, what it stores, what each status means, what it connects to, and the rules.

---

## The big picture (in one minute)

EcoLunch onboards **caterers** (food companies) so they can go live on the platform.
The Caterer Onboarding Portal is where a caterer fills in its details, uploads documents, signs contracts, and waits for EcoLunch to approve **Go-live**.

We use **two databases**:

| Database | Holds | Why |
|----------|-------|-----|
| **PostgreSQL** | **Banking only** | Bank details are money + sensitive (encrypted), so they need a strict, reliable SQL database. |
| **MongoDB** | **Everything else** | The rest is flexible, document-shaped data (profiles, menus, documents, chats…) that fits MongoDB well. |

One idea ties it all together: **the caterer is the center.** Every record belongs to a caterer (`caterer_id`), and a caterer can only ever see its own data.

```
                       ┌─────────────┐
                       │   CATERER    │  ← the center of everything
                       └──────┬──────┘
        every model below points back to a caterer
   ┌───────┬───────┬───────┬──┴────┬───────┬───────┬────────┐
 Banking  User  Establish  Menu  Document Contract EcoLoop  …
 (SQL)         -ment
```

---

## See how the models connect

[**relationships.md**](./relationships.md) — the single map of how every table relates to every other (one-to-one, one-to-many, many-to-many), plus the cross-database links. Read this alongside the model files below.

## The models

Read them in this order to understand the system top-to-bottom:

| # | Model | Database | What it is |
|---|-------|----------|------------|
| 1 | [caterer](./models/caterer.md) | MongoDB | The caterer company + its profile (the center) |
| 2 | [user](./models/user.md) | MongoDB | Login accounts for caterer staff and admins |
| 3 | [banking](./models/banking.md) | **PostgreSQL** | Bank account details (encrypted) |
| 4 | [establishment](./models/establishment.md) | MongoDB | Schools / daycares / camps the caterer serves (+ closure calendars) |
| 5 | [menu](./models/menu.md) | MongoDB | Menus, dishes, and packages |
| 6 | [document](./models/document.md) | MongoDB | Uploaded files (the file itself lives in Dropbox) |
| 7 | [contract](./models/contract.md) | MongoDB | Contracts sent for e-signature |
| 8 | [module](./models/module.md) | MongoDB | Which features (modules) the caterer has + their pricing |
| 9 | [validation-item](./models/validation-item.md) | MongoDB | Things waiting for an admin to approve |
| 10 | [correction](./models/correction.md) | MongoDB | "Please fix this" requests from admin |
| 11 | [golive-checklist](./models/golive-checklist.md) | MongoDB | The checklist that must be 100% before Go-live |
| 12 | [ecoloop](./models/ecoloop.md) | MongoDB | Support chat between caterer and admin |
| 13 | [smart-import](./models/smart-import.md) | MongoDB | Auto-reads uploaded files and suggests field values |
| 14 | [onboarding-file](./models/onboarding-file.md) | MongoDB | The status board: how far along each section is |
| 15 | [report-schedule](./models/report-schedule.md) | MongoDB | Scheduled report setup |
| 16 | [audit-log](./models/audit-log.md) | MongoDB | A permanent record of every action taken |

---

## How to read a model file

Every model file follows the **same simple layout**, so once you've read one you can read them all:

1. **In one line** — what the model is.
2. **Where it lives** — which database / collection / table.
3. **What it stores** — a field table: *Field · Type · Required? · Plain-English meaning*.
4. **Statuses explained** — every enum value with what it means and who sets it (this is the part that was hard to read before — now each value is spelled out).
5. **How it connects** — its relationships to other models, in plain words.
6. **Rules & checks** — the important "do / don't" rules.
7. **Lifecycle** — a simple arrow diagram of how a record moves through its states.
8. **Schema (for developers)** — the exact field definitions / validator / indexes, kept at the bottom so it doesn't get in the way of understanding.

---

## A few rules that apply to every model

- **One caterer, its own data only** — every query is filtered by `caterer_id`.
- **No files in the database** — uploaded files go to Dropbox; we store only a link + details.
- **Money is stored in cents** (whole numbers), never decimals.
- **Nothing is truly deleted** — old things are marked `archived`; actions are logged in [audit-log](./models/audit-log.md).
- **The caterer can't approve itself** — only EcoLunch admins approve sections and Go-live.
