import React from 'react'

export default function Header({ title }) {
  return (
    // Responsive Padding and Layout
    <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        <div className="h-1 w-12 bg-indigo-500 rounded-full mt-2"></div>
      </div>
      
      {/* Optional: Date display */}
      <div className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm hidden sm:block">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}