import { useState } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useCatererAccountingSettings } from '@/features/catererAccountingSettings/hooks/useCatererAccountingSettingsQueries'
import { useUpdateCatererAccountingSettings } from '@/features/catererAccountingSettings/hooks/useCatererAccountingSettingsActions'
import type { AccountingSoftware, CatererAccountingSettingsViewModel } from '@/features/catererAccountingSettings/types/catererAccountingSettings.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface FormState {
  accountingSoftware: AccountingSoftware | ''
  accountingSoftwareOther: string
  accountingCodes: string
  exportPreference: string
  taxSetup: string
}

const SOFTWARE_OPTIONS: { value: AccountingSoftware; label: string }[] = [
  { value: 'acomba', label: 'Acomba' },
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'sage', label: 'Sage' },
  { value: 'other', label: 'Other' },
]

/**
 * Accounting Active setup form — Caterer Portal Document §5.D. Writes
 * directly to the new caterer-owned `AccountingSettings` model; a
 * successful save invalidates Modules & Required Setup so the checklist
 * above flips to "Complete" immediately, with no page refresh needed.
 */
export function AccountingSettingsPanel() {
  const query = useCatererAccountingSettings(undefined)

  if (query.isLoading || !query.data) {
    return <p className="text-[11.5px] py-2" style={{ color: 'var(--text-4)' }}>Loading accounting setup…</p>
  }

  return <AccountingSettingsForm initial={query.data} />
}

/** Mounted only once `initial` is loaded — the form's starting values come from `useState`'s
 *  lazy initializer (computed once, on mount) rather than an effect that syncs state in. */
function AccountingSettingsForm({ initial }: { initial: CatererAccountingSettingsViewModel }) {
  const mutation = useUpdateCatererAccountingSettings()
  const [form, setForm] = useState<FormState>(() => ({
    accountingSoftware: initial.accountingSoftware ?? '',
    accountingSoftwareOther: initial.accountingSoftwareOther ?? '',
    accountingCodes: initial.accountingCodes ?? '',
    exportPreference: initial.exportPreference ?? '',
    taxSetup: initial.taxSetup ?? '',
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    mutation.mutate({
      accountingSoftware: form.accountingSoftware || undefined,
      accountingSoftwareOther: form.accountingSoftwareOther.trim() || undefined,
      accountingCodes: form.accountingCodes.trim() || undefined,
      exportPreference: form.exportPreference.trim() || undefined,
      taxSetup: form.taxSetup.trim() || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4 mb-5 px-4 py-4 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
      <p className="text-[10.5px] uppercase tracking-[0.13em] font-black" style={{ color: 'var(--text-4)' }}>Accounting Setup</p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Accounting software</label>
          <select
            value={form.accountingSoftware}
            onChange={e => set('accountingSoftware', e.target.value as AccountingSoftware | '')}
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}
          >
            <option value="">Select…</option>
            {SOFTWARE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {form.accountingSoftware === 'other' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Software name</label>
            <input value={form.accountingSoftwareOther} onChange={e => set('accountingSoftwareOther', e.target.value)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Export preference <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.exportPreference} onChange={e => set('exportPreference', e.target.value)}
            placeholder="e.g. CSV export, monthly API sync…"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Accounting codes (if required)</label>
          <input value={form.accountingCodes} onChange={e => set('accountingCodes', e.target.value)}
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Tax setup (if required)</label>
          <input value={form.taxSetup} onChange={e => set('taxSetup', e.target.value)}
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>
      </div>

      {mutation.isError && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
          <span className="text-[12.5px]" style={{ color: '#f87171' }}>{mutation.error?.message ?? 'Failed to save.'}</span>
        </div>
      )}
      {mutation.isSuccess && !mutation.isPending && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.25)' }}>
          <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
          <span className="text-[12.5px] font-semibold" style={{ color: '#4ade80' }}>Saved</span>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={mutation.isPending}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          <Save size={13} strokeWidth={2.2} />{mutation.isPending ? 'Saving…' : 'Save Accounting Setup'}
        </button>
      </div>
    </div>
  )
}
