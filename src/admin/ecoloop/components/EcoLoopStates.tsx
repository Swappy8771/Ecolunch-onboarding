import { MessageCircle, WifiOff, RefreshCw, Inbox } from 'lucide-react'

export function EcoLoopLoading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        {/* Skeleton ticket list */}
        <div className="w-full xl:w-[35%] flex flex-col gap-2">
          <div className="h-8 rounded-xl" style={{ background: 'var(--bg-card)' }} />
          <div className="h-6 rounded-lg" style={{ background: 'var(--bg-card)' }} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
          ))}
        </div>

        {/* Skeleton detail */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-28 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function EcoLoopError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <WifiOff size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load tickets</p>
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

export function NoTicketSelected() {
  return (
    <div className="rounded-2xl flex flex-col items-center justify-center gap-3 py-20 text-center"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
        <MessageCircle size={20} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-2)' }}>Select a ticket</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>
          Click any ticket in the list to view the conversation,<br />linked objects, and follow-up actions.
        </p>
      </div>
    </div>
  )
}

export function NoTicketsEmpty() {
  return (
    <div className="rounded-2xl flex flex-col items-center justify-center gap-3 py-16 text-center"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
        <Inbox size={18} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
      </div>
      <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text-3)' }}>No onboarding follow-ups currently exist.</p>
    </div>
  )
}
