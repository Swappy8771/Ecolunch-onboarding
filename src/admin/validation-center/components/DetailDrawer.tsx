import { useEffect } from 'react'
import {
  X, User, Tag, Calendar, FileText, ChevronRight,
  CheckCircle2, MessageSquare, XCircle, MessageCircle, Send,
} from 'lucide-react'
import { TypeBadge } from './TypeBadge'
import { VStatusPill } from './VStatusPill'
import { PRIORITY_META } from './PriorityBadge'
import { useValidationHistory } from '@/features/adminValidation/hooks/useValidationHistory'
import { LinkedCorrectionPanel } from '@/shared/components/LinkedCorrectionPanel'
import type { ValidationItemViewModel } from '@/features/adminValidation/types/validation.types'

interface DetailDrawerProps {
  item: ValidationItemViewModel | null
  catererName: string
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  onRequestCorrection: () => void
  onAddNote: () => void
  onSendEcoLoop: () => void
}

export function DetailDrawer({ item, catererName, onClose, onApprove, onReject, onRequestCorrection, onAddNote, onSendEcoLoop }: DetailDrawerProps) {
  const open = item !== null
  const historyQuery = useValidationHistory(item?.id ?? '', open)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null
  const pm = PRIORITY_META[item.priority]
  const isTerminal = item.status === 'approved' || item.status === 'closed'

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 9998,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        }}
      />
      <div
        className="flex flex-col"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: 'min(560px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TypeBadge type={item.type} />
              <VStatusPill status={item.status} />
            </div>
            <h2 className="text-[16px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>
              {item.title ?? 'Untitled item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors mt-0.5"
            style={{ color: 'var(--text-4)', background: 'transparent', border: '1px solid transparent' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--bg-inner)'; el.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'transparent' }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Caterer',  value: catererName,                        icon: <User     size={12} strokeWidth={1.8} /> },
              { label: 'Section',  value: item.section ?? '—',                icon: <Tag      size={12} strokeWidth={1.8} /> },
              { label: 'Created',  value: item.createdAt.slice(0, 10),        icon: <Calendar size={12} strokeWidth={1.8} /> },
              { label: 'Reviewed By', value: item.reviewedBy ?? 'Not yet reviewed', icon: <User size={12} strokeWidth={1.8} /> },
            ].map(m => (
              <div key={m.label} className="rounded-xl px-3.5 py-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-4)' }}>
                  {m.icon}
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">{m.label}</span>
                </div>
                <span className="text-[13px] font-semibold truncate block" style={{ color: 'var(--text-1)' }}>{m.value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
              Priority
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: pm.color }} />
              <span className="text-[13px] font-semibold" style={{ color: pm.color }}>{pm.label}</span>
            </div>
          </div>

          {item.description && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
                Description
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.description}</p>
            </div>
          )}

          {item.linkedDocumentId && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
                Linked Document
              </p>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
              >
                <FileText size={14} strokeWidth={1.8} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span className="text-[12.5px] font-medium font-mono" style={{ color: '#60a5fa' }}>{item.linkedDocumentId}</span>
                <ChevronRight size={12} strokeWidth={2} className="ml-auto" style={{ color: 'var(--text-4)' }} />
              </div>
            </div>
          )}

          {item.type === 'smart_import' && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-2.5"
              style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)' }}>
              <Tag size={13} strokeWidth={1.8} style={{ color: '#f472b6', flexShrink: 0 }} />
              <p className="text-[12.5px]" style={{ color: '#f472b6' }}>
                Smart Import isn't implemented yet on the backend — no source document/target field/confidence data exists to show here.
              </p>
            </div>
          )}

          {Object.keys(item.dataSnapshot).length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
                Data Snapshot
              </p>
              <pre className="text-[11.5px] overflow-x-auto rounded-xl p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }}>
                {JSON.stringify(item.dataSnapshot, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
              Linked Correction
            </p>
            <LinkedCorrectionPanel validationItemId={item.id} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
              Internal Notes
            </p>
            {item.internalNotes.length === 0 ? (
              <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>No internal notes yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {item.internalNotes.map((n, i) => (
                  <div key={i} className="rounded-xl px-3.5 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>{n.note}</p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-4)' }}>{n.authorId ?? 'System'} · {n.createdAt.slice(0, 10)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-3" style={{ color: 'var(--text-4)' }}>
              History
            </p>
            {historyQuery.isLoading ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span>
            ) : (historyQuery.data ?? []).length === 0 ? (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>No audit events recorded.</span>
            ) : (
              <div className="flex flex-col gap-0">
                {(historyQuery.data ?? []).map((h, i, arr) => (
                  <div key={`${h.timestamp}-${i}`} className="flex gap-3 pb-4 relative">
                    {i < arr.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-0 w-px" style={{ background: 'var(--border-subtle)' }} />
                    )}
                    <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5"
                      style={{ background: 'var(--bg-inner)', borderColor: 'var(--border-default)' }} />
                    <div>
                      <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{h.action}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{h.actorId ?? 'System'} · {h.timestamp.slice(0, 16).replace('T', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="shrink-0 px-6 py-4 flex flex-col gap-2.5"
          style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          {!isTerminal && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
                style={{ background: '#4ade8018', color: '#4ade80', border: '1px solid #4ade8030' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4ade8030' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#4ade8018' }}
              >
                <CheckCircle2 size={14} strokeWidth={2} />Approve
              </button>
              <button
                onClick={onRequestCorrection}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
                style={{ background: '#fbbf2418', color: '#fbbf24', border: '1px solid #fbbf2430' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fbbf2430' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fbbf2418' }}
              >
                <MessageSquare size={14} strokeWidth={2} />Correction
              </button>
              <button
                onClick={onReject}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
                style={{ background: '#f8717118', color: '#f87171', border: '1px solid #f8717130' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8717130' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8717118' }}
              >
                <XCircle size={14} strokeWidth={2} />Reject
              </button>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onAddNote}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
            >
              <MessageCircle size={13} strokeWidth={1.8} />Add Note
            </button>
            <button
              onClick={onSendEcoLoop}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}
            >
              <Send size={13} strokeWidth={1.8} />Send via EcoLoop
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
