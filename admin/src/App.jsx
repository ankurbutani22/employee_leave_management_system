import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Login from './pages/Login'
import Home from './pages/Home' 
import AllEmployees from './pages/AllEmployees'
import AllLeaves from './pages/AllLeaves'
import AddEmployee from './pages/AddEmployee'
import MyProfile from './pages/MyProfile'

// Import your new responsive layout
// Ensure AdminLayout.jsx is in your 'components' folder, or adjust path if it's in 'src'
import AdminLayout from './components/AdminLayout' //

export default function App() {
  // Auth Check Wrapper
  const ProtectedRoute = ({ children }) => {
    const auth = localStorage.getItem('adminToken')
    if (!auth) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Wrap Admin Routes with the Responsive Layout */}
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
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