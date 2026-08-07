import { useState } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import {
  CheckCircle2, XCircle, AlertTriangle,
  Rocket, ShieldCheck, Scale, Building2,
  FilePen, BookOpen, Baby, Tent, Calculator, FileBarChart2,
  ClipboardList, FileCheck2, ChevronDown, ChevronUp, Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCatererGoliveSummary, useCatererGoliveChecklist } from '@/features/catererGolive/hooks/useCatererGoliveQueries'
import type {
  GoLiveChecklistItemViewModel, GoLiveChecklistSectionViewModel, GoLiveSummaryViewModel,
} from '@/features/catererGolive/types/catererGolive.types'

// ─── Types ────────────────────────────────────────────────────

type CheckStatus = 'passed' | 'failed' | 'warning'
type ReadyState = 'blocked' | 'ready' | 'ready-with-warnings'

// ─── Section icon/accent + module tag (keyed by backend section key) ──

const SECTION_META: Record<string, { title: string; Icon: LucideIcon; accent: string; moduleLabel: string | null }> = {
  documents: { title: 'Documents & Compliance', Icon: ShieldCheck, accent: '#fbbf24', moduleLabel: null },
  banking: { title: 'Banking', Icon: Building2, accent: '#4ade80', moduleLabel: null },
  contracts: { title: 'Contracts & Signatures', Icon: FilePen, accent: '#c084fc', moduleLabel: null },
  legal: { title: 'Legal', Icon: Scale, accent: '#60a5fa', moduleLabel: null },
  school_meals: { title: 'School Meals — Module Setup', Icon: BookOpen, accent: '#4ade80', moduleLabel: 'School Meals' },
  daycare_meals: { title: 'Daycare / CPE — Module Setup', Icon: Baby, accent: '#60a5fa', moduleLabel: 'Daycare / CPE' },
  camp_meals: { title: 'Camp Meals — Module Setup', Icon: Tent, accent: '#fb923c', moduleLabel: 'Camp Meals' },
  accounting: { title: 'Accounting — Module Setup', Icon: Calculator, accent: '#fb923c', moduleLabel: 'Accounting' },
  reportiq: { title: 'ReportIQ — Module Setup', Icon: FileBarChart2, accent: '#a3e635', moduleLabel: 'ReportIQ' },
  corrections: { title: 'Open Corrections', Icon: ClipboardList, accent: '#f87171', moduleLabel: null },
  validation: { title: 'Open Validations', Icon: FileCheck2, accent: '#60a5fa', moduleLabel: null },
}

function sectionMeta(section: GoLiveChecklistSectionViewModel) {
  return SECTION_META[section.key] ?? { title: section.label, Icon: ClipboardList, accent: '#94a3b8', moduleLabel: null }
}

function itemStatus(item: GoLiveChecklistItemViewModel): CheckStatus {
  if (item.blocker) return 'failed'
  if (item.warning) return 'warning'
  return 'passed'
}

function humanizeStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
}

// ─── Check status meta ────────────────────────────────────────

const CHECK_META: Record<CheckStatus, { color: string; bg: string; border: string; Icon: LucideIcon; label: string }> = {
  passed: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.28)', Icon: CheckCircle2, label: 'Passed' },
  failed: { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', Icon: XCircle, label: 'Failed' },
  warning: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.28)', Icon: AlertTriangle, label: 'Warning' },
}

// ─── Readiness state (from the backend's own `ready` flag + warnings count) ──

function readinessState(summary: GoLiveSummaryViewModel): ReadyState {
  if (!summary.ready) return 'blocked'
  if (summary.totals.warnings > 0) return 'ready-with-warnings'
  return 'ready'
}

// ─── Badge ────────────────────────────────────────────────────

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

// ─── Check item row ───────────────────────────────────────────

