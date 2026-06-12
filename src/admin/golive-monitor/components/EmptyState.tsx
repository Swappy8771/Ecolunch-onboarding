import { Rocket, RefreshCw, WifiOff } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
        <Rocket size={22} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[14px] font-semibold" style={{ color: 'var(--text-2)' }}>Loading Go-live Monitor…</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Fetching caterer readiness data</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: 'var(--accent)', animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <WifiOff size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-[14px] font-semibold" style={{ color: '#f87171' }}>Failed to load readiness data</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Check your connection and try again.</p>
      </div>
      <button onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <RefreshCw size={13} strokeWidth={2} />Retry
      </button>
    </div>
  )
}

export function NoCatererSelected() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 px-6 text-center h-full"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '16px' }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
        <Rocket size={20} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-2)' }}>Select a caterer</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>
          Click any row in the list to view the readiness detail, checklist, and active blockers.
        </p>
      </div>
    </div>
  )
}
