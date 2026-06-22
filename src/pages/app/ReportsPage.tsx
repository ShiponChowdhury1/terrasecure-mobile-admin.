"use client"
import React, { useState, useEffect } from 'react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import {
  CreditCard,
  Map,
  Users,
  MapPin,
  Activity,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock Data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 4.5 },
  { month: 'Feb', revenue: 5.0 },
  { month: 'Mar', revenue: 6.2 },
  { month: 'Apr', revenue: 5.8 },
  { month: 'May', revenue: 6.5 },
  { month: 'Jun', revenue: 7.5 },
  { month: 'Jul', revenue: 8.0 },
  { month: 'Aug', revenue: 7.0 }
]

const revenueByTypeData = [
  { name: 'Registration Fee', value: 42.3, color: '#14532D' },
  { name: 'Transfer Tax', value: 28.7, color: '#2563EB' },
  { name: 'Consultation Fee', value: 8.4, color: '#8B5CF6' },
  { name: 'Surveying Fee', value: 6.2, color: '#F97316' },
  { name: 'Other', value: 2.2, color: '#94A3B8' }
]

const paymentBreakdownData = [
  { type: 'Registration Fee', count: 1847, total: 42300000, avg: 22900, successRate: '96.2%' },
  { type: 'Transfer Tax', count: 312, total: 28700000, avg: 92000, successRate: '94.1%' },
  { type: 'Consultation Fee', count: 412, total: 8400000, avg: 20400, successRate: '98.5%' },
  { type: 'Surveying Fee', count: 288, total: 6200000, avg: 21500, successRate: '91.3%' },
  { type: 'Other', count: 96, total: 2200000, avg: 22900, successRate: '88.5%' }
]

const landRegistrationData = [
  { parcelId: 'CM-2847', city: 'Yaoundé', area: '1,240 m²', status: 'Published', owner: 'Pierre Mballa', date: '12 Jan 2025' },
  { parcelId: 'CM-2848', city: 'Douala', area: '3,500 m²', status: 'Disputed', owner: 'Amina Fouda', date: '8 Feb 2025' },
  { parcelId: 'CM-2849', city: 'Yaoundé', area: '800 m²', status: 'Verified', owner: 'Jean-Pierre Nkodo', date: '15 Mar 2025' },
  { parcelId: 'CM-2850', city: 'Bamenda', area: '2,100 m²', status: 'Reserved', owner: 'Grace Tanda', date: '2 Apr 2025' },
  { parcelId: 'CM-2851', city: 'Bafoussam', area: '1,650 m²', status: 'Sold', owner: 'François Ngono', date: '20 Apr 2025' }
]

const userRequestsData = [
  { user: 'Pierre Mballa', requestType: 'Registration', parcel: 'CM-2847', status: 'In Progress', time: '2 min ago' },
  { user: 'Amina Fouda', requestType: 'Consultation', parcel: 'CM-2848', status: 'Pending', time: '15 min ago' },
  { user: 'Grace Tanda', requestType: 'Registration', parcel: 'CM-2850', status: 'Completed', time: '1h ago' },
  { user: 'Samuel Kotto', requestType: 'Document Upload', parcel: 'CM-2853', status: 'Approved', time: '2h ago' },
  { user: 'François Ngono', requestType: 'Registration', parcel: 'CM-2851', status: 'Rejected', time: '3h ago' }
]

const gpsSearchData = [
  { query: 'CM-2847', type: 'Parcel ID', user: 'Amina Fouda', time: '2 min ago', result: 'Found' },
  { query: '3.848, 11.502', type: 'GPS Coords', user: 'Paul Biya Jr', time: '15 min ago', result: 'Found' },
  { query: 'Yaoundé / Bastos', type: 'Location', user: 'Jean Alima', time: '1h ago', result: 'Found' },
  { query: 'CM-9999', type: 'Parcel ID', user: 'Marie Nkodo', time: '2h ago', result: 'Not Found' },
  { query: '5.123, 9.456', type: 'GPS Coords', user: 'Grace Tanda', time: '3h ago', result: 'Found' },
  { query: 'Douala / Akwa', type: 'Location', user: 'Samuel Kotto', time: '4h ago', result: 'Found' }
]

const investigationsData = [
  { caseId: 'INV-042', parcelId: 'CM-2852', type: 'Boundary Dispute', assignedTo: 'Paul Biya Jr', status: 'Field Visit', dateInitiated: '10 Jun 2025' },
  { caseId: 'INV-041', parcelId: 'CM-2848', type: 'Encroachment', assignedTo: 'Martin Essono', status: 'Under Review', dateInitiated: '08 Jun 2025' },
  { caseId: 'INV-040', parcelId: 'CM-2853', type: 'Ownership Claim', assignedTo: 'Cécile Ondoua', status: 'Resolved', dateInitiated: '04 Jun 2025' },
  { caseId: 'INV-039', parcelId: 'CM-2855', type: 'Fraud Suspicion', assignedTo: 'Alain Dimi', status: 'Suspended', dateInitiated: '28 May 2025' }
]

