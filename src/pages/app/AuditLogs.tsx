"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Search, ChevronDown, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuditLog {
  id: number
  timestamp: string
  userName: string
  userInitials: string
  userRole: 'Super Admin' | 'Admin' | 'Supervisor' | 'Surveyor' | 'Field Agent'
  action: 'Publication' | 'Status Change' | 'Document Approval' | 'Login' | 'User Change' | 'Parcel Update' | 'Deletion'
  description: string
  ipAddress: string
  target: string
}

const initialLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: '11 Jun 2025 09:14:32',
    userName: 'Jean Alima',
    userInitials: 'JA',
    userRole: 'Super Admin',
    action: 'Publication',
    description: 'Parcel CM-2847 published to platform',
    ipAddress: '197.155.20.12',
    target: 'CM-2847'
  },
  {
    id: 2,
    timestamp: '11 Jun 2025 09:02:11',
    userName: 'Marie Nkodo',
    userInitials: 'MN',
    userRole: 'Admin',
    action: 'Status Change',
    description: 'Parcel CM-2849 status changed to Under Verification',
    ipAddress: '197.155.20.15',
    target: 'CM-2849'
  },
  {
    id: 3,
    timestamp: '11 Jun 2025 08:47:59',
    userName: 'Samuel Kotto',
    userInitials: 'SK',
    userRole: 'Supervisor',
    action: 'Document Approval',
    description: 'Title deed for REG-1202 approved',
    ipAddress: '197.155.21.03',
    target: 'REG-1202'
  },
  {
    id: 4,
    timestamp: '10 Jun 2025 16:30:44',
    userName: 'Paul Biya Jr',
    userInitials: 'PBJ',
    userRole: 'Surveyor',
    action: 'Login',
    description: 'Successful login from mobile device',
    ipAddress: '197.155.22.88',
    target: 'Mobile Device'
  },
  {
    id: 5,
    timestamp: '10 Jun 2025 15:21:07',
    userName: 'Jean Alima',
    userInitials: 'JA',
    userRole: 'Super Admin',
    action: 'User Change',
    description: 'Role updated for Halima Bello: Field Agent → Admin',
    ipAddress: '197.155.20.12',
    target: 'Halima Bello'
  },
  {
    id: 6,
    timestamp: '10 Jun 2025 14:10:33',
    userName: 'Marie Nkodo',
    userInitials: 'MN',
    userRole: 'Admin',
    action: 'Parcel Update',
    description: 'Parcel CM-2853 coordinates updated',
    ipAddress: '197.155.20.15',
    target: 'CM-2853'
  },
  {
    id: 7,
    timestamp: '10 Jun 2025 13:05:20',
    userName: 'Jean Alima',
    userInitials: 'JA',
    userRole: 'Super Admin',
    action: 'Deletion',
    description: 'Draft parcel CM-2840 permanently deleted',
    ipAddress: '197.155.20.12',
    target: 'CM-2840'
  },
  {
    id: 8,
    timestamp: '10 Jun 2025 11:58:02',
    userName: 'Grace Tanda',
    userInitials: 'GT',
    userRole: 'Field Agent',
    action: 'Login',
    description: 'Successful login from field device',
    ipAddress: '197.155.25.44',
    target: 'Field Device'
  }
]

const getActionBadgeClass = (action: string) => {
  switch (action) {
    case 'Publication':
    case 'Document Approval':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100/80'
    case 'Status Change':
      return 'bg-amber-50/70 text-amber-700 border-amber-100/70'
    case 'Login':
      return 'bg-blue-50 text-blue-700 border-blue-100/80'
    case 'User Change':
      return 'bg-purple-50 text-purple-700 border-purple-100/80'
    case 'Parcel Update':
      return 'bg-cyan-50 text-cyan-700 border-cyan-100/80'
    case 'Deletion':
      return 'bg-rose-50 text-rose-700 border-rose-100/80'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-100/80'
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return 'bg-slate-900 text-white font-bold'
    case 'Admin':
      return 'bg-emerald-800 text-white font-bold'
    case 'Supervisor':
      return 'bg-teal-700 text-white font-bold'
    case 'Surveyor':
      return 'bg-blue-600 text-white font-bold'
    case 'Field Agent':
      return 'bg-amber-600 text-white font-bold'
    default:
      return 'bg-slate-500 text-white font-bold'
  }
}

const getActorRoleString = (userName: string, role: string) => {
  const roleStr = role.toLowerCase().replace(' ', '_')
  return `${userName} (${roleStr})`
}

