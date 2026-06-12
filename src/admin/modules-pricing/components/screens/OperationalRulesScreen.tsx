import { useState } from 'react'
import { ChevronDown, ChevronRight, DollarSign, CreditCard, Clock, Bell, BarChart2, Tag, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { CatererSetup, OperationalRule, RuleSection } from '../../types/modules.types'

const SECTION_META: Record<RuleSection, { label: string; icon: React.ReactNode; color: string }> = {
  payout:        { label: 'Payout',        icon: <DollarSign size={14} strokeWidth={1.8} />, color: '#4ade80'  },
  credit:        { label: 'Credit',        icon: <CreditCard size={14} strokeWidth={1.8} />, color: '#60a5fa'  },
  cutoff:        { label: 'Order Cutoff',  icon: <Clock      size={14} strokeWidth={1.8} />, color: '#fbbf24'  },
  notifications: { label: 'Notifications', icon: <Bell       size={14} strokeWidth={1.8} />, color: '#a78bfa'  },
  reports:       { label: 'Reports',       icon: <BarChart2  size={14} strokeWidth={1.8} />, color: '#f97316'  },
  labels:        { label: 'Labels',        icon: <Tag        size={14} strokeWidth={1.8} />, color: '#e879f9'  },
}

function RuleRow({ rule, onToggle }: { rule: OperationalRule; onToggle: (id: string) => void }) {
  const statusColor = rule.status === 'pass' ? '#4ade80' : rule.status === 'warning' ? '#fbbf24' : rule.status === 'error' ? '#f87171' : 'var(--text-4)'
  const StatusIcon = rule.status === 'pass' ? CheckCircle2 : rule.status === 'warning' ? AlertTriangle : rule.status === 'error' ? AlertTriangle : null

  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
      {/* Toggle */}
      <button
        onClick={() => onToggle(rule.id)}
        className="relative cursor-pointer rounded-full shrink-0 transition-colors"
        style={{
          width: '32px', height: '18px',
          background: rule.enabled ? 'var(--accent)' : 'var(--bg-inner)',
          border: `1px solid ${rule.enabled ? 'var(--accent)' : 'var(--border-strong)'}`,
        }}
      >
        <span className="absolute top-[2px] rounded-full transition-all"
          style={{
            width: '12px', height: '12px',
            background: rule.enabled ? '#07070a' : 'var(--text-4)',
            left: rule.enabled ? '17px' : '2px',
          }} />
      </button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: rule.enabled ? 'var(--text-1)' : 'var(--text-4)' }}>{rule.label}</p>
        <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{rule.description}</p>
      </div>

      {/* Value */}
      {rule.value && (
        <span className="text-[12px] font-medium px-2.5 py-1 rounded-lg shrink-0"
          style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
          {rule.value}
        </span>
      )}

      {/* Status */}
      <div className="shrink-0">
        {StatusIcon && <StatusIcon size={13} strokeWidth={2} style={{ color: statusColor }} />}
      </div>
    </div>
  )
}

function Section({
  section, rules, expanded, onToggle, onToggleRule,
}: {
  section: RuleSection
  rules: OperationalRule[]
  expanded: boolean
  onToggle: () => void
  onToggleRule: (id: string) => void
}) {
  const meta = SECTION_META[section]
  const warnings = rules.filter(r => r.status === 'warning' || r.status === 'error').length
  const enabled = rules.filter(r => r.enabled).length

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{ background: expanded ? 'var(--bg-inner)' : 'transparent' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: meta.color + '16', color: meta.color, border: `1px solid ${meta.color}28` }}>
            {meta.icon}
          </div>
          <div className="text-left">
            <p className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{meta.label}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
              {enabled}/{rules.length} enabled
              {warnings > 0 && <span style={{ color: '#fbbf24' }}> · {warnings} {warnings === 1 ? 'issue' : 'issues'}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {warnings > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
              style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
              {warnings}
            </span>
          )}
          {expanded ? <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                    : <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />}
        </div>
      </button>

      {expanded && (
        <div className="px-2 py-1">
          {rules.map(r => (
            <RuleRow key={r.id} rule={r} onToggle={onToggleRule} />
          ))}
        </div>
      )}
    </div>
  )
}

export function OperationalRulesScreen({ setup }: { setup: CatererSetup }) {
  const [rules, setRules] = useState(setup.rules)
  const [expanded, setExpanded] = useState<Set<RuleSection>>(new Set(['payout', 'credit']))

  const sections = Object.keys(SECTION_META) as RuleSection[]

  function toggleSection(s: RuleSection) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  function toggleRule(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const totalWarnings = rules.filter(r => r.status === 'warning' || r.status === 'error').length
  const totalEnabled  = rules.filter(r => r.enabled).length

  return (
    <div className="flex flex-col gap-4">
      {/* Summary strip */}
      <div className="flex items-center gap-4 flex-wrap px-5 py-3.5 rounded-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {[
          { label: 'Total Rules', value: rules.length, color: 'var(--text-1)' },
          { label: 'Enabled',     value: totalEnabled,  color: '#4ade80' },
          { label: 'Disabled',    value: rules.length - totalEnabled, color: 'var(--text-4)' },
          { label: 'Issues',      value: totalWarnings, color: totalWarnings > 0 ? '#fbbf24' : '#4ade80' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-[20px] font-black tabular-nums" style={{ color }}>{value}</span>
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{label}</span>
          </div>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={() => setExpanded(new Set(sections))}
            className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            Expand All
          </button>
          <button onClick={() => setExpanded(new Set())}
            className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            Collapse All
          </button>
        </div>
      </div>

      {totalWarnings > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={14} strokeWidth={2} style={{ color: '#fbbf24' }} />
          <p className="text-[12.5px]" style={{ color: '#fbbf24' }}>
            <strong>{totalWarnings}</strong> operational {totalWarnings === 1 ? 'rule needs' : 'rules need'} attention — review before generating contract.
          </p>
        </div>
      )}

      {sections.map(s => (
        <Section
          key={s}
          section={s}
          rules={rules.filter(r => r.section === s)}
          expanded={expanded.has(s)}
          onToggle={() => toggleSection(s)}
          onToggleRule={toggleRule}
        />
      ))}
    </div>
  )
}
