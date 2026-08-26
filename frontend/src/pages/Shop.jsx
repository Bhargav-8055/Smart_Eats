import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../config'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStore, FaLocationDot, FaUtensils, FaArrowLeft, FaStar, FaClock } from "react-icons/fa6";

import FoodCard from '../components/FoodCard';

function Shop() {
    const { shopId } = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState(null)
    const navigate = useNavigate()

    const handleShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
            setShop(result.data.shop)
            setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleShop()
    }, [shopId])

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40'>
            {/* Back Button - Floating */}
            <button
                className='fixed top-8 left-8 z-40 flex items-center gap-2.5 bg-white hover:bg-gray-50 text-gray-800 px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group'
                onClick={() => navigate("/")}
            >
                <FaArrowLeft className='text-[#ff4d2d] group-hover:-translate-x-1 transition-transform duration-300' size={18} />
                <span className='font-bold text-sm'>Back to Home</span>
            </button>

            {/* Hero Section - Premium Design */}
            {shop && (
                <div className='relative w-full h-[450px] md:h-[500px] overflow-hidden'>
                    {/* Image with overlay */}
                    <div className='absolute inset-0'>
                        <img src={shop.image} alt={shop.name} className='w-full h-full object-cover scale-105' />
                        <div className='absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/70 to-gray-900/40'></div>
                        <div className='absolute inset-0 bg-gradient-to-t from-orange-900/30 via-transparent to-transparent'></div>
                    </div>

                    {/* Content */}
                    <div className='relative h-full flex flex-col justify-end pb-16 px-8 md:px-16'>
                        <div className='max-w-4xl'>
                            {/* Store Badge */}
                            <div className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 mb-6'>
                                <div className='w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg'>
                                    <FaStore className='text-white' size={14} />
                                </div>
                                <span className='text-white font-semibold text-sm'>Restaurant</span>
                            </div>

                            {/* Shop Name */}
                            <h1 className='text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight'>
                                {shop.name}
                            </h1>

                            {/* Info Cards */}
                            <div className='flex flex-wrap gap-4'>
                                {/* Address */}
                                <div className='flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-2xl'>
                                    <div className='w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center'>
                                        <FaLocationDot className='text-red-400' size={18} />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-300 font-medium'>Location</p>
                                        <p className='text-sm font-bold text-white'>{shop.address}</p>
                                    </div>
                                </div>

                                {/* Rating (Mock) */}
                                <div className='flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-2xl'>
                                    <div className='w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center'>
                                        <FaStar className='text-amber-400' size={18} />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-300 font-medium'>Rating</p>
                                        <p className='text-sm font-bold text-white'>4.5 ★</p>
                                    </div>
                                </div>

                                {/* Delivery Time (Mock) */}
                                <div className='flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-2xl'>
                                    <div className='w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center'>
                                        <FaClock className='text-green-400' size={18} />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-300 font-medium'>Delivery</p>
                                        <p className='text-sm font-bold text-white'>30-40 min</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative wave */}
                    <div className='absolute bottom-0 left-0 right-0'>
                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-full h-auto'>
                            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="url(#gradient)" fillOpacity="1" />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(248 250 252)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgb(248 250 252)" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            )}

            {/* Menu Section */}
            <div className='max-w-7xl mx-auto px-6 md:px-12 py-16 -mt-8 relative z-10'>
                {/* Section Header */}
                <div className='mb-12'>
                    <div className='flex items-center gap-4 mb-3'>
                        <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30'>
                            <FaUtensils className='text-white' size={20} />
                        </div>
                        <div>
                            <h2 className='text-4xl font-black text-gray-900'>Our Menu</h2>
                            <p className='text-gray-500 font-medium mt-1'>Handpicked delicacies just for you</p>
                        </div>
                    </div>
                    <div className='h-1 w-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full'></div>
                </div>

                {/* Menu Grid */}
                {items.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {items.map((item, index) => (
                            <FoodCard data={item} key={index} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-24'>
                        <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner'>
                            <FaUtensils className='text-gray-400' size={48} />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-800 mb-2'>No Items Available</h3>
                        <p className='text-gray-500 font-medium'>Our chefs are preparing something special. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Shop
