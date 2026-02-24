import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { toast } from 'react-toastify'
import { Camera, Save, X, Edit2 } from 'lucide-react'

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
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('empToken')
      if (!token) return

      const res = await fetch(`${API_URL}/employees/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Could not fetch profile')

      const data = await res.json()
      setName(data.name || '')
      setEmail(data.email || '')
      setAvatar(data.avatar || null)

      // Keep local storage in sync as fallback
      localStorage.setItem('emp_name', data.name)
      localStorage.setItem('emp_email', data.email)
      localStorage.setItem('emp_avatar', data.avatar)
    } catch (err) {
      console.error(err)
      // Fallback to localStorage if API fails
      setName(localStorage.getItem('emp_name') || '')
      setEmail(localStorage.getItem('emp_email') || '')
      setAvatar(localStorage.getItem('emp_avatar'))
    }
  }


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

      // Optional: Reload to refresh Navbar
      window.location.reload()

    } catch (err) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Responsive Padding: p-4 for mobile, p-8 for desktop
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">

      {/* Card Container: Responsive margins and width */}
      <div className="mt-4 md:mt-8 max-w-lg mx-auto bg-gradient-to-br from-gray-100 via-gray-200 to-gray-400 shadow-xl rounded-xl overflow-hidden">

        {/* Top Background - Responsive Height */}
        <div className="h-28 md:h-32 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 relative flex items-center px-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md">
            My Profile
          </h1>
        </div>

        <div className="px-4 md:px-8 pb-8 md:pb-10">

          <form onSubmit={handleSave}>
            {/* --- Avatar Section --- */}
            {/* Responsive negative margin and sizing */}
            <div className="relative -mt-16 md:-mt-20 mb-6 md:mb-8 flex justify-center">
              <div className="relative group pt-4 md:pt-8">
                {/* Image Display: Smaller on mobile */}
                <img
                  src={preview || avatar || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                />

                {/* Camera Icon Overlay */}
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 md:p-3 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110">
                    <Camera size={20} className="md:w-6 md:h-6" />
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
            <div className="space-y-4 md:space-y-6">

              {/* Name Field */}
              <div>
                <label className="block text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-blue-500 px-2 py-1 focus:outline-none bg-transparent"
                  />
                ) : (
                  // Responsive text size and truncation
                  <h3 className="text-2xl md:text-3xl font-bold bg-gray-100/50 rounded text-gray-800 text-center border border-transparent py-2 truncate">
                    {name}
                  </h3>
                )}
              </div>

              {/* Email Field (Read Only) */}
              <div>
                <label className="block text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                {/* Responsive padding and text size */}
                <div className="bg-gray-100 p-3 md:p-4 rounded-lg text-base md:text-lg text-gray-600 font-medium flex items-center gap-3 overflow-hidden">
                  <span className="text-gray-400 shrink-0">✉️</span>
                  <span className="truncate">{email}</span>
                </div>
                {isEditing && <p className="text-xs text-red-400 mt-1 pl-1">* Email cannot be changed</p>}
              </div>

            </div>

            {/* --- Action Buttons --- */}
            {/* Flex-col for mobile (stacking), Flex-row for desktop */}
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="w-full sm:w-auto px-6 py-2.5 md:py-3 rounded-lg text-base md:text-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors flex justify-center items-center gap-2 order-2 sm:order-1"
                  >
                    <X size={20} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-2.5 md:py-3 rounded-lg text-base md:text-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 order-1 sm:order-2"
                  >
                    {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-10 py-2.5 md:py-3 rounded-lg text-base md:text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2"
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