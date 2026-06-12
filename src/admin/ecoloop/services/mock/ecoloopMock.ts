import type {
  Ticket, TicketStatus, Priority, TicketCategory,
} from '../../types/ecoloop.types'

export type { TicketStatus, Priority, TicketCategory }

export const TICKETS: Ticket[] = [
  {
    id: 'tk-001', number: '#T-001',
    caterer: 'Concept Gourmet', catererId: 'cat-1',
    category: 'correction-request', priority: 'high', status: 'open',
    assignedTo: 'Onboarding Admin', lastActivity: '2026-06-11 09:42',
    createdAt: '2026-06-08 14:00',
    subject: 'Page 4 of service contract missing — upload required',
    conversation: [
      {
        id: 'm1', type: 'system', sender: 'EcoLoop', ts: '2026-06-08 14:00',
        content: 'Ticket created automatically from Document Vault — contract page missing.',
      },
      {
        id: 'm2', type: 'admin', sender: 'Onboarding Admin', ts: '2026-06-08 14:10',
        content: 'Hi — we noticed page 4 of your main service agreement was not uploaded. Please re-upload the full signed document at your earliest convenience.',
      },
      {
        id: 'm3', type: 'client', sender: 'Concept Gourmet', ts: '2026-06-09 10:30',
        content: 'Apologies for the oversight. We will rescan and upload the complete document today.',
      },
      {
        id: 'm4', type: 'admin', sender: 'Onboarding Admin', ts: '2026-06-09 11:00',
        content: 'Thank you — once uploaded, we will re-validate and close this ticket.',
      },
    ],
    internalNotes: [
      {
        id: 'n1', author: 'Onboarding Admin', ts: '2026-06-08 14:05',
        content: 'Caterer uses a third-party notary — original document may be with them. Follow up if no response by EOD tomorrow.',
      },
    ],
    systemEvents: [
      { id: 'se1', ts: '2026-06-08 14:00', event: 'Ticket Created',       detail: 'Auto-generated from Document Vault' },
      { id: 'se2', ts: '2026-06-08 14:10', event: 'Message Sent',          detail: 'Admin → Client' },
      { id: 'se3', ts: '2026-06-09 10:30', event: 'Client Reply',          detail: null },
      { id: 'se4', ts: '2026-06-09 11:00', event: 'Priority Changed',      detail: 'medium → high' },
      { id: 'se5', ts: '2026-06-11 09:42', event: 'Validation Linked',     detail: 'VAL-0042 — Legal Documents' },
    ],
    linkedObjects: [
      { id: 'lo1', type: 'document',      name: 'Service Agreement 2026', status: 'Incomplete', refId: 'DOC-0091' },
      { id: 'lo2', type: 'validation',    name: 'Legal Documents Review', status: 'Pending',    refId: 'VAL-0042' },
      { id: 'lo3', type: 'contract',      name: 'Main Service Contract',  status: 'Sent',       refId: 'CTR-0015' },
    ],
    correctionRequests: [
      { id: 'cr1', item: 'Service Agreement — Page 4 Missing', status: 'open', createdAt: '2026-06-08', linkedTicketId: 'tk-001' },
    ],
    validationFollowups: [
      { id: 'vf1', item: 'Legal Documents Review', status: 'Pending', assignedAdmin: 'Onboarding Admin', dueDate: '2026-06-15', linkedTicketId: 'tk-001' },
    ],
  },
  {
    id: 'tk-002', number: '#T-002',
    caterer: 'Concept Gourmet', catererId: 'cat-1',
    category: 'validation-followup', priority: 'medium', status: 'pending',
    assignedTo: 'Onboarding Admin', lastActivity: '2026-06-10 15:22',
    createdAt: '2026-06-07 10:00',
    subject: 'Menu validation — rotating cycle week 3 pricing conflict',
    conversation: [
      {
        id: 'm1', type: 'system', sender: 'EcoLoop', ts: '2026-06-07 10:00',
        content: 'Ticket created from Validation Center — pricing conflict detected on rotating menu week 3.',
      },
      {
        id: 'm2', type: 'admin', sender: 'Onboarding Admin', ts: '2026-06-07 10:15',
        content: 'We identified a discrepancy between the menu price listed ($6.25) and the configured school meal rate ($5.75) for week 3. Please confirm which pricing applies.',
      },
    ],
    internalNotes: [],
    systemEvents: [
      { id: 'se1', ts: '2026-06-07 10:00', event: 'Ticket Created',   detail: 'Auto-generated from Validation Center' },
      { id: 'se2', ts: '2026-06-07 10:15', event: 'Message Sent',     detail: 'Admin → Client' },
      { id: 'se3', ts: '2026-06-10 15:22', event: 'Status Changed',   detail: 'open → pending' },
    ],
    linkedObjects: [
      { id: 'lo1', type: 'validation',  name: 'Menu Pricing Review — Week 3', status: 'Pending', refId: 'VAL-0041' },
    ],
    correctionRequests: [
      { id: 'cr1', item: 'Rotating menu Week 3 — price mismatch', status: 'open', createdAt: '2026-06-07', linkedTicketId: 'tk-002' },
    ],
    validationFollowups: [
      { id: 'vf1', item: 'Menu Pricing Review — Week 3', status: 'Pending', assignedAdmin: 'Onboarding Admin', dueDate: '2026-06-13', linkedTicketId: 'tk-002' },
    ],
  },
  {
    id: 'tk-003', number: '#T-003',
    caterer: 'MSN Alimentation', catererId: 'cat-3',
    category: 'golive-blocker', priority: 'critical', status: 'blocked',
    assignedTo: 'Onboarding Admin', lastActivity: '2026-06-08 16:18',
    createdAt: '2026-06-06 09:00',
    subject: 'Insurance certificate 2026 missing — Go-live blocked',
    conversation: [
      {
        id: 'm1', type: 'system', sender: 'EcoLoop', ts: '2026-06-06 09:00',
        content: 'Go-live blocker created from Go-live Monitor — liability insurance certificate not found in Document Vault.',
      },
      {
        id: 'm2', type: 'admin', sender: 'Onboarding Admin', ts: '2026-06-06 09:30',
        content: 'Your go-live is currently blocked due to a missing insurance certificate (2026). This is a mandatory requirement. Please upload your current liability insurance document immediately.',
      },
      {
        id: 'm3', type: 'client', sender: 'MSN Alimentation', ts: '2026-06-07 14:00',
        content: 'Our insurance broker is preparing the certificate. Expected by June 10.',
      },
    ],
    internalNotes: [
      {
        id: 'n1', author: 'Onboarding Admin', ts: '2026-06-06 09:35',
        content: 'This is a hard blocker — go-live cannot proceed without proof of insurance. Escalate if not received by June 10.',
      },
    ],
    systemEvents: [
      { id: 'se1', ts: '2026-06-06 09:00', event: 'Ticket Created',        detail: 'Auto-generated from Go-live Monitor' },
      { id: 'se2', ts: '2026-06-06 09:00', event: 'Go-live Blocker Linked', detail: 'BLOCK-003 — Insurance Certificate' },
      { id: 'se3', ts: '2026-06-06 09:30', event: 'Message Sent',           detail: 'Admin → Client' },
      { id: 'se4', ts: '2026-06-08 16:18', event: 'Priority Changed',       detail: 'high → critical' },
    ],
    linkedObjects: [
      { id: 'lo1', type: 'document',     name: 'Liability Insurance 2026', status: 'Missing',  refId: 'DOC-0088' },
      { id: 'lo2', type: 'golive-blocker', name: 'Insurance Certificate Blocker', status: 'Active', refId: 'BLOCK-003' },
    ],
    correctionRequests: [],
    validationFollowups: [],
  },
  {
    id: 'tk-004', number: '#T-004',
    caterer: 'FL Traiteur', catererId: 'cat-2',
    category: 'contract-followup', priority: 'high', status: 'pending',
    assignedTo: 'Onboarding Admin', lastActivity: '2026-06-09 13:30',
    createdAt: '2026-06-05 11:00',
    subject: 'Contract countersignature pending — Dropbox Sign reminder',
    conversation: [
      {
        id: 'm1', type: 'system', sender: 'EcoLoop', ts: '2026-06-05 11:00',
        content: 'Contract follow-up ticket created — agreement sent via Dropbox Sign, awaiting caterer signature.',
      },
      {
        id: 'm2', type: 'admin', sender: 'Onboarding Admin', ts: '2026-06-06 09:00',
        content: 'Friendly reminder — your service agreement is ready for signature in Dropbox Sign. Please sign at your earliest convenience.',
      },
    ],
    internalNotes: [
      {
        id: 'n1', author: 'Onboarding Admin', ts: '2026-06-06 09:05',
        content: 'Second reminder scheduled for June 10 if not signed.',
      },
    ],
    systemEvents: [
      { id: 'se1', ts: '2026-06-05 11:00', event: 'Ticket Created',    detail: 'Auto-generated from Contract Management' },
      { id: 'se2', ts: '2026-06-05 11:00', event: 'Contract Linked',   detail: 'CTR-0016 — Main Service Agreement' },
      { id: 'se3', ts: '2026-06-06 09:00', event: 'Reminder Sent',     detail: 'Via EcoLoop' },
    ],
    linkedObjects: [
      { id: 'lo1', type: 'contract', name: 'Main Service Agreement', status: 'Sent — Awaiting Signature', refId: 'CTR-0016' },
    ],
    correctionRequests: [],
    validationFollowups: [],
  },
  {
    id: 'tk-005', number: '#T-005',
    caterer: 'ABC Catering', catererId: 'cat-4',
    category: 'client-message', priority: 'low', status: 'closed',
    assignedTo: 'Onboarding Admin', lastActivity: '2026-06-04 17:00',
    createdAt: '2026-06-02 10:00',
    subject: 'Smart Import Acomba — 6 categories pre-filled confirmed',
    conversation: [
      {
        id: 'm1', type: 'system', sender: 'EcoLoop', ts: '2026-06-02 10:00',
        content: 'Smart Import job completed — 6 categories pre-filled from Acomba data.',
      },
      {
        id: 'm2', type: 'client', sender: 'ABC Catering', ts: '2026-06-03 09:00',
        content: 'We reviewed the imported categories and everything looks correct. Thank you!',
      },
      {
        id: 'm3', type: 'admin', sender: 'Onboarding Admin', ts: '2026-06-04 17:00',
        content: 'Confirmed — closing this ticket. Smart Import validated successfully.',
      },
    ],
    internalNotes: [],
    systemEvents: [
      { id: 'se1', ts: '2026-06-02 10:00', event: 'Ticket Created',         detail: 'Auto-generated from Smart Import' },
      { id: 'se2', ts: '2026-06-02 10:00', event: 'Smart Import Item Linked', detail: 'IMP-0022 — Acomba Categories' },
      { id: 'se3', ts: '2026-06-04 17:00', event: 'Ticket Closed',           detail: 'Resolved by Admin' },
    ],
    linkedObjects: [
      { id: 'lo1', type: 'smart-import', name: 'Acomba — 6 Categories', status: 'Validated', refId: 'IMP-0022' },
    ],
    correctionRequests: [],
    validationFollowups: [],
  },
]

export const KPI_SUMMARY = {
  openTickets:          TICKETS.filter(t => t.status === 'open').length,
  correctionRequests:   TICKETS.flatMap(t => t.correctionRequests).filter(c => c.status === 'open').length,
  clientMessages:       TICKETS.flatMap(t => t.conversation).filter(m => m.type === 'client').length,
  validationFollowups:  TICKETS.flatMap(t => t.validationFollowups).length,
  contractFollowups:    TICKETS.filter(t => t.category === 'contract-followup').length,
  goliveBlockers:       TICKETS.filter(t => t.category === 'golive-blocker' && t.status === 'blocked').length,
}
