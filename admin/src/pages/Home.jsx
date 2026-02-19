import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api'

export default function Home() {
  const [counts, setCounts] = useState({
    employees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    const token = localStorage.getItem('adminToken')
    try {
      setLoading(true)
      
      // 1. Fetch Employees and Leaves in parallel
      const [empRes, leaveRes] = await Promise.all([
        fetch(`${API_URL}/employees`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/leaves`, { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      const employees = await empRes.json()
      const leaves = await leaveRes.json()

      // 2. Calculate Stats
      if (Array.isArray(employees) && Array.isArray(leaves)) {
        setCounts({
          employees: employees.length,
          pendingLeaves: leaves.filter(l => l.status === 'pending').length,
          approvedLeaves: leaves.filter(l => l.status === 'approved').length,
          rejectedLeaves: leaves.filter(l => l.status === 'cancelled').length,
        })
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper for Stat Cards
  const StatCard = ({ title, count, icon, color, linkTo }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 transition-transform transform hover:-translate-y-1" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '...' : count}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
      {linkTo && (
        <div className="mt-4 pt-4 border-t border-gray-100">
           <Link to={linkTo} className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: color }}>
             View Details <span>&rarr;</span>
           </Link>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      
      {/* 1. Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of your organization's performance.</p>
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Total Employees */}
        <StatCard 
          title="Total Employees" 
          count={counts.employees} 
          color="#2563EB" // Blue-600
          linkTo="/employees"
          icon={
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        {/* Card 2: Pending Requests (Important!) */}
        <StatCard 
          title="Pending Requests" 
          count={counts.pendingLeaves} 
          color="#D97706" // Amber-600
          linkTo="/leaves"
          icon={
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Card 3: Approved Leaves */}
        <StatCard 
          title="Leaves Approved" 
          count={counts.approvedLeaves} 
          color="#059669" // Emerald-600
          linkTo="/leaves"
          icon={
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* 3. Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Quick Welcome / Status */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-2xl font-bold mb-2">Welcome back, Admin!</h3>
             <p className="text-blue-100 mb-6">
               You have <span className="font-bold text-white">{counts.pendingLeaves} pending leave requests</span> that require your attention today.
             </p>
             <Link to="/leaves" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition-colors">
               Review Leaves
             </Link>
           </div>
           {/* Background Decoration */}
           <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
           </div>
        </div>

        {/* Right: Quick Links */}
        <div className="bg-white rounded-xl shadow-md p-6">
           <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Quick Actions</h3>
           <div className="space-y-4">
              
              <Link to="/add-employee" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group">
                 <div className="flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                   </div>
                   <span className="font-medium text-gray-700 group-hover:text-blue-700">Add New Employee</span>
                 </div>
                 <span className="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>

              <Link to="/leaves" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition-all group">
                 <div className="flex items-center gap-3">
                   <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                   </div>
                   <span className="font-medium text-gray-700 group-hover:text-green-700">Manage Leaves</span>
                 </div>
                 <span className="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>

           </div>
        </div>

      </div>
    </div>
  )
}