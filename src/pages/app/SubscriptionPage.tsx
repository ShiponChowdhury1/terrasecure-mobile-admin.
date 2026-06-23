"use client"
import React, { useState, useEffect, useRef } from 'react'
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
  X,
  Shield,
  Settings,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Feature {
  id: string
  text: string
  enabled: boolean
}

interface SubscriptionPlan {
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

interface PaymentMethod {
  id: string
  name: string
  description: string
  isActive: boolean
  badge?: string
  modifiedBy: string
  modifiedAt: string
}

interface FeeType {
  id: string
  name: string
  description: string
  isActive: boolean
  badge?: string
  modifiedBy: string
  modifiedAt: string
}

interface AccessTier {
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

  // Calculations for stats
  const activePlansCount = plans.filter((p) => p.isActive).length
  const totalPlansCount = plans.length

  const activeMethodsCount = paymentMethods.filter((p) => p.isActive).length
  const activeFeesCount = feeTypes.filter((f) => f.isActive).length
  const activeTiersCount = accessTiers.filter((t) => t.isActive).length

  const totalFlags = paymentMethods.length + feeTypes.length + accessTiers.length
  const activeFlagsCount = activeMethodsCount + activeFeesCount + activeTiersCount

  // Synchronize Payment quick controls switch changes with method registry
  const handleQuickTogglePayment = (id: string, active: boolean) => {
    setPaymentMethods((prev) =>
      prev.map((pm) =>
        pm.id === id ? { ...pm, isActive: active, modifiedBy: 'Jean Alima', modifiedAt: 'Just now' } : pm
      )
    )
  }

  // Handle saving banner changes
  const handleSaveBanner = () => {
    setTempBanner({
      enabled: bannerEnabled,
      label: bannerLabel,
      subtitle: bannerSubtitle,
      title: bannerTitle
    })
    alert('Promotional banner settings saved successfully.')
  }

  // Handle canceling banner changes
  const handleCancelBanner = () => {
    setBannerEnabled(tempBanner.enabled)
    setBannerLabel(tempBanner.label)
    setBannerSubtitle(tempBanner.subtitle)
    setBannerTitle(tempBanner.title)
  }