const AuditLogs = () => {
  const [logs] = useState<AuditLog[]>(initialLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('All Users')
  const [selectedAction, setSelectedAction] = useState('Action Type')
  const [selectedDateRange, setSelectedDateRange] = useState('Date Range')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Dropdown states
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false)
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)

  // Refs for closing dropdowns when clicking outside
  const userRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setActionDropdownOpen(false)
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtering logic
  const filteredLogs = logs.filter((log) => {
    // Search Term Filter
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())

    // User Filter
    const matchesUser = selectedUser === 'All Users' || log.userName === selectedUser

    // Action Filter
    const matchesAction = selectedAction === 'Action Type' || log.action === selectedAction

    // Date Range Filter
    let matchesDate = true
    if (selectedDateRange === 'Today') {
      matchesDate = log.timestamp.includes('11 Jun 2025')
    } else if (selectedDateRange === 'Yesterday') {
      matchesDate = log.timestamp.includes('10 Jun 2025')
    } else if (selectedDateRange === 'Last 7 Days' || selectedDateRange === 'Last 30 Days') {
      // For mock dataset all items are in Jun 2025, which falls under last 7/30 days
      matchesDate = true
    }

    return matchesSearch && matchesUser && matchesAction && matchesDate
  })

  // List of unique users and action types for dropdowns
  const usersList = ['All Users', 'Jean Alima', 'Marie Nkodo', 'Samuel Kotto', 'Paul Biya Jr', 'Grace Tanda']
  const actionsList = ['Action Type', 'Publication', 'Status Change', 'Document Approval', 'Login', 'User Change', 'Parcel Update', 'Deletion']
  const dateRangesList = ['Date Range', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

  return (
    <DashboardChildrenLayout
      title="Audit Logs"
      subtitle="Complete action log for platform activity"
    >
      <div className="space-y-6 text-left">
        
        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search parcels..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm"
              />
            </div>

            {/* Users Dropdown */}
            <div ref={userRef} className="relative w-[48%] sm:w-auto">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen)
                  setActionDropdownOpen(false)
                  setDateDropdownOpen(false)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-750 transition-all cursor-pointer shadow-sm w-full sm:min-w-[130px] justify-between"
              >
                <span>{selectedUser}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {userDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in duration-100">
                  {usersList.map((user) => (
                    <button
                      key={user}
                      onClick={() => {
                        setSelectedUser(user)
                        setUserDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors",
                        selectedUser === user ? "text-blue-600 bg-blue-50/20" : "text-slate-650"
                      )}
                    >
                      {user}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Type Dropdown */}
            <div ref={actionRef} className="relative w-[48%] sm:w-auto">
              <button
                onClick={() => {
                  setActionDropdownOpen(!actionDropdownOpen)
                  setUserDropdownOpen(false)
                  setDateDropdownOpen(false)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-750 transition-all cursor-pointer shadow-sm w-full sm:min-w-[130px] justify-between"
              >
                <span>{selectedAction}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {actionDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in duration-100 max-h-60 overflow-y-auto">
                  {actionsList.map((act) => (
                    <button
                      key={act}
                      onClick={() => {
                        setSelectedAction(act)
                        setActionDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors",
                        selectedAction === act ? "text-blue-600 bg-blue-50/20" : "text-slate-650"
                      )}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Dropdown */}
            <div ref={dateRef} className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setDateDropdownOpen(!dateDropdownOpen)
                  setUserDropdownOpen(false)
                  setActionDropdownOpen(false)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-750 transition-all cursor-pointer shadow-sm w-full sm:min-w-[130px] justify-between"
              >
                <span>{selectedDateRange}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {dateDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in duration-100">
                  {dateRangesList.map((dr) => (
                    <button
                      key={dr}
                      onClick={() => {
                        setSelectedDateRange(dr)
                        setDateDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors",
                        selectedDateRange === dr ? "text-blue-600 bg-blue-50/20" : "text-slate-650"
                      )}
                    >
                      {dr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table list card */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/30 transition-colors cursor-pointer"
                    >
                      {/* Timestamp */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-450 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6.5 h-6.5 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 select-none">
                            {log.userInitials}
                          </div>
                          <span className="text-xs font-bold text-slate-900 leading-none mr-1">
                            {log.userName}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[8px] tracking-wide uppercase leading-none shadow-xs whitespace-nowrap",
                              getRoleBadgeClass(log.userRole)
                            )}
                          >
                            {log.userRole}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border leading-tight",
                            getActionBadgeClass(log.action)
                          )}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {log.description}
                      </td>

                      {/* IP Address */}
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs font-semibold text-slate-400">
                      No audit logs found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side Drawer Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSelectedLog(null)}
        >
          {/* Drawer Panel Container */}
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-950">Audit Log Detail</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Action Badge */}
              <div>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border",
                    getActionBadgeClass(selectedLog.action)
                  )}
                >
                  {selectedLog.action}
                </span>
              </div>

              {/* Attributes List */}
              <div className="divide-y divide-slate-100">
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-semibold text-slate-400">Log ID</span>
                  <span className="text-xs font-bold text-slate-900">#{selectedLog.id}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-semibold text-slate-400">Timestamp</span>
                  <span className="text-xs font-bold text-slate-900">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-semibold text-slate-400">Actor</span>
                  <span className="text-xs font-bold text-slate-900">
                    {getActorRoleString(selectedLog.userName, selectedLog.userRole)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-semibold text-slate-400">IP Address</span>
                  <span className="text-xs font-bold text-slate-950 font-mono">{selectedLog.ipAddress}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-semibold text-slate-400">Target</span>
                  <span className="text-xs font-bold text-slate-900 font-semibold">{selectedLog.target}</span>
                </div>
              </div>

              {/* Description Block */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-700 leading-relaxed">
                  {selectedLog.description}
                </div>
              </div>
            </div>

            {/* Cryptographic notice alert at bottom */}
            <div className="p-6 border-t border-slate-100">
              <div className="bg-emerald-50/50 border border-emerald-100/70 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-700 leading-relaxed">
                  This entry is immutable and cryptographically signed. It cannot be edited or deleted by any admin.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardChildrenLayout>
  )
}

export default AuditLogs
