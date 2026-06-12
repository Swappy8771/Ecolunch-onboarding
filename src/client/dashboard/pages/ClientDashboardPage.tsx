import { type ReactNode } from 'react'
import {
  School, Baby, BarChart3, Receipt, Users, FileBarChart,
  AlertTriangle, XCircle, CheckCircle2, Clock,
  Rocket, MessageCircle, AlertCircle, FileText,
  ChevronRight, CircleDot, ShieldAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────

type ModuleStatus    = 'active' | 'pending' | 'not-started'
type ItemPriority    = 'blocking' | 'required' | 'warning'
type BlockerSeverity = 'blocking' | 'warning'
type DocStatus       = 'approved' | 'under-review' | 'pending-review' | 'uploaded' | 'expired'
type CorrectPriority = 'high' | 'medium' | 'low'
type CorrectStatus   = 'open' | 'in-progress' | 'resolved'
type TicketStatus    = 'open' | 'pending' | 'resolved'
type TicketPriority  = 'high' | 'medium' | 'low'

interface Module {
  id: string; name: string; progress: number
  status: ModuleStatus; missingCount: number; Icon: LucideIcon
}
interface MissingItem {
  id: number; label: string; section: string
  priority: ItemPriority; module?: string
}
interface GoLiveBlocker {
  id: number; description: string; section: string; severity: BlockerSeverity
}
interface LinkedDoc {
  id: number; name: string; type: string; status: DocStatus; date: string
}
interface LinkedCorrection {
  id: string; description: string; section: string
  priority: CorrectPriority; status: CorrectStatus; date: string
}
interface EcoConversation {
  id: string; subject: string; status: TicketStatus
  priority: TicketPriority; lastMessage: string; timeAgo: string; unread: number
}

// ─── Mock data ───────────────────────────────────────────────

const MODULES: Module[] = [
  { id: 'school',   name: 'School Meals',        progress: 75, status: 'active',      missingCount: 2, Icon: School       },
  { id: 'daycare',  name: 'Daycare / CPE',        progress: 40, status: 'active',      missingCount: 4, Icon: Baby         },
  { id: 'reportiq', name: 'ReportIQ',             progress: 90, status: 'active',      missingCount: 1, Icon: BarChart3    },
  { id: 'acctng',   name: 'Accounting',           progress: 20, status: 'pending',     missingCount: 6, Icon: Receipt      },
  { id: 'parent',   name: 'Parent Subscriptions', progress: 0,  status: 'not-started', missingCount: 0, Icon: Users        },
  { id: 'css',      name: 'CSS Reporting',        progress: 0,  status: 'not-started', missingCount: 0, Icon: FileBarChart },
]

const MISSING_ITEMS: MissingItem[] = [
  { id: 1, label: 'Bank account RIB / IBAN',          section: 'Banking',    priority: 'blocking'                         },
  { id: 2, label: 'Allergen declarations — 3 menus',  section: 'Menus',      priority: 'blocking', module: 'School Meals' },
  { id: 3, label: 'Service contract signature',       section: 'Contracts',  priority: 'blocking'                         },
  { id: 4, label: 'Insurance certificate (2026)',     section: 'Documents',  priority: 'required'                         },
  { id: 5, label: 'Establishment #4 postal address', section: 'My Clients', priority: 'required', module: 'Daycare'      },
  { id: 6, label: 'Daycare meal schedule template',  section: 'Menus',      priority: 'warning',  module: 'Daycare'      },
  { id: 7, label: 'Accounting contact email',        section: 'Profile',    priority: 'warning',  module: 'Accounting'   },
]

const GOLIVE_BLOCKERS: GoLiveBlocker[] = [
  { id: 1, description: 'Banking information incomplete — IBAN missing',          section: 'Banking',   severity: 'blocking' },
  { id: 2, description: '3 menus missing allergen declarations (legal req.)',     section: 'Menus',     severity: 'blocking' },
  { id: 3, description: 'Service contract not yet signed by legal representative',section: 'Contracts', severity: 'blocking' },
  { id: 4, description: 'Insurance certificate expired — 2026 renewal required', section: 'Documents', severity: 'warning'  },
]

const LINKED_DOCS: LinkedDoc[] = [
  { id: 1, name: 'Service Agreement Draft',       type: 'Contract',   status: 'pending-review', date: '2026-06-08' },
  { id: 2, name: 'Kitchen Safety Certificate',    type: 'Compliance', status: 'uploaded',       date: '2026-06-05' },
  { id: 3, name: 'Business Registration (SIRET)', type: 'Legal',      status: 'approved',       date: '2026-06-01' },
  { id: 4, name: 'Menu Package Vol. 1',           type: 'Menu',       status: 'under-review',   date: '2026-06-10' },
  { id: 5, name: 'Insurance Certificate 2025',    type: 'Compliance', status: 'expired',        date: '2026-01-15' },
]

const LINKED_CORRECTIONS: LinkedCorrection[] = [
  { id: 'CR-004', description: 'Bank RIB format incorrect — IBAN expected',      section: 'Banking',    priority: 'high',   status: 'open',        date: '2026-06-09' },
  { id: 'CR-007', description: 'Menu package missing allergen info on 3 items',  section: 'Menus',      priority: 'medium', status: 'open',        date: '2026-06-07' },
  { id: 'CR-009', description: 'Establishment postal code mismatch (Paris 11e)', section: 'My Clients', priority: 'low',    status: 'resolved',    date: '2026-06-03' },
  { id: 'CR-011', description: 'Profile contact phone number format invalid',    section: 'Profile',    priority: 'low',    status: 'in-progress', date: '2026-06-11' },
]

const ECOLOOP: EcoConversation[] = [
  { id: 'TK-001', subject: 'Bank account details — format correction required', status: 'open',    priority: 'high',   lastMessage: 'Admin: Please resubmit your IBAN in standard FR76 format.',          timeAgo: '2h ago',  unread: 2 },
  { id: 'TK-003', subject: 'Menu package review — allergen information',        status: 'pending', priority: 'medium', lastMessage: 'You: I have attached the updated menu file with allergen data...',    timeAgo: '1d ago',  unread: 0 },
  { id: 'TK-005', subject: 'Onboarding welcome & next steps guide',            status: 'open',    priority: 'low',    lastMessage: 'Admin: Welcome to EcoLunch! Here are your first onboarding steps.',  timeAgo: '3d ago',  unread: 1 },
]

// ─── Meta maps ───────────────────────────────────────────────

const MODULE_STATUS_META: Record<ModuleStatus, { label: string; color: string; bg: string; border: string }> = {
  'active':      { label: 'Active',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  'pending':     { label: 'Pending',     color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  'not-started': { label: 'Not Started', color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-default)'  },
}

const ITEM_PRIORITY_META: Record<ItemPriority, { icon: ReactNode; color: string; bg: string; border: string; label: string }> = {
  blocking: { icon: <XCircle       size={12} strokeWidth={2} />, color: '#f87171',         bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', label: 'Blocking' },
  required: { icon: <AlertTriangle size={12} strokeWidth={2} />, color: '#fbbf24',         bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.25)',  label: 'Required' },
  warning:  { icon: <AlertCircle   size={12} strokeWidth={2} />, color: 'var(--text-4)',   bg: 'var(--bg-inner)',        border: 'var(--border-default)',  label: 'Warning'  },
}

const DOC_STATUS_META: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
  'approved':       { label: 'Approved',       color: '#4ade80',         bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  'uploaded':       { label: 'Uploaded',       color: '#60a5fa',         bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
  'under-review':   { label: 'Under Review',   color: '#fbbf24',         bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  'pending-review': { label: 'Pending Review', color: '#a78bfa',         bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
  'expired':        { label: 'Expired',        color: '#f87171',         bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const CORRECTION_PRIORITY_META: Record<CorrectPriority, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: 'High',   color: '#f87171',       bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
  medium: { label: 'Medium', color: '#fbbf24',       bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.25)'  },
  low:    { label: 'Low',    color: 'var(--text-4)', bg: 'var(--bg-inner)',        border: 'var(--border-default)'  },
}

const CORRECTION_STATUS_META: Record<CorrectStatus, { label: string; color: string; bg: string }> = {
  'open':        { label: 'Open',        color: '#f87171',       bg: 'rgba(248,113,113,0.10)' },
  'in-progress': { label: 'In Progress', color: '#fbbf24',       bg: 'rgba(251,191,36,0.10)'  },
  'resolved':    { label: 'Resolved',    color: '#4ade80',       bg: 'rgba(74,222,128,0.10)'  },
}

const TICKET_STATUS_META: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open:     { label: 'Open',     color: '#4ade80',       bg: 'rgba(74,222,128,0.12)'  },
  pending:  { label: 'Pending',  color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)'  },
  resolved: { label: 'Resolved', color: 'var(--text-4)', bg: 'var(--bg-inner)'        },
}

const TICKET_PRIORITY_COLOR: Record<TicketPriority, string> = {
  high:   '#f87171',
  medium: '#fbbf24',
  low:    'var(--text-4)',
}

// ─── Sub-components ─────────────────────────────────────────

interface SectionHeaderProps {
  icon: ReactNode; title: string; count?: number; accent?: boolean
}

function SectionHeader({ icon, title, count, accent = false }: SectionHeaderProps) {
  const iconBg     = accent ? 'rgba(248,113,113,0.12)' : 'var(--accent-dim)'
  const iconBorder = accent ? 'rgba(248,113,113,0.25)' : 'var(--accent-border)'
  const iconColor  = accent ? '#f87171'                 : 'var(--accent)'
  const countBg    = accent ? 'rgba(248,113,113,0.12)' : 'var(--bg-inner)'
  const countColor = accent ? '#f87171'                 : 'var(--text-4)'
  const countBorder= accent ? 'rgba(248,113,113,0.20)' : 'var(--border-default)'

  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>{title}</h2>
      {count !== undefined && (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: countBg, color: countColor, border: `1px solid ${countBorder}` }}>
          {count}
        </span>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────

export function ClientDashboardPage() {
  const startedModules  = MODULES.filter(m => m.status !== 'not-started')
  const activeCount     = MODULES.filter(m => m.status === 'active').length
  const blockingCount   = MISSING_ITEMS.filter(i => i.priority === 'blocking').length
  const openCorrections = LINKED_CORRECTIONS.filter(c => c.status !== 'resolved').length
  const totalUnread     = ECOLOOP.reduce((sum, t) => sum + t.unread, 0)
  const overallProgress = startedModules.length > 0
    ? Math.round(startedModules.reduce((s, m) => s + m.progress, 0) / startedModules.length)
    : 0

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Client Portal / Dashboard Onboarding
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              Concept Gourmet
            </h1>
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80', flexShrink: 0 }} />
                Onboarding Phase 1
              </span>
              {blockingCount > 0 && (
                <span className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                  <XCircle size={11} strokeWidth={2} />
                  {blockingCount} blocking items
                </span>
              )}
            </div>
          </div>

          {/* Overall progress card */}
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] font-bold mb-1.5" style={{ color: 'var(--text-4)' }}>
                Overall Progress
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>
                  {overallProgress}%
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11.5px] font-medium" style={{ color: 'var(--text-3)' }}>
                    {activeCount} active modules
                  </p>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                    {MISSING_ITEMS.length} items pending
                  </p>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 w-[160px] rounded-full overflow-hidden"
                style={{ background: 'var(--bg-inner)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${overallProgress}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="px-5 py-6 flex flex-col gap-8">

        {/* ── Section 1 & 2: Active Modules & Progress ─────── */}
        <section>
          <SectionHeader
            icon={<CircleDot size={14} strokeWidth={1.8} />}
            title="Active Modules & Progress"
            count={MODULES.length}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {MODULES.map(mod => {
              const sm        = MODULE_STATUS_META[mod.status]
              const isStarted = mod.status !== 'not-started'
              const barColor  = mod.progress >= 80 ? '#4ade80' : mod.progress >= 50 ? 'var(--accent)' : '#fbbf24'
              return (
                <div key={mod.id} className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isStarted ? 'var(--accent-dim)' : 'var(--bg-inner)',
                        border: `1px solid ${isStarted ? 'var(--accent-border)' : 'var(--border-default)'}`,
                      }}>
                      <mod.Icon size={16} strokeWidth={1.8} style={{ color: isStarted ? 'var(--accent)' : 'var(--text-4)' }} />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
                      {sm.label}
                    </span>
                  </div>

                  <div>
                    <p className="text-[12.5px] font-bold leading-snug mb-2" style={{ color: 'var(--text-1)' }}>
                      {mod.name}
                    </p>
                    {isStarted ? (
                      <>
                        <div className="h-1.5 rounded-full overflow-hidden mb-1.5"
                          style={{ background: 'var(--bg-inner)' }}>
                          <div className="h-full rounded-full" style={{ width: `${mod.progress}%`, background: barColor }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold" style={{ color: barColor }}>
                            {mod.progress}%
                          </span>
                          {mod.missingCount > 0 && (
                            <span className="text-[10px] font-semibold" style={{ color: '#f87171' }}>
                              {mod.missingCount} missing
                            </span>
                          )}
                          {mod.missingCount === 0 && mod.progress === 100 && (
                            <CheckCircle2 size={12} strokeWidth={2} style={{ color: '#4ade80' }} />
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>Not yet configured</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Section 3 & 6: Missing Items / Go-Live Blockers ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">

          {/* Missing Items */}
          <section>
            <SectionHeader
              icon={<AlertTriangle size={14} strokeWidth={1.8} />}
              title="Missing Items"
              count={MISSING_ITEMS.length}
            />
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              {MISSING_ITEMS.map((item, idx) => {
                const pm = ITEM_PRIORITY_META[item.priority]
                return (
                  <div key={item.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: idx < MISSING_ITEMS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <span style={{ color: pm.color, flexShrink: 0 }}>{pm.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>
                        {item.label}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{item.section}</span>
                        {item.module && (
                          <>
                            <span style={{ color: 'var(--border-strong)', fontSize: 10 }}>·</span>
                            <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{item.module}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: pm.bg, color: pm.color, border: `1px solid ${pm.border}` }}>
                      {pm.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Go-Live Blockers */}
          <section>
            <SectionHeader
              icon={<Rocket size={14} strokeWidth={1.8} />}
              title="Go-Live Blockers"
              count={GOLIVE_BLOCKERS.length}
              accent={GOLIVE_BLOCKERS.length > 0}
            />
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              {GOLIVE_BLOCKERS.map((blocker, idx) => (
                <div key={blocker.id}
                  className="flex items-start gap-3 px-4 py-3.5"
                  style={{ borderBottom: idx < GOLIVE_BLOCKERS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: blocker.severity === 'blocking' ? 'rgba(248,113,113,0.12)' : 'rgba(251,191,36,0.12)',
                      border: `1px solid ${blocker.severity === 'blocking' ? 'rgba(248,113,113,0.30)' : 'rgba(251,191,36,0.30)'}`,
                    }}>
                    {blocker.severity === 'blocking'
                      ? <XCircle       size={11} strokeWidth={2.5} style={{ color: '#f87171' }} />
                      : <AlertTriangle size={10} strokeWidth={2.5} style={{ color: '#fbbf24' }} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
                      {blocker.description}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{blocker.section}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Section 4: Linked Documents ──────────────────── */}
        <section>
          <SectionHeader
            icon={<FileText size={14} strokeWidth={1.8} />}
            title="Linked Documents"
            count={LINKED_DOCS.length}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {LINKED_DOCS.map(doc => {
              const sm = DOC_STATUS_META[doc.status]
              return (
                <div key={doc.id} className="rounded-xl px-4 py-3.5 flex flex-col gap-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.10em]"
                      style={{ color: 'var(--text-4)' }}>
                      {doc.type}
                    </span>
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
                      {sm.label}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
                    {doc.name}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{doc.date}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Section 5: Linked Corrections ────────────────── */}
        <section>
          <SectionHeader
            icon={<ShieldAlert size={14} strokeWidth={1.8} />}
            title="Linked Corrections"
            count={openCorrections}
          />
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

            {/* Desktop header */}
            <div className="hidden md:grid px-4 py-2.5"
              style={{ gridTemplateColumns: '80px 1fr 120px 80px 110px', gap: '1rem', background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
              {['Ref', 'Description', 'Section', 'Priority', 'Status'].map(col => (
                <span key={col} className="text-[10.5px] uppercase tracking-[0.11em] font-bold"
                  style={{ color: 'var(--text-4)' }}>
                  {col}
                </span>
              ))}
            </div>

            {LINKED_CORRECTIONS.map((cr, idx) => {
              const prm = CORRECTION_PRIORITY_META[cr.priority]
              const stm = CORRECTION_STATUS_META[cr.status]
              const border = idx < LINKED_CORRECTIONS.length - 1 ? '1px solid var(--border-subtle)' : 'none'
              return (
                <div key={cr.id} style={{ borderBottom: border }}>
                  {/* Desktop row */}
                  <div className="hidden md:grid px-4 py-3.5 items-center"
                    style={{ gridTemplateColumns: '80px 1fr 120px 80px 110px', gap: '1rem' }}>
                    <span className="text-[11.5px] font-mono font-bold" style={{ color: 'var(--text-3)' }}>
                      {cr.id}
                    </span>
                    <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-2)' }}>
                      {cr.description}
                    </p>
                    <span className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>{cr.section}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full w-fit"
                      style={{ background: prm.bg, color: prm.color, border: `1px solid ${prm.border}` }}>
                      {prm.label}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full w-fit"
                      style={{ background: stm.bg, color: stm.color }}>
                      {stm.label}
                    </span>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden px-4 py-3.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-mono font-bold" style={{ color: 'var(--text-3)' }}>
                        {cr.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: prm.bg, color: prm.color }}>
                          {prm.label}
                        </span>
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: stm.bg, color: stm.color }}>
                          {stm.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>
                      {cr.description}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                      {cr.section} · {cr.date}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Section 7: Linked EcoLoop Conversations ──────── */}
        <section>
          <SectionHeader
            icon={<MessageCircle size={14} strokeWidth={1.8} />}
            title="Linked EcoLoop Conversations"
            count={totalUnread > 0 ? totalUnread : ECOLOOP.length}
          />
          <div className="flex flex-col gap-3">
            {ECOLOOP.map(conv => {
              const stm = TICKET_STATUS_META[conv.status]
              const priorityColor = TICKET_PRIORITY_COLOR[conv.priority]
              return (
                <div key={conv.id} className="rounded-2xl px-5 py-4 flex flex-col gap-2.5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

                  {/* Top row: badges + meta */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                        {conv.id}
                      </span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: stm.bg, color: stm.color }}>
                        {stm.label}
                      </span>
                      <span className="text-[10.5px] font-semibold capitalize" style={{ color: priorityColor }}>
                        {conv.priority} priority
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      {conv.unread > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                          {conv.unread} new
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-4)' }}>
                        <Clock size={10} strokeWidth={2} />
                        {conv.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  <h3 className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>
                    {conv.subject}
                  </h3>

                  {/* Last message preview */}
                  <p className="text-[12px] leading-relaxed truncate" style={{ color: 'var(--text-4)' }}>
                    {conv.lastMessage}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1.5"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                      EcoLoop Communication Thread
                    </span>
                    <button
                      className="flex items-center gap-1 text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-70"
                      style={{ color: 'var(--accent)' }}>
                      View Thread <ChevronRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  )
}
