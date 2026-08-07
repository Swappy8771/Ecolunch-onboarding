import { useState } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useCatererDaycareMealsSettings } from '@/features/catererDaycareMealsSettings/hooks/useCatererDaycareMealsSettingsQueries'
import { useUpdateCatererDaycareMealsSettings } from '@/features/catererDaycareMealsSettings/hooks/useCatererDaycareMealsSettingsActions'
import type { CatererDaycareMealsSettingsViewModel } from '@/features/catererDaycareMealsSettings/types/catererDaycareMealsSettings.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface FormState {
  daysFrequency: string
  absenceRules: string
  reportingRequirements: string
}

/**
 * Daycare / CPE Meals Active setup form — Caterer Portal Document §5.B.
 * Writes directly to the new caterer-owned `DaycareMealsSettings` model;
 * a successful save invalidates Modules & Required Setup so the checklist
 * above flips to "Complete" immediately, with no page refresh needed.
 * Package pricing (the caterer's own price for a daycare package) is set
 * on the package itself, in Menus & Packages, not here — see
 * `modules-required-setup.service.ts`'s header comment for why it isn't
 * duplicated as a separate settings field.
 */
export function DaycareMealsSettingsPanel() {
  const query = useCatererDaycareMealsSettings(undefined)

  if (query.isLoading || !query.data) {
    return <p className="text-[11.5px] py-2" style={{ color: 'var(--text-4)' }}>Loading daycare / CPE meals setup…</p>
  }

  return <DaycareMealsSettingsForm initial={query.data} />
}

/** Mounted only once `initial` is loaded — the form's starting values come from `useState`'s
 *  lazy initializer (computed once, on mount) rather than an effect that syncs state in. */
function DaycareMealsSettingsForm({ initial }: { initial: CatererDaycareMealsSettingsViewModel }) {
  const mutation = useUpdateCatererDaycareMealsSettings()
  const [form, setForm] = useState<FormState>(() => ({
    daysFrequency: initial.daysFrequency ?? '',
    absenceRules: initial.absenceRules ?? '',
    reportingRequirements: initial.reportingRequirements ?? '',
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    mutation.mutate({
      daysFrequency: form.daysFrequency.trim() || undefined,
      absenceRules: form.absenceRules.trim() || undefined,
      reportingRequirements: form.reportingRequirements.trim() || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4 mb-5 px-4 py-4 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
      <p className="text-[10.5px] uppercase tracking-[0.13em] font-black" style={{ color: 'var(--text-4)' }}>Daycare / CPE Meals Setup</p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Days / frequency <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.daysFrequency} onChange={e => set('daysFrequency', e.target.value)}
            placeholder="e.g. Monday to Friday, once daily"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Absence / adjustment rules (if applicable)</label>
          <input value={form.absenceRules} onChange={e => set('absenceRules', e.target.value)}
            placeholder="e.g. 48-hour notice required for a credit"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Daycare reporting requirements (if applicable)</label>
          <input value={form.reportingRequirements} onChange={e => set('reportingRequirements', e.target.value)}
            placeholder="e.g. Weekly attendance report to each daycare"
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
          <Save size={13} strokeWidth={2.2} />{mutation.isPending ? 'Saving…' : 'Save Daycare / CPE Setup'}
        </button>
      </div>
    </div>
  )
}
