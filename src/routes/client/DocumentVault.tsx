import { useMemo, useState, type ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { CircularProgress } from '../../shared/ui/CircularProgress'
import { StatusPill } from '../../shared/ui/StatusPill'

type DocStatus = 'correction' | 'approved' | 'review' | 'required'

interface DocItem {
  id: string
  title: string
  meta: string
  status: DocStatus
  category: string
}

const TABS = [
  'Tous',
  'Profil',
  'Banques & informations bancaires',
  'Mes clients / Établissements desservis',
  'Menus & Forfaits',
  'Smart Import',
  'Modules',
  'Go-live',
  'Documents légaux',
  'Conformité & permis',
  'Assurances',
] as const

type TabId = typeof TABS[number]

const DOCS: DocItem[] = [
  {
    id: 'doc-1',
    title: 'Contrat de service signé.pdf',
    meta: 'Documents légaux · v1.0 · Upload client · 2026-02-08',
    status: 'correction',
    category: 'Documents légaux',
  },
  {
    id: 'doc-2',
    title: 'Permis MAPAQ 2025.pdf',
    meta: 'Conformité & permis · v1.0 · Upload client · 2026-02-05',
    status: 'approved',
    category: 'Conformité & permis',
  },
  {
    id: 'doc-3',
    title: 'Chèque spécimen.pdf',
    meta: 'Banques & informations bancaires · v1.0 · Upload client · 2026-02-09',
    status: 'review',
    category: 'Banques & informations bancaires',
  },
  {
    id: 'doc-4',
    title: "Police d’assurance responsabilité.pdf",
    meta: 'Assurances · v2.0 · Smart Import (Acomba) · 2026-02-04',
    status: 'approved',
    category: 'Assurances',
  },
  {
    id: 'doc-5',
    title: 'Certification HACCP.pdf',
    meta: 'Conformité & permis · v2.1 · Smart Import · 2026-02-04',
    status: 'approved',
    category: 'Conformité & permis',
  },
  {
    id: 'doc-6',
    title: 'Menu rotatif 8 semaines.xlsx',
    meta: 'Menus & Forfaits · v1.0 · Upload client · 2026-02-11',
    status: 'required',
    category: 'Menus & Forfaits',
  },
]

function statusConfig(status: DocStatus) {
  const map: Record<DocStatus, { label: string; bg: string; color: string; border: string; icon?: ReactNode }> = {
    correction: { label: 'Correction', bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.22)' },
    approved: { label: 'Approuvé', bg: 'rgba(74,222,128,0.12)', color: '#4ade80', border: 'rgba(74,222,128,0.22)' },
    review: { label: 'En revue', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'rgba(96,165,250,0.22)' },
    required: { label: 'Reçu', bg: 'var(--bg-inner)', color: 'var(--text-3)', border: 'var(--border-strong)' },
  }
  return map[status]
}

function TabPill({ id, active, onClick }: { id: TabId; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-all"
      style={{
        background: active ? 'var(--accent-dim)' : 'var(--bg-card)',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-default)'}`,
      }}
    >
      {id}
    </button>
  )
}

function DocRow({ doc }: { doc: DocItem }) {
  const cfg = statusConfig(doc.status)
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center justify-between gap-5 card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}
        >
          <FileText size={16} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>
            {doc.title}
          </p>
          <p className="text-[11.5px] truncate" style={{ color: 'var(--text-4)' }}>{doc.meta}</p>
        </div>
      </div>

      <StatusPill label={cfg.label} bg={cfg.bg} color={cfg.color} border={cfg.border} dot={doc.status !== 'required'} size="md" />
    </div>
  )
}

export function DocumentVault() {
  const [activeTab, setActiveTab] = useState<TabId>('Tous')

  const filtered = useMemo(() => {
    if (activeTab === 'Tous') return DOCS
    return DOCS.filter(d => d.category === activeTab)
  }, [activeTab])

  return (
    <div className="p-7">
      {/* Header card */}
      <div
        className="rounded-3xl px-7 py-6 mb-6 flex items-center justify-between gap-6 card-float"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div className="min-w-0">
          <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
            Section
          </p>
          <h1 className="text-[26px] font-bold tracking-tight leading-tight" style={{ color: 'var(--text-1)' }}>
            Document Vault
          </h1>
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--text-3)' }}>
            Coffre-fort multi-catégories pour ce traiteur
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <CircularProgress value={55} size={64} stroke={7} label="" />
          <StatusPill label="En cours" bg="rgba(96,165,250,0.12)" color="#60a5fa" border="rgba(96,165,250,0.22)" dot />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {TABS.map(t => (
          <TabPill key={t} id={t} active={t === activeTab} onClick={() => setActiveTab(t)} />
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map(d => <DocRow key={d.id} doc={d} />)}
      </div>
    </div>
  )
}
