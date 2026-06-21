"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Eye, Pencil, Trash2, UserPlus, Download, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface UserAccount {
  id: string
  name: string
  phone: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Surveyor' | 'Field Agent' | 'Supervisor' | 'Client'
  status: 'Active' | 'Suspended'
  created: string
  lastLogin: string
  requestsSubmitted: number
  parcelsRegistered: number
  recentActivity: { action: string; time: string }[]
}

const initialUsers: UserAccount[] = [
  {
    id: 'USR-001',
    name: 'Jean Alima',
    phone: '+237 677 001 002',
    email: 'j.alima@landsecure.cm',
    role: 'Super Admin',
    status: 'Active',
    created: '1 Jan 2024',
    lastLogin: '2 days ago',
    requestsSubmitted: 24,
    parcelsRegistered: 8,
    recentActivity: [
      { action: 'Submitted registration REG-1203', time: '2 days ago' },
      { action: 'Updated parcel CM-2847 details', time: '5 days ago' },
      { action: 'Logged in from mobile device', time: '1 week ago' }
    ]
  },
  {
    id: 'USR-002',
    name: 'Marie Nkodo',
    phone: '+237 654 123 456',
    email: 'm.nkodo@gov.cm',
    role: 'Admin',
    status: 'Active',
    created: '15 Feb 2024',
    lastLogin: '1 hour ago',
    requestsSubmitted: 15,
    parcelsRegistered: 4,
    recentActivity: [
      { action: 'Approved registration REG-1199', time: '1 day ago' },
      { action: 'Updated status of parcel CM-2849', time: '3 days ago' }
    ]
  },
  {
    id: 'USR-003',
    name: 'Paul Biya Jr',
    phone: '+237 699 234 567',
    email: 'p.biya@survey.cm',
    role: 'Surveyor',
    status: 'Active',
    created: '3 Mar 2024',
    lastLogin: '4 hours ago',
    requestsSubmitted: 32,
    parcelsRegistered: 12,
    recentActivity: [
      { action: 'Uploaded GIS data for REG-1202', time: '4 hours ago' },
      { action: 'Completed boundary survey for REG-1197', time: '2 days ago' }
    ]
  },
  {
    id: 'USR-004',
    name: 'Grace Tanda',
    phone: '+237 677 345 678',
    email: 'g.tanda@field.cm',
    role: 'Field Agent',
    status: 'Active',
    created: '20 Apr 2024',
    lastLogin: 'Yesterday',
    requestsSubmitted: 18,
    parcelsRegistered: 6,
    recentActivity: [
      { action: 'Verified identity for REG-1201 applicant', time: 'Yesterday' },
      { action: 'Collected field photos for CM-2850', time: '4 days ago' }
    ]
  },
  {
    id: 'USR-005',
    name: 'Samuel Kotto',
    phone: '+237 699 456 789',
    email: 's.kotto@landsecure.cm',
    role: 'Supervisor',
    status: 'Active',
    created: '5 May 2024',
    lastLogin: '3 days ago',
    requestsSubmitted: 22,
    parcelsRegistered: 9,
    recentActivity: [
      { action: 'Assigned surveyor Paul Biya Jr to REG-1203', time: '3 days ago' },
      { action: 'Reviewed dispute log for CM-2848', time: '1 week ago' }
    ]
  },
  {
    id: 'USR-006',
    name: 'Amina Fouda',
    phone: '+237 654 567 890',
    email: 'amina.fouda@gmail.com',
    role: 'Client',
    status: 'Suspended',
    created: '12 Jun 2024',
    lastLogin: '2 weeks ago',
    requestsSubmitted: 4,
    parcelsRegistered: 1,
    recentActivity: [
      { action: 'Submitted support ticket #481', time: '2 weeks ago' }
    ]
  },
  {
    id: 'USR-007',
    name: 'François Ngono',
    phone: '+237 677 678 901',
    email: 'f.ngono@client.cm',
    role: 'Client',
    status: 'Active',
    created: '30 Jun 2024',
    lastLogin: '3 hours ago',
    requestsSubmitted: 2,
    parcelsRegistered: 1,
    recentActivity: [
      { action: 'Checked progress of registration REG-1199', time: '3 hours ago' }
    ]
  },
  {
    id: 'USR-008',
    name: 'Halima Bello',
    phone: '+237 699 789 012',
    email: 'h.bello@gov.cm',
    role: 'Admin',
    status: 'Active',
    created: '14 Aug 2024',
    lastLogin: 'Just now',
    requestsSubmitted: 10,
    parcelsRegistered: 3,
    recentActivity: [
      { action: 'Logged in from desktop browser', time: 'Just now' },
      { action: 'Archived draft logs', time: '1 day ago' }
    ]
  }
]

interface CustomFilterDropdownProps {
  label: string
  header: string
  options: string[]
  selected: string
  onSelect: (val: string) => void
}

const CustomFilterDropdown = ({
  label,
  header,
  options,
  selected,
  onSelect
}: CustomFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all cursor-pointer w-40 sm:w-44 leading-relaxed"
      >
        <span className="truncate">{selected === 'All' || selected === 'Date Range' ? label : selected}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="bg-blue-600 text-white px-4 py-2 text-xs font-bold text-center border-b border-blue-400/20 tracking-wider uppercase">
            {header}
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelect(opt)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors",
                  selected === opt && "bg-slate-50 text-blue-600 font-bold"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Modals / Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editUserModalData, setEditUserModalData] = useState<UserAccount | null>(null)
  const [activeDrawerUser, setActiveDrawerUser] = useState<UserAccount | null>(null)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleRoleChange = (val: string) => {
    setRoleFilter(val)
    setCurrentPage(1)
  }
  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }
  const handleDateChange = (val: string) => {
    setDateFilter(val)
    setCurrentPage(1)
  }

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter

    let matchesDate = true
    if (dateFilter === 'This Week') {
      matchesDate = u.created.includes('2024')
    } else if (dateFilter === 'This Month') {
      matchesDate = u.created.includes('2024')
    }

    return matchesSearch && matchesRole && matchesStatus && matchesDate
  })

  // Pagination calculations
  const totalEntries = filteredUsers.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleCreateUser = (newUser: Omit<UserAccount, 'id' | 'created' | 'lastLogin' | 'requestsSubmitted' | 'parcelsRegistered' | 'recentActivity'>) => {
    const created: UserAccount = {
      ...newUser,
      id: `USR-00${users.length + 1}`,
      created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastLogin: 'Never logged in',
      requestsSubmitted: 0,
      parcelsRegistered: 0,
      recentActivity: []
    }
    setUsers([created, ...users])
    setIsAddModalOpen(false)
  }

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
    setEditUserModalData(null)
    if (activeDrawerUser && activeDrawerUser.id === updatedUser.id) {
      setActiveDrawerUser(updatedUser)
    }
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user account?')) {
      setUsers(users.filter(u => u.id !== id))
      setActiveDrawerUser(null)
    }
  }

  const handleToggleSuspend = (user: UserAccount) => {
    const updated: UserAccount = {
      ...user,
      status: user.status === 'Active' ? 'Suspended' : 'Active'
    }
    setUsers(users.map(u => u.id === user.id ? updated : u))
    if (activeDrawerUser && activeDrawerUser.id === user.id) {
      setActiveDrawerUser(updated)
    }
  }

  return (
    <DashboardChildrenLayout title="User Management" subtitle="Manage admin and client user accounts">
      
      {/* Split Layout Container */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Main Table Panel */}
        <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerUser ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
          
          {/* Action / Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
              
              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search parcels..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold leading-relaxed"
                />
              </div>

              {/* Roles dropdown */}
              <CustomFilterDropdown
                label="All Roles"
                header="All Roles"
                options={['All', 'Super Admin', 'Admin', 'Surveyor', 'Field Agent', 'Supervisor', 'Client']}
                selected={roleFilter}
                onSelect={handleRoleChange}
              />

              {/* Statuses dropdown */}
              <CustomFilterDropdown
                label="All Statuses"
                header="All Statuses"
                options={['All', 'Active', 'Suspended']}
                selected={statusFilter}
                onSelect={handleStatusChange}
              />

              {/* Date Range dropdown */}
              <CustomFilterDropdown
                label="Date Range"
                header="Date Range"
                options={['Date Range', 'This Week', 'This Month', 'This Year']}
                selected={dateFilter}
                onSelect={handleDateChange}
              />

            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end shrink-0">
              <button
                onClick={() => alert('Exporting users data as CSV...')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Phone</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Email</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Role</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Created</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
                    const isSelected = activeDrawerUser?.id === user.id
                    return (
                      <tr 
                        key={user.id} 
                        className={cn(
                          "hover:bg-slate-50/20 transition-colors cursor-pointer",
                          isSelected && "bg-blue-50/25"
                        )}
                        onClick={() => setActiveDrawerUser(user)}
                      >
                        {/* Name with initials avatar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-bold text-slate-900 leading-tight">{user.name}</span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {user.phone}
                        </td>

                        {/* Email */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-650">
                          {user.email}
                        </td>

                        {/* Role Badges */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[10px] font-bold text-white shadow-sm whitespace-nowrap",
                              user.role === 'Super Admin' && 'bg-slate-900',
                              user.role === 'Admin' && 'bg-blue-500',
                              user.role === 'Surveyor' && 'bg-indigo-600',
                              user.role === 'Field Agent' && 'bg-orange-500',
                              user.role === 'Supervisor' && 'bg-emerald-700',
                              user.role === 'Client' && 'bg-slate-500'
                            )}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border",
                              user.status === 'Active' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                              user.status === 'Suspended' && 'bg-rose-50 text-rose-600 border-rose-100'
                            )}
                          >
                            {user.status}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-400">
                          {user.created}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Eye */}
                            <button
                              onClick={() => setActiveDrawerUser(user)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Pencil */}
                            <button
                              onClick={() => setEditUserModalData(user)}
                              className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                              title="Edit User"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Key / Suspend toggle */}
                            <button
                              onClick={() => handleToggleSuspend(user)}
                              className="text-amber-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50/50 transition-colors cursor-pointer"
                              title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>

                            {/* Trash Delete */}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                      No accounts found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalEntries={totalEntries}
            pageSize={pageSize}
          />

        </div>

        {/* User Profile Side Panel Drawer */}
        {activeDrawerUser && (
          <UserProfileDrawer
            user={activeDrawerUser}
            onClose={() => setActiveDrawerUser(null)}
            onEdit={(u) => setEditUserModalData(u)}
            onToggleSuspend={handleToggleSuspend}
            onDelete={handleDeleteUser}
          />
        )}

      </div>

      {/* Create New User Modal */}
      {isAddModalOpen && (
        <CreateUserModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* Edit User Modal */}
      {editUserModalData && (
        <EditUserModal
          user={editUserModalData}
          onClose={() => setEditUserModalData(null)}
          onSubmit={handleUpdateUser}
        />
      )}

    </DashboardChildrenLayout>
  )
}

