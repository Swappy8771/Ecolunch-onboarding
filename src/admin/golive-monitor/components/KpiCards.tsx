import { Rocket, AlertTriangle, XCircle, Users } from 'lucide-react'
import { StatCard } from '@/features/dashboard/components/StatCard'

interface KpiCardsProps {
  ready: number
  notReady: number
  blocked: number
  total: number
}

export function KpiCards({ ready, notReady, blocked, total }: KpiCardsProps) {
  const pct = (n: number) => total > 0 ? `${Math.round((n / total) * 100)}%` : '0%'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Ready for Go-live"
        value={ready}
        valueColor="lime"
        trend={`${pct(ready)} of total`}
        icon={<Rocket size={15} strokeWidth={1.8} />}
      />
      <StatCard
        label="Not Ready"
        value={notReady}
        valueColor="amber"
        trend={`${pct(notReady)} of total`}
        icon={<AlertTriangle size={15} strokeWidth={1.8} />}
      />
      <StatCard
        label="Blocked"
        value={blocked}
        valueColor="red"
        trend={`${pct(blocked)} of total`}
        icon={<XCircle size={15} strokeWidth={1.8} />}
      />
      <StatCard
        label="Total Caterers"
        value={total}
        valueColor="blue"
        trend="in onboarding"
        icon={<Users size={15} strokeWidth={1.8} />}
      />
    </div>
  )
}
