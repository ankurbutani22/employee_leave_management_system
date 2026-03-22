import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function loadEmployees() {
  const raw = localStorage.getItem('employees')
  if (!raw) {
    const seed = [
      {
        id: 1,
        name: 'Alice Smith',
        email: 'alice@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 2,
        name: 'Bob Jones',
        email: 'bob@example.com',
        avatar: null
      },
      {
        id: 3,
        name: 'Charlie Day',
        email: 'charlie@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
      }
    ]
    localStorage.setItem('employees', JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw)
}

export default function AllEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch')
      setEmployees(await res.json())
    } catch (err) {
      // Keep fallback data for demo mode when API is unavailable.
      setEmployees(loadEmployees())
    } finally {
      setLoading(false)
    }
  }

  const remove = () => toast.info('Deletion is disabled in this demo')

  const getShortId = (emp) => {
    const id = emp._id || emp.id || ''
    const text = String(id)
    return text.length > 6 ? text.slice(-6) : text
  }

  const exportToCSV = () => {
    if (employees.length === 0) {
      toast.warn('No employees to export')
      return
    }

    const headers = ['System ID,Name,Email']
    const rows = employees.map((emp) => {
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
    <div className="bg-slate-50 min-h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Employee Directory</h3>
          <p className="text-slate-500 text-sm mt-1">Manage system access and users</p>
        </div>

        <button
          onClick={exportToCSV}
          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export List
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-200 rounded-lg" />)}
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-slate-700 font-medium">No employees found</p>
          <p className="text-slate-500 text-sm mt-1">Add an employee to see them listed here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2.5 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {employees.map((emp) => (
              <div key={emp._id || emp.id} className="border border-slate-200 rounded-xl p-3.5 sm:p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 h-11 w-11">
                      {emp.avatar ? (
                        <img className="h-11 w-11 rounded-full object-cover border border-slate-200" src={emp.avatar} alt="" />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate" title={emp.name}>{emp.name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">ID: #{getShortId(emp)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(emp._id || emp.id)}
                    className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded text-xs font-semibold transition-colors border border-rose-100 shrink-0"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Contact</p>
                  <p className="text-sm text-slate-600 truncate mt-0.5" title={emp.email}>{emp.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
