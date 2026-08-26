import axios from 'axios';
import React from 'react'
import { MdPhone } from "react-icons/md";
import { FaMapLocationDot, FaClock, FaUser, FaBox, FaTruck } from "react-icons/fa6";
import { serverUrl } from '../config';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'preparing': 'bg-blue-50 text-blue-700 border-blue-200',
            'out of delivery': 'bg-orange-50 text-orange-700 border-orange-200',
            'delivered': 'bg-green-50 text-green-700 border-green-200'
        }
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
    }

    const getStatusIcon = (status) => {
        const icons = {
            'pending': '⏳',
            'preparing': '👨‍🍳',
            'out of delivery': '🚚',
            'delivered': '✅'
        }
        return icons[status] || '📦'
    }

    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            // Robust shopId extraction
            const actualShopId = typeof shopId === 'object' ? shopId._id : shopId;

            if (!actualShopId) {
                alert("Error: Shop ID is missing");
                return;
            }

            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${actualShopId}`, { status }, { withCredentials: true })
            dispatch(updateOrderStatus({ orderId, shopId: actualShopId, status }))
            setAvailableBoys(result.data.availableBoys)
            console.log(result.data)
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Failed to update status")
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <div className='bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300'>
            {/* Header */}
            <div className='bg-gradient-to-r from-gray-50 to-orange-50/30 px-6 py-5 border-b border-gray-100'>
                <div className='flex justify-between items-start'>
                    <div>
                        <div className='flex items-center gap-3 mb-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center'>
                                <FaBox className='text-white' size={18} />
                            </div>
                            <div>
                                <p className='font-bold text-gray-900 text-lg'>Order #{data?._id?.slice(-8)}</p>
                                <p className='text-xs text-gray-500 font-medium mt-0.5'>{data?.createdAt && formatDate(data.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='text-right'>
                        <div className='mb-3'>
                            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(data?.shopOrders?.status)}`}>
                                {getStatusIcon(data?.shopOrders?.status)} {data?.shopOrders?.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className='p-6 space-y-5'>
                {/* Customer Info */}
                <div className='bg-gradient-to-br from-gray-50 to-blue-50/20 rounded-2xl p-5 border border-gray-100'>
                    <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2'>
                        <FaUser size={14} className='text-blue-600' />
                        Customer Details
                    </h3>
                    <div className='space-y-2.5'>
                        <div>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Name</p>
                            <p className='text-base font-bold text-gray-900'>{data.user.fullName}</p>
                        </div>
                        <div>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Email</p>
                            <p className='text-sm text-gray-700 font-medium'>{data.user.email}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1'>
                                <MdPhone size={14} /> Phone
                            </p>
                            <p className='text-sm text-gray-700 font-medium'>{data.user.mobile}</p>
                        </div>
                        <div>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Payment</p>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${data.paymentMethod === "online"
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                                }`}>
                                {data.paymentMethod === "online" ? `💳 Online ${data.payment ? '(Paid)' : '(Pending)'}` : '💵 COD'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className='bg-gradient-to-br from-green-50 to-emerald-50/20 rounded-2xl p-5 border border-gray-100'>
                    <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2'>
                        <FaMapLocationDot size={14} className='text-green-600' />
                        Delivery Address
                    </h3>
                    <p className='text-base text-gray-900 font-semibold mb-2'>{data?.deliveryAddress?.text}</p>
                    <p className='text-xs text-gray-500 font-medium'>
                        📍 Coordinates: {data?.deliveryAddress?.latitude?.toFixed(4)}, {data?.deliveryAddress?.longitude?.toFixed(4)}
                    </p>
                </div>

                {/* Items */}
                <div>
                    <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2'>
                        <FaBox size={14} className='text-orange-600' />
                        Order Items
                    </h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                        {data.shopOrders.shopOrderItems.map((item, index) => (
                            <div key={index} className='bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200'>
                                <div className='relative mb-3'>
                                    <img
                                        src={item.item.image}
                                        alt={item.name}
                                        className='w-full h-28 object-cover rounded-xl'
                                    />
                                    <div className='absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700'>
                                        ×{item.quantity}
                                    </div>
                                </div>
                                <p className='text-sm font-bold text-gray-900 mb-1 line-clamp-1'>{item.name}</p>
                                <p className='text-xs text-gray-500 font-medium'>
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Update Section */}
                <div className='bg-gradient-to-br from-purple-50 to-pink-50/20 rounded-2xl p-5 border border-gray-100'>
                    <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2'>
                        <FaClock size={14} className='text-purple-600' />
                        Update Status
                    </h3>
                    {data.shopOrders.status === "delivered" ? (
                        <div className='flex items-center gap-3 bg-green-50 rounded-xl p-3 border-2 border-green-300'>
                            <span className='text-2xl'>✅</span>
                            <div>
                                <p className='text-sm font-bold text-green-900'>Order Delivered</p>
                                <p className='text-xs text-green-700'>This order has been successfully delivered</p>
                            </div>
                        </div>
                    ) : (
                        <select
                            className='w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-base font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white'
                            onChange={(e) => {
                                const val = e.target.value;
                                const shopId = data.shopOrders.shop?._id || data.shopOrders.shop;
                                if (val) handleUpdateStatus(data._id, shopId, val);
                            }}
                            value={data.shopOrders.status}
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="preparing">👨‍🍳 Preparing</option>
                            <option value="out of delivery">🚚 Out Of Delivery</option>
                        </select>
                    )}
                </div>

                {/* Delivery Boy Assignment */}
                {data.shopOrders.status === "out of delivery" && (
                    <div className='bg-gradient-to-br from-orange-50 to-red-50/20 rounded-2xl p-5 border border-orange-200'>
                        <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2'>
                            <FaTruck size={14} className='text-orange-600' />
                            {data.shopOrders.assignedDeliveryBoy ? 'Assigned Delivery Boy' : 'Available Delivery Boys'}
                        </h3>
                        <div className='space-y-2'>
                            {availableBoys?.length > 0 ? (
                                availableBoys.map((b, index) => (
                                    <div key={index} className='flex items-center gap-3 bg-white rounded-lg p-3 border border-orange-100'>
                                        <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
                                            <span className='text-lg'>👤</span>
                                        </div>
                                        <div>
                                            <p className='text-sm font-bold text-gray-900'>{b.fullName}</p>
                                            <p className='text-xs text-gray-600'>{b.mobile}</p>
                                        </div>
                                    </div>
                                ))
                            ) : data.shopOrders.assignedDeliveryBoy ? (
                                <div className='flex items-center gap-3 bg-white rounded-lg p-3 border border-green-100'>
                                    <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                                        <span className='text-lg'>✅</span>
                                    </div>
                                    <div>
                                        <p className='text-sm font-bold text-gray-900'>{data.shopOrders.assignedDeliveryBoy.fullName}</p>
                                        <p className='text-xs text-gray-600'>{data.shopOrders.assignedDeliveryBoy.mobile}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex items-center gap-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200'>
                                    <span className='text-lg'>⏳</span>
                                    <p className='text-sm font-semibold text-yellow-800'>Waiting for delivery boy to accept</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className='bg-gradient-to-r from-gray-50 to-orange-50/30 px-6 py-5 border-t border-gray-100'>
                <div className='flex justify-between items-center'>
                    <div>
                        <p className='text-sm text-gray-500 font-medium mb-1'>Order Total</p>
                        <p className='text-3xl font-black text-gray-900'>₹{data.totalAmount}</p>
                        {data.couponCode && (
                            <p className='text-xs text-green-600 font-semibold mt-2 flex items-center gap-1'>
                                <span className='bg-green-100 px-2 py-0.5 rounded-full'>Coupon: {data.couponCode}</span>
                                <span>- ₹{data.discountAmount} saved</span>
                            </p>
                        )}
                    </div>
                    <div className='text-right'>
                        <p className='text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2'>Shop</p>
                        <p className='text-lg font-bold text-gray-900'>{data.shopOrders.shop.name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerOrderCard
