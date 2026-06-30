"use client"
import React, { useState, useMemo, useCallback } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import {
  Crown,
  Zap,
  Star,
  Check,
  Trash2,
  Pencil,
  Plus,
  RefreshCw,
  Megaphone,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PlanModalEditor from '@/components/app/subscription/PlanModalEditor'
import ConfigurationDrawer from '@/components/app/subscription/ConfigurationDrawer'

export interface Feature {
  id: string
  text: string
  enabled: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  unlocksDescription: string
  price: number
  currency: string
  period: 'day' | 'week' | 'month' | 'year'
  badgeLabel?: string
  badgeColor?: 'orange' | 'green' | 'purple' | 'red' | 'blue'
  features: Feature[]
  displayOrder: number
  isActive: boolean
  icon: 'zap' | 'star' | 'crown'
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  isActive: boolean
  badge?: string
  modifiedBy: string
  modifiedAt: string
}

export interface FeeType {
  id: string
  name: string
  description: string
  isActive: boolean
  badge?: string
  modifiedBy: string
  modifiedAt: string
}

export interface AccessTier {
  id: string
  name: string
  description: string
  isActive: boolean
  badge?: string
  modifiedBy: string
  modifiedAt: string
}

const initialPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1',
    name: 'Daily',
    unlocksDescription: '3 unlocks per day',
    price: 500,
    currency: 'XAF',
    period: 'day',
    features: [
      { id: '1-1', text: '3 premium parcel unlocks', enabled: true },
      { id: '1-2', text: 'Owner contact info', enabled: true },
      { id: '1-3', text: 'Title deed details', enabled: true },
      { id: '1-4', text: 'Priority support', enabled: false },
      { id: '1-5', text: 'Export reports', enabled: false }
    ],
    displayOrder: 1,
    isActive: true,
    icon: 'zap'
  },
  {
    id: 'plan-2',
    name: 'Weekly',
    unlocksDescription: '20 unlocks per week',
    price: 2500,
    currency: 'XAF',
    period: 'week',
    badgeLabel: 'MOST POPULAR',
    badgeColor: 'orange',
    features: [
      { id: '2-1', text: '20 premium parcel unlocks', enabled: true },
      { id: '2-2', text: 'Owner contact info', enabled: true },
      { id: '2-3', text: 'Title deed details', enabled: true },
      { id: '2-4', text: 'Priority support', enabled: true },
      { id: '2-5', text: 'Export reports', enabled: false }
    ],
    displayOrder: 2,
    isActive: true,
    icon: 'star'
  },
  {
    id: 'plan-3',
    name: 'Monthly',
    unlocksDescription: 'Unlimited unlocks',
    price: 8000,
    currency: 'XAF',
    period: 'month',
    features: [
      { id: '3-1', text: 'Unlimited premium parcel unlocks', enabled: true },
      { id: '3-2', text: 'Owner contact info', enabled: true },
      { id: '3-3', text: 'Title deed details', enabled: true },
      { id: '3-4', text: 'Priority support', enabled: true },
      { id: '3-5', text: 'Export reports', enabled: true }
    ],
    displayOrder: 3,
    isActive: true,
    icon: 'crown'
  }
]

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: 'payment-mtn',
    name: 'MTN Mobile Money',
    description: 'Allow users to pay via MTN MoMo. Requires MTN API credentials configured on the server.',
    isActive: false,
    modifiedBy: 'Jean Alima',
    modifiedAt: 'Just now'
  },
  {
    id: 'payment-orange',
    name: 'Orange Money',
    description: 'Enable Orange Money as a payment method for land fees. Orange Cameroon partnership required.',
    isActive: false,
    modifiedBy: 'Jean Alima',
    modifiedAt: '10 Jun 2025 09:14'
  },
  {
    id: 'payment-card',
    name: 'Bank Card (Visa / Mastercard)',
    description: 'Accept Visa and Mastercard payments via PayDunya. Higher transaction fees apply.',
    isActive: true,
    badge: 'Live',
    modifiedBy: 'System',
    modifiedAt: '1 Jan 2025 00:00'
  }
]

