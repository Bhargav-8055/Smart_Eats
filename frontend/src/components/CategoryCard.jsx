import React from 'react'

function CategoryCard({ name, image, onClick, isOpen = true }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group transition-all duration-300 ${!isOpen ? 'opacity-70' : ''}`}
      onClick={onClick}
    >
      <div className='relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-white group-hover:scale-105'>
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!isOpen ? 'grayscale' : ''}`}
        />
        {!isOpen && (
          <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
            <span className='text-white font-bold text-xs bg-red-600 px-2 py-1 rounded-full'>CLOSED</span>
          </div>
        )}
      </div>
      <h3 className='text-sm sm:text-base font-bold text-gray-700 group-hover:text-orange-600 transition-colors text-center leading-tight px-2'>
        {name}
      </h3>
    </div>
  )
}

export default CategoryCard
