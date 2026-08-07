import { useState } from 'react'
import { Search, ChevronDown, Clock } from 'lucide-react'
import type { ConversationViewModel, ConversationStatus, ConversationPriority, LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'
import { TicketStatusBadge, PriorityBadge, LinkedModuleBadge } from './TicketStatusBadge'

interface TicketListProps {
  tickets: ConversationViewModel[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState<ConversationStatus | ''>('')
  const [priority, setPriority] = useState<ConversationPriority | ''>('')
  const [linkedModule, setLinkedModule] = useState<LinkedModule | ''>('')
  const [caterer,  setCaterer]  = useState('')

  const caterers = [...new Set(tickets.map(t => t.catererName))]

  const filtered = tickets.filter(t => {
    if (search   && !t.subject.toLowerCase().includes(search.toLowerCase()) &&
                    !t.catererName.toLowerCase().includes(search.toLowerCase())) return false
    if (status       && t.status       !== status)       return false
    if (priority      && t.priority      !== priority)      return false
    if (linkedModule  && t.linkedModule  !== linkedModule)  return false
    if (caterer       && t.catererName   !== caterer)       return false
    return true
  })

  function sel<T extends string>(
    label: string,
    setter: (v: T | '') => void,
    current: string,
    options: { value: T; label: string }[]
  ) {
    return (
      <div className="relative">
        <select value={current} onChange={e => setter(e.target.value as T | '')}
          className="appearance-none pl-3 pr-6 py-1.5 rounded-lg text-[11.5px] font-medium outline-none cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: current ? 'var(--text-1)' : 'var(--text-4)' }}>
          <option value="">{label}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={10} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={12} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tickets, caterers…"
          className="w-full pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {sel('Status',   setStatus,   status,   [
          { value: 'open',                label: 'Open' },
          { value: 'waiting_for_caterer',  label: 'Waiting on Caterer' },
          { value: 'waiting_for_admin',    label: 'Waiting on Admin' },
          { value: 'resolved',             label: 'Resolved' },
          { value: 'closed',               label: 'Closed' },
        ])}
        {sel('Priority', setPriority, priority, [
          { value: 'urgent', label: 'Urgent' },
          { value: 'high',   label: 'High' },
          { value: 'normal', label: 'Normal' },
          { value: 'low',    label: 'Low' },
        ])}
        {sel('Linked Module', setLinkedModule, linkedModule, [
          { value: 'validation',       label: 'Validation' },
          { value: 'documents',        label: 'Documents' },
          { value: 'contracts',        label: 'Contracts' },
          { value: 'modules-pricing',  label: 'Modules & Pricing' },
          { value: 'go-live',          label: 'Go-live' },
          { value: 'corrections',      label: 'Corrections' },
          { value: 'smart-import',     label: 'Smart Import' },
          { value: 'school_meals',     label: 'School Meals' },
          { value: 'daycare_meals',    label: 'Daycare / CPE Meals' },
          { value: 'camp_meals',       label: 'Camp Meals' },
          { value: 'accounting',       label: 'Accounting' },
          { value: 'reportiq',         label: 'ReportIQ' },
        ])}
        {sel('Caterer',  setCaterer,  caterer,  caterers.map(c => ({ value: c, label: c })))}
        <span className="ml-auto text-[11px]" style={{ color: 'var(--text-4)' }}>{filtered.length} tickets</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1.5 pr-0.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Search size={24} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
            <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>No onboarding follow-ups currently exist.</p>
          </div>
        ) : (
          filtered.map(t => {
            const isSelected = t.id === selectedId

            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className="w-full text-left rounded-xl px-3.5 py-3 flex flex-col gap-1.5 cursor-pointer transition-all"
                style={{
                  background:   isSelected ? 'var(--accent-dim)' : 'var(--bg-card)',
                  border:       `1px solid ${isSelected ? 'var(--accent-border)' : 'var(--border-default)'}`,
                  borderLeft:   t.priority === 'urgent' ? `3px solid #f87171` : `1px solid ${isSelected ? 'var(--accent-border)' : 'var(--border-default)'}`,
                }}
              >
                {/* Row 1 */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono font-bold truncate" style={{ color: 'var(--text-4)' }}>{t.id.slice(0, 8)}</span>
                  <TicketStatusBadge status={t.status} />
                </div>

                {/* Subject */}
                <p className="text-[12.5px] font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text-1)' }}>
                  {t.subject}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--text-2)' }}>{t.catererName}</span>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--text-4)' }} />
                    <LinkedModuleBadge module={t.linkedModule} />
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>

                {/* Footer */}
                <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                  <Clock size={9} strokeWidth={2} />
                  <span className="text-[10.5px]">{t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : 'No messages yet'}</span>
                  {t.assigneeName && <span className="text-[10.5px] ml-1">· {t.assigneeName}</span>}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
