import { useState } from 'react'
import { ClipboardCheck, Check, X, CircleAlert } from 'lucide-react'
import { StatCard } from '../../features/dashboard/components/StatCard'
import { StatusBadge, type StatusType } from '../../shared/ui/StatusBadge'

type FilterKey = 'tous' | StatusType

interface ValidationRow {
  id: number; traiteur: string; isBloquant: boolean
  section: string; sousSection: string; champ: string; statut: StatusType
}

const ROWS: ValidationRow[] = [
  { id:1, traiteur:'Concept Gourmet', isBloquant:false, section:'Profil',             sousSection:'Identité',           champ:'raison_sociale',    statut:'en-attente' },
  { id:2, traiteur:'Concept Gourmet', isBloquant:true,  section:'Document Vault',     sousSection:'Documents légaux',   champ:'Contrat de service', statut:'rejete' },
  { id:3, traiteur:'Concept Gourmet', isBloquant:false, section:'Conformité & permis', sousSection:'MAPAQ',             champ:'Permis MAPAQ',       statut:'approuve' },
  { id:4, traiteur:'Concept Gourmet', isBloquant:true,  section:'Banques',             sousSection:'Compte principal',  champ:'IBAN',               statut:'manquant' },
  { id:5, traiteur:'FL',              isBloquant:true,  section:'Banques',             sousSection:'Chèque spécimen',   champ:'Chèque spécimen',    statut:'manquant' },
  { id:6, traiteur:'Concept Gourmet', isBloquant:false, section:'Menus',               sousSection:'Cycle rotatif',     champ:'Prix semaine 3',     statut:'correction' },
]

const FILTER_TABS: { key: FilterKey; label: string; count: number }[] = [
  { key:'tous',         label:'Tous',        count:6 },
  { key:'en-attente',   label:'En attente',  count:1 },
  { key:'correction',   label:'Corrections', count:1 },
  { key:'manquant',     label:'Manquants',   count:2 },
  { key:'rejete',       label:'Rejetés',     count:1 },
  { key:'approuve',     label:'Approuvés',   count:1 },
]

const STATS = [
  { label:'Total items',      value:6, valueColor:'lime'  as const },
  { label:'En attente',       value:1, valueColor:'blue'  as const },
  { label:'Corrections',      value:1, valueColor:'amber' as const },
  { label:'Bloquants Go-live',value:3, valueColor:'red'   as const },
]

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left whitespace-nowrap"
      style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.13em', fontWeight:600, color:'var(--text-4)' }}>
      {children}
    </th>
  )
}

export function CentreDeValidation() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('tous')
  const [bloquantsOnly, setBloquantsOnly] = useState(false)

  const filtered = ROWS.filter(r => {
    if (bloquantsOnly && !r.isBloquant) return false
    return activeFilter === 'tous' || r.statut === activeFilter
  })

  return (
    <div className="p-7">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background:'var(--bg-inner)', border:'1px solid var(--border-strong)' }}>
            <ClipboardCheck size={13} strokeWidth={2.5} style={{ color:'var(--accent)' }} />
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold" style={{ color:'var(--accent)' }}>
            Centre de validation
          </span>
        </div>
        <h1 className="text-[38px] font-bold tracking-tight leading-tight mb-3" style={{ color:'var(--text-1)' }}>
          Centre de validation
        </h1>
        <p className="text-[13px] leading-relaxed max-w-2xl" style={{ color:'var(--text-3)' }}>
          Vue globale de tous les items en attente de revue, tous traiteurs confondus.
          Filtrez par statut, isolez les blockers de Go-live.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {STATS.map(s => <StatCard key={s.label} {...s} icon={null} />)}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_TABS.map(tab => {
            const active = activeFilter === tab.key
            return (
              <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer"
                style={active
                  ? { background:'var(--accent)', color:'#07070a', border:'1px solid transparent' }
                  : { background:'transparent', color:'var(--text-3)', border:'1px solid var(--border-default)' }
                }
              >
                {tab.label}
                <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                  style={active
                    ? { background:'rgba(0,0,0,0.2)', color:'#07070a' }
                    : { background:'var(--bg-inner)', color:'var(--text-3)' }
                  }>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div onClick={() => setBloquantsOnly(v => !v)}
            className="w-4 h-4 rounded flex items-center justify-center transition-all"
            style={bloquantsOnly
              ? { background:'var(--accent)', border:'1px solid var(--accent)' }
              : { background:'transparent', border:'1px solid var(--border-strong)' }
            }>
            {bloquantsOnly && <Check size={10} strokeWidth={3} className="text-[#07070a]" />}
          </div>
          <span className="text-[12.5px]" style={{ color:'var(--text-3)' }}>Bloquants uniquement</span>
        </label>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:'var(--bg-card)', border:'1px solid var(--border-default)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border-default)', background:'var(--bg-base)' }}>
              <TH>Traiteur</TH>
              <TH>Section / Sous-section</TH>
              <TH>Champ / Doc</TH>
              <TH>Statut</TH>
              <TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id}
                className="transition-colors"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent')}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {row.isBloquant && <CircleAlert size={14} strokeWidth={2} className="text-[#f87171] shrink-0" />}
                    <span className="text-[13px] font-medium" style={{ color:'var(--text-1)' }}>{row.traiteur}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[13px]" style={{ color:'var(--text-2)' }}>
                    {row.section}
                    <span className="mx-1.5" style={{ color:'var(--text-4)' }}>·</span>
                    {row.sousSection}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[13px] font-mono" style={{ color:'var(--text-3)' }}>{row.champ}</span>
                </td>
                <td className="px-5 py-4"><StatusBadge status={row.statut} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                      style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', color:'#4ade80' }}>
                      <Check size={12} strokeWidth={2.5} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                      style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171' }}>
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[13px]" style={{ color:'var(--text-4)' }}>
                Aucun résultat pour ce filtre.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
