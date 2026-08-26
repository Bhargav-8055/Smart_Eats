import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../config'
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaStore, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaBoxOpen, FaCheckCircle, FaCircle } from "react-icons/fa";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'

function TrackOrderPage() {
  const { orderId } = useParams()
  const [currentOrder, setCurrentOrder] = useState()
  const navigate = useNavigate()
  const { socket } = useSelector(state => state.user)
  const [liveLocations, setLiveLocations] = useState({})

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket?.on('updateDeliveryLocation', ({ deliveryBoyId, latitude, longitude }) => {
      setLiveLocations(prev => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude }
      }))
    })

    socket?.on('update-status', ({ orderId: updatedOrderId, shopId, status }) => {
      if (currentOrder && currentOrder._id === updatedOrderId) {
        setCurrentOrder(prev => ({
          ...prev,
          shopOrders: prev.shopOrders.map(order =>
            order.shop._id === shopId ? { ...order, status } : order
          )
        }))
      }
    })

    // Listen for delivery boy assignment
    socket?.on('deliveryBoyAssigned', ({ orderId, shopOrderId, deliveryBoy }) => {
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(prev => ({
          ...prev,
          shopOrders: prev.shopOrders.map(order =>
            String(order._id) === String(shopOrderId)
              ? { ...order, assignedDeliveryBoy: deliveryBoy }
              : order
          )
        }))
      }
    })

    return () => {
      socket?.off('updateDeliveryLocation')
      socket?.off('update-status')
      socket?.off('deliveryBoyAssigned')
    }
  }, [socket, currentOrder])

  useEffect(() => {
    handleGetOrder()
  }, [orderId])

  const getStatusStep = (status) => {
    // Map backend status to frontend step numbers
    const statusMap = {
      'pending': 1,         // Maps to "Placed"
      'confirmed': 2,       // Maps to "Confirmed" (not in backend enum)
      'preparing': 3,       // Maps to "Preparing"
      'out of delivery': 4, // Maps to "On Way"
      'delivered': 5        // Maps to "Delivered"
    };
    return statusMap[status] || 1; // Default to step 1 if status not found
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-10'>
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-orange-100'>
        <div className='max-w-4xl mx-auto px-4 py-4 flex items-center gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 hover:bg-orange-50 rounded-full transition-colors text-[#ff4d2d]'
          >
            <IoIosArrowRoundBack size={28} />
          </button>
          <h1 className='text-xl font-bold text-gray-800'>Track Order</h1>
        </div>
      </div>

      <div className='max-w-4xl mx-auto p-4 space-y-6 mt-4'>
        {currentOrder?.shopOrders?.map((shopOrder, index) => {
          const currentStep = getStatusStep(shopOrder.status);
          const steps = [
            { label: 'Placed', icon: FaBoxOpen },
            { label: 'Confirmed', icon: FaCheckCircle },
            { label: 'Preparing', icon: FaStore },
            { label: 'On Way', icon: FaMapMarkerAlt },
            { label: 'Delivered', icon: FaCheckCircle }
          ];

          return (
            <div className='bg-white rounded-2xl shadow-lg shadow-orange-100/50 border border-orange-100 overflow-hidden' key={index}>
              {/* Shop Header */}
              <div className='p-6 border-b border-orange-50 bg-gradient-to-r from-orange-50/50 to-transparent'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-[#ff4d2d] to-[#ff8c42] rounded-full flex items-center justify-center text-white shadow-md shadow-orange-200'>
                    <FaStore size={20} />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-gray-800'>{shopOrder.shop.name}</h2>
                    <p className='text-sm text-gray-500 font-medium'>Order ID: <span className='text-gray-700'>#{currentOrder._id.slice(-6)}</span></p>
                  </div>
                </div>

                {/* Stepper */}
                <div className="relative flex items-center justify-between w-full mt-10 mb-4 px-2">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-gray-100 -z-0 rounded-full"></div>
                  <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff8c42] -z-0 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  ></div>

                  {steps.map((step, i) => {
                    const isActive = i + 1 <= currentStep;
                    const isCurrent = i + 1 === currentStep;
                    return (
                      <div key={i} className="flex flex-col items-center z-10 relative group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm ${isActive ? 'bg-gradient-to-br from-[#ff4d2d] to-[#ff8c42] border-white text-white shadow-orange-200 scale-110' : 'bg-white border-gray-200 text-gray-300'}`}>
                          <step.icon size={14} />
                        </div>
                        <span className={`text-xs mt-2 font-bold absolute -bottom-6 w-20 text-center transition-colors duration-300 ${isActive ? 'text-[#ff4d2d]' : 'text-gray-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Details */}
              <div className='p-6 grid md:grid-cols-2 gap-8 pt-8'>
                <div className='space-y-6'>
                  <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
                    <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>Items Ordered</h3>
                    <div className='space-y-3'>
                      {shopOrder.shopOrderItems?.map((item, i) => (
                        <div key={i} className='flex justify-between items-center text-gray-700 group'>
                          <div className='flex items-center gap-3'>
                            <span className='w-6 h-6 bg-white border border-gray-200 rounded text-xs flex items-center justify-center font-bold text-[#ff4d2d] shadow-sm'>
                              {item.quantity}x
                            </span>
                            <span className='font-medium group-hover:text-[#ff4d2d] transition-colors'>{item.name}</span>
                          </div>
                          <span className='font-semibold text-gray-900'>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    {currentOrder.couponCode && (
                      <div className='mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-green-600'>
                        <span className='font-semibold text-sm flex items-center gap-1'>
                          <span className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold'>Coupon: {currentOrder.couponCode}</span>
                          Discount
                        </span>
                        <span className='font-bold'>- ₹{currentOrder.discountAmount}</span>
                      </div>
                    )}
                    <div className='mt-4 pt-4 border-t border-gray-200 flex justify-between items-center'>
                      <span className='font-bold text-gray-800'>Total Amount</span>
                      <span className='font-extrabold text-[#ff4d2d] text-xl'>₹{currentOrder.totalAmount}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1'>Delivery Address</h3>
                    <div className='flex gap-3 items-start p-4 bg-orange-50/50 border border-orange-100 rounded-xl'>
                      <div className='mt-1 p-1.5 bg-white rounded-full text-[#ff4d2d] shadow-sm'>
                        <FaMapMarkerAlt size={14} />
                      </div>
                      <p className='text-gray-700 text-sm leading-relaxed font-medium'>{currentOrder.deliveryAddress?.text}</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-6'>
                  {/* Delivery Boy Info */}
                  {shopOrder.status !== "delivered" && (
                    <div className='bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-5 shadow-lg shadow-gray-200'>
                      <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>Delivery Partner</h3>
                      {shopOrder.assignedDeliveryBoy ? (
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white border-2 border-gray-600'>
                              <FaUser size={20} />
                            </div>
                            <div>
                              <p className='font-bold text-lg'>{shopOrder.assignedDeliveryBoy.fullName}</p>
                              <p className='text-xs text-green-400 font-medium flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded-full w-fit mt-1'>
                                <FaCircle size={6} /> Vaccinated
                              </p>
                            </div>
                          </div>
                          <a href={`tel:${shopOrder.assignedDeliveryBoy.mobile}`} className='w-10 h-10 bg-[#ff4d2d] text-white rounded-full flex items-center justify-center hover:bg-[#ff6b4f] transition-all shadow-lg shadow-red-900/20 transform hover:scale-105'>
                            <FaPhoneAlt size={16} />
                          </a>
                        </div>
                      ) : (
                        <div className='text-center py-4 text-gray-400 text-sm flex flex-col items-center gap-2'>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Assigning a delivery partner...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Map */}
                  {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && (
                    <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-md border-2 border-white ring-1 ring-gray-100 relative">
                      <DeliveryBoyTracking data={{
                        deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                          lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                          lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                        },
                        customerLocation: {
                          lat: currentOrder.deliveryAddress.latitude,
                          lon: currentOrder.deliveryAddress.longitude
                        }
                      }} />
                    </div>
                  )}

                  {shopOrder.status === "delivered" && (
                    <div className='bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-8 text-center'>
                      <div className='w-20 h-20 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100'>
                        <FaCheckCircle size={40} />
                      </div>
                      <h3 className='text-xl font-bold text-green-800 mb-1'>Order Delivered</h3>
                      <p className='text-green-600 font-medium'>Enjoy your meal!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrackOrderPage
