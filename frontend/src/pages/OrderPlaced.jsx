import React from 'react'
import { FaCircleCheck, FaArrowRight, FaReceipt, FaClock } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/40 flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
      {/* Decorative circles */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl'></div>

      {/* Main Card */}
      <div className='relative z-10 bg-white rounded-3xl shadow-2xl shadow-green-500/10 p-12 max-w-2xl w-full border border-green-100/50'>
        {/* Success Icon with Animation */}
        <div className='relative mb-8'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-32 h-32 bg-green-500/10 rounded-full animate-ping'></div>
          </div>
          <div className='relative w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40'>
            <FaCircleCheck className='text-white text-6xl' />
          </div>
        </div>

        {/* Success Message */}
        <h1 className='text-5xl font-black text-gray-900 mb-4 tracking-tight'>
          Order Placed!
        </h1>
        <div className='h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-6'></div>

        <p className='text-lg text-gray-600 max-w-md mx-auto mb-10 leading-relaxed font-medium'>
          Thank you for your purchase! Your order is being prepared with care.
          Track your order status anytime in the <span className='text-green-600 font-bold'>"My Orders"</span> section.
        </p>

        {/* Info Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-10'>
          <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100'>
            <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md'>
              <FaReceipt className='text-green-600' size={20} />
            </div>
            <p className='text-sm text-gray-600 font-medium'>Order Confirmed</p>
            <p className='text-xs text-gray-500 mt-1'>We've received your order</p>
          </div>
          <div className='bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100'>
            <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md'>
              <FaClock className='text-blue-600' size={20} />
            </div>
            <p className='text-sm text-gray-600 font-medium'>Estimated Time</p>
            <p className='text-xs text-gray-500 mt-1'>30-40 minutes</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            className='group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 flex items-center justify-center gap-3'
            onClick={() => navigate("/my-orders")}
          >
            <span>View My Orders</span>
            <FaArrowRight className='group-hover:translate-x-1 transition-transform duration-300' size={18} />
          </button>
          <button
            className='bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 shadow-lg'
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Confetti Effect (CSS-based) */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-green-400 rounded-full opacity-60'
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              animation: `fall ${3 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <style>{`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
    </div>
  )
}

export default OrderPlaced
