import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { toast } from 'react-toastify'
import { Camera, Save, X, Edit2 } from 'lucide-react' // Make sure you have lucide-react or use text

const API_URL = 'http://localhost:5000/api'

export default function MyProfile() {
  // State
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Data State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState(null) // Current URL
  const [preview, setPreview] = useState(null) // For previewing new upload
  const [file, setFile] = useState(null) // The actual file object

  // Load initial data
  useEffect(() => {
    const storedName = localStorage.getItem('emp_name')
    const storedEmail = localStorage.getItem('emp_email')
    const storedAvatar = localStorage.getItem('emp_avatar')

    setName(storedName || '')
    setEmail(storedEmail || '')
    setAvatar(storedAvatar !== "undefined" ? storedAvatar : null)
  }, [])

  // Handle Image Selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile)) // Create local preview URL
    }
  }

  // Handle Save to Database
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('empToken')
      const formData = new FormData()
      formData.append('name', name)
      if (file) {
        formData.append('image', file)
      }

      const res = await fetch(`${API_URL}/employees/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type here, browser sets it for FormData
        },
        body: formData
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Update failed')

      // Update Local Storage with new data from Database
      localStorage.setItem('emp_name', data.user.name)
      localStorage.setItem('emp_avatar', data.user.avatar)

      // Update State
      setAvatar(data.user.avatar)
      setPreview(null)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
      
      // Optional: Reload to refresh Navbar (or use Context in future)
      window.location.reload() 

    } catch (err) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 bg-gray-50 min-h-screen">
      
      <div className="mt-8 max-w-lg mx-auto bg-gradient-to-br from-gray-100 via-gray-200 to-gray-400 shadow-xl rounded-xl overflow-hidden">
        
        {/* Top Background - Blue Gradient */}
        <div className="h-30 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 relative">
            <h1 className="text-white text-3xl font-bold text-left pt-2 pb-2 tracking-wide drop-shadow-md">
                My Profile
            </h1>
        </div>

        <div className="px-8 pb-10">
          
          <form onSubmit={handleSave}>
            {/* --- Avatar Section --- */}
            <div className="relative -mt-20 mb-8 flex justify-center">
                <div className="relative group pt-8">
                    {/* Image Display */}
                    <img 
                        src={preview || avatar || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                    />
                    
                    {/* Camera Icon Overlay (Only in Edit Mode) */}
                    {isEditing && (
                        <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110">
                            <Camera size={24} />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* --- User Details Section --- */}
            <div className="space-y-6">
                
                {/* Name Field */}
                <div>
                    <label className="block text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                        Full Name
                    </label>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full text-2xl font-bold  text-gray-800 border-b-2 border-blue-500  px-2 py-1 focus:outline-none"
                        />
                    ) : (
                        <h3 className="text-3xl font-bold bg-gray-100 text-gray-800 text-center border-b border-transparent py-1">
                            {name}
                        </h3>
                    )}
                </div>

                {/* Email Field (Read Only) */}
                <div>
                    <label className="block text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                        Email Address
                    </label>
                    <div className="bg-gray-100 p-4 rounded-lg text-lg text-gray-600 font-medium flex items-center gap-3">
                        <span className="text-gray-400">✉️</span>
                        {email}
                    </div>
                    {isEditing && <p className="text-xs text-red-400 mt-1 pl-1">* Email cannot be changed</p>}
                </div>

            </div>

            {/* --- Action Buttons --- */}
            <div className="mt-10 flex justify-center gap-4">
                {isEditing ? (
                    <>
                        <button 
                            type="button"
                            onClick={() => { setIsEditing(false); setPreview(null); }}
                            className="px-6 py-3 rounded-lg text-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2"
                        >
                            <X size={20} /> Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-lg text-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                        </button>
                    </>
                ) : (
                    <button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-10 py-3 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <Edit2 size={20} /> Edit Profile
                    </button>
                )}
            </div>
          </form>

        </div>
      </div>
    </main>
  )
}