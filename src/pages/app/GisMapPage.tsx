"use client"
import React, { useState, useRef } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Search, ChevronDown, Check, X, Layers, Compass, Info, Ruler, PenTool } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface GisParcel {
  id: string
  owner: string
  status: 'Published' | 'Reserved' | 'Disputed' | 'Sold' | 'Draft'
  region: string
  area: string
  coordinates: string
  points: { lat: number; lng: number }[]
  surveyor: string
  surveyDate: string
  svgCoords: string // For mapping polygon overlay points on a 800x500 box
}

const mockParcels: GisParcel[] = [
  {
    id: 'CM-2847',
    owner: 'Pierre Mballa',
    status: 'Published',
    region: 'Centre Region',
    area: '1,240 m²',
    coordinates: '3.8480° N, 11.5021° E',
    points: [
      { lat: 3.8480, lng: 11.5021 },
      { lat: 3.8485, lng: 11.5021 },
      { lat: 3.8485, lng: 11.5026 },
      { lat: 3.8480, lng: 11.5026 }
    ],
    surveyor: 'Paul Biya Jr',
    surveyDate: '10 Jun 2025',
    svgCoords: '150,180 280,180 280,260 150,260'
  },
  {
    id: 'CM-2849',
    owner: 'Jean-Pierre Nkodo',
    status: 'Draft',
    region: 'Centre Region',
    area: '980 m²',
    coordinates: '3.8492° N, 11.5035° E',
    points: [
      { lat: 3.8492, lng: 11.5035 },
      { lat: 3.8497, lng: 11.5035 },
      { lat: 3.8497, lng: 11.5040 },
      { lat: 3.8492, lng: 11.5040 }
    ],
    surveyor: 'Martin Essono',
    surveyDate: '08 Jun 2025',
    svgCoords: '380,250 490,250 490,320 380,320'
  },
  {
    id: 'CM-2848',
    owner: 'Amina Fouda',
    status: 'Disputed',
    region: 'Littoral Region',
    area: '1,560 m²',
    coordinates: '4.0510° N, 9.7085° E',
    points: [
      { lat: 4.0510, lng: 9.7085 },
      { lat: 4.0516, lng: 9.7085 },
      { lat: 4.0516, lng: 9.7092 },
      { lat: 4.0510, lng: 9.7092 }
    ],
    surveyor: 'Cécile Ondoua',
    surveyDate: '05 Jun 2025',
    svgCoords: '450,100 580,100 560,180 430,170'
  },
  {
    id: 'CM-2850',
    owner: 'Grace Tanda',
    status: 'Sold',
    region: 'South Region',
    area: '2,100 m²',
    coordinates: '2.9210° N, 11.5120° E',
    points: [
      { lat: 2.9210, lng: 11.5120 },
      { lat: 2.9220, lng: 11.5120 },
      { lat: 2.9220, lng: 11.5130 },
      { lat: 2.9210, lng: 11.5130 }
    ],
    surveyor: 'Alain Dimi',
    surveyDate: '01 Jun 2025',
    svgCoords: '220,320 340,320 340,410 220,410'
  },
  {
    id: 'CM-2852',
    owner: 'Halima Bello',
    status: 'Reserved',
    region: 'Northwest Region',
    area: '1,850 m²',
    coordinates: '5.9602° N, 10.1504° E',
    points: [
      { lat: 5.9602, lng: 10.1504 },
      { lat: 5.9610, lng: 10.1504 },
      { lat: 5.9610, lng: 10.1512 },
      { lat: 5.9602, lng: 10.1512 }
    ],
    surveyor: 'Martin Essono',
    surveyDate: '28 May 2025',
    svgCoords: '520,350 650,350 630,440 500,440'
  }
]

