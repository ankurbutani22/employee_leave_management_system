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
        avatar: null // Bob has no image, will show Initial
      },
      { 
        id: 3, 
        name: 'Charlie Day', 
        email: 'charlie@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80' 
      },
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

  useEffect(() => { fetchEmployees() }, [])

  async function fetchEmployees() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch')
      setEmployees(await res.json())
    } catch (err) {
      // Load seed data if API fails so you can see the design
      setEmployees(loadEmployees())
    } finally {
      setLoading(false)
    }
  }

  const remove = (id) => toast.info('Deletion is disabled in this demo')

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
    <div className="bg-slate-50 min-h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Employee Directory</h3>
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
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-200 rounded-lg" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="md:hidden divide-y divide-slate-100">
            {employees.map(emp => (
              <div key={emp._id || emp.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
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
                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">ID: #{emp._id ? emp._id.slice(-4) : emp.id}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-500 break-all">{emp.email}</p>

                <button
                  onClick={() => remove(emp._id || emp.id)}
                  className="w-full text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded text-sm font-medium transition-colors border border-rose-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
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
        </div>
      )}
    </div>
  )
}
