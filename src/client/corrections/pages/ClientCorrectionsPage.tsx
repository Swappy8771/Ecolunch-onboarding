import { useState } from 'react'
import {
  CheckCircle2, AlertTriangle, RefreshCcw, XCircle,
  Rocket, Wrench, Send, Eye, ChevronDown, ChevronUp,
  Upload, FilePen,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────

type CorrectionStatus   = 'open' | 'resubmitted' | 'closed'
type CorrectionPriority = 'critical' | 'high' | 'medium' | 'low'
type FixType            = 'upload' | 'update'

interface Correction {
  id: string
  item: string
  section: string
  reason: string
  fixType: FixType
  status: CorrectionStatus
  priority: CorrectionPriority
  moduleLabel: string
  moduleColor: string
  flaggedDate: string
  resubmittedDate: string | null
  closedDate: string | null
  resolvedNote: string | null
}

// ─── Mock data ────────────────────────────────────────────────

const INITIAL_CORRECTIONS: Correction[] = [
  // ── Open ────────────────────────────────────────────────────
  {
    id: 'c1',
    item: 'Allergen Protocol — Schools',
    section: 'Compliance & Permits',
    reason: 'Submitted document does not follow the EcoLunch allergen protocol template. The allergy matrix table is missing and individual dish annotations are absent.',
    fixType: 'upload',
    status: 'open', priority: 'critical',
    moduleLabel: 'School Meals', moduleColor: '#4ade80',
    flaggedDate: '2025-09-08', resubmittedDate: null, closedDate: null, resolvedNote: null,
  },
  {
    id: 'c2',
    item: 'Rotating Cycle Document',
    section: 'Menus & Packages',
    reason: 'File uploaded as a JPEG image. Required format is PDF or XLSX. Image files cannot be processed by the EcoLunch menu validation system.',
    fixType: 'upload',
    status: 'open', priority: 'high',
    moduleLabel: 'School Meals', moduleColor: '#4ade80',
    flaggedDate: '2025-09-07', resubmittedDate: null, closedDate: null, resolvedNote: null,
  },
  {
    id: 'c3',
    item: 'Annual Financial Report',
    section: 'Accounting',
    reason: 'Document is a scanned image rather than a native digital PDF. EcoLunch requires a native digital file for financial verification. Please re-export directly from your accounting system.',
    fixType: 'upload',
    status: 'open', priority: 'high',
    moduleLabel: 'Accounting', moduleColor: '#fb923c',
    flaggedDate: '2025-09-06', resubmittedDate: null, closedDate: null, resolvedNote: null,
  },
  {
    id: 'c4',
    item: 'Infant Nutrition Protocol',
    section: 'Daycare / CPE Meals',
    reason: 'Age range labels are missing for the 6–12 month category. All three age groups (0–6, 6–12, 12–24 months) must have clearly labelled texture and portion specifications.',
    fixType: 'upload',
    status: 'open', priority: 'high',
    moduleLabel: 'Daycare / CPE', moduleColor: '#60a5fa',
    flaggedDate: '2025-09-05', resubmittedDate: null, closedDate: null, resolvedNote: null,
  },
  {
    id: 'c5',
    item: 'Banking Authorization Letter',
    section: 'Banking',
    reason: 'Signature is missing on page 3 of the document. The letter must be signed by both the account holder and an authorised bank representative.',
    fixType: 'upload',
    status: 'open', priority: 'medium',
    moduleLabel: 'Banking', moduleColor: '#a78bfa',
    flaggedDate: '2025-09-04', resubmittedDate: null, closedDate: null, resolvedNote: null,
  },

  // ── Resubmitted ─────────────────────────────────────────────
  {
    id: 'c6',
    item: 'Articles of Association',
    section: 'Legal',
    reason: 'Document version submitted is more than 6 months old. EcoLunch requires the most recent registered version of the statuts from the Registre du Commerce.',
    fixType: 'upload',
    status: 'resubmitted', priority: 'high',
    moduleLabel: 'Legal', moduleColor: '#60a5fa',
    flaggedDate: '2025-08-28', resubmittedDate: '2025-09-09', closedDate: null, resolvedNote: null,
  },
  {
    id: 'c7',
    item: 'CPE Service Agreement',
    section: 'Daycare / CPE Meals',
    reason: 'Missing countersignature from the CPE director. Both the caterer representative and the CPE director must sign the agreement.',
    fixType: 'upload',
    status: 'resubmitted', priority: 'medium',
    moduleLabel: 'Daycare / CPE', moduleColor: '#60a5fa',
    flaggedDate: '2025-08-26', resubmittedDate: '2025-09-08', closedDate: null, resolvedNote: null,
  },
  {
    id: 'c8',
    item: 'Health Inspection Certificate',
    section: 'Compliance & Permits',
    reason: 'Certificate is expired. Must be dated within the last 12 months. Please request a new inspection from the relevant health authority and upload the updated certificate.',
    fixType: 'upload',
    status: 'resubmitted', priority: 'high',
    moduleLabel: 'Compliance', moduleColor: '#fbbf24',
    flaggedDate: '2025-08-20', resubmittedDate: '2025-09-06', closedDate: null, resolvedNote: null,
  },

  // ── Closed ──────────────────────────────────────────────────
  {
    id: 'c9',
    item: 'Company Logo',
    section: 'Profile',
    reason: 'Image resolution is too low (under 72 dpi). Minimum 300 dpi is required for print-ready onboarding materials.',
    fixType: 'upload',
    status: 'closed', priority: 'low',
    moduleLabel: 'Profile', moduleColor: '#a78bfa',
    flaggedDate: '2025-08-10', resubmittedDate: '2025-08-12', closedDate: '2025-08-14',
    resolvedNote: 'High-resolution logo accepted. Validation passed.',
  },
  {
    id: 'c10',
    item: 'RIB — Relevé d\'Identité Bancaire',
    section: 'Banking',
    reason: 'Bank details are illegible in the uploaded scan. The IBAN and BIC codes must be clearly readable.',
    fixType: 'upload',
    status: 'closed', priority: 'medium',
    moduleLabel: 'Banking', moduleColor: '#a78bfa',
    flaggedDate: '2025-08-12', resubmittedDate: '2025-08-14', closedDate: '2025-08-16',
    resolvedNote: 'New RIB scan accepted. IBAN and BIC verified.',
  },
  {
    id: 'c11',
    item: 'KBIS Extract',
    section: 'Legal',
    reason: 'Extract is more than 3 months old. Must be dated within the last 3 months.',
    fixType: 'upload',
    status: 'closed', priority: 'high',
    moduleLabel: 'Legal', moduleColor: '#60a5fa',
    flaggedDate: '2025-08-15', resubmittedDate: '2025-08-17', closedDate: '2025-08-19',
    resolvedNote: 'Updated KBIS accepted. Company information verified.',
  },
  {
    id: 'c12',
    item: 'NDA — Signatory Name',
    section: 'Contracts & Signatures',
    reason: 'NDA was signed by an employee rather than the legal representative. Must be signed by the registered gérant or a holder of a power of attorney.',
    fixType: 'update',
    status: 'closed', priority: 'high',
    moduleLabel: 'Contracts', moduleColor: '#c084fc',
    flaggedDate: '2025-08-18', resubmittedDate: '2025-08-20', closedDate: '2025-08-22',
    resolvedNote: 'Re-signed by legal representative Marie Dupont. Accepted.',
  },
]

// ─── Meta maps ────────────────────────────────────────────────

const STATUS_META: Record<CorrectionStatus, { label: string; color: string; bg: string; border: string }> = {
  open:         { label: 'Open',              color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.28)' },
  resubmitted:  { label: 'Awaiting Review',   color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  closed:       { label: 'Resolved',          color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
}

const PRIORITY_META: Record<CorrectionPriority, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.30)'  },
  medium:   { label: 'Medium',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
  low:      { label: 'Low',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
}

const LEFT_BORDER: Record<CorrectionStatus, string> = {
  open:        '#f87171',
  resubmitted: '#60a5fa',
  closed:      '#4ade80',
}

// ─── Small badge ──────────────────────────────────────────────

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

// ─── Correction card ──────────────────────────────────────────

function CorrectionCard({
  correction, fixed, onFix, onResubmit,
}: {
  correction: Correction
  fixed: boolean
  onFix: (id: string) => void
  onResubmit: (id: string) => void
}) {
  const sm = STATUS_META[correction.status]
  const pm = PRIORITY_META[correction.priority]
  const isOpen        = correction.status === 'open'
  const isResubmitted = correction.status === 'resubmitted'
  const isClosed      = correction.status === 'closed'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${LEFT_BORDER[correction.status]}`,
      }}>
      <div className="px-5 py-5 flex flex-col gap-3.5">

        {/* ── Top row: item + badges ──────── */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-2.5 min-w-0">
            {/* Status icon */}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: sm.bg, border: `1px solid ${sm.border}` }}>
              {isOpen        && <AlertTriangle size={13} strokeWidth={2}   style={{ color: sm.color }} />}
              {isResubmitted && <RefreshCcw    size={12} strokeWidth={2}   style={{ color: sm.color }} />}
              {isClosed      && <CheckCircle2  size={13} strokeWidth={1.8} style={{ color: sm.color }} />}
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-black leading-snug" style={{ color: 'var(--text-1)' }}>
                {correction.item}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                {correction.section}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Module tag */}
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `${correction.moduleColor}18`,
                color: correction.moduleColor,
                border: `1px solid ${correction.moduleColor}30`,
              }}>
              {correction.moduleLabel}
            </span>
            <Badge {...pm} />
            <Badge {...sm} />
          </div>
        </div>

        {/* ── Reason ────────────────────────── */}
        <div className="px-4 py-3.5 rounded-xl"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
          <p className="text-[10.5px] uppercase tracking-[0.12em] font-black mb-1.5" style={{ color: 'var(--text-4)' }}>
            Reason flagged by EcoLunch
          </p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            {correction.reason}
          </p>
        </div>

        {/* ── Resolved note (closed only) ──── */}
        {isClosed && correction.resolvedNote && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.20)' }}>
            <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80', marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.11em] font-black mb-0.5" style={{ color: '#4ade80' }}>
                Resolution
              </p>
              <p className="text-[12px] leading-snug" style={{ color: 'var(--text-4)' }}>
                {correction.resolvedNote}
              </p>
            </div>
          </div>
        )}

        {/* ── Meta row + actions ──────────── */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-0.5">
          {/* Dates */}
          <div className="flex items-center gap-3 flex-wrap text-[11px]" style={{ color: 'var(--text-4)' }}>
            <span>Flagged {correction.flaggedDate}</span>
            {correction.resubmittedDate && (
              <span style={{ color: '#60a5fa' }}>· Resubmitted {correction.resubmittedDate}</span>
            )}
            {correction.closedDate && (
              <span style={{ color: '#4ade80' }}>· Resolved {correction.closedDate}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* OPEN state */}
            {isOpen && !fixed && (
              <>
                <button onClick={() => onFix(correction.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }}>
                  {correction.fixType === 'upload'
                    ? <><Upload  size={12} strokeWidth={2.5} />Re-upload Document</>
                    : <><FilePen size={12} strokeWidth={2.5} />Update Information</>
                  }
                </button>
                <button
                  disabled
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-not-allowed"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)', opacity: 0.5 }}>
                  <Send size={11} strokeWidth={2} />Resubmit
                </button>
              </>
            )}

            {/* OPEN + fixed — ready to resubmit */}
            {isOpen && fixed && (
              <>
                <span className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(74,222,128,0.10)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <Wrench size={11} strokeWidth={2} />Fixed — Ready to Resubmit
                </span>
                <button onClick={() => onResubmit(correction.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }}>
                  <Send size={12} strokeWidth={2.5} />Resubmit to EcoLunch
                </button>
              </>
            )}

            {/* RESUBMITTED state */}
            {isResubmitted && (
              <>
                <span className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                  <RefreshCcw size={11} strokeWidth={2} />Awaiting EcoLunch Review
                </span>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                  <Eye size={12} strokeWidth={2} />View Submission
                </button>
              </>
            )}

            {/* CLOSED state */}
            {isClosed && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                <Eye size={12} strokeWidth={2} />View
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section divider with count ───────────────────────────────

function SectionDivider({
  label, count, color, accent,
}: {
  label: string; count: number; color: string; accent: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap"
        style={{ color }}>
        {label}
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
          style={{ background: accent, color }}>
          {count}
        </span>
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
    </div>
  )
}

// ─── Go-Live Blockers banner ──────────────────────────────────

function BlockersBanner({ open }: { open: Correction[] }) {
  if (open.length === 0) return null
  const critical = open.filter(c => c.priority === 'critical').length
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.05)' }}>
      <div className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: 'rgba(248,113,113,0.08)', borderBottom: '1px solid rgba(248,113,113,0.18)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <Rocket size={14} strokeWidth={1.8} style={{ color: '#f87171' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black" style={{ color: '#f87171' }}>
            Go-Live Blocked — {open.length} Open Correction{open.length > 1 ? 's' : ''}
            {critical > 0 && `, ${critical} Critical`}
          </p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            All open corrections must be fixed and resubmitted before your account can go live.
          </p>
        </div>
      </div>
      <div className="px-5 py-3 flex flex-col gap-0">
        {open.map((c, i) => {
          const pm = PRIORITY_META[c.priority]
          return (
            <div key={c.id} className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < open.length - 1 ? '1px solid rgba(248,113,113,0.12)' : 'none' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pm.color }} />
              <p className="text-[12.5px] font-semibold flex-1 min-w-0 truncate" style={{ color: 'var(--text-2)' }}>
                {c.item}
              </p>
              <span className="text-[10.5px] font-bold shrink-0" style={{ color: pm.color }}>
                {pm.label}
              </span>
              <span className="text-[10.5px] shrink-0 hidden sm:block" style={{ color: 'var(--text-4)' }}>
                {c.section}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Summary bar ─────────────────────────────────────────────

function SummaryBar({ corrections }: { corrections: Correction[] }) {
  const open        = corrections.filter(c => c.status === 'open').length
  const resubmitted = corrections.filter(c => c.status === 'resubmitted').length
  const closed      = corrections.filter(c => c.status === 'closed').length
  const total       = corrections.length
  const pct         = total > 0 ? Math.round((closed / total) * 100) : 100

  return (
    <div className="flex items-center gap-5 px-5 py-4 rounded-2xl flex-wrap"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="shrink-0 text-center" style={{ minWidth: 52 }}>
        <p className="text-[28px] font-black leading-none" style={{ color: 'var(--accent)' }}>{pct}%</p>
        <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>Resolved</p>
      </div>
      <div className="flex-1 min-w-[160px] flex flex-col gap-2">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          {closed} of {total} corrections resolved
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {open > 0 && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertTriangle size={11} strokeWidth={2.5} />{open} Open
          </span>
        )}
        {resubmitted > 0 && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
            <RefreshCcw size={11} strokeWidth={2.5} />{resubmitted} Resubmitted
          </span>
        )}
        {closed > 0 && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
            <CheckCircle2 size={11} strokeWidth={2.5} />{closed} Resolved
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Closed section (collapsible) ────────────────────────────

function ClosedSection({
  corrections, fixedIds, onFix, onResubmit,
}: {
  corrections: Correction[]
  fixedIds: Set<string>
  onFix: (id: string) => void
  onResubmit: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  if (corrections.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <SectionDivider
        label="Resolved Corrections"
        count={corrections.length}
        color="#4ade80"
        accent="rgba(74,222,128,0.15)"
      />
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 w-full text-left"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}>
        <XCircle size={13} strokeWidth={1.8} style={{ color: '#4ade80' }} />
        {open ? 'Hide' : 'Show'} {corrections.length} resolved correction{corrections.length > 1 ? 's' : ''}
        {open
          ? <ChevronUp   size={13} strokeWidth={2} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />
          : <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />}
      </button>
      {open && corrections.map(c => (
        <CorrectionCard
          key={c.id} correction={c}
          fixed={fixedIds.has(c.id)} onFix={onFix} onResubmit={onResubmit}
        />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientCorrectionsPage() {
  const [corrections, setCorrections] = useState<Correction[]>(INITIAL_CORRECTIONS)
  const [fixedIds, setFixedIds]       = useState<Set<string>>(new Set())

  function handleFix(id: string) {
    setFixedIds(prev => new Set([...prev, id]))
  }

  function handleResubmit(id: string) {
    const today = new Date().toISOString().slice(0, 10)
    setCorrections(prev =>
      prev.map(c => c.id === id
        ? { ...c, status: 'resubmitted', resubmittedDate: today }
        : c
      )
    )
    setFixedIds(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  const open        = corrections.filter(c => c.status === 'open')
  const resubmitted = corrections.filter(c => c.status === 'resubmitted')
  const closed      = corrections.filter(c => c.status === 'closed')

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ──────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Client Portal / Corrections &amp; Follow-up
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Corrections &amp; Follow-up
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Resolve EcoLunch validation issues and resubmit for review. All open corrections block go-live.
        </p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">

        {/* ── Summary ──────────────────── */}
        <SummaryBar corrections={corrections} />

        {/* ── Go-live blockers banner ─── */}
        <BlockersBanner open={open} />

        {/* ── Open corrections ─────────── */}
        {open.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionDivider
              label="Open Corrections"
              count={open.length}
              color="#f87171"
              accent="rgba(248,113,113,0.12)"
            />
            {open.map(c => (
              <CorrectionCard
                key={c.id} correction={c}
                fixed={fixedIds.has(c.id)} onFix={handleFix} onResubmit={handleResubmit}
              />
            ))}
          </div>
        )}

        {/* ── Resubmitted corrections ─── */}
        {resubmitted.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionDivider
              label="Resubmitted — Awaiting Review"
              count={resubmitted.length}
              color="#60a5fa"
              accent="rgba(96,165,250,0.12)"
            />
            {resubmitted.map(c => (
              <CorrectionCard
                key={c.id} correction={c}
                fixed={fixedIds.has(c.id)} onFix={handleFix} onResubmit={handleResubmit}
              />
            ))}
          </div>
        )}

        {/* ── All clear state ───────────── */}
        {open.length === 0 && resubmitted.length === 0 && (
          <div className="flex items-center gap-4 px-5 py-5 rounded-2xl"
            style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.22)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.30)' }}>
              <CheckCircle2 size={18} strokeWidth={1.8} style={{ color: '#4ade80' }} />
            </div>
            <div>
              <p className="text-[14px] font-black" style={{ color: '#4ade80' }}>No Open Corrections</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                All corrections have been resolved. No go-live blockers from corrections.
              </p>
            </div>
          </div>
        )}

        {/* ── Closed / resolved ────────── */}
        <ClosedSection
          corrections={closed}
          fixedIds={fixedIds}
          onFix={handleFix}
          onResubmit={handleResubmit}
        />

        <div className="h-4" />
      </div>
    </div>
  )
}
