import axios from 'axios';
import React from 'react'
import { FaPen, FaTrashAlt, FaFire } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDelete = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
            dispatch(setMyShopData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='group bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-200/20 transition-all duration-300 hover:-translate-y-0.5'>
            {/* Image Container with Overlay */}
            <div className='relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50'>
                <img
                    src={data.image}
                    alt={data.name}
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-400'
                />

                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>

                {/* Category Badge */}
                <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg border border-white/50'>
                    <span className='text-xs font-bold text-gray-900 uppercase tracking-wide'>{data.category}</span>
                </div>

                {/* Image action buttons intentionally removed so hover doesn't show icons here. */}

                {/* Food Type Badge */}
                <div className='absolute bottom-4 right-4'>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${data.foodType === 'veg'
                            ? 'bg-green-100/90 text-green-700 border-green-200'
                            : 'bg-red-100/90 text-red-700 border-red-200'
                        }`}>
                        {data.foodType === 'veg' ? '🥗 Veg' : '🍗 Non-Veg'}
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className='p-4 flex flex-col'>
                {/* Item Name and Price */}
                <div className='mb-4'>
                    <h2 className='text-lg font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300'>
                        {data.name}
                    </h2>
                    <div className='flex items-baseline gap-2'>
                        <span className='text-2xl font-black text-orange-600'>₹{data.price}</span>
                        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>incl. taxes</span>
                    </div>
                </div>

                {/* Category Label */}
                <div className='mb-3 pb-3 border-b border-gray-100'>
                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Category</p>
                    <p className='text-sm font-bold text-gray-900'>{data.category}</p>
                </div>

                {/* Bottom Action Buttons */}
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(`/edit-item/${data._id}`)}
                        className='flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-orange-400/25 hover:shadow-lg transition-all duration-200 transform hover:scale-103'
                    >
                        <FaPen size={14} />
                        <span className='text-sm'>Edit</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className='flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-red-400/25 hover:shadow-lg transition-all duration-200 transform hover:scale-103'
                    >
                        <FaTrashAlt size={14} />
                        <span className='text-sm'>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OwnerItemCard
