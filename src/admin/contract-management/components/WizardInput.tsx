interface WizardInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoSource?: string
}

export function WizardInput({ label, value, onChange, type = 'text', autoSource }: WizardInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--text-4)' }}>
          {label}
        </label>
        {autoSource && (
          <span
            className="text-[9.5px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.22)' }}
          >
            auto · {autoSource}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl text-[12.5px] outline-none"
        style={{
          background: 'var(--bg-inner)',
          border: `1px solid ${value ? 'var(--border-strong)' : 'rgba(248,113,113,0.35)'}`,
          color: 'var(--text-1)',
        }}
      />
    </div>
  )
}
