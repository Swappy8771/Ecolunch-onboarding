import type { Contract, ContractStatus, ContractTemplate, MergeFields } from '../../types/contract.types'

export const TEMPLATES: ContractTemplate[] = [
  { id: 'msa', name: 'Template MSA v3.2', type: 'MSA',             version: 'v3.2', description: 'Master Service Agreement — defines the principal service relationship and platform access terms.' },
  { id: 'dpa', name: 'Template DPA v1.1', type: 'DPA',             version: 'v1.1', description: 'Data Processing Agreement — required for all caterers; covers PIPEDA/privacy obligations.' },
  { id: 'sub', name: 'Template Sub v2.0', type: 'Subscription',    version: 'v2.0', description: 'Platform Subscription Contract — billing, module activation and recurring fee schedule.' },
  { id: 'sla', name: 'Template SLA v1.0', type: 'SLA',             version: 'v1.0', description: 'Service Level Agreement — uptime commitments, support tiers, and incident response.' },
  { id: 'mod', name: 'Template MOD v1.3', type: 'Module Agreement', version: 'v1.3', description: 'Module Access Agreement — per-vertical licensing terms and revenue-share provisions.' },
  { id: 'gl',  name: 'Template GL v1.0',  type: 'Go-live',          version: 'v1.0', description: 'Go-live Readiness Agreement — final pre-activation acceptance and launch obligations.' },
]

export const CATERER_OPTIONS = [
  { id: 'cat-1', name: 'Concept Gourmet' },
  { id: 'cat-2', name: 'FL' },
  { id: 'cat-3', name: 'MSN' },
  { id: 'cat-4', name: 'ABC Catering' },
  { id: 'cat-5', name: 'Brasserie Nord' },
]

export const CATERER_MODULE_CONFIG: Record<string, {
  modules: string[]
  monthlyRate: number
  feePercentage: string
  fixedFee: string
  legalName: string
}> = {
  'cat-1': { modules: ['Schools', 'Daycares', 'CSS'], monthlyRate: 449, feePercentage: '2.5', fixedFee: '0.10', legalName: 'Concept Gourmet Inc.' },
  'cat-2': { modules: ['Schools'],                    monthlyRate: 199, feePercentage: '3.0', fixedFee: '0.10', legalName: 'FL Traiteur SENC' },
  'cat-3': { modules: ['Schools', 'Camps'],           monthlyRate: 299, feePercentage: '2.8', fixedFee: '0.10', legalName: 'MSN Alimentation Corp.' },
  'cat-4': { modules: ['Daycares', 'CSS'],            monthlyRate: 249, feePercentage: '2.5', fixedFee: '0.10', legalName: 'ABC Catering Ltée' },
  'cat-5': { modules: ['Schools', 'Daycares'],        monthlyRate: 349, feePercentage: '2.5', fixedFee: '0.10', legalName: 'Brasserie Nord Restauration' },
}

