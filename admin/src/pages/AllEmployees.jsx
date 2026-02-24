import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const API_URL = 'https://employee-leave-management-system-ec0q.onrender.com/api'

export default function AllEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('adminToken')

  useEffect(() => { fetchEmployees() }, [])

  async function fetchEmployees() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch from database')
      const data = await res.json()
      setEmployees(data)
    } catch (err) {
      console.error(err)
      toast.error(err.message)
      setEmployees([]) // Show empty list on error instead of dummy data
    } finally {
      setLoading(false)
    }
  }


  const remove = async (id) => {
    // 1. Confirm before deleting
    if (!window.confirm("Are you sure? This will delete the employee and all their leave records.")) return

    try {
      // 2. Make API Call
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to delete')
      }

      // 3. Update UI (Filter out the deleted employee)
      setEmployees(employees.filter(emp => (emp._id || emp.id) !== id))
      toast.success('Employee deleted successfully')

    } catch (err) {
      toast.error(err.message)
    }
  }
  const exportToCSV = () => {
    if (employees.length === 0) {
      toast.warn('No employees to export')
      return
    }
    const headers = ['System ID,Name,Email']
    const rows = employees.map(emp => {
      const id = emp._id || emp.id
      const name = `"${emp.name}"`
      const email = emp.email
      return `${id},${name},${email}`
    })
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `employee_list_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Employee list downloaded!')
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Employee Directory</h3>
          <p className="text-slate-500 text-sm mt-1">Manage system access and users</p>
        </div>

        <button
          onClick={exportToCSV}
          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export List
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-200 rounded-lg" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System ID</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => (
                <tr key={emp._id || emp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">

                      {/* Avatar Logic */}
                      <div className="flex-shrink-0 h-10 w-10">
                        {emp.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-slate-200"
                            src={emp.avatar}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <span className="font-medium text-slate-700">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{emp._id ? emp._id.slice(-4) : emp.id}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => remove(emp._id || emp.id)}
                      className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}