import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SignInSignup from './pages/SignInSignup'
import Home from './pages/Home'
import LeaveRequest from './pages/LeaveRequest'
import LeaveStatus from './pages/LeaveStatus'
import MyProfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LeftNav from './components/LeftNav'

function RequireAuth({ children }) {
  const auth = localStorage.getItem('emp_auth') === 'true'
  return auth ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<SignInSignup />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={
          <RequireAuth>
            <div className="flex flex-1">
              <LeftNav />
              <div className="flex-1 md:ml-64">
                <Navbar />
                <Home />
                <Footer />
              </div>
            </div>
          </RequireAuth>
        } />
        <Route path="/leave-request" element={
          <RequireAuth>
            <div className="flex">
              <LeftNav />
              <div className="flex-1 md:ml-64"><Navbar /><LeaveRequest /><Footer /></div>
            </div>
          </RequireAuth>
        } />
        <Route path="/leave-status" element={
          <RequireAuth>
            <div className="flex"><LeftNav /><div className="flex-1 md:ml-64"><Navbar /><LeaveStatus /><Footer /></div></div>
          </RequireAuth>
        } />
        <Route path="/my-profile" element={
          <RequireAuth>
            <div className="flex"><LeftNav /><div className="flex-1 md:ml-64"><Navbar /><MyProfile /><Footer /></div></div>
          </RequireAuth>
        } />

      </Routes>
    </div>
  )
}
