import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Users, MapPin, User, Calendar, AlertTriangle, MessageCircle,
  Download, Plus, Search, ChevronDown,
  ExternalLink, ClipboardCheck, FolderLock, FileText, Rocket,
  ShieldCheck, CheckCircle2, X, ChevronLeft, ChevronRight,
  ArrowRight, Archive, RotateCcw, Pencil, Globe, Briefcase, Calendar as CalendarIcon, Send, Puzzle,
} from 'lucide-react'
import { useLang } from '@shared/context/LangContext'
import { PageHeader } from '@shared/components/PageHeader'
import { SelectFilter } from '@shared/components/SelectFilter'
import { DropdownMenu, type DropdownAction } from '@shared/components/DropdownMenu'
import { FilterBar } from '@shared/components/FilterBar'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { InlineLoader } from '@shared/ui/InlineLoader'
import { StatCard } from '@/features/adminDashboard/components/StatCard'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import { useCaterer } from '@/features/adminCaterers/hooks/useCaterer'
import { useCreateCaterer } from '@/features/adminCaterers/hooks/useCreateCaterer'
import { useUpdateCaterer } from '@/features/adminCaterers/hooks/useUpdateCaterer'
import { useArchiveCaterer } from '@/features/adminCaterers/hooks/useArchiveCaterer'
import { useRestoreCaterer } from '@/features/adminCaterers/hooks/useRestoreCaterer'
import { useExportCaterers } from '@/features/adminCaterers/hooks/useExportCaterers'
import { useInviteCatererUser } from '@/features/adminCaterers/hooks/useInviteCatererUser'
import { useStartSupportSession } from '@/features/adminCaterers/hooks/useStartSupportSession'
import type { StartSupportSessionResult } from '@/api/modules/caterers.api'
import { mapViewModelToFormInput, mapVerticalToBackendFilter } from '@/features/adminCaterers/mappers/caterer.mapper'
import { CatererFormModal } from '../components/CatererFormModal'
import { InviteCatererUserModal } from '../components/InviteCatererUserModal'
import { SupportSessionModal } from '../components/SupportSessionModal'
import type { CatererDisplayStatus, CatererVertical, CatererViewModel } from '@/features/adminCaterers/types/caterer.types'

/* ── Style maps ─────────────────────────────────────────────────────────
 * Keyed on the backend's real computed `displayStatus`
 * (`computeDisplayStatus` in `caterers.service.ts`), not the old mock
 * data's French onboarding-stage vocabulary — see
 * `development/phase-3-module-integration/Caterers.md` for this
 * vocabulary-drift finding. */
