import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Login from './pages/Login'
import Home from './pages/Home' // <--- Import the new Home page
import AllEmployees from './pages/AllEmployees'
import AllLeaves from './pages/AllLeaves'
import AddEmployee from './pages/AddEmployee'
import MyProfile from './pages/MyProfile'

// Components
import Sidebar from './components/NavBar'
import TopBar from './components/TopBar'

// Layout Component
function AdminLayout() {
  const auth = localStorage.getItem('adminToken')
  if (!auth) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Layout */}
        <Route element={<AdminLayout />}>
          {/* Change this line to point to Home instead of Navigate */}
          <Route path="/" element={<Home />} /> 
          
          <Route path="/employees" element={<AllEmployees />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/leaves" element={<AllLeaves />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Route>
      </Routes>
    </div>
  )
}