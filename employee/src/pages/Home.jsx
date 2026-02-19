import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Employee')
  const [stats, setStats] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadEmployeeData()
  }, [])

  async function loadEmployeeData() {
    const token = localStorage.getItem('empToken')
    const storedEmail = localStorage.getItem('emp_email')
    const storedName = localStorage.getItem('emp_name')

    // Set User Name
    if (storedName && storedName !== 'undefined') setUserName(storedName)
    else if (storedEmail) setUserName(storedEmail.split('@')[0])

    // Default Stats (Skeleton)
    const defaultStats = [
      { label: 'Annual Balance', value: '12 Days', color: 'bg-emerald-100 text-emerald-600', icon: '🌴' },
      { label: 'Pending Requests', value: '0', color: 'bg-amber-100 text-amber-600', icon: '⏳' },
      { label: 'Total Leaves Taken', value: '0', color: 'bg-indigo-100 text-indigo-600', icon: '📅' },
    ]

    if (!token) {
      // Guest View
      setStats(defaultStats)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Decode Token to get ID
      let employeeId = null
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        employeeId = payload.employeeId
      } catch (e) { console.error('Token decode error', e) }

      // Fetch Data
      const res = await fetch(`${API_URL}/leaves/leave-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const allLeaves = await res.json()
        
        // Filter: Only show THIS employee's data
        const myLeaves = allLeaves.filter(l => (l.employee?._id || l.employee) === employeeId)
        
        // Calculate Real Stats
        const pendingCount = myLeaves.filter(l => l.status === 'pending').length
        const approvedCount = myLeaves.filter(l => l.status === 'approved').length // Used for 'Leaves Taken'
        
        setStats([
          { label: 'Annual Balance', value: `${12 - approvedCount} Days`, color: 'bg-emerald-100 text-emerald-600', icon: '🌴' },
          { label: 'Pending Requests', value: pendingCount.toString(), color: 'bg-amber-100 text-amber-600', icon: '⏳' },
          { label: 'Total Leaves Taken', value: approvedCount.toString(), color: 'bg-indigo-100 text-indigo-600', icon: '📅' },
        ])

        // Get 3 most recent leaves
        setRecentActivity(myLeaves.reverse().slice(0, 3))
      } else {
        setStats(defaultStats)
      }
    } catch (error) {
      console.error('Dashboard Error:', error)
      toast.error('Could not sync data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen font-sans">
      <Header title="My Workspace" />

      {/* Hero Section */}
      <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 w-full">
          <h2 className="text-3xl font-bold text-slate-800">
            Hello, <span className="text-indigo-600 capitalize">{userName}</span>! 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Welcome to your personal dashboard. You can track your time off here.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/leave-request')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Request Leave
            </button>
            <button 
              onClick={() => navigate('/leave-status')}
              className="px-6 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all"
            >
              View My History
            </button>
          </div>
        </div>
        
        {/* Decorative Circle */}
        <div className="hidden md:flex h-40 w-40 bg-indigo-50 rounded-full items-center justify-center text-6xl opacity-80 shrink-0 border-4 border-white shadow-sm">
           🏠
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : (
        <>
          {/* Personal Stats Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-all group cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2 group-hover:text-indigo-600 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lower Section: Activity & Info */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* My Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">My Recent Requests</h3>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">History</span>
              </div>

              <div className="space-y-4 flex-1">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-slate-400 italic">No leave requests found.</p>
                    <button onClick={() => navigate('/leave-request')} className="text-sm text-indigo-600 font-medium mt-2 hover:underline">Start a new one</button>
                  </div>
                ) : (
                  recentActivity.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 transition-all shadow-sm hover:shadow-md">
                      {/* Status Dot */}
                      <div className={`shrink-0 h-3 w-3 rounded-full ${
                        item.status === 'approved' ? 'bg-emerald-500 shadow-emerald-200' : 
                        item.status === 'cancelled' ? 'bg-rose-500 shadow-rose-200' : 'bg-amber-400 shadow-amber-200'
                      } shadow-lg`} />
                      
                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{item.reason || 'No reason provided'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(item.startDate).toLocaleDateString()} &rarr; {new Date(item.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                         item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                         item.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
              
              {recentActivity.length > 0 && (
                <button onClick={() => navigate('/leave-status')} className="mt-6 w-full py-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded transition-colors">
                  View All Activity &rarr;
                </button>
              )}
            </div>

            {/* Sidebar: Calendar & Support */}
            <div className="space-y-6">
              
              {/* Upcoming Holiday Widget */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg shadow-indigo-200 p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4 opacity-90">
                     <span className="text-xl">📅</span>
                     <span className="text-sm font-medium uppercase tracking-wider">Next Public Holiday</span>
                   </div>
                   <h3 className="text-3xl font-bold mb-1">Thanksgiving</h3>
                   <p className="text-indigo-200 text-sm mb-6">Thursday, Nov 28th</p>
                   
                   <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                     <p className="text-xs text-indigo-50 leading-relaxed">
                       ℹ️ Office will be closed. Use your leaves if you plan to take the Friday off as well.
                     </p>
                   </div>
                </div>
                {/* Background Decor */}
                <div className="absolute -right-4 -top-4 text-[10rem] opacity-5 rotate-12">🍂</div>
              </div>

              {/* Quick Contact Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Have Questions?</h4>
                  <p className="text-xs text-slate-500 mt-1">Contact HR regarding policies.</p>
                </div>
                <button className="h-10 w-10 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full flex items-center justify-center transition-colors">
                  ✉️
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </main>
  )
}