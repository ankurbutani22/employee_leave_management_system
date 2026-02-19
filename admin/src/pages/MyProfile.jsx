import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({ 
    name: 'Admin User', 
    email: 'admin@company.com', 
    role: 'Administrator',
    phone: '+1 (555) 0123-4567',
    department: 'Human Resources'
  })

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Profile updated successfully')
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex justify-center items-start pt-12">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Header */}
        <div className="relative px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-md">
              {user.name.charAt(0)}
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-500 font-medium">{user.role}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={e => setUser({...user, name: e.target.value})}
                  className="w-full border-b-2 border-indigo-200 focus:border-indigo-600 outline-none py-1 text-slate-700 bg-transparent transition-colors"
                />
              ) : (
                <p className="text-lg text-slate-700 font-medium">{user.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <p className="text-lg text-slate-700 font-medium">{user.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
              <p className="text-lg text-slate-700 font-medium">{user.department}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={user.phone} 
                  onChange={e => setUser({...user, phone: e.target.value})}
                  className="w-full border-b-2 border-indigo-200 focus:border-indigo-600 outline-none py-1 text-slate-700 bg-transparent transition-colors"
                />
              ) : (
                <p className="text-lg text-slate-700 font-medium">{user.phone}</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md shadow-indigo-200 transition-all transform active:scale-95"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}