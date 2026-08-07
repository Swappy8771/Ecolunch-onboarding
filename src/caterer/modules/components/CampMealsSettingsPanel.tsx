import { useState } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useCatererCampMealsSettings } from '@/features/catererCampMealsSettings/hooks/useCatererCampMealsSettingsQueries'
import { useUpdateCatererCampMealsSettings } from '@/features/catererCampMealsSettings/hooks/useCatererCampMealsSettingsActions'
import type { CatererCampMealsSettingsViewModel } from '@/features/catererCampMealsSettings/types/catererCampMealsSettings.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface FormState {
  reportingRequirements: string
}

/**
 * Camp Meals Active setup form — Caterer Portal Document §5.C. Writes
 * directly to the new caterer-owned `CampMealsSettings` model; a
 * successful save invalidates Modules & Required Setup so the checklist
 * above flips to "Complete" immediately, with no page refresh needed.
 */
export function CampMealsSettingsPanel() {
  const query = useCatererCampMealsSettings(undefined)

  if (query.isLoading || !query.data) {
    return <p className="text-[11.5px] py-2" style={{ color: 'var(--text-4)' }}>Loading camp meals setup…</p>
  }

  return <CampMealsSettingsForm initial={query.data} />
}

/** Mounted only once `initial` is loaded — the form's starting values come from `useState`'s
 *  lazy initializer (computed once, on mount) rather than an effect that syncs state in. */
function CampMealsSettingsForm({ initial }: { initial: CatererCampMealsSettingsViewModel }) {
  const mutation = useUpdateCatererCampMealsSettings()
  const [form, setForm] = useState<FormState>(() => ({
    reportingRequirements: initial.reportingRequirements ?? '',
  }))

  function handleSave() {
    mutation.mutate({
      reportingRequirements: form.reportingRequirements.trim() || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4 mb-5 px-4 py-4 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
      <p className="text-[10.5px] uppercase tracking-[0.13em] font-black" style={{ color: 'var(--text-4)' }}>Camp Meals Setup</p>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Reporting requirements (if applicable)</label>
        <input value={form.reportingRequirements} onChange={e => setForm({ reportingRequirements: e.target.value })}
          placeholder="e.g. End-of-session attendance report"
          className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
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
          <Save size={13} strokeWidth={2.2} />{mutation.isPending ? 'Saving…' : 'Save Camp Meals Setup'}
        </button>
      </div>
    </div>
  )
}
