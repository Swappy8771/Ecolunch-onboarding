import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ClipboardCheck, Search, RefreshCw, Download,
  Eye, Check, AlertTriangle, Clock, XCircle, CheckCircle2,
  MessageCircle, MessageSquare, Send, History, XCircle as XCircleIcon,
} from 'lucide-react'
import { PageHeader } from '@shared/components/PageHeader'
import { FilterBar } from '@shared/components/FilterBar'
import { SelectFilter } from '@shared/components/SelectFilter'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { InlineLoader } from '@shared/ui/InlineLoader'
import { StatCard } from '@/features/adminDashboard/components/StatCard'
import { useLang } from '@shared/context/LangContext'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import { useValidationItems } from '@/features/adminValidation/hooks/useValidationItems'
import {
  useApproveValidation, useRejectValidation, useRequestCorrectionValidation,
  useAddValidationNote, useSendValidationEcoLoop,
} from '@/features/adminValidation/hooks/useValidationDecisions'
import { useExportValidations } from '@/features/adminValidation/hooks/useExportValidations'
import type { ValidationItemViewModel, ValidationType, ValidationStatus, ValidationPriority } from '@/features/adminValidation/types/validation.types'
import { TypeBadge, TYPE_META } from '../components/TypeBadge'
import { PriorityBadge, PRIORITY_META } from '../components/PriorityBadge'
import { VStatusPill, STATUS_META } from '../components/VStatusPill'
import { DetailDrawer } from '../components/DetailDrawer'
import { ValidationActionModal, type ValidationActionVariant } from '../components/ValidationActionModal'
import { DropdownMenu, type DropdownAction } from '@shared/components/DropdownMenu'

/* ── Row actions ─────────────────────────────────────────── */
interface RowActionHandlers {
  onRequestCorrection: (item: ValidationItemViewModel) => void
  onReject: (item: ValidationItemViewModel) => void
  onAddNote: (item: ValidationItemViewModel) => void
  onSendEcoLoop: (item: ValidationItemViewModel) => void
  onViewHistory: (item: ValidationItemViewModel) => void
}

function buildRowActions(item: ValidationItemViewModel, h: RowActionHandlers): DropdownAction[] {
  const isTerminal = item.status === 'approved' || item.status === 'closed'
  return [
    { label: 'Request Correction', icon: <MessageSquare size={13} strokeWidth={1.8} />, color: '#fbbf24', disabled: isTerminal, onClick: () => h.onRequestCorrection(item) },
    { label: 'Reject',             icon: <XCircleIcon   size={13} strokeWidth={1.8} />, color: '#f87171', disabled: isTerminal, onClick: () => h.onReject(item) },
    { label: 'Add Internal Note',  icon: <MessageCircle size={13} strokeWidth={1.8} />, color: 'var(--text-3)', onClick: () => h.onAddNote(item) },
    { label: 'Send via EcoLoop',   icon: <Send          size={13} strokeWidth={1.8} />, color: '#60a5fa',       onClick: () => h.onSendEcoLoop(item) },
    { label: 'View History',       icon: <History       size={13} strokeWidth={1.8} />, color: 'var(--text-3)', onClick: () => h.onViewHistory(item) },
  ]
}

/* ── Table columns ──────────────────────────────────────── */
const TABLE_COLS = [
  { label: 'Validation Item', width: 'auto'  },
  { label: 'Caterer',         width: '140px' },
  { label: 'Type',            width: '128px' },
  { label: 'Status',          width: '178px' },
  { label: 'Priority',        width: '100px' },
  { label: 'Created',         width: '106px' },
  { label: 'Actions',         width: '148px' },
]

