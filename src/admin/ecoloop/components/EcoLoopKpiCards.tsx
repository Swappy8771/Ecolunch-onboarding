import { Ticket, ClipboardList, MessageSquare, ClipboardCheck, FileSignature, ShieldAlert } from 'lucide-react'
import { StatCard } from '@/features/dashboard/components/StatCard'

interface EcoLoopKpiCardsProps {
  openTickets: number
  correctionRequests: number
  clientMessages: number
  validationFollowups: number
  contractFollowups: number
  goliveBlockers: number
}

export function EcoLoopKpiCards(p: EcoLoopKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatCard label="Open Tickets"          value={p.openTickets}          valueColor="amber"  trend="awaiting action"    icon={<Ticket          size={14} strokeWidth={1.8} />} />
      <StatCard label="Correction Requests"   value={p.correctionRequests}   valueColor="red"    trend="open requests"      icon={<ClipboardList   size={14} strokeWidth={1.8} />} />
      <StatCard label="Client Messages"       value={p.clientMessages}       valueColor="blue"   trend="unresolved threads" icon={<MessageSquare   size={14} strokeWidth={1.8} />} />
      <StatCard label="Validation Follow-ups" value={p.validationFollowups}  valueColor="purple" trend="pending review"     icon={<ClipboardCheck  size={14} strokeWidth={1.8} />} />
      <StatCard label="Contract Follow-ups"   value={p.contractFollowups}    valueColor="amber"  trend="awaiting signature" icon={<FileSignature   size={14} strokeWidth={1.8} />} />
      <StatCard label="Go-live Blockers"      value={p.goliveBlockers}       valueColor={p.goliveBlockers > 0 ? 'red' : 'lime'} trend={p.goliveBlockers > 0 ? 'blocking go-live' : 'none active'} icon={<ShieldAlert size={14} strokeWidth={1.8} />} />
    </div>
  )
}
