import { type ReactNode } from 'react'
import {
  School, Baby, Tent, BarChart3, Receipt,
  AlertTriangle, XCircle, CheckCircle2, Clock,
  Rocket, MessageCircle, FileText,
  ChevronRight, CircleDot, ShieldAlert, TrendingUp, Lock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { useCatererDashboardStats } from '@/features/catererDashboard/hooks/useCatererDashboardStats'
import {
  useCatererModulesRequiredSetupOverview, useCatererModulesMissingItems,
} from '@/features/catererModulesRequiredSetup/hooks/useCatererModulesRequiredSetupQueries'
import type {
  ModuleKey, ModuleSetupSummaryViewModel, SetupChecklistItemViewModel,
} from '@/features/catererModulesRequiredSetup/types/catererModulesRequiredSetup.types'
import { useCatererGoliveSummary } from '@/features/catererGolive/hooks/useCatererGoliveQueries'
import { useCatererDocumentVaultDocuments } from '@/features/catererDocumentVault/hooks/useCatererDocumentVaultQueries'
import { useCatererCorrectionsList, useCatererCorrectionsSummary } from '@/features/catererCorrections/hooks/useCatererCorrectionsQueries'
import { useCatererEcoloopList } from '@/features/catererEcoloop/hooks/useCatererEcoloopQueries'
import type { CorrectionViewModel } from '@/features/catererCorrections/types/catererCorrections.types'
import type { EcoloopConversationViewModel } from '@/features/catererEcoloop/types/catererEcoloop.types'

// ─── Module meta (the 5 tracked setup modules) ─────────────────

const MODULE_KEYS: ModuleKey[] = ['school_meals', 'daycare_meals', 'camp_meals', 'accounting', 'reportiq']

const MODULE_META: Record<ModuleKey, { label: string; Icon: LucideIcon }> = {
  school_meals: { label: 'School Meals', Icon: School },
  daycare_meals: { label: 'Daycare / CPE', Icon: Baby },
  camp_meals: { label: 'Camp Meals', Icon: Tent },
  accounting: { label: 'Accounting', Icon: Receipt },
  reportiq: { label: 'ReportIQ', Icon: BarChart3 },
}

// ─── Status meta ─────────────────────────────────────────────

const CORRECTION_PRIORITY_META: Record<CorrectionViewModel['priority'], { label: string; color: string; bg: string; border: string }> = {
  high: { label: 'High', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)' },
  low: { label: 'Low', color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-default)' },
}

const CORRECTION_STATUS_META: Record<CorrectionViewModel['status'], { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#f87171', bg: 'rgba(248,113,113,0.10)' },
  in_progress: { label: 'In Progress', color: '#fbbf24', bg: 'rgba(251,191,36,0.10)' },
  resolved: { label: 'Resolved', color: '#4ade80', bg: 'rgba(74,222,128,0.10)' },
  closed: { label: 'Closed', color: 'var(--text-4)', bg: 'var(--bg-inner)' },
}

const CONVERSATION_STATUS_META: Record<EcoloopConversationViewModel['status'], { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  waiting_for_caterer: { label: 'Awaiting You', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  waiting_for_admin: { label: 'Awaiting EcoLunch', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  resolved: { label: 'Resolved', color: 'var(--text-4)', bg: 'var(--bg-inner)' },
  closed: { label: 'Closed', color: 'var(--text-4)', bg: 'var(--bg-inner)' },
}

const CONVERSATION_PRIORITY_COLOR: Record<EcoloopConversationViewModel['priority'], string> = {
  urgent: '#f87171',
  high: '#f87171',
  normal: 'var(--text-4)',
  low: 'var(--text-4)',
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

// ─── Bar color helper ────────────────────────────────────────

function barHex(pct: number) {
  return pct >= 80 ? '#4ade80' : pct >= 50 ? '#bbf70a' : '#fbbf24'
}

// ─── KPI stat tile ───────────────────────────────────────────

interface KpiTileProps {
  label: string; value: string | number; icon: ReactNode
  color: string; trend: string
}

function KpiTile({ label, value, icon, color, trend }: KpiTileProps) {
  const glow = color + '22'
  const border = color + '55'
  return (
    <div
      className="relative flex-1 min-w-0 rounded-2xl overflow-hidden card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = border
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${glow}`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${color}88, transparent)` }} />

      <div className="px-5 pt-5 pb-5">
        <div className="flex items-start justify-between mb-5">
          <span className="text-[11.5px] uppercase tracking-[0.15em] font-bold leading-tight max-w-[130px]"
            style={{ color: 'var(--text-3)' }}>
            {label}
          </span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: color + '18', color }}>
            {icon}
          </div>
        </div>

        <div className="text-[44px] font-black leading-none tracking-tighter"
          style={{ color, textShadow: `0 0 32px ${glow}`, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>

        <div className="mt-3 flex items-center gap-1">
          <TrendingUp size={11} strokeWidth={2.5} style={{ color }} />
          <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-3)' }}>{trend}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Module progress card ────────────────────────────────────

function ModuleCard({ moduleKey, summary }: { moduleKey: ModuleKey; summary: ModuleSetupSummaryViewModel | undefined }) {
  const meta = MODULE_META[moduleKey]
  const isActive = summary?.active ?? false
  const hex = barHex(summary?.completionPercentage ?? 0)
  const glow = hex + '22'
  const borderHov = hex + '55'

  return (
    <div
      className="relative rounded-2xl overflow-hidden card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = isActive ? borderHov : 'var(--border-strong)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = isActive ? `0 0 28px ${glow}` : 'none'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${hex}88, transparent)` }} />
      )}

      <div className="px-5 pt-5 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={isActive
              ? { background: `linear-gradient(135deg, ${hex}18, ${hex}08)`, border: `1px solid ${hex}30`, color: hex }
              : { background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-4)' }}>
            <meta.Icon size={18} strokeWidth={1.8} />
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={isActive
              ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }
              : { background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
            {!isActive && <Lock size={9} strokeWidth={2.5} />}
            {isActive ? 'Active' : 'Not Activated'}
          </span>
        </div>

        <h3 className="text-[14.5px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>
          {meta.label}
        </h3>

        {isActive && summary ? (
          <>
            <div className="text-[40px] font-black leading-none mt-3"
              style={{ color: hex, textShadow: `0 0 28px ${hex}44`, fontVariantNumeric: 'tabular-nums' }}>
              {summary.completionPercentage}%
            </div>

            <div className="mt-3.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
              <div className="h-full rounded-full" style={{ width: `${summary.completionPercentage}%`, background: hex, boxShadow: `0 0 8px ${hex}66` }} />
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              {summary.missingCount > 0 ? (
                <>
                  <AlertTriangle size={11} strokeWidth={2} style={{ color: '#f87171' }} />
                  <span className="text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>
                    {summary.missingCount} item{summary.missingCount !== 1 ? 's' : ''} missing
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={11} strokeWidth={2} style={{ color: '#4ade80' }} />
                  <span className="text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>All items complete</span>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-[13px] mt-3" style={{ color: 'var(--text-4)' }}>Not yet activated by EcoLunch</p>
        )}
      </div>
    </div>
  )
}

// ─── Section header ──────────────────────────────────────────

interface SectionHeaderProps {
  icon: ReactNode; title: string; count?: number; accent?: boolean
}

function SectionHeader({ icon, title, count, accent = false }: SectionHeaderProps) {
  const iconBg = accent ? 'rgba(248,113,113,0.12)' : 'var(--accent-dim)'
  const iconBorder = accent ? 'rgba(248,113,113,0.25)' : 'var(--accent-border)'
  const iconColor = accent ? '#f87171' : 'var(--accent)'
  const countBg = accent ? 'rgba(248,113,113,0.12)' : 'var(--bg-inner)'
  const countColor = accent ? '#f87171' : 'var(--text-4)'
  const countBorder = accent ? 'rgba(248,113,113,0.20)' : 'var(--border-default)'

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

// ─── Missing item row ─────────────────────────────────────────

function MissingItemRow({ item, last }: { item: SetupChecklistItemViewModel; last: boolean }) {
  const isBlocking = item.required && (item.status === 'missing' || item.status === 'blocked')
  const color = isBlocking ? '#f87171' : item.status === 'pending' ? '#fbbf24' : 'var(--text-4)'
  const bg = isBlocking ? 'rgba(248,113,113,0.10)' : item.status === 'pending' ? 'rgba(251,191,36,0.10)' : 'var(--bg-inner)'
  const border = isBlocking ? 'rgba(248,113,113,0.25)' : item.status === 'pending' ? 'rgba(251,191,36,0.25)' : 'var(--border-default)'
  const label = isBlocking ? 'Blocking' : item.status === 'pending' ? 'Pending' : item.required ? 'Required' : 'Optional'
  const Icon = isBlocking ? XCircle : AlertTriangle

  return (
    <div className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <Icon size={12} strokeWidth={2} style={{ color, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{item.label}</p>
        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{MODULE_META[item.moduleKey].label}</span>
      </div>
      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ background: bg, color, border: `1px solid ${border}` }}>
        {label}
      </span>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────

export function CatererDashboardPage() {
  const statsQuery = useCatererDashboardStats()
  const overviewQuery = useCatererModulesRequiredSetupOverview(undefined)
  const missingItemsQuery = useCatererModulesMissingItems(undefined)
  const goliveSummaryQuery = useCatererGoliveSummary()
  const documentsQuery = useCatererDocumentVaultDocuments(undefined)
  const correctionsListQuery = useCatererCorrectionsList({ limit: 100 })
  const correctionsSummaryQuery = useCatererCorrectionsSummary(undefined)
  const ecoloopQuery = useCatererEcoloopList()

  // Same convention as the admin dashboard: never gate the whole page behind
  // a combined isLoading/isError over many independent queries — one slow or
  // failed section (e.g. EcoLoop, or a caterer with no modules active yet)
  // must not blank out sections that already loaded fine. Every value below
  // falls back to an empty/zero placeholder instead, exactly like the admin
  // dashboard's `stats?.field ?? '—'` stat cards.
  const stats = statsQuery.data
  const summaryByModule = new Map((overviewQuery.data?.modules ?? []).map(m => [m.moduleKey, m]))
  const missingItems = (missingItemsQuery.data ?? []).flatMap(m => m.items)
  const golive = goliveSummaryQuery.data
  const documents = documentsQuery.data?.data ?? []
  const corrections = correctionsListQuery.data?.data ?? []
  const correctionsSummary = correctionsSummaryQuery.data
  const openCorrections = (correctionsSummary?.open ?? 0) + (correctionsSummary?.inProgress ?? 0)
  const conversations = ecoloopQuery.data?.data ?? []
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  const golivBlockers = golive?.blockers ?? []

  // Numeric fallbacks for anything used in math (bar widths, badge sums);
  // display fallbacks below stay '—' text, matching the admin dashboard.
  const overallProgressPctNum = stats?.overallProgressPct ?? 0
  const blockingItemsCountNum = stats?.blockingItemsCount ?? 0

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Caterer Portal / Dashboard Onboarding
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              Dashboard
            </h1>
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              {blockingItemsCountNum > 0 ? (
                <span className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                  <XCircle size={11} strokeWidth={2} />
                  {blockingItemsCountNum} blocking items
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80', flexShrink: 0 }} />
                  No blocking items
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] font-bold mb-1.5" style={{ color: 'var(--text-4)' }}>
                Overall Progress
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>
                  {stats ? `${stats.overallProgressPct}%` : '—'}
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11.5px] font-medium" style={{ color: 'var(--text-3)' }}>
                    {stats?.activeModulesCount ?? '—'} active modules
                  </p>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                    {stats?.pendingItemsCount ?? '—'} items pending
                  </p>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 w-[160px] rounded-full overflow-hidden"
                style={{ background: 'var(--bg-inner)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${overallProgressPctNum}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: <CircleDot size={13} strokeWidth={1.8} />, badge: MODULE_KEYS.length },
          { id: 'missing', label: 'Missing Items', icon: <AlertTriangle size={13} strokeWidth={1.8} />, badge: missingItems.length },
          { id: 'documents', label: 'Documents', icon: <FileText size={13} strokeWidth={1.8} />, badge: documents.length },
          { id: 'corrections', label: 'Corrections & Comms', icon: <ShieldAlert size={13} strokeWidth={1.8} />, badge: openCorrections + totalUnread },
        ]}>
        {activeTab => (
          <div className="px-5 py-6 flex flex-col gap-8">

            {/* ── Overview ────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8">

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  <KpiTile
                    label="Overall Progress"
                    value={stats ? `${stats.overallProgressPct}%` : '—'}
                    icon={<CircleDot size={15} strokeWidth={2} />}
                    color="#bbf70a"
                    trend={stats ? `${stats.activeModulesCount} active modules` : 'Loading…'}
                  />
                  <KpiTile
                    label="Active Modules"
                    value={stats?.activeModulesCount ?? '—'}
                    icon={<CheckCircle2 size={15} strokeWidth={2} />}
                    color="#4ade80"
                    trend={MODULE_KEYS.filter(k => summaryByModule.get(k)?.active).map(k => MODULE_META[k].label).join(' · ') || 'None active yet'}
                  />
                  <KpiTile
                    label="Blocking Items"
                    value={stats?.blockingItemsCount ?? '—'}
                    icon={<XCircle size={15} strokeWidth={2} />}
                    color="#f87171"
                    trend="Action required"
                  />
                  <KpiTile
                    label="Pending Items"
                    value={stats?.pendingItemsCount ?? '—'}
                    icon={<AlertTriangle size={15} strokeWidth={2} />}
                    color="#fbbf24"
                    trend="Across active modules"
                  />
                </div>

                <section>
                  <SectionHeader
                    icon={<CircleDot size={14} strokeWidth={1.8} />}
                    title="Modules & Progress"
                    count={MODULE_KEYS.length}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MODULE_KEYS.map(key => <ModuleCard key={key} moduleKey={key} summary={summaryByModule.get(key)} />)}
                  </div>
                </section>
              </div>
            )}

            {/* ── Missing Items + Go-Live Blockers ── */}
            {activeTab === 'missing' && (
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
                <section>
                  <SectionHeader
                    icon={<AlertTriangle size={14} strokeWidth={1.8} />}
                    title="Missing Items"
                    count={missingItems.length}
                  />
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                    {missingItems.length === 0 ? (
                      <p className="text-[12.5px] px-4 py-6 text-center" style={{ color: 'var(--text-4)' }}>
                        No missing items across your active modules.
                      </p>
                    ) : (
                      missingItems.map((item, idx) => (
                        <MissingItemRow key={item.key} item={item} last={idx === missingItems.length - 1} />
                      ))
                    )}
                  </div>
                </section>

                <section>
                  <SectionHeader
                    icon={<Rocket size={14} strokeWidth={1.8} />}
                    title="Go-Live Blockers"
                    count={golivBlockers.length}
                    accent={golivBlockers.length > 0}
                  />
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                    {golivBlockers.length === 0 ? (
                      <p className="text-[12.5px] px-4 py-6 text-center" style={{ color: 'var(--text-4)' }}>
                        No go-live blockers.
                      </p>
                    ) : (
                      golivBlockers.map((blocker, idx) => (
                        <div key={blocker.id}
                          className="flex items-start gap-3 px-4 py-3.5"
                          style={{ borderBottom: idx < golivBlockers.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)' }}>
                            <XCircle size={11} strokeWidth={2.5} style={{ color: '#f87171' }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>{blocker.title}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{blocker.category}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ── Documents ──────────────────────────────────── */}
            {activeTab === 'documents' && (
              <section>
                <SectionHeader
                  icon={<FileText size={14} strokeWidth={1.8} />}
                  title="Linked Documents"
                  count={documents.length}
                />
                {documents.length === 0 ? (
                  <p className="text-[12.5px] py-6 text-center" style={{ color: 'var(--text-4)' }}>
                    No documents uploaded yet — head to Document Vault to get started.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                    {documents.map(doc => (
                      <div key={doc.id} className="rounded-xl px-4 py-3.5 flex flex-col gap-2"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.10em]" style={{ color: 'var(--text-4)' }}>{doc.category}</span>
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: doc.status === 'approved' ? 'rgba(74,222,128,0.12)' : doc.status === 'rejected' ? 'rgba(248,113,113,0.10)' : 'rgba(96,165,250,0.12)',
                              color: doc.status === 'approved' ? '#4ade80' : doc.status === 'rejected' ? '#f87171' : '#60a5fa',
                            }}>
                            {doc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[12px] font-semibold leading-snug truncate" style={{ color: 'var(--text-1)' }}>{doc.fileName}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Corrections & EcoLoop ─────────────────────── */}
            {activeTab === 'corrections' && (
              <>
                <section>
                  <SectionHeader
                    icon={<ShieldAlert size={14} strokeWidth={1.8} />}
                    title="Linked Corrections"
                    count={openCorrections}
                  />
                  {corrections.length === 0 ? (
                    <p className="text-[12.5px] py-6 text-center" style={{ color: 'var(--text-4)' }}>No corrections on file.</p>
                  ) : (
                    <div className="rounded-2xl overflow-hidden"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                      <div className="hidden md:grid px-4 py-2.5"
                        style={{ gridTemplateColumns: '1fr 120px 80px 110px', gap: '1rem', background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
                        {['Description', 'Section', 'Priority', 'Status'].map(col => (
                          <span key={col} className="text-[10.5px] uppercase tracking-[0.11em] font-bold" style={{ color: 'var(--text-4)' }}>{col}</span>
                        ))}
                      </div>
                      {corrections.map((cr, idx) => {
                        const prm = CORRECTION_PRIORITY_META[cr.priority]
                        const stm = CORRECTION_STATUS_META[cr.status]
                        return (
                          <div key={cr.id} style={{ borderBottom: idx < corrections.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                            <div className="hidden md:grid px-4 py-3.5 items-center"
                              style={{ gridTemplateColumns: '1fr 120px 80px 110px', gap: '1rem' }}>
                              <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-2)' }}>{cr.description}</p>
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
                            <div className="md:hidden px-4 py-3.5 flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: prm.bg, color: prm.color }}>{prm.label}</span>
                                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: stm.bg, color: stm.color }}>{stm.label}</span>
                                </div>
                              </div>
                              <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{cr.description}</p>
                              <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{cr.section}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>

                <section>
                  <SectionHeader
                    icon={<MessageCircle size={14} strokeWidth={1.8} />}
                    title="Linked EcoLoop Conversations"
                    count={totalUnread > 0 ? totalUnread : conversations.length}
                  />
                  {conversations.length === 0 ? (
                    <p className="text-[12.5px] py-6 text-center" style={{ color: 'var(--text-4)' }}>No EcoLoop conversations yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {conversations.map(conv => {
                        const stm = CONVERSATION_STATUS_META[conv.status]
                        const priorityColor = CONVERSATION_PRIORITY_COLOR[conv.priority]
                        return (
                          <div key={conv.id} className="rounded-2xl px-5 py-4 flex flex-col gap-2.5"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: stm.bg, color: stm.color }}>
                                  {stm.label}
                                </span>
                                <span className="text-[10.5px] font-semibold capitalize" style={{ color: priorityColor }}>
                                  {conv.priority} priority
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                {conv.unreadCount > 0 && (
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                                    {conv.unreadCount} new
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-4)' }}>
                                  <Clock size={10} strokeWidth={2} />
                                  {relativeTime(conv.lastMessageAt)}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{conv.subject}</h3>
                            <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                              <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{conv.messageCount} message{conv.messageCount !== 1 ? 's' : ''}</span>
                              <a href="/caterer/ecoloop" className="flex items-center gap-1 text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-70"
                                style={{ color: 'var(--accent)' }}>
                                View Thread <ChevronRight size={12} strokeWidth={2.5} />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
