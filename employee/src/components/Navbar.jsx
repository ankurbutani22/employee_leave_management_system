import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  
  // 1. Get email AND avatar from local storage
  const userEmail = localStorage.getItem('emp_email') || 'Guest'
  const userAvatar = localStorage.getItem('emp_avatar') // Retrieve the image URL

  function logout() {
    localStorage.removeItem('emp_auth')
    localStorage.removeItem('empToken')
    localStorage.removeItem('emp_email')
    localStorage.removeItem('emp_avatar') // Clear avatar on logout
    navigate('/auth')
  }

  return (
    <header className="h-16 bg-blue-50 shadow-md border border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10">
      
      <div className="flex items-center gap-4">
        
        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          {/* Name & Role */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700">{userEmail}</p>
            <p className="text-xs text-gray-500 font-medium">Employee</p>
          </div>
          
          {/* Avatar Logic: Show Image if available, else show Initial */}
          {userAvatar && userAvatar !== "undefined" ? (
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
              {userEmail.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Separator Line */}
        <div className="h-8 w-px bg-gray-300 mx-2"></div>

        {/* Logout Button */}
        <button 
          onClick={logout} 
          className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <span className="text-sm font-medium hidden md:block group-hover:text-red-600">Logout</span>
          {/* Logout Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-2.062a.75.75 0 0 0 0-1.061l-2.06-2.06m2.06 2.06H8.25" />
          </svg>
        </button>
      </div>
    </header>
  )
}