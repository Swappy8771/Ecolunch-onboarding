import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileSignature, Search, Download, Filter, RotateCcw,
  Eye, Send, RefreshCw, XCircle, FileDown, CheckSquare,
  History, FilePen,
  Database, Rocket, Calendar, Clock, CheckCircle2, AlertTriangle, FileText, Plus,
} from 'lucide-react'
import { PageHeader } from '@shared/components/PageHeader'
import { SelectFilter } from '@shared/components/SelectFilter'
import { DropdownMenu } from '@shared/components/DropdownMenu'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { InlineLoader } from '@shared/ui/InlineLoader'
import { StatCard } from '@/features/adminDashboard/components/StatCard'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import {
  useContracts, useContractTemplates,
  useReadyContract, useSendContract, useRetryContract, useResendContract, useCancelContract, useDownloadContract,
  useExportContracts,
  CONTRACT_STATUS_META, CONTRACT_TYPE_LABELS,
  type ContractListItemViewModel, type ContractStatus, type ContractType,
} from '@/features/adminContracts'
import { StatusBadge } from '../components/StatusBadge'
import { ContractSlideOver } from '../components/ContractSlideOver'
import { SendWizard } from '../components/SendWizard'

/** Replaces the previously-hardcoded, always-"just now" sync label with the list query's real `dataUpdatedAt`. */
function formatRelativeSync(updatedAtMs: number): string {
  const diffSec = Math.round((Date.now() - updatedAtMs) / 1000)
  if (diffSec < 5) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.round(diffMin / 60)
  return `${diffHour}h ago`
}

const PENDING_STATUSES: ContractStatus[] = ['sent', 'viewed', 'partially_signed', 'ready_to_send']
const DECLINED_OR_EXPIRED_STATUSES: ContractStatus[] = ['declined', 'expired', 'canceled', 'error']

const TABLE_COLS = [
  { label: 'Contract',      width: 'auto'  },
  { label: 'Caterer',       width: '160px' },
  { label: 'Type',          width: '130px' },
  { label: 'Signatory',     width: '160px' },
  { label: 'Status',        width: '160px' },
  { label: 'Sent Date',     width: '110px' },
  { label: 'Actions',       width: '60px'  },
]

interface RowActionHandlers {
  onViewDetail: (id: string) => void
  onSend: (c: ContractListItemViewModel) => void
  onReady: (c: ContractListItemViewModel) => void
  onRetry: (c: ContractListItemViewModel) => void
  onResend: (c: ContractListItemViewModel) => void
  onCancel: (c: ContractListItemViewModel) => void
  onDownload: (id: string) => void
  onOpenVault: (catererId: string) => void
  onOpenGolive: () => void
}

function buildRowActions(c: ContractListItemViewModel, h: RowActionHandlers): { label: string; icon: ReactNode; color?: string; onClick?: () => void }[] {
  const actions: { label: string; icon: ReactNode; color?: string; onClick?: () => void }[] = [
    { label: 'View Detail', icon: <Eye size={13} strokeWidth={1.8} />, onClick: () => h.onViewDetail(c.id) },
  ]
  if (c.status === 'draft') {
    actions.push({ label: 'Mark Ready to Send', icon: <CheckSquare size={13} strokeWidth={1.8} />, onClick: () => h.onReady(c) })
  }
  if (c.status === 'draft' || c.status === 'ready_to_send') {
    actions.push({ label: 'Send for Signature', icon: <Send size={13} strokeWidth={1.8} />, onClick: () => h.onSend(c) })
  }
  if (c.status === 'error') {
    actions.push({ label: 'Retry Send', icon: <RefreshCw size={13} strokeWidth={1.8} />, onClick: () => h.onRetry(c) })
  }
  if (['sent', 'viewed', 'partially_signed'].includes(c.status)) {
    actions.push({ label: 'Resend / Remind', icon: <RefreshCw size={13} strokeWidth={1.8} />, onClick: () => h.onResend(c) })
  }
  if (c.status === 'signed') {
    actions.push({ label: 'Download Signed Doc', icon: <FileDown size={13} strokeWidth={1.8} />, onClick: () => h.onDownload(c.id) })
    actions.push({ label: 'View in Document Vault', icon: <Database size={13} strokeWidth={1.8} />, onClick: () => h.onOpenVault(c.catererId) })
    actions.push({ label: 'Go-live Monitor', icon: <Rocket size={13} strokeWidth={1.8} />, onClick: h.onOpenGolive })
  }
  actions.push({ label: 'View Audit', icon: <History size={13} strokeWidth={1.8} />, onClick: () => h.onViewDetail(c.id) })
  if (!['draft', 'canceled', 'expired', 'signed'].includes(c.status)) {
    actions.push({
      label: 'Cancel Contract',
      icon: <XCircle size={13} strokeWidth={1.8} />,
      color: '#f87171',
      onClick: () => { if (window.confirm('Cancel this contract? This cannot be undone.')) h.onCancel(c) },
    })
  }
  return actions
}

