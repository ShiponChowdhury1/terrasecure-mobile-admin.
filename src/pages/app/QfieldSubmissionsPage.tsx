"use client"
import React, { useState } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Search, ChevronDown, Check, X, Map, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QFieldSubmission {
  id: string
  surveyor: string
  parcelId: string
  submittedAt: string
  gpsPointsCount: number
  status: 'Synced' | 'Unsynced'
  coordinates: { pt: string; lat: string; lng: string; elev: string; precision: string }[]
}

const initialSubmissions: QFieldSubmission[] = [
  {
    id: 'QF-087',
    surveyor: 'Paul Biya Jr',
    parcelId: 'CM-2849',
    submittedAt: '10 Jun 2025 14:32',
    gpsPointsCount: 24,
    status: 'Synced',
    coordinates: [
      { pt: 'PT-01', lat: '3.8480° N', lng: '11.5021° E', elev: '712m', precision: '1.2cm' },
      { pt: 'PT-02', lat: '3.8485° N', lng: '11.5021° E', elev: '711m', precision: '1.4cm' },
      { pt: 'PT-03', lat: '3.8485° N', lng: '11.5026° E', elev: '715m', precision: '0.9cm' },
      { pt: 'PT-04', lat: '3.8480° N', lng: '11.5026° E', elev: '713m', precision: '1.1cm' }
    ]
  },
  {
    id: 'QF-086',
    surveyor: 'Martin Essono',
    parcelId: 'CM-2847',
    submittedAt: '8 Jun 2025 11:15',
    gpsPointsCount: 18,
    status: 'Synced',
    coordinates: [
      { pt: 'PT-01', lat: '4.0510° N', lng: '9.7085° E', elev: '12m', precision: '1.5cm' },
      { pt: 'PT-02', lat: '4.0518° N', lng: '9.7085° E', elev: '11m', precision: '1.3cm' },
      { pt: 'PT-03', lat: '4.0518° N', lng: '9.7092° E', elev: '12m', precision: '1.1cm' }
    ]
  },
  {
    id: 'QF-085',
    surveyor: 'Cécile Ondoua',
    parcelId: 'CM-2850',
    submittedAt: '5 Jun 2025 09:48',
    gpsPointsCount: 32,
    status: 'Unsynced',
    coordinates: [
      { pt: 'PT-01', lat: '3.8612° N', lng: '11.5204° E', elev: '740m', precision: '0.8cm' },
      { pt: 'PT-02', lat: '3.8620° N', lng: '11.5204° E', elev: '742m', precision: '0.9cm' },
      { pt: 'PT-03', lat: '3.8620° N', lng: '11.5215° E', elev: '739m', precision: '1.2cm' },
      { pt: 'PT-04', lat: '3.8612° N', lng: '11.5215° E', elev: '741m', precision: '1.0cm' }
    ]
  },
  {
    id: 'QF-084',
    surveyor: 'Paul Biya Jr',
    parcelId: 'CM-2852',
    submittedAt: '1 Jun 2025 16:02',
    gpsPointsCount: 12,
    status: 'Synced',
    coordinates: [
      { pt: 'PT-01', lat: '3.8440° N', lng: '11.4988° E', elev: '698m', precision: '2.1cm' },
      { pt: 'PT-02', lat: '3.8446° N', lng: '11.4988° E', elev: '699m', precision: '1.8cm' },
      { pt: 'PT-03', lat: '3.8443° N', lng: '11.4995° E', elev: '697m', precision: '2.0cm' }
    ]
  }
]

const QFieldSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<QFieldSubmission[]>(initialSubmissions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Synced' | 'Unsynced'>('All')
  const [surveyorFilter, setSurveyorFilter] = useState('All')
  const [previewSubmission, setPreviewSubmission] = useState<QFieldSubmission | null>(null)
  
  // Custom dropdown toggle states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [surveyorDropdownOpen, setSurveyorDropdownOpen] = useState(false)

  // Actions
  const handleApproveSync = (id: string) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status: 'Synced' } : sub)
    )
    alert(`Submission ${id} has been successfully validated and synced to the secure ledger.`)
  }

  const handleRejectSync = (id: string) => {
    if (confirm(`Are you sure you want to decline and reject submission ${id}? This will flag the GPS data as invalid.`)) {
      setSubmissions(prev => prev.filter(sub => sub.id !== id))
    }
  }

  // Filtered submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.surveyor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter
    const matchesSurveyor = surveyorFilter === 'All' || sub.surveyor === surveyorFilter

    return matchesSearch && matchesStatus && matchesSurveyor
  })

  // Unique surveyors for filter
  const surveyorsList = Array.from(new Set(submissions.map(s => s.surveyor)))

  return (
    <DashboardChildrenLayout>
      <div className="space-y-6 text-left">
        
        {/* Page title and description */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QField Submissions</h2>
          <p className="text-xs font-semibold text-slate-400">Manage GPS field data submissions from surveyors</p>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search parcels..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm"
              />
            </div>

            {/* Sync Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen)
                  setSurveyorDropdownOpen(false)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm min-w-[130px] justify-between"
              >
                <span>{statusFilter === 'All' ? 'Sync Status' : statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-slate-405" />
              </button>
              {statusDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in duration-100">
                    {['All', 'Synced', 'Unsynced'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setStatusFilter(opt as 'All' | 'Synced' | 'Unsynced')
                          setStatusDropdownOpen(false)
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors",
                          statusFilter === opt ? "text-blue-600 bg-blue-50/20" : "text-slate-650"
                        )}
                      >
                        {opt === 'All' ? 'All Statuses' : opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Surveyor Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSurveyorDropdownOpen(!surveyorDropdownOpen)
                  setStatusDropdownOpen(false)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm min-w-[130px] justify-between"
              >
                <span>{surveyorFilter === 'All' ? 'Surveyor' : surveyorFilter}</span>
                <ChevronDown className="w-4 h-4 text-slate-405" />
              </button>
              {surveyorDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSurveyorDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in duration-100">
                    <button
                      onClick={() => {
                        setSurveyorFilter('All')
                        setSurveyorDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors",
                        surveyorFilter === 'All' ? "text-blue-600 bg-blue-50/20" : "text-slate-650"
                      )}
                    >
                      All Surveyors
                    </button>
                    {surveyorsList.map((srv) => (
                      <button
                        key={srv}
                        onClick={() => {
                          setSurveyorFilter(srv)
                          setSurveyorDropdownOpen(false)
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors",
                          surveyorFilter === srv ? "text-blue-600 bg-blue-50/20" : "text-slate-650"
                        )}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </>
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
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission ID</th>
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surveyor</th>
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parcel</th>
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">GPS Points</th>
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync Status</th>
                  <th className="px-6 py-4.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors">
                      
                      {/* ID */}
                      <td className="px-6 py-4.5 text-xs font-mono font-bold text-slate-700">
                        {sub.id}
                      </td>

                      {/* Surveyor */}
                      <td className="px-6 py-4.5 text-xs font-semibold text-slate-700">
                        {sub.surveyor}
                      </td>

                      {/* Parcel ID (Green link) */}
                      <td className="px-6 py-4.5 text-xs font-bold text-emerald-650 hover:underline cursor-pointer">
                        {sub.parcelId}
                      </td>

                      {/* Submitted At */}
                      <td className="px-6 py-4.5 text-xs font-semibold text-slate-450">
                        {sub.submittedAt}
                      </td>

                      {/* GPS Points Badge */}
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {sub.gpsPointsCount} pts
                        </span>
                      </td>

                      {/* Sync Status Badge */}
                      <td className="px-6 py-4.5">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border",
                          sub.status === 'Synced'
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        )}>
                          {sub.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 flex items-center gap-3">
                        <button
                          onClick={() => setPreviewSubmission(sub)}
                          className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Map className="w-3 h-3" />
                          <span>Preview Map</span>
                        </button>
                        
                        {/* Sync approval icons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveSync(sub.id)}
                            disabled={sub.status === 'Synced'}
                            className={cn(
                              "p-1 rounded transition-colors cursor-pointer",
                              sub.status === 'Synced' 
                                ? "text-slate-200 cursor-not-allowed" 
                                : "text-emerald-600 hover:bg-emerald-50"
                            )}
                            title="Approve & Sync GPS data"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          <button
                            onClick={() => handleRejectSync(sub.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Reject submission"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-xs font-semibold text-slate-400">
                      No submissions found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Map Preview Modal */}
      {previewSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Map Preview - {previewSubmission.id}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                    previewSubmission.status === 'Synced' 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  )}>
                    {previewSubmission.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  Surveyor: {previewSubmission.surveyor} | Associated Parcel: {previewSubmission.parcelId}
                </p>
              </div>
              <button
                onClick={() => setPreviewSubmission(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split layout (Map & Coordinates table) */}
            <div className="flex flex-col lg:flex-row h-[420px] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Left: Interactive Simulated Map */}
              <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center">
                
                {/* Background Map Grid */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Simulated plotted nodes & polygons */}
                <div className="relative w-64 h-64 border border-blue-500/20 rounded-full flex items-center justify-center">
                  
                  {/* Outer circle radar indicator */}
                  <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-ping duration-1000" />
                  
                  {/* Drawing SVG Polygon representing parcel shape */}
                  <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon 
                      points="20,20 80,20 80,80 20,80" 
                      fill="rgba(16, 185, 129, 0.12)" 
                      stroke="rgba(16, 185, 129, 0.8)" 
                      strokeWidth="2.5"
                      strokeDasharray="2,2"
                    />
                    {/* Node points */}
                    <circle cx="20" cy="20" r="3.5" fill="#10b981" />
                    <circle cx="80" cy="20" r="3.5" fill="#10b981" />
                    <circle cx="80" cy="80" r="3.5" fill="#10b981" />
                    <circle cx="20" cy="80" r="3.5" fill="#10b981" />
                  </svg>

                  {/* Satellite text overlays */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono font-bold text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    LAT REF: {previewSubmission.coordinates[0]?.lat}
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono font-bold text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    PRECISION MAX: {previewSubmission.coordinates[0]?.precision}
                  </div>

                  <div className="text-center space-y-1 z-10 pointer-events-none">
                    <span className="text-[10px] font-bold text-emerald-450 uppercase tracking-widest">GPS PLOT AREA</span>
                    <h4 className="text-xs font-mono font-bold text-white">{previewSubmission.gpsPointsCount} Nodes Processed</h4>
                  </div>
                </div>

                {/* Map type controls */}
                <div className="absolute bottom-3 left-3 flex gap-1.5 bg-slate-900/70 p-1 rounded-lg backdrop-blur-md border border-white/5">
                  <button className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white rounded hover:bg-white/20 transition-all cursor-pointer">Satellite</button>
                  <button className="px-2.5 py-1 text-[9px] font-bold text-slate-400 rounded hover:text-white transition-all cursor-pointer">Topographic</button>
                </div>
              </div>

              {/* Right: GPS Point Registry Table */}
              <div className="w-full lg:w-[45%] flex flex-col bg-slate-50/50">
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Node Registry (Samples)</span>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">GPS L1/L2 Active</span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
                  {previewSubmission.coordinates.map((coord) => (
                    <div key={coord.pt} className="p-3 flex items-center justify-between hover:bg-white transition-all">
                      <div className="space-y-0.5">
                        <h5 className="text-[11px] font-bold text-slate-800">{coord.pt}</h5>
                        <p className="text-[10px] font-mono font-bold text-slate-500">{coord.lat} , {coord.lng}</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{coord.elev}</span>
                        <p className="text-[9px] font-semibold text-emerald-600">Tol: {coord.precision}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-450">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Format: QField Package (.qgs) v3.28 LTR</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewSubmission(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close Preview
                </button>
                {previewSubmission.status === 'Unsynced' && (
                  <button
                    onClick={() => {
                      handleApproveSync(previewSubmission.id)
                      setPreviewSubmission(null)}
                    }
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4 stroke-[2]" />
                    <span>Sync to Registry Ledger</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </DashboardChildrenLayout>
  )
}

export default QFieldSubmissionsPage
