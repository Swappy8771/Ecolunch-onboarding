import type { ReactNode } from 'react'
import {
  Users, Scale, Landmark, Shield, ShieldCheck,
  Building2, UtensilsCrossed, Puzzle, FilePen, Rocket, Lock,
} from 'lucide-react'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { useDocumentCategoryTiles } from '@/features/adminDocumentVault/hooks/useDocumentCategoryTiles'
import type { DocumentCategoryTileViewModel } from '@/features/adminDocumentVault/types/documentVault.types'

/**
 * Decoration only (icon/color) — keyed on the real 11-value backend
 * category enum (`documents.model.ts`'s `DOCUMENT_CATEGORIES`), fixing the
 * old mock's `clients` key (the real key is `establishments`). Labels come
 * from the backend's own `categoryLabel()` (via `DocumentCategoryTileViewModel.label`),
 * not hardcoded here.
 */
const CATEGORY_ICON: Record<string, { icon: ReactNode; color: string }> = {
  profile:        { icon: <Users           size={15} strokeWidth={1.8} />, color: '#60a5fa' },
  legal:          { icon: <Scale           size={15} strokeWidth={1.8} />, color: '#a78bfa' },
  banking:        { icon: <Landmark        size={15} strokeWidth={1.8} />, color: '#4ade80' },
  compliance:     { icon: <Shield          size={15} strokeWidth={1.8} />, color: '#34d399' },
  insurance:      { icon: <ShieldCheck     size={15} strokeWidth={1.8} />, color: '#fbbf24' },
  establishments: { icon: <Building2       size={15} strokeWidth={1.8} />, color: '#22d3ee' },
  menus:          { icon: <UtensilsCrossed size={15} strokeWidth={1.8} />, color: '#fb923c' },
  modules:        { icon: <Puzzle          size={15} strokeWidth={1.8} />, color: '#a3e635' },
  contracts:      { icon: <FilePen         size={15} strokeWidth={1.8} />, color: '#a78bfa' },
  golive:         { icon: <Rocket          size={15} strokeWidth={1.8} />, color: '#fb923c' },
  internal:       { icon: <Lock            size={15} strokeWidth={1.8} />, color: '#60a5fa' },
}

const DEFAULT_ICON = { icon: <Puzzle size={15} strokeWidth={1.8} />, color: '#94a3b8' }

interface CategoryGridProps {
  catererId: string
  onSelectCategory: (cat: DocumentCategoryTileViewModel) => void
}

export function CategoryGrid({ catererId, onSelectCategory }: CategoryGridProps) {
  const { data: tiles, isLoading, isError, error } = useDocumentCategoryTiles(catererId)

  if (isLoading) return <FullPageLoader label="Loading categories…" />
  if (isError) {
    return (
      <div className="text-center py-16 text-[13px]" style={{ color: 'var(--text-3)' }}>
        {error?.message ?? 'Failed to load categories.'}
      </div>
    )
  }

  const items = tiles ?? []

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {items.map(tile => {
        const meta = CATEGORY_ICON[tile.key] ?? DEFAULT_ICON
        return (
          <button
            key={tile.key}
            onClick={() => onSelectCategory(tile)}
            className="text-left rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = meta.color + '55'
              el.style.boxShadow = `0 0 0 1px ${meta.color}20`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border-default)'
              el.style.boxShadow = 'none'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: meta.color + '18', color: meta.color }}>
                {meta.icon}
              </div>
              {tile.pendingCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                  {tile.pendingCount}
                </span>
              )}
            </div>
            <div>
              <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{tile.label}</p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
                {tile.approvedCount}/{tile.totalRequirements} requirements approved
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
