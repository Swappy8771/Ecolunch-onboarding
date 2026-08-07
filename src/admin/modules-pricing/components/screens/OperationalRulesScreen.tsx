import { useState } from 'react'
import { ChevronDown, ChevronRight, DollarSign, CreditCard, Clock, Bell, BarChart2, Tag, Plus, Trash2 } from 'lucide-react'
import { ModuleSelector } from '../ModuleSelector'
import { useModuleConfigurationDetail } from '@/features/adminModulesPricing/hooks/useModuleConfigurationDetail'
import { useSaveConfiguration } from '@/features/adminModulesPricing/hooks/useModuleMutations'
import type { CatererModuleViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

type RuleKey = 'cutoffRules' | 'payoutRules' | 'creditRules' | 'notificationSettings' | 'reportSettings' | 'labelSettings'

const SECTION_META: Record<RuleKey, { label: string; icon: React.ReactNode; color: string }> = {
  payoutRules:          { label: 'Payout',        icon: <DollarSign size={14} strokeWidth={1.8} />, color: '#4ade80' },
  creditRules:          { label: 'Credit',        icon: <CreditCard size={14} strokeWidth={1.8} />, color: '#60a5fa' },
  cutoffRules:          { label: 'Order Cutoff',  icon: <Clock      size={14} strokeWidth={1.8} />, color: '#fbbf24' },
  notificationSettings: { label: 'Notifications', icon: <Bell       size={14} strokeWidth={1.8} />, color: '#a78bfa' },
  reportSettings:       { label: 'Reports',       icon: <BarChart2  size={14} strokeWidth={1.8} />, color: '#f97316' },
  labelSettings:        { label: 'Labels',        icon: <Tag        size={14} strokeWidth={1.8} />, color: '#e879f9' },
}

type Row = { key: string; value: string }

function toRows(obj: Record<string, unknown>): Row[] {
  return Object.entries(obj).map(([key, value]) => ({ key, value: typeof value === 'string' ? value : JSON.stringify(value) }))
}

function rowsToObject(rows: Row[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const r of rows) {
    if (!r.key.trim()) continue
    try { out[r.key] = JSON.parse(r.value) } catch { out[r.key] = r.value }
  }
  return out
}

function RuleSection({
  ruleKey, rows, expanded, onToggle, onChange,
}: { ruleKey: RuleKey; rows: Row[]; expanded: boolean; onToggle: () => void; onChange: (rows: Row[]) => void }) {
  const meta = SECTION_META[ruleKey]

  function updateRow(idx: number, field: 'key' | 'value', val: string) {
    onChange(rows.map((r, i) => i === idx ? { ...r, [field]: val } : r))
  }
  function addRow() { onChange([...rows, { key: '', value: '' }]) }
  function removeRow(idx: number) { onChange(rows.filter((_, i) => i !== idx)) }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 cursor-pointer" style={{ background: expanded ? 'var(--bg-inner)' : 'transparent' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.color + '16', color: meta.color, border: `1px solid ${meta.color}28` }}>
            {meta.icon}
          </div>
          <div className="text-left">
            <p className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{meta.label}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{rows.length} field{rows.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {expanded ? <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} /> : <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />}
      </button>

      {expanded && (
        <div className="px-5 py-4 flex flex-col gap-2">
          {rows.length === 0 && <p className="text-[12px] mb-2" style={{ color: 'var(--text-4)' }}>No fields configured yet.</p>}
          {rows.map((r, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input value={r.key} onChange={e => updateRow(idx, 'key', e.target.value)} placeholder="key"
                className="w-40 px-2.5 py-1.5 rounded-lg text-[12.5px] font-mono outline-none" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
              <input value={r.value} onChange={e => updateRow(idx, 'value', e.target.value)} placeholder="value"
                className="flex-1 px-2.5 py-1.5 rounded-lg text-[12.5px] outline-none" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
              <button onClick={() => removeRow(idx)} className="cursor-pointer p-1.5" style={{ color: '#f87171' }}><Trash2 size={13} strokeWidth={1.8} /></button>
            </div>
          ))}
          <button onClick={addRow} className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer mt-1"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            <Plus size={12} strokeWidth={2} />Add Field
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * The backend stores these 6 rule buckets as free-form JSON (`Schema.Types.Mixed`) with no named
 * sub-fields — a plain key/value editor per bucket is the only honest UI here (no fabricated toggle
 * rows/status pills the schema doesn't actually back).
 */
export function OperationalRulesScreen({ catererId, modules }: { catererId: string; modules: CatererModuleViewModel[] }) {
  const active = modules.filter(m => m.status !== 'inactive')
  const [selectedKey, setSelectedKey] = useState<string>(active[0]?.key ?? modules[0]?.key ?? '')
  const detailQuery = useModuleConfigurationDetail(catererId, selectedKey, Boolean(selectedKey))
  const saveMutation = useSaveConfiguration()

  const [expanded, setExpanded] = useState<Set<RuleKey>>(new Set(['payoutRules', 'creditRules']))
  const [rowsBySection, setRowsBySection] = useState<Record<RuleKey, Row[]>>({
    cutoffRules: [], payoutRules: [], creditRules: [], notificationSettings: [], reportSettings: [], labelSettings: [],
  })

  // Adjust form state during render when fresh data arrives, rather than an
  // effect + setState (which triggers a redundant extra render) — see
  // `FoundingPartnerScreen.tsx` for the same pattern.
  const [prefilledFor, setPrefilledFor] = useState<typeof detailQuery.data>(undefined)
  if (detailQuery.data && detailQuery.data !== prefilledFor) {
    setPrefilledFor(detailQuery.data)
    setRowsBySection({
      cutoffRules: toRows(detailQuery.data.cutoffRules),
      payoutRules: toRows(detailQuery.data.payoutRules),
      creditRules: toRows(detailQuery.data.creditRules),
      notificationSettings: toRows(detailQuery.data.notificationSettings),
      reportSettings: toRows(detailQuery.data.reportSettings),
      labelSettings: toRows(detailQuery.data.labelSettings),
    })
  }

  function toggleSection(s: RuleKey) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  function save() {
    saveMutation.mutate({
      catererId, moduleKey: selectedKey,
      cutoffRules: rowsToObject(rowsBySection.cutoffRules),
      payoutRules: rowsToObject(rowsBySection.payoutRules),
      creditRules: rowsToObject(rowsBySection.creditRules),
      notificationSettings: rowsToObject(rowsBySection.notificationSettings),
      reportSettings: rowsToObject(rowsBySection.reportSettings),
      labelSettings: rowsToObject(rowsBySection.labelSettings),
    })
  }

  const sections = Object.keys(SECTION_META) as RuleKey[]

  return (
    <div className="flex flex-col gap-4">
      <ModuleSelector modules={modules} selectedKey={selectedKey} onChange={setSelectedKey} />

      {detailQuery.isLoading ? (
        <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>Loading…</p>
      ) : (
        <>
          {sections.map(s => (
            <RuleSection
              key={s}
              ruleKey={s}
              rows={rowsBySection[s]}
              expanded={expanded.has(s)}
              onToggle={() => toggleSection(s)}
              onChange={rows => setRowsBySection(prev => ({ ...prev, [s]: rows }))}
            />
          ))}
          <div>
            <button onClick={save} disabled={saveMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              {saveMutation.isPending ? 'Saving…' : 'Save Configuration'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
