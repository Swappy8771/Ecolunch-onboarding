import type { VType } from '../services/mock/validationMock'

const TYPE_META: Record<VType, { color: string; bg: string }> = {
  'Document':      { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'   },
  'Contract':      { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)'  },
  'Banking':       { color: '#4ade80', bg: 'rgba(74,222,128,0.12)'   },
  'Menu':          { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'   },
  'Establishment': { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)'   },
  'Pricing':       { color: '#34d399', bg: 'rgba(52,211,153,0.12)'   },
  'Module':        { color: '#a3e635', bg: 'rgba(163,230,53,0.12)'   },
  'Go-Live':       { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'   },
  'Smart Import':  { color: '#f472b6', bg: 'rgba(244,114,182,0.12)'  },
}

export function TypeBadge({ type }: { type: VType }) {
  const m = TYPE_META[type]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}
    >
      {type}
    </span>
  )
}
