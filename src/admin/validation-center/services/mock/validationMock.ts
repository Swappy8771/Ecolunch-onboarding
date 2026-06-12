export type VStatus  = 'pending' | 'approved' | 'rejected' | 'correction'
export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type VType    = 'Document' | 'Contract' | 'Banking' | 'Menu' | 'Establishment' | 'Pricing' | 'Module' | 'Go-Live' | 'Smart Import'

export interface ValidationItem {
  id: string
  title: string
  caterer: string
  type: VType
  status: VStatus
  priority: Priority
  created: string
  reviewer: string
  description: string
  sourceDoc?: string
}

export const ALL_ITEMS: ValidationItem[] = [
  { id:'v1',  title:'Liability Insurance Certificate', caterer:'Concept Gourmet', type:'Document',     status:'pending',    priority:'critical', created:'2026-06-05', reviewer:'Elise Bouchard',  description:'Required liability insurance certificate for school service operations. Must be valid until end of current fiscal year and include establishment addresses.', sourceDoc:'insurance_cert_v1.pdf' },
  { id:'v2',  title:'Master Services Agreement',       caterer:'FL',              type:'Contract',     status:'correction', priority:'high',     created:'2026-06-04', reviewer:'Hugo Bernier',    description:'Primary master contract requires signature on page 4, section 3.2. The counterparty name differs from the registered business name.', sourceDoc:'MSA_FL_draft.pdf' },
  { id:'v3',  title:'IBAN Format Validation',          caterer:'MSN',             type:'Banking',      status:'rejected',   priority:'critical', created:'2026-06-03', reviewer:'Sandrine Lavoie', description:'IBAN provided does not match the expected CA format. Caterer must resubmit with correct 16-digit institution and transit numbers.' },
  { id:'v4',  title:'MAPAQ Permit 2026',               caterer:'Concept Gourmet', type:'Document',     status:'approved',   priority:'medium',   created:'2026-06-02', reviewer:'Elise Bouchard',  description:'Annual MAPAQ food safety permit reviewed and confirmed valid through December 2026.', sourceDoc:'MAPAQ_permit_2026.pdf' },
  { id:'v5',  title:'School Menu Cycle A — Week 1–4',  caterer:'ABC Catering',    type:'Menu',         status:'pending',    priority:'medium',   created:'2026-06-06', reviewer:'Hugo Bernier',    description:'4-week rotational menu for elementary school service. Requires allergen matrix and nutrition values per portion.' },
  { id:'v6',  title:'Pre-authorized Debit Form',       caterer:'Brasserie Nord',  type:'Banking',      status:'approved',   priority:'low',      created:'2026-06-05', reviewer:'Sandrine Lavoie', description:'PAD form completed and banking information validated against CRA registration.', sourceDoc:'PAD_form_signed.pdf' },
  { id:'v7',  title:'SaaS Pricing Configuration',      caterer:'FL',              type:'Pricing',      status:'pending',    priority:'high',     created:'2026-06-04', reviewer:'Elise Bouchard',  description:'SaaS pricing tier not configured. Blocks module activation and Go-live scheduling. Requires Growth plan selection confirmation.' },
  { id:'v8',  title:'EcoOrder Module Activation',      caterer:'Café Réseau',     type:'Module',       status:'correction', priority:'medium',   created:'2026-06-03', reviewer:'Hugo Bernier',    description:'EcoOrder module activation settings require review. The order cutoff time conflicts with kitchen preparation window.' },
  { id:'v9',  title:'Go-Live Checklist — Final Review',caterer:'Concept Gourmet', type:'Go-Live',      status:'pending',    priority:'high',     created:'2026-06-06', reviewer:'Sandrine Lavoie', description:'Final pre-launch checklist. 2 of 12 items still require admin sign-off before launch date can be confirmed.' },
  { id:'v10', title:'Establishment Profile — Schools', caterer:'MSN',             type:'Establishment',status:'pending',    priority:'low',      created:'2026-06-02', reviewer:'Elise Bouchard',  description:'School establishment registration details including address, capacity, and primary contact information.' },
  { id:'v11', title:'Acomba Import — Week 12 Data',    caterer:'Les Saveurs',     type:'Smart Import', status:'correction', priority:'medium',   created:'2026-06-01', reviewer:'Hugo Bernier',    description:'Smart Import mapping requires correction. 3 product codes not found in catalog. Must be remapped before import can proceed.', sourceDoc:'acomba_week12.csv' },
  { id:'v12', title:'Annex B — Service Terms',         caterer:'ABC Catering',    type:'Contract',     status:'pending',    priority:'high',     created:'2026-06-05', reviewer:'Sandrine Lavoie', description:'Service agreement annex covering liability, SLA, and data handling. Awaiting caterer countersignature.', sourceDoc:'annex_B_draft.pdf' },
]

export const MOCK_HISTORY = [
  { actor: 'Elise Bouchard', action: 'Item submitted for review', time: '2026-06-05 · 09:14' },
  { actor: 'System',         action: 'Priority set to High by auto-classification', time: '2026-06-05 · 09:14' },
  { actor: 'Hugo Bernier',   action: 'Assigned to Sandrine Lavoie', time: '2026-06-05 · 11:30' },
]
