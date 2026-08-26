import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import HeroSlider from './HeroSlider';


function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])

  const handleFilterByCategory = (category) => {
    if (category == "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)
    }
  }

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -300 : 300,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      cateScrollRef.current.addEventListener('scroll', () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }

    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
  }, [categories])

  return (
    <div className='w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-y-auto relative'>
      {/* Animated Background Orbs */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-blob'></div>
        <div className='absolute top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-3xl animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-br from-red-400/30 to-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-4000'></div>
      </div>

      {/* Floating Particles */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
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

      {/* Search Results - Appears right after Nav */}
      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-7xl px-6 mt-8 mb-10 relative z-10'>
          <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-100 p-6'>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30'>
                <span className='text-2xl'>🔍</span>
              </div>
              <div>
                <h2 className='text-2xl font-black text-gray-900'>Search Results</h2>
                <p className='text-sm text-gray-500 font-medium'>{searchItems.length} items found</p>
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {searchItems.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Only shows when no search results */}
      {(!searchItems || searchItems.length === 0) && (
        <HeroSlider currentCity={currentCity} />
      )}

      {/* Categories Section */}
      <div className="w-full max-w-7xl px-6 mb-10 relative z-10">
        <div className='mb-6'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-orange-100 mb-3'>
            <span className='text-xl'>✨</span>
            <span className='text-xs font-bold text-orange-600 uppercase tracking-wider'>Explore</span>
          </div>
          <h2 className='text-3xl md:text-4xl font-black text-gray-900 mb-1.5'>
            Inspiration for your first order
          </h2>
          <p className='text-base text-gray-600 font-medium'>Browse by your favorite categories</p>
        </div>

        <div className='relative group'>
          {showLeftCateButton && (
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-orange-50 text-orange-600 rounded-full shadow-xl hover:shadow-2xl z-20 flex items-center justify-center transition-all duration-300 border-2 border-orange-200 hover:scale-110 opacity-0 group-hover:opacity-100'
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}

          <div className='w-full flex overflow-x-auto gap-5 pb-3 snap-x snap-mandatory hide-scrollbar' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <div key={index} className='snap-start'>
                <CategoryCard name={cate.category} image={cate.image} onClick={() => handleFilterByCategory(cate.category)} />
              </div>
            ))}
          </div>

          {showRightCateButton && (
            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-orange-50 text-orange-600 rounded-full shadow-xl hover:shadow-2xl z-20 flex items-center justify-center transition-all duration-300 border-2 border-orange-200 hover:scale-110 opacity-0 group-hover:opacity-100'
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Best Shops Section */}
      <div className='w-full max-w-7xl px-6 mb-10 relative z-10'>
        <div className='mb-6'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-purple-100 mb-3'>
            <span className='text-xl'>⭐</span>
            <span className='text-xs font-bold text-purple-600 uppercase tracking-wider'>Top Rated</span>
          </div>
          <h2 className='text-3xl md:text-4xl font-black text-gray-900 mb-1.5'>
            Best Shops in {currentCity}
          </h2>
          <p className='text-base text-gray-600 font-medium'>Handpicked restaurants just for you</p>
        </div>

        <div className='relative group'>
          {showLeftShopButton && (
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-purple-50 text-purple-600 rounded-full shadow-xl hover:shadow-2xl z-20 flex items-center justify-center transition-all duration-300 border-2 border-purple-200 hover:scale-110 opacity-0 group-hover:opacity-100'
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}

          <div className='w-full flex overflow-x-auto gap-5 pb-3 snap-x snap-mandatory hide-scrollbar' ref={shopScrollRef}>
            {shopInMyCity && shopInMyCity.length > 0 ? (
              shopInMyCity.map((shop, index) => (
                <div key={index} className='snap-start'>
                  <CategoryCard
                    name={shop.name}
                    image={shop.image}
                    isOpen={shop.isOpen}
                    onClick={() => navigate(`/shop/${shop._id}`)}
                  />
                </div>
              ))
            ) : (
              <div className='w-full flex items-center justify-center py-10'>
                <p className='text-gray-500 font-medium text-lg'>No shops found in {currentCity}</p>
              </div>
            )}
          </div>

          {showRightShopButton && (
            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-purple-50 text-purple-600 rounded-full shadow-xl hover:shadow-2xl z-20 flex items-center justify-center transition-all duration-300 border-2 border-purple-200 hover:scale-110 opacity-0 group-hover:opacity-100'
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Food Items */}
      <div className='w-full max-w-7xl px-6 pb-12 relative z-10'>
        <div className='mb-6'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-green-100 mb-3'>
            <span className='text-xl'>🍽️</span>
            <span className='text-xs font-bold text-green-600 uppercase tracking-wider'>For You</span>
          </div>
          <h2 className='text-3xl md:text-4xl font-black text-gray-900 mb-1.5'>
            Suggested Food Items
          </h2>
          <p className='text-base text-gray-600 font-medium'>Curated selections based on your taste</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {updatedItemsList?.map((item, index) => (
            <div key={index} className='transform hover:scale-105 transition-transform duration-300'>
              <FoodCard data={item} />
            </div>
          ))}
        </div>
      </div>

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
      `}</style>
    </div>
  )
}

export default UserDashboard
