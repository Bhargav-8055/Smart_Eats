import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../config'
import { FaStore, FaCalendar, FaCreditCard, FaMoneyBillWave, FaStar, FaArrowRight } from 'react-icons/fa6'

function UserOrderCard({ data }) {
    if (!data) return null;
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRating = async (itemId, rating) => {
        console.log('Rating item:', itemId, 'with rating:', rating)

        // Optimistic update - update UI immediately
        setSelectedRating(prev => {
            const newState = {
                ...prev,
                [itemId]: rating
            }
            console.log('Updated rating state:', newState)
            return newState
        })

        try {
            const response = await axios.post(
                `${serverUrl}/api/item/rating`,
                { itemId, rating },
                { withCredentials: true }
            )
            console.log('Rating API response:', response.data)
        } catch (error) {
            console.log('Rating error:', error)
            // Revert on error
            setSelectedRating(prev => {
                const newState = { ...prev }
                delete newState[itemId]
                console.log('Reverted rating state:', newState)
                return newState
            })
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            'placed': 'bg-blue-50 text-blue-700 border-blue-200',
            'confirmed': 'bg-purple-50 text-purple-700 border-purple-200',
            'preparing': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'out_for_delivery': 'bg-orange-50 text-orange-700 border-orange-200',
            'delivered': 'bg-green-50 text-green-700 border-green-200'
        }
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
    }

    return (
        <div className='bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300'>
            {/* Header */}
            <div className='bg-gradient-to-r from-gray-50 to-orange-50/30 px-6 py-5 border-b border-gray-100'>
                <div className='flex justify-between items-start'>
                    <div>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center'>
                                <span className='text-white font-bold text-xs'>#</span>
                            </div>
                            <p className='font-bold text-gray-900 text-lg'>Order #{data?._id?.slice(-6)}</p>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <FaCalendar size={12} />
                            <span className='font-medium'>{data?.createdAt && formatDate(data.createdAt)}</span>
                        </div>
                    </div>

                    <div className='text-right'>
                        <div className='flex items-center gap-2 justify-end mb-2'>
                            {data?.paymentMethod === "cod" ? (
                                <>
                                    <FaMoneyBillWave className='text-green-600' size={14} />
                                    <span className='text-sm font-bold text-green-600'>COD</span>
                                </>
                            ) : (
                                <>
                                    <FaCreditCard className='text-blue-600' size={14} />
                                    <span className='text-sm font-bold text-blue-600'>Online</span>
                                </>
                            )}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(data?.shopOrders?.[0]?.status)}`}>
                            {data?.shopOrders?.[0]?.status?.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Shop Orders */}
            <div className='p-6 space-y-6'>
                {data?.shopOrders?.map((shopOrder, index) => (
                    <div className='bg-gradient-to-br from-gray-50 to-orange-50/20 rounded-2xl p-5 border border-gray-100' key={index}>
                        {/* Shop Name */}
                        <div className='flex items-center gap-3 mb-4 pb-4 border-b border-gray-200'>
                            <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100'>
                                <FaStore className='text-orange-600' size={18} />
                            </div>
                            <div>
                                <p className='font-bold text-gray-900 text-lg'>{shopOrder?.shop?.name}</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border mt-1 ${getStatusColor(shopOrder?.status)}`}>
                                    {shopOrder?.status?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* Items Grid */}
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4'>
                            {shopOrder?.shopOrderItems?.map((item, idx) => (
                                <div key={idx} className='bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200'>
                                    <div className='relative mb-3'>
                                        <img
                                            src={item?.item?.image}
                                            alt={item?.name}
                                            className='w-full h-28 object-cover rounded-xl'
                                        />
                                        <div className='absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700'>
                                            ×{item?.quantity}
                                        </div>
                                    </div>

                                    <p className='text-sm font-bold text-gray-900 mb-1 line-clamp-1'>{item?.name}</p>
                                    <p className='text-xs text-gray-500 font-medium mb-2'>
                                        ₹{item?.price} × {item?.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Subtotal */}
                        <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
                            <span className='text-sm font-medium text-gray-600'>Subtotal</span>
                            <span className='text-lg font-bold text-gray-900'>₹{shopOrder?.subtotal}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className='bg-gradient-to-r from-gray-50 to-orange-50/30 px-6 py-5 border-t border-gray-100'>
                <div className='flex justify-between items-center mb-3'>
                    <div>
                        <p className='text-sm text-gray-500 font-medium mb-1'>Total Amount</p>
                        <p className='text-2xl font-black text-gray-900'>₹{data.totalAmount}</p>
                        {data.couponCode && (
                            <p className='text-xs text-green-600 font-semibold mt-1 flex items-center gap-1'>
                                <span className='bg-green-100 px-2 py-0.5 rounded-full'>Coupon: {data.couponCode}</span>
                                <span>- ₹{data.discountAmount} saved</span>
                            </p>
                        )}
                    </div>
                    <button
                        className='group bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center gap-2'
                        onClick={() => navigate(`/track-order/${data._id}`)}
                    >
                        <span>Track Order</span>
                        <FaArrowRight className='group-hover:translate-x-1 transition-transform duration-300' size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserOrderCard
