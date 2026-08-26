import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';
function CartItemCard({ data }) {
  const dispatch = useDispatch()
  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }))
  }
  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }))
    }

  }
  return (
    <div className='relative group'>
      {/* Animated background gradient */}
      <div className='absolute inset-0 bg-gradient-to-r from-orange-300/20 via-red-300/20 to-orange-300/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

      <div className='relative flex items-center justify-between bg-gradient-to-br from-white to-orange-50/50 p-6 rounded-3xl shadow-xl shadow-orange-200/40 border border-orange-100/80 hover:shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 hover:-translate-y-1'>

        {/* Left Section - Product Info */}
        <div className='flex items-center gap-5 flex-1'>
          {/* Image Container */}
          <div className='relative overflow-hidden rounded-2xl border-2 border-orange-100 bg-gradient-to-br from-orange-100 via-red-50 to-pink-50 shadow-lg group/img'>
            <img
              src={data.image}
              alt={data.name}
              className='w-28 h-28 object-cover group-hover/img:scale-125 transition-transform duration-500 filter group-hover/img:brightness-110'
            />

          </div>

          {/* Product Details */}
          <div className='flex-1'>
            <h1 className='font-black text-gray-900 text-lg mb-2 line-clamp-2'>{data.name}</h1>

            <div className='flex items-baseline gap-2 mb-3'>
              <span className='text-2xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent'>
                ₹{data.price * data.quantity}
              </span>
            </div>

            {/* Unit Price */}
            <p className='text-xs text-gray-500 font-medium'>
              <span className='font-bold text-gray-700'>₹{data.price}</span> per item
            </p>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className='flex items-center gap-3'>
          {/* Decrease Button */}
          <button
            className='p-2.5 cursor-pointer bg-white/90 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg border-2 border-orange-200 hover:border-transparent group/btn'
            onClick={() => handleDecrease(data.id, data.quantity)}
            title="Decrease quantity"
          >
            <FaMinus size={16} className='text-orange-600 group-hover/btn:text-white transition-colors duration-300' />
          </button>

          {/* Quantity Display */}
          <div className='min-w-[3rem] text-center'>
            <span className='font-black text-gray-900 text-xl block'>{data.quantity}</span>
          </div>

          {/* Increase Button */}
          <button
            className='p-2.5 cursor-pointer bg-white/90 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg border-2 border-orange-200 hover:border-transparent group/btn'
            onClick={() => handleIncrease(data.id, data.quantity)}
            title="Increase quantity"
          >
            <FaPlus size={16} className='text-orange-600 group-hover/btn:text-white transition-colors duration-300' />
          </button>

          {/* Remove Button */}
          <button
            className="p-2.5 bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-600 hover:to-pink-600 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg border-2 border-red-200 hover:border-transparent ml-1"
            onClick={() => dispatch(removeCartItem(data.id))}
            title="Remove from cart"
          >
            <CiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className='absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
    </div>
  )
}

export default CartItemCard
