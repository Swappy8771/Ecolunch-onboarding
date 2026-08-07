import { useState } from 'react'
import {
  CheckCircle2, AlertTriangle, RefreshCcw, XCircle,
  Rocket, Send, ChevronDown, ChevronUp, WifiOff, RefreshCw, MessageCircle,
} from 'lucide-react'
import {
  useCatererCorrectionsList, useCatererCorrectionsSummary,
} from '@/features/catererCorrections/hooks/useCatererCorrectionsQueries'
import {
  useResubmitCatererCorrection, useAddCatererCorrectionComment,
} from '@/features/catererCorrections/hooks/useCatererCorrectionsActions'
import type {
  CorrectionViewModel, CorrectionStatus, CorrectionPriority,
} from '@/features/catererCorrections/types/catererCorrections.types'

/**
 * Real, tenant-scoped data via `/caterer/corrections/*`. A caterer can
 * view its own corrections, follow up with a comment, and resubmit a fix
 * (open/in_progress → resolved) — closing/reopening a correction stays an
 * exclusively admin decision (confirming or rejecting the fix), so no
 * such action exists here. Per the real backend gate, ANY open/in_progress
 * correction blocks go-live regardless of priority — reflected honestly
 * below rather than the mock's now-removed "only critical blocks" framing.
 */

const STATUS_META: Record<CorrectionStatus, { label: string; color: string; bg: string; border: string }> = {
  open:        { label: 'Open',             color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.28)' },
  in_progress: { label: 'In Progress',      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)'  },
  resolved:    { label: 'Awaiting Review',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  closed:      { label: 'Resolved',         color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
}

const PRIORITY_META: Record<CorrectionPriority, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: 'High',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.30)' },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.30)' },
  low:    { label: 'Low',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.28)' },
}

function formatDate(iso: string | null): string | null {
  return iso ? iso.slice(0, 10) : null
}

// ─── Loading / error states ───────────────────────────────────

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-24 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
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
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your corrections</p>
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

// ─── Badge ────────────────────────────────────────────────────

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

// ─── Comments thread ──────────────────────────────────────────

