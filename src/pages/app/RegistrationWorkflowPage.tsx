"use client"
import React, { useState, useEffect, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Plus, Search, Eye, X, Upload, CheckCircle2, AlertCircle, FileText, Calendar, MapPin, Phone, User, Landmark, ChevronDown, Check, Map, Compass, UserCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomPagination from '@/components/shared/CustomPagination'

export interface Registration {
  id: string
  applicant: string
  nationalId: string
  phone: string
  city: string
  district: string
  submitted: string
  currentStep: number // 1-7
  status: 'In Progress' | 'Completed' | 'Pending' | 'Rejected'
  area: number
  notes: string
  documents?: string[]
  surveyor?: string
  fieldVisitDate?: string
  gisDataConfirmed?: boolean
}

const initialRegistrations: Registration[] = [
  {
    id: 'REG-1203',
    applicant: 'Pierre Mballa',
    nationalId: 'NI-12847291',
    phone: '+237 677 889 900',
    city: 'Yaoundé',
    district: 'Bastos',
    submitted: '10 Jun 2025',
    currentStep: 3,
    status: 'In Progress',
    area: 1240,
    notes: 'Standard boundary verification for commercial plot.',
    documents: ['Land_Title_Draft.pdf'],
    surveyor: '',
    fieldVisitDate: '',
    gisDataConfirmed: false
  },
  {
    id: 'REG-1202',
    applicant: 'Amina Fouda',
    nationalId: 'NI-98374821',
    phone: '+237 655 443 322',
    city: 'Douala',
    district: 'Bonanjo',
    submitted: '8 Jun 2025',
    currentStep: 6,
    status: 'In Progress',
    area: 3500,
    notes: 'GIS coordinates upload complete. Awaiting final registrar sign-off.',
    documents: ['Survey_Coords.jpg', 'ID_Card.pdf'],
    surveyor: 'Paul Biya Jr',
    fieldVisitDate: '2025-06-12T10:00',
    gisDataConfirmed: true
  },
  {
    id: 'REG-1201',
    applicant: 'Grace Tanda',
    nationalId: 'NI-84729103',
    phone: '+237 680 554 433',
    city: 'Bamenda',
    district: 'Ntarikon',
    submitted: '5 Jun 2025',
    currentStep: 7,
    status: 'Completed',
    area: 2100,
    notes: 'Registration complete. Title deeds printed and dispatched.',
    documents: ['Final_Title_Bamenda.pdf'],
    surveyor: 'Sarah Ngono',
    fieldVisitDate: '2025-06-08T14:30',
    gisDataConfirmed: true
  },
  {
    id: 'REG-1200',
    applicant: 'Samuel Kotto',
    nationalId: 'NI-73920194',
    phone: '+237 678 123 456',
    city: 'Douala',
    district: 'Akwa',
    submitted: '1 Jun 2025',
    currentStep: 2,
    status: 'Pending',
    area: 750,
    notes: 'Application received. Document audit in queue.',
    documents: ['Akwa_Strip_Layout.png'],
    surveyor: '',
    fieldVisitDate: '',
    gisDataConfirmed: false
  },
  {
    id: 'REG-1199',
    applicant: 'François Ngono',
    nationalId: 'NI-10492847',
    phone: '+237 670 112 233',
    city: 'Bafoussam',
    district: 'Hauts-Plateaux',
    submitted: '28 May 2025',
    currentStep: 4,
    status: 'In Progress',
    area: 1650,
    notes: 'Site inspection scheduled for Bafoussam agri-zone.',
    documents: ['Inspection_Plan.pdf'],
    surveyor: 'Marc Kotto',
    fieldVisitDate: '',
    gisDataConfirmed: false
  },
  {
    id: 'REG-1198',
    applicant: 'Halima Bello',
    nationalId: 'NI-48201938',
    phone: '+237 612 345 678',
    city: 'Garoua',
    district: 'Nord',
    submitted: '25 May 2025',
    currentStep: 1,
    status: 'Rejected',
    area: 4200,
    notes: 'Missing required national identity proof document.',
    documents: [],
    surveyor: '',
    fieldVisitDate: '',
    gisDataConfirmed: false
  },
  {
    id: 'REG-1197',
    applicant: 'Ibrahim Alioum',
    nationalId: 'NI-28492019',
    phone: '+237 667 788 991',
    city: 'Maroua',
    district: 'Kaélé',
    submitted: '20 May 2025',
    currentStep: 5,
    status: 'In Progress',
    area: 5600,
    notes: 'Deed registration tax verification completed.',
    documents: ['Tax_Receipt.pdf', 'Kaele_Survey_Map.jpg'],
    surveyor: 'Paul Biya Jr',
    fieldVisitDate: '2025-05-28T09:00',
    gisDataConfirmed: false
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
        <span className="truncate">{selected === 'All' ? label : selected}</span>
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

const RegistrationWorkflowPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations)
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [stepFilter, setStepFilter] = useState('All')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Modals / Drawer State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [activeDrawerReg, setActiveDrawerReg] = useState<Registration | null>(null)
  const [gisModalReg, setGisModalReg] = useState<Registration | null>(null)

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleCityChange = (val: string) => {
    setCityFilter(val)
    setCurrentPage(1)
  }
  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }
  const handleStepChange = (val: string) => {
    setStepFilter(val)
    setCurrentPage(1)
  }

  // Filter registrations
  const filteredRegs = registrations.filter((reg) => {
    const matchesSearch =
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.district.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCity = cityFilter === 'All' || reg.city === cityFilter
    const matchesStatus = statusFilter === 'All' || reg.status === statusFilter
    const matchesStep = stepFilter === 'All' || `Step ${reg.currentStep}/7` === stepFilter

    return matchesSearch && matchesCity && matchesStatus && matchesStep
  })

  // Pagination calculations
  const totalEntries = filteredRegs.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const paginatedRegs = filteredRegs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleAddNewReg = (newReg: Omit<Registration, 'id' | 'submitted' | 'currentStep' | 'status'>) => {
    const nextId = `REG-${1200 + registrations.length + 4}`
    const createdReg: Registration = {
      ...newReg,
      id: nextId,
      submitted: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      currentStep: 1,
      status: 'Pending',
      surveyor: '',
      fieldVisitDate: '',
      gisDataConfirmed: false
    }
    setRegistrations([createdReg, ...registrations])
    setIsNewModalOpen(false)
  }

  const handleUpdateRegWorkflow = (updatedReg: Registration) => {
    setRegistrations(registrations.map(r => r.id === updatedReg.id ? updatedReg : r))
    if (activeDrawerReg && activeDrawerReg.id === updatedReg.id) {
      setActiveDrawerReg(updatedReg)
    }
  }

  return (
    <DashboardChildrenLayout title="Registration Workflow" subtitle="Track and process land registration requests">
      
      {/* Split Layout Container */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Main Content Area (Table list) */}
        <div className={cn("flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 transition-all duration-300", activeDrawerReg ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full")}>
          
          {/* Action / Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
              
              {/* Search Input */}
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

              {/* City Filter */}
              <CustomFilterDropdown
                label="All Cities"
                header="All Cities"
                options={['All', 'Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua']}
                selected={cityFilter}
                onSelect={handleCityChange}
              />

              {/* Status Filter */}
              <CustomFilterDropdown
                label="All Statuses"
                header="All Statuses"
                options={['All', 'In Progress', 'Completed', 'Pending', 'Rejected']}
                selected={statusFilter}
                onSelect={handleStatusChange}
              />

              {/* Steps Filter */}
              <CustomFilterDropdown
                label="All Steps"
                header="All Steps"
                options={['All', 'Step 1/7', 'Step 2/7', 'Step 3/7', 'Step 4/7', 'Step 5/7', 'Step 6/7', 'Step 7/7']}
                selected={stepFilter}
                onSelect={handleStepChange}
              />

            </div>

            {/* New Registration Button */}
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm w-full lg:w-auto shrink-0"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>New Registration</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Registration ID</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Applicant</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">City / District</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Submitted</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Current Step</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedRegs.length > 0 ? (
                  paginatedRegs.map((reg) => {
                    const isSelected = activeDrawerReg?.id === reg.id
                    return (
                      <tr 
                        key={reg.id} 
                        className={cn(
                          "hover:bg-slate-50/20 transition-colors cursor-pointer",
                          isSelected && "bg-blue-50/25 hover:bg-blue-50/40"
                        )}
                        onClick={() => setActiveDrawerReg(reg)}
                      >
                        {/* ID */}
                        <td className="py-4 px-4">
                          <button
                            type="button"
                            className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left outline-none cursor-pointer"
                          >
                            {reg.id}
                          </button>
                        </td>

                        {/* Applicant */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {reg.applicant}
                        </td>

                        {/* City / District */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                          {reg.city} / {reg.district}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-4 px-4 text-sm font-semibold text-slate-400">
                          {reg.submitted}
                        </td>

                        {/* Step indicator dashes matching the design */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-3 h-1 rounded-full transition-colors",
                                    i < reg.currentStep ? "bg-blue-600" : "bg-slate-200"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-slate-500">Step {reg.currentStep}/7</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded text-[11px] font-bold border",
                              reg.status === 'In Progress' && 'bg-blue-50 text-blue-600 border-blue-100',
                              reg.status === 'Completed' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                              reg.status === 'Pending' && 'bg-yellow-50 text-yellow-600 border-yellow-100',
                              reg.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100'
                            )}
                          >
                            {reg.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveDrawerReg(reg)}
                            className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                      No registration records found.
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

        {/* Side Workflow Drawer (Displays on right side when open) */}
        {activeDrawerReg && (
          <RegistrationWorkflowDrawer
            key={activeDrawerReg.id}
            registration={activeDrawerReg}
            onClose={() => setActiveDrawerReg(null)}
            onUpdate={handleUpdateRegWorkflow}
            onOpenGis={(reg) => setGisModalReg(reg)}
          />
        )}
      </div>

      {/* New Registration Modal */}
      {isNewModalOpen && (
        <NewRegistrationModal
          onClose={() => setIsNewModalOpen(false)}
          onSubmit={handleAddNewReg}
        />
      )}

      {/* GIS Map Modal */}
      {gisModalReg && (
        <GisViewModal
          registration={gisModalReg}
          onClose={() => setGisModalReg(null)}
          onConfirm={(reg) => {
            const updated = { ...reg, gisDataConfirmed: true, currentStep: 6, status: 'In Progress' as const }
            handleUpdateRegWorkflow(updated)
            setGisModalReg(null)
          }}
        />
      )}
    </DashboardChildrenLayout>
  )
}

// Side Workflow Drawer Component
interface RegistrationWorkflowDrawerProps {
  registration: Registration
  onClose: () => void
  onUpdate: (updated: Registration) => void
  onOpenGis: (reg: Registration) => void
}

const RegistrationWorkflowDrawer = ({
  registration,
  onClose,
  onUpdate,
  onOpenGis
}: RegistrationWorkflowDrawerProps) => {
  const [selectedStepTab, setSelectedStepTab] = useState<number>(registration.currentStep)
  const [noteText, setNoteText] = useState('')
  const [surveyorInput, setSurveyorInput] = useState(registration.surveyor || 'Paul Biya Jr')
  const [visitDateInput, setVisitDateInput] = useState(registration.fieldVisitDate || '')

  const steps = [
    { id: 1, label: 'Review Submission', desc: 'Step 1: Review Submission' },
    { id: 2, label: 'Verify Documnts', desc: 'Step 2: Verify Documents' },
    { id: 3, label: 'Assign Surveyor', desc: 'Step 3: Assign Surveyor' },
    { id: 4, label: 'Schedule Field Visit', desc: 'Step 4: Schedule Field Visit' },
    { id: 5, label: 'Receive GIS Data', desc: 'Step 5: Receive GIS Data' },
    { id: 6, label: 'Approve / Reject', desc: 'Step 6: Approve / Reject' },
    { id: 7, label: 'Publish Parcel', desc: 'Step 7: Publish Parcel' }
  ]

  const handleStepAction = () => {
    let nextStep = registration.currentStep
    let newStatus = registration.status

    if (registration.currentStep === 1) {
      nextStep = 2
      newStatus = 'In Progress'
    } else if (registration.currentStep === 2) {
      nextStep = 3
      newStatus = 'In Progress'
    } else if (registration.currentStep === 3) {
      if (!surveyorInput) {
        alert('Please select a surveyor.')
        return
      }
      nextStep = 4
      newStatus = 'In Progress'
    } else if (registration.currentStep === 4) {
      if (!visitDateInput) {
        alert('Please select a visit date.')
        return
      }
      nextStep = 5
      newStatus = 'In Progress'
    } else if (registration.currentStep === 5) {
      if (!registration.gisDataConfirmed) {
        alert('Please view the GIS data map and confirm it first.')
        return
      }
      nextStep = 6
      newStatus = 'In Progress'
    } else if (registration.currentStep === 6) {
      nextStep = 7
      newStatus = 'In Progress'
    } else if (registration.currentStep === 7) {
      nextStep = 7
      newStatus = 'Completed'
      alert('Land Registration has been published successfully!')
      onClose()
      return
    }

    const updated: Registration = {
      ...registration,
      currentStep: nextStep,
      status: newStatus,
      surveyor: surveyorInput,
      fieldVisitDate: visitDateInput,
      notes: noteText ? `${registration.notes}\n[Step ${registration.currentStep}]: ${noteText}` : registration.notes
    }

    onUpdate(updated)
    setNoteText('')
  }

  const handleReject = () => {
    const updated: Registration = {
      ...registration,
      status: 'Rejected',
      notes: noteText ? `${registration.notes}\n[Step ${registration.currentStep} Rejected]: ${noteText}` : registration.notes
    }
    onUpdate(updated)
    setNoteText('')
    alert('Registration request has been rejected.')
    onClose()
  }

  const isStepCompleted = (stepId: number) => stepId < registration.currentStep
  const isStepActive = (stepId: number) => stepId === registration.currentStep

  return (
    <div className="w-full lg:w-[39%] shrink-0 border border-slate-100 bg-white rounded-2xl shadow-xl overflow-hidden p-6 animate-in slide-in-from-right duration-300 relative flex flex-col max-h-[85vh] sticky top-20">
      
      {/* Close Drawer Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer z-10"
        title="Close details drawer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Drawer Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Registration {registration.id}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{registration.applicant} · {registration.city}, {registration.district}</p>
      </div>

      {/* User Info Card in Drawer Header */}
      <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 mb-5">
        <div className="flex items-center gap-3">
          {/* Circular avatar with Initials */}
          <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
            {registration.applicant.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{registration.applicant}</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Submitted {registration.submitted} · {registration.city}, {registration.district}</p>
          </div>
        </div>

        {/* Current status */}
        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border",
            registration.status === 'In Progress' && 'bg-blue-50 text-blue-600 border-blue-100',
            registration.status === 'Completed' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
            registration.status === 'Pending' && 'bg-yellow-50 text-yellow-600 border-yellow-100',
            registration.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100'
          )}
        >
          {registration.status}
        </span>
      </div>

      {/* Horizontal Stepper - Scrollable */}
      <div className="overflow-x-auto pb-4 mb-4 border-b border-slate-100 scrollbar-thin">
        <div className="flex items-center justify-between min-w-[650px] relative px-2">
          {/* Connector Line behind circles */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 z-0" />
          
          {steps.map((st, index) => {
            const completed = isStepCompleted(st.id)
            const active = isStepActive(st.id)
            const isTabActive = selectedStepTab === st.id

            return (
              <div 
                key={st.id} 
                className="flex flex-col items-center flex-1 z-10 cursor-pointer group"
                onClick={() => setSelectedStepTab(st.id)}
              >
                {/* Circle step indicator */}
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative border-2",
                    completed && "bg-blue-600 border-blue-600 text-white shadow-sm",
                    active && "bg-amber-500 border-amber-500 text-white shadow-md ring-4 ring-amber-100/50 scale-105",
                    (!completed && !active) && "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300",
                    isTabActive && !active && !completed && "border-blue-600 text-blue-600 scale-105"
                  )}
                >
                  {completed ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span>{st.id}</span>
                  )}
                </div>

                {/* Stepper Label */}
                <span 
                  className={cn(
                    "text-[8.5px] font-bold text-center mt-2 w-16 line-clamp-2 transition-colors",
                    isTabActive ? "text-slate-900 font-extrabold" : "text-slate-400",
                    active && "text-amber-600",
                    completed && "text-slate-600"
                  )}
                >
                  {st.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Viewed Step Details Panel */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">
            Step {selectedStepTab}: {steps[selectedStepTab - 1].label}
          </h4>
          <span 
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-semibold border",
              selectedStepTab < registration.currentStep && "bg-emerald-50 text-emerald-600 border-emerald-100",
              selectedStepTab === registration.currentStep && "bg-blue-50 text-blue-600 border-blue-100",
              selectedStepTab > registration.currentStep && "bg-slate-50 text-slate-400 border-slate-100"
            )}
          >
            {selectedStepTab < registration.currentStep ? "Completed" : selectedStepTab === registration.currentStep ? "In Progress" : "Pending"}
          </span>
        </div>

        {/* Step-specific layout rendering */}
        {selectedStepTab === 1 && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3.5">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Submission Details</h5>
              <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                <span className="text-slate-400 font-medium">Parcel Location</span>
                <span className="text-slate-700 font-bold text-right">{registration.city}, {registration.district}</span>

                <span className="text-slate-400 font-medium">Area Declared</span>
                <span className="text-slate-700 font-bold text-right font-mono">{registration.area.toLocaleString()} m²</span>

                <span className="text-slate-400 font-medium">Owner</span>
                <span className="text-slate-700 font-bold text-right">{registration.applicant}</span>
              </div>
            </div>
          </div>
        )}

        {selectedStepTab === 2 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">Verify documents uploaded by the applicant.</p>
            <div className="bg-white border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden">
              {(registration.documents && registration.documents.length > 0) ? (
                registration.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">{doc}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-semibold">
                  No files submitted.
                </div>
              )}
            </div>
          </div>
        )}

        {selectedStepTab === 3 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Select Surveyor</label>
            <select
              disabled={selectedStepTab !== registration.currentStep}
              value={surveyorInput}
              onChange={(e) => setSurveyorInput(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 font-semibold transition-all"
            >
              <option value="Paul Biya Jr">Paul Biya Jr</option>
              <option value="Sarah Ngono">Sarah Ngono</option>
              <option value="Marc Kotto">Marc Kotto</option>
            </select>
            {registration.surveyor && (
              <div className="bg-blue-50/40 border border-blue-100/50 rounded-xl p-3.5 text-xs text-blue-700 font-semibold flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Assigned surveyor: {registration.surveyor}</span>
              </div>
            )}
          </div>
        )}

        {selectedStepTab === 4 && (
          <div className="space-y-3.5">
            <label className="text-xs font-bold text-slate-700 block">Schedule Date & Time</label>
            <input
              type="datetime-local"
              disabled={selectedStepTab !== registration.currentStep}
              value={visitDateInput}
              onChange={(e) => setVisitDateInput(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 font-semibold text-slate-700 transition-all"
            />
            {registration.fieldVisitDate && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-600 font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Scheduled: {new Date(registration.fieldVisitDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        )}

        {selectedStepTab === 5 && (
          <div className="space-y-3.5">
            {registration.gisDataConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                <span>GIS boundary data confirmed. (24 points collected by Paul Biya Jr)</span>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2.5 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">QField Submission Received</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">24 GPS points collected by Paul Biya Jr</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenGis(registration)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                >
                  View on Map
                </button>
              </div>
            )}
          </div>
        )}

        {selectedStepTab === 6 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">Verify that the files, GIS coordinates, and survey outcomes are fully aligned before final registrar authorization.</p>
          </div>
        )}

        {selectedStepTab === 7 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">The registration deed is ready to be published to the public land register.</p>
          </div>
        )}

        {/* Optional Action Notes Form (Only visible when viewing the currently active step) */}
        {selectedStepTab === registration.currentStep && registration.status !== 'Completed' && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">Actions & Feedback Notes</label>
            <textarea
              rows={3}
              placeholder="Add notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 font-medium"
            />
          </div>
        )}
      </div>

      {/* Footer Drawer Action Buttons */}
      {selectedStepTab === registration.currentStep && registration.status !== 'Completed' && (
        <div className="pt-4 border-t border-slate-100 flex gap-3">
          {/* Reject button (shows at Step 6 or standard) */}
          {registration.currentStep === 6 && (
            <button
              onClick={handleReject}
              className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 text-xs transition-all cursor-pointer text-center"
            >
              Reject
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleStepAction}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-white font-bold text-xs transition-all cursor-pointer text-center",
              registration.currentStep === 7 ? "bg-emerald-800 hover:bg-emerald-950" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {registration.currentStep === 1 && "Mark as Reviewed"}
            {registration.currentStep === 2 && "Verify Documents"}
            {registration.currentStep === 3 && "Assign Surveyor"}
            {registration.currentStep === 4 && "Schedule Visit"}
            {registration.currentStep === 5 && "Confirm GIS Review"}
            {registration.currentStep === 6 && "Approve Registration"}
            {registration.currentStep === 7 && "Publish to Registry"}
          </button>
        </div>
      )}
    </div>
  )
}

// GIS View Map Modal (Popup Modal)
interface GisViewModalProps {
  registration: Registration
  onClose: () => void
  onConfirm: (reg: Registration) => void
}

const GisViewModal = ({ registration, onClose, onConfirm }: GisViewModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">GIS View — {registration.id}</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">QField data - 24 GPS points collected</p>
        </div>

        {/* Topographic Map Canvas SVG */}
        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-inner mb-4 select-none">
          <svg className="w-full h-80 bg-[#EBF3E8]" viewBox="0 0 400 300">
            {/* Grid Coordinates Lines */}
            <defs>
              <pattern id="gridPattern" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
            
            {/* Rivers / Lakes */}
            <path d="M 0,220 Q 80,180 180,240 T 400,200" fill="none" stroke="#C9DDF2" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
            <path d="M 0,220 Q 80,180 180,240 T 400,200" fill="none" stroke="#DCEAF6" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            
            {/* Roads */}
            <path d="M 50,0 Q 90,140 120,300" fill="none" stroke="#F6ECE1" strokeWidth="6" opacity="0.8" />
            <path d="M 50,0 Q 90,140 120,300" fill="none" stroke="#D5C5B5" strokeWidth="1.5" strokeDasharray="3 3" />
            
            <path d="M 0,90 H 400" fill="none" stroke="#F6ECE1" strokeWidth="5" opacity="0.8" />

            {/* Polygon Land Boundary shape */}
            <polygon 
              points="140,70 270,90 280,180 200,210 150,170" 
              fill="rgba(34, 197, 94, 0.15)" 
              stroke="#16A34A" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
            />
            
            {/* GPS Points nodes */}
            <circle cx="140" cy="70" r="4" fill="#16A34A" stroke="white" strokeWidth="1.5" />
            <circle cx="270" cy="90" r="4" fill="#16A34A" stroke="white" strokeWidth="1.5" />
            <circle cx="280" cy="180" r="4" fill="#16A34A" stroke="white" strokeWidth="1.5" />
            <circle cx="200" cy="210" r="4" fill="#16A34A" stroke="white" strokeWidth="1.5" />
            <circle cx="150" cy="170" r="4" fill="#16A34A" stroke="white" strokeWidth="1.5" />

            {/* Micro labels */}
            <text x="35" y="110" fill="#B1A296" fontSize="7" fontWeight="bold" transform="rotate(2 35 110)">Boulevard du 20 Mai</text>
            <text x="210" y="270" fill="#99B7CE" fontSize="7" fontWeight="bold" transform="rotate(-12 210 270)">Mfoundi Basin</text>
          </svg>

          {/* Floating Location coordinates box */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-lg p-2 flex items-start gap-2 shadow-sm">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <p className="text-[10px] font-bold text-slate-800">{registration.city}, {registration.district}</p>
              <p className="text-[8px] text-slate-400 font-semibold font-mono mt-0.5">3.848°N 11.502°E</p>
            </div>
          </div>

          {/* Floating Area stats info box */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-lg p-2 flex flex-col shadow-sm text-right leading-tight">
            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Area Size</span>
            <span className="text-[11px] font-bold text-slate-800 font-mono mt-0.5">{registration.area.toLocaleString()} m²</span>
            <span className="text-[8px] text-emerald-600 font-semibold mt-0.5">24 GPS points</span>
          </div>

          {/* Zoom controls float */}
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            <button className="w-6 h-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded shadow flex items-center justify-center cursor-pointer">+</button>
            <button className="w-6 h-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded shadow flex items-center justify-center cursor-pointer">-</button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Surveyor: Paul Biya Jr</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Collected: 3 Jun 2025 14:30</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onConfirm(registration)}
            className="w-full sm:w-auto px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
          >
            Confirm GIS Data
          </button>
        </div>

      </div>
    </div>
  )
}

// New Registration Modal
interface NewRegistrationModalProps {
  onClose: () => void
  onSubmit: (data: Omit<Registration, 'id' | 'submitted' | 'currentStep' | 'status'>) => void
}

const NewRegistrationModal = ({ onClose, onSubmit }: NewRegistrationModalProps) => {
  const [formData, setFormData] = useState({
    applicant: '',
    nationalId: '',
    phone: '',
    city: 'Yaoundé',
    district: '',
    area: '',
    notes: ''
  })
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.applicant || !formData.nationalId || !formData.phone) {
      alert('Please fill out all required fields.')
      return
    }
    onSubmit({
      applicant: formData.applicant,
      nationalId: formData.nationalId,
      phone: formData.phone,
      city: formData.city,
      district: formData.district || 'Bastos',
      area: Number(formData.area) || 1240,
      notes: formData.notes,
      documents: files.map(f => f.name)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scrollbar-none">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">New Registration</h3>
          <p className="text-xs text-slate-500 mt-1">Submit a new land registration request</p>
        </div>

        {/* Green Alert Banner */}
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>A new Registration ID will be auto-assigned upon submission.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Applicant Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Applicant Full Name</label>
            <input
              type="text"
              name="applicant"
              required
              placeholder="e.g. Pierre Mballa"
              value={formData.applicant}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* National ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Applicant National ID</label>
            <input
              type="text"
              name="nationalId"
              required
              placeholder="e.g. NI-12847291"
              value={formData.nationalId}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Phone</label>
            <input
              type="text"
              name="phone"
              required
              placeholder="+237 6XX XXX XXX"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* City / District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-blue-600 focus:outline-none transition-all"
              >
                {['Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">District</label>
              <input
                type="text"
                name="district"
                placeholder="e.g. Bastos"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Area / Submission Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Declared Area (m²)</label>
              <input
                type="number"
                name="area"
                placeholder="e.g. 1240"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Submission Date</label>
              <input
                type="text"
                disabled
                value={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                className="w-full px-3.5 py-2 border border-slate-100 bg-slate-50 text-slate-500 rounded-lg text-sm focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Upload Documents (Dashed Area) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Upload Documents</label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2",
                dragActive && "border-blue-600 bg-blue-50/20"
              )}
              onClick={() => document.getElementById('new-file-upload')?.click()}
            >
              <Upload className="w-8 h-8 text-slate-400" />
              <div className="text-xs font-semibold text-slate-600">
                {files.length > 0 ? (
                  <span className="text-blue-600">{files.map(f => f.name).join(', ')}</span>
                ) : (
                  <span>Drop files here or <span className="text-blue-600">click to browse</span></span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">PDF, JPG, PNG — max 10MB each</p>
              <input
                id="new-file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-750"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-950 text-white font-medium text-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Registration</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default RegistrationWorkflowPage
