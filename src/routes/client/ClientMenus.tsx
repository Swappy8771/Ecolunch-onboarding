import { SectionHeader } from '../../shared/ui/SectionHeader'
import { useLang } from '../../shared/context/LangContext'

type SubStatus = 'en-cours' | 'a-faire'

interface SubSectionCard {
  id: string
  category: string
  title: string
  status: SubStatus
  stats?: { label: string; value: string }[]
  count?: string
  disabled?: boolean
  fullWidth?: boolean
}

function SubStatusBadge({ status, t }: { status: SubStatus; t: ReturnType<typeof useLang>['t'] }) {
  if (status === 'en-cours')
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
        style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.22)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />{t.status.inProgress}
      </span>
    )
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
      style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-4)' }} />{t.status.todo}
    </span>
  )
}

function SubCard({ card, t }: { card: SubSectionCard; t: ReturnType<typeof useLang>['t'] }) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-4 card-float${card.fullWidth ? ' col-span-2' : ''}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        opacity: card.disabled ? 0.5 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: 'var(--text-4)' }}>
            {card.category}
          </p>
          <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text-1)' }}>{card.title}</h3>
        </div>
        <SubStatusBadge status={card.status} t={t} />
      </div>

      {card.count !== undefined && (
        <p className="text-[22px] font-bold" style={{ color: card.disabled ? 'var(--text-4)' : 'var(--text-1)' }}>
          # {card.count}
        </p>
      )}

      {card.stats && (
        <div className="grid grid-cols-2 gap-2.5">
          {card.stats.map(s => (
            <div key={s.label}
              className="rounded-xl px-3.5 py-2.5"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)' }}
            >
              <p className="text-[9px] uppercase tracking-[0.12em] font-semibold mb-1" style={{ color: 'var(--text-4)' }}>
                {s.label}
              </p>
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ClientMenus() {
  const { t } = useLang()

  const SUBSECTIONS: SubSectionCard[] = [
    {
      id: 'ecoles-repas',
      category: t.menus.tabs.ecoles,
      title: 'Repas commun',
      status: 'en-cours',
      count: `14 ${t.menus.stats.repas}`,
    },
    {
      id: 'ecoles-cycle',
      category: t.menus.tabs.ecoles,
      title: t.menus.fields.rotatingCycle,
      status: 'a-faire',
      stats: [
        { label: t.menus.fields.weeks,          value: '8' },
        { label: t.menus.fields.optionsPerDay,   value: '3' },
        { label: t.menus.fields.activeDays,      value: '5' },
        { label: t.menus.fields.start,           value: '2025-09-02' },
      ],
    },
    {
      id: 'garderies-menus',
      category: t.menus.tabs.garderies,
      title: 'Menus',
      status: 'a-faire',
      count: `8 ${t.menus.stats.menus}`,
    },
    {
      id: 'garderies-forfaits',
      category: t.menus.tabs.garderies,
      title: 'Forfaits',
      status: 'a-faire',
      count: `4 ${t.menus.stats.forfaits}`,
    },
    {
      id: 'camps',
      category: t.menus.tabs.camps,
      title: 'Menus & Forfaits',
      status: 'a-faire',
      disabled: true,
      count: t.status.disabled,
      fullWidth: true,
    },
  ]

  return (
    <div className="p-7">
      <SectionHeader
        title={t.menus.title}
        description={t.menus.description}
        progress={15}
        status="a-faire"
      />
      <div className="grid grid-cols-2 gap-3.5">
        {SUBSECTIONS.map(card => <SubCard key={card.id} card={card} t={t} />)}
      </div>
    </div>
  )
}
