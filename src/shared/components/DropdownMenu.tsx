import { MoreHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef, useEffect, useState } from 'react'

export interface DropdownAction {
  label: string
  icon: ReactNode
  color?: string
  onClick?: () => void
}

interface DropdownMenuProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
  actions: DropdownAction[]
  minWidth?: string
}

export function DropdownMenu({
  open,
  onToggle,
  onClose,
  actions,
  minWidth = '200px',
}: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={e => { e.stopPropagation(); onToggle() }}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        style={{
          color: open ? 'var(--text-2)' : 'var(--text-4)',
          background: open ? 'var(--bg-inner)' : 'transparent',
          border: open ? '1px solid var(--border-strong)' : '1px solid transparent',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg-inner)'
          el.style.borderColor = 'var(--border-strong)'
        }}
        onMouseLeave={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'transparent'
            el.style.borderColor = 'transparent'
          }
        }}
      >
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-8 z-30 rounded-xl py-1.5"
          style={{
            minWidth,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); a.onClick?.(); onClose() }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-left cursor-pointer"
              style={{ color: a.color || 'var(--text-2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ color: a.color || 'var(--text-4)' }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function RowMenu({ actions, minWidth }: { actions: DropdownAction[]; minWidth?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu
      open={open}
      onToggle={() => setOpen(o => !o)}
      onClose={() => setOpen(false)}
      actions={actions}
      minWidth={minWidth}
    />
  )
}
