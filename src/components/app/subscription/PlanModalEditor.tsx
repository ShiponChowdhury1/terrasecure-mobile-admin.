"use client"
import React, { useState } from 'react'
import { Zap, Star, Crown, Plus, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubscriptionPlan, Feature } from '@/pages/app/SubscriptionPage'

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
                        : "border-slate-200 bg-white text-slate-400 hover:text-slate-605"
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

export default PlanModalEditor
