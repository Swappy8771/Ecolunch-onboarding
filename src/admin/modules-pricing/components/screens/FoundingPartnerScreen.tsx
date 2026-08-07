import { useState } from 'react'
import { Star, AlertTriangle, Info } from 'lucide-react'
import { ModuleSelector } from '../ModuleSelector'
import { useModulePricingDetail } from '@/features/adminModulesPricing/hooks/useModulePricingDetail'
import { useSavePricing, useSaveCommercialTerms } from '@/features/adminModulesPricing/hooks/useModuleMutations'
import type { CatererModuleViewModel } from '@/features/adminModulesPricing/types/modulesPricing.types'

/**
 * Founding Partner is modeled per-module on the backend (`CatererModule.pricing.foundingPartnerFree`
 * + `commercialTerms.foundingPartnerExpiryDate`), not as a single caterer-wide toggle the old mock
 * assumed — matches the client spec's own module configuration table ("founding partner status" is
 * listed per module row, e.g. School Meals / Daycare / Camp Meals).
 */
export function FoundingPartnerScreen({ catererId, modules }: { catererId: string; modules: CatererModuleViewModel[] }) {
  const active = modules.filter(m => m.status !== 'inactive')
  const [selectedKey, setSelectedKey] = useState<string>(active[0]?.key ?? modules[0]?.key ?? '')
  const detailQuery = useModulePricingDetail(catererId, selectedKey, Boolean(selectedKey))
  const savePricingMutation = useSavePricing()
  const saveTermsMutation = useSaveCommercialTerms()

  const [freeForLife, setFreeForLife] = useState(false)
  const [expiry, setExpiry] = useState('')

  // Adjust form state during render when fresh data arrives (React's recommended
  // alternative to an effect that only mirrors a prop/query into state) rather than
  // an effect + setState, which triggers a redundant extra render.
  const [prefilledFor, setPrefilledFor] = useState<typeof detailQuery.data>(undefined)
  if (detailQuery.data && detailQuery.data !== prefilledFor) {
    setPrefilledFor(detailQuery.data)
    setFreeForLife(detailQuery.data.pricing.foundingPartnerFree)
    setExpiry(detailQuery.data.commercialTerms.foundingPartnerExpiryDate?.slice(0, 10) ?? '')
  }

  const selectedModule = modules.find(m => m.key === selectedKey)

  function save() {
    savePricingMutation.mutate({
      catererId, moduleKey: selectedKey,
      monthlyPriceCents: selectedModule?.pricing.monthlyPriceCents ?? null,
      setupFeeCents: selectedModule?.pricing.setupFeeCents ?? null,
      discountPct: selectedModule?.pricing.discountPct ?? 0,
      foundingPartnerFree: freeForLife,
    })
    if (expiry) {
      saveTermsMutation.mutate({ catererId, moduleKey: selectedKey, foundingPartnerExpiryDate: expiry })
    }
  }

  const isPending = savePricingMutation.isPending || saveTermsMutation.isPending

  return (
    <div className="flex flex-col gap-5">
      <ModuleSelector modules={modules} selectedKey={selectedKey} onChange={setSelectedKey} />

      {detailQuery.isLoading ? (
        <p className="text-[13px]" style={{ color: 'var(--text-4)' }}>Loading…</p>
      ) : (
        <>
          <div className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: freeForLife ? 'rgba(167,139,250,0.07)' : 'var(--bg-card)', border: `1px solid ${freeForLife ? 'rgba(167,139,250,0.30)' : 'var(--border-default)'}` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: freeForLife ? 'rgba(167,139,250,0.15)' : 'var(--bg-inner)', border: `1px solid ${freeForLife ? 'rgba(167,139,250,0.35)' : 'var(--border-strong)'}` }}>
              <Star size={18} strokeWidth={1.8} style={{ color: freeForLife ? '#a78bfa' : 'var(--text-4)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>Founding Partner — Free for Life</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                    When enabled, this module is billed $0/month for {selectedModule?.name ?? 'this module'} regardless of its configured price.
                  </p>
                </div>
                <button
                  onClick={() => setFreeForLife(v => !v)}
                  className="relative cursor-pointer rounded-full transition-colors shrink-0"
                  style={{ width: '48px', height: '26px', background: freeForLife ? 'var(--accent)' : 'var(--bg-inner)', border: `2px solid ${freeForLife ? 'var(--accent)' : 'var(--border-strong)'}` }}>
                  <span className="absolute top-[3px] rounded-full transition-all"
                    style={{ width: '16px', height: '16px', background: freeForLife ? '#07070a' : 'var(--text-4)', left: freeForLife ? '26px' : '3px' }} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Expiry</p>
            <div className="flex flex-col gap-1.5 max-w-xs">
              <label className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>Founding Partner Expiry Date</label>
              <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)}
                className="px-3 py-2 rounded-xl text-[13px] outline-none"
                style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }} />
              <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>After this date, standard pricing applies automatically. Leave blank for no expiry.</p>
            </div>
          </div>

          {freeForLife && (
            <div className="flex items-start gap-3 rounded-2xl px-5 py-4"
              style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)' }}>
              <AlertTriangle size={15} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
              <div>
                <p className="text-[12.5px] font-bold mb-0.5" style={{ color: '#f87171' }}>Free for Life — revenue impact</p>
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                  This module will be billed $0/month permanently for this caterer. Ensure this is explicitly approved before generating the contract.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.20)' }}>
            <Info size={12} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
            <p className="text-[11px]" style={{ color: '#60a5fa' }}>
              Founding Partner status is set per module — switch modules above to configure each one independently.
            </p>
          </div>

          <div>
            <button onClick={save} disabled={isPending}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
