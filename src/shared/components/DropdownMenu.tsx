import { MoreHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

export interface DropdownAction {
  label: string
  icon: ReactNode
  color?: string
  onClick?: () => void
  /** Renders greyed-out and non-clickable, with `title` as the hover tooltip explaining why — used for actions with no backing implementation yet, so they read as "not available" rather than silently doing nothing. */
  disabled?: boolean
  title?: string
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

  // Positioned via a portal to `document.body` (fixed coordinates from the
  // trigger's own rect) rather than an absolutely-positioned child of the
  // row — rows commonly sit inside `overflow-hidden` cards (e.g. Document
  // Vault's category sections), which would otherwise clip the menu.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    function reposition() {
      const rect = triggerRef.current!.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    reposition()
    // The row's own scroll container (not necessarily `window`) can move
    // under a `position: fixed` menu, so this must re-read the trigger's
    // rect on every scroll/resize, not just once at open time.
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  return (
    <>
      <button
        ref={triggerRef}
        onClick={e => { e.stopPropagation(); onToggle() }}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        style={{
          color: open ? 'var(--text-2)' : 'var(--text-3)',
          background: 'var(--bg-inner)',
          border: `1px solid ${open ? 'var(--border-strong)' : 'var(--border-default)'}`,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--bg-inner)'
          el.style.borderColor = 'var(--border-strong)'
          el.style.color = 'var(--text-2)'
        }}
        onMouseLeave={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--bg-inner)'
            el.style.borderColor = 'var(--border-default)'
            el.style.color = 'var(--text-3)'
          }
        }}
      >
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>

      {open && pos && createPortal(
        <div
          ref={menuRef}
          className="fixed rounded-xl py-1.5"
          style={{
            top: pos.top,
            right: pos.right,
            minWidth,
            zIndex: 9999,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          {actions.map((a, i) => (
            <button
              key={i}
              disabled={a.disabled}
              title={a.disabled ? (a.title ?? 'Not available yet') : a.title}
              onClick={e => {
                e.stopPropagation()
                if (a.disabled) return
                a.onClick?.()
                onClose()
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-left"
              style={{
                color: a.disabled ? 'var(--text-4)' : (a.color || 'var(--text-2)'),
                opacity: a.disabled ? 0.5 : 1,
                cursor: a.disabled ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!a.disabled) (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ color: a.disabled ? 'var(--text-4)' : (a.color || 'var(--text-4)') }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
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
