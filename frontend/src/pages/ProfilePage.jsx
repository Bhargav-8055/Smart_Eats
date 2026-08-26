import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSave, FaTimes, FaShoppingBag, FaCrown } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../config'
import toast from 'react-hot-toast'

function ProfilePage() {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { myOrders } = useSelector(state => state.user)

    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState({
        fullName: userData?.fullName || '',
        email: userData?.email || '',
        mobile: userData?.mobile || ''
    })

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedData({
            fullName: userData?.fullName || '',
            email: userData?.email || '',
            mobile: userData?.mobile || ''
        })
    }

    const handleSave = async () => {
        try {
            const response = await axios.put(`${serverUrl}/api/user/update-profile`, editedData, { withCredentials: true })
            toast.success('Profile updated successfully!')
            setIsEditing(false)
            window.location.reload()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        }
    }

    const handleChange = (e) => {
        setEditedData({
            ...editedData,
            [e.target.name]: e.target.value
        })
    }

    const getMemberSince = () => {
        if (!userData?.createdAt) return 'Recently'
        const date = new Date(userData.createdAt)
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    const getRoleBadgeColor = (role) => {
        const colors = {
            user: 'from-blue-500 to-blue-600',
            owner: 'from-orange-500 to-red-600',
            deliveryBoy: 'from-green-500 to-emerald-600'
        }
        return colors[role] || 'from-gray-500 to-gray-600'
    }

    const getRoleIcon = (role) => {
        const icons = {
            user: '👤',
            owner: '🍽️',
            deliveryBoy: '🚚'
        }
        return icons[role] || '👤'
    }

    const getRoleLabel = (role) => {
        const labels = {
            user: 'Customer',
            owner: 'Restaurant Owner',
            deliveryBoy: 'Delivery Agent'
        }
        return labels[role] || 'User'
    }

    if (!userData) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40'>
                <p className='text-xl text-gray-600'>Loading...</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40 relative overflow-hidden'>
            {/* Animated Background Orbs */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
                <div className='absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-blob'></div>
                <div className='absolute top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-3xl animate-blob animation-delay-2000'></div>
                <div className='absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-br from-red-400/30 to-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-4000'></div>
            </div>

            {/* Floating Particles */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className='absolute w-1.5 h-1.5 bg-orange-400/20 rounded-full'
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Header */}
            <div className='bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-orange-100'>
                <div className='max-w-5xl mx-auto px-6 py-6'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => navigate("/")}
                            className='p-2.5 hover:bg-orange-50 rounded-full transition-colors text-gray-600 group'
                        >
                            <IoIosArrowRoundBack size={32} className='text-[#ff4d2d] group-hover:-translate-x-1 transition-transform duration-300' />
                        </button>
                        <div className='flex items-center gap-4'>
                            <div className='relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur opacity-30'></div>
                                <div className='relative w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30'>
                                    <FaUser className='text-white' size={20} />
                                </div>
                            </div>
                            <div>
                                <h1 className='text-3xl font-black text-gray-900 tracking-tight'>My Profile</h1>
                                <p className='text-sm text-gray-500 font-medium mt-0.5'>Manage your account information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-5xl mx-auto px-6 py-8 relative z-10'>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className='mb-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:bg-white transition-all duration-200 border border-orange-100 text-gray-700 hover:text-orange-600'
                >
                    <IoIosArrowRoundBack size={24} />
                    <span className='font-semibold'>Back to Home</span>
                </button>

                {/* Profile Header Card */}
                <div className='bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-orange-100 mb-8'>
                    <div className='relative h-56 bg-[url("/profile_banner.png")] bg-cover bg-center'>
                        <div className='absolute inset-0 bg-black/10'></div>
                    </div>

                    <div className='px-8 pb-8 -mt-20 relative'>
                        {/* Avatar */}
                        <div className='flex flex-col sm:flex-row items-center sm:items-end gap-6'>
                            <div className='relative'>
                                <div className='w-40 h-40 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl shadow-orange-500/40 flex items-center justify-center border-4 border-white'>
                                    <span className='text-7xl'>{getRoleIcon(userData.role)}</span>
                                </div>
                                <div className='absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg'>
                                    <div className={`w-10 h-10 bg-gradient-to-br ${getRoleBadgeColor(userData.role)} rounded-full flex items-center justify-center`}>
                                        <FaCrown className='text-white' size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className='flex-1 text-center sm:text-left pt-20'>
                                <h2 className='text-4xl font-black text-gray-900 mb-4'>{userData.fullName}</h2>
                                <div className='flex flex-wrap items-center justify-center sm:justify-start gap-3'>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getRoleBadgeColor(userData.role)} shadow-lg`}>
                                        <span>{getRoleIcon(userData.role)}</span>
                                        {getRoleLabel(userData.role)}
                                    </span>
                                    <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-700 bg-gray-100'>
                                        <FaCalendar size={12} />
                                        Member since {getMemberSince()}
                                    </span>
                                </div>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105'
                                >
                                    <FaEdit size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-100 shadow-xl shadow-blue-500/10 hover:shadow-2xl transition-shadow duration-300'>
                        <div className='flex items-center gap-4'>
                            <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30'>
                                <FaShoppingBag className='text-white' size={24} />
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>Total Orders</p>
                                <p className='text-3xl font-black text-gray-900'>{myOrders?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-xl shadow-purple-500/10 hover:shadow-2xl transition-shadow duration-300'>
                        <div className='flex items-center gap-4'>
                            <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30'>
                                <FaCrown className='text-white' size={24} />
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>Role</p>
                                <p className='text-2xl font-black text-gray-900'>{getRoleLabel(userData.role)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100 shadow-xl shadow-green-500/10 hover:shadow-2xl transition-shadow duration-300'>
                        <div className='flex items-center gap-4'>
                            <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30'>
                                <FaCalendar className='text-white' size={24} />
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>Account Age</p>
                                <p className='text-2xl font-black text-gray-900'>{getMemberSince()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Section */}
                <div className='bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-orange-100'>
                    <div className='px-8 py-6 bg-gradient-to-r from-orange-50 to-red-50/30 border-b border-orange-100'>
                        <h3 className='text-xl font-black text-gray-900 flex items-center gap-3'>
                            <FaUser className='text-orange-600' />
                            Personal Information
                        </h3>
                    </div>

                    <div className='p-8 space-y-6'>
                        {/* Full Name */}
                        <div>
                            <label className='text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 block'>Full Name</label>
                            {isEditing ? (
                                <input
                                    type='text'
                                    name='fullName'
                                    value={editedData.fullName}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-semibold text-gray-900'
                                />
                            ) : (
                                <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl'>
                                    <FaUser className='text-orange-600' size={18} />
                                    <span className='text-lg font-bold text-gray-900'>{userData.fullName}</span>
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className='text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 block'>Email Address</label>
                            {isEditing ? (
                                <input
                                    type='email'
                                    name='email'
                                    value={editedData.email}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-semibold text-gray-900'
                                />
                            ) : (
                                <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl'>
                                    <FaEnvelope className='text-orange-600' size={18} />
                                    <span className='text-lg font-semibold text-gray-700'>{userData.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className='text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 block'>Mobile Number</label>
                            {isEditing ? (
                                <input
                                    type='tel'
                                    name='mobile'
                                    value={editedData.mobile}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-semibold text-gray-900'
                                />
                            ) : (
                                <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl'>
                                    <FaPhone className='text-orange-600' size={18} />
                                    <span className='text-lg font-semibold text-gray-700'>{userData.mobile}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons (Edit Mode) */}
                        {isEditing && (
                            <div className='flex gap-4 pt-4'>
                                <button
                                    onClick={handleSave}
                                    className='flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105'
                                >
                                    <FaSave size={16} />
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className='flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all duration-300 hover:scale-105'
                                >
                                    <FaTimes size={16} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }
        
        .animate-blob {
          animation: blob 20s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    )
}

export default ProfilePage