  // Plan toggles
  const handleTogglePlan = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  // Delete plan
  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the plan "${name}"?`)) {
      setPlans((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // Add plan submit
  const handleCreatePlan = (newPlan: Omit<SubscriptionPlan, 'id'>) => {
    const created: SubscriptionPlan = {
      ...newPlan,
      id: `plan-${Date.now()}`
    }
    setPlans((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder))
    setIsAddModalOpen(false)
  }

  // Edit plan submit
  const handleUpdatePlan = (updatedPlan: SubscriptionPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)).sort((a, b) => a.displayOrder - b.displayOrder)
    )
    setEditingPlan(null)
  }

  // Generic Save Configuration callback
  const handleSaveConfiguration = (id: string, type: 'payment' | 'fee' | 'tier', name: string) => {
    alert(`Configuration for "${name}" saved successfully.`)
    setConfiguringItem(null)
  }

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
              {activePlansCount}/{totalPlansCount} active
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Subscription Plans
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs">
            <h4 className="text-xl md:text-2xl font-bold text-emerald-600 font-mono">
              {activeFlagsCount}/{totalFlags}
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Feature Flags On
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs">
            <h4 className="text-xl md:text-2xl font-bold text-blue-600 font-mono">
              {activeMethodsCount}
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
                  <label className="text-xs font-bold text-slate-650">Subtitle</label>
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    disabled={!bannerEnabled}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-650">Title</label>
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
                  <h3 className="text-base font-bold text-slate-950">Subscription Plans</h3>
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
                                className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-emerald-100"
                                title="Edit plan"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Trash */}
                              <button
                                onClick={() => handleDeletePlan(plan.id, plan.name)}
                                className="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-rose-100"
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
              <span className="absolute top-3 right-4 px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500 text-slate-950 tracking-wider">
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
                <h3 className="text-sm font-bold text-slate-950">Payment Methods</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                  {activeMethodsCount}/3 on
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
                <h3 className="text-sm font-bold text-slate-950">Fee Types</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                  {activeFeesCount}/3 on
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
                      onClick={() => {
                        setFeeTypes((prev) =>
                          prev.map((f) => (f.id === ft.id ? { ...f, isActive: !f.isActive, modifiedBy: 'Jean Alima', modifiedAt: 'Just now' } : f))
                        )
                      }}
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
                <h3 className="text-sm font-bold text-slate-950">Access Tiers</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                  {activeTiersCount}/2 on
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
                      onClick={() => {
                        setAccessTiers((prev) =>
                          prev.map((t) => (t.id === at.id ? { ...t, isActive: !t.isActive, modifiedBy: 'Jean Alima', modifiedAt: 'Just now' } : t))
                        )
                      }}
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
          plan={editingPlan || undefined}
          onClose={() => {
            setIsAddModalOpen(false)
            setEditingPlan(null)
          }}
          onSubmit={(data) => {
            if (editingPlan) {
              handleUpdatePlan({ ...editingPlan, ...data })
            } else {
              handleCreatePlan(data)
            }
          }}
        />
      )}

      {/* ITEM CONFIGURATION DRAWER / MODAL */}
      {configuringItem && (
        <ConfigurationDrawer
          item={configuringItem}
          onClose={() => setConfiguringItem(null)}
          onSave={handleSaveConfiguration}
        />
      )}
    </DashboardChildrenLayout>
  )
}

// PLAN MODAL EDITOR COMPONENT (Add / Edit)
interface PlanModalEditorProps {
  plan?: SubscriptionPlan
  onClose: () => void
  onSubmit: (data: Omit<SubscriptionPlan, 'id'>) => void
}

const PlanModalEditor = ({ plan, onClose, onSubmit }: PlanModalEditorProps) => {
  const [name, setName] = useState(plan?.name || '')
  const [unlocksDescription, setUnlocksDescription] = useState(plan?.unlocksDescription || '')
  const [price, setPrice] = useState(plan?.price || 0)
  const [currency, setCurrency] = useState(plan?.currency || 'XAF')
  const [period, setPeriod] = useState<SubscriptionPlan['period']>(plan?.period || 'month')
  const [badgeLabel, setBadgeLabel] = useState(plan?.badgeLabel || '')
  const [badgeColor, setBadgeColor] = useState<SubscriptionPlan['badgeColor']>(plan?.badgeColor || 'orange')
  const [icon, setIcon] = useState<SubscriptionPlan['icon']>(plan?.icon || 'star')
  const [displayOrder, setDisplayOrder] = useState(plan?.displayOrder || 99)
  const [isActive, setIsActive] = useState(plan ? plan.isActive : true)

  // Features list
  const [features, setFeatures] = useState<Feature[]>(
    plan?.features || [
      { id: 'f-1', text: '3 premium parcel unlocks', enabled: true },
      { id: 'f-2', text: 'Owner contact info', enabled: true },
      { id: 'f-3', text: 'Title deed details', enabled: true }
    ]
  )

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, { id: `feat-${Date.now()}`, text: '', enabled: true }])
  }

  const handleRemoveFeature = (id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id))
  }

  const handleFeatureTextChange = (id: string, text: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, text } : f)))
  }

  const handleFeatureToggle = (id: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !unlocksDescription || price <= 0) {
      alert('Please fill out all required fields and enter a valid price.')
      return
    }
    onSubmit({
      name,
      unlocksDescription,
      price: Number(price),
      currency,
      period,
      badgeLabel: badgeLabel || undefined,
      badgeColor: badgeLabel ? badgeColor : undefined,
      icon,
      features,
      displayOrder: Number(displayOrder),
      isActive
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pb-3 border-b border-slate-50">
          <h3 className="text-base font-bold text-slate-900">
            {plan ? 'Edit Plan' : 'Add New Plan'}
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {plan ? `Editing "${plan.name}"` : 'Create a new subscription plan'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Icon Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Plan Icon</label>
            <div className="flex items-center gap-3">
              {[
                { name: 'zap' as const, comp: Zap },
                { name: 'star' as const, comp: Star },
                { name: 'crown' as const, comp: Crown }
              ].map((ic) => {
                const IconComp = ic.comp
                const isSelected = icon === ic.name
                return (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setIcon(ic.name)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-inner",
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 scale-105 stroke-[2.5]"
                        : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                )
              })}
              {/* Dummy icons placeholders to match screenshot */}
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center" />
              ))}
            </div>
          </div>

          {/* Plan Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Plan Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekly, Monthly..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
            />
          </div>

          {/* Unlocks Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Unlocks Description</label>
            <input
              type="text"
              value={unlocksDescription}
              onChange={(e) => setUnlocksDescription(e.target.value)}
              placeholder="e.g. 20 unlocks per week"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
            />
          </div>

          {/* Price, Currency, Period inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Price *</label>
              <input
                type="number"
                required
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="e.g. 2500"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="XAF">XAF</option>
                <option value="AXF">AXF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
          </div>

          {/* Badge Label and Badge Color Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Badge Label (optional)</label>
              <input
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                placeholder="e.g. MOST POPULAR"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
              />
            </div>

            {/* Badge Color circle pickers */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Badge Color</label>
              <div className="flex items-center gap-2 h-9">
                {[
                  { name: 'orange' as const, hexClass: 'bg-amber-500' },
                  { name: 'green' as const, hexClass: 'bg-emerald-600' },
                  { name: 'purple' as const, hexClass: 'bg-purple-600' },
                  { name: 'red' as const, hexClass: 'bg-rose-600' },
                  { name: 'blue' as const, hexClass: 'bg-blue-600' }
                ].map((clr) => (
                  <button
                    key={clr.name}
                    type="button"
                    onClick={() => setBadgeColor(clr.name)}
                    disabled={!badgeLabel}
                    className={cn(
                      "w-6 h-6 rounded-full cursor-pointer transition-all border ring-offset-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed",
                      clr.hexClass,
                      badgeColor === clr.name && badgeLabel ? "ring-2 ring-emerald-600 border-white" : "border-transparent"
                    )}
                    title={clr.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Plan Features Checklist Inputs */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Plan Features</label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Add feature</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1 border border-slate-50/50 p-1.5 rounded-xl bg-slate-50/30">
              {features.map((feat) => (
                <div key={feat.id} className="flex items-center gap-2.5">
                  {/* Enabled Toggle Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleFeatureToggle(feat.id)}
                    className={cn(
                      "w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border shadow-xs transition-colors cursor-pointer",
                      feat.enabled
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-white text-transparent border-slate-200 hover:border-slate-350"
                    )}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    required
                    value={feat.text}
                    onChange={(e) => handleFeatureTextChange(feat.id, e.target.value)}
                    placeholder="Feature description..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-white"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feat.id)}
                    className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove feature"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Display Order and Active toggle switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
              />
              <p className="text-[10px] text-slate-400 font-medium">Lower number = shown first</p>
            </div>

            <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 h-[58px]">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Plan Active</span>
                <span className="text-[10px] text-slate-450 font-medium">Visible to clients on client page</span>
              </div>
              {/* Toggler */}
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="focus:outline-none cursor-pointer"
              >
                <div
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shadow-inner",
                    isActive ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"
                  )}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </button>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-50 mt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
            >
              {plan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// GENERIC ITEM CONFIGURATION DRAWER COMPONENT
interface ConfigurationDrawerProps {
  item: {
    type: 'payment' | 'fee' | 'tier'
    id: string
    name: string
    description: string
    isActive: boolean
  }
  onClose: () => void
  onSave: (id: string, type: 'payment' | 'fee' | 'tier', name: string) => void
}

const ConfigurationDrawer = ({ item, onClose, onSave }: ConfigurationDrawerProps) => {
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [feeAmount, setFeeAmount] = useState(5000)
  const [accessMonths, setAccessMonths] = useState(12)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-950">Configure Registry</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {item.type} · {item.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-700 leading-relaxed">
            {item.description}
          </div>

          {/* Conditional form fields based on type */}
          {item.type === 'payment' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-50 pb-1">Gateway API Settings</h4>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Client API Key / Username</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="e.g. mtn_momo_sandbox_key_..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-755 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">API Private Secret / Password</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-755 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                />
              </div>
              <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl">
                <p className="text-[11px] font-semibold text-amber-700 leading-relaxed">
                  ⚠️ Always make sure you test configurations in Sandbox environment before moving this payment method to Live state.
                </p>
              </div>
            </div>
          )}

          {item.type === 'fee' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-50 pb-1">Price Configuration</h4>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Fee (XAF)</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-755 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                />
              </div>
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <p className="text-[11px] font-semibold text-emerald-700 leading-relaxed">
                  ● Value is applied instantly on checkout invoices for all active client registrations.
                </p>
              </div>
            </div>
          )}

          {item.type === 'tier' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-50 pb-1">Access Options</h4>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Access Period Validity (Months)</label>
                <input
                  type="number"
                  value={accessMonths}
                  onChange={(e) => setAccessMonths(Number(e.target.value))}
                  placeholder="e.g. 12"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-755 focus:outline-none focus:border-blue-600 transition-all bg-slate-50/50"
                />
              </div>
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold text-blue-700 leading-relaxed">
                  Clients granted this tier will gain cryptographic access tokens valid for the specified period.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/40 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-650 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => onSave(item.id, item.type, item.name)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm border border-emerald-900"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage
