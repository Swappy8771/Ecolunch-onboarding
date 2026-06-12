import type { ConfigSection, ValidationLevel } from '../types/modules.types'

const NAV_ITEMS: { id: ConfigSection; label: string; short: string }[] = [
  { id: 'dashboard',          label: 'Dashboard',           short: 'Overview'    },
  { id: 'modules',            label: 'Modules',             short: 'Modules'     },
  { id: 'pricing',            label: 'Pricing',             short: 'Pricing'     },
  { id: 'founding-partner',   label: 'Founding Partner',    short: 'Founder'     },
  { id: 'commercial-terms',   label: 'Commercial Terms',    short: 'Terms'       },
  { id: 'operational-rules',  label: 'Operational Rules',   short: 'Rules'       },
  { id: 'effective-dates',    label: 'Effective Dates',     short: 'Dates'       },
  { id: 'validation',         label: 'Validation',          short: 'Validation'  },
  { id: 'contract-readiness', label: 'Contract Readiness',  short: 'Readiness'   },
  { id: 'audit',              label: 'Audit & History',     short: 'Audit'       },
]

const LEVEL_COLOR: Record<ValidationLevel, string> = {
  pass:    '#4ade80',
  warning: '#fbbf24',
  error:   '#f87171',
  pending: 'var(--text-4)',
}

interface ConfigNavProps {
  active: ConfigSection
  onChange: (s: ConfigSection) => void
  sectionStatus: Partial<Record<ConfigSection, ValidationLevel>>
}

export function ConfigNav({ active, onChange, sectionStatus }: ConfigNavProps) {
  return (
    <div
      className="flex items-center gap-0.5 overflow-x-auto px-1 py-1 rounded-2xl shrink-0"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = item.id === active
        const level    = sectionStatus[item.id] ?? 'pending'
        const dot      = LEVEL_COLOR[level]
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-all shrink-0"
            style={{
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-3)',
              border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: dot, boxShadow: isActive ? `0 0 6px ${dot}` : 'none' }}
            />
            <span className="hidden lg:inline">{item.label}</span>
            <span className="lg:hidden">{item.short}</span>
          </button>
        )
      })}
    </div>
  )
}
