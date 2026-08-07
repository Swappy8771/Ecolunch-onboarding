import { Ticket, Clock, UserCheck, CheckCircle2, Archive, ShieldAlert } from 'lucide-react'
import { StatCard } from '@/features/adminDashboard/components/StatCard'

interface EcoLoopKpiCardsProps {
  open: number
  waitingForCaterer: number
  waitingForAdmin: number
  resolved: number
  closed: number
  openGoLiveBlockers: number
}

/** Sourced from the real `GET /admin/ecoloop/dashboard` summary, plus one client-computed count
 *  (open Go-live-linked tickets) from the current list, since the dashboard endpoint doesn't
 *  break status counts down by linked module. */
export function EcoLoopKpiCards(p: EcoLoopKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatCard label="Open"               value={p.open}               valueColor="amber" trend="awaiting action"     icon={<Ticket      size={14} strokeWidth={1.8} />} />
      <StatCard label="Waiting on Caterer"  value={p.waitingForCaterer}  valueColor="blue"  trend="awaiting reply"      icon={<Clock       size={14} strokeWidth={1.8} />} />
      <StatCard label="Waiting on Admin"    value={p.waitingForAdmin}    valueColor="amber" trend="needs response"      icon={<UserCheck   size={14} strokeWidth={1.8} />} />
      <StatCard label="Resolved"            value={p.resolved}           valueColor="lime"  trend="pending close"       icon={<CheckCircle2 size={14} strokeWidth={1.8} />} />
      <StatCard label="Closed"              value={p.closed}             valueColor="purple" trend="archived"           icon={<Archive     size={14} strokeWidth={1.8} />} />
      <StatCard label="Go-live Blockers"    value={p.openGoLiveBlockers} valueColor={p.openGoLiveBlockers > 0 ? 'red' : 'lime'} trend={p.openGoLiveBlockers > 0 ? 'blocking go-live' : 'none active'} icon={<ShieldAlert size={14} strokeWidth={1.8} />} />
    </div>
  )
}
