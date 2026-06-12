import { CATEGORIES } from '../services/mock/documentVaultMock'
import type { CategoryInfo } from '../services/mock/documentVaultMock'

interface CategoryGridProps {
  onSelectCategory: (cat: CategoryInfo) => void
}

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          onClick={() => onSelectCategory(cat)}
          className="text-left rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = cat.color + '55'
            el.style.boxShadow = `0 0 0 1px ${cat.color}20`
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border-default)'
            el.style.boxShadow = 'none'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: cat.color + '18', color: cat.color }}>
              {cat.icon}
            </div>
            {cat.pending > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                {cat.pending}
              </span>
            )}
          </div>
          <div>
            <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{cat.label}</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>{cat.totalDocs} documents</p>
          </div>
        </button>
      ))}
    </div>
  )
}
