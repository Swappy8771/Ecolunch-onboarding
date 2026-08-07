# Phase 3 — Module Integration Framework

**Status:** 🚧 In progress — Caterers + Document Vault complete · **Updated:** 2026-07-29

---

### What are we building?

Establishing the standard page-integration pattern by fully integrating
**one** module (Caterers), then reusing that exact pattern for every
remaining module. This supersedes `phase-2-api-integration/NOTES.md`'s
original "one module at a time" plan with a concrete, proven reference
implementation instead of a per-module template.

### Why is it needed?

Phase 2 built the typed contract layer (generated types, API modules,
query keys, hook factories, mappers infrastructure, error model) but
wired none of it into an actual page. This phase proves the layer works
end-to-end against one real page before repeating the work 13 more times.

### The pattern (established by Caterers)

```
Page → feature hook (src/features/<module>/hooks/) → API module
     (src/api/modules/<module>.api.ts) → HTTP client → Backend
```

Per module:
1. `src/features/<module>/types/<entity>.types.ts` — ViewModel + filter/
   result shapes. Never a copy of the backend DTO.
2. `src/features/<module>/mappers/<entity>.mapper.ts` — DTO → ViewModel.
   The DTO type itself is hand-authored here (not imported from
   `src/api/generated/types.ts`) whenever the operation's response has no
   generated schema — see "Recurring finding" below, true for every
   module so far.
3. `src/features/<module>/hooks/use<Entity>*.ts` — one hook per
   query/mutation, built on `createQueryHook`/`useApiMutation` +
   `useQueryClient` for invalidation. Invalidation targets only the
   specific `queryKeys` affected by that mutation, never a bare
   `invalidateQueries()`.
4. The page imports only feature hooks + ViewModel types — never
   `httpClient`, `*.api.ts`, or generated types directly.
5. Loading/error UI reuses `FullPageLoader`/`InlineLoader` (existing
   shared components) rather than inventing new ones.

### Recurring finding: mock-vocabulary and DTO-shape drift

Every module built under Phase 2's own audit flagged "mock data hasn't
been diffed against the real DTO yet" as an open item. Caterers is the
first to actually do that diff, and found real, non-trivial drift (full
detail in `Caterers.md`):
- Status vocabulary: mock used French onboarding-stage labels with no
  backend equivalent at all.
- Vertical casing: mock capitalized, backend lowercase.
- Two mock fields (`admin` as a name, `validations`/`tickets` as counts)
  have no backing data in the real DTO — they require joins/aggregation
  the backend doesn't do server-side.

**Expect this same category of finding in every remaining module** — this
is exactly why Phase 2's "document, don't invent" discipline continues
into Phase 3: a mapper either has real data to map, or it's honest about
what it can't produce (hardcoded default + a comment), never invented.

### Recurring finding #2 (Document Vault): components not wired to their own props

Document Vault's audit surfaced a variant of the same discipline problem
from a different angle: two components (`CategoryGrid`, `DocumentTable`)
looked wired (they accepted no caterer/category-scoping at all, or ignored
what they were given) but actually rendered the same static/hardcoded data
regardless of which caterer or category was selected. A page can look
functional in a drill-down UI while silently short-circuiting the "scoped
to what's selected" behavior the UI implies. Worth checking for on every
remaining module with a similar list → detail → sub-detail drill-down
shape.

### Risks

Modules with dependency chains (Go-Live reads Banking/Establishments/
Menus/Document Vault/Contracts/Corrections/Modules & Required Setup)
should integrate after their dependencies, not before — restating
`phase-2-api-integration/NOTES.md`'s open question, still unresolved.

### Acceptance Criteria

- [x] Caterers: list/detail/create/archive call the real backend; update
      built as infrastructure (no edit UI exists yet to wire it to).
- [x] Caterers' types verified against the real backend DTO, not assumed
      from mock — see `Caterers.md`.
- [x] Document Vault: list/detail/review call the real backend; types
      verified against the real DTO, including a backend-side audit that
      found and fixed genuine gaps (no DTO layer, no Swagger response
      schemas, no uploader-name resolution) before the frontend work even
      started — see `DocumentVault.md`.
- [ ] Every remaining module follows this same pattern.

### Module Status

| # | Module | Status |
|---|---|---|
| 1 | Caterers | ✅ Integrated (reference implementation) — see [`Caterers.md`](./Caterers.md) |
| 2 | Document Vault | ✅ Integrated — see [`DocumentVault.md`](./DocumentVault.md) |
| 3 | Banking | ⚠️ Blocked — no admin-side page/mock exists to integrate (only a caterer-portal mock, a different portal); paused pending a scope decision, not started |
| 4–14 | Everything else | ⏳ Not started |
