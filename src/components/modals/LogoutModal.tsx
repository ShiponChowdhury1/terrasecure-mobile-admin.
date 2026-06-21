"use client"
import React, { useEffect } from 'react'
import { LogOut, X } from 'lucide-react'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent background scrolling when open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 overflow-hidden transform transition-all duration-300 animate-in zoom-in-95 z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Warning Icon */}
        <div className="bg-red-50 text-red-600 rounded-full p-3.5 w-14 h-14 flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50">
          <LogOut className="w-6 h-6 stroke-[2.25]" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 leading-6">
            Are you sure you want to logout?
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            You will need to sign in again to access the admin panel.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm shadow-sm hover:shadow-md active:bg-red-800 transition-all cursor-pointer text-center"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