/* ── Page ───────────────────────────────────────────────── */
export function ValidationCenter() {
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const deepLinkCatererId = searchParams.get('catererId') ?? ''

  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState<ValidationType | ''>('')
  const [statFilter, setStatFilter] = useState<ValidationStatus | ''>('')
  const [prioFilter, setPrioFilter] = useState<ValidationPriority | ''>('')
  const [catFilter,  setCatFilter]  = useState(deepLinkCatererId)
  const [applied,    setApplied]    = useState({ search: '', type: '' as ValidationType | '', stat: '' as ValidationStatus | '', prio: '' as ValidationPriority | '', cat: deepLinkCatererId })
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [drawerItem, setDrawerItem] = useState<ValidationItemViewModel | null>(null)
  const [actionTarget, setActionTarget] = useState<{ item: ValidationItemViewModel; variant: ValidationActionVariant } | null>(null)

  // Deep-link target for Caterers' "Open Validation Items" action — consumed once so it doesn't fight with later filter changes.
  useEffect(() => {
    if (searchParams.has('catererId')) {
      setSearchParams(params => { params.delete('catererId'); return params }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listQuery = useValidationItems({
    caterer: applied.cat || undefined,
    type: applied.type || undefined,
    status: applied.stat || undefined,
    priority: applied.prio || undefined,
  })
  const exportMutation = useExportValidations()
  /** Unfiltered — backs the stat cards regardless of the currently-applied filters, same pattern as Caterers'/Contract Management's own stats queries. */
  const statsQuery = useValidationItems({})
  const catererListQuery = useCaterers({ limit: 100 })

  const catererNameById = useMemo(() => {
    const map = new Map<string, string>()
    catererListQuery.data?.items.forEach(c => map.set(c.id, c.name))
    return map
  }, [catererListQuery.data])

  const approveMutation = useApproveValidation()
  const rejectMutation = useRejectValidation()
  const requestCorrectionMutation = useRequestCorrectionValidation()
  const addNoteMutation = useAddValidationNote()
  const sendEcoLoopMutation = useSendValidationEcoLoop()

  const items = listQuery.data?.items ?? []
  const statsItems = statsQuery.data?.items ?? []

  const filtered = items.filter(item => {
    if (!applied.search) return true
    const q = applied.search.toLowerCase()
    const catererName = catererNameById.get(item.catererId) ?? ''
    return (item.title ?? '').toLowerCase().includes(q)
      || (item.description ?? '').toLowerCase().includes(q)
      || catererName.toLowerCase().includes(q)
  })

  const stats = {
    pending:     statsItems.filter(i => i.status === 'pending_review' || i.status === 'in_review').length,
    approved:    statsItems.filter(i => i.status === 'approved').length,
    corrections: statsItems.filter(i => i.status === 'correction_requested').length,
    critical:    statsItems.filter(i => i.priority === 'critical').length,
  }

  const hasFilter = Object.values(applied).some(v => v !== '')

  function apply() {
    setApplied({ search, type: typeFilter, stat: statFilter, prio: prioFilter, cat: catFilter })
  }
  function reset() {
    setSearch(''); setTypeFilter(''); setStatFilter(''); setPrioFilter(''); setCatFilter('')
    setApplied({ search: '', type: '', stat: '', prio: '', cat: '' })
  }

  function handleApprove(item: ValidationItemViewModel) {
    approveMutation.mutate(item.id, { onSuccess: () => setDrawerItem(null) })
    setOpenMenuId(null)
  }

  function openActionModal(item: ValidationItemViewModel, variant: ValidationActionVariant) {
    setActionTarget({ item, variant })
    setOpenMenuId(null)
  }

  function confirmAction(input: { text: string; priority?: 'high' | 'medium' | 'low' }) {
    if (!actionTarget) return
    const { item, variant } = actionTarget
    const onSettled = () => { setActionTarget(null); setDrawerItem(null) }
    if (variant === 'reject') {
      rejectMutation.mutate({ vid: item.id, reason: input.text }, { onSuccess: onSettled })
    } else if (variant === 'request_correction') {
      requestCorrectionMutation.mutate({ vid: item.id, description: input.text, priority: input.priority }, { onSuccess: onSettled })
    } else if (variant === 'add_note') {
      addNoteMutation.mutate({ vid: item.id, note: input.text }, { onSuccess: onSettled })
    } else {
      sendEcoLoopMutation.mutate({ vid: item.id, message: input.text }, { onSuccess: onSettled })
    }
  }

  const actionMutationPending =
    rejectMutation.isPending || requestCorrectionMutation.isPending || addNoteMutation.isPending || sendEcoLoopMutation.isPending

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">
      <PageHeader
        size="page"
        badge={{ icon: <ClipboardCheck size={12} strokeWidth={2.5} />, label: 'Validation Center' }}
        title={t.centreValidation.title}
        subtitle="Review, approve, reject, and manage onboarding validation items."
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => listQuery.refetch()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
              <RefreshCw size={13} strokeWidth={2} />Refresh
            </button>
            <button
              onClick={() => exportMutation.mutate({
                caterer: applied.cat || undefined,
                type: applied.type || undefined,
                status: applied.stat || undefined,
                priority: applied.prio || undefined,
                search: applied.search || undefined,
                format: 'csv',
              })}
              disabled={exportMutation.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
              <Download size={13} strokeWidth={2} />{exportMutation.isPending ? 'Exporting…' : 'Export'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pending Review"        value={stats.pending}     valueColor="blue"  trend="awaiting action" icon={<Clock         size={15} strokeWidth={1.8} />} />
        <StatCard label="Approved"               value={stats.approved}    valueColor="lime"  trend="validated"       icon={<CheckCircle2  size={15} strokeWidth={1.8} />} />
        <StatCard label="Corrections Requested" value={stats.corrections} valueColor="amber" trend="needs response"  icon={<AlertTriangle size={14} strokeWidth={1.8} />} />
        <StatCard label="Critical Issues"       value={stats.critical}    valueColor="red"   trend="urgent"          icon={<XCircle       size={15} strokeWidth={1.8} />} />
      </div>

      <FilterBar onApply={apply} onReset={reset} hasFilter={hasFilter}>
        <div className="relative">
          <Search size={12} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search validation item…"
            className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[180px]"
            style={{ background: 'var(--bg-inner)', border: `1px solid ${search ? '#a3e63550' : 'var(--border-strong)'}`, color: 'var(--text-2)' }} />
        </div>
        <SelectFilter label="All Types" value={typeFilter} onChange={v => setTypeFilter(v as ValidationType | '')}
          options={Object.entries(TYPE_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Statuses" value={statFilter} onChange={v => setStatFilter(v as ValidationStatus | '')}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Priorities" value={prioFilter} onChange={v => setPrioFilter(v as ValidationPriority | '')}
          options={Object.entries(PRIORITY_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Caterers" value={catFilter} onChange={setCatFilter}
          options={(catererListQuery.data?.items ?? []).map(c => ({ value: c.id, label: c.name }))} />
      </FilterBar>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '900px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.label}
                    className={`text-left px-4 py-3 ${col.label === 'Validation Item' ? '' : 'whitespace-nowrap'}`}
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
                <tr><td colSpan={TABLE_COLS.length}><FullPageLoader label="Loading validation queue…" /></td></tr>
              ) : listQuery.isError ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle size={28} strokeWidth={1.2} style={{ color: '#f87171' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>{listQuery.error?.message ?? 'Failed to load validation queue.'}</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardCheck size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>{t.centreValidation.noResults}</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((item, idx) => (
                <tr key={item.id}
                  className="transition-colors group"
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}>
                    <div className="text-[13.5px] font-semibold leading-snug group-hover:underline"
                      style={{ color: 'var(--text-1)', textDecorationColor: 'var(--border-default)' }}>
                      {item.title ?? 'Untitled item'}
                    </div>
                    <div className="text-[12px] mt-0.5 line-clamp-1 max-w-[320px]" style={{ color: 'var(--text-4)' }}>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}>
                    <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{catererNameById.get(item.catererId) ?? item.catererId}</span>
                  </td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}><TypeBadge type={item.type} /></td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}><VStatusPill status={item.status} /></td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}><PriorityBadge priority={item.priority} /></td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}>
                    <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{item.createdAt.slice(0, 10)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDrawerItem(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                        style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#60a5fa50'; el.style.color = '#60a5fa' }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-strong)'; el.style.color = 'var(--text-2)' }}>
                        <Eye size={12} strokeWidth={2} />View
                      </button>
                      {item.status !== 'approved' && item.status !== 'closed' && (
                        <button
                          onClick={() => handleApprove(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.22)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.12)' }}>
                          <Check size={12} strokeWidth={2.5} />Approve
                        </button>
                      )}
                      <DropdownMenu
                        open={openMenuId === item.id}
                        onToggle={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                        onClose={() => setOpenMenuId(null)}
                        actions={buildRowActions(item, {
                          onRequestCorrection: i => openActionModal(i, 'request_correction'),
                          onReject: i => openActionModal(i, 'reject'),
                          onAddNote: i => openActionModal(i, 'add_note'),
                          onSendEcoLoop: i => openActionModal(i, 'send_ecoloop'),
                          onViewHistory: i => setDrawerItem(i),
                        })}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[12px] tabular-nums flex items-center gap-2" style={{ color: 'var(--text-4)' }}>
            {filtered.length} of {items.length} items
            {listQuery.isFetching && !listQuery.isLoading && <InlineLoader size={12} />}
          </span>
          <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>
            {stats.pending} pending review
          </span>
        </div>
      </div>

      <DetailDrawer
        item={drawerItem}
        catererName={drawerItem ? (catererNameById.get(drawerItem.catererId) ?? drawerItem.catererId) : ''}
        onClose={() => setDrawerItem(null)}
        onApprove={() => drawerItem && handleApprove(drawerItem)}
        onReject={() => drawerItem && openActionModal(drawerItem, 'reject')}
        onRequestCorrection={() => drawerItem && openActionModal(drawerItem, 'request_correction')}
        onAddNote={() => drawerItem && openActionModal(drawerItem, 'add_note')}
        onSendEcoLoop={() => drawerItem && openActionModal(drawerItem, 'send_ecoloop')}
      />

      {actionTarget && (
        <ValidationActionModal
          itemTitle={actionTarget.item.title}
          variant={actionTarget.variant}
          isSubmitting={actionMutationPending}
          onCancel={() => setActionTarget(null)}
          onConfirm={confirmAction}
        />
      )}
    </div>
  )
}
