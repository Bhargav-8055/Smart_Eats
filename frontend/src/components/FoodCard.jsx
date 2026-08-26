import React from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import toast from 'react-hot-toast';

function FoodCard({ data }) {
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.user)

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                (i <= rating) ? (
                    <FaStar className='text-yellow-500 text-lg' key={i} />
                ) : (
                    <FaRegStar className='text-yellow-500 text-lg' key={i} />
                )
            )

        }
        return stars
    }

    const handleAddToCart = (e) => {
        e.stopPropagation()
        // if not already in cart, add with quantity 1
        if (!cartItems.some(i => i.id == data._id)) {
            dispatch(addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                shop: data.shop,
                quantity: 1,
                foodType: data.foodType
            }))
            toast.success("Added to cart")
        }
    }

    return (
        <div className={`w-56 sm:w-60 rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col`}>
            <div className='relative w-full h-40 sm:h-44 flex items-center justify-center bg-white overflow-hidden'>
                {/* food type badge */}
                <div className='absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm'>
                    {data.foodType == "veg" ? <FaLeaf className='text-green-600 text-sm' /> : <FaDrumstickBite className='text-red-600 text-sm' />}
                </div>

                <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
            </div>

            <div className="flex-1 flex flex-col p-3">
                <h1 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>{data.name}</h1>

                <div className='flex items-center gap-2 mt-2'>
                    <div className='flex items-center gap-1'>
                        {renderStars(data.rating?.average || 0)}
                    </div>
                    <span className='text-xs text-gray-500'>
                        {data.rating?.count || 0}
                    </span>
                </div>
            </div>

            <div className='flex items-center justify-between mt-auto p-3'>
                <span className='font-bold text-gray-900 text-lg'>₹{data.price}</span>

                <div className='flex items-center gap-3'>
                    <button
                        className={`${cartItems.some(i => i.id == data._id) ? "bg-gray-800" : "bg-[#ff4d2d] hover:brightness-95"} inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-base font-semibold text-white shadow-md transition`}
                        onClick={handleAddToCart}
                    >
                        <span>{cartItems.some(i => i.id == data._id) ? 'In Cart' : 'Add'}</span>
                        <FaShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FoodCard
