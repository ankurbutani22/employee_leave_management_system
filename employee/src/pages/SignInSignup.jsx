import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:5000/api'

export default function SignInSignup() {
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  
  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('') 
  const [preview, setPreview] = useState(null) 
  
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        return toast.error('Image size must be less than 2MB')
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setAvatar(reader.result) 
      }
      reader.readAsDataURL(file)
    }
  }

async function handleAuth(e) {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    if (mode === 'signup') {
      formData.append('name', name);
      // જો તમે ફાઇલ સિલેક્ટ કરી હોય
      if (e.target.image && e.target.image.files[0]) {
        formData.append('image', e.target.image.files[0]);
      }
    }

    const endpoint = mode === 'signin' ? 'login' : ''; 
    const res = await fetch(`${API_URL}/employees/${endpoint}`, {
      method: 'POST',
      body: mode === 'signin' ? JSON.stringify({ email, password }) : formData,
      ...(mode === 'signin' && { headers: { 'Content-Type': 'application/json' } })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Auth failed');

    if (mode === 'signin') {
      localStorage.setItem('empToken', data.token);
      localStorage.setItem('emp_name', data.name);
      localStorage.setItem('emp_email', data.email);
      localStorage.setItem('emp_avatar', data.avatar);
      localStorage.setItem('emp_auth', 'true');
      toast.success('Login Successful!');
      navigate('/');
    } else {
      toast.success('Registration Successful! Please Login.');
      setMode('signin');
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        {/* Responsive Padding: p-6 for mobile, md:p-8 for desktop */}
        <div className="bg-indigo-600 p-6 md:p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            {/* Responsive Font Size: text-2xl for mobile, md:text-3xl for desktop */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-indigo-100 text-sm">
              {mode === 'signin' 
                ? 'Enter your credentials to access your dashboard' 
                : 'Join our team management portal today'}
            </p>
          </div>
          {/* Background Decor */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Form Section */}
        {/* Responsive Padding here as well */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* --- SIGN UP FIELDS --- */}
            {mode === 'signup' && (
              <>
                {/* Image Upload Area */}
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        name="image" 
                        className="hidden" 
                        onChange={handleImageChange} 
                      />
                      <div className={`w-24 h-24 rounded-full border-4 border-slate-100 shadow-sm flex items-center justify-center overflow-hidden transition-colors ${!preview ? 'bg-slate-50 hover:bg-slate-100' : 'bg-white'}`}>
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                          </div>
                        )}
                      </div>
                      {/* Plus Icon Overlay */}
                      <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 shadow-md border-2 border-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* --- COMMON FIELDS --- */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  setPreview(null) // Reset image on toggle
                  setAvatar('')
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}