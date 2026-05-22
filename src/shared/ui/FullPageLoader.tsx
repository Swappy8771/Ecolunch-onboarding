import { InlineLoader } from './InlineLoader'

export function FullPageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <InlineLoader />
        <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{label}</span>
      </div>
    </div>
  )
}
