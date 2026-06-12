import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { KpiCards } from '../components/KpiCards'
import { CatererTable } from '../components/CatererTable'
import { DetailPanel } from '../components/DetailPanel'
import { ActionBar } from '../components/ActionBar'
import { NoCatererSelected, LoadingState, ErrorState } from '../components/EmptyState'
import { CATERERS_READINESS, SUMMARY } from '../services/mock/goliveMock'

type PageState = 'idle' | 'loading' | 'error'

export function GoLiveMonitor() {
  const [pageState, setPageState] = useState<PageState>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState('2026-06-11 09:42')

  const selected = CATERERS_READINESS.find(c => c.id === selectedId) ?? null

  function handleRefresh() {
    setPageState('loading')
    setTimeout(() => {
      setPageState('idle')
      setLastRefreshed(new Date().toISOString().slice(0, 16).replace('T', ' '))
    }, 900)
  }

  function handleOpenSection(section: string) {
    console.log('Navigate to section:', section)
  }

  function handleAction(action: string) {
    console.log('Action:', action, 'for', selectedId)
  }

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ──────────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-5 flex-wrap"
        style={{ borderBottom: '1px solid var(--border-default)' }}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>
            Admin / Onboarding
          </p>
          <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
            Go-live Monitor
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
            Updated: <strong style={{ color: 'var(--text-3)' }}>{lastRefreshed}</strong>
          </span>
          <button
            onClick={handleRefresh}
            disabled={pageState === 'loading'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-all disabled:opacity-60"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
          >
            <RefreshCw size={13} strokeWidth={2} className={pageState === 'loading' ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────── */}
      <div className="flex flex-col gap-5 px-5 py-5 flex-1">

        {/* KPI row — always visible, never clipped */}
        <KpiCards
          ready={SUMMARY.ready}
          notReady={SUMMARY.notReady}
          blocked={SUMMARY.blocked}
          total={SUMMARY.total}
        />

        {/* Content states */}
        {pageState === 'loading' ? (
          <LoadingState />
        ) : pageState === 'error' ? (
          <ErrorState onRetry={() => setPageState('idle')} />
        ) : (
          <>
            {/* Section label */}
            <p
              className="text-[11px] uppercase tracking-[0.13em] font-bold -mb-2"
              style={{ color: 'var(--text-4)' }}
            >
              Caterer Readiness List
            </p>

            {/*
              Split layout:
              - mobile/tablet  (<xl)  : stacked — table full width, detail below
              - desktop        (≥xl)  : side-by-side — left 60 / right 40
            */}
            <div className="flex flex-col xl:flex-row gap-4 items-start">

              {/* LEFT — table */}
              <div className="w-full xl:flex-1 min-w-0">
                <CatererTable
                  caterers={CATERERS_READINESS}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>

              {/* RIGHT — detail */}
              <div className="w-full xl:w-[420px] shrink-0">
                {selected ? (
                  <DetailPanel
                    caterer={selected}
                    onClose={() => setSelectedId(null)}
                    onOpenSection={handleOpenSection}
                  />
                ) : (
                  <NoCatererSelected />
                )}
              </div>

            </div>
          </>
        )}

        {/* Bottom padding so sticky bar doesn't cover last row */}
        <div className="h-16 shrink-0" />
      </div>

      {/* ── Sticky action bar ─────────────────────────────────── */}
      <ActionBar selected={selected} onAction={handleAction} />
    </div>
  )
}