const initialFeeTypes: FeeType[] = [
  {
    id: 'fee-consultation',
    name: 'Consultation Fees',
    description: 'Charge clients a fee to submit consultation requests for parcels.',
    isActive: true,
    badge: 'Live',
    modifiedBy: 'Jean Alima',
    modifiedAt: '5 Jun 2025 14:30'
  },
  {
    id: 'fee-surveying',
    name: 'Surveying Fee',
    description: 'Charge applicants for field surveyor assignments.',
    isActive: true,
    badge: 'Live',
    modifiedBy: 'Marie Nkodo',
    modifiedAt: '2 Jun 2025 11:00'
  },
  {
    id: 'fee-express',
    name: 'Express Processing Fee',
    description: 'Allow applicants to pay extra to move their registration to the front of the queue.',
    isActive: false,
    modifiedBy: 'Jean Alima',
    modifiedAt: '8 Jun 2025 16:45'
  }
]

const initialAccessTiers: AccessTier[] = [
  {
    id: 'tier-premium',
    name: 'Premium Client Access',
    description: 'Unlock advanced features for premium clients: bulk upload, priority support, extended storage, API access.',
    isActive: false,
    modifiedBy: 'Jean Alima',
    modifiedAt: '9 Jun 2025 10:00'
  },
  {
    id: 'tier-public',
    name: 'Public Map Access',
    description: 'Allow unauthenticated users to view published parcels on the public GIS map (read-only).',
    isActive: true,
    badge: 'Live',
    modifiedBy: 'System',
    modifiedAt: '1 Jan 2025 00:00'
  }
]

