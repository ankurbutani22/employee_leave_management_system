import React from 'react'

export default function Footer() {
  return (
    // Added 'mb-24' for mobile to prevent content from hiding behind the fixed Bottom Nav
    <footer className="mt-auto py-6 md:py-8 text-center border-t border-slate-200 mb-20 md:mb-0">
      <p className="text-xs md:text-sm text-slate-400 font-medium">
        © {new Date().getFullYear()} <span className="text-indigo-600">Employee Portal</span>. Built for efficiency.
      </p>
    </footer>
  )
}