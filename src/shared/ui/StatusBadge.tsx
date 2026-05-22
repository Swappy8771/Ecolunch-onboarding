export type StatusType =
  | 'en-attente'
  | 'correction'
  | 'manquant'
  | 'rejete'
  | 'approuve'

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; dot: string; text: string; bg: string }
> = {
  'en-attente': {
    label: 'En attente',
    dot: 'bg-[#60a5fa]',
    text: 'text-[#60a5fa]',
    bg: 'bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.2)]',
  },
  correction: {
    label: 'Correction',
    dot: 'bg-[#fb923c]',
    text: 'text-[#fb923c]',
    bg: 'bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.2)]',
  },
  manquant: {
    label: 'Manquant',
    dot: 'bg-[#fbbf24]',
    text: 'text-[#fbbf24]',
    bg: 'bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.2)]',
  },
  rejete: {
    label: 'Rejeté',
    dot: 'bg-[#f87171]',
    text: 'text-[#f87171]',
    bg: 'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.2)]',
  },
  approuve: {
    label: 'Approuvé',
    dot: 'bg-[#4ade80]',
    text: 'text-[#4ade80]',
    bg: 'bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.2)]',
  },
}

interface StatusBadgeProps {
  status: StatusType
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