const STATUS_META: Record<CatererDisplayStatus, { label: string; color: string; bg: string; border: string }> = {
  'pre-onboarding':   { label: 'Pre-onboarding',   color: 'var(--text-3)', bg: 'var(--bg-inner)',        border: 'var(--border-strong)'   },
  'in-progress':      { label: 'In Progress',      color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  'needs-review':     { label: 'Needs Review',     color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)'  },
  'approved':         { label: 'Approved',         color: '#a78bfa',       bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.28)' },
  'ready-for-golive': { label: 'Ready · Go-live',  color: '#a3e635',       bg: 'rgba(163,230,53,0.12)',  border: 'rgba(163,230,53,0.28)'  },
  'completed':        { label: 'Completed',        color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
  'paused':           { label: 'Paused',           color: '#f97316',       bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.28)'  },
  'archived':         { label: 'Archived',         color: 'var(--text-4)', bg: 'var(--bg-inner)',        border: 'var(--border-strong)'   },
}

const VERTICAL_META: Record<CatererVertical, { color: string; bg: string }> = {
  Schools:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.14)'  },
  Daycares: { color: '#a78bfa', bg: 'rgba(167,139,250,0.14)' },
  Camps:    { color: '#fb923c', bg: 'rgba(251,146,60,0.14)'  },
  CSS:      { color: '#34d399', bg: 'rgba(52,211,153,0.14)'  },
}

function progressColor(s: CatererDisplayStatus): string {
  if (s === 'needs-review')                                          return '#fbbf24'
  if (s === 'ready-for-golive' || s === 'completed')                 return '#a3e635'
  if (s === 'approved')                                              return '#a78bfa'
  if (s === 'paused' || s === 'archived')                            return 'var(--text-4)'
  return '#3b82f6'
}

/**
 * Opens a new tab straight into the caterer's own portal, pre-authenticated
 * under the just-minted Support Access Session token — the one-shot
 * payload is base64'd into a single query param rather than several,
 * decoded by `CatererSupportSessionEntryPage`. Never persisted anywhere;
 * the token itself is already short-lived (1h) server-side.
 */
function openSupportSessionTab(result: StartSupportSessionResult): void {
  const payload = {
    token: result.token,
    sessionId: result.sessionId,
    expiresAt: result.expiresAt,
    user: result.viewingAsUser,
  }
  const encoded = encodeURIComponent(btoa(JSON.stringify(payload)))
  window.open(`${window.location.origin}/caterer/support-session?data=${encoded}`, '_blank', 'noopener')
}

/** Prefers the resolved name (Phase B — batch Users lookup); falls back to a shortened raw id if the name didn't resolve. */
function formatAssignedAdmin(caterer: Pick<CatererViewModel, 'assignedAdminId' | 'assignedAdminName'>): string {
  if (caterer.assignedAdminName) return caterer.assignedAdminName
  if (!caterer.assignedAdminId) return 'Unassigned'
  return caterer.assignedAdminId.length > 10 ? `${caterer.assignedAdminId.slice(0, 8)}…` : caterer.assignedAdminId
}

/* ── Status pill ────────────────────────────────────────── */
function StatusPill({ status }: { status: CatererDisplayStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

/* ── Row action definitions ─────────────────────────────── */
interface RowActionHandlers {
  onEdit: (caterer: CatererViewModel) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onInvite: (caterer: CatererViewModel) => void
  onOpenValidationItems: (catererId: string) => void
  onOpenModulesPricing: (catererId: string) => void
  onOpenDocumentVault: (catererId: string) => void
  onOpenContractManagement: (catererId: string) => void
  onOpenGoLiveMonitor: (catererId: string) => void
  onOpenSupportSession: (caterer: CatererViewModel) => void
}

/**
 * Every "Open X" action used to render with no `onClick` at all. Document
 * Vault, Contract Management, Validation Center, Modules & Pricing, and
 * Go-Live Monitor are now all real, integrated admin pages that can be
 * deep-linked via `?catererId=`. EcoLoop is still on static mock data with
 * no real per-caterer filtering to link into — wiring navigation to it
 * would silently land on an unrelated page rather than this caterer's
 * actual items, so it stays disabled with a tooltip instead of a fake
 * link. "Open Onboarding" has no dedicated page (this detail modal
 * already is the onboarding overview) and "Open Support Access"
 * (impersonation/support login) doesn't exist anywhere in the app — both
 * disabled too.
 */
function buildRowActions(
  caterer: CatererViewModel,
  { onEdit, onArchive, onRestore, onInvite, onOpenValidationItems, onOpenModulesPricing, onOpenDocumentVault, onOpenContractManagement, onOpenGoLiveMonitor, onOpenSupportSession }: RowActionHandlers,
): DropdownAction[] {
  const actions: DropdownAction[] = [
    { label: 'Edit Caterer',             icon: <Pencil         size={13} strokeWidth={1.8} />, onClick: () => onEdit(caterer) },
    { label: 'Invite Portal User',       icon: <Send           size={13} strokeWidth={1.8} />, onClick: () => onInvite(caterer) },
    { label: 'Open Onboarding',          icon: <ExternalLink   size={13} strokeWidth={1.8} />, disabled: true, title: 'No dedicated onboarding page — use this caterer\'s detail view' },
    { label: 'Open Validation Items',    icon: <ClipboardCheck size={13} strokeWidth={1.8} />, onClick: () => onOpenValidationItems(caterer.id) },
    { label: 'Open Modules & Pricing',   icon: <Puzzle         size={13} strokeWidth={1.8} />, onClick: () => onOpenModulesPricing(caterer.id) },
    { label: 'Open Document Vault',      icon: <FolderLock     size={13} strokeWidth={1.8} />, onClick: () => onOpenDocumentVault(caterer.id) },
    { label: 'Open Contract Management', icon: <FileText       size={13} strokeWidth={1.8} />, onClick: () => onOpenContractManagement(caterer.id) },
    { label: 'Open EcoLoop Thread',      icon: <MessageCircle  size={13} strokeWidth={1.8} />, disabled: true, title: 'EcoLoop Onboarding isn\'t wired to real per-caterer data yet' },
    { label: 'Open Go-Live Blockers',    icon: <Rocket         size={13} strokeWidth={1.8} />, onClick: () => onOpenGoLiveMonitor(caterer.id) },
    { label: 'Open Support Access Session', icon: <ShieldCheck size={13} strokeWidth={1.8} />, color: '#f87171', onClick: () => onOpenSupportSession(caterer) },
  ]
  if (caterer.status === 'archived') {
    actions.push({
      label: 'Restore Caterer',
      icon: <RotateCcw size={13} strokeWidth={1.8} />,
      color: '#4ade80',
      onClick: () => {
        if (window.confirm(`Restore ${caterer.name} back to onboarding?`)) {
          onRestore(caterer.id)
        }
      },
    })
  } else {
    actions.push({
      label: 'Archive Caterer',
      icon: <Archive size={13} strokeWidth={1.8} />,
      color: '#f87171',
      onClick: () => {
        if (window.confirm(`Archive ${caterer.name}? This can be restored later.`)) {
          onArchive(caterer.id)
        }
      },
    })
  }
  return actions
}

/* ── Caterer detail modal ───────────────────────────────── */
/**
 * Same real-vs-disabled split as `buildRowActions` — see its doc comment.
 * Validation Center was integrated to real per-caterer data in a later
 * session pass, so its link is now real too (was disabled before).
 * "Modules & Pricing" is a new entry — that admin page was mock until
 * this same pass wired it to `/api/admin/modules-pricing/*`.
 */
function buildWorkspaceSections(catererId: string, navigate: (to: string) => void, onOpenSupportSession: () => void) {
  return [
    { label: 'Onboarding',              icon: <ExternalLink   size={15} strokeWidth={1.8} />, color: '#60a5fa', disabled: true, title: 'No dedicated onboarding page — this is it' },
    { label: 'Validation Items',        icon: <ClipboardCheck size={15} strokeWidth={1.8} />, color: '#a78bfa', onClick: () => navigate(`/admin/validation-center?catererId=${catererId}`) },
    { label: 'Modules & Pricing',       icon: <Puzzle         size={15} strokeWidth={1.8} />, color: '#a3e635', onClick: () => navigate(`/admin/modules-pricing?catererId=${catererId}`) },
    { label: 'Document Vault',          icon: <FolderLock     size={15} strokeWidth={1.8} />, color: '#34d399', onClick: () => navigate(`/admin/document-vault?catererId=${catererId}`) },
    { label: 'Contract Management',     icon: <FileText       size={15} strokeWidth={1.8} />, color: '#fb923c', onClick: () => navigate(`/admin/contract-management?catererId=${catererId}`) },
    { label: 'EcoLoop Thread',          icon: <MessageCircle  size={15} strokeWidth={1.8} />, color: '#60a5fa', disabled: true, title: 'EcoLoop Onboarding isn\'t wired to real per-caterer data yet' },
    { label: 'Go-Live Blockers',        icon: <Rocket         size={15} strokeWidth={1.8} />, color: '#a3e635', onClick: () => navigate(`/admin/golive-monitor?catererId=${catererId}`) },
    { label: 'Support Access',          icon: <ShieldCheck    size={15} strokeWidth={1.8} />, color: '#f87171', onClick: onOpenSupportSession },
  ]
}

function CatererDetailModal({ caterer, onClose, onEdit, onOpenSupportSession }: { caterer: CatererViewModel; onClose: () => void; onEdit: (caterer: CatererViewModel) => void; onOpenSupportSession: (caterer: CatererViewModel) => void }) {
  const navigate = useNavigate()
  const sm = STATUS_META[caterer.status]
  const bar = progressColor(caterer.status)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 9998,
          background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)',
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 32px))',
        maxHeight: '85vh',
        overflowY: 'auto',
        borderRadius: '16px', overflow: 'hidden',
        background: 'var(--bg-card)', border: '1px solid var(--border-default)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div className="px-7 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: '#a3e635' }}>Caterer Workspace</p>
              <h2 className="text-[20px] font-black" style={{ color: 'var(--text-1)' }}>{caterer.name}</h2>
              {caterer.tradingName && (
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>Trading as {caterer.tradingName}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                <span className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>{caterer.city || '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => onEdit(caterer)} className="cursor-pointer p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <Pencil size={15} strokeWidth={2} />
              </button>
              <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <X size={15} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Status + progress */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.color }} />
              {sm.label}
            </span>
            <div className="flex items-center gap-2 flex-1" style={{ minWidth: '160px' }}>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                <div className="h-full rounded-full" style={{ width: `${caterer.progress}%`, background: bar }} />
              </div>
              <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: bar }}>{caterer.progress}%</span>
            </div>
          </div>

          {/* Verticals */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {caterer.verticals.map(v => {
              const vm = VERTICAL_META[v]
              return (
                <span key={v} className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md"
                  style={{ background: vm.bg, color: vm.color }}>{v}</span>
              )
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 divide-x" style={{ borderBottom: '1px solid var(--border-subtle)', borderColor: 'var(--border-subtle)' }}>
          {[
            { label: 'Assigned Admin', value: formatAssignedAdmin(caterer),           icon: <User         size={12} strokeWidth={1.8} /> },
            { label: 'Validations',    value: String(caterer.validations),            icon: <AlertTriangle size={12} strokeWidth={1.8} />, color: caterer.validations > 0 ? '#fbbf24' : undefined },
            { label: 'Tickets',        value: String(caterer.tickets),                icon: <MessageCircle size={12} strokeWidth={1.8} />, color: caterer.tickets > 0 ? '#60a5fa' : undefined },
          ].map(s => (
            <div key={s.label} className="px-5 py-3.5">
              <div className="flex items-center gap-1.5 mb-0.5" style={{ color: s.color ?? 'var(--text-4)' }}>
                {s.icon}
                <span className="text-[9.5px] uppercase tracking-[0.12em] font-semibold">{s.label}</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: s.color ?? 'var(--text-2)' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Profile details */}
        {(caterer.organizationType || caterer.website || caterer.foundedYear || caterer.assignedAdminEmail || caterer.primaryContact.name || caterer.address.line1 || caterer.tax.neqNumber || caterer.tax.sirenNumber || caterer.tax.vatNumber) && (
          <div className="px-7 py-5 grid grid-cols-2 gap-x-4 gap-y-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {caterer.organizationType && (
              <div className="flex items-center gap-2">
                <Briefcase size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{caterer.organizationType.replace(/_/g, ' ')}</span>
              </div>
            )}
            {caterer.website && (
              <div className="flex items-center gap-2 min-w-0">
                <Globe size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{caterer.website}</span>
              </div>
            )}
            {caterer.foundedYear !== null && (
              <div className="flex items-center gap-2">
                <CalendarIcon size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>Founded {caterer.foundedYear}</span>
              </div>
            )}
            {caterer.assignedAdminEmail && (
              <div className="flex items-center gap-2 min-w-0">
                <User size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{caterer.assignedAdminEmail}</span>
              </div>
            )}
            {caterer.primaryContact.name && (
              <div className="col-span-2">
                <p className="text-[9.5px] uppercase tracking-[0.12em] font-semibold mb-1" style={{ color: 'var(--text-4)' }}>Primary Contact</p>
                <p className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>
                  {caterer.primaryContact.name}{caterer.primaryContact.title && ` · ${caterer.primaryContact.title}`}
                </p>
                <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>
                  {[caterer.primaryContact.email, caterer.primaryContact.phone].filter(Boolean).join(' · ')}
                </p>
              </div>
            )}
            {caterer.address.line1 && (
              <div className="col-span-2">
                <p className="text-[9.5px] uppercase tracking-[0.12em] font-semibold mb-1" style={{ color: 'var(--text-4)' }}>Address</p>
                <p className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>
                  {[caterer.address.line1, caterer.address.postalCode, caterer.address.region, caterer.address.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            {(caterer.tax.neqNumber || caterer.tax.sirenNumber || caterer.tax.vatNumber) && (
              <div className="col-span-2">
                <p className="text-[9.5px] uppercase tracking-[0.12em] font-semibold mb-1" style={{ color: 'var(--text-4)' }}>Tax</p>
                <p className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>
                  {[
                    caterer.tax.neqNumber && `NEQ ${caterer.tax.neqNumber}`,
                    caterer.tax.sirenNumber && `SIREN ${caterer.tax.sirenNumber}`,
                    caterer.tax.vatNumber && `VAT ${caterer.tax.vatNumber}`,
                  ].filter(Boolean).join(' · ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Workspace sections */}
        <div className="px-7 py-5">
          <p className="text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-3" style={{ color: 'var(--text-4)' }}>Workspace sections</p>
          <div className="grid grid-cols-2 gap-2">
            {buildWorkspaceSections(caterer.id, navigate, () => onOpenSupportSession(caterer)).map(s => (
              <button key={s.label}
                disabled={s.disabled}
                title={s.disabled ? s.title : undefined}
                onClick={s.onClick}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all group"
                style={{
                  background: 'var(--bg-inner)',
                  border: '1px solid var(--border-strong)',
                  opacity: s.disabled ? 0.5 : 1,
                  cursor: s.disabled ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!s.disabled) (e.currentTarget as HTMLElement).style.borderColor = s.color + '60' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}>
                <div className="flex items-center gap-2.5">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{s.label}</span>
                </div>
                <ArrowRight size={12} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

/* ── Page ───────────────────────────────────────────────── */
const PAGE_SIZE_OPTIONS = [5, 10, 20]

const TABLE_COLS = [
  { label: 'Caterer',        width: '170px' },
  { label: 'Location',       width: '130px' },
  { label: 'Verticals',      width: '190px' },
  { label: 'Progress',       width: '130px' },
  { label: 'Status',         width: '148px' },
  { label: 'Validations',    width: '100px' },
  { label: 'Tickets',        width: '80px'  },
  { label: 'Assigned Admin', width: '140px' },
  { label: 'Last Update',    width: '110px' },
  { label: 'Actions',        width: '56px'  },
]

export function CaterersInOnboarding() {
  const { t } = useLang()
  const navigate = useNavigate()

  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vertFilter,   setVertFilter]   = useState('')
  const [adminFilter,  setAdminFilter]  = useState('')
  const [applied,      setApplied]      = useState({ search: '', status: '', vert: '', admin: '' })
  const [page,         setPage]         = useState(1)
  const [pageSize,     setPageSize]     = useState(10)
  const [modalMode,       setModalMode]       = useState<'create' | 'edit' | null>(null)
  const [editingId,       setEditingId]       = useState<string | null>(null)
  const [openMenuId,      setOpenMenuId]      = useState<string | null>(null)
  const [selectedCaterer, setSelectedCaterer] = useState<CatererViewModel | null>(null)
  const [invitingCaterer, setInvitingCaterer]  = useState<CatererViewModel | null>(null)
  const [supportSessionCaterer, setSupportSessionCaterer] = useState<CatererViewModel | null>(null)

  const listQuery = useCaterers({
    search: applied.search || undefined,
    status: (applied.status || undefined) as CatererDisplayStatus | undefined,
    vertical: (applied.vert || undefined) as CatererVertical | undefined,
    assignedAdmin: applied.admin || undefined,
    page,
    limit: pageSize,
  })

  /**
   * Stat cards and the "Assigned Admin" filter's option list both need a
   * system-wide view, not just the current filtered/paginated page — so
   * this is a second, unfiltered query (capped at the backend's max
   * `limit` of 100). Platform-wide totals beyond 100 caterers would
   * under-count; a dedicated aggregate endpoint would be needed for exact
   * counts at that scale, out of this phase's scope. See
   * `development/phase-3-module-integration/Caterers.md`.
   */
  const statsQuery = useCaterers({ page: 1, limit: 100 })

  /** Only fetched while the edit modal is open — the list row's ViewModel never carries contacts/address/tax (see `CatererListItemDTO`'s own doc comment), so editing needs the full detail read. */
  const editingCatererQuery = useCaterer(editingId ?? '', { enabled: editingId !== null })

  const createMutation = useCreateCaterer()
  const updateMutation = useUpdateCaterer()
  const archiveMutation = useArchiveCaterer()
  const restoreMutation = useRestoreCaterer()
  const exportMutation = useExportCaterers()
  const inviteMutation = useInviteCatererUser()
  const supportSessionMutation = useStartSupportSession()

  /** Resets any previous invite's returned link before opening the modal for a (possibly different) caterer. */
  function handleOpenInvite(caterer: CatererViewModel) {
    inviteMutation.reset()
    setInvitingCaterer(caterer)
  }

  function handleOpenSupportSession(caterer: CatererViewModel) {
    supportSessionMutation.reset()
    setSupportSessionCaterer(caterer)
  }

  function handleConfirmSupportSession(reason: string) {
    if (!supportSessionCaterer) return
    supportSessionMutation.mutate(
      { id: supportSessionCaterer.id, reason },
      {
        onSuccess: (result) => {
          openSupportSessionTab(result)
          setSupportSessionCaterer(null)
        },
      },
    )
  }

  const items = listQuery.data?.items ?? []
  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const statsItems = statsQuery.data?.items ?? []
  const stats = {
    total:   statsQuery.data?.total ?? statsItems.length,
    inProg:  statsItems.filter(c => c.status === 'in-progress').length,
    blocked: statsItems.filter(c => c.status === 'needs-review').length,
    goLive:  statsItems.filter(c => c.status === 'approved' || c.status === 'ready-for-golive' || c.status === 'completed').length,
  }
  const admins = Array.from(
    new Map(
      statsItems
        .filter((c): c is typeof c & { assignedAdminId: string } => c.assignedAdminId !== null)
        .map(c => [c.assignedAdminId, c.assignedAdminName ?? c.assignedAdminId]),
    ).entries(),
  )

  function apply() { setApplied({ search, status: statusFilter, vert: vertFilter, admin: adminFilter }); setPage(1) }
  function reset()  { setSearch(''); setStatusFilter(''); setVertFilter(''); setAdminFilter(''); setApplied({ search:'', status:'', vert:'', admin:'' }); setPage(1) }

  const hasFilter = applied.search || applied.status || applied.vert || applied.admin

  function closeFormModal() { setModalMode(null); setEditingId(null) }

  function openEdit(caterer: CatererViewModel) {
    setSelectedCaterer(null)
    setEditingId(caterer.id)
    setModalMode('edit')
  }

  function handleArchive(id: string) {
    archiveMutation.mutate(id, {
      onSuccess: () => { setSelectedCaterer(null) },
    })
  }

  function handleRestore(id: string) {
    restoreMutation.mutate(id, {
      onSuccess: () => { setSelectedCaterer(null) },
    })
  }

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">

      <PageHeader
        size="page"
        badge={{ icon: <Users size={12} strokeWidth={2.5} />, label: 'Onboarding Queue' }}
        title={t.traiteurs.subtitle}
        subtitle={t.traiteurs.description}
        right={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportMutation.mutate({
                search: applied.search || undefined,
                status: applied.status || undefined,
                vertical: mapVerticalToBackendFilter((applied.vert || undefined) as CatererVertical | undefined),
                assignedAdmin: applied.admin || undefined,
                format: 'csv',
              })}
              disabled={exportMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
            >
              <Download size={13} strokeWidth={2} />{exportMutation.isPending ? 'Exporting…' : t.traiteurs.export}
            </button>
            <button
              onClick={() => setModalMode('create')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
              style={{ background: '#a3e635', color: '#07070a' }}
            >
              <Plus size={14} strokeWidth={2.5} />{t.traiteurs.newCaterer}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-7">
        <StatCard value={stats.total}   label="Total Caterers"    valueColor="blue"   trend="all active"    icon={<Users         size={16} strokeWidth={1.8} />} />
        <StatCard value={stats.inProg}  label="In Progress"       valueColor="purple" trend="onboarding"    icon={<Calendar      size={16} strokeWidth={1.8} />} />
        <StatCard value={stats.blocked} label="Needs Review"      valueColor="red"    trend="action needed" icon={<AlertTriangle size={15} strokeWidth={1.8} />} />
        <StatCard value={stats.goLive}  label="Ready for Go-Live" valueColor="lime"   trend="approved"      icon={<CheckCircle2  size={16} strokeWidth={1.8} />} />
      </div>

      <FilterBar onApply={apply} onReset={reset} hasFilter={!!hasFilter}>
        <div className="relative">
          <Search size={12} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search caterer…"
            className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[160px] sm:w-[180px]"
            style={{ background: 'var(--bg-inner)', border: `1px solid ${search ? '#a3e63550' : 'var(--border-strong)'}`, color: 'var(--text-2)' }}
          />
        </div>
        <SelectFilter
          label="All Statuses"
          value={statusFilter}
          onChange={setStatusFilter}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))}
        />
        <SelectFilter
          label="All Verticals"
          value={vertFilter}
          onChange={setVertFilter}
          options={(['Schools','Daycares','Camps','CSS'] as CatererVertical[]).map(v => ({ value: v, label: v }))}
        />
        <SelectFilter
          label="All Admins"
          value={adminFilter}
          onChange={setAdminFilter}
          options={admins.map(([id, label]) => ({ value: id, label }))}
        />
      </FilterBar>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '1120px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.label} className="text-left px-4 py-3" style={{ width: col.width, minWidth: col.width }}>
                    <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listQuery.isLoading ? (
                <tr>
                  <td colSpan={TABLE_COLS.length}>
                    <FullPageLoader label="Loading caterers…" />
                  </td>
                </tr>
              ) : listQuery.isError ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle size={28} strokeWidth={1.2} style={{ color: '#f87171' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>
                        {listQuery.error?.message ?? 'Failed to load caterers.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>{t.traiteurs.notFound}</span>
                    </div>
                  </td>
                </tr>
              ) : items.map((c, idx) => {
                const bar = progressColor(c.status)
                const isLast = idx === items.length - 1
                return (
                  <tr key={c.id} className="transition-colors"
                    style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <span className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</span>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{c.city || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1 flex-wrap">
                        {c.verticals.map(v => {
                          const vm = VERTICAL_META[v]
                          return (
                            <span key={v} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                              style={{ background: vm.bg, color: vm.color }}>
                              {v}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)', minWidth: '60px' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: bar }} />
                        </div>
                        <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: bar, width: '36px', textAlign: 'right' }}>
                          {c.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}><StatusPill status={c.status} /></td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5"
                        style={{ color: c.validations > 0 ? '#fbbf24' : 'var(--text-4)' }}>
                        {c.validations > 0 && <AlertTriangle size={12} strokeWidth={2} />}
                        <span className="text-[12.5px] font-semibold tabular-nums">{c.validations}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5"
                        style={{ color: c.tickets > 0 ? '#60a5fa' : 'var(--text-4)' }}>
                        {c.tickets > 0 && <MessageCircle size={12} strokeWidth={2} />}
                        <span className="text-[12.5px] font-semibold tabular-nums">{c.tickets}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5">
                        <User size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{formatAssignedAdmin(c)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 cursor-pointer" onClick={() => setSelectedCaterer(c)}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{c.updatedAt}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <DropdownMenu
                        open={openMenuId === c.id}
                        onToggle={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                        onClose={() => setOpenMenuId(null)}
                        actions={buildRowActions(c, {
                          onEdit: openEdit,
                          onArchive: handleArchive,
                          onRestore: handleRestore,
                          onInvite: handleOpenInvite,
                          onOpenValidationItems: id => navigate(`/admin/validation-center?catererId=${id}`),
                          onOpenModulesPricing: id => navigate(`/admin/modules-pricing?catererId=${id}`),
                          onOpenDocumentVault: id => navigate(`/admin/document-vault?catererId=${id}`),
                          onOpenContractManagement: id => navigate(`/admin/contract-management?catererId=${id}`),
                          onOpenGoLiveMonitor: id => navigate(`/admin/golive-monitor?catererId=${id}`),
                          onOpenSupportSession: handleOpenSupportSession,
                        })}
                        minWidth="220px"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3.5 flex-wrap"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[12px] tabular-nums flex items-center gap-2" style={{ color: 'var(--text-4)' }}>
            {total === 0
              ? '0 records'
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total} caterers`}
            {listQuery.isFetching && !listQuery.isLoading && <InlineLoader size={12} />}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              <ChevronLeft size={13} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-[12.5px] font-semibold transition-all"
                style={n === page
                  ? { background: '#a3e635', color: '#07070a' }
                  : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Per page</span>
            <div className="relative">
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="appearance-none pl-3 pr-6 py-1.5 rounded-lg text-[12px] font-semibold outline-none cursor-pointer"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}>
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={10} strokeWidth={2} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            </div>
          </div>
        </div>
      </div>

      {modalMode === 'create' && (
        <CatererFormModal
          mode="create"
          onClose={closeFormModal}
          submitting={createMutation.isPending}
          error={createMutation.error}
          onSubmit={input => {
            createMutation.mutate(input, { onSuccess: closeFormModal })
          }}
        />
      )}
      {modalMode === 'edit' && editingId && (
        editingCatererQuery.isLoading ? (
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}>
              <FullPageLoader label="Loading caterer…" />
            </div>,
            document.body,
          )
        ) : editingCatererQuery.data ? (
          <CatererFormModal
            mode="edit"
            initialValue={mapViewModelToFormInput(editingCatererQuery.data)}
            onClose={closeFormModal}
            submitting={updateMutation.isPending}
            error={updateMutation.error}
            onSubmit={input => {
              updateMutation.mutate({ id: editingId, input }, { onSuccess: closeFormModal })
            }}
          />
        ) : null
      )}
      {selectedCaterer && createPortal(
        <CatererDetailModal
          caterer={selectedCaterer}
          onClose={() => setSelectedCaterer(null)}
          onEdit={openEdit}
          onOpenSupportSession={handleOpenSupportSession}
        />,
        document.body
      )}
      {invitingCaterer && createPortal(
        <InviteCatererUserModal
          catererName={invitingCaterer.name}
          isSubmitting={inviteMutation.isPending}
          inviteUrl={inviteMutation.data?.inviteUrl}
          onCancel={() => setInvitingCaterer(null)}
          onConfirm={input => {
            inviteMutation.mutate({ catererId: invitingCaterer.id, ...input })
          }}
        />,
        document.body
      )}
      {supportSessionCaterer && createPortal(
        <SupportSessionModal
          catererName={supportSessionCaterer.name}
          isSubmitting={supportSessionMutation.isPending}
          error={supportSessionMutation.error?.message}
          onCancel={() => setSupportSessionCaterer(null)}
          onConfirm={handleConfirmSupportSession}
        />,
        document.body
      )}
    </div>
  )
}
