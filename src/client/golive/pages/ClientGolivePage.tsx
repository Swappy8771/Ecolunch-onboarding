import { useState } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import {
  CheckCircle2, XCircle, AlertTriangle,
  Rocket, ShieldCheck, Scale, Building2,
  FilePen, BookOpen, Baby, Calculator, FileBarChart2,
  ClipboardList, ChevronDown, ChevronUp, Send,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

type CheckStatus  = 'passed' | 'failed' | 'warning'
type ReadyState   = 'blocked' | 'ready' | 'ready-with-warnings'

interface CheckItem {
  id: string
  label: string
  detail: string | null
  status: CheckStatus
  blocking: boolean
}

interface CheckGroup {
  id: string
  title: string
  Icon: LucideIcon
  accent: string
  moduleLabel: string | null   // null = base requirement, string = module name
  checks: CheckItem[]
}

// ─── Checklist data ───────────────────────────────────────────

const CHECK_GROUPS: CheckGroup[] = [
  {
    id: 'documents',
    title: 'Documents & Compliance',
    Icon: ShieldCheck, accent: '#fbbf24', moduleLabel: null,
    checks: [
      { id: 'doc1',  label: 'KBIS Extract',                   detail: null,                              status: 'passed',  blocking: true  },
      { id: 'doc2',  label: 'Proof of Good Standing',          detail: 'Document not yet uploaded',       status: 'failed',  blocking: true  },
      { id: 'doc3',  label: 'HACCP Certification',             detail: null,                              status: 'passed',  blocking: true  },
      { id: 'doc4',  label: 'Environmental Compliance Permit', detail: 'Document not yet uploaded',       status: 'failed',  blocking: true  },
      { id: 'doc5',  label: 'Allergen Management Policy',      detail: 'Document not yet uploaded',       status: 'failed',  blocking: true  },
      { id: 'doc6',  label: 'Public Liability Insurance',      detail: null,                              status: 'passed',  blocking: true  },
      { id: 'doc7',  label: 'Articles of Association',         detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
      { id: 'doc8',  label: 'Health Inspection Certificate',   detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
      { id: 'doc9',  label: 'Professional Indemnity Insurance',detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
    ],
  },
  {
    id: 'banking',
    title: 'Banking Information',
    Icon: Building2, accent: '#4ade80', moduleLabel: null,
    checks: [
      { id: 'bk1', label: 'RIB — Relevé d\'Identité Bancaire',   detail: null,                              status: 'passed',  blocking: true  },
      { id: 'bk2', label: 'Banking Authorization Letter',          detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
      { id: 'bk3', label: 'Bank Statement — Last 3 Months',        detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
    ],
  },
  {
    id: 'contracts',
    title: 'Contracts & Signatures',
    Icon: FilePen, accent: '#c084fc', moduleLabel: null,
    checks: [
      { id: 'ct1', label: 'Non-Disclosure Agreement',              detail: null,                              status: 'passed',  blocking: true  },
      { id: 'ct2', label: 'EcoLunch Platform Terms & Conditions',  detail: null,                              status: 'passed',  blocking: true  },
      { id: 'ct3', label: 'Master Service Agreement',              detail: 'Pending signature',               status: 'failed',  blocking: true  },
      { id: 'ct4', label: 'Data Processing Agreement (DPA)',       detail: 'Pending signature',               status: 'failed',  blocking: true  },
      { id: 'ct5', label: 'Food Safety Compliance Declaration',    detail: 'Pending signature',               status: 'failed',  blocking: true  },
      { id: 'ct6', label: 'Service Level Agreement (SLA)',         detail: 'Pending signature',               status: 'failed',  blocking: false },
    ],
  },
  {
    id: 'legal',
    title: 'Legal Documents',
    Icon: Scale, accent: '#60a5fa', moduleLabel: null,
    checks: [
      { id: 'lg1', label: 'KBIS Extract — Banking Copy',           detail: null,                              status: 'passed',  blocking: true  },
      { id: 'lg2', label: 'VAT Registration Certificate',          detail: null,                              status: 'passed',  blocking: true  },
      { id: 'lg3', label: 'Company Registration Certificate',      detail: null,                              status: 'passed',  blocking: true  },
      { id: 'lg4', label: 'Government-issued ID — Primary Contact',detail: null,                              status: 'passed',  blocking: true  },
    ],
  },
  {
    id: 'school-meals',
    title: 'School Meals — Module Setup',
    Icon: BookOpen, accent: '#4ade80', moduleLabel: 'School Meals',
    checks: [
      { id: 'sm1', label: 'Schools & CSS districts registered',    detail: null,                              status: 'passed',  blocking: true  },
      { id: 'sm2', label: 'School contacts added',                 detail: null,                              status: 'passed',  blocking: true  },
      { id: 'sm3', label: 'School menus uploaded & reviewed',      detail: null,                              status: 'passed',  blocking: true  },
      { id: 'sm4', label: 'Rotating Cycle document',               detail: 'Document not yet uploaded',       status: 'failed',  blocking: true  },
      { id: 'sm5', label: 'Allergen Protocol — Schools',           detail: 'Document not uploaded (open correction)', status: 'failed', blocking: true },
      { id: 'sm6', label: 'Nutritional Standards Compliance',      detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
      { id: 'sm7', label: 'School Closure Calendars complete',     detail: '1 of 4 school calendars missing', status: 'warning', blocking: false },
    ],
  },
  {
    id: 'daycare',
    title: 'Daycare / CPE — Module Setup',
    Icon: Baby, accent: '#60a5fa', moduleLabel: 'Daycare / CPE',
    checks: [
      { id: 'dc1', label: 'Daycares & CPEs registered',            detail: null,                              status: 'passed',  blocking: true  },
      { id: 'dc2', label: 'DDASS Certification',                   detail: null,                              status: 'passed',  blocking: true  },
      { id: 'dc3', label: 'Daycare menus uploaded & reviewed',     detail: null,                              status: 'passed',  blocking: true  },
      { id: 'dc4', label: 'Infant Nutrition Protocol',             detail: 'Document not uploaded (open correction)', status: 'failed', blocking: true },
      { id: 'dc5', label: 'CPE Menu Approval',                     detail: 'Awaiting EcoLunch validation',    status: 'failed',  blocking: false },
      { id: 'dc6', label: 'Daycare Closure Calendars complete',    detail: '2 of 3 daycare calendars missing',status: 'warning', blocking: false },
    ],
  },
  {
    id: 'accounting',
    title: 'Accounting — Module Setup',
    Icon: Calculator, accent: '#fb923c', moduleLabel: 'Accounting',
    checks: [
      { id: 'ac1', label: 'VAT Registration confirmed',            detail: null,                              status: 'passed',  blocking: true  },
      { id: 'ac2', label: 'SIRET verified',                        detail: null,                              status: 'passed',  blocking: true  },
      { id: 'ac3', label: 'Annual Financial Report',               detail: 'Document not yet uploaded',       status: 'failed',  blocking: true  },
      { id: 'ac4', label: 'Tax Clearance Certificate',             detail: 'Under EcoLunch review',           status: 'warning', blocking: false },
    ],
  },
  {
    id: 'reportiq',
    title: 'ReportIQ — Module Setup',
    Icon: FileBarChart2, accent: '#a3e635', moduleLabel: 'ReportIQ',
    checks: [
      { id: 'rq1', label: 'Q3 2025 Compliance Report submitted',   detail: null,                              status: 'passed',  blocking: true  },
      { id: 'rq2', label: 'Incident reporting configured',         detail: null,                              status: 'passed',  blocking: true  },
      { id: 'rq3', label: 'ReportIQ account setup complete',       detail: null,                              status: 'passed',  blocking: true  },
      { id: 'rq4', label: 'Data Export Authorization',             detail: 'Pending sign-off',                status: 'warning', blocking: false },
    ],
  },
  {
    id: 'corrections',
    title: 'Open Corrections',
    Icon: ClipboardList, accent: '#f87171', moduleLabel: null,
    checks: [
      { id: 'corr1', label: 'Allergen Protocol — format correction open',          detail: 'Must be fixed and resubmitted', status: 'failed', blocking: true },
      { id: 'corr2', label: 'Rotating Cycle — file format correction open',        detail: 'Must be fixed and resubmitted', status: 'failed', blocking: true },
      { id: 'corr3', label: 'Annual Financial Report — format correction open',    detail: 'Must be fixed and resubmitted', status: 'failed', blocking: true },
      { id: 'corr4', label: 'Infant Nutrition Protocol — labels correction open',  detail: 'Must be fixed and resubmitted', status: 'failed', blocking: true },
      { id: 'corr5', label: 'Banking Authorization Letter — signature missing',    detail: 'Must be fixed and resubmitted', status: 'failed', blocking: true },
    ],
  },
]

// ─── Check status meta ────────────────────────────────────────

const CHECK_META: Record<CheckStatus, { color: string; bg: string; border: string; Icon: LucideIcon; label: string }> = {
  passed:  { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)',  Icon: CheckCircle2,  label: 'Passed'  },
  failed:  { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', Icon: XCircle,       label: 'Failed'  },
  warning: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)',  Icon: AlertTriangle, label: 'Warning' },
}

// ─── Compute readiness ────────────────────────────────────────

function computeReadiness(groups: CheckGroup[]): {
  state: ReadyState
  blockerCount: number
  warningCount: number
  passedCount: number
  totalCount: number
  failedBlockers: { group: string; item: CheckItem }[]
} {
  const allChecks = groups.flatMap(g => g.checks.map(c => ({ group: g.title, item: c })))
  const failedBlockers = allChecks.filter(({ item }) => item.blocking && item.status === 'failed')
  const warnings       = allChecks.filter(({ item }) => item.status === 'warning')
  const passed         = allChecks.filter(({ item }) => item.status === 'passed')

  let state: ReadyState = 'ready'
  if (failedBlockers.length > 0)           state = 'blocked'
  else if (warnings.length > 0)            state = 'ready-with-warnings'

  return {
    state,
    blockerCount: failedBlockers.length,
    warningCount: warnings.length,
    passedCount:  passed.length,
    totalCount:   allChecks.length,
    failedBlockers,
  }
}

// ─── Group stats ──────────────────────────────────────────────

function groupStats(group: CheckGroup) {
  const passed  = group.checks.filter(c => c.status === 'passed').length
  const failed  = group.checks.filter(c => c.status === 'failed').length
  const warning = group.checks.filter(c => c.status === 'warning').length
  const hasBlockingFailure = group.checks.some(c => c.blocking && c.status === 'failed')
  const overallStatus: CheckStatus =
    hasBlockingFailure ? 'failed' : failed > 0 ? 'failed' : warning > 0 ? 'warning' : 'passed'
  return { passed, failed, warning, total: group.checks.length, overallStatus }
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

function CheckRow({ item, last }: { item: CheckItem; last: boolean }) {
  const m = CHECK_META[item.status]
  return (
    <div className="flex items-start gap-3 py-3"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      {/* Status icon */}
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: m.bg, border: `1px solid ${m.border}` }}>
        <m.Icon size={11} strokeWidth={2.5} style={{ color: m.color }} />
      </div>
      {/* Label + detail */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
          {item.label}
          {item.blocking && item.status === 'failed' && (
            <span className="ml-1.5 text-[9.5px] font-black px-1.5 py-px rounded uppercase tracking-wide"
              style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.30)', verticalAlign: 'middle' }}>
              Blocker
            </span>
          )}
        </p>
        {item.detail && (
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{item.detail}</p>
        )}
      </div>
      {/* Status badge — desktop */}
      <span className="hidden sm:flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
        <m.Icon size={9} strokeWidth={2.5} />{m.label}
      </span>
    </div>
  )
}

// ─── Check group card ─────────────────────────────────────────

function CheckGroupCard({ group }: { group: CheckGroup }) {
  const stats = groupStats(group)
  const sm    = CHECK_META[stats.overallStatus]
  const [open, setOpen] = useState(stats.overallStatus !== 'passed')

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${sm.color}`,
      }}>
      {/* Group header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
        style={{ background: 'var(--bg-inner)', borderBottom: open ? '1px solid var(--border-default)' : 'none' }}>

        {/* Icon */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${group.accent}18`, border: `1px solid ${group.accent}35` }}>
          <group.Icon size={14} strokeWidth={1.8} style={{ color: group.accent }} />
        </div>

        {/* Title + module tag */}
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <p className="text-[13px] font-black" style={{ color: 'var(--text-1)' }}>{group.title}</p>
          {group.moduleLabel && (
            <span className="text-[10px] font-bold px-1.5 py-px rounded"
              style={{ background: `${group.accent}18`, color: group.accent, border: `1px solid ${group.accent}30` }}>
              {group.moduleLabel}
            </span>
          )}
        </div>

        {/* Counters */}
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

        {/* Overall status badge */}
        <Badge {...sm} label={sm.label} />

        {open
          ? <ChevronUp   size={14} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          : <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />}
      </button>

      {/* Check rows */}
      {open && (
        <div className="px-5">
          {group.checks.map((item, idx) => (
            <CheckRow key={item.id} item={item} last={idx === group.checks.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Go-Live Status Hero ──────────────────────────────────────

function GoLiveStatusHero({ result }: { result: ReturnType<typeof computeReadiness> }) {
  const isBlocked  = result.state === 'blocked'
  const isWarnings = result.state === 'ready-with-warnings'

  const bg      = isBlocked  ? 'rgba(248,113,113,0.06)'  : isWarnings ? 'rgba(251,191,36,0.06)'  : 'rgba(74,222,128,0.06)'
  const border  = isBlocked  ? 'rgba(248,113,113,0.28)'  : isWarnings ? 'rgba(251,191,36,0.28)'  : 'rgba(74,222,128,0.28)'
  const accent  = isBlocked  ? '#f87171'                  : isWarnings ? '#fbbf24'                 : '#4ade80'
  const icon    = isBlocked  ? <XCircle       size={28} strokeWidth={1.5} style={{ color: accent }} />
                : isWarnings ? <AlertTriangle size={28} strokeWidth={1.5} style={{ color: accent }} />
                :              <CheckCircle2  size={28} strokeWidth={1.5} style={{ color: accent }} />
  const title   = isBlocked  ? 'Go-Live Blocked'
                : isWarnings ? 'Ready — Minor Warnings'
                :              'Ready for Go-Live'
  const sub     = isBlocked
    ? `${result.blockerCount} blocker${result.blockerCount > 1 ? 's' : ''} must be resolved before go-live can be requested`
    : isWarnings
    ? `All required items passed. ${result.warningCount} non-blocking item${result.warningCount > 1 ? 's' : ''} still under review`
    : 'All required onboarding checks have passed. You may request go-live activation.'

  return (
    <div className="rounded-2xl px-6 py-6 flex items-center gap-5 flex-wrap"
      style={{ background: bg, border: `1px solid ${border}` }}>
      {/* Animated icon circle */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `2px solid ${accent}40` }}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[20px] font-black leading-tight" style={{ color: accent }}>{title}</p>
        <p className="text-[12.5px] mt-1 leading-relaxed" style={{ color: 'var(--text-3)' }}>{sub}</p>

        {/* Progress pills */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
            <CheckCircle2 size={11} strokeWidth={2.5} />{result.passedCount} Passed
          </span>
          {result.blockerCount > 0 && (
            <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              <XCircle size={11} strokeWidth={2.5} />{result.blockerCount} Blocking
            </span>
          )}
          {result.warningCount > 0 && (
            <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(251,191,36,0.10)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
              <AlertTriangle size={11} strokeWidth={2.5} />{result.warningCount} Warnings
            </span>
          )}
          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>
            {result.totalCount} total checks
          </span>
        </div>
      </div>

      {/* Request CTA */}
      <button
        disabled={isBlocked}
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-black shrink-0 transition-opacity"
        style={{
          background: isBlocked ? 'var(--bg-inner)' : 'var(--accent)',
          color:      isBlocked ? 'var(--text-4)'   : '#07070a',
          border:     `1px solid ${isBlocked ? 'var(--border-default)' : 'transparent'}`,
          cursor:     isBlocked ? 'not-allowed' : 'pointer',
          opacity:    isBlocked ? 0.55 : 1,
        }}>
        <Send size={14} strokeWidth={2.5} />
        Request Go-Live
      </button>
    </div>
  )
}

// ─── Blockers panel ───────────────────────────────────────────

function BlockersPanel({ failedBlockers }: { failedBlockers: { group: string; item: CheckItem }[] }) {
  if (failedBlockers.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.04)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: 'rgba(248,113,113,0.08)', borderBottom: '1px solid rgba(248,113,113,0.18)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <Rocket size={14} strokeWidth={1.8} style={{ color: '#f87171' }} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-black" style={{ color: '#f87171' }}>
            {failedBlockers.length} Go-Live Blocker{failedBlockers.length > 1 ? 's' : ''} Detected
          </p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            Resolve each blocker before requesting go-live.
          </p>
        </div>
      </div>

      {/* Blocker rows */}
      <div className="grid sm:grid-cols-2 gap-0">
        {failedBlockers.map(({ group, item }, i) => (
          <div key={item.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{
              borderBottom: i < failedBlockers.length - 1 ? '1px solid rgba(248,113,113,0.10)' : 'none',
              borderRight:  i % 2 === 0 && i < failedBlockers.length - 1 ? '1px solid rgba(248,113,113,0.10)' : 'none',
            }}>
            <XCircle size={13} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-snug truncate" style={{ color: 'var(--text-1)' }}>
                {item.label}
              </p>
              <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>{group}</p>
              {item.detail && (
                <p className="text-[10.5px] mt-0.5" style={{ color: '#f87171' }}>{item.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Checklist progress bar ───────────────────────────────────

function ChecklistProgress({ result }: { result: ReturnType<typeof computeReadiness> }) {
  const pct = result.totalCount > 0
    ? Math.round((result.passedCount / result.totalCount) * 100)
    : 0

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-[11.5px] font-semibold" style={{ color: 'var(--text-3)' }}>
            {result.passedCount} of {result.totalCount} checks passed
          </p>
          <span className="text-[12px] font-black" style={{ color: 'var(--accent)' }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          {/* Passed segment */}
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Final readiness result ───────────────────────────────────

function FinalResult({ result }: { result: ReturnType<typeof computeReadiness> }) {
  const isBlocked  = result.state === 'blocked'
  const isWarnings = result.state === 'ready-with-warnings'

  if (isBlocked) {
    return (
      <div className="rounded-2xl px-5 py-5"
        style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.25)' }}>
        <div className="flex items-start gap-3 mb-4">
          <XCircle size={18} strokeWidth={1.8} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[14px] font-black" style={{ color: '#f87171' }}>Go-Live Blocked</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {result.blockerCount} required item{result.blockerCount > 1 ? 's' : ''} must be completed before EcoLunch can activate your account.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-3 rounded-xl flex-1 min-w-[120px] text-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <p className="text-[22px] font-black leading-none" style={{ color: '#f87171' }}>{result.blockerCount}</p>
            <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Blockers</p>
          </div>
          <div className="px-4 py-3 rounded-xl flex-1 min-w-[120px] text-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <p className="text-[22px] font-black leading-none" style={{ color: '#fbbf24' }}>{result.warningCount}</p>
            <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Warnings</p>
          </div>
          <div className="px-4 py-3 rounded-xl flex-1 min-w-[120px] text-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <p className="text-[22px] font-black leading-none" style={{ color: '#4ade80' }}>{result.passedCount}</p>
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
        border:     `1px solid ${isWarnings ? 'rgba(251,191,36,0.25)' : 'rgba(74,222,128,0.25)'}`,
      }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: isWarnings ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)',
          border:     `1px solid ${isWarnings ? 'rgba(251,191,36,0.30)' : 'rgba(74,222,128,0.30)'}`,
        }}>
        {isWarnings
          ? <AlertTriangle size={20} strokeWidth={1.8} style={{ color: '#fbbf24' }} />
          : <CheckCircle2  size={20} strokeWidth={1.8} style={{ color: '#4ade80' }} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-black" style={{ color: isWarnings ? '#fbbf24' : '#4ade80' }}>
          {isWarnings ? 'Ready — Minor Warnings Present' : 'All Checks Passed'}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
          {isWarnings
            ? `${result.warningCount} item${result.warningCount > 1 ? 's' : ''} are under EcoLunch review but do not block go-live.`
            : 'Your onboarding is complete. Click Request Go-Live above to activate your account.'}
        </p>
      </div>
      <button
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-black shrink-0 transition-opacity hover:opacity-90"
        style={{ background: 'var(--accent)', color: '#07070a' }}>
        <Send size={14} strokeWidth={2.5} />Request Go-Live
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientGolivePage() {
  const result = computeReadiness(CHECK_GROUPS)

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Header ────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Client Portal / Go-live
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
          { id: 'status',    label: 'Status & Blockers',    icon: <Rocket size={13} strokeWidth={1.8} />, badge: result.failedBlockers.length > 0 ? result.failedBlockers.length : undefined },
          { id: 'checklist', label: 'Validation Checklist', icon: <ClipboardList size={13} strokeWidth={1.8} />, badge: CHECK_GROUPS.length },
        ]}>
        {activeTab => (
          <div className="px-5 py-5 flex flex-col gap-5">

            {activeTab === 'status' && (
              <>
                <GoLiveStatusHero result={result} />
                <BlockersPanel failedBlockers={result.failedBlockers} />
                <ChecklistProgress result={result} />
              </>
            )}

            {activeTab === 'checklist' && (
              <>
                {CHECK_GROUPS.map(group => <CheckGroupCard key={group.id} group={group} />)}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
                    Final Readiness Result
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
                </div>
                <FinalResult result={result} />
              </>
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
