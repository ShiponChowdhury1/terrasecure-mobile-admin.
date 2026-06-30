"use client"
import React, { useState } from 'react'
import { X, Shield } from 'lucide-react'

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
            <h3 className="text-base font-bold text-slate-955">Configure Registry</h3>
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
                <label className="text-xs font-bold text-slate-705">API Private Secret / Password</label>
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

export default ConfigurationDrawer
