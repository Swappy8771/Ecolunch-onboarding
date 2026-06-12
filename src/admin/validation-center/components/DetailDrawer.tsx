import { useEffect } from 'react'
import {
  X, User, Tag, Calendar, FileText, ChevronRight,
  CheckCircle2, MessageSquare, XCircle,
} from 'lucide-react'
import { TypeBadge } from './TypeBadge'
import { VStatusPill } from './VStatusPill'
import { PRIORITY_META } from './PriorityBadge'
import { MOCK_HISTORY } from '../services/mock/validationMock'
import type { ValidationItem } from '../services/mock/validationMock'

interface DetailDrawerProps {
  item: ValidationItem | null
  onClose: () => void
}

export function DetailDrawer({ item, onClose }: DetailDrawerProps) {
  const open = item !== null

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null
  const pm = PRIORITY_META[item.priority]

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-[52px] bottom-0 z-50 flex flex-col w-full sm:w-[520px]"
        style={{
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '-12px 0 48px rgba(0,0,0,0.3)',
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
              {item.title}
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
              { label: 'Caterer',  value: item.caterer,  icon: <User     size={12} strokeWidth={1.8} /> },
              { label: 'Type',     value: item.type,     icon: <Tag      size={12} strokeWidth={1.8} /> },
              { label: 'Created',  value: item.created,  icon: <Calendar size={12} strokeWidth={1.8} /> },
              { label: 'Reviewer', value: item.reviewer, icon: <User     size={12} strokeWidth={1.8} /> },
            ].map(m => (
              <div key={m.label} className="rounded-xl px-3.5 py-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-4)' }}>
                  {m.icon}
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">{m.label}</span>
                </div>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{m.value}</span>
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

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
              Description
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.description}</p>
          </div>

          {item.sourceDoc && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
                Source Document
              </p>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#60a5fa50' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
              >
                <FileText size={14} strokeWidth={1.8} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span className="text-[12.5px] font-medium" style={{ color: '#60a5fa' }}>{item.sourceDoc}</span>
                <ChevronRight size={12} strokeWidth={2} className="ml-auto" style={{ color: 'var(--text-4)' }} />
              </div>
            </div>
          )}

          {item.type === 'Smart Import' && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-2.5"
              style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)' }}>
              <Tag size={13} strokeWidth={1.8} style={{ color: '#f472b6', flexShrink: 0 }} />
              <p className="text-[12.5px]" style={{ color: '#f472b6' }}>
                Smart Import context available — view mapping in Import Center
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
              Internal Notes
            </p>
            <textarea
              rows={3}
              placeholder="Add an internal note visible only to admins…"
              className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-1)' }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = '#a3e63560' }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-default)' }}
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-3" style={{ color: 'var(--text-4)' }}>
              History
            </p>
            <div className="flex flex-col gap-0">
              {MOCK_HISTORY.map((h, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < MOCK_HISTORY.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-0 w-px" style={{ background: 'var(--border-subtle)' }} />
                  )}
                  <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5"
                    style={{ background: 'var(--bg-inner)', borderColor: 'var(--border-default)' }} />
                  <div>
                    <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{h.action}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{h.actor} · {h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="shrink-0 px-6 py-4 flex items-center gap-2.5"
          style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: '#4ade8018', color: '#4ade80', border: '1px solid #4ade8030' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4ade8030' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#4ade8018' }}
          >
            <CheckCircle2 size={14} strokeWidth={2} />Approve
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: '#fbbf2418', color: '#fbbf24', border: '1px solid #fbbf2430' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fbbf2430' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fbbf2418' }}
          >
            <MessageSquare size={14} strokeWidth={2} />Correction
          </button>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: '#f8717118', color: '#f87171', border: '1px solid #f8717130' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8717130' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8717118' }}
          >
            <XCircle size={14} strokeWidth={2} />Reject
          </button>
        </div>
      </div>
    </>
  )
}
