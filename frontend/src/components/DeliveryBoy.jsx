import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../config'
import { useEffect } from 'react'
import { useState } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MdDeliveryDining, MdLocationOn } from 'react-icons/md'
import { FaTruck, FaRupeeSign, FaBoxOpen, FaCheckCircle, FaClock } from 'react-icons/fa'
import { BiPackage } from 'react-icons/bi'
import { IoStatsChart } from 'react-icons/io5'

function DeliveryBoy() {
  const { userData, socket } = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState(null)
  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({ lat: latitude, lon: longitude })
        socket.emit('updateLocation', {
          latitude,
          longitude,
          userId: userData._id
        })
      }),
        (error) => {
          console.log(error)
        },
      {
        enableHighAccuracy: true
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }

  }, [socket, userData])


  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)



  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })

      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      console.log(result.data)
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.on('newAssignment', (data) => {
      setAvailableAssignments(prev => ([...prev, data]))
    })
    return () => {
      socket.off('newAssignment')
    }
  }, [socket])

  const sendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
      }, { withCredentials: true })
      setLoading(false)
      setShowOtpBox(true)
      console.log(result.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const verifyOtp = async () => {
    setMessage("")
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp
      }, { withCredentials: true })
      console.log(result.data)
      setMessage(result.data.message)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }


  const handleTodayDeliveries = async () => {

    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
      console.log(result.data)
      setTodayDeliveries(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  }, [userData])
  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-y-auto relative'>
      {/* Animated Background */}
      <div className='absolute top-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 left-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>

      <Nav />
      <div className='w-full max-w-[900px] flex flex-col gap-6 items-center px-4 pb-8 relative z-10'>
        {/* Welcome Card */}
        <div className='bg-white rounded-3xl shadow-xl p-8 w-full border-2 border-green-100 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full -mr-20 -mt-20'></div>
          <div className='relative flex items-center gap-4'>
            <div className='w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30'>
              <MdDeliveryDining className='text-white' size={40} />
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-black bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2'>
                Welcome, {userData.fullName}!
              </h1>
              <div className='flex items-center gap-2 text-gray-600'>
                <MdLocationOn className='text-green-600' size={18} />
                <p className='font-semibold text-sm'>
                  {deliveryBoyLocation?.lat && deliveryBoyLocation?.lon
                    ? `📍 ${deliveryBoyLocation.lat.toFixed(4)}, ${deliveryBoyLocation.lon.toFixed(4)}`
                    : '📍 Getting location...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Performance */}
        <div className='bg-white rounded-3xl shadow-xl p-8 w-full border-2 border-green-100'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20'>
              <IoStatsChart className='text-white' size={24} />
            </div>
            <h1 className='text-2xl font-black text-gray-900'>Today's Performance</h1>
          </div>

          {/* Enhanced Chart */}
          <div className='bg-white rounded-2xl p-6 mb-6 border-2 border-green-100 shadow-lg'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-black text-gray-800'>Hourly Deliveries</h3>
              <div className='flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200'>
                <div className='w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-sm'></div>
                <span className='text-sm font-bold text-green-700'>Completed</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={todayDeliveries} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(h) => `${h}:00`}
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                  label={{ value: 'Deliveries', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontWeight: 700 } }}
                />
                <Tooltip
                  cursor={{ fill: '#f0fdf4' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className='bg-white rounded-xl p-4 shadow-2xl border-2 border-green-500'>
                          <p className='text-sm font-bold text-gray-600 mb-2'>Time: {label}:00</p>
                          <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full'></div>
                            <p className='text-lg font-black text-green-600'>{payload[0].value} Deliveries</p>
                          </div>
                          <p className='text-xs text-gray-500 mt-2'>Earned: ₹{payload[0].value * 50}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill='url(#colorGradient)'
                  radius={[12, 12, 0, 0]}
                  filter="url(#shadow)"
                  animationDuration={1000}
                  animationBegin={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings Card */}
          <div className='bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-center shadow-xl shadow-green-500/30'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <FaRupeeSign className='text-green-100' size={20} />
              <h2 className='text-lg font-bold text-green-100 uppercase tracking-wide'>Today's Earning</h2>
            </div>
            <span className='text-6xl font-black text-white block mb-2'>₹{totalEarning}</span>
            <p className='text-green-100 font-semibold'>Keep delivering! 🚀</p>
          </div>
        </div>

        {/* Available Orders */}
        {!currentOrder && <div className='bg-white rounded-3xl p-8 shadow-xl w-full border-2 border-green-100'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20'>
              <FaBoxOpen className='text-white' size={22} />
            </div>
            <h1 className='text-2xl font-black text-gray-900'>Available Orders</h1>
          </div>

          <div className='space-y-4'>
            {availableAssignments?.length > 0
              ?
              (
                availableAssignments.map((a, index) => (
                  <div className='bg-gradient-to-br from-gray-50 to-orange-50/30 border-2 border-gray-100 hover:border-orange-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all duration-300 hover:shadow-lg' key={index}>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center'>
                          <BiPackage className='text-white' size={20} />
                        </div>
                        <p className='text-lg font-black text-gray-900'>{a?.shopName}</p>
                      </div>
                      <div className='flex items-start gap-2 mb-2'>
                        <MdLocationOn className='text-green-600 flex-shrink-0 mt-1' size={16} />
                        <p className='text-sm text-gray-600 font-medium'>{a?.deliveryAddress.text}</p>
                      </div>
                      <div className='flex items-center gap-4 text-xs text-gray-500 font-semibold'>
                        <span className='px-3 py-1 bg-white rounded-full border border-gray-200'>{a.items.length} items</span>
                        <span className='px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200'>₹{a.subtotal}</span>
                      </div>
                    </div>
                    <button
                      className='group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl text-base font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 flex items-center gap-2 justify-center'
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      <FaCheckCircle size={18} />
                      Accept Order
                    </button>
                  </div>
                ))
              ) : <div className='text-center py-12'>
                <div className='w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4'>
                  <FaBoxOpen className='text-gray-400' size={40} />
                </div>
                <p className='text-gray-500 font-semibold text-lg'>No orders available right now</p>
                <p className='text-gray-400 text-sm mt-2'>Check back soon!</p>
              </div>}
          </div>
        </div>}

        {/* Current Delivery */}
        {currentOrder && <div className='bg-white rounded-3xl p-8 shadow-xl w-full border-2 border-green-100'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 animate-pulse'>
              <FaTruck className='text-white' size={22} />
            </div>
            <h2 className='text-2xl font-black text-gray-900'>🚚 Current Delivery</h2>
          </div>

          <div className='bg-gradient-to-br from-green-50 to-emerald-50/50 border-2 border-green-200 rounded-2xl p-6 mb-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md'>
                <BiPackage className='text-green-600' size={24} />
              </div>
              <div>
                <p className='font-black text-gray-900 text-xl'>{currentOrder?.shopOrder.shop.name}</p>
                <p className='text-sm text-gray-600 font-medium mt-1'>{currentOrder.shopOrder.shopOrderItems.length} items • ₹{currentOrder.shopOrder.subtotal}</p>
              </div>
            </div>
            <div className='flex items-start gap-2 bg-white rounded-xl p-4 border border-green-200'>
              <MdLocationOn className='text-green-600 flex-shrink-0 mt-1' size={20} />
              <p className='text-sm text-gray-700 font-semibold'>{currentOrder.deliveryAddress.text}</p>
            </div>
          </div>

          <DeliveryBoyTracking data={{
            deliveryBoyLocation: deliveryBoyLocation || {
              lat: userData.location.coordinates[1],
              lon: userData.location.coordinates[0]
            },
            customerLocation: {
              lat: currentOrder.deliveryAddress.latitude,
              lon: currentOrder.deliveryAddress.longitude
            }
          }} />

          {!showOtpBox ? <button
            className='mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-2'
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color='white' /> : <><FaCheckCircle size={20} /> Mark As Delivered</>}
          </button> : <div className='mt-6 p-6 border-2 border-green-200 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/50'>
            <div className='flex items-center gap-2 mb-4'>
              <FaClock className='text-green-600' size={18} />
              <p className='text-sm font-bold text-gray-700'>Enter OTP sent to <span className='text-green-600'>{currentOrder.user.fullName}</span></p>
            </div>
            <input
              type="text"
              className='w-full border-2 border-gray-200 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold text-lg text-center tracking-widest'
              placeholder='Enter OTP'
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              maxLength="4"
            />
            {message && <p className='text-center text-green-600 text-xl font-bold mb-4 animate-pulse'>✅ {message}</p>}

            <button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
              onClick={verifyOtp}
            >
              Verify & Complete Delivery
            </button>
          </div>}

        </div>}


      </div>
    </div>
  )
}

export default DeliveryBoy
