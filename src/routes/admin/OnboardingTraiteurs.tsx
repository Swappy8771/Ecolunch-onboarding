import { useState } from 'react'
import {
  Users, MapPin, User, Calendar, AlertTriangle,
  MessageCircle, ArrowRight, Eye, Download, Plus, X, Check, Search,
} from 'lucide-react'

/* ── Types ──────────────────────────────────────────────── */
type TraiteurStatus = 'pre-onboarding' | 'en-cours' | 'soumis' | 'corrections' | 'approuves' | 'go-live'
type ReadinessTag = 'almost-ready' | 'blocked' | 'not-started' | 'on-track' | null

interface Traiteur {
  id: string
  slug: string
  name: string
  city: string
  status: TraiteurStatus
  readiness: ReadinessTag
  verticals: string[]
  progress: number
  admin: string
  updatedAt: string
  validations: number
  tickets: number
}

type Vertical = 'Écoles' | 'Garderies' | 'Camps' | 'CSS'

/* ── Data ───────────────────────────────────────────────── */
const TRAITEURS: Traiteur[] = [
  {
    id: '1', slug: '#concept-gourmet', name: 'Concept Gourmet', city: 'Montréal, QC',
    status: 'en-cours', readiness: 'almost-ready',
    verticals: ['Écoles', 'Garderies', 'CSS', 'Camps'],
    progress: 62, admin: 'Elise Bouchard', updatedAt: '2026-02-12',
    validations: 3, tickets: 2,
  },
  {
    id: '2', slug: '#fl', name: 'FL', city: 'Lévis, QC',
    status: 'corrections', readiness: 'blocked',
    verticals: ['Écoles'],
    progress: 38, admin: 'Hugo Bernier', updatedAt: '2026-02-11',
    validations: 4, tickets: 3,
  },
  {
    id: '3', slug: '#msn', name: 'MSN', city: 'Saguenay, QC',
    status: 'pre-onboarding', readiness: 'not-started',
    verticals: ['Écoles', 'Camps'],
    progress: 12, admin: 'Sandrine Lavoie', updatedAt: '2026-02-09',
    validations: 0, tickets: 0,
  },
]

type FilterId = 'tous' | TraiteurStatus

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'tous',           label: 'Tous' },
  { id: 'pre-onboarding', label: 'Pré-onboarding' },
  { id: 'en-cours',       label: 'En cours' },
  { id: 'soumis',         label: 'Soumis' },
  { id: 'corrections',    label: 'Corrections' },
  { id: 'approuves',      label: 'Approuvés' },
  { id: 'go-live',        label: 'Go-live' },
]

/* ── Helpers ────────────────────────────────────────────── */
function statusStyle(s: TraiteurStatus): { bg: string; color: string; border: string; dot: string } {
  const map: Record<TraiteurStatus, { bg: string; color: string; border: string; dot: string }> = {
    'pre-onboarding': { bg: 'var(--bg-inner)',            color: 'var(--text-3)',  border: 'var(--border-strong)', dot: 'var(--text-4)' },
    'en-cours':       { bg: 'rgba(96,165,250,0.12)',      color: '#60a5fa',       border: 'rgba(96,165,250,0.25)', dot: '#60a5fa' },
    'soumis':         { bg: 'rgba(167,139,250,0.12)',     color: '#a78bfa',       border: 'rgba(167,139,250,0.25)', dot: '#a78bfa' },
    'corrections':    { bg: 'rgba(251,191,36,0.12)',      color: '#fbbf24',       border: 'rgba(251,191,36,0.25)', dot: '#fbbf24' },
    'approuves':      { bg: 'rgba(74,222,128,0.12)',      color: '#4ade80',       border: 'rgba(74,222,128,0.25)', dot: '#4ade80' },
    'go-live':        { bg: 'rgba(163,230,53,0.12)',      color: '#a3e635',       border: 'rgba(163,230,53,0.25)', dot: '#a3e635' },
  }
  return map[s]
}

function readinessBadge(r: ReadinessTag) {
  if (!r) return null
  const map: Record<NonNullable<ReadinessTag>, { label: string; bg: string; color: string; border: string }> = {
    'almost-ready': { label: 'Almost ready', bg: 'rgba(74,222,128,0.10)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
    'blocked':      { label: 'Blocked',      bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
    'not-started':  { label: 'Not started',  bg: 'var(--bg-inner)',        color: 'var(--text-3)', border: 'var(--border-strong)' },
    'on-track':     { label: 'On track',     bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  }
  return map[r]
}

function progressColor(status: TraiteurStatus) {
  if (status === 'en-cours')    return '#3b82f6'
  if (status === 'corrections') return '#f59e0b'
  if (status === 'approuves' || status === 'go-live') return '#a3e635'
  return '#a3e635'
}

/* ── Status pill ────────────────────────────────────────── */
function StatusPill({ status }: { status: TraiteurStatus }) {
  const s = statusStyle(status)
  const labels: Record<TraiteurStatus, string> = {
    'pre-onboarding': 'Pré-onboarding',
    'en-cours': 'En cours',
    'soumis': 'Soumis',
    'corrections': 'Correction',
    'approuves': 'Approuvé',
    'go-live': 'Go-live',
  }
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
      {labels[status]}
    </span>
  )
}

/* ── Traiteur card ──────────────────────────────────────── */
function TraiteurCard({ t }: { t: Traiteur }) {
  const rb = readinessBadge(t.readiness)
  const barColor = progressColor(t.status)

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-4)' }}>{t.slug}</span>
          <StatusPill status={t.status} />
        </div>
        {rb && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
            style={{ background: rb.bg, color: rb.color, border: `1px solid ${rb.border}` }}>
            {rb.label}
          </span>
        )}
      </div>

      {/* Name + city */}
      <div>
        <h3 className="text-[20px] font-bold leading-tight mb-1" style={{ color: 'var(--text-1)' }}>{t.name}</h3>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
          <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{t.city}</span>
        </div>
      </div>

      {/* Verticals */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {t.verticals.map(v => (
          <span key={v} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            {v}
          </span>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9.5px] uppercase tracking-[0.12em] font-semibold" style={{ color: 'var(--text-4)' }}>
            Progression
          </span>
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text-2)' }}>{t.progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${t.progress}%`, background: barColor }} />
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-2 text-[12px]" style={{ color: 'var(--text-4)' }}>
        <div className="flex items-center gap-1.5">
          <User size={11} strokeWidth={1.8} />
          <span>{t.admin}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={11} strokeWidth={1.8} />
          <span>MAJ {t.updatedAt}</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: t.validations > 0 ? '#fbbf24' : 'var(--text-4)' }}>
          <AlertTriangle size={11} strokeWidth={1.8} />
          <span>{t.validations} validations</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: t.tickets > 0 ? '#60a5fa' : 'var(--text-4)' }}>
          <MessageCircle size={11} strokeWidth={1.8} />
          <span>{t.tickets} tickets</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
          style={{ background: 'var(--accent)', color: '#07070a' }}
        >
          <ArrowRight size={13} strokeWidth={2.5} />
          Open onboarding
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
        >
          <Eye size={13} strokeWidth={1.8} />
          Switch to Caterer Portal
        </button>
      </div>
    </div>
  )
}

/* ── New traiteur modal ─────────────────────────────────── */
const VERTICALS: Vertical[] = ['Écoles', 'Garderies', 'Camps', 'CSS']

function NewTraiteurModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Set<Vertical>>(new Set(['Écoles']))

  function toggle(v: Vertical) {
    setSelected(prev => {
      const n = new Set(prev)
      if (n.has(v)) n.delete(v)
      else n.add(v)
      return n
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl p-7 flex flex-col gap-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: 'var(--accent)' }}>
              Nouveau traiteur
            </p>
            <h2 className="text-[18px] font-bold mb-1" style={{ color: 'var(--text-1)' }}>
              Créer un nouveau traiteur
            </h2>
            <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
              Lance un nouvel embarquement. Tous les champs peuvent être complétés plus tard via le workspace.
            </p>
          </div>
          <button onClick={onClose} className="mt-1 cursor-pointer shrink-0" style={{ color: 'var(--text-4)' }}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* NOM COMMERCIAL */}
        <div>
          <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
            Nom commercial <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            placeholder="ex : Concept Gourmet"
            className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
          />
        </div>

        {/* RAISON SOCIALE + VILLE */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
              Raison sociale
            </label>
            <input placeholder="ex : Concept Gourmet inc."
              className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
              Ville
            </label>
            <input placeholder="ex : Montréal, QC"
              className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>
        </div>

        {/* VERTICALES */}
        <div>
          <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
            Verticales desservies
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {VERTICALS.map(v => {
              const active = selected.has(v)
              return (
                <button key={v} onClick={() => toggle(v)}
                  className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all"
                  style={active
                    ? { background: 'var(--accent)', color: '#07070a', border: '1px solid transparent' }
                    : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }
                  }>
                  {v}
                </button>
              )
            })}
          </div>
        </div>

        {/* ADMIN + CONTACT */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
              Admin assigné
            </label>
            <select className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}
              defaultValue="onboarding-admin">
              <option value="onboarding-admin">Onboarding Admin</option>
              <option value="support">Support</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
              Contact principal
            </label>
            <input placeholder="Nom complet"
              className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>
        </div>

        {/* RÔLE + COURRIEL */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
              Rôle
            </label>
            <input placeholder="Directeur"
              className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
              Courriel
            </label>
            <input placeholder="contact@traiteur.ca"
              className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
          </div>
        </div>

        {/* Footer note + actions */}
        <div className="flex items-center justify-between gap-4 pt-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11.5px] flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
            <MessageCircle size={11} strokeWidth={1.8} />
            Vous serez redirigé vers le workspace après création.
          </p>
          <div className="flex items-center gap-2.5 shrink-0">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
              Annuler
            </button>
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              <Check size={13} strokeWidth={2.5} />
              Créer le traiteur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export function OnboardingTraiteurs() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('tous')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const countFor = (id: FilterId) =>
    id === 'tous' ? TRAITEURS.length : TRAITEURS.filter(t => t.status === id).length

  const filtered = TRAITEURS
    .filter(t => activeFilter === 'tous' || t.status === activeFilter)
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-7">
      {/* Page header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <Users size={12} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--text-4)' }}>
              Onboarding · Traiteurs
            </span>
          </div>
          <h1 className="text-[34px] font-bold tracking-tight leading-tight mb-2" style={{ color: 'var(--text-1)' }}>
            Traiteurs en onboarding
          </h1>
          <p className="text-[13px] leading-relaxed max-w-2xl" style={{ color: 'var(--text-3)' }}>
            Pilotez chaque traiteur de l'embarquement au Go-live. Ouvrez le workspace pour accéder aux 8
            sections d'onboarding ou basculez en vue impersonifiée caterer.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
            <Download size={13} strokeWidth={2} />
            Exporter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Plus size={14} strokeWidth={2.5} />
            Nouveau traiteur
          </button>
        </div>
      </div>

      {/* Filters + Search row */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => {
            const count = countFor(f.id)
            const isActive = f.id === activeFilter
            return (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-all"
                style={{
                  background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)',
                  color: isActive ? 'var(--accent)' : 'var(--text-3)',
                  border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border-default)'}`,
                }}>
                {f.label}
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold min-w-[18px] text-center"
                  style={{
                    background: isActive ? 'rgba(163,230,53,0.2)' : 'var(--bg-inner)',
                    color: isActive ? 'var(--accent)' : 'var(--text-4)',
                  }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        {/* Search */}
        <div className="relative shrink-0">
          <Search size={13} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-4)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un traiteur..."
            className="pl-9 pr-4 py-2 rounded-xl text-[12.5px] outline-none w-[220px]"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }}
          />
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>Aucun traiteur trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(t => <TraiteurCard key={t.id} t={t} />)}
        </div>
      )}

      {showModal && <NewTraiteurModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
