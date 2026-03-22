import React, { useState } from 'react'
import { toast } from 'react-toastify'

// Backend API base URL
const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function AddEmployee() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)      // Store selected image
  const [preview, setPreview] = useState(null)  // Show image preview
  const [loading, setLoading] = useState(false)
  
  const token = localStorage.getItem('adminToken')

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file)) // Create preview URL for image
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    
    // 1. Validation
    if (!name || !email || !password) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    
    // 2. Build FormData (JSON does not work for image upload)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    
    if (image) {
      formData.append('image', image) // Attach image file
    }

    try {
      const res = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json', <--- Do not set this when sending FormData
          'Authorization': `Bearer ${token}`
        },
        body: formData // Send FormData in request body
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message || 'Failed to add employee')
        return
      }

      toast.success('Employee added successfully! 🎉')
      
      // 3. Reset Form
      setName('')
      setEmail('')
      setPassword('')
      setImage(null)
      setPreview(null)

    } catch (err) {
      toast.error('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Page layout (center alignment)
    <div className="min-h-[80vh] flex items-center  justify-center p-2">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header (Blue Top Bar) */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-center text-white">
          <h3 className="text-2xl font-bold mb-6">Add New Employee</h3>
         
        </div>

        <form onSubmit={handleAdd} className="p-6 space-y-6">
          
          {/* --- Image Upload Circle --- */}
          <div className="flex flex-col items-center justify-center -mt-16 mb-8">
            <div className="relative group">
              {/* Circle Container */}
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  // Default Icon if no image
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                )}
              </div>
              
              {/* Edit/Upload Button (Small Blue Circle) */}
              <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-all transform group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              </label>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
            <p className="mt-3 text-sm text-gray-500 font-medium">Upload Profile Photo</p>
          </div>

          {/* --- Inputs --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
                placeholder="Ex: Rahul Patel" 
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <input 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
                placeholder="rahul@example.com" 
              />
            </div>

            {/* Password */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type="password" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {/* --- Submit Button --- */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform mt-6 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:scale-[1.01]'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Employee Account'}
          </button>

        </form>
      </div>
    </div>
  )
}