export const CONTRACTS: Contract[] = [
  {
    id: 'c1', name: 'Master Service Agreement 2026', type: 'MSA', template: 'Template MSA v3.2',
    caterer: 'Concept Gourmet', catererId: 'cat-1',
    signatoryName: 'Elise Bouchard', signatoryEmail: 'elise.bouchard@conceptgourmet.ca',
    dropboxRequestId: 'dbs_req_a1b2c3d4', status: 'signed',
    sentDate: '2026-05-10', viewedDate: '2026-05-11', signedDate: '2026-05-12',
    version: 'v3.2', linkedModules: ['Schools', 'Daycares', 'CSS'], monthlyRate: 449,
    dropboxStoragePath: '/Onboarding/Caterers/cat-1_ConceptGourmet/09_Contracts_Signatures/MSA_v3.2_signed_20260512.pdf',
    documentVaultLinked: true, goLiveReEvaluated: true,
    auditLog: [
      { date: '2026-05-10 09:14', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
      { date: '2026-05-11 14:32', action: 'Document viewed by signatory', actor: 'Elise Bouchard', webhook: 'signature_request_viewed' },
      { date: '2026-05-12 10:05', action: 'Document signed — all parties completed', actor: 'Elise Bouchard', webhook: 'signature_request_all_signed' },
      { date: '2026-05-12 10:06', action: 'Webhook received: signature_request_all_signed', actor: 'System', webhook: 'signature_request_all_signed' },
      { date: '2026-05-12 10:06', action: 'Signed document archived to Dropbox Storage', actor: 'System' },
      { date: '2026-05-12 10:06', action: 'Document Vault updated — contract reference saved', actor: 'System' },
      { date: '2026-05-12 10:07', action: 'Go-live Monitor re-evaluated — Contract item marked complete', actor: 'System' },
    ],
  },
  {
    id: 'c2', name: 'Data Processing Agreement', type: 'DPA', template: 'Template DPA v1.1',
    caterer: 'Concept Gourmet', catererId: 'cat-1',
    signatoryName: 'Elise Bouchard', signatoryEmail: 'elise.bouchard@conceptgourmet.ca',
    dropboxRequestId: 'dbs_req_b2c3d4e5', status: 'viewed',
    sentDate: '2026-06-01', viewedDate: '2026-06-03', signedDate: null,
    version: 'v1.1', linkedModules: ['Camps'], monthlyRate: null,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-06-01 11:00', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
      { date: '2026-06-03 16:20', action: 'Document viewed by signatory', actor: 'Elise Bouchard', webhook: 'signature_request_viewed' },
    ],
  },
  {
    id: 'c3', name: 'Platform Subscription Contract', type: 'Subscription', template: 'Template Sub v2.0',
    caterer: 'FL', catererId: 'cat-2',
    signatoryName: 'Hugo Bernier', signatoryEmail: 'hugo.bernier@fl.ca',
    dropboxRequestId: 'dbs_req_c3d4e5f6', status: 'partially_signed',
    sentDate: '2026-06-02', viewedDate: '2026-06-02', signedDate: null,
    version: 'v2.0', linkedModules: ['Schools'], monthlyRate: 199,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-06-02 08:45', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
      { date: '2026-06-02 13:10', action: 'Document viewed by signatory', actor: 'Hugo Bernier', webhook: 'signature_request_viewed' },
      { date: '2026-06-03 09:30', action: 'Signed by first signatory', actor: 'Hugo Bernier', webhook: 'signature_request_signed' },
    ],
  },
  {
    id: 'c4', name: 'Service Level Agreement', type: 'SLA', template: 'Template SLA v1.0',
    caterer: 'FL', catererId: 'cat-2',
    signatoryName: 'Hugo Bernier', signatoryEmail: 'hugo.bernier@fl.ca',
    dropboxRequestId: 'dbs_req_d4e5f6g7', status: 'sent',
    sentDate: '2026-06-07', viewedDate: null, signedDate: null,
    version: 'v1.0', linkedModules: ['Daycares'], monthlyRate: null,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-06-07 10:00', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
    ],
  },
  {
    id: 'c5', name: 'Module Access Agreement', type: 'Module Agreement', template: 'Template MOD v1.3',
    caterer: 'MSN', catererId: 'cat-3',
    signatoryName: 'Sandrine Lavoie', signatoryEmail: 'sandrine.lavoie@msn.ca',
    dropboxRequestId: 'dbs_req_e5f6g7h8', status: 'declined',
    sentDate: '2026-05-20', viewedDate: '2026-05-21', signedDate: null,
    version: 'v1.3', linkedModules: ['Schools', 'Camps'], monthlyRate: 299,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-05-20 14:00', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
      { date: '2026-05-21 10:15', action: 'Document viewed by signatory', actor: 'Sandrine Lavoie', webhook: 'signature_request_viewed' },
      { date: '2026-05-22 09:00', action: 'Document declined by signatory', actor: 'Sandrine Lavoie', webhook: 'signature_request_declined' },
    ],
  },
  {
    id: 'c6', name: 'Master Service Agreement 2026', type: 'MSA', template: 'Template MSA v3.2',
    caterer: 'ABC Catering', catererId: 'cat-4',
    signatoryName: 'Luc Tremblay', signatoryEmail: 'luc.tremblay@abccatering.ca',
    dropboxRequestId: 'dbs_req_f6g7h8i9', status: 'draft',
    sentDate: null, viewedDate: null, signedDate: null,
    version: 'v3.2', linkedModules: ['Daycares', 'CSS'], monthlyRate: 249,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-06-08 11:30', action: 'Draft created', actor: 'Admin' },
    ],
  },
  {
    id: 'c7', name: 'Platform Subscription Contract', type: 'Subscription', template: 'Template Sub v2.0',
    caterer: 'Brasserie Nord', catererId: 'cat-5',
    signatoryName: 'Marie-Claire Fontaine', signatoryEmail: 'mcfontaine@brasserienord.ca',
    dropboxRequestId: 'dbs_req_g7h8i9j0', status: 'signed',
    sentDate: '2026-04-15', viewedDate: '2026-04-16', signedDate: '2026-04-17',
    version: 'v2.0', linkedModules: ['Schools', 'Daycares'], monthlyRate: 349,
    dropboxStoragePath: '/Onboarding/Caterers/cat-5_BrasserieNord/09_Contracts_Signatures/Sub_v2.0_signed_20260417.pdf',
    documentVaultLinked: true, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-04-15 09:00', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
      { date: '2026-04-16 14:00', action: 'Document viewed by signatory', actor: 'Marie-Claire Fontaine', webhook: 'signature_request_viewed' },
      { date: '2026-04-17 11:20', action: 'Document signed — all parties completed', actor: 'Marie-Claire Fontaine', webhook: 'signature_request_all_signed' },
      { date: '2026-04-17 11:21', action: 'Signed document archived to Dropbox Storage', actor: 'System' },
      { date: '2026-04-17 11:21', action: 'Document Vault updated — contract reference saved', actor: 'System' },
    ],
  },
  {
    id: 'c8', name: 'Data Processing Agreement', type: 'DPA', template: 'Template DPA v1.1',
    caterer: 'Brasserie Nord', catererId: 'cat-5',
    signatoryName: 'Marie-Claire Fontaine', signatoryEmail: 'mcfontaine@brasserienord.ca',
    dropboxRequestId: 'dbs_req_h8i9j0k1', status: 'expired',
    sentDate: '2026-03-01', viewedDate: '2026-03-02', signedDate: null,
    version: 'v1.0', linkedModules: [], monthlyRate: null,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-03-01 10:00', action: 'Contract sent for signature via Dropbox Sign', actor: 'Admin', webhook: 'signature_request_sent' },
      { date: '2026-03-02 09:45', action: 'Document viewed by signatory', actor: 'Marie-Claire Fontaine', webhook: 'signature_request_viewed' },
      { date: '2026-04-01 00:00', action: 'Contract expired — 30-day signing window closed', actor: 'System', webhook: 'signature_request_expired' },
    ],
  },
  {
    id: 'c9', name: 'Go-live Readiness Agreement', type: 'Go-live', template: 'Template GL v1.0',
    caterer: 'ABC Catering', catererId: 'cat-4',
    signatoryName: 'Luc Tremblay', signatoryEmail: 'luc.tremblay@abccatering.ca',
    dropboxRequestId: 'dbs_req_i9j0k1l2', status: 'ready',
    sentDate: null, viewedDate: null, signedDate: null,
    version: 'v1.0', linkedModules: ['CSS'], monthlyRate: null,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-06-09 08:00', action: 'Contract marked ready to send', actor: 'Admin' },
    ],
  },
  {
    id: 'c10', name: 'Module Access Agreement', type: 'Module Agreement', template: 'Template MOD v1.3',
    caterer: 'MSN', catererId: 'cat-3',
    signatoryName: 'Sandrine Lavoie', signatoryEmail: 'sandrine.lavoie@msn.ca',
    dropboxRequestId: 'dbs_req_j0k1l2m3', status: 'error',
    sentDate: '2026-06-06', viewedDate: null, signedDate: null,
    version: 'v1.3', linkedModules: ['Schools'], monthlyRate: null,
    dropboxStoragePath: null, documentVaultLinked: false, goLiveReEvaluated: false,
    auditLog: [
      { date: '2026-06-06 12:00', action: 'Contract send attempted', actor: 'Admin' },
      { date: '2026-06-06 12:01', action: 'Send failed — Dropbox Sign API error (503)', actor: 'System' },
    ],
  },
]