function CheckRow({ item, last }: { item: GoLiveChecklistItemViewModel; last: boolean }) {
  const status = itemStatus(item)
  const m = CHECK_META[status]
  return (
    <div className="flex items-start gap-3 py-3"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: m.bg, border: `1px solid ${m.border}` }}>
        <m.Icon size={11} strokeWidth={2.5} style={{ color: m.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
          {item.title}
          {item.blocker && (
            <span className="ml-1.5 text-[9.5px] font-black px-1.5 py-px rounded uppercase tracking-wide"
              style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.30)', verticalAlign: 'middle' }}>
              Blocker
            </span>
          )}
        </p>
        {status !== 'passed' && (
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{humanizeStatus(item.status)}</p>
        )}
      </div>
      <span className="hidden sm:flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
        <m.Icon size={9} strokeWidth={2.5} />{m.label}
      </span>
    </div>
  )
}

// ─── Section stats ────────────────────────────────────────────

function sectionStats(section: GoLiveChecklistSectionViewModel) {
  const passed = section.items.filter((i) => itemStatus(i) === 'passed').length
  const failed = section.items.filter((i) => itemStatus(i) === 'failed').length
  const warning = section.items.filter((i) => itemStatus(i) === 'warning').length
  const overallStatus: CheckStatus = failed > 0 ? 'failed' : warning > 0 ? 'warning' : 'passed'
  return { passed, failed, warning, total: section.items.length, overallStatus }
}

// ─── Section card ─────────────────────────────────────────────

