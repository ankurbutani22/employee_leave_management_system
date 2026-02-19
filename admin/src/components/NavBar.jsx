import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/login')
  }

  // Helper for active link styling
  const getLinkClass = ({ isActive }) => {
    return isActive 
      ? "flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg mx-2 transition-colors" 
      : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg mx-2 transition-colors"
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 border-r border-gray-200 flex flex-col z-50">
      
      {/* 1. Logo Area */}
      <div className="h-16 flex px-6 bg-blue-50 border shadow-md border-gray-200 items-center">
        <div className="text-xl font-bold text-blue-600 flex items-center gap-2">      
          Admin Portal
        </div>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 w-full py-6 space-y-1 overflow-y-auto">
        
        {/* --- NEW: Home Link --- */}
        <NavLink to="/" className={getLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Home
        </NavLink>

        <NavLink to="/employees" className={getLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          Employees
        </NavLink>

        <NavLink to="/leaves" className={getLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Leaves
        </NavLink>

        <NavLink to="/add-employee" className={getLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Add Employee
        </NavLink>

        <NavLink to="/my-profile" className={getLinkClass}>
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           My Profile
        </NavLink>

      </nav>

      {/* 3. Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </aside>
  )
}