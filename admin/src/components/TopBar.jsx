import React from 'react'

export default function TopBar() {
  // લોકલ સ્ટોરેજમાંથી નામ/ઈમેઈલ લાવો
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin User'

  return (
    
    <header className="h-16 bg-blue-50 shadow-md border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10">
      
     
      <div className="flex items-center gap-4">
        
        
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-700">{adminEmail}</p>
          <p className="text-xs text-gray-500 font-medium">Administrator</p>
        </div>
        
        
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white ring-1 ring-gray-100 cursor-pointer">
          {adminEmail.charAt(0).toUpperCase()}
        </div>

      </div>
    </header>
  )
}