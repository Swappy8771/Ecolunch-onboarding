import { useState } from 'react'
import {
  ClipboardCheck, Search, RefreshCw, Download,
  Eye, Check, AlertTriangle, Clock, XCircle, CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@shared/components/PageHeader'
import { FilterBar } from '@shared/components/FilterBar'
import { SelectFilter } from '@shared/components/SelectFilter'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { useLang } from '@shared/context/LangContext'
import { TypeBadge } from '../components/TypeBadge'
import { PriorityBadge, PRIORITY_META } from '../components/PriorityBadge'
import { VStatusPill, STATUS_META } from '../components/VStatusPill'
import { DetailDrawer } from '../components/DetailDrawer'
import { DropdownMenu } from '@shared/components/DropdownMenu'
import { MessageCircle, MessageSquare, Send, History, XCircle as XCircleIcon } from 'lucide-react'
import { ALL_ITEMS } from '../services/mock/validationMock'
import type { VType, ValidationItem } from '../services/mock/validationMock'

/* ── Row actions ─────────────────────────────────────────── */
const SECONDARY_ACTIONS = [
  { label: 'Request Correction', icon: <MessageSquare size={13} strokeWidth={1.8} />, color: '#fbbf24'       },
  { label: 'Reject',             icon: <XCircleIcon   size={13} strokeWidth={1.8} />, color: '#f87171'       },
  { label: 'Add Internal Note',  icon: <MessageCircle size={13} strokeWidth={1.8} />, color: 'var(--text-3)' },
  { label: 'Send via EcoLoop',   icon: <Send          size={13} strokeWidth={1.8} />, color: '#60a5fa'       },
  { label: 'View History',       icon: <History       size={13} strokeWidth={1.8} />, color: 'var(--text-3)' },
]

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

  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statFilter, setStatFilter] = useState('')
  const [prioFilter, setPrioFilter] = useState('')
  const [catFilter,  setCatFilter]  = useState('')
  const [revFilter,  setRevFilter]  = useState('')
  const [applied,    setApplied]    = useState({ search:'', type:'', stat:'', prio:'', cat:'', rev:'' })
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [drawerItem, setDrawerItem] = useState<ValidationItem | null>(null)

  const filtered = ALL_ITEMS.filter(item => {
    if (applied.search && !item.title.toLowerCase().includes(applied.search.toLowerCase()) && !item.caterer.toLowerCase().includes(applied.search.toLowerCase())) return false
    if (applied.type && item.type     !== applied.type)   return false
    if (applied.stat && item.status   !== applied.stat)   return false
    if (applied.prio && item.priority !== applied.prio)   return false
    if (applied.cat  && item.caterer  !== applied.cat)    return false
    if (applied.rev  && item.reviewer !== applied.rev)    return false
    return true
  })

  const stats = {
    pending:     ALL_ITEMS.filter(i => i.status === 'pending').length,
    approved:    ALL_ITEMS.filter(i => i.status === 'approved').length,
    corrections: ALL_ITEMS.filter(i => i.status === 'correction').length,
    critical:    ALL_ITEMS.filter(i => i.priority === 'critical').length,
  }

  const caterers  = Array.from(new Set(ALL_ITEMS.map(i => i.caterer)))
  const reviewers = Array.from(new Set(ALL_ITEMS.map(i => i.reviewer)))
  const hasFilter = Object.values(applied).some(v => v !== '')

  function apply() {
    setApplied({ search, type: typeFilter, stat: statFilter, prio: prioFilter, cat: catFilter, rev: revFilter })
  }
  function reset() {
    setSearch(''); setTypeFilter(''); setStatFilter(''); setPrioFilter(''); setCatFilter(''); setRevFilter('')
    setApplied({ search:'', type:'', stat:'', prio:'', cat:'', rev:'' })
  }

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">
      <PageHeader
        size="page"
        badge={{ icon: <ClipboardCheck size={12} strokeWidth={2.5} />, label: 'Validation Center' }}
        title={t.centreValidation.title}
        subtitle="Review, approve, reject, and manage onboarding validation items."
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
              <input placeholder="Search items…"
                className="pl-9 pr-3 py-2.5 rounded-xl text-[12.5px] outline-none w-[180px]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }} />
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
              <RefreshCw size={13} strokeWidth={2} />Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
              <Download size={13} strokeWidth={2} />Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pending Review"        value={stats.pending}     valueColor="blue"  trend="awaiting action" icon={<Clock         size={15} strokeWidth={1.8} />} />
        <StatCard label="Approved Today"        value={stats.approved}    valueColor="lime"  trend="validated"       icon={<CheckCircle2  size={15} strokeWidth={1.8} />} />
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
        <SelectFilter label="All Types" value={typeFilter} onChange={setTypeFilter}
          options={(['Document','Contract','Banking','Menu','Establishment','Pricing','Module','Go-Live','Smart Import'] as VType[]).map(v => ({ value: v, label: v }))} />
        <SelectFilter label="All Statuses" value={statFilter} onChange={setStatFilter}
          options={Object.entries(STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Priorities" value={prioFilter} onChange={setPrioFilter}
          options={Object.entries(PRIORITY_META).map(([v, m]) => ({ value: v, label: m.label }))} />
        <SelectFilter label="All Caterers" value={catFilter} onChange={setCatFilter}
          options={caterers.map(c => ({ value: c, label: c }))} />
        <SelectFilter label="All Reviewers" value={revFilter} onChange={setRevFilter}
          options={reviewers.map(r => ({ value: r, label: r }))} />
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
              {filtered.length === 0 ? (
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
                      {item.title}
                    </div>
                    <div className="text-[12px] mt-0.5 line-clamp-1 max-w-[320px]" style={{ color: 'var(--text-4)' }}>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}>
                    <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{item.caterer}</span>
                  </td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}><TypeBadge type={item.type} /></td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}><VStatusPill status={item.status} /></td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}><PriorityBadge priority={item.priority} /></td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => setDrawerItem(item)}>
                    <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{item.created}</span>
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
                      {item.status !== 'approved' && (
                        <button
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
                        actions={SECONDARY_ACTIONS}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
            {filtered.length} of {ALL_ITEMS.length} items
          </span>
          <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>
            {ALL_ITEMS.filter(i => i.status === 'pending').length} pending review
          </span>
        </div>
      </div>

      <DetailDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
    </div>
  )
}
