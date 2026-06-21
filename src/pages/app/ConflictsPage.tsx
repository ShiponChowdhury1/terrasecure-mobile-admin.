"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { AlertTriangle, Map, Ban, CheckCircle, Info, X, Check, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface ConflictCase {
  id: string
  severity: 'High' | 'Medium' | 'Low'
  type: 'Overlap' | 'Duplicate' | 'Invalid Geometry' | 'Boundary Conflict'
  parcels: string[]
  detectedDate: string
  status: 'Open' | 'Resolved' | 'Blocked' | 'Exception Approved'
  description: string
}

const initialConflicts: ConflictCase[] = [
  {
    id: 'CON-21',
    severity: 'High',
    type: 'Overlap',
    parcels: ['CM-2847', 'CM-2848'],
    detectedDate: '9 Jun 2025',
    status: 'Open',
    description: 'Boundary overlap detected in Centre Region. The northern boundary of CM-2848 encroaches on CM-2847 by 142 m².'
  },
  {
    id: 'CON-20',
    severity: 'Medium',
    type: 'Duplicate',
    parcels: ['CM-2790', 'CM-2791'],
    detectedDate: '5 Jun 2025',
    status: 'Open',
    description: 'Duplicate title deed registry files uploaded for the same coordinates.'
  },
  {
    id: 'CON-19',
    severity: 'Low',
    type: 'Invalid Geometry',
    parcels: ['CM-2765'],
    detectedDate: '1 Jun 2025',
    status: 'Open',
    description: 'Polygon boundary geometry is self-intersecting or has invalid coordinate format.'
  },
  {
    id: 'CON-18',
    severity: 'High',
    type: 'Boundary Conflict',
    parcels: ['CM-2781', 'CM-2782'],
    detectedDate: '28 May 2025',
    status: 'Open',
    description: 'Both owners claiming ownership over the eastern buffer strip.'
  }
]

const ConflictsPage = () => {
  const [conflicts, setConflicts] = useState<ConflictCase[]>(initialConflicts)
  
  // Modal states
  const [activeMapReview, setActiveMapReview] = useState<ConflictCase | null>(null)
  const [activeWorkflowCase, setActiveWorkflowCase] = useState<ConflictCase | null>(null)
  
  // Resolution Workflow Wizard states (6 Steps Stepper)
  const [workflowStep, setWorkflowStep] = useState(1)
  const [adjustedPoints, setAdjustedPoints] = useState([
    { pt: 'PT-01', lat: '3.8480', lng: '11.5021' },
    { pt: 'PT-02', lat: '3.8485', lng: '11.5021' },
    { pt: 'PT-03', lat: '3.8483', lng: '11.5024' },
    { pt: 'PT-04', lat: '3.8480', lng: '11.5026' }
  ])
  const [resolutionNotes, setResolutionNotes] = useState('')

  // 6 Steps Specific States
  const [investigator, setInvestigator] = useState('Paul Biya Jr')
  const [visitDate, setVisitDate] = useState('2025-06-15')
  const [mediationNotes, setMediationNotes] = useState('')
  const [partyAAgreement, setPartyAAgreement] = useState(false)
  const [partyBAgreement, setPartyBAgreement] = useState(false)
  const [legalRecommendation, setLegalRecommendation] = useState('recommend_adjust')
  const [finalDecisionText, setFinalDecisionText] = useState('')
  const [compensationValue, setCompensationValue] = useState('')

  // Map review visual controls
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleBlockParcel = (id: string) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, status: 'Blocked' } : c))
    alert(`Conflict ${id} marked as BLOCKED. Associated parcel registries are locked from editing.`)
  }

  const handleApproveException = (id: string) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, status: 'Exception Approved' } : c))
    alert(`Exception approved for Conflict ${id}. The overlap will be ignored in future checks.`)
  }

  const handleStartWorkflow = (conflict: ConflictCase) => {
    setActiveWorkflowCase(conflict)
    setWorkflowStep(1)
    setResolutionNotes('')
    setMediationNotes('')
    setPartyAAgreement(false)
    setPartyBAgreement(false)
    setLegalRecommendation('recommend_adjust')
    setFinalDecisionText('')
    setCompensationValue('')
  }

  const handleCompleteWorkflow = () => {
    if (!activeWorkflowCase) return
    setConflicts(prev => prev.map(c => c.id === activeWorkflowCase.id ? { ...c, status: 'Resolved' } : c))
    setActiveWorkflowCase(null)
    alert(`Conflict ${activeWorkflowCase.id} successfully resolved and database updated.`)
  }

  return (
    <DashboardChildrenLayout title="Conflict Detection" subtitle="Detected overlaps, duplicates, and boundary conflicts">
      
      {/* Stats summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        
        {/* Total conflicts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-rose-600">47</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Conflicts</div>
        </div>

        {/* Overlaps */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-amber-600">23</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Overlaps</div>
        </div>

        {/* Duplicates */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-purple-600">8</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Duplicates</div>
        </div>

        {/* Invalid Geometries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-blue-600">11</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Invalid Geometries</div>
        </div>

        {/* Boundary Conflicts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-emerald-600">5</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Boundary Conflicts</div>
        </div>

      </div>

      {/* Main split grid layout */}
      <div className="flex gap-6 items-start relative w-full h-full">
        
        {/* Left main list panel */}
        <div className={cn(
          "flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5 space-y-4 transition-all duration-300",
          activeWorkflowCase ? "w-[58%] xl:max-w-[58%] shrink-0" : "w-full"
        )}>
          
          <div className="space-y-4">
            {conflicts.map((c) => (
              <div 
                key={c.id}
                className={cn(
                  "border rounded-2xl p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4",
                  c.status === 'Resolved' && 'bg-emerald-50/20 border-emerald-100',
                  c.status === 'Blocked' && 'bg-slate-50 border-slate-200 opacity-70',
                  c.status === 'Exception Approved' && 'bg-blue-50/20 border-blue-100',
                  c.status === 'Open' && 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                )}
              >
                {/* Information blocks */}
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  )}>
                    {c.status === 'Resolved' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 font-mono">{c.id}</span>
                      
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold border tracking-wide uppercase",
                        c.severity === 'High' && 'bg-rose-50 text-rose-650 border-rose-100',
                        c.severity === 'Medium' && 'bg-amber-50 text-amber-650 border-amber-100',
                        c.severity === 'Low' && 'bg-slate-50 text-slate-500 border-slate-100'
                      )}>
                        {c.severity}
                      </span>

                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase">
                        {c.type}
                      </span>

                      {c.status !== 'Open' && (
                        <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase">
                          {c.status}
                        </span>
                      )}
                    </div>

                    {/* Involved Parcels list */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <span className="text-slate-400 font-semibold">Parcels:</span>
                      {c.parcels.map((p, idx) => (
                        <span key={p} className="font-mono">
                          <span className={cn(idx === 0 ? "text-emerald-600" : "text-rose-600")}>{p}</span>
                          {idx < c.parcels.length - 1 && <span className="text-slate-350 mx-1">#</span>}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs font-semibold text-slate-450 max-w-xl leading-relaxed">
                      {c.description}
                    </p>

                    <div className="text-[10px] font-semibold text-slate-400">
                      Detected: {c.detectedDate}
                    </div>

                  </div>
                </div>

                {/* Right actions list */}
                <div className="flex flex-row lg:flex-col items-stretch justify-center gap-1.5 self-end lg:self-center shrink-0 w-full lg:w-36">
                  
                  {c.status === 'Open' ? (
                    <>
                      <button
                        onClick={() => setActiveMapReview(c)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] font-bold bg-blue-650 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm text-center"
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>Review on Map</span>
                      </button>

                      <button
                        onClick={() => handleStartWorkflow(c)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] font-bold bg-[#047857] hover:bg-[#065f46] text-white rounded-lg transition-all cursor-pointer shadow-sm text-center"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resolve Workflow</span>
                      </button>

                      <button
                        onClick={() => handleBlockParcel(c.id)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-all cursor-pointer text-center"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Block Parcel</span>
                      </button>

                      <button
                        onClick={() => handleApproveException(c.id)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all cursor-pointer text-center"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Exception</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center text-xs font-bold text-slate-400 py-3 gap-1">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Case Handled</span>
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Resolution Workflow Side Drawer (6-step Stepper) */}
        {activeWorkflowCase && (
          <div className="w-full lg:w-[46%] shrink-0 border border-slate-100 bg-white rounded-2xl shadow-xl overflow-hidden p-6 animate-in slide-in-from-right duration-300 relative flex flex-col max-h-[88vh] sticky top-20 text-left">
            
            {/* Close drawer */}
            <button
              onClick={() => setActiveWorkflowCase(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Resolve Conflict - {activeWorkflowCase.id}</h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Involved Parcels: {activeWorkflowCase.parcels.join(' & ')}
              </p>
            </div>

            {/* Stepper Header (Same to Same as Mockup) */}
            <div className="mb-8 relative select-none">
              <div className="absolute top-4 left-[8%] right-[8%] h-0.5 bg-slate-100 z-0">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((workflowStep - 1) / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-start relative z-10">
                {[
                  { num: 1, label: 'Assign Investigator', short: 'Assign' },
                  { num: 2, label: 'Field Investigation', short: 'Field' },
                  { num: 3, label: 'Mediation', short: 'Mediation' },
                  { num: 4, label: 'Legal Review', short: 'Legal' },
                  { num: 5, label: 'Resolution Decision', short: 'Decision' },
                  { num: 6, label: 'Archive Case', short: 'Archive' }
                ].map((s) => {
                  const isActive = workflowStep === s.num
                  const isCompleted = workflowStep > s.num
                  return (
                    <div 
                      key={s.num} 
                      className="flex flex-col items-center flex-1 cursor-pointer"
                      onClick={() => setWorkflowStep(s.num)}
                    >
                      <div className={cn(
                        "w-8.5 h-8.5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                        isCompleted && "bg-blue-600 text-white border-blue-600",
                        isActive && "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 shadow",
                        !isActive && !isCompleted && "bg-slate-100 text-slate-400 border-slate-200"
                      )}>
                        {s.num}
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold mt-2 text-center leading-tight max-w-[65px] transition-colors",
                        isActive || isCompleted ? "text-blue-600" : "text-slate-400"
                      )}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step Wizard Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 scrollbar-thin">
              
              {/* Step 1: Assign Investigator */}
              {workflowStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Step 1: Assign Investigator</h4>
                    <p className="text-[11px] font-semibold text-slate-400">Choose a surveyor to conduct field verification and GPS measurements.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Assigned Surveyor</label>
                      <select 
                        value={investigator}
                        onChange={(e) => setInvestigator(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50/40 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      >
                        <option value="Paul Biya Jr">Paul Biya Jr (Busy - 2 active)</option>
                        <option value="Martin Essono">Martin Essono (Available - 0 active)</option>
                        <option value="Cécile Ondoua">Cécile Ondoua (Available - 1 active)</option>
                        <option value="Alain Dimi">Alain Dimi (Offline - 0 active)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Scheduled Date</label>
                      <input 
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50/40 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Field Investigation */}
              {workflowStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Step 2: Field Investigation Results</h4>
                    <p className="text-[11px] font-semibold text-slate-400">Adjust captured GPS boundary nodes to resolve overlaps.</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-semibold text-amber-800 leading-normal">
                      The current overlap area is calculated at <strong className="font-bold">142.5 m²</strong>. Modify PT-03 to pull the boundary back from the disputed ridge.
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1.5">
                      <span>Point ID</span>
                      <span>Latitude</span>
                      <span>Longitude</span>
                    </div>
                    {adjustedPoints.map((pt, idx) => (
                      <div key={pt.pt} className="grid grid-cols-3 gap-2 items-center">
                        <span className="text-xs font-bold text-slate-500 font-mono">{pt.pt}</span>
                        <input
                          type="text"
                          value={pt.lat}
                          onChange={(e) => {
                            const updated = [...adjustedPoints]
                            updated[idx].lat = e.target.value
                            setAdjustedPoints(updated)
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700"
                        />
                        <input
                          type="text"
                          value={pt.lng}
                          onChange={(e) => {
                            const updated = [...adjustedPoints]
                            updated[idx].lng = e.target.value
                            setAdjustedPoints(updated)
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Mediation */}
              {workflowStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Step 3: Joint Mediation Hearing</h4>
                    <p className="text-[11px] font-semibold text-slate-400">Record statements and agreement status from both land claimants.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Mediation Minutes Summary</label>
                      <textarea
                        rows={3}
                        value={mediationNotes}
                        onChange={(e) => setMediationNotes(e.target.value)}
                        placeholder="e.g., Both owners met at Yaoundé Sector Office. Agreed to adjust coordinate PT-03 to follow the stream bed..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
                      />
                    </div>

                    <div className="space-y-2 border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Claimant Endorsement</h5>
                      
                      <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                        <input 
                          type="checkbox" 
                          checked={partyAAgreement}
                          onChange={(e) => setPartyAAgreement(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                        />
                        <span className="text-xs font-semibold text-slate-700">Pierre Mballa (Party A) Agrees to Adjustment</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                        <input 
                          type="checkbox" 
                          checked={partyBAgreement}
                          onChange={(e) => setPartyBAgreement(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                        />
                        <span className="text-xs font-semibold text-slate-700">Amina Fouda (Party B) Agrees to Adjustment</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Legal Review */}
              {workflowStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Step 4: Legal Review & Recalculation</h4>
                    <p className="text-[11px] font-semibold text-slate-400">Legal officer evaluation of boundary adjusting recommendation.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Legal Recommendation Mode</label>
                      <select 
                        value={legalRecommendation}
                        onChange={(e) => setLegalRecommendation(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50/40 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      >
                        <option value="recommend_adjust">Recommend Boundary Adjustment (Mutual Consent)</option>
                        <option value="recommend_split">Recommend 50/50 Equal Overlap Split</option>
                        <option value="recommend_court">Escalate to Sector Land Tribunal</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Resolution Summary / Notes</label>
                      <textarea
                        rows={3}
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Describe legal justification matching land registration act article 14..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Resolution Decision */}
              {workflowStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Step 5: Resolution Decision</h4>
                    <p className="text-[11px] font-semibold text-slate-400">Formalize final boundary decision and financial compensation values (if any).</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Compensation Adjustment Amount (XAF)</label>
                      <input 
                        type="text"
                        value={compensationValue}
                        onChange={(e) => setCompensationValue(e.target.value)}
                        placeholder="e.g. 250,000"
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50/40 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Final Decision Details</label>
                      <textarea
                        rows={3}
                        value={finalDecisionText}
                        onChange={(e) => setFinalDecisionText(e.target.value)}
                        placeholder="Enter the final verdict coordinates and deed updates details..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:border-blue-600 focus:outline-none transition-all resize-none font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Archive Case */}
              {workflowStep === 6 && (
                <div className="space-y-5 py-4 text-center">
                  
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <Check className="w-7 h-7 stroke-[3.5]" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-emerald-800">Ready to Archive Case</h4>
                    <p className="text-xs font-semibold text-slate-450 max-w-xs mx-auto leading-relaxed">
                      All steps completed. Coordinates calibrated, mutual agreements signed, and compensation recorded.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left text-[11px] font-semibold text-slate-650 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assigned Surveyor</span>
                      <span className="text-slate-800 font-bold">{investigator}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Resolution Mode</span>
                      <span className="text-slate-800 font-bold">Boundary Adjusted</span>
                    </div>
                    {compensationValue && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Compensation Amount</span>
                        <span className="text-blue-600 font-bold font-mono">{compensationValue} XAF</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Database Action</span>
                      <span className="text-emerald-600 font-bold uppercase tracking-wider">Write Deed Update</span>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              {workflowStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWorkflowStep(workflowStep - 1)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveWorkflowCase(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
              )}

              {workflowStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setWorkflowStep(workflowStep + 1)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer text-center shadow-sm"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteWorkflow}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer text-center shadow-sm"
                >
                  Complete & Archive
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Map Review Modal */}
      {activeMapReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between relative">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Map Review - {activeMapReview.id}</h3>
                  <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                    {activeMapReview.type}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  Parcels involved: {activeMapReview.parcels.join(', ')} - Detected 9 Jun 2025
                </p>
              </div>
              <button
                onClick={() => setActiveMapReview(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Body */}
            <div className="relative w-full aspect-[600/350] bg-slate-950 overflow-hidden select-none">
              
              <div 
                className="w-full h-full relative transition-transform duration-200 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Background map image */}
                <Image
                  src="/images/map.png"
                  alt="Review Conflict Location"
                  fill
                  className="object-cover opacity-90 select-none pointer-events-none"
                />

                {/* Overlapping interactive boundary polygons */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                  
                  {/* Left parcel (CM-2847) green */}
                  <polygon
                    points="150,120 280,110 320,240 180,240"
                    fill="rgba(16,185,129,0.25)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                  />

                  {/* Right parcel (CM-2848) red */}
                  <polygon
                    points="250,130 380,120 400,230 260,250"
                    fill="rgba(239,68,68,0.25)"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                  />

                  {/* Overlap area (dashed intersection) */}
                  <polygon
                    points="250,130 280,125 320,240 260,245"
                    fill="rgba(239,68,68,0.15)"
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="4,4"
                  />

                  {/* Shaded labels */}
                  <text x="175" y="170" fill="#10B981" className="text-[11px] font-extrabold font-mono">CM-2847</text>
                  <text x="325" y="180" fill="#EF4444" className="text-[11px] font-extrabold font-mono">CM-2848</text>
                  <text x="252" y="210" fill="#dc2626" className="text-[9px] font-extrabold tracking-wider bg-black">Conflict zone</text>

                </svg>
              </div>

              {/* Map controls overlay */}
              <div className="absolute top-4 right-4 bg-white/95 border border-slate-200/40 rounded-xl p-1.5 shadow-lg flex flex-col gap-1 backdrop-blur-sm z-20">
                <button
                  onClick={() => setZoomLevel(Math.min(zoomLevel + 0.25, 2.5))}
                  className="p-1.5 text-slate-750 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(zoomLevel - 0.25, 1))}
                  className="p-1.5 text-slate-750 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200/40 rounded-xl p-3 shadow-lg flex flex-col gap-1.5 backdrop-blur-sm z-20 text-[10px] font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 border border-emerald-600 rounded shrink-0"></span>
                  <span>{activeMapReview.parcels[0]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-rose-500 border border-rose-600 rounded shrink-0"></span>
                  <span>{activeMapReview.parcels[1]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-650">
                  <span className="w-2.5 h-2.5 bg-rose-200 border border-rose-400 border-dashed rounded shrink-0"></span>
                  <span>Conflict zone</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleBlockParcel(activeMapReview.id)
                    setActiveMapReview(null)
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Block Parcel
                </button>
                <button
                  onClick={() => {
                    handleApproveException(activeMapReview.id)
                    setActiveMapReview(null)
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Approve Exception
                </button>
              </div>
              <button
                onClick={() => setActiveMapReview(null)}
                className="px-5 py-2 bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardChildrenLayout>
  )
}

export default ConflictsPage
