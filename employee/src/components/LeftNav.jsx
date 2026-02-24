import React from 'react'
import { NavLink } from 'react-router-dom'

export default function LeftNav() {
  const linkCls = ({ isActive }) => {
    // Base classes
    let classes = "flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 text-xs md:text-sm font-medium "
    // Active styling
    classes += isActive
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-105 "
      : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 "
    // Mobile alignment (Vertical stack) vs Desktop alignment (Horizontal row)
    classes += "flex-col md:flex-row justify-center md:justify-start"
    return classes
  }

  return (
    <>
      {/* Mobile Spacer to prevent content overlap */}
      <div className="md:hidden h-20"></div>

      <aside className="
        z-50
        fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe
        md:fixed md:top-0 md:left-0 md:h-screen md:w-64 md:bg-white md:border-r md:shadow-none md:pb-0
        transition-all duration-300
      ">

        {/* Desktop Logo Area (Hidden on Mobile) */}
        <div className="hidden md:flex h-20 px-6 items-center border-b border-slate-100 mb-4 sticky  transition-all">
          <div className="flex items-center gap-3 text-indigo-600">
            <span className="text-3xl">⚡</span>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">HR<span className="text-indigo-600">Portal</span></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex w-full justify-around items-center p-2 md:flex-col md:justify-start md:items-stretch md:px-4 md:space-y-2">

          <NavLink to="/home" className={linkCls}>
            <span className="text-xl md:text-lg">🏠</span>
            <span className="md:inline-block">Dashboard</span>
          </NavLink>

          <NavLink to="/leave-request" className={linkCls}>
            <span className="text-xl md:text-lg">📝</span>
            <span className="md:inline-block">Request</span>
          </NavLink>

          <NavLink to="/leave-status" className={linkCls}>
            <span className="text-xl md:text-lg">🕒</span>
            <span className="md:inline-block">History</span>
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