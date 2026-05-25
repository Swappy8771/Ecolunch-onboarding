import { useState } from 'react'
import { MapPin, Plus, ArrowRight } from 'lucide-react'
import { useLang } from '../../shared/context/LangContext'

type TabId = 'ecoles' | 'garderies' | 'camps' | 'css' | 'calendriers'

interface ClientRow { name: string; eleves: number; css: string }

const ECOLES: ClientRow[] = [
  { name: 'École Saint-Viateur',            eleves: 312, css: 'CSS Montréal' },
  { name: 'École des Quatre-Vents',         eleves: 248, css: 'CSS Montréal' },
  { name: 'École Marie-Immaculée',          eleves: 195, css: 'CSS Laval' },
  { name: 'École du Boisé-des-Érables',     eleves: 430, css: 'CSS Longueuil' },
]

export function ClientMesClients() {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState<TabId>('ecoles')

  interface Tab { id: TabId; label: string; count: number }
  const TABS: Tab[] = [
    { id: 'ecoles',      label: t.mesClients.tabs.ecoles,      count: 4 },
    { id: 'garderies',   label: t.mesClients.tabs.garderies,   count: 2 },
    { id: 'camps',       label: t.mesClients.tabs.camps,       count: 1 },
    { id: 'css',         label: t.mesClients.tabs.css,         count: 1 },
    { id: 'calendriers', label: t.mesClients.tabs.calendriers, count: 3 },
  ]

  return (
    <div className="p-7">
      {/* Page header */}
      <div
        className="rounded-2xl px-7 py-5 mb-5 flex items-center justify-between gap-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
            style={{ background: 'rgba(163,230,53,0.10)', border: '1px solid rgba(163,230,53,0.22)' }}
          >
            <MapPin size={11} style={{ color: 'var(--accent)' }} />
            <span className="text-[10.5px] font-semibold" style={{ color: 'var(--accent)' }}>
              {t.mesClients.title}
            </span>
          </div>
          <h1 className="text-[26px] font-bold tracking-tight leading-tight mb-1.5" style={{ color: 'var(--text-1)' }}>
            {t.mesClients.title}
          </h1>
          <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
            {t.mesClients.description}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold shrink-0 cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: '#07070a' }}
        >
          <Plus size={14} strokeWidth={2.5} />
          {t.mesClients.add}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-medium cursor-pointer transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-3)',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent-border)' : 'var(--border-default)'}`,
            }}
          >
            {tab.label}
            <span
              className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
              style={{
                background: activeTab === tab.id ? 'rgba(163,230,53,0.2)' : 'var(--bg-inner)',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-4)',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        {activeTab === 'ecoles' && ECOLES.map((row, i) => (
          <div
            key={row.name}
            className="flex items-center justify-between px-6 py-4 cursor-pointer transition-colors"
            style={{
              borderBottom: i < ECOLES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inner)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
              >
                <MapPin size={14} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{row.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                  {row.eleves} {t.mesClients.students} · {row.css}
                </p>
              </div>
            </div>
            <ArrowRight size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
          </div>
        ))}
        {activeTab !== 'ecoles' && (
          <div className="flex items-center justify-center py-16">
            <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>{t.mesClients.noItems}</p>
          </div>
        )}
      </div>
    </div>
  )
}
