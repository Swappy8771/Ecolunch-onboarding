import { useState } from 'react'
import {
  BookOpen, Baby, Tent, Calculator, FileBarChart2,
  CheckCircle2, Clock, AlertTriangle, XCircle, Lock,
  FileText, MessageCircle, Rocket, ClipboardEdit,
  ChevronDown, ChevronUp, Check, WifiOff, RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  useCatererActiveModules, useCatererModulesRequiredSetupOverview, useCatererModuleDetail,
} from '@/features/catererModulesRequiredSetup/hooks/useCatererModulesRequiredSetupQueries'
import { AccountingSettingsPanel } from '../components/AccountingSettingsPanel'
import { ReportiqSettingsPanel } from '../components/ReportiqSettingsPanel'
import { SchoolMealsSettingsPanel } from '../components/SchoolMealsSettingsPanel'
import { DaycareMealsSettingsPanel } from '../components/DaycareMealsSettingsPanel'
import { CampMealsSettingsPanel } from '../components/CampMealsSettingsPanel'
import type {
  ModuleKey, ModuleSetupSummaryViewModel, ModuleDetailViewModel, SetupItemStatus,
} from '@/features/catererModulesRequiredSetup/types/catererModulesRequiredSetup.types'

/**
 * Real, tenant-scoped data via `/caterer/modules-required-setup/*` — read-only
 * reflection of module activation/pricing decided exclusively in the Admin
 * "Modules, Pricing & Configurations" screen. No activation toggle, no
 * pricing field, and no "mark complete" action exist here by design; every
 * underlying write happens in Establishments, Menus & Packages, or Document
 * Vault and flows back into this page's progress display.
 */

const MODULE_ICON: Record<ModuleKey, LucideIcon> = {
  school_meals: BookOpen,
  daycare_meals: Baby,
  camp_meals: Tent,
  accounting: Calculator,
  reportiq: FileBarChart2,
}

const MODULE_ACCENT: Record<ModuleKey, string> = {
  school_meals: '#4ade80',
  daycare_meals: '#60a5fa',
  camp_meals: '#c084fc',
  accounting: '#fb923c',
  reportiq: '#a3e635',
}

const ALL_MODULE_KEYS: ModuleKey[] = ['school_meals', 'daycare_meals', 'camp_meals', 'accounting', 'reportiq']

const SETUP_META: Record<SetupItemStatus, { color: string; bg: string; border: string; Icon: LucideIcon; label: string }> = {
  complete: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)',  Icon: CheckCircle2,  label: 'Complete' },
  pending:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)',  Icon: Clock,         label: 'Pending'  },
  missing:  { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', Icon: AlertTriangle, label: 'Missing'  },
  blocked:  { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', Icon: XCircle,       label: 'Blocked'  },
}

const DOC_META: Record<string, { color: string; label: string }> = {
  approved: { color: '#4ade80', label: 'Approved' },
  uploaded: { color: '#60a5fa', label: 'Uploaded' },
  under_review: { color: '#fbbf24', label: 'Under Review' },
  correction_requested: { color: '#fb923c', label: 'Correction Requested' },
  rejected: { color: '#f87171', label: 'Rejected' },
  missing: { color: '#f87171', label: 'Missing' },
}

const CORR_META: Record<string, { color: string; label: string }> = {
  open: { color: '#f87171', label: 'Open' },
  in_progress: { color: '#fbbf24', label: 'In Progress' },
  resolved: { color: '#4ade80', label: 'Resolved' },
  closed: { color: 'var(--text-4)', label: 'Closed' },
}

const PRIORITY_COLOR: Record<string, string> = { high: '#f87171', medium: '#fbbf24', low: '#60a5fa' }

const LOOP_META: Record<string, { color: string; label: string }> = {
  open: { color: '#60a5fa', label: 'Open' },
  waiting: { color: '#fbbf24', label: 'Waiting' },
  resolved: { color: '#4ade80', label: 'Resolved' },
}

function metaFor<T extends { color: string; label: string }>(map: Record<string, T>, key: string, fallback: T): T {
  return map[key] ?? fallback
}

// ─── Loading / error states ───────────────────────────────────

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-24 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
      ))}
    </div>
  )
}

function PageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <WifiOff size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your setup status</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Check your connection and retry.</p>
      </div>
      <button onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <RefreshCw size={13} strokeWidth={2} />Retry
      </button>
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────

function SmallBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[10px] font-bold px-1.5 py-px rounded"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10.5px] uppercase tracking-[0.13em] font-black mb-2" style={{ color: 'var(--text-4)' }}>
      {label}
    </p>
  )
}

function EmptyRow({ label }: { label: string }) {
  return <p className="text-[11.5px] italic py-1" style={{ color: 'var(--text-4)' }}>No {label}</p>
}

// ─── Setup checklist ──────────────────────────────────────────

function SetupChecklist({ items }: { items: ModuleDetailViewModel['checklist'] }) {
  if (items.length === 0) return <EmptyRow label="checklist items" />
  return (
    <div className="flex flex-col">
      {items.map((item, idx) => {
        const m = SETUP_META[item.status]
        return (
          <div key={item.key} className="flex items-start gap-3 py-3"
            style={{ borderBottom: idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: m.bg, border: `1px solid ${m.border}` }}>
              <m.Icon size={11} strokeWidth={2.5} style={{ color: m.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>{item.label}</p>
                {!item.required && (
                  <span className="text-[10px] font-bold px-1.5 py-px rounded"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                    Optional
                  </span>
                )}
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
              <m.Icon size={9} strokeWidth={2.5} />{m.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Module sidebar panels ────────────────────────────────────

function MissingPanel({ items }: { items: ModuleDetailViewModel['missingItems'] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
        style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.20)' }}>
        <Check size={12} strokeWidth={2.5} style={{ color: '#4ade80', flexShrink: 0 }} />
        <p className="text-[11.5px] font-semibold" style={{ color: '#4ade80' }}>No missing items</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {items.map(item => (
        <div key={item.key} className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
          <AlertTriangle size={11} strokeWidth={2} style={{ color: '#f87171', marginTop: 1, flexShrink: 0 }} />
          <p className="text-[11.5px] font-semibold leading-snug" style={{ color: 'var(--text-2)' }}>{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function DocsPanel({ docs }: { docs: ModuleDetailViewModel['linkedDocuments'] }) {
  if (docs.length === 0) return <EmptyRow label="linked documents" />
  return (
    <div className="flex flex-col gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
      {docs.map((doc, i) => {
        const m = metaFor(DOC_META, doc.status, { color: 'var(--text-4)', label: doc.status })
        return (
          <div key={doc.key} className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ borderBottom: i < docs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <FileText size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
            <p className="text-[11.5px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--text-3)' }}>{doc.label}</p>
            <SmallBadge label={m.label} color={m.color} />
          </div>
        )
      })}
    </div>
  )
}

function CorrectionsPanel({ corrections }: { corrections: ModuleDetailViewModel['linkedCorrections'] }) {
  if (corrections.length === 0) return <EmptyRow label="corrections" />
  return (
    <div className="flex flex-col gap-1.5">
      {corrections.map(c => {
        const cm = metaFor(CORR_META, c.status, { color: 'var(--text-4)', label: c.status })
        return (
          <div key={c.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <ClipboardEdit size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', marginTop: 1, flexShrink: 0 }} />
            <p className="text-[11.5px] font-medium flex-1 min-w-0 leading-snug" style={{ color: 'var(--text-3)' }}>{c.description}</p>
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[c.priority] ?? 'var(--text-4)' }} />
              <SmallBadge label={cm.label} color={cm.color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BlockersPanel({ blockers }: { blockers: string[] }) {
  if (blockers.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
        style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.20)' }}>
        <Check size={12} strokeWidth={2.5} style={{ color: '#4ade80', flexShrink: 0 }} />
        <p className="text-[11.5px] font-semibold" style={{ color: '#4ade80' }}>No go-live blockers</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {blockers.map(b => (
        <div key={b} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
          style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
          <Rocket size={11} strokeWidth={2} style={{ color: '#f87171', marginTop: 1, flexShrink: 0 }} />
          <p className="text-[11.5px] font-semibold flex-1 min-w-0 leading-snug" style={{ color: 'var(--text-2)' }}>{b}</p>
        </div>
      ))}
    </div>
  )
}

function EcoLoopPanel({ conversations }: { conversations: ModuleDetailViewModel['linkedEcoLoopConversations'] }) {
  if (conversations.length === 0) return <EmptyRow label="EcoLoop conversations" />
  return (
    <div className="flex flex-col gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
      {conversations.map((c, i) => {
        const lm = metaFor(LOOP_META, c.status, { color: 'var(--text-4)', label: c.status })
        return (
          <div key={c.id} className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ borderBottom: i < conversations.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <MessageCircle size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
            <p className="text-[11.5px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--text-3)' }}>{c.subject}</p>
            <SmallBadge label={lm.label} color={lm.color} />
          </div>
        )
      })}
    </div>
  )
}

// ─── Module sidebar (right column) ───────────────────────────

function ModuleSidebar({ detail }: { detail: ModuleDetailViewModel }) {
  const panels = [
    { label: 'Missing Items', content: <MissingPanel items={detail.missingItems} /> },
    { label: 'Linked Documents', content: <DocsPanel docs={detail.linkedDocuments} /> },
    { label: 'Linked Corrections', content: <CorrectionsPanel corrections={detail.linkedCorrections} /> },
    { label: 'Linked Go-Live Blockers', content: <BlockersPanel blockers={detail.linkedGoLiveBlockers} /> },
    { label: 'Linked EcoLoop Conversations', content: <EcoLoopPanel conversations={detail.linkedEcoLoopConversations} /> },
  ]
  return (
    <div className="flex flex-col gap-4 px-5 py-5 border-t lg:border-t-0 lg:border-l" style={{ borderColor: 'var(--border-subtle)' }}>
      {panels.map(p => (
        <div key={p.label}>
          <SectionLabel label={p.label} />
          {p.content}
        </div>
      ))}
    </div>
  )
}

// ─── Module card ──────────────────────────────────────────────

function ModuleCard({ summary }: { summary: ModuleSetupSummaryViewModel }) {
  const [open, setOpen] = useState(summary.missingCount > 0 || summary.blockerCount > 0)
  const detailQuery = useCatererModuleDetail(summary.moduleKey, open)
  const Icon = MODULE_ICON[summary.moduleKey]
  const accent = MODULE_ACCENT[summary.moduleKey]

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${accent}` }}>

      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 px-5 py-4 cursor-pointer text-left"
        style={{ background: 'var(--bg-inner)', borderBottom: open ? '1px solid var(--border-default)' : 'none' }}>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}>
          <Icon size={15} strokeWidth={1.8} style={{ color: accent }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-[14px] font-black" style={{ color: 'var(--text-1)' }}>{summary.label}</p>
            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} />Active
            </span>
            {summary.blockerCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                <Rocket size={8} strokeWidth={2.5} />{summary.blockerCount} blocker{summary.blockerCount > 1 ? 's' : ''}
              </span>
            )}
            {summary.conversationCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                <MessageCircle size={8} strokeWidth={2.5} />{summary.conversationCount} conversation{summary.conversationCount > 1 ? 's' : ''}
              </span>
            )}
            {summary.correctionCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                <ClipboardEdit size={8} strokeWidth={2.5} />{summary.correctionCount} correction{summary.correctionCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-1" style={{ minWidth: 100 }}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-bold" style={{ color: summary.completionPercentage === 100 ? '#4ade80' : 'var(--text-3)' }}>
                {summary.completionPercentage}%
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{summary.completedCount}/{summary.totalCount} done</span>
            </div>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${summary.completionPercentage}%`, background: summary.completionPercentage === 100 ? '#4ade80' : accent }} />
            </div>
          </div>
        </div>

        {summary.missingCount > 0 && (
          <span className="hidden md:inline text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            {summary.missingCount} missing
          </span>
        )}
        {summary.missingCount === 0 && summary.completionPercentage === 100 && (
          <span className="hidden md:inline text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
            Complete
          </span>
        )}

        {open
          ? <ChevronUp size={15} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          : <ChevronDown size={15} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />}
      </button>

      {open && (
        <div className="grid lg:grid-cols-[3fr_2fr]">
          <div className="px-5 py-5">
            {summary.moduleKey === 'school_meals' && <SchoolMealsSettingsPanel />}
            {summary.moduleKey === 'daycare_meals' && <DaycareMealsSettingsPanel />}
            {summary.moduleKey === 'camp_meals' && <CampMealsSettingsPanel />}
            {summary.moduleKey === 'accounting' && <AccountingSettingsPanel />}
            {summary.moduleKey === 'reportiq' && <ReportiqSettingsPanel />}
            <SectionLabel label={`Required Setup — ${summary.completedCount} of ${summary.totalCount} complete`} />
            {detailQuery.isLoading && <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>Loading…</p>}
            {detailQuery.data && <SetupChecklist items={detailQuery.data.checklist} />}
          </div>
          {detailQuery.data && <ModuleSidebar detail={detailQuery.data} />}
        </div>
      )}
    </div>
  )
}

// ─── Inactive module stub ─────────────────────────────────────

function InactiveModuleStub({ moduleKey, label }: { moduleKey: ModuleKey; label: string }) {
  const Icon = MODULE_ICON[moduleKey]
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--border-strong)', opacity: 0.65 }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
        <Icon size={15} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-black" style={{ color: 'var(--text-3)' }}>{label}</p>
        <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
          Required setup for this module will appear once it is activated.
        </p>
      </div>
      <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
        style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
        <Lock size={9} strokeWidth={2.5} />Not Activated
      </span>
    </div>
  )
}

// ─── Overall summary bar ──────────────────────────────────────

function OverallSummary({ modules }: { modules: ModuleSetupSummaryViewModel[] }) {
  const done = modules.reduce((s, m) => s + m.completedCount, 0)
  const total = modules.reduce((s, m) => s + m.totalCount, 0)
  const pct = total > 0 ? Math.round((done / total) * 100) : 100
  const blockers = modules.reduce((s, m) => s + m.blockerCount, 0)
  const corrections = modules.reduce((s, m) => s + m.correctionCount, 0)
  const missing = modules.reduce((s, m) => s + m.missingCount, 0)
  const conversations = modules.reduce((s, m) => s + m.conversationCount, 0)

  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{pct}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Complete</p>
      </div>
      <div className="flex-1 min-w-[160px] flex flex-col gap-2">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          {done} of {total} required setup items complete across {modules.length} active module{modules.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {blockers > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <Rocket size={10} strokeWidth={2.5} />{blockers} Blocker{blockers > 1 ? 's' : ''}
          </span>
        )}
        {missing > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertTriangle size={10} strokeWidth={2.5} />{missing} Missing
          </span>
        )}
        {corrections > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <ClipboardEdit size={10} strokeWidth={2.5} />{corrections} Open Correction{corrections > 1 ? 's' : ''}
          </span>
        )}
        {conversations > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
            <MessageCircle size={10} strokeWidth={2.5} />{conversations} Conversation{conversations > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

const MODULE_LABELS: Record<ModuleKey, string> = {
  school_meals: 'School Meals',
  daycare_meals: 'Daycare / CPE Meals',
  camp_meals: 'Camp Meals',
  accounting: 'Accounting',
  reportiq: 'ReportIQ',
}

// ─── Page ─────────────────────────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Modules &amp; Required Setup
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        Modules &amp; Required Setup
      </h1>
    </div>
  )
}

export function CatererModulesPage() {
  const activeModulesQuery = useCatererActiveModules(undefined)
  const overviewQuery = useCatererModulesRequiredSetupOverview(undefined)

  if (activeModulesQuery.isLoading || overviewQuery.isLoading) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  }
  if (activeModulesQuery.isError || overviewQuery.isError || !activeModulesQuery.data || !overviewQuery.data) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <PageError onRetry={() => { activeModulesQuery.refetch(); overviewQuery.refetch() }} />
      </div>
    )
  }

  const flags = activeModulesQuery.data
  const activeSummaries = overviewQuery.data.modules
  const inactiveKeys = ALL_MODULE_KEYS.filter(key => {
    const flagKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()) as keyof typeof flags
    return !flags[flagKey]
  })

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Caterer Portal / Modules &amp; Required Setup
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Modules &amp; Required Setup
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Required onboarding setup items, linked documents, corrections, blockers, and conversations per active module.
        </p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        <OverallSummary modules={activeSummaries} />

        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
            Active Modules — {activeSummaries.length}
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
        </div>

        {activeSummaries.map(summary => <ModuleCard key={summary.moduleKey} summary={summary} />)}

        {inactiveKeys.length > 0 && (
          <>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color: 'var(--text-4)' }}>
                Inactive Modules — {inactiveKeys.length}
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            </div>
            {inactiveKeys.map(key => <InactiveModuleStub key={key} moduleKey={key} label={MODULE_LABELS[key]} />)}
          </>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
