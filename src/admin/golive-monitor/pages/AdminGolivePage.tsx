import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import { useGoLiveList } from '@/features/adminGolive/hooks/useGoLiveList'
import { useGoLiveSummary } from '@/features/adminGolive/hooks/useGoLiveSummary'
import {
  useValidateGoLive, useBlockGoLive, useUnblockGoLive,
  useSendGoLiveReminder, useSendGoLiveEcoLoop,
} from '@/features/adminGolive/hooks/useGoLiveActions'
import type { GoLiveBlockerViewModel } from '@/features/adminGolive/types/golive.types'
import { KpiCards } from '../components/KpiCards'
import { CatererTable } from '../components/CatererTable'
import { DetailPanel } from '../components/DetailPanel'
import { ActionBar } from '../components/ActionBar'
import { NoCatererSelected, LoadingState, ErrorState } from '../components/EmptyState'
import { GoLiveActionModal, type GoLiveActionVariant } from '../components/GoLiveActionModal'
import { GoLiveBlockersModal } from '../components/GoLiveBlockersModal'
import { GoLiveAuditModal } from '../components/GoLiveAuditModal'

/**
 * Resolves "Open Blocking Section" — the real backend `owningModule`/
 * `source` fields, mapped to the one admin page most likely to fix that
 * blocker. Corrections/Validation have no dedicated standalone page of
 * their own in this app; both surface through Validation Center.
 */
const MODULE_ROUTE: Record<string, string> = {
  'document-vault': '/admin/document-vault',
  contracts: '/admin/contract-management',
  'modules-required-setup': '/admin/modules-pricing',
  validation: '/admin/validation-center',
  corrections: '/admin/validation-center',
  banking: '/admin/caterers',
}
const REQUIREMENT_ROUTE: Record<string, string> = {
  account_created: '/admin/caterers',
  profile_validated: '/admin/validation-center',
  banking_validated: '/admin/validation-center',
  establishments_confirmed: '/admin/validation-center',
  menus_validated: '/admin/validation-center',
  documents_approved: '/admin/document-vault',
  contracts_signed: '/admin/contract-management',
  modules_configured: '/admin/modules-pricing',
  pricing_configured: '/admin/modules-pricing',
  corrections_closed: '/admin/validation-center',
  ecoloop_blockers_closed: '/admin/ecoloop',
}

function resolveSectionRoute(blocker: GoLiveBlockerViewModel): string {
  if (blocker.owningModule === 'golive') return REQUIREMENT_ROUTE[blocker.source] ?? '/admin/caterers'
  return MODULE_ROUTE[blocker.owningModule] ?? '/admin/caterers'
}

