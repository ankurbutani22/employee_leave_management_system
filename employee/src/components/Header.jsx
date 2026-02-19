import React from 'react'

export default function Header({title}){
  return (
    <div className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  )
}
