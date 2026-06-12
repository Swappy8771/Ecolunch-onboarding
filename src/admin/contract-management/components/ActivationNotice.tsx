import { Info } from 'lucide-react'

export function ActivationNotice() {
  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
    >
      <Info size={15} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
      <div>
        <p className="text-[12px] font-bold mb-0.5" style={{ color: '#fbbf24' }}>
          Contract alone does not activate the caterer
        </p>
        <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
          Contract completion satisfies one of the 11 mandatory onboarding requirements. The caterer remains
          inactive until all checklist items in Go-live Monitor are marked complete.
        </p>
      </div>
    </div>
  )
}