export function GoLiveMonitor() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('catererId'))
  const [actionModal, setActionModal] = useState<GoLiveActionVariant | null>(null)
  const [showBlockersModal, setShowBlockersModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)

  // Consume the deep-link param once — same pattern as every other cross-module link this session.
  useEffect(() => {
    if (searchParams.has('catererId')) {
      setSearchParams(params => { params.delete('catererId'); return params }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listQuery = useGoLiveList({})
  const caterersQuery = useCaterers({ limit: 100 })
  // Same query key/cache entry `DetailPanel` uses for its own Blockers panel — reused here only
  // for the "Open Blocking Section" shortcut button, not an extra network round trip.
  const selectedSummaryQuery = useGoLiveSummary(selectedId ?? '', Boolean(selectedId))

  const catererMetaById = useMemo(() => {
    const map = new Map<string, { city: string; vertical: string }>()
    caterersQuery.data?.items.forEach(c => map.set(c.id, { city: c.city, vertical: c.verticals.join(', ') }))
    return map
  }, [caterersQuery.data])

  const validateMutation = useValidateGoLive()
  const blockMutation = useBlockGoLive()
  const unblockMutation = useUnblockGoLive()
  const reminderMutation = useSendGoLiveReminder()
  const ecoLoopMutation = useSendGoLiveEcoLoop()

  const items = listQuery.data ?? []
  const selected = items.find(c => c.catererId === selectedId) ?? null
  const selectedMeta = selectedId ? catererMetaById.get(selectedId) : undefined

  const stats = {
    ready: items.filter(c => c.readiness === 'ready').length,
    notReady: items.filter(c => c.readiness === 'not_ready').length,
    blocked: items.filter(c => c.readiness === 'blocked').length,
    total: items.length,
  }

  function handleOpenSection(blocker: GoLiveBlockerViewModel) {
    if (!selectedId) return
    navigate(`${resolveSectionRoute(blocker)}?catererId=${selectedId}`)
  }

  function handleOpenBlockingSection() {
    // Shortcut version of the per-blocker button in the Blockers panel/modal — jumps straight to
    // the first blocker's section instead of requiring the admin to open the list first.
    const firstBlocker = selectedSummaryQuery.data?.blockers[0]
    if (firstBlocker) handleOpenSection(firstBlocker)
    else setShowBlockersModal(true)
  }

  function confirmAction(text: string) {
    if (!selectedId || !actionModal) return
    if (actionModal === 'block') {
      blockMutation.mutate({ catererId: selectedId, reason: text }, { onSuccess: () => setActionModal(null) })
    } else if (actionModal === 'remind') {
      reminderMutation.mutate({ catererId: selectedId, message: text || undefined }, { onSuccess: () => setActionModal(null) })
    } else {
      ecoLoopMutation.mutate({ catererId: selectedId, message: text }, { onSuccess: () => setActionModal(null) })
    }
  }

  const isBusy = validateMutation.isPending || blockMutation.isPending || unblockMutation.isPending

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* Page header */}
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
          <button
            onClick={() => listQuery.refetch()}
            disabled={listQuery.isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-all disabled:opacity-60"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
          >
            <RefreshCw size={13} strokeWidth={2} className={listQuery.isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex flex-col gap-5 px-5 py-5 flex-1">

        <KpiCards ready={stats.ready} notReady={stats.notReady} blocked={stats.blocked} total={stats.total} />

        {listQuery.isLoading ? (
          <LoadingState />
        ) : listQuery.isError ? (
          <ErrorState onRetry={() => listQuery.refetch()} />
        ) : (
          <>
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold -mb-2" style={{ color: 'var(--text-4)' }}>
              Caterer Readiness List
            </p>

            <div className="flex flex-col xl:flex-row gap-4 items-start">
              <div className="w-full xl:flex-1 min-w-0">
                <CatererTable
                  caterers={items}
                  catererMetaById={catererMetaById}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>

              <div className="w-full xl:w-[420px] shrink-0">
                {selected ? (
                  <DetailPanel
                    catererId={selected.catererId}
                    catererName={selected.catererName}
                    catererCity={selectedMeta?.city ?? ''}
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

        <div className="h-16 shrink-0" />
      </div>

      <ActionBar
        selected={selected}
        isBusy={isBusy}
        onViewBlockers={() => setShowBlockersModal(true)}
        onOpenBlockingSection={handleOpenBlockingSection}
        onSendReminder={() => setActionModal('remind')}
        onSendEcoLoop={() => setActionModal('send_ecoloop')}
        onValidate={() => selectedId && validateMutation.mutate(selectedId)}
        onBlockOrUnblock={() => {
          if (!selectedId) return
          if (selected?.readiness === 'blocked') unblockMutation.mutate(selectedId)
          else setActionModal('block')
        }}
        onViewAudit={() => setShowAuditModal(true)}
      />

      {actionModal && selected && (
        <GoLiveActionModal
          catererName={selected.catererName}
          variant={actionModal}
          isSubmitting={blockMutation.isPending || reminderMutation.isPending || ecoLoopMutation.isPending}
          onCancel={() => setActionModal(null)}
          onConfirm={confirmAction}
        />
      )}

      {showBlockersModal && selected && (
        <GoLiveBlockersModal
          catererId={selected.catererId}
          catererName={selected.catererName}
          onClose={() => setShowBlockersModal(false)}
          onOpenSection={blocker => { setShowBlockersModal(false); handleOpenSection(blocker) }}
        />
      )}

      {showAuditModal && selected && (
        <GoLiveAuditModal
          catererId={selected.catererId}
          catererName={selected.catererName}
          onClose={() => setShowAuditModal(false)}
        />
      )}

      {(validateMutation.isError || blockMutation.isError || unblockMutation.isError) && (
        <div className="fixed bottom-20 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
          <span className="text-[12.5px]" style={{ color: '#f87171' }}>
            {(validateMutation.error ?? blockMutation.error ?? unblockMutation.error)?.message}
          </span>
        </div>
      )}
    </div>
  )
}
