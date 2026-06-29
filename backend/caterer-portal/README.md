# Caterer Onboarding Portal — Backend Reference

The caterer-facing side of onboarding. The caterer **fills and submits** its own data; it sees **only its own** records (every query scoped by `caterer_id`).

> Uses the **same database** as the Admin Portal — the shared schema is in [`../db-architecture/`](../db-architecture/). This folder holds the caterer portal's preview and points to its behavioral spec.

---

## Live preview

[`caterer-architecture.html`](./caterer-architecture.html) — a visual page showing the caterer journey, the ER diagram, the model map, and a clickable **field reference** for every table the caterer fills. (The admin side has its own separate preview at [`../admin-portal/admin-architecture.html`](../admin-portal/admin-architecture.html).)

---

## What the caterer does (in order)

1. **Profile** — company, contact, address, tax
2. **Banking** — bank details + 3 documents (stored encrypted, PostgreSQL)
3. **My Clients** — schools / daycares / camps
4. **Menus** — menus & dishes (Smart Import helps)
5. **Documents** — required files per active module
6. **Contracts** — sign what the admin sent (Dropbox Sign)
7. **Module setup** — finish each active module's checklist

Each section: **fill → submit → admin reviews → validated (or correction)**. When all Go-live checks pass, the **admin** activates the caterer.

---

## Where the detail lives

| Topic | Location |
|-------|----------|
| Full behavioral spec (every section, field, rule) | `../../docs/caterer-onboarding/` |
| The database (fields, enums, relationships, ERD) | [`../db-architecture/`](../db-architecture/) |
| Who writes what (caterer vs admin vs system) | [`../admin-portal/03-write-ownership.md`](../admin-portal/03-write-ownership.md) |
| System overview (both portals) | [`../README.md`](../README.md) |

---

## Core rules

1. **Own data only** — every query scoped by `caterer_id`.
2. **No auto-apply** — Smart Import values need explicit confirm/edit.
3. **Caterer never decides** — can't price modules, approve sections, or approve Go-live.
4. **Banking is encrypted** — the caterer sees only a masked last-4 after submitting.