export const STATUS_META: Record<ContractStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:            { label: 'Draft',            color: 'var(--text-3)', bg: 'var(--bg-inner)',        border: 'var(--border-strong)'   },
  ready:            { label: 'Ready to Send',    color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  sent:             { label: 'Sent',             color: '#a78bfa',       bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.28)' },
  viewed:           { label: 'Viewed',           color: '#22d3ee',       bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.28)'  },
  partially_signed: { label: 'Partially Signed', color: '#fb923c',       bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.28)'  },
  signed:           { label: 'Signed',           color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
  declined:         { label: 'Declined',         color: '#f87171',       bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.28)' },
  expired:          { label: 'Expired',          color: '#94a3b8',       bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.28)' },
  cancelled:        { label: 'Cancelled',        color: '#94a3b8',       bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.28)' },
  error:            { label: 'Error',            color: '#f43f5e',       bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.28)'   },
}

export const CONTRACT_TYPES = ['MSA', 'DPA', 'Subscription', 'SLA', 'Module Agreement', 'Go-live']

export const CATERERS_LIST = ['Concept Gourmet', 'FL', 'MSN', 'ABC Catering', 'Brasserie Nord']

export const WEBHOOK_EVENT_META: Record<string, { label: string; color: string }> = {
  signature_request_sent:       { label: 'sent',       color: '#a78bfa' },
  signature_request_viewed:     { label: 'viewed',     color: '#22d3ee' },
  signature_request_signed:     { label: 'signed',     color: '#fb923c' },
  signature_request_all_signed: { label: 'all_signed', color: '#4ade80' },
  signature_request_declined:   { label: 'declined',   color: '#f87171' },
  signature_request_expired:    { label: 'expired',    color: '#94a3b8' },
}

export function buildMergeFields(catId: string, contracts: Contract[]): MergeFields {
  const config   = CATERER_MODULE_CONFIG[catId]
  const existing = contracts.find(c => c.catererId === catId)
  return {
    client_name:     existing?.caterer ?? '',
    legal_name:      config?.legalName ?? '',
    monthly_rate:    config ? `${config.monthlyRate}` : '',
    start_date:      '2026-07-01',
    modules_list:    config?.modules.join(', ') ?? '',
    fee_percentage:  config?.feePercentage ?? '',
    fixed_fee:       config?.fixedFee ?? '',
    signatory_name:  existing?.signatoryName ?? '',
    signatory_email: existing?.signatoryEmail ?? '',
  }
}

export function buildDropboxPayload(catId: string, tpl: ContractTemplate, fields: MergeFields) {
  return {
    template_id: `tpl_${tpl.id}_ecolunch`,
    subject: `EcoLunch — ${tpl.type} for ${fields.client_name}`,
    message: 'Please review and sign your EcoLunch agreement. Contact us at support@ecolunch.ca if you have questions.',
    signers: [
      { role_name: 'Client Signatory', name: fields.signatory_name, email_address: fields.signatory_email, order: 1 },
    ],
    custom_fields: [
      { name: 'client_name',    value: fields.client_name },
      { name: 'legal_name',     value: fields.legal_name },
      { name: 'monthly_rate',   value: `$${fields.monthly_rate}/month` },
      { name: 'start_date',     value: fields.start_date },
      { name: 'modules_list',   value: fields.modules_list },
      { name: 'fee_percentage', value: `${fields.fee_percentage}%` },
      { name: 'fixed_fee',      value: `$${fields.fixed_fee} per transaction` },
    ],
    metadata: {
      caterer_id: catId,
      template_version: tpl.version,
      initiated_by: 'admin@ecolunch.ca',
    },
    test_mode: 0,
  }
}