const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'controls'>('plans')

  // Banner states
  const [bannerEnabled, setBannerEnabled] = useState(true)
  const [bannerLabel, setBannerLabel] = useState('Limited Time')
  const [bannerSubtitle, setBannerSubtitle] = useState('Explore parcels at no cost!')
  const [bannerTitle, setBannerTitle] = useState('Free Access During Launch Period')

  // Temporarily saved banner values for cancel button
  const [tempBanner, setTempBanner] = useState({
    enabled: true,
    label: 'Limited Time',
    subtitle: 'Explore parcels at no cost!',
    title: 'Free Access During Launch Period'
  })

  // Dynamic States
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [feeTypes, setFeeTypes] = useState<FeeType[]>(initialFeeTypes)
  const [accessTiers, setAccessTiers] = useState<AccessTier[]>(initialAccessTiers)

  // Modal controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [configuringItem, setConfiguringItem] = useState<{
    type: 'payment' | 'fee' | 'tier'
    id: string
    name: string
    description: string
    isActive: boolean
  } | null>(null)

  // Calculations for stats memoized
  const stats = useMemo(() => {
    const activePlansCount = plans.filter((p) => p.isActive).length
    const activeMethodsCount = paymentMethods.filter((p) => p.isActive).length
    const activeFeesCount = feeTypes.filter((f) => f.isActive).length
    const activeTiersCount = accessTiers.filter((t) => t.isActive).length
    return {
      activePlansCount,
      totalPlansCount: plans.length,
      activeMethodsCount,
      activeFeesCount,
      activeTiersCount,
      totalFlags: paymentMethods.length + feeTypes.length + accessTiers.length,
      activeFlagsCount: activeMethodsCount + activeFeesCount + activeTiersCount
    }
  }, [plans, paymentMethods, feeTypes, accessTiers])

  // Synchronize Payment quick controls switch changes with method registry
  const handleQuickTogglePayment = useCallback((id: string, active: boolean) => {
    setPaymentMethods((prev) =>
      prev.map((pm) =>
        pm.id === id ? { ...pm, isActive: active, modifiedBy: 'Jean Alima', modifiedAt: 'Just now' } : pm
      )
    )
  }, [])

  // Quick toggles for Fee Types and Access Tiers
  const handleToggleFee = useCallback((id: string) => {
    setFeeTypes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive, modifiedBy: 'Jean Alima', modifiedAt: 'Just now' } : f))
    )
  }, [])

  const handleToggleAccessTier = useCallback((id: string) => {
    setAccessTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive, modifiedBy: 'Jean Alima', modifiedAt: 'Just now' } : t))
    )
  }, [])

  // Handle saving banner changes
  const handleSaveBanner = useCallback(() => {
    setTempBanner({
      enabled: bannerEnabled,
      label: bannerLabel,
      subtitle: bannerSubtitle,
      title: bannerTitle
    })
    alert('Promotional banner settings saved successfully.')
  }, [bannerEnabled, bannerLabel, bannerSubtitle, bannerTitle])

  // Handle canceling banner changes
  const handleCancelBanner = useCallback(() => {
    setBannerEnabled(tempBanner.enabled)
    setBannerLabel(tempBanner.label)
    setBannerSubtitle(tempBanner.subtitle)
    setBannerTitle(tempBanner.title)
  }, [tempBanner])

  // Plan toggles
  const handleTogglePlan = useCallback((id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }, [])

  // Delete plan
  const handleDeletePlan = useCallback((id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the plan "${name}"?`)) {
      setPlans((prev) => prev.filter((p) => p.id !== id))
    }
  }, [])

  // Add plan submit
  const handleCreatePlan = useCallback((newPlan: Omit<SubscriptionPlan, 'id'>) => {
    const created: SubscriptionPlan = {
      ...newPlan,
      id: `plan-${Date.now()}`
    }
    setPlans((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder))
    setIsAddModalOpen(false)
  }, [])

  // Edit plan submit
  const handleUpdatePlan = useCallback((updatedPlan: SubscriptionPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)).sort((a, b) => a.displayOrder - b.displayOrder)
    )
    setEditingPlan(null)
  }, [])

  // Generic Save Configuration callback
  const handleSaveConfiguration = useCallback((id: string, type: 'payment' | 'fee' | 'tier', name: string) => {
    alert(`Configuration for "${name}" saved successfully.`)
    setConfiguringItem(null)
  }, [])

  const handleClosePlanModal = useCallback(() => {
    setIsAddModalOpen(false)
    setEditingPlan(null)
  }, [])

  const handleCloseConfigDrawer = useCallback(() => {
    setConfiguringItem(null)
  }, [])

  return (
    <DashboardChildrenLayout
      title="Subscription & Feature Flags"
      subtitle="Control payment methods, fees, access tiers, and subscription plans"
    >
      <div className="space-y-6 text-left">
        {/* Metric stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs">
            <h4 className="text-xl md:text-2xl font-bold text-purple-600 font-mono">
              {stats.activePlansCount}/{stats.totalPlansCount} active
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Subscription Plans
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs">
            <h4 className="text-xl md:text-2xl font-bold text-emerald-600 font-mono">
              {stats.activeFlagsCount}/{stats.totalFlags}
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Feature Flags On
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs">
            <h4 className="text-xl md:text-2xl font-bold text-blue-600 font-mono">
              {stats.activeMethodsCount}
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Payment Methods Active
            </p>
          </div>
          {/* Card 4 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs">
            <h4
              className={cn(
                "text-xl md:text-2xl font-bold font-mono",
                bannerEnabled ? "text-amber-500" : "text-slate-400"
              )}
            >
              {bannerEnabled ? 'Visible' : 'Hidden'}
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Promo Banner
            </p>
          </div>
        </div>

        {/* Sync server notice bar */}
        <div className="bg-blue-50/50 border border-blue-100/70 rounded-xl p-3.5 flex items-center gap-3">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0 [animation-duration:8s]" />
          <p className="text-xs font-semibold text-blue-700">
            All changes are applied <span className="font-bold">instantly server-side</span> — no app release required. Logged in Audit Logs.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-1.5">
          <button
            onClick={() => setActiveTab('plans')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs border",
              activeTab === 'plans'
                ? "bg-emerald-800 border-emerald-900 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350"
            )}
          >
            <Crown className="w-4.5 h-4.5" />
            <span>Subscription Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs border",
              activeTab === 'controls'
                ? "bg-emerald-800 border-emerald-900 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350"
            )}
          >
            <Zap className="w-4.5 h-4.5" />
            <span>Payment Controls & Feature Flags</span>
          </button>
        </div>

        {/* PLANS VIEW */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Promo Banner form card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Promotional Banner</h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold border leading-none uppercase",
                      bannerEnabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-500 border-slate-100"
                    )}
                  >
                    {bannerEnabled ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setBannerEnabled(!bannerEnabled)}
                  className="focus:outline-none cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                      bannerEnabled ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
                    )}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-650">Label pill</label>
                  <input
                    type="text"
                    value={bannerLabel}
                    onChange={(e) => setBannerLabel(e.target.value)}
                    disabled={!bannerEnabled}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-655">Subtitle</label>
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    disabled={!bannerEnabled}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-655">Title</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    disabled={!bannerEnabled}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-50">
                <button
                  onClick={handleSaveBanner}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelBanner}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Plans List Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-955">Subscription Plans</h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {plans.length} active · displayed in this order to clients
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Plan</span>
                </button>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const isPopular = plan.badgeLabel === 'MOST POPULAR'
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "bg-white rounded-2xl shadow-sm flex flex-col relative transition-all border",
                        isPopular ? "border-amber-500 shadow-md scale-102" : "border-slate-100"
                      )}
                    >
                      {/* Ribbon banner */}
                      {plan.badgeLabel && (
                        <div className="absolute top-0 inset-x-0 bg-amber-500 text-white rounded-t-xl py-1 text-center font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          <span>{plan.badgeLabel}</span>
                        </div>
                      )}

                      {/* Card Content wrapper */}
                      <div className={cn("p-5 flex-1 flex flex-col justify-between", plan.badgeLabel && "pt-8")}>
                        {/* Header details */}
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              {/* Plan Icon */}
                              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 shadow-inner">
                                {plan.icon === 'zap' && <Zap className="w-4 h-4 fill-amber-500" />}
                                {plan.icon === 'star' && <Star className="w-4 h-4 fill-amber-500" />}
                                {plan.icon === 'crown' && <Crown className="w-4 h-4 fill-amber-500" />}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                                <p className="text-[10px] font-semibold text-slate-400">{plan.unlocksDescription}</p>
                              </div>
                            </div>

                            {/* Plan Toggles/Actions */}
                            <div className="flex items-center gap-2">
                              {/* Toggle switch */}
                              <button
                                type="button"
                                onClick={() => handleTogglePlan(plan.id)}
                                className="focus:outline-none cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    "w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                                    plan.isActive ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
                                  )}
                                >
                                  <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                                </div>
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => setEditingPlan(plan)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-emerald-105"
                                title="Edit plan"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Trash */}
                              <button
                                onClick={() => handleDeletePlan(plan.id, plan.name)}
                                className="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-rose-105"
                                title="Delete plan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Price label */}
                          <div className="mb-5">
                            <span className="text-2xl font-black text-slate-800">
                              {plan.price.toLocaleString()}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-bold ml-1.5 uppercase",
                                isPopular ? "text-amber-600" : "text-emerald-700"
                              )}
                            >
                              {plan.currency}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {' '}
                              / {plan.period}
                            </span>
                          </div>

                          {/* Features checks list */}
                          <ul className="space-y-2.5 mb-6 text-left">
                            {plan.features.map((feat) => (
                              <li key={feat.id} className="flex items-start gap-2.5 text-xs">
                                <span
                                  className={cn(
                                    "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border shadow-inner",
                                    feat.enabled
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                      : "bg-slate-50 text-slate-300 border-slate-100"
                                  )}
                                >
                                  {feat.enabled && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </span>
                                <span
                                  className={cn(
                                    "font-semibold",
                                    feat.enabled ? "text-slate-700" : "text-slate-350 line-through decoration-slate-200"
                                  )}
                                >
                                  {feat.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Choose Plan action button */}
                        <button
                          onClick={() => alert(`Activated client preview for "${plan.name} Plan".`)}
                          className={cn(
                            "w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs border text-center",
                            isPopular
                              ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
                              : "bg-white border-emerald-800 text-emerald-800 hover:bg-emerald-50/20"
                          )}
                        >
                          Choose {plan.name} Plan
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Preview Footer note */}
              <p className="text-[10px] font-bold text-slate-400 text-center pt-4 tracking-wide uppercase">
                Preview footer shown to clients: Cancel anytime · No hidden fees · Secured payments
              </p>
            </div>
          </div>
        )}

        {/* CONTROLS & FEATURE FLAGS VIEW */}
        {activeTab === 'controls' && (
          <div className="space-y-6">
            {/* Quick toggles card */}
            <div className="bg-slate-900 border border-slate-950 rounded-2xl p-5 shadow-md relative text-white">
              {/* Ribbon */}
              <span className="absolute top-3 right-4 px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500 text-slate-955 tracking-wider">
                No App Release Required
              </span>
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold">Quick Payment Method Controls</h3>
              </div>

              {/* Switches list row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <h4 className="text-xs font-bold text-white">{pm.name}</h4>
                      <p className={cn("text-[9px] font-bold tracking-wide uppercase mt-0.5", pm.isActive ? "text-emerald-450" : "text-slate-400")}>
                        ● {pm.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    {/* Switch slider */}
                    <button
                      type="button"
                      onClick={() => handleQuickTogglePayment(pm.id, !pm.isActive)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <div
                        className={cn(
                          "w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                          pm.isActive ? "bg-emerald-600 justify-end" : "bg-white/10 justify-start"
                        )}
                      >
                        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-1">
                <h3 className="text-sm font-bold text-slate-955">Payment Methods</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                  {stats.activeMethodsCount}/3 on
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="py-4.5 flex items-start justify-between gap-4 first:pt-1 last:pb-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-400">
                          <Settings className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{pm.name}</h4>
                        {pm.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-450 leading-relaxed max-w-xl">
                        {pm.description}
                      </p>
                      <button
                        onClick={() => setConfiguringItem({ ...pm, type: 'payment' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Configure</span>
                      </button>
                      <p className="text-[9px] font-bold text-slate-400">
                        Modified by {pm.modifiedBy} · {pm.modifiedAt}
                      </p>
                    </div>

                    {/* Switch toggler */}
                    <button
                      type="button"
                      onClick={() => handleQuickTogglePayment(pm.id, !pm.isActive)}
                      className="focus:outline-none cursor-pointer pt-1"
                    >
                      <div
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                          pm.isActive ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
                        )}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Types Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-1">
                <h3 className="text-sm font-bold text-slate-955">Fee Types</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                  {stats.activeFeesCount}/3 on
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {feeTypes.map((ft) => (
                  <div key={ft.id} className="py-4.5 flex items-start justify-between gap-4 first:pt-1 last:pb-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-400">
                          <Settings className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{ft.name}</h4>
                        {ft.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {ft.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-450 leading-relaxed max-w-xl">
                        {ft.description}
                      </p>
                      <button
                        onClick={() => setConfiguringItem({ ...ft, type: 'fee' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Configure</span>
                      </button>
                      <p className="text-[9px] font-bold text-slate-400">
                        Modified by {ft.modifiedBy} · {ft.modifiedAt}
                      </p>
                    </div>

                    {/* Switch toggler */}
                    <button
                      type="button"
                      onClick={() => handleToggleFee(ft.id)}
                      className="focus:outline-none cursor-pointer pt-1"
                    >
                      <div
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                          ft.isActive ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
                        )}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Tiers Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-1">
                <h3 className="text-sm font-bold text-slate-955">Access Tiers</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                  {stats.activeTiersCount}/2 on
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {accessTiers.map((at) => (
                  <div key={at.id} className="py-4.5 flex items-start justify-between gap-4 first:pt-1 last:pb-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-400">
                          <Settings className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{at.name}</h4>
                        {at.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {at.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-450 leading-relaxed max-w-xl">
                        {at.description}
                      </p>
                      <button
                        onClick={() => setConfiguringItem({ ...at, type: 'tier' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Configure</span>
                      </button>
                      <p className="text-[9px] font-bold text-slate-400">
                        Modified by {at.modifiedBy} · {at.modifiedAt}
                      </p>
                    </div>

                    {/* Switch toggler */}
                    <button
                      type="button"
                      onClick={() => handleToggleAccessTier(at.id)}
                      className="focus:outline-none cursor-pointer pt-1"
                    >
                      <div
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                          at.isActive ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
                        )}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT PLAN MODAL */}
      {(isAddModalOpen || editingPlan) && (
        <PlanModalEditor
          key={editingPlan?.id || 'new'}
          plan={editingPlan || undefined}
          onClose={handleClosePlanModal}
          onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
        />
      )}

      {/* ITEM CONFIGURATION DRAWER / MODAL */}
      {configuringItem && (
        <ConfigurationDrawer
          key={`${configuringItem.type}-${configuringItem.id}`}
          item={configuringItem}
          onClose={handleCloseConfigDrawer}
          onSave={handleSaveConfiguration}
        />
      )}
    </DashboardChildrenLayout>
  )
}

export default SubscriptionPage
