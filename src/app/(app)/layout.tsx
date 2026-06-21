"use client"
import React, { useState } from 'react'
import AdminSidebar from '@/components/shared/AdminSidebar'
import AdminTopbar from '@/components/shared/AdminTopbar'
import LogoutModal from '@/components/modals/LogoutModal'
import { useRouter } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    router.push('/auth/sign-in')
  }

  return (
    <>
      <div className={`flex h-screen w-screen overflow-hidden bg-slate-100 transition-all duration-300 ${
        showLogoutModal ? 'blur-[4px] pointer-events-none select-none' : ''
      }`}>
        {/* Sidebar navigation */}
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main application panel */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top bar search and actions */}
          <AdminTopbar 
            setMobileOpen={setMobileOpen} 
            onSignOut={() => setShowLogoutModal(true)} 
          />

          {/* Dynamic page content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}

export default Layout