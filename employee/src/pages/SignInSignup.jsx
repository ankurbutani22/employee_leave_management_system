import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function SignInSignup() {
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [role, setRole] = useState('employee') // 'employee' or 'admin'

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
      if (role === 'admin' && mode === 'signup') {
        toast.error('Admin signup is not allowed from here');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      if (mode === 'signup') {
        formData.append('name', name);
        if (e.target.image && e.target.image.files[0]) {
          formData.append('image', e.target.image.files[0]);
        }
      }

      let url = `${API_URL}/employees/${mode === 'signin' ? 'login' : ''}`;
      if (role === 'admin') {
        url = `${API_URL}/admin/login`;
      }

      const res = await fetch(url, {
        method: 'POST',
        body: mode === 'signin' ? JSON.stringify({ email, password }) : formData,
        ...(mode === 'signin' && { headers: { 'Content-Type': 'application/json' } })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');

      if (mode === 'signin') {
        if (role === 'admin') {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminEmail', email);
          toast.success('Admin Login Successful!');
          window.location.href = '/admin';
        } else {
          localStorage.setItem('empToken', data.token);
          localStorage.setItem('emp_name', data.name);
          localStorage.setItem('emp_email', data.email);
          localStorage.setItem('emp_avatar', data.avatar);
          localStorage.setItem('emp_auth', 'true');
          toast.success('Employee Login Successful!');
          navigate('/');
        }
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">

        {/* Header Section */}
        <div className={`p-8 text-center relative overflow-hidden transition-colors duration-500 ${role === 'admin' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === 'signin' ? 'Portal Login' : 'Create Account'}
            </h2>
            <p className="text-white/80 text-sm">
              {mode === 'signin'
                ? `Enter credentials to access the ${role} panel`
                : 'Join our team management portal today'}
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Role Selector */}
          {mode === 'signin' && (
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                onClick={() => setRole('employee')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'employee' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Employee
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Admin
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">

            {/* --- SIGN UP FIELDS --- */}
            {mode === 'signup' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <label className="cursor-pointer">
                      <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div className={`w-20 h-20 rounded-full border-4 border-slate-100 shadow-sm flex items-center justify-center overflow-hidden transition-colors ${!preview ? 'bg-slate-50 hover:bg-slate-100' : 'bg-white'}`}>
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-[8px] font-bold uppercase tracking-wider">Upload</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 shadow-md border-2 border-white">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
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
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 ${role === 'admin' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
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
              {mode === 'signin' ? "Need an employee account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  setRole('employee') // Reset to employee on signup mode
                  setPreview(null)
                  setAvatar('')
                }}
                className={`font-bold transition-colors ${role === 'admin' ? 'text-rose-600 hover:text-rose-800' : 'text-indigo-600 hover:text-indigo-800'}`}
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
