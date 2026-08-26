import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard, FaShieldAlt } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config';
import { addMyOrder, setTotalAmount, clearCart } from '../redux/userSlice';
import { BiRupee } from "react-icons/bi";

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null
}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
  const { cartItems, totalAmount, userData, coupon, discount } = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee = totalAmount > 500 ? 0 : 40
  const AmountWithDeliveryFee = totalAmount + deliveryFee

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1]
    const longitude = userData.location.coordinates[0]
    dispatch(setLocation({ lat: latitude, lon: longitude }))
    getAddressByLatLng(latitude, longitude)
  }

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`, {
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon
        },
        totalAmount: AmountWithDeliveryFee,
        cartItems,
        couponCode: coupon?.code,
        discountAmount: discount
      }, { withCredentials: true })

      if (paymentMethod == "cod") {
        dispatch(addMyOrder(result.data))
        dispatch(clearCart())
        navigate("/order-placed")
      } else {
        const orderId = result.data.orderId
        const razorOrder = result.data.razorOrder
        openRazorpayWindow(orderId, razorOrder)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: 'INR',
      name: "SmartEats",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            orderId
          }, { withCredentials: true })
          dispatch(addMyOrder(result.data))
          dispatch(clearCart())
          navigate("/order-placed")
        } catch (error) {
          console.log(error)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 relative overflow-hidden'>
      {/* Money Pattern Background */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-10 left-10 text-9xl'>₹</div>
        <div className='absolute top-40 right-20 text-7xl'>₹</div>
        <div className='absolute bottom-20 left-1/4 text-6xl'>₹</div>
        <div className='absolute bottom-40 right-1/3 text-8xl'>₹</div>
      </div>

      {/* Back Button */}
      <div className='absolute top-6 left-6 z-50'>
        <button
          onClick={() => navigate("/")}
          className='bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-emerald-200'
        >
          <IoIosArrowRoundBack size={28} className='text-emerald-600' />
        </button>
      </div>

      <div className='relative flex items-center justify-center px-6 py-4'>
        <div className='w-full max-w-5xl'>
          {/* Header with Money Theme */}
          <div className='text-center mb-6'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-2xl shadow-xl mb-2'>
              <FaShieldAlt className='text-xl' />
              <h1 className='text-2xl font-black tracking-tight'>Secure Checkout</h1>
              <FaShieldAlt className='text-xl' />
            </div>
            <p className='text-gray-600 text-sm font-medium'>Complete your order safely & securely</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left Column - Location & Payment */}
            <div className='lg:col-span-2 space-y-6'>

              {/* Delivery Location Card */}
              <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg'>
                    <IoLocationSharp className='text-white text-2xl' />
                  </div>
                  <h2 className='text-2xl font-black text-gray-800'>Delivery Location</h2>
                </div>

                <div className='flex gap-3 mb-4'>
                  <input
                    type="text"
                    className='flex-1 border-2 border-emerald-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all bg-white shadow-inner'
                    placeholder='Enter delivery address...'
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                  />
                  <button
                    className='bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
                    onClick={getLatLngByAddress}
                  >
                    <IoSearchOutline size={20} />
                  </button>
                  <button
                    className='bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
                    onClick={getCurrentLocation}
                  >
                    <TbCurrentLocation size={20} />
                  </button>
                </div>

                <div className='rounded-2xl border-4 border-emerald-200 overflow-hidden shadow-xl'>
                  <div className='h-64 w-full'>
                    <MapContainer className={"w-full h-full"} center={[location?.lat, location?.lon]} zoom={16}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <RecenterMap location={location} />
                      <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
                    </MapContainer>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='bg-gradient-to-br from-amber-500 to-yellow-600 p-3 rounded-2xl shadow-lg'>
                    <BiRupee className='text-white text-3xl font-black' />
                  </div>
                  <h2 className='text-2xl font-black text-gray-800'>Payment Method</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Cash on Delivery */}
                  <div
                    className={`relative cursor-pointer rounded-2xl border-3 p-6 transition-all duration-300 transform hover:scale-105 ${paymentMethod === "cod"
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-2xl scale-105"
                      : "border-gray-200 bg-white hover:border-emerald-300 shadow-lg hover:shadow-xl"
                      }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    {paymentMethod === "cod" && (
                      <div className='absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-2 shadow-xl'>
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                        </svg>
                      </div>
                    )}
                    <div className='flex items-center gap-4'>
                      <div className='bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-xl shadow-lg'>
                        <MdDeliveryDining className='text-white text-3xl' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-black text-gray-800 text-lg'>Cash On Delivery</p>
                        <p className='text-sm text-gray-600 font-medium mt-1'>Pay when delivered</p>
                      </div>
                    </div>
                  </div>

                  {/* Online Payment */}
                  <div
                    className={`relative cursor-pointer rounded-2xl border-3 p-6 transition-all duration-300 transform hover:scale-105 ${paymentMethod === "online"
                      ? "border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-2xl scale-105"
                      : "border-gray-200 bg-white hover:border-amber-300 shadow-lg hover:shadow-xl"
                      }`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    {paymentMethod === "online" && (
                      <div className='absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-2 shadow-xl'>
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                        </svg>
                      </div>
                    )}
                    <div className='flex items-center gap-4'>
                      <div className='flex gap-2'>
                        <div className='bg-gradient-to-br from-purple-400 to-indigo-500 p-3 rounded-lg shadow-lg'>
                          <FaMobileScreenButton className='text-white text-xl' />
                        </div>
                        <div className='bg-gradient-to-br from-blue-400 to-cyan-500 p-3 rounded-lg shadow-lg'>
                          <FaCreditCard className='text-white text-xl' />
                        </div>
                      </div>
                      <div className='flex-1'>
                        <p className='font-black text-gray-800 text-lg'>Digital Payment</p>
                        <p className='text-sm text-gray-600 font-medium mt-1'>UPI / Cards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className='lg:col-span-1'>
              <div className='sticky top-6 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-emerald-200'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='bg-gradient-to-br from-amber-500 to-yellow-600 p-3 rounded-2xl shadow-lg'>
                    <BiRupee className='text-white text-3xl font-black' />
                  </div>
                  <h2 className='text-2xl font-black text-gray-800'>Bill Summary</h2>
                </div>

                {/* Items List */}
                <div className='space-y-3 mb-6 max-h-48 overflow-y-auto pr-2'>
                  {cartItems.map((item, index) => (
                    <div key={index} className='flex justify-between items-start bg-white/60 rounded-xl p-3 border border-emerald-100'>
                      <div className='flex-1'>
                        <p className='font-bold text-gray-800 text-sm leading-tight'>{item.name}</p>
                        <p className='text-xs text-gray-600 font-medium mt-1'>Qty: {item.quantity}</p>
                      </div>
                      <div className='flex items-center gap-1 font-black text-emerald-700'>
                        <BiRupee className='text-lg' />
                        <span>{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent my-6'></div>

                {/* Price Breakdown */}
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-700 font-semibold'>Subtotal</span>
                    <div className='flex items-center gap-1 font-bold text-gray-800'>
                      <BiRupee className='text-xl' />
                      <span className='text-lg'>{totalAmount}</span>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-gray-700 font-semibold'>Delivery Fee</span>
                    <div className='flex items-center gap-1 font-bold text-emerald-600'>
                      {deliveryFee === 0 ? (
                        <span className='text-lg bg-emerald-100 px-3 py-1 rounded-full'>FREE 🎉</span>
                      ) : (
                        <>
                          <BiRupee className='text-xl' />
                          <span className='text-lg'>{deliveryFee}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent my-6'></div>

                {/* Total Amount */}
                <div className='bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 shadow-xl mb-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-white font-bold text-lg'>Total Amount</span>
                    <div className='flex items-center gap-1 text-white'>
                      <BiRupee className='text-2xl font-bold' />
                      <span className='text-2xl font-bold tracking-tight'>{AmountWithDeliveryFee}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  className='w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-gray-900 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-amber-600 relative overflow-hidden group'
                  onClick={handlePlaceOrder}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                  <div className='relative flex items-center justify-center gap-2'>
                    {paymentMethod == "cod" ? "Place Order" : "Proceed to Pay"}
                    <BiRupee className='text-2xl' />
                  </div>
                </button>

                {/* Security Badge */}
                <div className='mt-6 flex items-center justify-center gap-2 text-gray-600'>
                  <FaShieldAlt className='text-emerald-500' />
                  <p className='text-xs font-semibold'>100% Secure Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut
