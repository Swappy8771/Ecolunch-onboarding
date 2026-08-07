import { useState } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useCatererReportiqSettings } from '@/features/catererReportiqSettings/hooks/useCatererReportiqSettingsQueries'
import { useUpdateCatererReportiqSettings } from '@/features/catererReportiqSettings/hooks/useCatererReportiqSettingsActions'
import { useCatererEstablishmentsList } from '@/features/catererEstablishments/hooks/useCatererEstablishmentsQueries'
import type { CatererReportiqSettingsViewModel } from '@/features/catererReportiqSettings/types/catererReportiqSettings.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

interface FormState {
  reportTypesText: string
  recipientsText: string
  frequency: string
  format: string
  establishmentIds: string[]
  automationNeeds: string
}

function toList(text: string): string[] {
  return text.split(',').map(s => s.trim()).filter(Boolean)
}

/**
 * ReportIQ Active setup form — Caterer Portal Document §5.E. Writes
 * directly to the new caterer-owned `ReportiqSettings` model, including a
 * genuine link to the caller's own `Establishment` records for "schools /
 * daycares / CSS concerned" rather than free text. A successful save
 * invalidates Modules & Required Setup so the checklist above flips to
 * "Complete" immediately, with no page refresh needed.
 */
export function ReportiqSettingsPanel() {
  const query = useCatererReportiqSettings(undefined)

  if (query.isLoading || !query.data) {
    return <p className="text-[11.5px] py-2" style={{ color: 'var(--text-4)' }}>Loading ReportIQ setup…</p>
  }

  return <ReportiqSettingsForm initial={query.data} />
}

/** Mounted only once `initial` is loaded — the form's starting values come from `useState`'s
 *  lazy initializer (computed once, on mount) rather than an effect that syncs state in. */
function ReportiqSettingsForm({ initial }: { initial: CatererReportiqSettingsViewModel }) {
  const establishmentsQuery = useCatererEstablishmentsList({ page: 1, limit: 100 })
  const mutation = useUpdateCatererReportiqSettings()
  const [form, setForm] = useState<FormState>(() => ({
    reportTypesText: initial.reportTypes.join(', '),
    recipientsText: initial.recipients.join(', '),
    frequency: initial.frequency ?? '',
    format: initial.format ?? '',
    establishmentIds: [...initial.establishmentIds],
    automationNeeds: initial.automationNeeds ?? '',
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleEstablishment(id: string) {
    setForm(prev => {
      const has = prev.establishmentIds.includes(id)
      return { ...prev, establishmentIds: has ? prev.establishmentIds.filter(x => x !== id) : [...prev.establishmentIds, id] }
    })
  }

  function handleSave() {
    mutation.mutate({
      reportTypes: toList(form.reportTypesText),
      recipients: toList(form.recipientsText),
      frequency: form.frequency.trim() || undefined,
      format: form.format.trim() || undefined,
      establishmentIds: form.establishmentIds,
      automationNeeds: form.automationNeeds.trim() || undefined,
    })
  }

  const establishmentOptions = establishmentsQuery.data?.data ?? []

  return (
    <div className="flex flex-col gap-4 mb-5 px-4 py-4 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
      <p className="text-[10.5px] uppercase tracking-[0.13em] font-black" style={{ color: 'var(--text-4)' }}>ReportIQ Setup</p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Required report types <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.reportTypesText} onChange={e => set('reportTypesText', e.target.value)}
            placeholder="Comma-separated, e.g. Attendance, Billing, Compliance"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Recipients <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.recipientsText} onChange={e => set('recipientsText', e.target.value)}
            placeholder="Comma-separated emails or names"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Frequency <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.frequency} onChange={e => set('frequency', e.target.value)}
            placeholder="e.g. Weekly, Monthly"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
            Format <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input value={form.format} onChange={e => set('format', e.target.value)}
            placeholder="e.g. PDF, CSV, Excel"
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          Schools / daycares / CSS concerned <span style={{ color: '#f87171' }}>*</span>
        </label>
        {establishmentsQuery.isLoading && <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>Loading establishments…</p>}
        {!establishmentsQuery.isLoading && establishmentOptions.length === 0 && (
          <p className="text-[11.5px] italic" style={{ color: 'var(--text-4)' }}>No establishments registered yet.</p>
        )}
        {establishmentOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2.5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            {establishmentOptions.map(e => {
              const checked = form.establishmentIds.includes(e.id)
              return (
                <button key={e.id} type="button" onClick={() => toggleEstablishment(e.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
                  style={checked
                    ? { background: 'rgba(74,222,128,0.14)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.30)' }
                    : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
                  {e.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>
          Automation needs <span style={{ color: '#f87171' }}>*</span>
        </label>
        <input value={form.automationNeeds} onChange={e => set('automationNeeds', e.target.value)}
          placeholder="e.g. Auto-send monthly on the 1st"
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
          <Save size={13} strokeWidth={2.2} />{mutation.isPending ? 'Saving…' : 'Save ReportIQ Setup'}
        </button>
      </div>
    </div>
  )
}
