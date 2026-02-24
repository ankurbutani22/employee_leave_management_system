import React, { useState } from 'react'
import Header from '../components/Header'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:5000/api'

// Helper function to calculate days between dates
function calculateDays(start, end) {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 
  return diffDays > 0 ? diffDays : 0
}

export default function LeaveRequest() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('empToken')

  const daysCount = calculateDays(start, end)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!start || !end) {
      toast.error('Start and end dates required')
      return
    }

    if (new Date(start) > new Date(end)) {
        toast.error('End date cannot be before start date')
        return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          startDate: start,
          endDate: end,
          days: daysCount,
          reason
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to request leave')
      }

      toast.success('Leave request submitted successfully!')
      setStart('')
      setEnd('')
      setReason('')
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Responsive Padding: p-4 for mobile, p-8 for desktop
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Header title="Leave Request" />

      <div className="max-w-4xl mx-auto mt-6 md:mt-8">
        
        {/* Grid stack on mobile (cols-1), side-by-side on desktop (cols-3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Side: Information Card */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-blue-600 text-white p-5 md:p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-2">Policy Note</h3>
                    <p className="text-blue-100 text-sm opacity-90 leading-relaxed">
                        Please submit your leave request at least <strong>3 days in advance</strong>. 
                        Casual leaves are subject to approval by your manager.
                    </p>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Summary</h3>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-bold text-gray-800">{daysCount} Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-gray-600">Type</span>
                         <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded text-xs">Casual Leave</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                         <h3 className="font-bold text-gray-700">New Request Form</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
                        
                        {/* Date Inputs: Stack on mobile, side-by-side on md+ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        value={start} 
                                        onChange={e => setStart(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        value={end} 
                                        onChange={e => setEnd(e.target.value)} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
                            <textarea 
                                value={reason} 
                                onChange={e => setReason(e.target.value)} 
                                rows="4"
                                placeholder="Please describe the reason briefly..."
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Actions: Stack buttons on mobile */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button 
                                type="button" 
                                onClick={() => {setStart(''); setEnd(''); setReason('')}}
                                className="w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors order-2 sm:order-1"
                            >
                                Reset
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 order-1 sm:order-2"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                                {!loading && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
      </div>
    </main>
  )
}