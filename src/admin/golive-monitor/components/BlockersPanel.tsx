import { ShieldAlert, FileX, DollarSign, Pen, ClipboardX, Utensils, Link2, ExternalLink } from 'lucide-react'
import type { Blocker, BlockerCategory } from '../types/golive.types'

const CATEGORY_META: Record<BlockerCategory, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  document:   { label: 'Document',   icon: <FileX      size={13} strokeWidth={1.8} />, color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
  contract:   { label: 'Contract',   icon: <Pen        size={13} strokeWidth={1.8} />, color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.25)'  },
  pricing:    { label: 'Pricing',    icon: <DollarSign size={13} strokeWidth={1.8} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)' },
  validation: { label: 'Validation', icon: <ClipboardX size={13} strokeWidth={1.8} />, color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.25)' },
  menu:       { label: 'Menu',       icon: <Utensils   size={13} strokeWidth={1.8} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.25)'  },
  ecoloop:    { label: 'EcoLoop',    icon: <Link2      size={13} strokeWidth={1.8} />, color: '#4ade80', bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.25)'  },
  banking:    { label: 'Banking',    icon: <ShieldAlert size={13} strokeWidth={1.8} />, color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

interface BlockersPanelProps {
  blockers: Blocker[]
  onOpenSection: (section: string) => void
}

export function BlockersPanel({ blockers, onOpenSection }: BlockersPanelProps) {
  if (blockers.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="px-4 py-3" style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Current Blockers</p>
        </div>
        <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.25)' }}>
            <ShieldAlert size={18} strokeWidth={1.5} style={{ color: '#4ade80' }} />
          </div>
          <p className="text-[13px] font-semibold" style={{ color: '#4ade80' }}>No active blockers</p>
          <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>All blocking items have been resolved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Current Blockers</p>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
          style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.28)' }}>
          {blockers.length}
        </span>
      </div>

      <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {blockers.map(b => {
          const m = CATEGORY_META[b.category]
          return (
            <div key={b.id} className="px-4 py-4 flex flex-col gap-2.5">
              {/* Title row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                    {m.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-snug" style={{ color: '#f87171' }}>{b.title}</p>
                    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                      {m.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{b.description}</p>

              {/* CTA */}
              <button
                onClick={() => onOpenSection(b.section)}
                className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold cursor-pointer transition-all"
                style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                <ExternalLink size={11} strokeWidth={2} />
                Open Blocking Section
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
