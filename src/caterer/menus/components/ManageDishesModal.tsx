import { X, Plus, Trash2, AlertTriangle } from 'lucide-react'
import type { MenuViewModel, DishViewModel } from '@/features/catererMenus/types/catererMenus.types'

interface ManageDishesModalProps {
  menu: MenuViewModel
  allDishes: DishViewModel[]
  isSubmitting: boolean
  error: string | null
  onCancel: () => void
  onAdd: (dishId: string) => void
  onRemove: (dishId: string) => void
}

export function ManageDishesModal({ menu, allDishes, isSubmitting, error, onCancel, onAdd, onRemove }: ManageDishesModalProps) {
  const attachedIds = new Set(menu.dishes.map(d => d.id))
  const available = allDishes.filter(d => !attachedIds.has(d.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-[460px] rounded-2xl flex flex-col overflow-hidden max-h-[80vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <h2 className="text-[16px] font-black" style={{ color: 'var(--text-1)' }}>Manage Dishes — {menu.name}</h2>
          <button onClick={onCancel} className="mt-0.5 cursor-pointer" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Attached ({menu.dishes.length})</p>
            {menu.dishes.length === 0 ? (
              <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>No dishes attached yet.</p>
            ) : menu.dishes.map(d => (
              <div key={d.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
                <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-1)' }}>{d.name}</span>
                <button disabled={isSubmitting} onClick={() => onRemove(d.id)} style={{ color: '#f87171' }}>
                  <Trash2 size={13} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Available from Dish Library</p>
            {available.length === 0 ? (
              <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>No other dishes in your library.</p>
            ) : available.map(d => (
              <div key={d.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
                <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-1)' }}>{d.name}</span>
                <button disabled={isSubmitting} onClick={() => onAdd(d.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11.5px] font-semibold cursor-pointer"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                  <Plus size={11} strokeWidth={2.5} />Attach
                </button>
              </div>
            ))}
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
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer" style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>Done</button>
        </div>
      </div>
    </div>
  )
}
