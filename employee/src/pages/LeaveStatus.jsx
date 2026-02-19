import React, { useEffect, useState } from 'react'
import Header from '../components/Header'

const API_URL = 'http://localhost:5000/api'

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch (e) { return null }
}

export default function LeaveStatus() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('empToken')
  const employeeId = (token ? decodeToken(token) : null)?.employeeId

  useEffect(() => {
    if (employeeId) fetchLeaves()
    else setLoading(false)
  }, [employeeId])

  async function fetchLeaves() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/leaves/leave-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setLeaves(data.filter(l => (l.employee?._id || l.employee) === employeeId))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <Header title="My Leave History" />
      
      {loading ? (
        <div className="mt-8 text-center text-slate-400">Loading history...</div>
      ) : leaves.length === 0 ? (
        <div className="mt-8 bg-white p-12 rounded-xl border-2 border-dashed border-slate-200 text-center">
          <div className="text-4xl mb-4">🌴</div>
          <h3 className="text-lg font-medium text-slate-800">No leaves found</h3>
          <p className="text-slate-500">You haven't made any requests yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {leaves.map(l => (
            <div key={l._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    l.status === 'approved' ? 'bg-emerald-500' : 
                    l.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-400'
                  }`} />
                  <span className="text-sm font-bold uppercase text-slate-400 tracking-wider">{l.status}</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-800">{l.reason || 'Personal Time Off'}</h4>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                  <span>{new Date(l.startDate).toLocaleDateString()}</span>
                  <span>➜</span>
                  <span>{new Date(l.endDate).toLocaleDateString()}</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-600 ml-2">
                    {l.days} Days
                  </span>
                </div>
              </div>
              <div className="text-slate-300 font-light text-2xl hidden md:block">
                #{l._id ? l._id.slice(-4) : '000'}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}