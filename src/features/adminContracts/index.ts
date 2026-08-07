/**
 * Public surface of the Contracts feature. Components import from here —
 * never reach into `queries/`, `mutations/`, `mappers/`, or `types/`
 * directly (mirrors the Caterers/Document Vault convention, applied here
 * as an explicit barrel since Contracts has more hooks than either).
 */

export * from './types/contract.types'
export * from './constants/contractStatusMeta'

export { useContracts } from './queries/useContracts'
export { useContractsByCaterer } from './queries/useContractsByCaterer'
export { useContract } from './queries/useContract'
export { useContractHistory } from './queries/useContractHistory'
export { useContractSummary } from './queries/useContractSummary'
export { useContractTemplates } from './queries/useContractTemplates'

export { useCreateDraftContract } from './mutations/useCreateDraftContract'
export { useReadyContract } from './mutations/useReadyContract'
export { useSendContract } from './mutations/useSendContract'
export { useRetryContract } from './mutations/useRetryContract'
export { useResendContract } from './mutations/useResendContract'
export { useCancelContract } from './mutations/useCancelContract'
export { useDownloadContract } from './mutations/useDownloadContract'
export { useExportContracts } from './mutations/useExportContracts'
