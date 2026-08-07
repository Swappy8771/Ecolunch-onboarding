import { useMemo, useState } from 'react'
import { MessageCircle, RefreshCw, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { displayName } from '@/features/adminAuth/mappers/auth.mapper'
import { useEcoLoopList, useEcoLoopDashboard } from '@/features/adminEcoloop/hooks/useEcoLoopQueries'
import {
  useSendEcoLoopMessage, useAddEcoLoopNote, useAddEcoLoopLink,
  useReassignEcoLoopTicket, useUpdateEcoLoopPriority, useCloseEcoLoopTicket,
} from '@/features/adminEcoloop/hooks/useEcoLoopActions'
import type { LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'
import { EcoLoopKpiCards } from '../components/EcoLoopKpiCards'
import { TicketList } from '../components/TicketList'
import { TicketDrawer } from '../components/TicketDrawer'
import { CreateTicketModal } from '../components/CreateTicketModal'
import { EcoLoopActionBar } from '../components/EcoLoopActionBar'
import { EcoLoopLoading, EcoLoopError } from '../components/EcoLoopStates'
import { EcoLoopMessageModal } from '../components/EcoLoopMessageModal'
import { EcoLoopLinkModal } from '../components/EcoLoopLinkModal'
import { EcoLoopReassignModal } from '../components/EcoLoopReassignModal'
import { EcoLoopPriorityModal } from '../components/EcoLoopPriorityModal'

type MessageModalVariant = 'message' | 'note' | null

export function EcoLoop() {
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [messageModal, setMessageModal] = useState<MessageModalVariant>(null)
  const [linkModalModule, setLinkModalModule] = useState<LinkedModule | null>(null)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [showPriorityModal, setShowPriorityModal] = useState(false)

  const listQuery = useEcoLoopList({})
  const dashboardQuery = useEcoLoopDashboard(undefined)

  const sendMessageMutation = useSendEcoLoopMessage()
  const addNoteMutation = useAddEcoLoopNote()
  const addLinkMutation = useAddEcoLoopLink()
  const reassignMutation = useReassignEcoLoopTicket()
  const priorityMutation = useUpdateEcoLoopPriority()
  const closeMutation = useCloseEcoLoopTicket()

  const items = useMemo(() => listQuery.data?.items ?? [], [listQuery.data])
  const selected = items.find(c => c.id === selectedId) ?? null

  const openGoLiveBlockers = useMemo(
    () => items.filter(c => c.linkedModule === 'go-live' && c.status !== 'closed' && c.status !== 'resolved').length,
    [items],
  )

  function handleSendMessage(content: string) {
    if (!selectedId || !user) return
    sendMessageMutation.mutate({ conversationId: selectedId, senderId: user.id, senderName: displayName(user), content })
  }

  function handleAddNote(content: string) {
    if (!selectedId || !user) return
    addNoteMutation.mutate({ conversationId: selectedId, senderId: user.id, senderName: displayName(user), content })
  }

  function handleQuickMessageConfirm(content: string) {
    if (messageModal === 'note') handleAddNote(content)
    else handleSendMessage(content)
    setMessageModal(null)
  }

  function handleLinkConfirm(input: { module: LinkedModule; entityId: string; label?: string }) {
    if (!selectedId) return
    addLinkMutation.mutate({ conversationId: selectedId, ...input }, { onSuccess: () => setLinkModalModule(null) })
  }

  function handleReassignConfirm(input: { assigneeId: string; assigneeName: string }) {
    if (!selectedId) return
    reassignMutation.mutate({ conversationId: selectedId, ...input }, { onSuccess: () => setShowReassignModal(false) })
  }

  function handlePriorityConfirm(priority: import('@/features/adminEcoloop/types/ecoloop.types').ConversationPriority) {
    if (!selectedId) return
    priorityMutation.mutate({ conversationId: selectedId, priority }, { onSuccess: () => setShowPriorityModal(false) })
  }

  function handleCloseTicket() {
    if (!selectedId) return
    closeMutation.mutate(selectedId)
  }

  const isBusy = sendMessageMutation.isPending || addNoteMutation.isPending

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 px-5 py-5 flex-wrap"
        style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <MessageCircle size={16} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>
              Admin / Onboarding
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              EcoLoop Onboarding
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              Communication &amp; Follow-up Layer
            </p>
          </div>
        </div>

        <button onClick={() => { listQuery.refetch(); dashboardQuery.refetch() }} disabled={listQuery.isFetching}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-all disabled:opacity-60"
          style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
          <RefreshCw size={13} strokeWidth={2} className={listQuery.isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-5 py-5 flex-1">
        {listQuery.isLoading ? (
          <EcoLoopLoading />
        ) : listQuery.isError ? (
          <EcoLoopError onRetry={() => listQuery.refetch()} />
        ) : (
          <>
            {dashboardQuery.data && (
              <EcoLoopKpiCards
                open={dashboardQuery.data.open}
                waitingForCaterer={dashboardQuery.data.waitingForCaterer}
                waitingForAdmin={dashboardQuery.data.waitingForAdmin}
                resolved={dashboardQuery.data.resolved}
                closed={dashboardQuery.data.closed}
                openGoLiveBlockers={openGoLiveBlockers}
              />
            )}

            <div>
              <p className="text-[11px] uppercase tracking-[0.13em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>
                Tickets by Caterer
              </p>
              <TicketList tickets={items} selectedId={selectedId} onSelect={setSelectedId} />
            </div>

            <div className="h-16 shrink-0" />
          </>
        )}
      </div>

      <EcoLoopActionBar
        selected={selected}
        onCreateTicket={() => setShowCreateModal(true)}
        onSendMessage={() => setMessageModal('message')}
        onAddNote={() => setMessageModal('note')}
        onLinkNew={module => setLinkModalModule(module)}
        onReassign={() => setShowReassignModal(true)}
        onChangePriority={() => setShowPriorityModal(true)}
        onCloseTicket={handleCloseTicket}
      />

      <TicketDrawer
        conversationId={selectedId}
        onClose={() => setSelectedId(null)}
        isSendingMessage={sendMessageMutation.isPending}
        isSavingNote={addNoteMutation.isPending}
        onSendMessage={handleSendMessage}
        onAddNote={handleAddNote}
        onLinkNew={module => setLinkModalModule(module)}
        onReassign={() => setShowReassignModal(true)}
        onChangePriority={() => setShowPriorityModal(true)}
        onCloseTicket={handleCloseTicket}
      />

      {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} />}

      {messageModal && (
        <EcoLoopMessageModal
          variant={messageModal}
          isSubmitting={isBusy}
          error={(messageModal === 'note' ? addNoteMutation.error : sendMessageMutation.error)?.message ?? null}
          onCancel={() => setMessageModal(null)}
          onConfirm={handleQuickMessageConfirm}
        />
      )}

      {linkModalModule && (
        <EcoLoopLinkModal
          initialModule={linkModalModule}
          isSubmitting={addLinkMutation.isPending}
          error={addLinkMutation.error?.message ?? null}
          onCancel={() => setLinkModalModule(null)}
          onConfirm={handleLinkConfirm}
        />
      )}

      {showReassignModal && (
        <EcoLoopReassignModal
          currentAssigneeName={selected?.assigneeName ?? null}
          isSubmitting={reassignMutation.isPending}
          error={reassignMutation.error?.message ?? null}
          onCancel={() => setShowReassignModal(false)}
          onConfirm={handleReassignConfirm}
        />
      )}

      {showPriorityModal && selected && (
        <EcoLoopPriorityModal
          currentPriority={selected.priority}
          isSubmitting={priorityMutation.isPending}
          error={priorityMutation.error?.message ?? null}
          onCancel={() => setShowPriorityModal(false)}
          onConfirm={handlePriorityConfirm}
        />
      )}

      {closeMutation.isError && (
        <div className="fixed bottom-20 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)' }}>
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#f87171' }} />
          <span className="text-[12.5px]" style={{ color: '#f87171' }}>{closeMutation.error?.message}</span>
        </div>
      )}
    </div>
  )
}
