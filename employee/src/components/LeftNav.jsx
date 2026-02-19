import React from 'react'
import { NavLink } from 'react-router-dom'

const linkCls = ({isActive}) => {
  return isActive 
      ? "flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg mx-2 transition-colors" 
      : "flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg mx-2 transition-colors"
  }

export default function LeftNav(){
  return (
    <aside className="w-56 bg-gray-100 min-h-screen ">
      <div className="h-16 flex  px-6  bg-blue-50  border shadow-md border-gray-200 items-center">
        <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
          {/* Logo Icon */}
         
          Employee Portal
        </div>
      </div>
      <nav className="space-y-2">
        <NavLink to="/home" className={linkCls}>Home</NavLink>
        <NavLink to="/leave-request" className={linkCls}>Leave Request Form</NavLink>
        <NavLink to="/leave-status" className={linkCls}>Leave Status</NavLink>
        <NavLink to="/my-profile" className={linkCls}>My Profile</NavLink>
      </nav>
    </aside>
  )
}