function SectionCard({ section }: { section: GoLiveChecklistSectionViewModel }) {
  const meta = sectionMeta(section)
  const stats = sectionStats(section)
  const sm = CHECK_META[stats.overallStatus]
  const [open, setOpen] = useState(stats.overallStatus !== 'passed')

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${sm.color}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
        style={{ background: 'var(--bg-inner)', borderBottom: open ? '1px solid var(--border-default)' : 'none' }}>

        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}35` }}>
          <meta.Icon size={14} strokeWidth={1.8} style={{ color: meta.accent }} />
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <p className="text-[13px] font-black" style={{ color: 'var(--text-1)' }}>{meta.title}</p>
          {meta.moduleLabel && (
            <span className="text-[10px] font-bold px-1.5 py-px rounded"
              style={{ background: `${meta.accent}18`, color: meta.accent, border: `1px solid ${meta.accent}30` }}>
              {meta.moduleLabel}
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {stats.failed > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: CHECK_META.failed.bg, color: CHECK_META.failed.color, border: `1px solid ${CHECK_META.failed.border}` }}>
              {stats.failed} failed
            </span>
          )}
          {stats.warning > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: CHECK_META.warning.bg, color: CHECK_META.warning.color, border: `1px solid ${CHECK_META.warning.border}` }}>
              {stats.warning} warnings
            </span>
          )}
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-4)' }}>
            {stats.passed}/{stats.total}
          </span>
        </div>

        <Badge {...sm} label={sm.label} />

        {open
          ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          : <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />}
      </button>

      {open && (
        <div className="px-5">
          {section.items.map((item, idx) => (
            <CheckRow key={item.key} item={item} last={idx === section.items.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Go-Live Status Hero ──────────────────────────────────────

function GoLiveStatusHero({ summary }: { summary: GoLiveSummaryViewModel }) {
  const state = readinessState(summary)
  const isBlocked = state === 'blocked'
  const isWarnings = state === 'ready-with-warnings'

  const bg = isBlocked ? 'rgba(248,113,113,0.06)' : isWarnings ? 'rgba(251,191,36,0.06)' : 'rgba(74,222,128,0.06)'
  const border = isBlocked ? 'rgba(248,113,113,0.28)' : isWarnings ? 'rgba(251,191,36,0.28)' : 'rgba(74,222,128,0.28)'
  const accent = isBlocked ? '#f87171' : isWarnings ? '#fbbf24' : '#4ade80'
  const icon = isBlocked
    ? <XCircle size={28} strokeWidth={1.5} style={{ color: accent }} />
    : isWarnings ? <AlertTriangle size={28} strokeWidth={1.5} style={{ color: accent }} />
    : <CheckCircle2 size={28} strokeWidth={1.5} style={{ color: accent }} />
  const title = isBlocked ? 'Go-Live Blocked' : isWarnings ? 'Ready — Minor Warnings' : 'Ready for Go-Live'
  const sub = isBlocked
    ? `${summary.totals.blockers} blocker${summary.totals.blockers !== 1 ? 's' : ''} must be resolved before EcoLunch can activate your account`
    : isWarnings
    ? `All required items passed. ${summary.totals.warnings} non-blocking item${summary.totals.warnings !== 1 ? 's' : ''} still under review`
    : 'All required onboarding checks have passed. EcoLunch will review and activate your account.'

  return (
    <div className="rounded-2xl px-6 py-6 flex items-center gap-5 flex-wrap"
      style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `2px solid ${accent}40` }}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[20px] font-black leading-tight" style={{ color: accent }}>{title}</p>
        <p className="text-[12.5px] mt-1 leading-relaxed" style={{ color: 'var(--text-3)' }}>{sub}</p>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
            <CheckCircle2 size={11} strokeWidth={2.5} />{summary.totals.passed} Passed
          </span>
          {summary.totals.blockers > 0 && (
            <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              <XCircle size={11} strokeWidth={2.5} />{summary.totals.blockers} Blocking
            </span>
          )}
          {summary.totals.warnings > 0 && (
            <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(251,191,36,0.10)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
              <AlertTriangle size={11} strokeWidth={2.5} />{summary.totals.warnings} Warnings
            </span>
          )}
          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>
            {summary.totals.total} total checks
          </span>
        </div>
      </div>

      {/* No self-request action exists — EcoLunch reviews and activates once every blocker clears. */}
      <div
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-[12.5px] font-bold shrink-0"
        style={{
          background: 'var(--bg-inner)',
          color: 'var(--text-3)',
          border: '1px solid var(--border-default)',
        }}>
        <Clock size={14} strokeWidth={2.5} />
        {isBlocked ? 'Awaiting Your Action' : 'Awaiting EcoLunch Review'}
      </div>
    </div>
  )
}

// ─── Blockers panel ───────────────────────────────────────────

function BlockersPanel({ summary }: { summary: GoLiveSummaryViewModel }) {
  if (summary.blockers.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.04)' }}>
      <div className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: 'rgba(248,113,113,0.08)', borderBottom: '1px solid rgba(248,113,113,0.18)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <Rocket size={14} strokeWidth={1.8} style={{ color: '#f87171' }} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-black" style={{ color: '#f87171' }}>
            {summary.blockers.length} Go-Live Blocker{summary.blockers.length !== 1 ? 's' : ''} Detected
          </p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            Resolve each blocker before EcoLunch can activate your account.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-0">
        {summary.blockers.map((b, i) => (
          <div key={b.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{
              borderBottom: i < summary.blockers.length - 1 ? '1px solid rgba(248,113,113,0.10)' : 'none',
              borderRight: i % 2 === 0 && i < summary.blockers.length - 1 ? '1px solid rgba(248,113,113,0.10)' : 'none',
            }}>
            <XCircle size={13} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-snug truncate" style={{ color: 'var(--text-1)' }}>
                {b.title}
              </p>
              <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>{b.category}</p>
              {b.description && (
                <p className="text-[10.5px] mt-0.5" style={{ color: '#f87171' }}>{b.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Checklist progress bar ───────────────────────────────────

function ChecklistProgress({ summary }: { summary: GoLiveSummaryViewModel }) {
  const pct = summary.totals.total > 0 ? Math.round((summary.totals.passed / summary.totals.total) * 100) : 0

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-[11.5px] font-semibold" style={{ color: 'var(--text-3)' }}>
            {summary.totals.passed} of {summary.totals.total} checks passed
          </p>
          <span className="text-[12px] font-black" style={{ color: 'var(--accent)' }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Final readiness result ───────────────────────────────────

function FinalResult({ summary }: { summary: GoLiveSummaryViewModel }) {
  const state = readinessState(summary)
  const isBlocked = state === 'blocked'
  const isWarnings = state === 'ready-with-warnings'

  if (isBlocked) {
    return (
      <div className="rounded-2xl px-5 py-5"
        style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.25)' }}>
        <div className="flex items-start gap-3 mb-4">
          <XCircle size={18} strokeWidth={1.8} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[14px] font-black" style={{ color: '#f87171' }}>Go-Live Blocked</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {summary.totals.blockers} required item{summary.totals.blockers !== 1 ? 's' : ''} must be completed before EcoLunch can activate your account.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-3 rounded-xl flex-1 min-w-[120px] text-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <p className="text-[22px] font-black leading-none" style={{ color: '#f87171' }}>{summary.totals.blockers}</p>
            <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Blockers</p>
          </div>
          <div className="px-4 py-3 rounded-xl flex-1 min-w-[120px] text-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <p className="text-[22px] font-black leading-none" style={{ color: '#fbbf24' }}>{summary.totals.warnings}</p>
            <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Warnings</p>
          </div>
          <div className="px-4 py-3 rounded-xl flex-1 min-w-[120px] text-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <p className="text-[22px] font-black leading-none" style={{ color: '#4ade80' }}>{summary.totals.passed}</p>
            <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Passed</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl px-5 py-5 flex items-center gap-4 flex-wrap"
      style={{
        background: isWarnings ? 'rgba(251,191,36,0.05)' : 'rgba(74,222,128,0.05)',
        border: `1px solid ${isWarnings ? 'rgba(251,191,36,0.25)' : 'rgba(74,222,128,0.25)'}`,
      }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: isWarnings ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)',
          border: `1px solid ${isWarnings ? 'rgba(251,191,36,0.30)' : 'rgba(74,222,128,0.30)'}`,
        }}>
        {isWarnings
          ? <AlertTriangle size={20} strokeWidth={1.8} style={{ color: '#fbbf24' }} />
          : <CheckCircle2 size={20} strokeWidth={1.8} style={{ color: '#4ade80' }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-black" style={{ color: isWarnings ? '#fbbf24' : '#4ade80' }}>
          {isWarnings ? 'Ready — Minor Warnings Present' : 'All Checks Passed'}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
          {isWarnings
            ? `${summary.totals.warnings} item${summary.totals.warnings !== 1 ? 's' : ''} are under EcoLunch review but do not block go-live.`
            : 'Your onboarding is complete. EcoLunch will review and activate your account.'}
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Go-live
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        Go-live
      </h1>
    </div>
  )
}

export function CatererGolivePage() {
  const summaryQuery = useCatererGoliveSummary()
  const checklistQuery = useCatererGoliveChecklist()

  if (summaryQuery.isLoading || checklistQuery.isLoading) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <div className="px-5 py-10 text-center" style={{ color: 'var(--text-4)' }}>
          Loading Go-live status…
        </div>
      </div>
    )
  }

  if (summaryQuery.isError || checklistQuery.isError || !summaryQuery.data || !checklistQuery.data) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <div className="px-5 py-10 text-center" style={{ color: '#f87171' }}>
          Failed to load Go-live status.
        </div>
      </div>
    )
  }

  const summary = summaryQuery.data
  const sections = checklistQuery.data.sections.filter((s) => s.items.length > 0)
  const blockerCount = sections.reduce((n, s) => n + s.items.filter((i) => i.blocker).length, 0)

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Caterer Portal / Go-live
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Go-live
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Validation checklist generated from your activated modules and completed onboarding requirements.
        </p>
      </div>

      <PageTabs
        tabs={[
          { id: 'status', label: 'Status & Blockers', icon: <Rocket size={13} strokeWidth={1.8} />, badge: blockerCount > 0 ? blockerCount : undefined },
          { id: 'checklist', label: 'Validation Checklist', icon: <ClipboardList size={13} strokeWidth={1.8} />, badge: sections.length },
        ]}>
        {activeTab => (
          <div className="px-5 py-5 flex flex-col gap-5">

            {activeTab === 'status' && (
              <>
                <GoLiveStatusHero summary={summary} />
                <BlockersPanel summary={summary} />
                <ChecklistProgress summary={summary} />
              </>
            )}

            {activeTab === 'checklist' && (
              <>
                {sections.map(section => <SectionCard key={section.key} section={section} />)}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
                    Final Readiness Result
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
                </div>
                <FinalResult summary={summary} />
              </>
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
