import { useState } from 'react'
import { X, Save, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import type { MenuType, MenuViewModel, DishViewModel, MenuScheduleEntryViewModel, MenuSessionDateViewModel } from '@/features/catererMenus/types/catererMenus.types'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

export interface MenuFormValues {
  name: string
  ageGroup: string
  rotationWeeks: string
  choicesPerDay: string
  packageName: string
  packagePriceCents: string
  sessionDates: MenuSessionDateViewModel[]
  schedule: MenuScheduleEntryViewModel[]
}

interface MenuFormModalProps {
  type: MenuType
  isPackage: boolean
  editing: MenuViewModel | null
  dishes: DishViewModel[]
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (values: MenuFormValues) => void
}

const TYPE_TITLE: Record<MenuType, string> = {
  school: 'School Menu',
  daycare: 'Daycare Menu',
  camp: 'Camp Menu',
  common_meals: 'Common Meals',
  rotating_cycle: 'Rotating Cycle',
}

const HAS_SCHEDULE: MenuType[] = ['school', 'rotating_cycle']

function initialValues(editing: MenuViewModel | null): MenuFormValues {
  return {
    name: editing?.name ?? '',
    ageGroup: editing?.ageGroup ?? '',
    rotationWeeks: editing?.rotationWeeks?.toString() ?? '',
    choicesPerDay: editing?.choicesPerDay?.toString() ?? '',
    packageName: editing?.packageName ?? '',
    packagePriceCents: editing?.packagePriceCents?.toString() ?? '',
    sessionDates: editing?.sessionDates ?? [],
    schedule: editing?.schedule ?? [],
  }
}

export function MenuFormModal({ type, isPackage, editing, dishes, isSubmitting, error, onCancel, onSave }: MenuFormModalProps) {
  const [values, setValues] = useState<MenuFormValues>(() => initialValues(editing))

  function set<K extends keyof MenuFormValues>(key: K, value: MenuFormValues[K]) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const valid = values.name.trim().length > 0
  const showSchedule = HAS_SCHEDULE.includes(type) || ((type === 'daycare' || type === 'camp') && !isPackage)
  const showSessionDates = type === 'camp'
  const showPackageFields = (type === 'daycare' || type === 'camp') && isPackage

  function addScheduleRow() {
    set('schedule', [...values.schedule, { weekNumber: 1, dayOfWeek: 'Mon', choiceSlot: null, dishId: null, priceCents: null }])
  }
  function updateScheduleRow(idx: number, patch: Partial<MenuScheduleEntryViewModel>) {
    set('schedule', values.schedule.map((row, i) => (i === idx ? { ...row, ...patch } : row)))
  }
  function removeScheduleRow(idx: number) {
    set('schedule', values.schedule.filter((_, i) => i !== idx))
  }

  function addSessionDateRow() {
    set('sessionDates', [...values.sessionDates, { start: '', end: '' }])
  }
  function updateSessionDateRow(idx: number, patch: Partial<MenuSessionDateViewModel>) {
    set('sessionDates', values.sessionDates.map((row, i) => (i === idx ? { ...row, ...patch } : row)))
  }
  function removeSessionDateRow(idx: number) {
    set('sessionDates', values.sessionDates.filter((_, i) => i !== idx))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[560px] rounded-2xl flex flex-col overflow-hidden max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>
            {editing ? `Edit ${TYPE_TITLE[type]}` : `Add ${isPackage ? `${TYPE_TITLE[type]} Package` : TYPE_TITLE[type]}`}
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

          {type === 'daycare' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Age Group</label>
              <input value={values.ageGroup} onChange={e => set('ageGroup', e.target.value)} placeholder="e.g. 6-12 months" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          )}

          {type === 'rotating_cycle' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Rotation Weeks <span style={{ color: '#f87171' }}>*</span></label>
                <input value={values.rotationWeeks} onChange={e => set('rotationWeeks', e.target.value)} type="number" min={1} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Choices Per Day <span style={{ color: '#f87171' }}>*</span></label>
                <input value={values.choicesPerDay} onChange={e => set('choicesPerDay', e.target.value)} type="number" min={1} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
            </div>
          )}

          {showPackageFields && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Package Name</label>
                <input value={values.packageName} onChange={e => set('packageName', e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Package Price (cents)</label>
                <input value={values.packagePriceCents} onChange={e => set('packagePriceCents', e.target.value)} type="number" min={0} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
              </div>
            </div>
          )}

          {showSessionDates && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Session Dates</label>
                <button type="button" onClick={addSessionDateRow}
                  className="flex items-center gap-1 text-[11.5px] font-semibold cursor-pointer" style={{ color: 'var(--accent)' }}>
                  <Plus size={11} strokeWidth={2.5} />Add Session
                </button>
              </div>
              {values.sessionDates.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input value={row.start} onChange={e => updateSessionDateRow(idx, { start: e.target.value })} type="date"
                    className="flex-1 px-3 py-2 rounded-lg text-[12.5px] outline-none" style={inputStyle} />
                  <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>to</span>
                  <input value={row.end} onChange={e => updateSessionDateRow(idx, { end: e.target.value })} type="date"
                    className="flex-1 px-3 py-2 rounded-lg text-[12.5px] outline-none" style={inputStyle} />
                  <button type="button" onClick={() => removeSessionDateRow(idx)} style={{ color: '#f87171' }}>
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showSchedule && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Weekly Schedule</label>
                <button type="button" onClick={addScheduleRow}
                  className="flex items-center gap-1 text-[11.5px] font-semibold cursor-pointer" style={{ color: 'var(--accent)' }}>
                  <Plus size={11} strokeWidth={2.5} />Add Row
                </button>
              </div>
              {values.schedule.map((row, idx) => (
                <div key={idx} className="grid gap-2 items-center" style={{ gridTemplateColumns: '60px 90px 1fr 32px' }}>
                  <input value={row.weekNumber} onChange={e => updateScheduleRow(idx, { weekNumber: Number(e.target.value) })} type="number" min={1}
                    placeholder="Wk" className="px-2 py-2 rounded-lg text-[12px] outline-none" style={inputStyle} />
                  <input value={row.dayOfWeek} onChange={e => updateScheduleRow(idx, { dayOfWeek: e.target.value })}
                    placeholder="Day" className="px-2 py-2 rounded-lg text-[12px] outline-none" style={inputStyle} />
                  <select value={row.dishId ?? ''} onChange={e => updateScheduleRow(idx, { dishId: e.target.value || null })}
                    className="px-2 py-2 rounded-lg text-[12px] outline-none cursor-pointer" style={inputStyle}>
                    <option value="">No dish</option>
                    {dishes.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <button type="button" onClick={() => removeScheduleRow(idx)} style={{ color: '#f87171' }}>
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              ))}
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
