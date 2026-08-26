import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config';
import { ClipLoader } from 'react-spinners';
function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
      console.log(result)
      setErr("")
      setStep(2)
      setLoading(false)
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }
  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })
      console.log(result)
      setErr("")
      setStep(3)
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }
  const handleResetPassword = async () => {
    if (newPassword != confirmPassword) {
      return null
    }
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
      setErr("")
      console.log(result)
      setLoading(false)
      navigate("/signin")
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }
  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-pink-50'>
      {/* Animated background orbs */}
      <div className='absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-red-300/20 to-transparent rounded-full blur-3xl animate-pulse'></div>

      <div className='relative z-10 backdrop-blur-xl bg-gradient-to-br from-white/90 to-orange-50/50 rounded-3xl shadow-2xl shadow-orange-200/30 w-full max-w-md p-8 border-2 border-white/50'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <button onClick={() => navigate("/signin")} className='p-2 hover:bg-orange-100/50 rounded-full transition-all duration-300 hover:scale-110'>
            <IoIosArrowRoundBack size={30} className='text-orange-600 hover:text-orange-700' />
          </button>
          <h1 className='text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent'>Forgot Password</h1>
        </div>

        {/* Step 1: Enter Email */}
        {step == 1 && (
          <div className='space-y-6 animate-fadeIn'>
            <div className='bg-gradient-to-br from-orange-100/30 to-pink-100/20 p-4 rounded-2xl border border-orange-100/50'>
              <p className='text-gray-600 text-sm font-medium'>Enter your email to receive an OTP</p>
            </div>

            <div>
              <label className='block text-gray-700 font-bold mb-3 text-lg'>Email Address</label>
              <input
                type="email"
                className='w-full px-5 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg'
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              className='w-full font-bold py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-2xl hover:shadow-orange-300/50 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Send OTP"}
            </button>

            {err && <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-lg'>
              <p className='text-red-600 font-semibold'>⚠️ {err}</p>
            </div>}
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step == 2 && (
          <div className='space-y-6 animate-fadeIn'>
            <div className='bg-gradient-to-br from-blue-100/30 to-cyan-100/20 p-4 rounded-2xl border border-blue-100/50'>
              <p className='text-gray-600 text-sm font-medium'>We've sent an OTP to <span className='font-bold text-gray-800'>{email}</span></p>
            </div>

            <div>
              <label className='block text-gray-700 font-bold mb-3 text-lg'>Enter OTP</label>
              <input
                type="text"
                className='w-full px-5 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-bold text-center text-2xl tracking-widest shadow-md hover:shadow-lg'
                placeholder='000000'
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            <button
              className='w-full font-bold py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-2xl hover:shadow-blue-300/50 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Verify OTP"}
            </button>

            {err && <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-lg'>
              <p className='text-red-600 font-semibold'>⚠️ {err}</p>
            </div>}
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step == 3 && (
          <div className='space-y-6 animate-fadeIn'>
            <div className='bg-gradient-to-br from-green-100/30 to-emerald-100/20 p-4 rounded-2xl border border-green-100/50'>
              <p className='text-gray-600 text-sm font-medium'>Create a new secure password</p>
            </div>

            <div>
              <label className='block text-gray-700 font-bold mb-3 text-lg'>New Password</label>
              <input
                type="password"
                className='w-full px-5 py-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg'
                placeholder='Enter new password'
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div>
              <label className='block text-gray-700 font-bold mb-3 text-lg'>Confirm Password</label>
              <input
                type="password"
                className='w-full px-5 py-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg'
                placeholder='Confirm password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg'>
                <p className='text-yellow-600 font-semibold'>⚠️ Passwords do not match</p>
              </div>
            )}

            <button
              className='w-full font-bold py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-2xl hover:shadow-green-300/50 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              onClick={handleResetPassword}
              disabled={loading || newPassword !== confirmPassword}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Reset Password"}
            </button>

            {err && <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-lg'>
              <p className='text-red-600 font-semibold'>⚠️ {err}</p>
            </div>}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ForgotPassword
