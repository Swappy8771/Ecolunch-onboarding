import { useState } from 'react'
import { MessageCircle, Plus, X } from 'lucide-react'
import { StatusPill } from '../../shared/ui/StatusPill'
import { useLang } from '../../shared/context/LangContext'

type TicketStatus = 'open' | 'waiting-caterer' | 'waiting-ecolunch' | 'corrected' | 'approved' | 'blocking'
type Priority = 'low' | 'medium' | 'high'

interface Ticket {
  id: string
  blocker: boolean
  priority: Priority
  title: string
  context: string
  resp: string
  date: string
  status: TicketStatus
}

const TICKETS: Ticket[] = [
  {
    id: '#t-001', blocker: true, priority: 'high',
    title: 'Page 4 du contrat manquante',
    context: 'Concept Gourmet · Document Vault · Documents légaux',
    resp: 'Onboarding Admin', date: '2026-02-11 14:32',
    status: 'waiting-caterer',
  },
  {
    id: '#t-002', blocker: false, priority: 'medium',
    title: 'Conflit sur tarif Cycle rotatif — semaine 3',
    context: 'Concept Gourmet · Menus & Forfaits · Écoles — Cycle rotatif',
    resp: 'Onboarding Admin', date: '2026-02-10 10:14',
    status: 'open',
  },
  {
    id: '#t-003', blocker: false, priority: 'low',
    title: 'Smart Import Acomba — 6 catégories préremplies',
    context: 'Concept Gourmet · Smart Import · Acomba',
    resp: 'Système', date: '2026-02-09 17:01',
    status: 'approved',
  },
]

type FilterId = 'tous' | TicketStatus

function TicketStatusPill({ status }: { status: TicketStatus }) {
  const { t } = useLang()
  const map: Record<TicketStatus, { label: string; bg: string; color: string; border: string }> = {
    open:               { label: t.ecoloop.statuses.open,            bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.22)' },
    'waiting-caterer':  { label: t.ecoloop.statuses.waitingCaterer,  bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.22)' },
    'waiting-ecolunch': { label: t.ecoloop.statuses.waitingEcoLunch, bg: 'rgba(163,230,53,0.10)', color: '#a3e635', border: 'rgba(163,230,53,0.22)' },
    corrected:          { label: t.ecoloop.statuses.corrected,       bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.22)' },
    approved:           { label: t.ecoloop.statuses.approved,        bg: 'rgba(74,222,128,0.12)', color: '#4ade80', border: 'rgba(74,222,128,0.22)' },
    blocking:           { label: t.ecoloop.statuses.blockingGoLive,  bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.22)' },
  }
  const s = map[status]
  return <StatusPill label={s.label} bg={s.bg} color={s.color} border={s.border} />
}

function PriorityPill({ priority }: { priority: Priority }) {
  const { t } = useLang()
  const map: Record<Priority, { bg: string; color: string }> = {
    high:   { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
    medium: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
    low:    { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80' },
  }
  const labelMap: Record<Priority, string> = {
    high:   t.ecoloop.priority.high,
    medium: t.ecoloop.priority.medium,
    low:    t.ecoloop.priority.low,
  }
  const s = map[priority]
  return (
    <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {labelMap[priority]}
    </span>
  )
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const { t } = useLang()
  return (
    <div
      className="rounded-2xl p-5 flex items-start justify-between gap-4 card-float"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderLeft: ticket.blocker ? '3px solid #f87171' : '1px solid var(--border-default)',
      }}
    >
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{ticket.id}</span>
          {ticket.blocker && (
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
              {t.priority.blocker}
            </span>
          )}
          <PriorityPill priority={ticket.priority} />
        </div>
        <h3 className="text-[14px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
          {ticket.title}
        </h3>
        <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>{ticket.context}</p>
        <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
          Resp. {ticket.resp === 'Système' ? t.ecoloop.system : ticket.resp} · {ticket.date}
        </p>
      </div>
      <TicketStatusPill status={ticket.status} />
    </div>
  )
}

function NewTicketModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl p-7 flex flex-col gap-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: 'var(--text-4)' }}>
              {t.ecoloop.newTicket}
            </p>
            <h2 className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>
              {t.ecoloop.modal.title}
            </h2>
          </div>
          <button onClick={onClose} className="mt-1 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <input
          placeholder="Titre du ticket"
          className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Section"
            className="px-4 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
          />
          <input
            placeholder="Sous-section"
            className="px-4 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
          />
        </div>

        <select
          className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}
          defaultValue="medium"
        >
          <option value="low">{t.ecoloop.priority.low}</option>
          <option value="medium">{t.ecoloop.priority.medium}</option>
          <option value="high">{t.ecoloop.priority.high}</option>
        </select>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded cursor-pointer accent-[#a3e635]" />
          <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>{t.ecoloop.modal.blocking}</span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
          >
            {t.ecoloop.modal.cancel}
          </button>
          <button
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)', color: '#07070a' }}
          >
            {t.ecoloop.modal.create}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EcoLoop() {
  const { t } = useLang()
  const [activeFilter, setActiveFilter] = useState<FilterId>('tous')
  const [showModal, setShowModal] = useState(false)

  const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'tous',             label: t.ecoloop.tabs.all },
    { id: 'open',             label: t.ecoloop.tabs.open },
    { id: 'waiting-caterer',  label: t.ecoloop.tabs.waitingCaterer },
    { id: 'waiting-ecolunch', label: t.ecoloop.tabs.waitingEcoLunch },
    { id: 'corrected',        label: t.ecoloop.tabs.corrected },
    { id: 'approved',         label: t.ecoloop.tabs.approved },
    { id: 'blocking',         label: t.ecoloop.tabs.blocking },
  ]

  const filtered = activeFilter === 'tous'
    ? TICKETS
    : TICKETS.filter(t => t.status === activeFilter)

  const countFor = (id: FilterId) =>
    id === 'tous' ? TICKETS.length : TICKETS.filter(t => t.status === id).length

  return (
    <div className="p-7">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <MessageCircle size={12} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--accent)' }}>
              {t.ecoloop.clientTitle}
            </span>
          </div>
          <h1 className="text-[34px] font-bold tracking-tight leading-tight mb-2" style={{ color: 'var(--text-1)' }}>
            {t.ecoloop.title}
          </h1>
          <p className="text-[13px] leading-relaxed max-w-2xl" style={{ color: 'var(--text-3)' }}>
            {t.ecoloop.clientDescription}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold shrink-0 cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: '#07070a' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          {t.ecoloop.newTicket}
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {FILTERS.map(f => {
          const count = countFor(f.id)
          const isActive = f.id === activeFilter
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-all"
              style={{
                background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)',
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border-default)'}`,
              }}
            >
              {f.label}
              <span
                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold min-w-[18px] text-center"
                style={{
                  background: isActive ? 'rgba(163,230,53,0.2)' : 'var(--bg-inner)',
                  color: isActive ? 'var(--accent)' : 'var(--text-4)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 max-w-3xl">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '1rem' }}>
            <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>{t.ecoloop.noTickets}</p>
          </div>
        ) : (
          filtered.map(t => <TicketCard key={t.id} ticket={t} />)
        )}
      </div>

      {showModal && <NewTicketModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
