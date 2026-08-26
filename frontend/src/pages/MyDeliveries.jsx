import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../config'
import { FaTruck, FaRupeeSign, FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaBox, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IoStatsChart } from 'react-icons/io5'
import { MdDeliveryDining } from 'react-icons/md'
import { BiPackage } from 'react-icons/bi'

function MyDeliveries() {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [stats, setStats] = useState({ todayDeliveries: 0, todayEarnings: 0, totalDeliveries: 0, totalEarnings: 0 })
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = history.slice(indexOfFirstItem, indexOfLastItem)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    useEffect(() => {
        fetchDeliveryHistory()
    }, [])

    const fetchDeliveryHistory = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/order/delivery-history`, { withCredentials: true })
            setStats(response.data.stats)
            setHistory(response.data.history)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'>
                <div className='text-center'>
                    <div className='w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-xl text-gray-600 font-semibold'>Loading your deliveries...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pt-24 pb-12 px-4 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className='absolute top-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute bottom-20 left-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>

            <div className='max-w-7xl mx-auto relative z-10'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center gap-4 mb-6'>
                        <button
                            onClick={() => navigate('/')}
                            className='group w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border-2 border-green-100 hover:border-green-400'
                        >
                            <FaArrowLeft className='text-green-600 group-hover:-translate-x-1 transition-transform duration-300' size={20} />
                        </button>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='relative'>
                                    <div className='absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur opacity-40'></div>
                                    <div className='relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30'>
                                        <MdDeliveryDining className='text-white' size={32} />
                                    </div>
                                </div>
                                <div>
                                    <h1 className='text-5xl font-black bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                                        My Deliveries
                                    </h1>
                                    <p className='text-gray-600 font-medium text-lg mt-1'>Track your delivery performance & earnings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - 2x2 Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    {/* Today's Deliveries */}
                    <div className='group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300 relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full -mr-16 -mt-16'></div>
                        <div className='relative'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300'>
                                    <FaTruck className='text-white' size={28} />
                                </div>
                                <div className='px-3 py-1 bg-green-100 rounded-full'>
                                    <span className='text-green-700 font-bold text-sm'>Today</span>
                                </div>
                            </div>
                            <p className='text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2'>Deliveries Completed</p>
                            <h3 className='text-5xl font-black text-gray-900 mb-2'>{stats.todayDeliveries}</h3>
                            <p className='text-green-600 font-semibold text-sm'>🎯 Keep it up!</p>
                        </div>
                    </div>

                    {/* Today's Earnings */}
                    <div className='group bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16'></div>
                        <div className='relative'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white/30'>
                                    <FaRupeeSign className='text-white' size={28} />
                                </div>
                                <div className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30'>
                                    <span className='text-white font-bold text-sm'>💰 Earning</span>
                                </div>
                            </div>
                            <p className='text-green-100 text-sm font-semibold uppercase tracking-wider mb-2'>Today's Income</p>
                            <h3 className='text-5xl font-black text-white mb-2'>₹{stats.todayEarnings}</h3>
                            <p className='text-green-100 font-semibold text-sm'>Your hard work pays off!</p>
                        </div>
                    </div>

                    {/* Lifetime Earnings */}
                    <div className='group bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16'></div>
                        <div className='relative'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white/30'>
                                    <FaRupeeSign className='text-white' size={28} />
                                </div>
                                <div className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30'>
                                    <span className='text-white font-bold text-sm'>💎 All Time</span>
                                </div>
                            </div>
                            <p className='text-amber-100 text-sm font-semibold uppercase tracking-wider mb-2'>Lifetime Earnings</p>
                            <h3 className='text-5xl font-black text-white mb-2'>₹{stats.totalEarnings}</h3>
                            <p className='text-amber-100 font-semibold text-sm'>Amazing progress! 💪</p>
                        </div>
                    </div>

                    {/* Total Deliveries */}
                    <div className='group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300 relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full -mr-16 -mt-16'></div>
                        <div className='relative'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300'>
                                    <BiPackage className='text-white' size={28} />
                                </div>
                                <div className='px-3 py-1 bg-emerald-100 rounded-full'>
                                    <span className='text-emerald-700 font-bold text-sm'>All Time</span>
                                </div>
                            </div>
                            <p className='text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2'>Total Deliveries</p>
                            <h3 className='text-5xl font-black text-gray-900 mb-2'>{stats.totalDeliveries}</h3>
                            <p className='text-emerald-600 font-semibold text-sm'>🏆 Great milestone!</p>
                        </div>
                    </div>
                </div>

                {/* Delivery History */}
                <div className='bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100'>
                    <div className='flex items-center justify-between mb-8'>
                        <div className='flex items-center gap-4'>
                            <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20'>
                                <FaBox className='text-white' size={24} />
                            </div>
                            <div>
                                <h2 className='text-3xl font-black text-gray-900'>Delivery History</h2>
                                <p className='text-gray-500 font-medium'>Your completed deliveries</p>
                            </div>
                        </div>
                        {history.length > 0 && (
                            <div className='px-4 py-2 bg-green-50 rounded-full border-2 border-green-200'>
                                <span className='text-green-700 font-bold'>{history.length} Total</span>
                            </div>
                        )}
                    </div>

                    {history.length === 0 ? (
                        <div className='text-center py-16'>
                            <div className='w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6'>
                                <FaTruck className='text-gray-400' size={48} />
                            </div>
                            <h3 className='text-2xl font-bold text-gray-800 mb-2'>No deliveries yet</h3>
                            <p className='text-gray-500 font-medium'>Start accepting orders to see your delivery history!</p>
                        </div>
                    ) : (
                        <>
                            <div className='space-y-4'>
                                {currentItems.map((delivery) => (
                                    <div
                                        key={delivery._id}
                                        className='group bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-green-200'
                                    >
                                        <div className='flex flex-col lg:flex-row lg:items-center gap-6'>
                                            {/* Icon & Shop Info */}
                                            <div className='flex items-start gap-4 flex-1'>
                                                <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0'>
                                                    <FaCheckCircle className='text-white' size={24} />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='font-black text-gray-900 text-xl mb-2 flex items-center gap-2'>
                                                        {delivery.shopName}
                                                        <span className='px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full'>Delivered</span>
                                                    </h3>
                                                    <div className='flex items-start gap-2 text-sm text-gray-600 mb-2'>
                                                        <FaMapMarkerAlt className='mt-1 flex-shrink-0 text-green-600' />
                                                        <p className='line-clamp-2 font-medium'>{delivery.deliveryAddress}</p>
                                                    </div>
                                                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                                                        <FaCalendarAlt className='text-green-600' />
                                                        <p className='font-semibold'>{formatDate(delivery.date)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Earnings */}
                                            <div className='flex items-center gap-6 lg:border-l-2 lg:border-gray-200 lg:pl-6'>
                                                <div className='text-center'>
                                                    <p className='text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1'>Order Value</p>
                                                    <p className='text-2xl font-black text-gray-900'>₹{delivery.amount}</p>
                                                </div>
                                                <div className='text-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl px-6 py-4 shadow-lg shadow-green-500/20'>
                                                    <p className='text-xs text-green-100 font-semibold uppercase tracking-wider mb-1'>You Earned</p>
                                                    <p className='text-3xl font-black text-white'>₹{delivery.earning}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {history.length > itemsPerPage && (
                                <div className='mt-8 flex items-center justify-center gap-2'>
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-green-600 hover:bg-green-50 border-2 border-green-100 hover:border-green-300 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <div className='flex items-center gap-2'>
                                        {Array.from({ length: Math.ceil(history.length / itemsPerPage) }).map((_, idx) => {
                                            const pageNumber = idx + 1;
                                            // Logic to show limited page numbers with ellipsis could be added here for very large lists,
                                            // but for now showing all as per simple request or standard behavior.
                                            // Let's implement a simple view first.
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => paginate(pageNumber)}
                                                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${currentPage === pageNumber
                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-110'
                                                        : 'bg-white text-gray-600 hover:bg-green-50 border-2 border-transparent hover:border-green-200'
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(history.length / itemsPerPage)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${currentPage === Math.ceil(history.length / itemsPerPage)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-green-600 hover:bg-green-50 border-2 border-green-100 hover:border-green-300 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyDeliveries
