"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Eye, Pencil, Trash2, Download, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface Consultation {
  id: string
  clientName: string
  phone: string
  email: string
  subject: 'Boundary Dispute' | 'Title Transfer' | 'GIS Alignment' | 'Document Authentication' | 'General Inquiry'
  dateTime: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  assignedOfficer: string
  notes: string
}

const initialConsultations: Consultation[] = [
  {
    id: 'CON-4120',
    clientName: 'Samuel Kotto',
    phone: '+237 699 456 789',
    email: 's.kotto@landsecure.cm',
    subject: 'Boundary Dispute',
    dateTime: '22 Jun 2026, 10:00 AM',
    status: 'Scheduled',
    assignedOfficer: 'Marie Nkodo',
    notes: 'Needs review of the physical survey report and GIS coordinates alignment on the Akwa plot boundary.'
  },
  {
    id: 'CON-4119',
    clientName: 'François Ngono',
    phone: '+237 677 678 901',
    email: 'f.ngono@client.cm',
    subject: 'Title Transfer',
    dateTime: '20 Jun 2026, 02:30 PM',
    status: 'Completed',
    assignedOfficer: 'Jean Alima',
    notes: 'Completed transfer verification. All documents are verified and ready for registry entry publication.'
  },
  {
    id: 'CON-4118',
    clientName: 'Amina Fouda',
    phone: '+237 654 567 890',
    email: 'amina.fouda@gmail.com',
    subject: 'GIS Alignment',
    dateTime: '19 Jun 2026, 11:15 AM',
    status: 'Completed',
    assignedOfficer: 'Paul Biya Jr',
    notes: 'Adjusted Bastos plot boundary overlays in QField. Coordinates verified successfully.'
  },
  {
    id: 'CON-4117',
    clientName: 'Grace Tanda',
    phone: '+237 677 345 678',
    email: 'g.tanda@field.cm',
    subject: 'General Inquiry',
    dateTime: '18 Jun 2026, 09:00 AM',
    status: 'Cancelled',
    assignedOfficer: 'Sarah Ngono',
    notes: 'Client cancelled due to scheduling conflicts. Requested rescheduling via email.'
  },
  {
    id: 'CON-4116',
    clientName: 'Pierre Mballa',
    phone: '+237 670 111 222',
    email: 'pierre.mballa@yahoo.com',
    subject: 'Document Authentication',
    dateTime: '15 Jun 2026, 04:00 PM',
    status: 'Completed',
    assignedOfficer: 'Marie Nkodo',
    notes: 'National ID card and local sale agreement verified. Approved for step progress.'
  },
  {
    id: 'CON-4115',
    clientName: 'Halima Bello',
    phone: '+237 699 789 012',
    email: 'h.bello@gov.cm',
    subject: 'Title Transfer',
    dateTime: '12 Jun 2026, 01:30 PM',
    status: 'Completed',
    assignedOfficer: 'Jean Alima',
    notes: 'Reviewed registration deed transfer logs. File sent to regional archives.'
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

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('Date Range')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Modals / Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editConsultationData, setEditConsultationData] = useState<Consultation | null>(null)
  const [activeDrawerConsultation, setActiveDrawerConsultation] = useState<Consultation | null>(null)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleSubjectChange = (val: string) => {
    setSubjectFilter(val)
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
  const filteredConsultations = consultations.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = subjectFilter === 'All' || c.subject === subjectFilter
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter

    let matchesDate = true
    if (dateFilter === 'This Week') {
      matchesDate = c.dateTime.includes('Jun 2026')
    } else if (dateFilter === 'This Month') {
      matchesDate = c.dateTime.includes('Jun 2026')
    }

    return matchesSearch && matchesSubject && matchesStatus && matchesDate
  })

  // Pagination calculations
  const totalEntries = filteredConsultations.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedConsultations = filteredConsultations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleCreateConsultation = (newCons: Omit<Consultation, 'id'>) => {
    const created: Consultation = {
      ...newCons,
      id: `CON-${4120 + consultations.length + 1}`
    }
    setConsultations([created, ...consultations])
    setIsAddModalOpen(false)
  }

  const handleUpdateConsultation = (updatedCons: Consultation) => {
    setConsultations(consultations.map(c => c.id === updatedCons.id ? updatedCons : c))
    setEditConsultationData(null)
    if (activeDrawerConsultation && activeDrawerConsultation.id === updatedCons.id) {
      setActiveDrawerConsultation(updatedCons)
    }
  }

  const handleDeleteConsultation = (id: string) => {
    if (confirm('Are you sure you want to delete this consultation record?')) {
      setConsultations(consultations.filter(c => c.id !== id))
      setActiveDrawerConsultation(null)
    }
  }

  const handleStatusTransition = (cons: Consultation, newStatus: Consultation['status']) => {
    const updated: Consultation = {
      ...cons,
      status: newStatus
    }
    setConsultations(consultations.map(c => c.id === cons.id ? updated : c))
    if (activeDrawerConsultation && activeDrawerConsultation.id === cons.id) {
      setActiveDrawerConsultation(updated)
    }
  }

  return (
    <DashboardChildrenLayout title="Consultations" subtitle="Schedule and manage client consultation inquiries">
      
      {/* Split Layout Container */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Main Table Panel */}
        <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerConsultation ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
          
          {/* Action / Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
              
              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search consultations..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold leading-relaxed"
                />
              </div>

              {/* Subject dropdown */}
              <CustomFilterDropdown
                label="All Topics"
                header="All Topics"
                options={['All', 'Boundary Dispute', 'Title Transfer', 'GIS Alignment', 'Document Authentication', 'General Inquiry']}
                selected={subjectFilter}
                onSelect={handleSubjectChange}
              />

              {/* Statuses dropdown */}
              <CustomFilterDropdown
                label="All Statuses"
                header="All Statuses"
                options={['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled']}
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
                onClick={() => alert('Exporting consultations data as CSV...')}
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
                <span>Schedule Consultation</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Consultation ID</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Client Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Subject / Topic</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Date & Time</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Assigned Officer</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedConsultations.length > 0 ? (
                  paginatedConsultations.map((cons) => {
                    const isSelected = activeDrawerConsultation?.id === cons.id
                    return (
                      <tr 
                        key={cons.id} 
                        className={cn(
                          "hover:bg-slate-50/20 transition-colors cursor-pointer",
                          isSelected && "bg-blue-50/25"
                        )}
                        onClick={() => setActiveDrawerConsultation(cons)}
                      >
                        {/* ID */}
                        <td className="py-4 px-4 text-sm font-bold text-blue-600 font-mono">
                          {cons.id}
                        </td>

                        {/* Client Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {cons.clientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-bold text-slate-900 leading-tight">{cons.clientName}</span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {cons.subject}
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-650">
                          {cons.dateTime}
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap",
                              cons.status === 'Scheduled' && 'bg-blue-50 text-blue-600 border-blue-100',
                              cons.status === 'In Progress' && 'bg-amber-50 text-amber-600 border-amber-100',
                              cons.status === 'Completed' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                              cons.status === 'Cancelled' && 'bg-slate-55 text-slate-500 border-slate-200'
                            )}
                          >
                            {cons.status}
                          </span>
                        </td>

                        {/* Assigned Officer */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {cons.assignedOfficer}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View */}
                            <button
                              onClick={() => setActiveDrawerConsultation(cons)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => setEditConsultationData(cons)}
                              className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors cursor-pointer"
                              title="Edit Record"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Trash */}
                            <button
                              onClick={() => handleDeleteConsultation(cons.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
                              title="Delete Record"
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
                      No consultation records found matching your search.
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

        {/* Side Panel Drawer */}
        {activeDrawerConsultation && (
          <ConsultationDetailsDrawer
            consultation={activeDrawerConsultation}
            onClose={() => setActiveDrawerConsultation(null)}
            onEdit={(c) => setEditConsultationData(c)}
            onStatusTransition={handleStatusTransition}
            onDelete={handleDeleteConsultation}
          />
        )}

      </div>

      {/* Schedule Consultation Modal */}
      {isAddModalOpen && (
        <CreateConsultationModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateConsultation}
        />
      )}

      {/* Edit Consultation Modal */}
      {editConsultationData && (
        <EditConsultationModal
          consultation={editConsultationData}
          onClose={() => setEditConsultationData(null)}
          onSubmit={handleUpdateConsultation}
        />
      )}

    </DashboardChildrenLayout>
  )
}

// Side Drawer Details component
interface ConsultationDetailsDrawerProps {
  consultation: Consultation
  onClose: () => void
  onEdit: (c: Consultation) => void
  onStatusTransition: (c: Consultation, s: Consultation['status']) => void
  onDelete: (id: string) => void
}

const ConsultationDetailsDrawer = ({
  consultation,
  onClose,
  onEdit,
  onStatusTransition,
  onDelete
}: ConsultationDetailsDrawerProps) => {
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
        <h3 className="text-lg font-bold text-slate-900">Consultation Details</h3>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow select-none">
          {consultation.clientName.split(' ').map(n => n[0]).join('')}
        </div>
        <h4 className="text-base font-bold text-slate-900 mt-1">{consultation.clientName}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white bg-slate-900 shadow-sm">
            {consultation.id}
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded text-[10px] font-bold border",
              consultation.status === 'Scheduled' && 'bg-blue-50 text-blue-650 border-blue-100',
              consultation.status === 'In Progress' && 'bg-amber-50 text-amber-650 border-amber-100',
              consultation.status === 'Completed' && 'bg-emerald-50 text-emerald-650 border-emerald-100',
              consultation.status === 'Cancelled' && 'bg-slate-50 text-slate-500 border-slate-200'
            )}
          >
            {consultation.status}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
        
        <div className="space-y-3.5 text-xs font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Topic / Subject</span>
            <span className="text-slate-700 font-bold">{consultation.subject}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Phone</span>
            <span className="text-slate-700 font-bold">{consultation.phone}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Email Address</span>
            <span className="text-slate-700 font-bold">{consultation.email}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Date & Time</span>
            <span className="text-slate-700 font-bold">{consultation.dateTime}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Assigned Officer</span>
            <span className="text-slate-700 font-bold">{consultation.assignedOfficer}</span>
          </div>
        </div>

        {/* Notes Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">Consultation Notes</h5>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">{consultation.notes}</p>
        </div>

      </div>

      {/* Actions Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        {consultation.status === 'Scheduled' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusTransition(consultation, 'In Progress')}
              className="flex-1 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer text-center"
            >
              Start Session
            </button>
            <button
              onClick={() => onStatusTransition(consultation, 'Cancelled')}
              className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer text-center"
            >
              Cancel Appt
            </button>
          </div>
        )}

        {consultation.status === 'In Progress' && (
          <button
            onClick={() => onStatusTransition(consultation, 'Completed')}
            className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-950 transition-all cursor-pointer text-center"
          >
            Mark as Completed
          </button>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => onEdit(consultation)}
            className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[11px] hover:bg-slate-100 transition-all cursor-pointer text-center"
          >
            Edit Record
          </button>
          <button
            onClick={() => onDelete(consultation.id)}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-650 border border-red-100 font-bold text-[11px] hover:bg-red-100 transition-all cursor-pointer text-center"
          >
            Delete
          </button>
        </div>
      </div>

    </div>
  )
}

// Create Modal
interface CreateConsultationModalProps {
  onClose: () => void
  onSubmit: (data: Omit<Consultation, 'id'>) => void
}

const CreateConsultationModal = ({ onClose, onSubmit }: CreateConsultationModalProps) => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    subject: 'Boundary Dispute' as Consultation['subject'],
    dateTime: '',
    status: 'Scheduled' as Consultation['status'],
    assignedOfficer: 'Marie Nkodo',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName || !formData.phone || !formData.email || !formData.dateTime) {
      alert('Please fill out all required fields.')
      return
    }

    // Format datetime string nicely
    const dateFormatted = new Date(formData.dateTime).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    onSubmit({
      ...formData,
      dateTime: dateFormatted
    })
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

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Schedule Consultation</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Client Full Name</label>
            <input
              type="text"
              name="clientName"
              required
              placeholder="e.g. Samuel Kotto"
              value={formData.clientName}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="client@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Subject / Topic</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            >
              {['Boundary Dispute', 'Title Transfer', 'GIS Alignment', 'Document Authentication', 'General Inquiry'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Date & Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                required
                value={formData.dateTime}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold text-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Assigned Officer</label>
              <select
                name="assignedOfficer"
                value={formData.assignedOfficer}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Marie Nkodo', 'Jean Alima', 'Paul Biya Jr', 'Sarah Ngono'].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes / Remarks</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Additional comments or summary..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* Action Buttons */}
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
              Schedule
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// Edit Modal
interface EditConsultationModalProps {
  consultation: Consultation
  onClose: () => void
  onSubmit: (data: Consultation) => void
}

const EditConsultationModal = ({ consultation, onClose, onSubmit }: EditConsultationModalProps) => {
  const [formData, setFormData] = useState<Consultation>({ ...consultation })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName || !formData.phone || !formData.email || !formData.dateTime) {
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

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Edit Consultation</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Client Full Name</label>
            <input
              type="text"
              name="clientName"
              required
              placeholder="e.g. Samuel Kotto"
              value={formData.clientName}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="client@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Subject / Topic</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
            >
              {['Boundary Dispute', 'Title Transfer', 'GIS Alignment', 'Document Authentication', 'General Inquiry'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Date & Time</label>
              <input
                type="text"
                name="dateTime"
                required
                value={formData.dateTime}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold text-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Assigned Officer</label>
              <select
                name="assignedOfficer"
                value={formData.assignedOfficer}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all font-semibold"
              >
                {['Marie Nkodo', 'Jean Alima', 'Paul Biya Jr', 'Sarah Ngono'].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes / Remarks</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Additional comments or summary..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
            />
          </div>

          {/* Action Buttons */}
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

export default ConsultationsPage
