import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../config';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
function CreateEditShop() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { currentCity, currentState, currentAddress } = useSelector(state => state.user)
    const [name, setName] = useState(myShopData?.name || "")
    const [address, setAddress] = useState(myShopData?.address || currentAddress)
    const [city, setCity] = useState(myShopData?.city || currentCity)
    const [state, setState] = useState(myShopData?.state || currentState)
    const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
    const [backendImage, setBackendImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("city", city.trim().toLowerCase())
            formData.append("state", state)
            formData.append("address", address)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-pink-50 relative overflow-hidden'>
            {/* Animated background orbs */}
            <div className='absolute top-32 right-20 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full blur-3xl animate-pulse' style={{ animation: 'float 6s ease-in-out infinite' }}></div>
            <div className='absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-red-300/20 to-transparent rounded-full blur-3xl animate-pulse' style={{ animation: 'float 8s ease-in-out infinite 1s' }}></div>
            <div className='absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-pink-300/15 to-transparent rounded-full blur-3xl opacity-60' style={{ animation: 'float 7s ease-in-out infinite 2s' }}></div>

            <div className='relative z-10 w-full max-w-2xl'>
                {/* Back button */}
                <button onClick={() => navigate("/")} className='mb-8 p-3 hover:bg-orange-100/50 rounded-full transition-all duration-300 hover:scale-110'>
                    <IoIosArrowRoundBack size={32} className='text-orange-600 hover:text-orange-700' />
                </button>

                {/* Main Card */}
                <div className='backdrop-blur-xl bg-gradient-to-br from-white/95 to-orange-50/50 shadow-2xl shadow-orange-200/40 rounded-3xl p-8 border-2 border-white/50 hover:shadow-3xl hover:shadow-orange-300/60 transition-all duration-300 relative' style={{ animation: 'slideUp 0.6s ease-out' }}>
                    {/* Outer glow shadow */}
                    <div className='absolute inset-0 rounded-3xl shadow-xl shadow-orange-400/20 -z-10'></div>
                    <div className='absolute inset-0 rounded-3xl shadow-2xl shadow-red-300/15 -z-10'></div>

                    {/* Header */}
                    <div className='flex flex-col items-center mb-10'>
                        <div className='bg-gradient-to-br from-orange-100 to-red-100 p-5 rounded-2xl mb-4 shadow-lg'>
                            <FaUtensils className='text-orange-600 w-8 h-8' />
                        </div>
                        <h1 className='text-4xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent'>
                            {myShopData ? "Edit Your Shop" : "Create Shop"}
                        </h1>
                        <p className='text-gray-500 text-sm mt-2 font-medium'>{myShopData ? "Update shop details" : "Set up your restaurant"}</p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Shop Name */}
                        <div className='group'>
                            <label className='block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide'>Shop Name</label>
                            <input
                                type="text"
                                placeholder='Enter shop name'
                                className='w-full px-5 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg group-focus-within:shadow-lg'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>

                        {/* Shop Image Upload */}
                        <div className='group'>
                            <label className='block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide'>Shop Image</label>
                            <div className='relative'>
                                <input
                                    type="file"
                                    accept='image/*'
                                    className='w-full px-5 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-orange-500 file:to-red-500 file:text-white hover:file:from-orange-600 hover:file:to-red-600 cursor-pointer shadow-md hover:shadow-lg'
                                    onChange={handleImage}
                                    id="shopImageInput"
                                />
                                {backendImage && (
                                    <div className='mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-lg text-sm font-semibold text-orange-700 border border-orange-200'>
                                        <span className='text-lg'>✓</span>
                                        {backendImage.name}
                                    </div>
                                )}
                            </div>
                            {frontendImage && (
                                <div className='mt-5 relative overflow-hidden rounded-2xl border-2 border-orange-100 shadow-lg group-hover:shadow-2xl transition-all duration-300'>
                                    <img src={frontendImage} alt="Shop preview" className='w-full h-64 object-cover hover:scale-105 transition-transform duration-300' />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl'></div>
                                </div>
                            )}
                        </div>

                        {/* City and State Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* City */}
                            <div className='group'>
                                <label className='block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide'>City</label>
                                <input
                                    type="text"
                                    placeholder='Enter city'
                                    className='w-full px-5 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg group-focus-within:shadow-lg'
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                />
                            </div>

                            {/* State */}
                            <div className='group'>
                                <label className='block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide'>State</label>
                                <input
                                    type="text"
                                    placeholder='Enter state'
                                    className='w-full px-5 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg group-focus-within:shadow-lg'
                                    onChange={(e) => setState(e.target.value)}
                                    value={state}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className='group'>
                            <label className='block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide'>Shop Address</label>
                            <input
                                type="text"
                                placeholder='Enter complete address'
                                className='w-full px-5 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/80 placeholder-gray-400 font-medium shadow-md hover:shadow-lg group-focus-within:shadow-lg'
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:shadow-orange-300/50 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8'
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color='white' /> : `💾 ${myShopData ? "Update Shop" : "Create Shop"}`}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(-40px) translateX(-10px);
                    }
                    75% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default CreateEditShop
