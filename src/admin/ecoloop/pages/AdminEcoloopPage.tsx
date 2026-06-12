import { useState } from 'react'
import { MessageCircle, RefreshCw } from 'lucide-react'
import { EcoLoopKpiCards }    from '../components/EcoLoopKpiCards'
import { TicketList }         from '../components/TicketList'
import { TicketDrawer }       from '../components/TicketDrawer'
import { CreateTicketModal }  from '../components/CreateTicketModal'
import { EcoLoopActionBar }   from '../components/EcoLoopActionBar'
import { EcoLoopLoading, EcoLoopError } from '../components/EcoLoopStates'
import { TICKETS, KPI_SUMMARY } from '../services/mock/ecoloopMock'

type PageState = 'idle' | 'loading' | 'error'

export function EcoLoop() {
  const [pageState,     setPageState]     = useState<PageState>('idle')
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState('2026-06-11 14:39')

  const selected = TICKETS.find(t => t.id === selectedId) ?? null

  function handleRefresh() {
    setPageState('loading')
    setTimeout(() => {
      setPageState('idle')
      setLastRefreshed(new Date().toISOString().slice(0, 16).replace('T', ' '))
    }, 800)
  }

  function handleAction(action: string) {
    console.log('EcoLoop action:', action, 'ticket:', selectedId)
  }

  function closeTicketModal() {
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 px-5 py-5 flex-wrap"
        style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <MessageCircle size={16} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>
              Admin / Onboarding
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              EcoLoop Onboarding
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              Communication &amp; Follow-up Layer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            Updated: <strong style={{ color: 'var(--text-3)' }}>{lastRefreshed}</strong>
          </span>
          <button onClick={handleRefresh} disabled={pageState === 'loading'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-all disabled:opacity-60"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            <RefreshCw size={13} strokeWidth={2} className={pageState === 'loading' ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 px-5 py-5 flex-1">

        {pageState === 'loading' ? (
          <EcoLoopLoading />
        ) : pageState === 'error' ? (
          <EcoLoopError onRetry={() => setPageState('idle')} />
        ) : (
          <>
            {/* KPIs */}
            <EcoLoopKpiCards {...KPI_SUMMARY} />

            {/* Full-width ticket list */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3"
                style={{ color: 'var(--text-4)' }}>
                Tickets by Caterer
              </p>
              <TicketList
                tickets={TICKETS}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            {/* Bottom spacer so sticky bar doesn't cover last row */}
            <div className="h-16 shrink-0" />
          </>
        )}
      </div>

      {/* ── Sticky footer action bar ─────────────────────────── */}
      <EcoLoopActionBar
        selected={selected}
        onCreateTicket={() => setShowCreateModal(true)}
        onAction={handleAction}
      />

      {/* ── Ticket detail drawer ─────────────────────────────── */}
      <TicketDrawer ticket={selected} onClose={closeTicketModal} />

      {/* ── Create ticket modal ──────────────────────────────── */}
      {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
