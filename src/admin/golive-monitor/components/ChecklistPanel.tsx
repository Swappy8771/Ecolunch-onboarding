import { CheckCircle2, AlertTriangle, XCircle, MinusCircle } from 'lucide-react'
import type { GoLiveRequirementViewModel } from '@/features/adminGolive/types/golive.types'

/** The 11 hardcoded backend requirement keys, in display order, with a human label. */
const REQUIREMENT_LABELS: Record<string, string> = {
  account_created: 'Account Created',
  profile_validated: 'Profile Validated',
  banking_validated: 'Banking Information Validated',
  establishments_confirmed: 'Establishments Confirmed',
  menus_validated: 'Menus / Packages Validated',
  documents_approved: 'Required Documents Approved',
  contracts_signed: 'Required Contracts Signed',
  modules_configured: 'Modules Configured',
  pricing_configured: 'Pricing Configured',
  corrections_closed: 'Corrections Closed',
  ecoloop_blockers_closed: 'EcoLoop Blockers Closed',
}

const STATUS_META: Record<GoLiveRequirementViewModel['status'], { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  complete: { icon: <CheckCircle2 size={14} strokeWidth={2} style={{ color: '#4ade80' }} />, color: '#4ade80', bg: 'rgba(74,222,128,0.07)', label: '✓ Done' },
  incomplete: { icon: <AlertTriangle size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />, color: 'var(--text-4)', bg: 'transparent', label: 'Pending' },
  blocked: { icon: <XCircle size={14} strokeWidth={2} style={{ color: '#f87171' }} />, color: '#f87171', bg: 'rgba(248,113,113,0.07)', label: 'Blocked' },
  waived: { icon: <MinusCircle size={14} strokeWidth={2} style={{ color: '#60a5fa' }} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.07)', label: 'Waived' },
}

export function ChecklistPanel({ items }: { items: GoLiveRequirementViewModel[] }) {
  const complete = items.filter(i => i.status === 'complete').length
  const incomplete = items.filter(i => i.status === 'incomplete').length
  const blocked = items.filter(i => i.status === 'blocked').length
  const waived = items.filter(i => i.status === 'waived').length

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
          Readiness Checklist
        </p>
        <div className="flex items-center gap-3 text-[11px]">
          <span style={{ color: '#4ade80' }}>{complete} done</span>
          {blocked > 0 && <span style={{ color: '#f87171' }}>{blocked} blocked</span>}
          {waived > 0 && <span style={{ color: '#60a5fa' }}>{waived} waived</span>}
          {incomplete > 0 && <span style={{ color: 'var(--text-4)' }}>{incomplete} pending</span>}
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {items.map(item => {
          const m = STATUS_META[item.status]
          return (
            <div
              key={item.requirement}
              className="flex items-center gap-3 px-4 py-3 transition-all"
              style={{
                background: item.status !== 'incomplete' ? m.bg : 'transparent',
                borderLeft: item.status !== 'incomplete' ? `2px solid ${m.color}` : '2px solid transparent',
              }}
            >
              <div className="shrink-0">{m.icon}</div>
              <div className="flex-1 min-w-0">
                <span className="text-[12.5px] font-medium" style={{ color: item.status === 'complete' ? 'var(--text-2)' : item.status === 'blocked' ? '#f87171' : 'var(--text-4)' }}>
                  {REQUIREMENT_LABELS[item.requirement] ?? item.requirement}
                </span>
                {item.blockingReason && (
                  <p className="text-[11px] mt-0.5" style={{ color: '#f87171' }}>{item.blockingReason}</p>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold shrink-0"
                style={{ background: m.bg, color: m.color, border: `1px solid ${m.color}40` }}>
                {m.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