// Trend badge helper
const TrendBadge = ({ value, type = 'positive' }: { value: string; type?: 'positive' | 'negative' | 'warning' }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border select-none shrink-0",
        type === 'positive' && "bg-emerald-50 text-emerald-600 border-emerald-100",
        type === 'negative' && "bg-rose-50 text-rose-600 border-rose-100",
        type === 'warning' && "bg-amber-50 text-amber-600 border-amber-100"
      )}
    >
      {type === 'positive' && <ArrowUpRight className="w-3 h-3 stroke-[3]" />}
      {type === 'negative' && <ArrowDownRight className="w-3 h-3 stroke-[3]" />}
      {type === 'warning' && <ArrowUpRight className="w-3 h-3 stroke-[3]" />}
      <span>{value}</span>
    </div>
  )
}

// Stats Card Component
interface StatsCardProps {
  label: string
  value: string
  valueColorClass?: string
  trend?: {
    value: string
    type: 'positive' | 'negative' | 'warning'
  }
  labelPosition?: 'top' | 'bottom'
}

const StatsCard = ({
  label,
  value,
  valueColorClass = 'text-slate-900',
  trend,
  labelPosition = 'top'
}: StatsCardProps) => {
  if (labelPosition === 'bottom') {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center h-[105px]">
        <span className={cn("text-xl md:text-2xl font-bold tracking-tight", valueColorClass)}>
          {value}
        </span>
        <span className="text-xs font-semibold text-slate-400 mt-2 truncate">{label}</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[105px]">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 truncate">{label}</span>
        {trend && <TrendBadge value={trend.value} type={trend.type} />}
      </div>
      <span className={cn("text-xl md:text-2xl font-bold tracking-tight mt-2", valueColorClass)}>
        {value}
      </span>
    </div>
  )
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'land' | 'requests' | 'gps' | 'investigations'>('revenue')
  const [startDate, setStartDate] = useState('2002-01-01')
  const [endDate, setEndDate] = useState('2002-01-01')
  const [city, setCity] = useState('All Cities')
  const [district, setDistrict] = useState('All Districts')
  const [isMounted, setIsMounted] = useState(false)

  // Guard Recharts SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Tabs definitions
  const tabs = [
    {
      id: 'revenue',
      label: 'Revenue Monitoring',
      icon: CreditCard,
      accentColor: 'border-amber-500',
      iconClass: 'bg-amber-50 text-amber-600 border border-amber-100',
      activeClass: 'border-amber-500 bg-amber-50/5',
    },
    {
      id: 'land',
      label: 'Land Registration',
      icon: Map,
      accentColor: 'border-emerald-600',
      iconClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      activeClass: 'border-emerald-600 bg-emerald-50/5',
    },
    {
      id: 'requests',
      label: 'User Request Monitoring',
      icon: Users,
      accentColor: 'border-violet-600',
      iconClass: 'bg-violet-50 text-violet-600 border border-violet-100',
      activeClass: 'border-violet-600 bg-violet-50/5',
    },
    {
      id: 'gps',
      label: 'GPS Search Monitoring',
      icon: MapPin,
      accentColor: 'border-blue-600',
      iconClass: 'bg-blue-50 text-blue-650 border border-blue-100',
      activeClass: 'border-blue-600 bg-blue-50/5',
    },
    {
      id: 'investigations',
      label: 'Investigations',
      icon: Activity,
      accentColor: 'border-rose-500',
      iconClass: 'bg-rose-50 text-rose-600 border border-rose-100',
      activeClass: 'border-rose-500 bg-rose-50/5',
    }
  ]

  const getDistrictsForCity = (selectedCity: string) => {
    switch (selectedCity) {
      case 'Yaoundé':
        return ['All Districts', 'Yaoundé I', 'Yaoundé II', 'Bastos']
      case 'Douala':
        return ['All Districts', 'Douala I', 'Douala II', 'Akwa']
      case 'Bamenda':
        return ['All Districts', 'Bamenda I', 'Bamenda II']
      case 'Bafoussam':
        return ['All Districts', 'Bafoussam I', 'Bafoussam II']
      default:
        return ['All Districts']
    }
  }

  return (
    <DashboardChildrenLayout
      title="Reports / Analytics"
      subtitle="Generate detailed activity and financial reports"
    >
      {/* 1. Tab Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "bg-white border rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between transition-all cursor-pointer h-[110px] select-none hover:shadow-md",
                isActive
                  ? cn("border-2", tab.accentColor, tab.activeClass)
                  : "border-slate-100 hover:border-slate-200"
              )}
            >
              <div className={cn("p-1.5 rounded-lg w-8 h-8 flex items-center justify-center shrink-0", tab.iconClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "text-xs font-bold mt-3 leading-tight transition-colors",
                isActive ? "text-slate-900" : "text-slate-500"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Start Date */}
        <div className="flex-1 flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-500">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/40 rounded-xl text-xs text-slate-800 font-semibold focus:border-emerald-600 focus:bg-white focus:outline-none transition-all font-mono"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex-1 flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-500">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/40 rounded-xl text-xs text-slate-800 font-semibold focus:border-emerald-600 focus:bg-white focus:outline-none transition-all font-mono"
            />
          </div>
        </div>

        {/* City */}
        <div className="flex-1 flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-500">City</label>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setDistrict('All Districts')
            }}
            className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/40 rounded-xl text-xs text-slate-800 font-bold focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
          >
            <option value="All Cities">All Cites</option>
            <option value="Yaoundé">Yaoundé</option>
            <option value="Douala">Douala</option>
            <option value="Bamenda">Bamenda</option>
            <option value="Bafoussam">Bafoussam</option>
          </select>
        </div>

        {/* District */}
        <div className="flex-1 flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-500">District</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/40 rounded-xl text-xs text-slate-800 font-bold focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
          >
            {getDistrictsForCity(city).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => alert(`Report generated for ${city} - ${district} (${startDate} to ${endDate})`)}
          className="px-6 py-2.5 bg-[#14532D] hover:bg-[#166534] active:bg-[#14532D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center select-none h-[42px] flex items-center justify-center shrink-0"
        >
          Generate Report
        </button>
      </div>

      {/* 3. Tab Specific Panel */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Stats Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              label="Total Revenue (2025)"
              value="XAF 87.4M"
              valueColorClass="text-emerald-700"
              trend={{ value: "+18.2%", type: "positive" }}
            />
            <StatsCard
              label="Avg Monthly Revenue"
              value="XAF 10.9M"
              valueColorClass="text-blue-600"
              trend={{ value: "+5.4%", type: "positive" }}
            />
            <StatsCard
              label="Pending Payments"
              value="XAF 3.2M"
              valueColorClass="text-amber-600"
              trend={{ value: "-12%", type: "positive" }}
            />
            <StatsCard
              label="Payment Success Rate"
              value="94.7%"
              valueColorClass="text-purple-650"
              trend={{ value: "+2.1%", type: "positive" }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Revenue Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <span className="font-bold text-slate-900 text-sm">Monthly Revenue (Millions XAF)</span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition-colors cursor-pointer">
                    <Download className="w-3 h-3 shrink-0" />
                    <span>PDF</span>
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-lg transition-colors cursor-pointer">
                    <Download className="w-3 h-3 shrink-0" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full h-[240px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenueData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      barSize={24}
                    >
                      <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                        domain={[0, 10]}
                        ticks={[0, 4.6, 9.1]}
                        tickFormatter={(val) => `${val}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                        formatter={(value) => [`${value}M XAF`, 'Revenue']}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#14532D"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50/50 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-semibold">Loading chart...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue by Type Donut Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-2">
                <span className="font-bold text-slate-900 text-sm">Revenue by Type</span>
              </div>

              <div className="relative flex-1 flex items-center justify-center my-2 h-[160px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                        formatter={(value) => [`${value}M XAF`, '']}
                      />
                      <Pie
                        data={revenueByTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {revenueByTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50/50 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-semibold">Loading chart...</span>
                  </div>
                )}
              </div>

              {/* Legend with values */}
              <div className="space-y-2 pt-3 border-t border-slate-50">
                {revenueByTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px] font-semibold">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-500 truncate">{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-bold font-mono">
                      {item.value.toFixed(1)}M XAF
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 select-none">Payment Type Breakdown</h3>
            <div className="overflow-x-auto w-full scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/40">
                    <th className="py-3 px-4 rounded-l-lg">Type</th>
                    <th className="py-3 px-4">Count</th>
                    <th className="py-3 px-4">Total (XAF)</th>
                    <th className="py-3 px-4">Avg (XAF)</th>
                    <th className="py-3 px-4 rounded-r-lg">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                  {paymentBreakdownData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{row.type}</td>
                      <td className="py-3.5 px-4 font-mono">{row.count.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono">{row.total.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono">{row.avg.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600">{row.successRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'land' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm">Land Registration</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Generated · 5 record preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition-colors cursor-pointer">
                <Download className="w-3 h-3 shrink-0" />
                <span>PDF</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-lg transition-colors cursor-pointer">
                <Download className="w-3 h-3 shrink-0" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full scrollbar-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/40">
                  <th className="py-3 px-4 rounded-l-lg">Parcel ID</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Area</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                {landRegistrationData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">{row.parcelId}</td>
                    <td className="py-3.5 px-4">{row.city}</td>
                    <td className="py-3.5 px-4 font-mono">{row.area}</td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        row.status === 'Published' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                        row.status === 'Verified' && 'bg-blue-50 text-blue-600 border-blue-100',
                        row.status === 'Reserved' && 'bg-amber-50 text-amber-600 border-amber-100',
                        row.status === 'Sold' && 'bg-slate-50 text-slate-600 border-slate-100',
                        row.status === 'Disputed' && 'bg-rose-50 text-rose-600 border-rose-100'
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{row.owner}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Stats Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              label="Parcel Registrations"
              value="3,241"
              valueColorClass="text-slate-850"
              trend={{ value: "+12.5%", type: "positive" }}
            />
            <StatsCard
              label="Consultation Requests"
              value="847"
              valueColorClass="text-slate-850"
              trend={{ value: "+8.1%", type: "positive" }}
            />
            <StatsCard
              label="Document Verifications"
              value="1,203"
              valueColorClass="text-slate-850"
              trend={{ value: "-3.2%", type: "negative" }}
            />
            <StatsCard
              label="Investigation Cases"
              value="47"
              valueColorClass="text-slate-850"
              trend={{ value: "+2", type: "warning" }}
            />
          </div>

          {/* Table list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <span className="font-bold text-slate-900 text-sm">Request Activity Log</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-755 border border-slate-200 rounded-lg transition-all cursor-pointer shadow-sm">
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>

            <div className="overflow-x-auto w-full scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/40">
                    <th className="py-3 px-4 rounded-l-lg">User</th>
                    <th className="py-3 px-4">Request Type</th>
                    <th className="py-3 px-4">Parcel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-lg">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                  {userRequestsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{row.user}</td>
                      <td className="py-3.5 px-4">{row.requestType}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">{row.parcel}</td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap",
                          (row.status === 'In Progress' || row.status === 'Pending') && 'bg-amber-50 text-amber-600 border-amber-100',
                          (row.status === 'Completed' || row.status === 'Approved') && 'bg-emerald-50 text-emerald-650 border-emerald-100',
                          row.status === 'Rejected' && 'bg-rose-50 text-rose-650 border-rose-100'
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gps' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatsCard
              label="Total Searches Today"
              value="247"
              valueColorClass="text-blue-600"
              labelPosition="bottom"
            />
            <StatsCard
              label="Successful Matches"
              value="231 (93.5%)"
              valueColorClass="text-emerald-600"
              labelPosition="bottom"
            />
            <StatsCard
              label="Unique Users Searching"
              value="84"
              valueColorClass="text-purple-650"
              labelPosition="bottom"
            />
          </div>

          {/* Table list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <span className="font-bold text-slate-900 text-sm">Recent GPS Search Log</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-755 border border-slate-200 rounded-lg transition-all cursor-pointer shadow-sm">
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>

            <div className="overflow-x-auto w-full scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/40">
                    <th className="py-3 px-4 rounded-l-lg">Query</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 rounded-r-lg">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                  {gpsSearchData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className={cn(
                        "py-3.5 px-4 font-mono font-bold",
                        row.result === 'Found' ? 'text-emerald-700' : 'text-slate-800'
                      )}>
                        {row.query}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{row.user}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{row.time}</td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[10px] font-bold border",
                          row.result === 'Found' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                          row.result === 'Not Found' && 'bg-rose-50 text-rose-600 border-rose-100'
                        )}>
                          {row.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'investigations' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm">Active Investigations</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Generated · 4 active disputes preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition-colors cursor-pointer">
                <Download className="w-3 h-3 shrink-0" />
                <span>PDF</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-lg transition-colors cursor-pointer">
                <Download className="w-3 h-3 shrink-0" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full scrollbar-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/40">
                  <th className="py-3 px-4 rounded-l-lg">Case ID</th>
                  <th className="py-3 px-4">Parcel ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg">Date Initiated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                {investigationsData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{row.caseId}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">{row.parcelId}</td>
                    <td className="py-3.5 px-4">{row.type}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{row.assignedTo}</td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap",
                        row.status === 'Under Review' && 'bg-amber-50 text-amber-600 border-amber-100',
                        row.status === 'Resolved' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                        row.status === 'Suspended' && 'bg-rose-50 text-rose-600 border-rose-100',
                        row.status === 'Field Visit' && 'bg-blue-50 text-blue-600 border-blue-100'
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{row.dateInitiated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardChildrenLayout>
  )
}
