import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'accent' | 'muted' | 'active'
  className?: string
}

export function Badge({ children, variant = 'muted', className = '' }: BadgeProps) {
  const variants = {
    accent: 'bg-[rgba(163,230,53,0.1)] text-[#a3e635] border border-[rgba(163,230,53,0.25)]',
    muted: 'bg-[#1e1e22] text-[#a1a1aa]',
    active: 'bg-white text-[#09090b] font-medium',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
