# Frontend Coding Standards

**Updated:** 2026-07-28 · Applies from Phase 1 onward. Existing mock-era
code is not retroactively reformatted — these standards apply to new/
migrated code as each module is touched during Phase 2.

---

## Naming Conventions

- Components: `PascalCase` (`ClientGolivePage.tsx`, `KpiCards.tsx`).
- Hooks: `camelCase`, prefixed `use` (`useEstablishments.ts`,
  `useCreateCorrection.ts`).
- API client functions: verb + resource, matching the backend endpoint's
  own intent (`getEstablishmentOverview`, `createContract`,
  `resubmitCorrection`) — not generic (`fetchData`, `getList`).
- Types: `PascalCase`, suffixed by what they represent — `...DTO` when
  mirroring a backend response shape 1:1 (matching the backend's own DTO
  naming convention), plain descriptive names otherwise.

## Folder Conventions

Per `ARCHITECTURE.md`'s module boundary: one folder per backend module,
always `pages/ components/ services/ hooks/ types/`. No module reaches
into another module's internals — shared logic goes in `src/shared/`.

## API Conventions

- One file per backend module: `src/admin/<module>/services/api.ts`.
- Every exported function's return type is the module's own DTO type
  (from `types/`), never `any`, never an inline anonymous shape.
- Every function takes explicit parameters (`catererId`, etc.) — no
  function silently reads global state for its inputs.
- Path/query param construction happens in the client function, never in
  the calling component.

## React Query Conventions

See `phase-1-foundation/REACT_QUERY.md` for the full strategy. Summary:
- Query keys are arrays, module-namespaced:
  `['establishments', catererId]`, `['golive', 'summary', catererId]`.
- One hook per query/mutation — `useEstablishmentsQuery(catererId)`, not
  one giant hook returning everything a page needs.
- Mutations invalidate the specific query keys they affect, never a blanket
  `invalidateQueries()` with no key (that defeats the caching benefit
  entirely and was explicitly flagged as a risk in `ARCHITECTURE.md`).

## Component Conventions

- Presentational components (`components/`) take props only — no direct
  hook/API calls inside them; data-fetching stays in `pages/`.
- Loading/error/empty states are handled once, using the shared
  `FullPageLoader`/`InlineLoader`/`ErrorBoundary` primitives — no
  per-component bespoke spinner.

## Hook Conventions

- A hook wraps exactly one React Query call (or a small composition of
  a few related ones) — it should be obvious from the hook's name and
  return type what it fetches/mutates.
- Hooks never contain JSX.

## TypeScript Conventions

- No `any` in new/migrated code. `unknown` + a narrowing check if a shape
  is genuinely dynamic (mirrors the backend's own `Record<string, unknown>`
  convention rather than `any`).
- DTO types are hand-mirrored from the backend's actual DTO files during
  Phase 1/early Phase 2 (see `ARCHITECTURE.md`'s note on revisiting
  codegen) — when mirroring, cite the backend file the shape came from in
  a comment, so drift is traceable.

## File Naming

- Components/pages: `PascalCase.tsx`.
- Hooks: `camelCase.ts`.
- Everything else (services, types, utils): `kebab-case.ts` or
  `camelCase.ts`, consistent with whatever the module's existing files
  already use — don't rename existing files as a side effect of an
  unrelated change.

## Import Ordering

1. External packages (`react`, `@tanstack/react-query`, etc.)
2. Absolute/aliased internal imports (`@shared/...`, `@admin/...`)
3. Relative imports (`./`, `../`)

Blank line between each group; no rule enforced yet by lint config — this
is a documented convention until Phase 1 wires up an actual ESLint import-
order rule (tracked as a Phase 1 open item, not decided yet).
