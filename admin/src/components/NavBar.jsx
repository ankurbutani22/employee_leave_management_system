import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/login')
  }

  // Aa style 'LeftNav.jsx' mathi lidheli che
  const linkCls = ({ isActive }) => {
    // Base classes
    let classes = "flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 text-xs md:text-sm font-medium "
    // Active styling
    classes += isActive
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-105 "
      : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 "
    // Mobile alignment (Vertical) vs Desktop (Horizontal row)
    classes += "flex-col md:flex-row justify-center md:justify-start"
    return classes
  }

  return (
    <>
      {/* Mobile Spacer (Content overlap na thay tena mate) */}
      <div className="md:hidden h-20"></div>

      <aside className="
        z-50
        fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe
        md:fixed md:top-0 md:left-0 md:h-screen md:w-64 md:bg-white md:border-r md:shadow-none md:pb-0
        transition-all duration-300
      ">

        {/* Desktop Logo Area (Mobile ma Hidden) */}
        <div className="hidden md:flex h-20 px-6 items-center border-b border-slate-100 mb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-indigo-200 shadow-lg">
              A
            </div>
            <span className="text-lg font-bold text-gray-800 tracking-tight">Admin<span className="text-indigo-600">Portal</span></span>
          </div>
        </div>

        {/* Navigation Links (Admin specific) */}
        <nav className="flex w-full justify-around items-center p-2 md:flex-col md:justify-start md:items-stretch md:px-4 md:space-y-2">

          <NavLink to="/" className={linkCls}>
            {/* Icons tame SVG pan use kari shako, ahya simple emoji che */}
            <span className="text-xl md:text-lg">📊</span>
            <span className="md:inline-block">Overview</span>
          </NavLink>

          <NavLink to="/employees" className={linkCls}>
            <span className="text-xl md:text-lg">👥</span>
            <span className="md:inline-block">Employees</span>
          </NavLink>

          {/* Special Add Button for Mobile Center */}
          <NavLink to="/add-employee" className={linkCls}>
            <span className="text-xl md:text-lg">➕</span>
            <span className="md:inline-block">Add New</span>
          </NavLink>

          <NavLink to="/leaves" className={linkCls}>
            <span className="text-xl md:text-lg">📅</span>
            <span className="md:inline-block">Leaves</span>
          </NavLink>

          <NavLink to="/my-profile" className={linkCls}>
            <span className="text-xl md:text-lg">👤</span>
            <span className="md:inline-block">Profile</span>
          </NavLink>


        </nav>
      </aside>
    </>
  )
}