const GisMapPage = () => {
  const [parcels, setParcels] = useState<GisParcel[]>(mockParcels)
  const [selectedParcel, setSelectedParcel] = useState<GisParcel | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState('All Regions')

  // Layers visibility states
  const [visibleLayers, setVisibleLayers] = useState({
    Published: true,
    Reserved: true,
    Disputed: true,
    Sold: true,
    Draft: true
  })

  // Tool active states
  const [activeTool, setActiveTool] = useState<'pan' | 'measure' | 'draw'>('pan')
  const [hoveredParcel, setHoveredParcel] = useState<GisParcel | null>(null)

  // Measure tool variables
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([])
  const [measureResult, setMeasureResult] = useState<string | null>(null)

  // Drawing tool variables
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([])
  const [isDrawComplete, setIsDrawComplete] = useState(false)
  const [newParcelModalOpen, setNewParcelModalOpen] = useState(false)
  const [newParcelArea, setNewParcelArea] = useState('850 m²')

  const mapRef = useRef<HTMLDivElement>(null)

  // Details drawer active tab
  const [drawerTab, setDrawerTab] = useState<'gis' | 'surveyor'>('gis')

  const handleLayerToggle = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers({ ...visibleLayers, [layer]: !visibleLayers[layer] })
  }

  // Click handler on map canvas
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    if (activeTool === 'measure') {
      if (measurePoints.length >= 2) {
        setMeasurePoints([{ x, y }])
        setMeasureResult(null)
      } else {
        const newPoints = [...measurePoints, { x, y }]
        setMeasurePoints(newPoints)
        if (newPoints.length === 2) {
          // Calculate distance mock (1 pixel ~ 2.5 meters)
          const dist = Math.sqrt(
            Math.pow(newPoints[1].x - newPoints[0].x, 2) +
            Math.pow(newPoints[1].y - newPoints[0].y, 2)
          )
          setMeasureResult(`${Math.round(dist * 2.5)} meters`)
        }
      }
    } else if (activeTool === 'draw') {
      if (isDrawComplete) {
        setDrawPoints([{ x, y }])
        setIsDrawComplete(false)
      } else {
        setDrawPoints([...drawPoints, { x, y }])
      }
    }
  }

  const handleFinishDraw = () => {
    if (drawPoints.length < 3) {
      alert('Please place at least 3 points on the map to define a parcel.')
      return
    }
    setIsDrawComplete(true)
    // Calculate mock area based on bounds size
    const xs = drawPoints.map(p => p.x)
    const ys = drawPoints.map(p => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const mockAreaVal = Math.round((maxX - minX) * (maxY - minY) * 1.5)
    setNewParcelArea(`${mockAreaVal} m²`)
    setNewParcelModalOpen(true)
  }

  const handleSaveNewParcel = () => {
    const newId = `CM-28${52 + parcels.length + 1}`
    const polyCoords = drawPoints.map(p => `${p.x},${p.y}`).join(' ')
    const newAsn: GisParcel = {
      id: newId,
      owner: 'Unassigned Submitter',
      status: 'Draft',
      region: 'Centre Region',
      area: newParcelArea,
      coordinates: '3.8510° N, 11.5050° E',
      points: [{ lat: 3.8510, lng: 11.5050 }],
      surveyor: 'Paul Biya Jr',
      surveyDate: '21 Jun 2026',
      svgCoords: polyCoords
    }
    setParcels([...parcels, newAsn])
    setNewParcelModalOpen(false)
    setDrawPoints([])
    setIsDrawComplete(false)
    setActiveTool('pan')
    setSelectedParcel(newAsn)
  }

  const filteredParcels = parcels.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.owner.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = regionFilter === 'All Regions' || p.region === regionFilter
    return matchesSearch && matchesRegion
  })

  return (
    <DashboardChildrenLayout title="GIS / Map" subtitle="View registered parcels, survey coordinates, and region layers">
      
      {/* Main Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full w-full">
        
        {/* Map Panel (takes 2 columns on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4 relative flex flex-col">
          
          {/* Map Area */}
          <div 
            ref={mapRef}
            className="w-full relative bg-slate-900 rounded-xl overflow-hidden shadow-inner select-none border border-slate-950 aspect-[800/500] max-h-[500px]"
          >
            {/* Map image background */}
            <Image 
              src="/images/map.png"
              alt="LandSecure GIS Map Cameroon"
              fill
              className="opacity-90 select-none pointer-events-none object-cover"
            />

            {/* Polygon Layer SVG Overlay */}
            <svg 
              className="absolute inset-0 w-full h-full cursor-crosshair"
              onClick={handleMapClick}
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
            >
              {/* Render Registered Parcels */}
              {parcels.map((parcel) => {
                const isVisible = visibleLayers[parcel.status]
                const isSelected = selectedParcel?.id === parcel.id
                const isHovered = hoveredParcel?.id === parcel.id
                if (!isVisible) return null

                // Color schemes matching statuses
                const strokeColor = 
                  parcel.status === 'Published' ? '#059669' :
                  parcel.status === 'Reserved' ? '#d97706' :
                  parcel.status === 'Disputed' ? '#dc2626' :
                  parcel.status === 'Sold' ? '#7c3aed' : '#4b5563'

                const fillColor = 
                  parcel.status === 'Published' ? 'rgba(16,185,129,0.2)' :
                  parcel.status === 'Reserved' ? 'rgba(245,158,11,0.2)' :
                  parcel.status === 'Disputed' ? 'rgba(239,68,68,0.2)' :
                  parcel.status === 'Sold' ? 'rgba(139,92,246,0.2)' : 'rgba(107,114,128,0.2)'

                return (
                  <polygon
                    key={parcel.id}
                    points={parcel.svgCoords}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 4 : isHovered ? 2.5 : 1.5}
                    className="transition-all duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredParcel(parcel)}
                    onMouseLeave={() => setHoveredParcel(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedParcel(parcel)
                    }}
                  />
                )
              })}

              {/* Render Measure Tool line overlay */}
              {activeTool === 'measure' && measurePoints.map((pt, idx) => (
                <circle key={`m-pt-${idx}`} cx={pt.x} cy={pt.y} r={5} fill="#EF4444" className="animate-pulse" />
              ))}
              {activeTool === 'measure' && measurePoints.length === 2 && (
                <line 
                  x1={measurePoints[0].x} 
                  y1={measurePoints[0].y} 
                  x2={measurePoints[1].x} 
                  y2={measurePoints[1].y} 
                  stroke="#EF4444" 
                  strokeWidth={2.5}
                  strokeDasharray="4"
                />
              )}

              {/* Render Draw Tool points overlay */}
              {activeTool === 'draw' && drawPoints.map((pt, idx) => (
                <circle key={`d-pt-${idx}`} cx={pt.x} cy={pt.y} r={4.5} fill="#3B82F6" />
              ))}
              {activeTool === 'draw' && drawPoints.length > 1 && (
                <polyline
                  points={drawPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              )}
              {activeTool === 'draw' && isDrawComplete && drawPoints.length > 2 && (
                <polygon
                  points={drawPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="rgba(59,130,246,0.25)"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                />
              )}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredParcel && (
              <div 
                className="absolute bg-slate-900/95 border border-slate-800 text-white rounded-xl shadow-xl p-3 z-20 pointer-events-none"
                style={{
                  left: `${hoveredParcel.svgCoords.split(' ')[0].split(',')[0]}px`,
                  top: `${hoveredParcel.svgCoords.split(' ')[0].split(',')[1]}px`
                }}
              >
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-bold text-blue-450 font-mono">{hoveredParcel.id}</h4>
                  <p className="text-[10px] font-semibold text-slate-350">Owner: {hoveredParcel.owner}</p>
                  <p className="text-[10px] font-semibold text-slate-350">Area: {hoveredParcel.area}</p>
                  <span className={cn(
                    "inline-block px-1.5 py-0.5 rounded text-[8px] font-bold mt-1 text-white border",
                    hoveredParcel.status === 'Published' && 'bg-emerald-600/20 text-emerald-450 border-emerald-500/20',
                    hoveredParcel.status === 'Reserved' && 'bg-amber-600/20 text-amber-450 border-amber-500/20',
                    hoveredParcel.status === 'Disputed' && 'bg-rose-600/20 text-rose-450 border-rose-500/20',
                    hoveredParcel.status === 'Sold' && 'bg-purple-600/20 text-purple-450 border-purple-500/20',
                    hoveredParcel.status === 'Draft' && 'bg-slate-600/20 text-slate-400 border-slate-500/20'
                  )}>
                    {hoveredParcel.status}
                  </span>
                </div>
              </div>
            )}

            {/* Layer Control overlay (top left) */}
            <div className="absolute top-4 left-4 bg-white/95 border border-slate-200/40 rounded-xl p-3 shadow-lg z-10 flex flex-col gap-2 max-w-[160px] backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-650" />
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Map Layers</span>
              </div>
              <div className="space-y-1.5">
                {(Object.keys(visibleLayers) as (keyof typeof visibleLayers)[]).map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={visibleLayers[key]}
                      onChange={() => handleLayerToggle(key)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={cn(
                      "text-[10px] font-bold border px-1.5 py-0.5 rounded",
                      key === 'Published' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                      key === 'Reserved' && 'bg-amber-50 text-amber-650 border-amber-100',
                      key === 'Disputed' && 'bg-rose-50 text-rose-650 border-rose-100',
                      key === 'Sold' && 'bg-purple-50 text-purple-650 border-purple-100',
                      key === 'Draft' && 'bg-slate-50 text-slate-500 border-slate-100'
                    )}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Map Action Toolbar (bottom left) */}
            <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200/40 rounded-xl p-1.5 shadow-lg z-10 flex items-center gap-1.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTool('pan')
                  setMeasurePoints([])
                  setMeasureResult(null)
                  setDrawPoints([])
                  setIsDrawComplete(false)
                }}
                className={cn(
                  "p-2 rounded-lg transition-all cursor-pointer",
                  activeTool === 'pan' ? "bg-blue-600 text-white shadow" : "text-slate-650 hover:bg-slate-50"
                )}
                title="Pan/Select Map"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTool('measure')
                  setMeasurePoints([])
                  setMeasureResult(null)
                  setDrawPoints([])
                  setIsDrawComplete(false)
                }}
                className={cn(
                  "p-2 rounded-lg transition-all cursor-pointer",
                  activeTool === 'measure' ? "bg-blue-600 text-white shadow" : "text-slate-650 hover:bg-slate-50"
                )}
                title="Measure distance between two points"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTool('draw')
                  setMeasurePoints([])
                  setMeasureResult(null)
                  setDrawPoints([])
                  setIsDrawComplete(false)
                }}
                className={cn(
                  "p-2 rounded-lg transition-all cursor-pointer",
                  activeTool === 'draw' ? "bg-blue-600 text-white shadow" : "text-slate-650 hover:bg-slate-50"
                )}
                title="Draw new parcel boundary polygon"
              >
                <PenTool className="w-4 h-4" />
              </button>
            </div>

            {/* Coordinate Status Overlay (bottom right) */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white rounded-lg px-2.5 py-1 z-10 text-[9px] font-bold font-mono tracking-wider shadow border border-slate-800 select-none pointer-events-none">
              QFIELD SURVEY CALIBRATED · WGS 84
            </div>

          </div>

          {/* Context Banner for Drawing or Measuring Tool instructions */}
          {activeTool === 'measure' && (
            <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between text-xs text-red-800 font-semibold animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>Click two points on the map to measure linear distance.</span>
              </div>
              {measureResult && (
                <div className="bg-red-600 text-white font-bold px-2 py-0.5 rounded shadow font-mono">
                  {measureResult}
                </div>
              )}
            </div>
          )}

          {activeTool === 'draw' && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between text-xs text-blue-800 font-semibold animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                <span>Place boundary points on the map to define new land plot. Click &quot;Finish Area&quot; to register.</span>
              </div>
              <div className="flex gap-2">
                {drawPoints.length > 2 && !isDrawComplete && (
                  <button
                    type="button"
                    onClick={handleFinishDraw}
                    className="bg-blue-650 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm text-[11px] transition-all cursor-pointer"
                  >
                    Finish Area
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDrawPoints([])
                    setIsDrawComplete(false)
                  }}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
                >
                  Clear Points
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Panel: (Parcels List OR Details Drawer) */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-5 min-h-[400px] flex flex-col justify-between">
          
          {!selectedParcel ? (
            /* Standard List View */
            <div className="space-y-4 flex-1 flex flex-col justify-start">
              
              <div className="space-y-2 text-left">
                <h3 className="text-base font-bold text-slate-900">Registered Parcels</h3>
                <p className="text-xs font-semibold text-slate-450 leading-relaxed">Select a parcel from the map or list to inspect details</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search parcels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-xs text-title placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-semibold leading-relaxed font-mono"
                  />
                </div>

                <div className="relative select-none shrink-0">
                  <button
                    type="button"
                    onClick={() => setRegionFilter(regionFilter === 'All Regions' ? 'Centre Region' : 'All Regions')}
                    className="flex items-center justify-between gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg transition-all cursor-pointer max-w-[130px]"
                  >
                    <span className="truncate">{regionFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto space-y-2.5 max-h-[360px] pr-1 scrollbar-thin">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    onClick={() => setSelectedParcel(parcel)}
                    className="border border-slate-100 hover:border-blue-200 rounded-xl p-3.5 hover:bg-slate-50/30 transition-all flex items-center justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="text-left space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 font-mono group-hover:text-blue-600 transition-colors">{parcel.id}</h4>
                      <p className="text-[11px] font-semibold text-slate-450 leading-none truncate">Owner: {parcel.owner}</p>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold border select-none whitespace-nowrap",
                      parcel.status === 'Published' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                      parcel.status === 'Reserved' && 'bg-amber-50 text-amber-600 border-amber-100',
                      parcel.status === 'Disputed' && 'bg-rose-50 text-rose-650 border-rose-100',
                      parcel.status === 'Sold' && 'bg-purple-50 text-purple-650 border-purple-100',
                      parcel.status === 'Draft' && 'bg-slate-50 text-slate-500 border-slate-100'
                    )}>
                      {parcel.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* Details Tabbed View */
            <div className="space-y-5 flex-1 flex flex-col justify-start relative">
              
              {/* Close detail drawer */}
              <button
                onClick={() => setSelectedParcel(null)}
                className="absolute top-0 right-0 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-left space-y-1.5 border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 font-mono">{selectedParcel.id}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                    selectedParcel.status === 'Published' && 'bg-emerald-50 text-emerald-650 border-emerald-100',
                    selectedParcel.status === 'Reserved' && 'bg-amber-50 text-amber-655 border-amber-100',
                    selectedParcel.status === 'Disputed' && 'bg-rose-50 text-rose-655 border-rose-100',
                    selectedParcel.status === 'Sold' && 'bg-purple-50 text-purple-655 border-purple-100',
                    selectedParcel.status === 'Draft' && 'bg-slate-50 text-slate-550 border-slate-100'
                  )}>
                    {selectedParcel.status}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{selectedParcel.region}</span>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setDrawerTab('gis')}
                  className={cn(
                    "flex-1 pb-2 text-xs font-bold transition-all border-b-2 text-center cursor-pointer select-none",
                    drawerTab === 'gis' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-450 hover:text-slate-700"
                  )}
                >
                  GIS Coordinates
                </button>
                <button
                  onClick={() => setDrawerTab('surveyor')}
                  className={cn(
                    "flex-1 pb-2 text-xs font-bold transition-all border-b-2 text-center cursor-pointer select-none",
                    drawerTab === 'surveyor' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-450 hover:text-slate-700"
                  )}
                >
                  Surveyor History
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto max-h-[320px] pr-1 space-y-4 scrollbar-thin text-left">
                
                {drawerTab === 'gis' ? (
                  <div className="space-y-4">
                    <div className="space-y-3.5 text-xs font-semibold text-slate-650">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400 font-medium">Owner</span>
                        <span className="text-slate-800 font-bold">{selectedParcel.owner}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400 font-medium">Estimated Area</span>
                        <span className="text-slate-800 font-bold font-mono">{selectedParcel.area}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400 font-medium">Center Coordinate</span>
                        <span className="text-blue-600 font-bold font-mono">{selectedParcel.coordinates}</span>
                      </div>
                    </div>

                    {/* Coordinates Points list */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Boundary Markers (GPS WGS-84)</h5>
                      <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="py-2 px-3 font-bold text-slate-500">Point</th>
                              <th className="py-2 px-3 font-bold text-slate-500">Latitude</th>
                              <th className="py-2 px-3 font-bold text-slate-500">Longitude</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 font-mono font-bold text-slate-700">
                            {selectedParcel.points.map((pt, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/40">
                                <td className="py-2 px-3 text-slate-400">PT-0{idx + 1}</td>
                                <td className="py-2 px-3">{pt.lat.toFixed(4)}° N</td>
                                <td className="py-2 px-3">{pt.lng.toFixed(4)}° E</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-medium">Assigned Surveyor</span>
                      <span className="text-slate-800 font-bold">{selectedParcel.surveyor}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-medium">Survey Date</span>
                      <span className="text-slate-800 font-bold">{selectedParcel.surveyDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-medium">Device Type</span>
                      <span className="text-slate-800 font-bold font-mono">QField Garmin GPS</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-medium">Calibration Status</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Calibrated</span>
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => alert(`Redirecting to Land Registry page for parcel ${selectedParcel.id}...`)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer text-center"
                >
                  Inspect Registration Deed
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Draw Area Save Boundary Dialog Modal */}
      {newParcelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Register New Boundary</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Submit the drawn boundary polygon to the central database server.</p>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-650 bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Points Captured</span>
                <span className="text-slate-800 font-bold font-mono">{drawPoints.length} GPS Points</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estimated Area Surface</span>
                <span className="text-slate-800 font-bold font-mono">{newParcelArea}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Layer Group</span>
                <span className="text-slate-800 font-bold">Draft / Under Verification</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setNewParcelModalOpen(false)
                  setDrawPoints([])
                  setIsDrawComplete(false)
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveNewParcel}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer text-center shadow-sm"
              >
                Save Coordinates
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardChildrenLayout>
  )
}

export default GisMapPage
