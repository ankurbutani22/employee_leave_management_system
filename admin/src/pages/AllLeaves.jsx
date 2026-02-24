import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const API_URL = 'https://employee-leave-management-system-ec0q.onrender.com/api'

export default function AllLeaves() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('adminToken')

  useEffect(() => { fetchLeaves() }, [])

  async function fetchLeaves() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/leaves`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch from database')
      const data = await res.json()
      setLeaves(data)
    } catch (err) {
      console.error(err)
      toast.error(err.message)
      setLeaves([])
    } finally {
      setLoading(false)
    }
  }

  async function update(id, status) {
    try {
      const res = await fetch(`${API_URL}/leaves/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setLeaves(leaves.map(l => l._id === id ? updated : l))
      toast.success(`Request ${status}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700'
      case 'cancelled': return 'bg-rose-100 text-rose-700'
      default: return 'bg-amber-100 text-amber-700'
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Leave Management</h3>
        <p className="text-slate-500 text-sm mt-1">Review and approve time-off requests</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium">No leave requests found</p>
        </div>
      ) : (
        <>
          {/* ───── DESKTOP TABLE (md and above) ───── */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map(l => (
                  <tr key={l._id || l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {l.employee?.name || l.employee}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {l.days} day{l.days !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(l.startDate)} – {formatDate(l.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {l.reason || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {l.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => update(l._id || l.id, 'approved')}
                            className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => update(l._id || l.id, 'cancelled')}
                            className="text-rose-600 hover:bg-rose-50 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ───── MOBILE CARDS (below md) ───── */}
          <div className="flex flex-col gap-4 md:hidden">
            {leaves.map(l => (
              <div key={l._id || l.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                {/* Header row: name + status badge */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-slate-800 truncate pr-2">
                    👤 {l.employee?.name || l.employee || 'Unknown'}
                  </p>
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(l.status)}`}>
                    {l.status}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500 mb-3">
                  <div>
                    <span className="font-semibold text-slate-700 block">Duration</span>
                    {l.days} day{l.days !== 1 ? 's' : ''}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Dates</span>
                    {formatDate(l.startDate)} – {formatDate(l.endDate)}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-700 block">Reason</span>
                    <span className="break-words">{l.reason || '-'}</span>
                  </div>
                </div>

                {/* Action buttons */}
                {l.status === 'pending' ? (
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => update(l._id || l.id, 'approved')}
                      className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => update(l._id || l.id, 'cancelled')}
                      className="flex-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ❌ Decline
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 italic text-center">
                    Request closed
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}