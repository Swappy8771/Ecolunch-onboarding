import type { ReactNode } from 'react'
import {
  Users, Scale, Landmark, Shield, ShieldCheck,
  Building2, UtensilsCrossed, Puzzle, Lock, Rocket, FilePen,
} from 'lucide-react'

export interface CatererVault {
  id: string
  name: string
  location: string
  totalDocs: number
  pending: number
  corrections: number
  lastActivity: string
}

export interface CategoryInfo {
  key: string
  label: string
  icon: ReactNode
  color: string
  totalDocs: number
  pending: number
}

export interface VaultDocument {
  id: string
  name: string
  category: string
  status: 'approved' | 'pending' | 'rejected' | 'correction'
  version: string
  uploadedBy: string
  uploadDate: string
}

export const CATERERS: CatererVault[] = [
  { id: '1', name: 'Concept Gourmet', location: 'Montréal, QC',   totalDocs: 142, pending: 4, corrections: 2, lastActivity: '2h ago'    },
  { id: '2', name: 'FL',              location: 'Lévis, QC',      totalDocs: 87,  pending: 6, corrections: 1, lastActivity: '4h ago'    },
  { id: '3', name: 'MSN',             location: 'Saguenay, QC',   totalDocs: 63,  pending: 0, corrections: 0, lastActivity: 'Yesterday' },
  { id: '4', name: 'ABC Catering',    location: 'Québec, QC',     totalDocs: 115, pending: 2, corrections: 3, lastActivity: '1h ago'    },
  { id: '5', name: 'Brasserie Nord',  location: 'Laval, QC',      totalDocs: 94,  pending: 1, corrections: 0, lastActivity: '3h ago'    },
  { id: '6', name: 'Café Réseau',     location: 'Sherbrooke, QC', totalDocs: 78,  pending: 3, corrections: 1, lastActivity: '5h ago'    },
]

export const CATEGORIES: CategoryInfo[] = [
  { key: 'profile',    label: 'Profile / General',      icon: <Users           size={15} strokeWidth={1.8} />, color: '#60a5fa', totalDocs: 12, pending: 1 },
  { key: 'legal',      label: 'Legal Information',      icon: <Scale           size={15} strokeWidth={1.8} />, color: '#a78bfa', totalDocs: 8,  pending: 2 },
  { key: 'banking',    label: 'Banks & Banking',        icon: <Landmark        size={15} strokeWidth={1.8} />, color: '#4ade80', totalDocs: 6,  pending: 1 },
  { key: 'compliance', label: 'Compliance & Permits',   icon: <Shield          size={15} strokeWidth={1.8} />, color: '#34d399', totalDocs: 9,  pending: 0 },
  { key: 'insurance',  label: 'Insurance',              icon: <ShieldCheck     size={15} strokeWidth={1.8} />, color: '#fbbf24', totalDocs: 5,  pending: 1 },
  { key: 'clients',    label: 'My Clients',             icon: <Building2       size={15} strokeWidth={1.8} />, color: '#22d3ee', totalDocs: 15, pending: 0 },
  { key: 'menus',      label: 'Menus & Packages',       icon: <UtensilsCrossed size={15} strokeWidth={1.8} />, color: '#fb923c', totalDocs: 18, pending: 2 },
  { key: 'modules',    label: 'Modules',                icon: <Puzzle          size={15} strokeWidth={1.8} />, color: '#a3e635', totalDocs: 7,  pending: 0 },
  { key: 'contracts',  label: 'Contracts & Signatures', icon: <FilePen         size={15} strokeWidth={1.8} />, color: '#a78bfa', totalDocs: 11, pending: 1 },
  { key: 'golive',     label: 'Go-live',                icon: <Rocket          size={15} strokeWidth={1.8} />, color: '#fb923c', totalDocs: 4,  pending: 0 },
  { key: 'internal',   label: 'Internal Documents',     icon: <Lock            size={15} strokeWidth={1.8} />, color: '#60a5fa', totalDocs: 6,  pending: 0 },
]

export const INSURANCE_DOCS: VaultDocument[] = [
  { id: 'd1', name: 'insurance_cert_v2.pdf',        category: 'Insurance', status: 'approved',   version: 'v2.1', uploadedBy: 'Elise Bouchard',  uploadDate: '2026-06-01' },
  { id: 'd2', name: 'liability_coverage_2026.pdf',  category: 'Insurance', status: 'pending',    version: 'v1.0', uploadedBy: 'Hugo Bernier',    uploadDate: '2026-06-03' },
  { id: 'd3', name: 'equipment_insurance.pdf',      category: 'Insurance', status: 'correction', version: 'v1.2', uploadedBy: 'Sandrine Lavoie', uploadDate: '2026-05-28' },
  { id: 'd4', name: 'workers_comp_cert.pdf',        category: 'Insurance', status: 'approved',   version: 'v3.0', uploadedBy: 'Elise Bouchard',  uploadDate: '2026-05-15' },
  { id: 'd5', name: 'property_insurance_annex.pdf', category: 'Insurance', status: 'rejected',   version: 'v1.0', uploadedBy: 'Hugo Bernier',    uploadDate: '2026-05-20' },
  { id: 'd6', name: 'umbrella_policy_2026.pdf',     category: 'Insurance', status: 'pending',    version: 'v1.0', uploadedBy: 'Sandrine Lavoie', uploadDate: '2026-06-04' },
  { id: 'd7', name: 'vehicle_insurance.pdf',        category: 'Insurance', status: 'approved',   version: 'v2.0', uploadedBy: 'Elise Bouchard',  uploadDate: '2026-04-10' },
  { id: 'd8', name: 'general_liability_v3.pdf',     category: 'Insurance', status: 'pending',    version: 'v3.1', uploadedBy: 'Hugo Bernier',    uploadDate: '2026-06-05' },
]
