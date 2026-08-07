import { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'

const inputStyle = {
  background: 'var(--bg-inner)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri'] as const

interface DishFormModalProps {
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onSave: (input: {
    name: string; description: string; priceCents: string; category: string; availableDays: string[]; allergens: string
  }) => void
}

export function DishFormModal({ isSubmitting, error, onCancel, onSave }: DishFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceCents, setPriceCents] = useState('')
  const [category, setCategory] = useState('')
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [allergens, setAllergens] = useState('')

  const valid = name.trim().length > 0

  function toggleDay(day: string) {
    setAvailableDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[460px] rounded-2xl flex flex-col overflow-hidden max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Add Dish</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Name <span style={{ color: '#f87171' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Price (cents)</label>
              <input value={priceCents} onChange={e => setPriceCents(e.target.value)} type="number" min={0} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Available Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => {
                const active = availableDays.includes(day)
                return (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer uppercase"
                    style={{
                      background: active ? 'var(--accent-dim)' : 'var(--bg-inner)',
                      color: active ? 'var(--accent)' : 'var(--text-3)',
                      border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                    }}>
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Allergens</label>
            <input value={allergens} onChange={e => setAllergens(e.target.value)} placeholder="Comma-separated, e.g. Gluten, Milk" className="px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
          </div>

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
          <button disabled={!valid || isSubmitting} onClick={() => onSave({ name, description, priceCents, category, availableDays, allergens })}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Save size={13} strokeWidth={2.2} />{isSubmitting ? 'Saving…' : 'Add Dish'}
          </button>
        </div>
      </div>
    </div>
  )
}
