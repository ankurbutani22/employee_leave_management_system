import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:5000/api'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Provide credentials')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message || 'Login failed')
        return
      }
      
      const data = await res.json()
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminEmail', email)
      toast.success('Logged in')
      navigate('/employees')
    } catch (err) {
      toast.error('Connection error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <label className="block mb-2">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  )
}
