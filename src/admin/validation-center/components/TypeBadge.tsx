import type { ValidationType } from '@/features/adminValidation/types/validation.types'

/** The real 10-value backend `ValidationItem.type` enum (`validation.model.ts`). */
export const TYPE_META: Record<ValidationType, { label: string; color: string; bg: string }> = {
  profile:       { label: 'Profile',       color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  document:      { label: 'Document',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  contract:      { label: 'Contract',      color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  banking:       { label: 'Banking',       color: '#4ade80', bg: 'rgba(74,222,128,0.12)'  },
  menu:          { label: 'Menu',          color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  establishment: { label: 'Establishment', color: '#22d3ee', bg: 'rgba(34,211,238,0.12)'  },
  pricing:       { label: 'Pricing',       color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  module:        { label: 'Module',        color: '#a3e635', bg: 'rgba(163,230,53,0.12)'  },
  golive:        { label: 'Go-Live',       color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  smart_import:  { label: 'Smart Import',  color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
}

export function TypeBadge({ type }: { type: ValidationType }) {
  const m = TYPE_META[type]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}
    >
      {m.label}
    </span>
  )
}
