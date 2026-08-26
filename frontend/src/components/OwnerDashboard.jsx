import React from 'react'
import Nav from './Nav'
import { useSelector, useDispatch } from 'react-redux'
import { FaUtensils, FaPen, FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './ownerItemCard';
import axios from 'axios';
import { serverUrl } from '../config';
import { setMyShopData } from '../redux/ownerSlice';
import toast from 'react-hot-toast';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Remove handleToggleStatus function
  // Remove UI related to open/close shop badge and button
  // Remove all references to isOpen shop status

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-x-hidden relative'>
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

      <Nav />

      {/* Empty State - No Shop */}
      {!myShopData && (
        <div className='w-full h-screen flex items-center justify-center px-4 sm:px-6 relative z-10'>
          <div className='max-w-2xl w-full'>
            {/* Decorative Top Badge */}
            <div className='flex justify-center mb-8'>
              <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-orange-100'>
                <span className='text-2xl'>🍽️</span>
                <span className='text-xs font-bold text-orange-600 uppercase tracking-wider'>Start Your Journey</span>
              </div>
            </div>

            {/* Main Content Card */}
            <div className='bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-[2px] shadow-2xl shadow-orange-500/30'>
              <div className='bg-white rounded-[calc(1.5rem-2px)] p-8 sm:p-12 relative overflow-hidden'>
                {/* Decorative gradients */}
                <div className='absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl'></div>
                <div className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-200/40 to-transparent rounded-full blur-3xl'></div>

                <div className='relative z-10 text-center'>
                  {/* Icon */}
                  <div className='flex justify-center mb-6'>
                    <div className='w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/40 transform hover:scale-110 transition-transform duration-300'>
                      <FaUtensils className='text-white w-12 h-12' />
                    </div>
                  </div>

                  {/* Heading */}
                  <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight'>
                    Launch Your
                    <span className='block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent'>
                      Restaurant Today
                    </span>
                  </h2>

                  {/* Description */}
                  <p className='text-base sm:text-lg text-gray-600 font-medium max-w-xl mx-auto mb-8 leading-relaxed'>
                    Join thousands of successful restaurant owners and reach hungry customers across the city. Grow your business with our powerful delivery platform.
                  </p>

                  {/* Features List */}
                  <div className='grid grid-cols-3 gap-3 sm:gap-4 mb-8'>
                    <div className='bg-orange-50 rounded-xl p-3 border border-orange-100'>
                      <div className='text-2xl mb-2'>📊</div>
                      <p className='text-xs font-bold text-gray-700'>Real-time Analytics</p>
                    </div>
                    <div className='bg-red-50 rounded-xl p-3 border border-red-100'>
                      <div className='text-2xl mb-2'>🚚</div>
                      <p className='text-xs font-bold text-gray-700'>Quick Delivery</p>
                    </div>
                    <div className='bg-pink-50 rounded-xl p-3 border border-pink-100'>
                      <div className='text-2xl mb-2'>⭐</div>
                      <p className='text-xs font-bold text-gray-700'>5-Star Reviews</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate("/create-edit-shop")}
                    className='inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105'
                  >
                    <FaPlus className='w-5 h-5' />
                    Create Your Restaurant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Exists - Main Dashboard */}
      {myShopData && (
        <div className='w-full flex flex-col items-center px-4 sm:px-6 pb-16 relative z-10'>
          {/* Welcome Section */}
          <div className='w-full max-w-5xl mt-8 mb-10'>
            <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-orange-100 mb-4'>
              <span className='text-xl'>👨‍🍳</span>
              <span className='text-xs font-bold text-orange-600 uppercase tracking-wider'>Dashboard</span>
            </div>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight'>
              Welcome back,
              <span className='block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent'>
                {myShopData.name}
              </span>
            </h1>
            <p className='text-base sm:text-lg text-gray-600 font-medium'>Manage your restaurant and grow your business</p>
          </div>

          {/* Shop Info Card */}
          <div className='w-full max-w-5xl mb-10'>
            <div className='bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-orange-100 group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300'>
              {/* Shop Image Container */}
              <div className='relative h-64 sm:h-72 md:h-80 overflow-hidden'>
                <img
                  src={myShopData.image}
                  alt={myShopData.name}
                  className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                />
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent'></div>

                {/* Edit Button */}
                <button
                  onClick={() => navigate("/create-edit-shop")}
                  className='absolute top-4 sm:top-6 right-4 sm:right-6 w-12 sm:w-14 h-12 sm:h-14 bg-white/90 backdrop-blur-md hover:bg-white text-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white/50 hover:scale-110 transform'
                >
                  <FaPen size={18} className='sm:w-5 sm:h-5' />
                </button>

                {/* Status Badge & Toggle */}
                <div className='absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-3'>
                  <div className={`backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/50 transition-colors duration-300 bg-green-500/90 text-white`}>
                    <span className='text-sm font-bold flex items-center gap-2'>
                      ✨ Open
                    </span>
                  </div>
                </div>
              </div>

              {/* Shop Details */}
              <div className='p-6 sm:p-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {/* Name & Location */}
                  <div className='md:col-span-2'>
                    <h2 className='text-2xl sm:text-3xl font-black text-gray-900 mb-4'>{myShopData.name}</h2>
                    <div className='space-y-3'>
                      <div className='flex items-start gap-3'>
                        <span className='text-xl mt-1'>📍</span>
                        <div>
                          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Location</p>
                          <p className='text-gray-800 font-medium'>{myShopData.city}, {myShopData.state}</p>
                        </div>
                      </div>
                      <div className='flex items-start gap-3'>
                        <span className='text-xl mt-1'>🏢</span>
                        <div>
                          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Address</p>
                          <p className='text-gray-800 font-medium'>{myShopData.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className='bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100'>
                    <p className='text-xs font-bold text-orange-600 uppercase tracking-wider mb-4'>Menu Stats</p>
                    <div className='text-center'>
                      <p className='text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text'>
                        {myShopData.items?.length || 0}
                      </p>
                      <p className='text-sm text-gray-600 font-medium mt-2'>Active Items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          {myShopData.items.length === 0 ? (
            <div className='w-full max-w-5xl'>
              {/* Empty Items State */}
              <div className='bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 rounded-3xl p-[2px] shadow-2xl shadow-red-500/30'>
                <div className='bg-white rounded-[calc(1.5rem-2px)] p-8 sm:p-12 relative overflow-hidden'>
                  {/* Decorative gradients */}
                  <div className='absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-200/40 to-transparent rounded-full blur-3xl'></div>
                  <div className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/40 to-transparent rounded-full blur-3xl'></div>

                  <div className='relative z-10 text-center'>
                    {/* Icon */}
                    <div className='flex justify-center mb-6'>
                      <div className='w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/40 transform hover:scale-110 transition-transform duration-300'>
                        <FaUtensils className='text-white w-12 h-12' />
                      </div>
                    </div>

                    {/* Heading */}
                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight'>
                      Your menu is
                      <span className='block bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent'>
                        waiting to shine
                      </span>
                    </h2>

                    {/* Description */}
                    <p className='text-base sm:text-lg text-gray-600 font-medium max-w-xl mx-auto mb-8 leading-relaxed'>
                      Add your delicious food items to start receiving orders. Build your complete menu and delight your customers.
                    </p>

                    {/* Features List */}
                    <div className='grid grid-cols-3 gap-3 sm:gap-4 mb-8'>
                      <div className='bg-red-50 rounded-xl p-3 border border-red-100'>
                        <div className='text-2xl mb-2'>📸</div>
                        <p className='text-xs font-bold text-gray-700'>Nice Photos</p>
                      </div>
                      <div className='bg-pink-50 rounded-xl p-3 border border-pink-100'>
                        <div className='text-2xl mb-2'>💰</div>
                        <p className='text-xs font-bold text-gray-700'>Set Prices</p>
                      </div>
                      <div className='bg-rose-50 rounded-xl p-3 border border-rose-100'>
                        <div className='text-2xl mb-2'>🎯</div>
                        <p className='text-xs font-bold text-gray-700'>Get Orders</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate("/add-item")}
                      className='inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105'
                    >
                      <FaPlus className='w-5 h-5' />
                      Add Your First Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='w-full max-w-7xl'>
              {/* Items List Header */}
              <div className='mb-8'>
                <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-green-100 mb-4'>
                  <span className='text-xl'>🍽️</span>
                  <span className='text-xs font-bold text-green-600 uppercase tracking-wider'>Menu Items</span>
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                  <div>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1.5'>
                      Your Menu
                    </h2>
                    <p className='text-base text-gray-600 font-medium'>{myShopData.items.length} delicious items</p>
                  </div>
                  <button
                    onClick={() => navigate("/add-item")}
                    className='flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold shadow-lg shadow-green-500/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap'
                  >
                    <FaPlus className='w-5 h-5' />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8'>
                {myShopData.items.map((item, index) => (
                  <div key={index} className='transform hover:scale-102 transition-transform duration-300'>
                    <OwnerItemCard data={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
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

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}

export default OwnerDashboard
