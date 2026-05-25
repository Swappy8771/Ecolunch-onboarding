import { useMemo, useState, type ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { CircularProgress } from '../../shared/ui/CircularProgress'
import { StatusPill } from '../../shared/ui/StatusPill'
import { useLang } from '../../shared/context/LangContext'

type DocStatus = 'correction' | 'approved' | 'review' | 'required'

interface DocItem {
  id: string
  title: string
  meta: string
  status: DocStatus
  category: string
}

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
    title: "Police d'assurance responsabilité.pdf",
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

function statusConfig(status: DocStatus, t: ReturnType<typeof useLang>['t']) {
  const map: Record<DocStatus, { label: string; bg: string; color: string; border: string; icon?: ReactNode }> = {
    correction: { label: t.documentVault.statuses.correction,  bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.22)' },
    approved:   { label: t.documentVault.statuses.approved,    bg: 'rgba(74,222,128,0.12)', color: '#4ade80', border: 'rgba(74,222,128,0.22)' },
    review:     { label: t.documentVault.statuses.underReview, bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'rgba(96,165,250,0.22)' },
    required:   { label: t.documentVault.statuses.received,    bg: 'var(--bg-inner)', color: 'var(--text-3)', border: 'var(--border-strong)' },
  }
  return map[status]
}

function DocRow({ doc }: { doc: DocItem }) {
  const { t } = useLang()
  const cfg = statusConfig(doc.status, t)
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
  const { t } = useLang()

  const TABS = [
    t.documentVault.categories.all,
    t.documentVault.categories.profil,
    t.documentVault.categories.banques,
    t.documentVault.categories.clients,
    t.documentVault.categories.menus,
    t.documentVault.categories.smartImport,
    t.documentVault.categories.modules,
    t.documentVault.categories.goLive,
    t.documentVault.sections.legal,
    t.documentVault.sections.compliance,
    t.documentVault.sections.insurance,
  ] as const

  type TabId = typeof TABS[number]

  const TAB_TO_CATEGORY: Record<string, string> = {
    [t.documentVault.sections.legal]:       'Documents légaux',
    [t.documentVault.sections.compliance]:  'Conformité & permis',
    [t.documentVault.sections.insurance]:   'Assurances',
    [t.documentVault.categories.banques]:   'Banques & informations bancaires',
    [t.documentVault.categories.menus]:     'Menus & Forfaits',
  }

  const [activeTab, setActiveTab] = useState<TabId>(TABS[0])

  const filtered = useMemo(() => {
    if (activeTab === t.documentVault.categories.all) return DOCS
    const cat = TAB_TO_CATEGORY[activeTab] ?? activeTab
    return DOCS.filter(d => d.category === cat)
  }, [activeTab, t])

  return (
    <div className="p-7">
      {/* Header card */}
      <div
        className="rounded-3xl px-7 py-6 mb-6 flex items-center justify-between gap-6 card-float"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div className="min-w-0">
          <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
            {t.documentVault.section}
          </p>
          <h1 className="text-[26px] font-bold tracking-tight leading-tight" style={{ color: 'var(--text-1)' }}>
            {t.documentVault.title}
          </h1>
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--text-3)' }}>
            {t.documentVault.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <CircularProgress value={55} size={64} stroke={7} label="" />
          <StatusPill label="En cours" bg="rgba(96,165,250,0.12)" color="#60a5fa" border="rgba(96,165,250,0.22)" dot />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-all"
            style={{
              background: tab === activeTab ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: tab === activeTab ? 'var(--accent)' : 'var(--text-3)',
              border: `1px solid ${tab === activeTab ? 'var(--accent-border)' : 'var(--border-default)'}`,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map(d => <DocRow key={d.id} doc={d} />)}
      </div>
    </div>
  )
}
