import { ChevronDown } from 'lucide-react'

interface SelectFilterProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}

export function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2 rounded-xl text-[12.5px] font-medium outline-none cursor-pointer"
        style={{
          background: 'var(--bg-inner)',
          border: `1px solid ${value ? '#a3e63550' : 'var(--border-strong)'}`,
          color: value ? 'var(--text-1)' : 'var(--text-4)',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={11}
        strokeWidth={2}
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-4)' }}
      />
    </div>
  )
}
