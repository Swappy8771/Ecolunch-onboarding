import { useState } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useCatererSchoolMealsSettings } from '@/features/catererSchoolMealsSettings/hooks/useCatererSchoolMealsSettingsQueries'
import { useUpdateCatererSchoolMealsSettings } from '@/features/catererSchoolMealsSettings/hooks/useCatererSchoolMealsSettingsActions'
import type { CatererSchoolMealsSettingsViewModel } from '@/features/catererSchoolMealsSettings/types/catererSchoolMealsSettings.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface FormState {
  cutoffRules: string
  labelRequirements: string
  reportingRequirements: string
}

/**
 * School Meals Active setup form — Caterer Portal Document §5.A. Writes
 * directly to the new caterer-owned `SchoolMealsSettings` model; a
 * successful save invalidates Modules & Required Setup so the checklist
 * above flips to "Complete" immediately, with no page refresh needed.
 */
export function SchoolMealsSettingsPanel() {
  const query = useCatererSchoolMealsSettings(undefined)

  if (query.isLoading || !query.data) {
    return <p className="text-[11.5px] py-2" style={{ color: 'var(--text-4)' }}>Loading school meals setup…</p>
  }

  return <SchoolMealsSettingsForm initial={query.data} />
}

/** Mounted only once `initial` is loaded — the form's starting values come from `useState`'s
 *  lazy initializer (computed once, on mount) rather than an effect that syncs state in. */
function SchoolMealsSettingsForm({ initial }: { initial: CatererSchoolMealsSettingsViewModel }) {
  const mutation = useUpdateCatererSchoolMealsSettings()
  const [form, setForm] = useState<FormState>(() => ({
    cutoffRules: initial.cutoffRules ?? '',
    labelRequirements: initial.labelRequirements ?? '',
    reportingRequirements: initial.reportingRequirements ?? '',
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    mutation.mutate({
      cutoffRules: form.cutoffRules.trim() || undefined,
      labelRequirements: form.labelRequirements.trim() || undefined,
      reportingRequirements: form.reportingRequirements.trim() || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4 mb-5 px-4 py-4 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
      <p className="text-[10.5px] uppercase tracking-[0.13em] font-black" style={{ color: 'var(--text-4)' }}>School Meals Setup</p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Cutoff rules <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.cutoffRules} onChange={e => set('cutoffRules', e.target.value)}
            placeholder="e.g. Orders must be placed by 2pm the day before delivery"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Label requirements (if applicable)</label>
          <input value={form.labelRequirements} onChange={e => set('labelRequirements', e.target.value)}
            placeholder="e.g. Allergen labels required on all school menu items"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>School / CSS reporting requirements (if applicable)</label>
          <input value={form.reportingRequirements} onChange={e => set('reportingRequirements', e.target.value)}
            placeholder="e.g. Monthly consumption report to each CSS"
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
          <Save size={13} strokeWidth={2.2} />{mutation.isPending ? 'Saving…' : 'Save School Meals Setup'}
        </button>
      </div>
    </div>
  )
}