function CommentsThread({ correction }: { correction: CorrectionViewModel }) {
  const [body, setBody] = useState('')
  const addComment = useAddCatererCorrectionComment()

  function handleSubmit() {
    const trimmed = body.trim()
    if (!trimmed) return
    addComment.mutate({ id: correction.id, body: { body: trimmed } }, { onSuccess: () => setBody('') })
  }

  return (
    <div className="flex flex-col gap-2.5">
      {correction.comments.length > 0 && (
        <div className="flex flex-col gap-2">
          {correction.comments.map(c => (
            <div key={c.id} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
              <MessageCircle size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)', marginTop: 2, flexShrink: 0 }} />
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-bold mb-0.5" style={{ color: c.authorType === 'admin' ? '#60a5fa' : 'var(--text-3)' }}>
                  {c.authorType === 'admin' ? 'EcoLunch' : 'You'}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Add a follow-up comment…"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl text-[12px] outline-none"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-1)', border: '1px solid var(--border-default)' }}
        />
        <button onClick={handleSubmit} disabled={!body.trim() || addComment.isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
          <Send size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

// ─── Correction card ──────────────────────────────────────────

function CorrectionCard({ correction }: { correction: CorrectionViewModel }) {
  const sm = STATUS_META[correction.status]
  const pm = PRIORITY_META[correction.priority]
  const resubmit = useResubmitCatererCorrection()
  const canResubmit = correction.status === 'open' || correction.status === 'in_progress'

  function handleResubmit() {
    if (!window.confirm('Resubmit this correction to EcoLunch for review?')) return
    resubmit.mutate({ id: correction.id, body: {} })
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${sm.color}` }}>
      <div className="px-5 py-5 flex flex-col gap-3.5">

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: sm.bg, border: `1px solid ${sm.border}` }}>
              {correction.status === 'open' && <AlertTriangle size={13} strokeWidth={2} style={{ color: sm.color }} />}
              {correction.status === 'in_progress' && <RefreshCcw size={12} strokeWidth={2} style={{ color: sm.color }} />}
              {correction.status === 'resolved' && <RefreshCcw size={12} strokeWidth={2} style={{ color: sm.color }} />}
              {correction.status === 'closed' && <CheckCircle2 size={13} strokeWidth={1.8} style={{ color: sm.color }} />}
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-black leading-snug" style={{ color: 'var(--text-1)' }}>{correction.section}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Badge {...pm} />
            <Badge {...sm} />
          </div>
        </div>

        <div className="px-4 py-3.5 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
          <p className="text-[10.5px] uppercase tracking-[0.12em] font-black mb-1.5" style={{ color: 'var(--text-4)' }}>
            Reason flagged by EcoLunch
          </p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{correction.description}</p>
        </div>

        <CommentsThread correction={correction} />

        <div className="flex items-center justify-between gap-3 flex-wrap pt-0.5">
          <div className="flex items-center gap-3 flex-wrap text-[11px]" style={{ color: 'var(--text-4)' }}>
            <span>Flagged {formatDate(correction.createdAt)}</span>
            {correction.resolvedAt && (
              <span style={{ color: correction.status === 'closed' ? '#4ade80' : '#60a5fa' }}>
                · {correction.status === 'closed' ? 'Resolved' : 'Resubmitted'} {formatDate(correction.resolvedAt)}
              </span>
            )}
          </div>
          {canResubmit && (
            <button onClick={handleResubmit} disabled={resubmit.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }}>
              <Send size={12} strokeWidth={2.5} />{resubmit.isPending ? 'Resubmitting…' : 'Resubmit to EcoLunch'}
            </button>
          )}
          {correction.status === 'resolved' && (
            <span className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-2 rounded-xl"
              style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
              <RefreshCcw size={11} strokeWidth={2} />Awaiting EcoLunch Review
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Section divider ──────────────────────────────────────────

function SectionDivider({ label, count, color, accent }: { label: string; count: number; color: string; accent: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] font-black whitespace-nowrap" style={{ color }}>
        {label}
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ background: accent, color }}>{count}</span>
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
    </div>
  )
}

// ─── Go-Live blockers banner ──────────────────────────────────

function BlockersBanner({ blocking }: { blocking: CorrectionViewModel[] }) {
  if (blocking.length === 0) return null
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(248,113,113,0.30)', background: 'rgba(248,113,113,0.05)' }}>
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: 'rgba(248,113,113,0.08)', borderBottom: '1px solid rgba(248,113,113,0.18)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <Rocket size={14} strokeWidth={1.8} style={{ color: '#f87171' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black" style={{ color: '#f87171' }}>
            Go-Live Blocked — {blocking.length} Open Correction{blocking.length > 1 ? 's' : ''}
          </p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            Every open correction must be fixed and resubmitted before your account can go live.
          </p>
        </div>
      </div>
      <div className="px-5 py-3 flex flex-col gap-0">
        {blocking.map((c, i) => {
          const pm = PRIORITY_META[c.priority]
          return (
            <div key={c.id} className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < blocking.length - 1 ? '1px solid rgba(248,113,113,0.12)' : 'none' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pm.color }} />
              <p className="text-[12.5px] font-semibold flex-1 min-w-0 truncate" style={{ color: 'var(--text-2)' }}>{c.section}</p>
              <span className="text-[10.5px] font-bold shrink-0" style={{ color: pm.color }}>{pm.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Summary bar ─────────────────────────────────────────────

function SummaryBar({ open, inProgress, resolved, closed, total }: {
  open: number; inProgress: number; resolved: number; closed: number; total: number
}) {
  const pct = total > 0 ? Math.round((closed / total) * 100) : 100
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
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>{closed} of {total} corrections resolved</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {(open + inProgress) > 0 && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertTriangle size={11} strokeWidth={2.5} />{open + inProgress} Open
          </span>
        )}
        {resolved > 0 && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
            <RefreshCcw size={11} strokeWidth={2.5} />{resolved} Resubmitted
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

function ClosedSection({ corrections }: { corrections: CorrectionViewModel[] }) {
  const [open, setOpen] = useState(false)
  if (corrections.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      <SectionDivider label="Resolved Corrections" count={corrections.length} color="#4ade80" accent="rgba(74,222,128,0.15)" />
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 w-full text-left"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}>
        <XCircle size={13} strokeWidth={1.8} style={{ color: '#4ade80' }} />
        {open ? 'Hide' : 'Show'} {corrections.length} resolved correction{corrections.length > 1 ? 's' : ''}
        {open
          ? <ChevronUp size={13} strokeWidth={2} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />
          : <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />}
      </button>
      {open && corrections.map(c => <CorrectionCard key={c.id} correction={c} />)}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Corrections &amp; Follow-up
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        Corrections &amp; Follow-up
      </h1>
    </div>
  )
}

export function CatererCorrectionsPage() {
  const listQuery = useCatererCorrectionsList({ limit: 100 })
  const summaryQuery = useCatererCorrectionsSummary(undefined)

  if (listQuery.isLoading || summaryQuery.isLoading) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  }
  if (listQuery.isError || summaryQuery.isError || !listQuery.data || !summaryQuery.data) {
    return (
      <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
        <PageHeading />
        <PageError onRetry={() => { listQuery.refetch(); summaryQuery.refetch() }} />
      </div>
    )
  }

  const corrections = listQuery.data.data
  const summary = summaryQuery.data
  const openLike = corrections.filter(c => c.status === 'open' || c.status === 'in_progress')
  const resolved = corrections.filter(c => c.status === 'resolved')
  const closed = corrections.filter(c => c.status === 'closed')

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Caterer Portal / Corrections &amp; Follow-up
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Corrections &amp; Follow-up
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Resolve EcoLunch validation issues and resubmit for review. Any open correction blocks go-live.
        </p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        <SummaryBar open={summary.open} inProgress={summary.inProgress} resolved={summary.resolved} closed={summary.closed} total={summary.total} />

        <BlockersBanner blocking={openLike} />

        {openLike.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionDivider label="Open Corrections" count={openLike.length} color="#f87171" accent="rgba(248,113,113,0.12)" />
            {openLike.map(c => <CorrectionCard key={c.id} correction={c} />)}
          </div>
        )}

        {resolved.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionDivider label="Resubmitted — Awaiting Review" count={resolved.length} color="#60a5fa" accent="rgba(96,165,250,0.12)" />
            {resolved.map(c => <CorrectionCard key={c.id} correction={c} />)}
          </div>
        )}

        {openLike.length === 0 && resolved.length === 0 && (
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

        <ClosedSection corrections={closed} />

        <div className="h-4" />
      </div>
    </div>
  )
}
