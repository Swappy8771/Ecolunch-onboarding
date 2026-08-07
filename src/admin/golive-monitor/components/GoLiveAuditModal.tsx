import { X, User } from 'lucide-react'
import { useGoLiveHistory } from '@/features/adminGolive/hooks/useGoLiveHistory'

interface GoLiveAuditModalProps {
  catererId: string
  catererName: string
  onClose: () => void
}

/** Full go-live audit trail (validate/block/unblock/activate/reminder/EcoLoop-message) — the detail panel only shows the 5 most recent. */
export function GoLiveAuditModal({ catererId, catererName, onClose }: GoLiveAuditModalProps) {
  const historyQuery = useGoLiveHistory(catererId, true)
  const history = historyQuery.data ?? []

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
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Go-live Audit Trail</h2>
          </div>
          <button onClick={onClose} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {historyQuery.isLoading ? (
            <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>Loading…</p>
          ) : history.length === 0 ? (
            <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>No go-live activity recorded yet.</p>
          ) : (
            <div className="flex flex-col gap-0">
              {history.map((e, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < history.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-0 w-px" style={{ background: 'var(--border-subtle)' }} />
                  )}
                  <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5"
                    style={{ background: 'var(--bg-inner)', borderColor: 'var(--border-default)' }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{e.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <User size={10} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{e.actorId ?? 'System'} · {e.timestamp.slice(0, 16).replace('T', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
