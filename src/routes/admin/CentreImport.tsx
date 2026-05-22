import {
  FolderInput, LayoutGrid, CreditCard, BookOpen, Clock, GitMerge,
  UtensilsCrossed, RefreshCw, Package, CalendarDays, Database, BookMarked,
  FileText, ArrowRight,
} from 'lucide-react'
import type { ReactNode } from 'react'

type ImportStatus = 'pret' | 'draft'
interface ImportType { id: string; icon: ReactNode; title: string; path: string; status: ImportStatus }

const IMPORT_TYPES: ImportType[] = [
  { id: 'profil-traiteur', icon: <LayoutGrid size={18} strokeWidth={1.6} />,       title: 'Profil traiteur',                  path: 'Profil',                    status: 'pret'  },
  { id: 'banques',         icon: <CreditCard size={18} strokeWidth={1.6} />,        title: 'Banques & informations bancaires',  path: 'Banques',                   status: 'pret'  },
  { id: 'ecoles',          icon: <BookOpen size={18} strokeWidth={1.6} />,          title: 'Écoles',                           path: 'Mes clients · Écoles',      status: 'pret'  },
  { id: 'garderies',       icon: <Clock size={18} strokeWidth={1.6} />,             title: 'Garderies / CPE',                  path: 'Mes clients · Garderies',   status: 'pret'  },
  { id: 'css',             icon: <GitMerge size={18} strokeWidth={1.6} />,          title: 'CSS',                              path: 'Mes clients · CSS',         status: 'draft' },
  { id: 'menus-ecoles',    icon: <UtensilsCrossed size={18} strokeWidth={1.6} />,   title: 'Menus écoles',                     path: 'Menus & Forfaits',          status: 'pret'  },
  { id: 'cycle-rotatif',   icon: <RefreshCw size={18} strokeWidth={1.6} />,         title: 'Cycle rotatif',                    path: 'Menus & Forfaits',          status: 'draft' },
  { id: 'menus-garderies', icon: <UtensilsCrossed size={18} strokeWidth={1.6} />,   title: 'Menus garderies',                  path: 'Menus & Forfaits',          status: 'pret'  },
  { id: 'forfaits',        icon: <Package size={18} strokeWidth={1.6} />,           title: 'Forfaits garderies',               path: 'Menus & Forfaits',          status: 'draft' },
  { id: 'calendriers',     icon: <CalendarDays size={18} strokeWidth={1.6} />,      title: 'Calendriers de fermeture',         path: 'Mes clients · Calendriers', status: 'pret'  },
  { id: 'acomba',          icon: <Database size={18} strokeWidth={1.6} />,          title: 'Acomba',                           path: 'Multi-sections',            status: 'pret'  },
  { id: 'quickbooks',      icon: <BookMarked size={18} strokeWidth={1.6} />,        title: 'QuickBooks',                       path: 'Multi-sections',            status: 'draft' },
  { id: 'documents',       icon: <FileText size={18} strokeWidth={1.6} />,          title: 'Documents',                        path: 'Document Vault',            status: 'pret'  },
]

function StatusPill({ status }: { status: ImportStatus }) {
  return status === 'pret' ? (
    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
      style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' }}>
      Prêt
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
      style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.22)' }}>
      Draft
    </span>
  )
}

function ImportCard({ item }: { item: ImportType }) {
  return (
      <div
        className="rounded-2xl p-5 flex flex-col gap-4 transition-colors cursor-pointer card-float"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}
        >
          {item.icon}
        </div>
        <StatusPill status={item.status} />
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <h3 className="text-[13.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
          {item.title}
        </h3>
        <div className="flex items-center gap-1 text-[11.5px]" style={{ color: 'var(--text-4)' }}>
          <ArrowRight size={11} strokeWidth={2} className="shrink-0" />
          <span>{item.path}</span>
        </div>
      </div>
    </div>
  )
}

const TOTAL = IMPORT_TYPES.length
const PRET  = IMPORT_TYPES.filter(i => i.status === 'pret').length
const DRAFT = IMPORT_TYPES.filter(i => i.status === 'draft').length

export function CentreImport() {
  return (
    <div className="p-7">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
            <FolderInput size={13} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--accent)' }}>
            Smart Import — Centre
          </span>
        </div>
        <h1 className="text-[38px] font-bold tracking-tight leading-tight mb-3" style={{ color: 'var(--text-1)' }}>
          Centre d'import / Smart Import
        </h1>
        <p className="text-[13px] leading-relaxed max-w-2xl" style={{ color: 'var(--text-3)' }}>
          {TOTAL} types d'import, chacun avec son template, son mapping et sa logique de validation propre.{' '}
          L'outil est aussi disponible contextuellement dans chaque section du portail caterer.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 mb-7">
        {[
          { label: 'Total', value: TOTAL, color: 'var(--text-1)', bg: 'var(--bg-card)', border: 'var(--border-default)', dot: null },
          { label: 'Prêt',  value: PRET,  color: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.18)', dot: '#4ade80' },
          { label: 'Draft', value: DRAFT, color: '#fbbf24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.18)', dot: '#fbbf24' },
        ].map(chip => (
          <div key={chip.label}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{ background: chip.bg, border: `1px solid ${chip.border}` }}
          >
            {chip.dot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: chip.dot }} />}
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: chip.color }}>
              {chip.label}
            </span>
            <span className="text-[13px] font-bold" style={{ color: chip.color }}>{chip.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {IMPORT_TYPES.map(item => <ImportCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
