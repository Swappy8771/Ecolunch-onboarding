import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'
import type { EstablishmentDetailViewModel, EstablishmentType, CssDistrictViewModel } from '@/features/catererEstablishments/types/catererEstablishments.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export interface EstablishmentFormValues {
  name: string
  city: string
  address: string
  schoolType: 'public' | 'private' | ''
  cssDistrictId: string
  studentCount: string
  daycareType: 'CPE' | 'Daycare' | 'Garderie' | ''
  childCapacity: string
  municipality: string
  participantCount: string
  sessionStart: string
  sessionEnd: string
}

interface EstablishmentFormModalProps {
  type: EstablishmentType
  editing: EstablishmentDetailViewModel | null
  cssDistricts: CssDistrictViewModel[]
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (values: EstablishmentFormValues) => void
}

const TYPE_TITLE: Record<EstablishmentType, string> = {
  school: 'School',
  daycare: 'Daycare / CPE',
  camp: 'Camp',
  css: 'CSS / School District',
}

function initialValues(editing: EstablishmentDetailViewModel | null): EstablishmentFormValues {
  return {
    name: editing?.name ?? '',
    city: editing?.city ?? '',
    address: (editing && 'address' in editing ? editing.address : '') ?? '',
    schoolType: (editing?.type === 'school' ? editing.schoolType ?? '' : ''),
    cssDistrictId: (editing?.type === 'school' ? editing.cssDistrictId ?? '' : ''),
    studentCount: (editing?.type === 'school' ? editing.studentCount?.toString() ?? '' : ''),
    daycareType: (editing?.type === 'daycare' ? editing.daycareType ?? '' : ''),
    childCapacity: (editing?.type === 'daycare' ? editing.childCapacity?.toString() ?? '' : ''),
    municipality: (editing?.type === 'css' ? editing.municipality ?? '' : ''),
    participantCount: (editing?.type === 'camp' ? editing.participantCount?.toString() ?? '' : ''),
    sessionStart: (editing?.type === 'camp' ? editing.sessionDates[0]?.start ?? '' : ''),
    sessionEnd: (editing?.type === 'camp' ? editing.sessionDates[0]?.end ?? '' : ''),
  }
}

export function EstablishmentFormModal({
  type, editing, cssDistricts, isSubmitting, error, onCancel, onSave,
}: EstablishmentFormModalProps) {
  const [values, setValues] = useState<EstablishmentFormValues>(() => initialValues(editing))

  function set<K extends keyof EstablishmentFormValues>(key: K, value: EstablishmentFormValues[K]) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const valid = values.name.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[480px] rounded-2xl flex flex-col overflow-hidden max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>
            {editing ? `Edit ${TYPE_TITLE[type]}` : `Add ${TYPE_TITLE[type]}`}
          </h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Name <span style={{ color: '#f87171' }}>*</span></label>
            <input value={values.name} onChange={e => set('name', e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>City</label>
              <input value={values.city} onChange={e => set('city', e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            {type !== 'css' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Address</label>
                <input value={values.address} onChange={e => set('address', e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
            )}
          </div>

          {type === 'school' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>School Type</label>
                  <select value={values.schoolType} onChange={e => set('schoolType', e.target.value as EstablishmentFormValues['schoolType'])}
                    className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
                    <option value="">Select…</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Student Count</label>
                  <input value={values.studentCount} onChange={e => set('studentCount', e.target.value)} type="number" min={0}
                    className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>CSS / District</label>
                <select value={values.cssDistrictId} onChange={e => set('cssDistrictId', e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
                  <option value="">Not linked</option>
                  {cssDistricts.map(css => <option key={css.id} value={css.id}>{css.name}</option>)}
                </select>
              </div>
            </>
          )}

          {type === 'daycare' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Daycare Type</label>
                <select value={values.daycareType} onChange={e => set('daycareType', e.target.value as EstablishmentFormValues['daycareType'])}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer" style={inputStyle}>
                  <option value="">Select…</option>
                  <option value="CPE">CPE</option>
                  <option value="Daycare">Daycare</option>
                  <option value="Garderie">Garderie</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Capacity</label>
                <input value={values.childCapacity} onChange={e => set('childCapacity', e.target.value)} type="number" min={0}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
            </div>
          )}

          {type === 'camp' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Participant Count</label>
                <input value={values.participantCount} onChange={e => set('participantCount', e.target.value)} type="number" min={0}
                  className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Session Start</label>
                  <input value={values.sessionStart} onChange={e => set('sessionStart', e.target.value)} type="date"
                    className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Session End</label>
                  <input value={values.sessionEnd} onChange={e => set('sessionEnd', e.target.value)} type="date"
                    className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                </div>
              </div>
            </>
          )}

          {type === 'css' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Municipality</label>
              <input value={values.municipality} onChange={e => set('municipality', e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
              <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
              <span className="text-[12.5px]" style={{ color: '#f87171' }}>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer" style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>Cancel</button>
          <button disabled={!valid || isSubmitting} onClick={() => onSave(values)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Save size={13} strokeWidth={2.2} />{isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
