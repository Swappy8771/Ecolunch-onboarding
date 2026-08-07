# EcoLoop — API Integration

**Status:** ✅ Integrated — 2026-08-01 · **Backend:** `/api/admin/ecoloop/*` (15 endpoints — 11 existing +
4 new: `/notes`, `/links`, `/reassign`, `/priority`) · **Frontend:** `src/admin/ecoloop/pages/AdminEcoloopPage.tsx` (real)

### What are we building?
Wiring the conversations/messaging admin page to the real backend, per the client's exact "EcoLoop
Onboarding" spec (communication/follow-up layer: tickets/conversations by caterer, correction requests,
internal notes, client messages, system actions, validation follow-up, linked documents/Smart
Import/contract requests/Go-live blockers; actions: create ticket, send message, add internal note,
5 link actions, close, reassign, change priority).

### Why is it needed?
`ecoloop_blockers_closed` is one of the 11 Go-Live requirements, and EcoLoop conversations are read
(best-effort) by Modules & Required Setup's Linked EcoLoop panel.

### Audit findings — 2026-08-01

A compliance check against the client's spec found the live page was **100% mock-data-driven**
(`services/mock/ecoloopMock.ts`) with a fully-typed, correctly-built `ecoloopApi` client sitting
completely unused beside it — every one of the 11 spec actions was a `console.log` no-op, and the
"Create Ticket" modal's submit button had no handler at all. The backend itself, while real, was
missing several fields the spec assumes exist: no internal-note flag, no `caterer` sender type, no
per-item link fields (just one generic `linkedModule`/`linkedEntityId` pair), no `smart-import` support
at all, no assignee, and no way to change priority after creation. Full detail in
`backend/development/admin/models/ecoloop/NOTES.md` §8 (Phase 4).

### What was fixed (backend, per "clear the gaps first")
- `Message.senderType` gained `caterer`; `Message.isInternal` (new) distinguishes admin-only notes from
  client-visible messages.
- `Conversation.linkedModule` gained `smart-import`; new `Conversation.linkedItems[]` lets a ticket
  reference more than one document/contract/Smart-Import item/validation item/Go-live blocker.
- New `Conversation.assigneeId`/`assigneeName` + `reassign()`.
- New `updatePriority()` — priority was previously creation-time-only.
- **Validation Center's `requestCorrection()`/`sendViaEcoLoop()` were calling a different, unrelated,
  always-stub ticketing adapter** (`integrations/ecoloop/index.ts`) instead of this real system — fixed
  to call the real `ecoloopService`/`ecoloopIntegration`, matching how Go-Live's own EcoLoop actions
  already worked.

### What was integrated (frontend)
- New `src/features/ecoloop/{types,mappers,hooks}/` (hand-authored — none of `modules/ecoloop`'s
  responses have a documented OpenAPI response schema) — 5 query hooks
  (`useEcoLoopList`/`useEcoLoopByCaterer`/`useEcoLoopDashboard`/`useEcoLoopDetail`/`useEcoLoopHistory`) +
  8 mutation hooks (create/send-message/add-note/add-link/reassign/update-priority/close/reopen/resolve).
- `src/api/modules/ecoloop.api.ts` extended with the 4 new endpoints.
- Every admin/ecoloop component rewritten against real data: `TicketList`, `TicketStatusBadge` (real
  5-status/4-priority/7-linked-module enums, replacing the mock's invented `critical/high/medium/low`
  and 6-category taxonomy), `TicketDrawer`, `TicketDetailPanel` and its sections
  (`ConversationSection`/`InternalNotesSection`/`SystemActionsSection`/`LinkedObjectsSection`),
  `EcoLoopActionBar`, `EcoLoopKpiCards` (real dashboard summary + one client-computed "open Go-live
  blockers" count), `CreateTicketModal` (real caterer picker via `useCaterers`, real submit).
- 4 new modals: `EcoLoopMessageModal` (shared for send-message/add-note), `EcoLoopLinkModal`,
  `EcoLoopReassignModal` (real admin picker via the existing `useUsersList` hook, not free text),
  `EcoLoopPriorityModal`.
- `CorrectionRequestsSection`/`ValidationFollowupSection` (the mock's two synthetic, backend-less
  sections) deleted — folded into `LinkedObjectsSection`, grouped by `linkedModule`, since the real
  backend only has the one `linkedItems[]` concept, not separate correction/follow-up entities.
- Send-message/add-note now use the real logged-in admin's identity (`useAuth()` + `displayName()`)
  instead of a placeholder sender.
- Deleted: `services/mock/ecoloopMock.ts`, and two fully-orphaned legacy duplicate screens
  (`src/routes/admin/EcoLoop.tsx`, `src/features/onboarding/ecoloop/index.tsx` — confirmed unreferenced
  by `App.tsx` or anywhere else before deletion).

### Known, disclosed scope limits (not fixed, explicitly out of scope)
- Linking a document/contract/Smart-Import item to a ticket is a **manual admin action** (`EcoLoopLinkModal`,
  free-text entity ID) — Documents/Contracts modules do not automatically open/link tickets on
  rejection events; the backend integration helpers for that already existed and remain unused.
- No real caterer-facing composer exists — `senderType: 'caterer'` lets an admin log what a caterer said
  through another channel (phone/email), it is not a live two-way chat with the Caterer Portal.
- "Open" on a Smart Import linked item routes to `/admin/caterers` (no dedicated Smart Import admin page
  exists in this app yet), same fallback pattern as Go-Live Monitor's own `MODULE_ROUTE` map.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file.
One pre-existing, already-tolerated lint pattern (`react-refresh/only-export-components` on
`TicketStatusBadge.tsx`, which exports both components and their color-map constants) matches the same
convention already accepted on `VStatusPill.tsx`/`ThemeContext.tsx`/`LangContext.tsx` — not a new issue.

### Acceptance Criteria
- [x] Real loading/error/empty states (already existed, now backed by real queries instead of a fake timer).
- [x] All 11 must-include spec items backed by real data (documented scope limits above for 3 of them).
- [x] All 11 spec actions (10 + reassign) call real backend endpoints, not `console.log`.
