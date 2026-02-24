import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const navigate = useNavigate()

  // Admin Data Melvo
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin'
  // Admin nu first letter avatar mate
  const adminInitial = adminEmail.charAt(0).toUpperCase()

  function logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/login')
  }

  return (
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between md:justify-end transition-all">

      {/* Mobile Logo (Visible only on mobile - same as Employee Navbar) */}
      <div className="md:hidden flex items-center gap-2 font-bold text-slate-800">
        <span className="text-indigo-600 text-xl">⚡</span>
        <span>Admin<span className="text-indigo-600">Portal</span></span>
      </div>

      <div className="flex items-center gap-3 md:gap-6">

        {/* User Info Pill (Employee style applied to Admin) */}
        <div className="flex items-center gap-3 pl-4 py-1.5 pr-1.5 bg-slate-50 border border-slate-100 rounded-full transition-all hover:border-indigo-100 hover:shadow-sm cursor-pointer">
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{adminEmail}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Administrator</p>
          </div>

          {/* Admin Avatar */}
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-sm ring-2 ring-white">
            {adminInitial}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

        {/* Logout Button (Same design as Employee Navbar) */}
        <button
          onClick={logout}
          className="p-2 md:px-4 md:py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 group"
          title="Logout"
        >
          <span className="text-sm font-semibold hidden md:block">Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-5 md:h-5 transition-transform group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-2.062a.75.75 0 0 0 0-1.061l-2.06-2.06m2.06 2.06H8.25" />
          </svg>
        </button>

      </div>

    </header>
  )
}