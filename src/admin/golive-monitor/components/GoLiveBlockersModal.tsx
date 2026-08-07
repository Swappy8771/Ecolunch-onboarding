import { X } from 'lucide-react'
import { useGoLiveSummary } from '@/features/adminGolive/hooks/useGoLiveSummary'
import { BlockersPanel } from './BlockersPanel'
import type { GoLiveBlockerViewModel } from '@/features/adminGolive/types/golive.types'

interface GoLiveBlockersModalProps {
  catererId: string
  catererName: string
  onClose: () => void
  onOpenSection: (blocker: GoLiveBlockerViewModel) => void
}

/** A focused, standalone view of "View Blockers" — the same data `BlockersPanel` already shows inline in the detail panel, in a dedicated modal. */
export function GoLiveBlockersModal({ catererId, catererName, onClose, onOpenSection }: GoLiveBlockersModalProps) {
  const summaryQuery = useGoLiveSummary(catererId, true)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[520px] max-h-[80vh] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{catererName}</p>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Go-live Blockers</h2>
          </div>
          <button onClick={onClose} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {summaryQuery.isLoading ? (
            <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>Loading…</p>
          ) : (
            <BlockersPanel blockers={summaryQuery.data?.blockers ?? []} onOpenSection={onOpenSection} />
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
