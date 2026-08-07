# EcoLunch Frontend — Development Documentation

**Status:** 📝 Phase 1 (Foundation) — documentation scaffold created, no implementation yet · **Updated:** 2026-07-28

This directory is the single source of truth for the frontend development
process — mirroring the discipline already used for the backend
(`backend/development/`): every module gets a pre-implementation blueprint,
implementation follows the approved blueprint exactly, and every completed
phase ends with a written audit.

> **Location note:** the task that created this structure specified a
> top-level `frontend/development/` path. This repository's frontend lives
> at `Ecolunch/` (sibling to `backend/`), so this documentation tree is
> placed at `Ecolunch/development/` instead of creating a confusing third
> top-level directory — the same relationship `backend/development/` already
> has to `backend/src/`.

---

## Purpose

The frontend (`Ecolunch/src/`) is, as of this writing, **not connected to
any backend API anywhere** — every admin and client page renders from
local mock data. A full backend now exists for 17 route modules
(Caterers, Auth, Banking, Establishments, Menus, Document Vault, Contracts,
Modules & Pricing, Modules & Required Setup, Corrections, Go-Live,
Validation Center, EcoLoop, Users, Audit, Documents, webhooks). This
documentation exists to plan and track the work of connecting the two
without repeating the backend's own early mistake of building modules
faster than they could be reconciled with each other — every frontend
architecture decision here is written down *before* it's built, exactly
like every backend `NOTES.md` blueprint was.

## Scope

- The Admin Portal (`src/admin/`) and Client Portal (`src/client/`)
  React applications inside `Ecolunch/`.
- The API integration layer connecting them to `backend/src/`.
- Foundational frontend concerns (HTTP client, auth, data-fetching/caching
  strategy, environment configuration) that every module-level integration
  depends on.

Out of scope: backend changes (tracked in `backend/development/`), visual/
design-system work not related to data integration, and any new product
features not already backed by an existing backend module.

## Current Phase

**Phase 1 — Foundation.** No frontend code has been written for this
effort yet. See `phase-1-foundation/AUDIT.md` for the baseline audit that
this phase's work is scoped against, and `phase-1-foundation/NOTES.md` for
the architecture blueprint awaiting approval.

## Development Workflow

Every feature in this effort follows the same sequence — no exceptions:

1. Create documentation (a `NOTES.md`-style blueprint, or a module file
   under `phase-2-api-integration/`).
2. Review architecture.
3. Approve architecture.
4. Implement.
5. Audit implementation.
6. Document findings (in the relevant module doc's "Audit Notes" section).
7. Update `ROADMAP.md`.
8. Update `CHANGELOG.md`.

**No implementation begins before its corresponding documentation has been
reviewed and approved.**

## Documentation Index

| Document | Purpose |
|---|---|
| [`ROADMAP.md`](./ROADMAP.md) | High-level phases, milestones, what's done vs. remaining |
| [`CHANGELOG.md`](./CHANGELOG.md) | Every meaningful frontend change, dated |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Frontend architecture decisions and their rationale |
| [`STANDARDS.md`](./STANDARDS.md) | Coding conventions |
| [`phase-1-foundation/`](./phase-1-foundation/NOTES.md) | HTTP client, auth, data-fetching strategy, environment, folder structure, baseline audit |
| [`phase-2-api-integration/`](./phase-2-api-integration/NOTES.md) | One document per backend module being wired up |
| [`phase-3-polish/`](./phase-3-polish/NOTES.md) | Performance, testing, accessibility, final audit |