// User Profile Drawer panel component
interface UserProfileDrawerProps {
  user: UserAccount
  onClose: () => void
  onEdit: (u: UserAccount) => void
  onToggleSuspend: (u: UserAccount) => void
  onDelete: (id: string) => void
}

const UserProfileDrawer = ({
  user,
  onClose,
  onEdit,
  onToggleSuspend,
  onDelete
}: UserProfileDrawerProps) => {
  return (
    <div className="w-full lg:w-[39%] shrink-0 border border-slate-100 bg-white rounded-2xl shadow-xl overflow-hidden p-6 animate-in slide-in-from-right duration-300 relative flex flex-col max-h-[85vh] sticky top-20">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Drawer Title */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">User Profile</h3>
      </div>

      {/* Profile Header section */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow select-none">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h4 className="text-base font-bold text-slate-900 mt-1">{user.name}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white bg-slate-900 shadow-sm">
            {user.role}
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded text-[10px] font-bold border",
              user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
            )}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Profile Details Cards */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
        
        {/* Contact info list */}
        <div className="space-y-3.5 text-xs font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Email</span>
            <span className="text-slate-700 font-bold">{user.email}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Phone</span>
            <span className="text-slate-700 font-bold">{user.phone}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Account Created</span>
            <span className="text-slate-700 font-bold">{user.created}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Last Login</span>
            <span className="text-slate-700 font-bold">{user.lastLogin}</span>
          </div>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-blue-50/40 border border-blue-100/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-blue-600 font-mono">{user.requestsSubmitted}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Requests Submitted</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-slate-700 font-mono">{user.parcelsRegistered}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Parcels Registered</p>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-900">Recent Activity</h5>
          <div className="space-y-3 border-l border-slate-100 pl-4 py-1 relative">
            {user.recentActivity.length > 0 ? (
              user.recentActivity.map((act, idx) => (
                <div key={idx} className="relative text-xs leading-relaxed space-y-0.5">
                  {/* Small absolute circle dot on timeline */}
                  <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white" />
                  <p className="font-semibold text-slate-700">{act.action}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{act.time}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-semibold italic">No recent activity logs.</p>
            )}
          </div>
        </div>

      </div>

      {/* Drawer Action buttons footer */}
      <div className="pt-4 border-t border-slate-100 flex gap-2.5">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold text-xs hover:bg-emerald-100 transition-all cursor-pointer text-center"
        >
          Edit User
        </button>
        <button
          onClick={() => onToggleSuspend(user)}
          className="flex-1 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer text-center"
        >
          {user.status === 'Active' ? 'Suspend' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs hover:bg-red-100 transition-all cursor-pointer text-center"
        >
          Delete
        </button>
      </div>

    </div>
  )
}

// Create User Modal component
interface CreateUserModalProps {
  onClose: () => void
  onSubmit: (data: Omit<UserAccount, 'id' | 'created' | 'lastLogin' | 'requestsSubmitted' | 'parcelsRegistered' | 'recentActivity'>) => void
}

const CreateUserModal = ({ onClose, onSubmit }: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'Admin' as UserAccount['role'],
    status: 'Active' as UserAccount['status']
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      alert('Please fill out all required fields.')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Create New User</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Jean Alima"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Phone</label>
            <input
              type="text"
              name="phone"
              required
              placeholder="+237 6XX XXX XXX"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@domain.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            >
              {['Super Admin', 'Admin', 'Surveyor', 'Field Agent', 'Supervisor', 'Client'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Account Status Toggle Switch styled like screenshot */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-bold text-slate-700">Account Status: {formData.status}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Suspended' })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer text-center"
            >
              Create User
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Edit User Modal component
interface EditUserModalProps {
  user: UserAccount
  onClose: () => void
  onSubmit: (data: UserAccount) => void
}

const EditUserModal = ({ user, onClose, onSubmit }: EditUserModalProps) => {
  const [formData, setFormData] = useState<UserAccount>({ ...user })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Please fill out all required fields.')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Jean Alima"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Phone</label>
            <input
              type="text"
              name="phone"
              required
              placeholder="+237 6XX XXX XXX"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@domain.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            >
              {['Super Admin', 'Admin', 'Surveyor', 'Field Agent', 'Supervisor', 'Client'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Account Status Toggle Switch styled like screenshot */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-bold text-slate-700">Account Status: {formData.status}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Suspended' })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default UsersPage
