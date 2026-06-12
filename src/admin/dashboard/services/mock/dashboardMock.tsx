import {
  FilePenLine, Upload, CheckCircle2, MessageCircle, FileText,
  Settings, Rocket, SlidersHorizontal, AlertTriangle, XCircle,
} from 'lucide-react'
import type { ReactNode } from 'react'

export type Priority = 'success' | 'info' | 'warning' | 'critical'
export type Group    = 'today' | 'yesterday' | 'earlier'

export interface UpdateItem {
  icon: ReactNode
  priority: Priority
  group: Group
  time: string
  caterer: string
  eventType: string
  detail: string
  action: string
  to: string
}

export interface BlockerItem {
  icon: ReactNode
  severity: 'critical' | 'warning'
  caterer: string
  category: string
  issue: string
  action: string
  to: string
}

export const PRIORITY_META: Record<Priority, { color: string; label: string }> = {
  success:  { color: '#a3e635', label: 'Success'  },
  info:     { color: '#60a5fa', label: 'Info'     },
  warning:  { color: '#fbbf24', label: 'Warning'  },
  critical: { color: '#f87171', label: 'Critical' },
}

export const GROUP_LABELS: Record<Group, string> = {
  today:     'Today',
  yesterday: 'Yesterday',
  earlier:   'Earlier',
}

export const ALL_UPDATES: UpdateItem[] = [
  {
    icon: <FilePenLine size={13} strokeWidth={2} />,
    priority: 'success', group: 'today', time: '10 min ago',
    caterer: 'Concept Gourmet', eventType: 'Contract Signed',
    detail: 'Master services agreement signed via Dropbox Sign',
    action: 'View Contract', to: '/admin/contract-management',
  },
  {
    icon: <Upload size={13} strokeWidth={2} />,
    priority: 'info', group: 'today', time: '25 min ago',
    caterer: 'MSN', eventType: 'Document Uploaded',
    detail: 'Liability insurance certificate — v2',
    action: 'Open Document', to: '/admin/document-vault',
  },
  {
    icon: <CheckCircle2 size={13} strokeWidth={2} />,
    priority: 'success', group: 'today', time: '1h ago',
    caterer: 'FL', eventType: 'Validation Approved',
    detail: 'Profile section approved',
    action: 'Open Validation', to: '/admin/validation-center',
  },
  {
    icon: <MessageCircle size={13} strokeWidth={2} />,
    priority: 'warning', group: 'today', time: '2h ago',
    caterer: 'Concept Gourmet', eventType: 'Correction Requested',
    detail: 'Menu section — 3 items flagged for review',
    action: 'View Feedback', to: '/admin/validation-center',
  },
  {
    icon: <FileText size={13} strokeWidth={2} />,
    priority: 'info', group: 'yesterday', time: 'Yesterday · 16:42',
    caterer: 'Brasserie Nord', eventType: 'Contract Sent',
    detail: 'Annex B sent to caterer for signature',
    action: 'View Contract', to: '/admin/contract-management',
  },
  {
    icon: <Settings size={13} strokeWidth={2} />,
    priority: 'success', group: 'yesterday', time: 'Yesterday · 11:05',
    caterer: 'FL', eventType: 'Pricing Updated',
    detail: 'SaaS tier updated to Growth plan',
    action: 'Open Section', to: '/admin/modules-pricing',
  },
  {
    icon: <Rocket size={13} strokeWidth={2} />,
    priority: 'success', group: 'yesterday', time: 'Yesterday · 09:30',
    caterer: 'Concept Gourmet', eventType: 'Go-live Approved',
    detail: 'All checklist items validated — launch scheduled',
    action: 'View Go-live', to: '/admin/golive-monitor',
  },
  {
    icon: <CheckCircle2 size={13} strokeWidth={2} />,
    priority: 'success', group: 'earlier', time: '2d ago',
    caterer: 'Café Réseau', eventType: 'Validation Approved',
    detail: 'Banks & banking section approved',
    action: 'Open Validation', to: '/admin/validation-center',
  },
  {
    icon: <Upload size={13} strokeWidth={2} />,
    priority: 'info', group: 'earlier', time: '2d ago',
    caterer: 'Brasserie Nord', eventType: 'Document Uploaded',
    detail: 'Health permit — 2026 renewal certificate',
    action: 'Open Document', to: '/admin/document-vault',
  },
  {
    icon: <SlidersHorizontal size={13} strokeWidth={2} />,
    priority: 'success', group: 'earlier', time: '3d ago',
    caterer: 'MSN', eventType: 'Module Configured',
    detail: 'EcoOrder and EcoPay modules activated',
    action: 'Open Section', to: '/admin/modules-pricing',
  },
]

export const URGENT_BLOCKERS: BlockerItem[] = [
  {
    icon: <AlertTriangle size={14} strokeWidth={2} />,
    severity: 'critical',
    caterer: 'Concept Gourmet',
    category: 'Missing Document',
    issue: 'Liability insurance certificate absent — Go-live blocked',
    action: 'Open Vault',
    to: '/admin/document-vault',
  },
  {
    icon: <FilePenLine size={14} strokeWidth={2} />,
    severity: 'warning',
    caterer: 'FL',
    category: 'Awaiting Signature',
    issue: 'Master contract unsigned — 5 days without response',
    action: 'View Contract',
    to: '/admin/contract-management',
  },
  {
    icon: <XCircle size={14} strokeWidth={2} />,
    severity: 'critical',
    caterer: 'MSN',
    category: 'Validation Failed',
    issue: 'Banking validation rejected — IBAN format invalid',
    action: 'Resolve',
    to: '/admin/validation-center',
  },
  {
    icon: <Settings size={14} strokeWidth={2} />,
    severity: 'warning',
    caterer: 'ABC Catering',
    category: 'Pricing Incomplete',
    issue: 'SaaS pricing tier not configured — modules cannot activate',
    action: 'Open Section',
    to: '/admin/modules-pricing',
  },
  {
    icon: <XCircle size={14} strokeWidth={2} />,
    severity: 'critical',
    caterer: 'Café Réseau',
    category: 'Validation Failed',
    issue: 'Profile section incomplete — 3 required fields missing',
    action: 'Resolve',
    to: '/admin/validation-center',
  },
]