export function ContractManagement() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch]               = useState('')
  // Preselects from `?catererId=` — the deep-link target for Caterers'
  // "Open Contract Management" action and Contract rows' own "View in
  // Document Vault"-style cross-links (see `AdminCaterersPage.tsx`).
  const [filterCaterer, setFilterCaterer] = useState(searchParams.get('catererId') ?? '')
  const [filterStatus, setFilterStatus]   = useState<ContractStatus | ''>('')
  const [filterType, setFilterType]       = useState<ContractType | ''>('')
  const [openMenuId, setOpenMenuId]       = useState<string | null>(null)
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const [showWizard, setShowWizard]       = useState(false)

  // Consume the query param once (so subsequent filter changes don't fight
  // with a stale URL) — same pattern as removing a one-shot deep link.
  useEffect(() => {
    if (searchParams.has('catererId')) {
      setSearchParams(params => { params.delete('catererId'); return params }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listQuery = useContracts(
    {
      caterer: filterCaterer || undefined,
      status: filterStatus || undefined,
      type: filterType || undefined,
    },
    {
      // Same rationale as `ContractSlideOver`'s detail-query polling: keep
      // the table from going stale while any visible contract is in a
      // transient, webhook-driven state.
      refetchInterval: query => {
        const items = query.state.data?.items ?? []
        return items.some(c => PENDING_STATUSES.includes(c.status)) ? 20_000 : false
      },
    },
  )
  const catererListQuery = useCaterers({ limit: 100 })
  const templatesQuery = useContractTemplates()
  const exportMutation = useExportContracts()

  const catererNameById = useMemo(() => {
    const map = new Map<string, string>()
    catererListQuery.data?.items.forEach(c => map.set(c.id, c.name))
    return map
  }, [catererListQuery.data])

  const templateNameByType = useMemo(() => {
    const map = new Map<string, string>()
    templatesQuery.data?.forEach(t => map.set(t.type, t.name))
    return map
  }, [templatesQuery.data])

  const readyMutation = useReadyContract()
  const sendMutation = useSendContract()
  const retryMutation = useRetryContract()
  const resendMutation = useResendContract()
  const cancelMutation = useCancelContract()
  const downloadMutation = useDownloadContract()

  const items = listQuery.data?.items ?? []

  const total           = items.length
  const pending         = items.filter(c => PENDING_STATUSES.includes(c.status)).length
  const signed          = items.filter(c => c.status === 'signed').length
  const declinedExpired = items.filter(c => DECLINED_OR_EXPIRED_STATUSES.includes(c.status)).length

  const filtered = items.filter(c => {
    if (search) {
      const q = search.toLowerCase()
      const catererName = catererNameById.get(c.catererId) ?? ''
      const contractName = templateNameByType.get(c.type) ?? CONTRACT_TYPE_LABELS[c.type] ?? c.type
      if (
        !contractName.toLowerCase().includes(q) &&
        !catererName.toLowerCase().includes(q) &&
        !(c.signatoryName ?? '').toLowerCase().includes(q) &&
        !c.type.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const hasFilter = !!(search || filterCaterer || filterStatus || filterType)

  function resetFilters() {
    setSearch(''); setFilterCaterer(''); setFilterStatus(''); setFilterType('')
  }

  function handleReady(c: ContractListItemViewModel) {
    readyMutation.mutate({ cid: c.id, catererId: c.catererId })
  }
  function handleSend(c: ContractListItemViewModel) {
    sendMutation.mutate({ cid: c.id, catererId: c.catererId })
  }
  function handleRetry(c: ContractListItemViewModel) {
    retryMutation.mutate({ cid: c.id, catererId: c.catererId })
  }
  function handleResend(c: ContractListItemViewModel) {
    resendMutation.mutate(c.id)
  }
  function handleCancel(c: ContractListItemViewModel) {
    cancelMutation.mutate({ cid: c.id, catererId: c.catererId })
  }
  function handleDownload(id: string) {
    downloadMutation.mutate(id)
  }

  const rowActionHandlers: RowActionHandlers = {
    onViewDetail: setSelectedContractId,
    onSend: handleSend,
    onReady: handleReady,
    onRetry: handleRetry,
    onResend: handleResend,
    onCancel: handleCancel,
    onDownload: handleDownload,
    onOpenVault: catererId => navigate(`/admin/document-vault?catererId=${catererId}`),
    onOpenGolive: () => navigate('/admin/golive-monitor'),
  }

  return (
    <div className="p-4 lg:p-7 max-w-[1500px]">
      <PageHeader
        badge={{ icon: <FileSignature size={12} strokeWidth={2.5} />, label: 'Contract Management' }}
        title="Contract Management"
        subtitle="Send contracts via Dropbox Sign, track signature status, and link agreements to caterer modules and pricing."
        size="page"
        glowColor="rgba(163,230,53,0.06)"
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportMutation.mutate({
                caterer: filterCaterer || undefined,
                status: filterStatus || undefined,
                type: filterType || undefined,
                format: 'csv',
              })}
              disabled={exportMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
            >
              <Download size={13} strokeWidth={2} />{exportMutation.isPending ? 'Exporting…' : 'Export'}
            </button>
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'var(--accent)', color: '#07070a' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            >
              <Plus size={13} strokeWidth={2.5} />New Contract
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Contracts"    value={total}          valueColor="blue"  trend="all time"      icon={<FileText      size={16} strokeWidth={1.8} />} />
        <StatCard label="Pending Signature"  value={pending}        valueColor="amber" trend="awaiting sign" icon={<Clock         size={16} strokeWidth={1.8} />} />
        <StatCard label="Signed"             value={signed}         valueColor="lime"  trend="completed"     icon={<CheckCircle2  size={16} strokeWidth={1.8} />} />
        <StatCard label="Declined / Expired" value={declinedExpired} valueColor="red"  trend="action needed" icon={<AlertTriangle size={15} strokeWidth={1.8} />} />
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap items-center gap-2.5 mb-5 rounded-2xl px-5 py-3.5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <Filter size={13} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />

        <div className="relative">
          <Search size={12} strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-4)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contracts…"
            className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[180px]"
            style={{
              background: 'var(--bg-inner)',
              border: `1px solid ${search ? '#a3e63550' : 'var(--border-strong)'}`,
              color: 'var(--text-2)',
            }}
          />
        </div>

        <SelectFilter label="All Caterers" value={filterCaterer} onChange={setFilterCaterer}
          options={(catererListQuery.data?.items ?? []).map(c => ({ value: c.id, label: c.name }))} />
        <SelectFilter label="All Statuses" value={filterStatus}  onChange={v => setFilterStatus(v as ContractStatus | '')}
          options={Object.entries(CONTRACT_STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Types"    value={filterType}    onChange={v => setFilterType(v as ContractType | '')}
          options={Object.entries(CONTRACT_TYPE_LABELS).map(([v, label]) => ({ value: v, label }))} />

        <div className="flex items-center gap-2 flex-1 justify-end" style={{ minWidth: 'max-content' }}>
          {listQuery.isFetching && !listQuery.isLoading && <InlineLoader size={12} />}
          {hasFilter && (
            <button onClick={resetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
              style={{ color: 'var(--text-3)', background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
              <RotateCcw size={12} strokeWidth={2} />Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '900px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.label} className="text-left px-4 py-3"
                    style={{ width: col.width, minWidth: col.width !== 'auto' ? col.width : undefined }}>
                    <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listQuery.isLoading ? (
                <tr>
                  <td colSpan={TABLE_COLS.length}>
                    <FullPageLoader label="Loading contracts…" />
                  </td>
                </tr>
              ) : listQuery.isError ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle size={28} strokeWidth={1.2} style={{ color: '#f87171' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>
                        {listQuery.error?.message ?? 'Failed to load contracts.'}
                      </span>
                      <button onClick={() => listQuery.refetch()}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
                        style={{ color: 'var(--text-2)', background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
                        <RotateCcw size={12} strokeWidth={2} />Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileSignature size={30} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No contracts match your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => {
                  const contractName = templateNameByType.get(c.type) ?? CONTRACT_TYPE_LABELS[c.type] ?? c.type
                  const catererName = catererNameById.get(c.catererId) ?? c.catererId
                  return (
                    <tr key={c.id}
                      className="transition-colors cursor-pointer"
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                      onClick={() => setSelectedContractId(c.id)}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FilePen size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{contractName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{catererName}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                          {CONTRACT_TYPE_LABELS[c.type] ?? c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{c.signatoryName ?? '—'}</span>
                          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{c.signatoryEmail ?? ''}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
                          {c.sentAt ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <DropdownMenu
                          open={openMenuId === c.id}
                          onToggle={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                          onClose={() => setOpenMenuId(null)}
                          actions={buildRowActions(c, rowActionHandlers)}
                          minWidth="220px"
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
            {filtered.length} contract{filtered.length !== 1 ? 's' : ''}{hasFilter ? ` (filtered from ${total})` : ''}
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>
              {listQuery.dataUpdatedAt ? `Last sync: ${formatRelativeSync(listQuery.dataUpdatedAt)}` : 'Not yet synced'}
            </span>
          </div>
        </div>
      </div>

      {selectedContractId && (
        <ContractSlideOver
          contractId={selectedContractId}
          onClose={() => setSelectedContractId(null)}
        />
      )}

      {showWizard && (
        <SendWizard onClose={() => setShowWizard(false)} />
      )}
    </div>
  )
}
