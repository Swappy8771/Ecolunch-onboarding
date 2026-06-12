import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  FileSignature, Search, Download, Filter, RotateCcw,
  Eye, Send, RefreshCw, XCircle, FileDown, ExternalLink,
  DollarSign, History, FilePen, Link2,
  Database, Rocket, Calendar, Clock, CheckCircle2, AlertTriangle, FileText, Puzzle, Plus,
} from 'lucide-react'
import { PageHeader } from '@shared/components/PageHeader'
import { SelectFilter } from '@shared/components/SelectFilter'
import { DropdownMenu } from '@shared/components/DropdownMenu'
import { StatCard } from '@/features/dashboard/components/StatCard'
import type { Contract } from '../types/contract.types'
import {
  CONTRACTS, STATUS_META, CONTRACT_TYPES, CATERERS_LIST,
} from '../services/mock/contractsMock'
import { StatusBadge } from '../components/StatusBadge'
import { ContractSlideOver } from '../components/ContractSlideOver'
import { SendWizard } from '../components/SendWizard'

const TABLE_COLS = [
  { label: 'Contract Name', width: 'auto'  },
  { label: 'Caterer',       width: '160px' },
  { label: 'Type',          width: '130px' },
  { label: 'Signatory',     width: '160px' },
  { label: 'Status',        width: '160px' },
  { label: 'Sent Date',     width: '110px' },
  { label: 'Actions',       width: '60px'  },
]

function buildRowActions(c: Contract): { label: string; icon: ReactNode; color?: string }[] {
  const actions: { label: string; icon: ReactNode; color?: string }[] = [
    { label: 'View Detail',          icon: <Eye        size={13} strokeWidth={1.8} /> },
    { label: 'Link to Module',       icon: <Puzzle     size={13} strokeWidth={1.8} /> },
    { label: 'Link to Fee Schedule', icon: <DollarSign size={13} strokeWidth={1.8} /> },
    { label: 'View Audit',           icon: <History    size={13} strokeWidth={1.8} /> },
  ]
  if (c.status === 'ready' || c.status === 'draft')
    actions.splice(1, 0, { label: 'Send for Signature', icon: <Send      size={13} strokeWidth={1.8} /> })
  if (c.status === 'sent' || c.status === 'viewed')
    actions.splice(1, 0, { label: 'Resend / Remind',    icon: <RefreshCw size={13} strokeWidth={1.8} /> })
  if (c.status === 'signed') {
    actions.push({ label: 'Download Signed Doc',     icon: <FileDown  size={13} strokeWidth={1.8} /> })
    actions.push({ label: 'View in Document Vault',  icon: <Database  size={13} strokeWidth={1.8} /> })
    actions.push({ label: 'Go-live Monitor',         icon: <Rocket    size={13} strokeWidth={1.8} /> })
  }
  if (!['draft', 'cancelled', 'expired'].includes(c.status))
    actions.push({ label: 'Cancel Contract', icon: <XCircle size={13} strokeWidth={1.8} />, color: '#f87171' })
  actions.push({ label: 'Open in Dropbox', icon: <ExternalLink size={13} strokeWidth={1.8} /> })
  return actions
}

export function ContractManagement() {
  const [search, setSearch]               = useState('')
  const [filterCaterer, setFilterCaterer] = useState('')
  const [filterStatus, setFilterStatus]   = useState('')
  const [filterType, setFilterType]       = useState('')
  const [openMenuId, setOpenMenuId]       = useState<string | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [wizardContract, setWizardContract]     = useState<Contract | null>(null)
  const [showWizard, setShowWizard]             = useState(false)

  const total           = CONTRACTS.length
  const pending         = CONTRACTS.filter(c => ['sent', 'viewed', 'partially_signed', 'ready'].includes(c.status)).length
  const signed          = CONTRACTS.filter(c => c.status === 'signed').length
  const declinedExpired = CONTRACTS.filter(c => ['declined', 'expired', 'cancelled', 'error'].includes(c.status)).length

  const filtered = CONTRACTS.filter(c => {
    if (filterCaterer && c.caterer !== filterCaterer) return false
    if (filterStatus  && c.status  !== filterStatus)  return false
    if (filterType    && c.type    !== filterType)    return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.caterer.toLowerCase().includes(q) &&
        !c.signatoryName.toLowerCase().includes(q) &&
        !c.type.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const hasFilter = !!(search || filterCaterer || filterStatus || filterType)

  function resetFilters() {
    setSearch(''); setFilterCaterer(''); setFilterStatus(''); setFilterType('')
  }

  function openSendWizard(c: Contract | null = null) {
    setWizardContract(c)
    setShowWizard(true)
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
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
            >
              <Download size={13} strokeWidth={2} />Export
            </button>
            <button
              onClick={() => openSendWizard(null)}
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
          options={CATERERS_LIST.map(c => ({ value: c, label: c }))} />
        <SelectFilter label="All Statuses" value={filterStatus}  onChange={setFilterStatus}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Types"    value={filterType}    onChange={setFilterType}
          options={CONTRACT_TYPES.map(t => ({ value: t, label: t }))} />

        <div className="flex items-center gap-2 flex-1 justify-end" style={{ minWidth: 'max-content' }}>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileSignature size={30} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No contracts match your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr key={c.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                    onClick={() => setSelectedContract(c)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <FilePen size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{c.name}</span>
                        {c.documentVaultLinked && (
                          <span title="Linked in Document Vault">
                            <Link2 size={11} strokeWidth={2} style={{ color: '#60a5fa', flexShrink: 0 }} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{c.caterer}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{c.signatoryName}</span>
                        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{c.signatoryEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
                        {c.sentDate ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <DropdownMenu
                        open={openMenuId === c.id}
                        onToggle={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                        onClose={() => setOpenMenuId(null)}
                        actions={buildRowActions(c)}
                        minWidth="220px"
                      />
                    </td>
                  </tr>
                ))
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
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Last sync: just now</span>
          </div>
        </div>
      </div>

      {selectedContract && (
        <ContractSlideOver
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
          onSend={c => openSendWizard(c)}
        />
      )}

      {showWizard && (
        <SendWizard
          initialContract={wizardContract}
          contracts={CONTRACTS}
          onClose={() => { setShowWizard(false); setWizardContract(null) }}
        />
      )}
    </div>
  )
}
