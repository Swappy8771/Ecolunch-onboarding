import { Filter, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'

interface FilterBarProps {
  onApply: () => void
  onReset: () => void
  hasFilter: boolean
  children: ReactNode
}

export function FilterBar({ onApply, onReset, hasFilter, children }: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-2.5 mb-5 rounded-2xl px-5 py-3.5 items-center"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      <Filter size={13} strokeWidth={2} style={{ color: 'var(--text-4)', flexShrink: 0 }} />

      {children}

      <div className="flex items-center gap-2 flex-1 justify-end" style={{ minWidth: 'max-content' }}>
        {hasFilter && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-80"
            style={{ color: 'var(--text-3)', background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}
          >
            <RotateCcw size={12} strokeWidth={2} />
            Reset
          </button>
        )}
        <button
          onClick={onApply}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-85"
          style={{ background: '#a3e635', color: '#07070a' }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
