import React, { useEffect, useState, useRef } from 'react'
import { FaLocationDot, FaUser, FaRightFromBracket } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../config';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function Nav() {
    const userState = useSelector(state => state.user)
    const { userData, currentCity, cartItems } = userState
    const socket = userState.socket || null
    const { myShopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query, setQuery] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
            dispatch(setSearchItems(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (query) {
            handleSearchItems()
        } else {
            dispatch(setSearchItems(null))
        }
    }, [query])

    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowInfo(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 overflow-visible'>

            {showSearch && userData.role == "user" && <div className='w-[90%] h-[70px]  bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                    <FaLocationDot size={25} className=" text-[#ff4d2d]" />
                    <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[#ff4d2d]' />
                    <input type="text" placeholder='search delicious food...' className='px-[10px] text-gray-700 outline-0 w-full' onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>
            </div>}

            <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>SmartEats</h1>
            {userData.role == "user" && <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                    <FaLocationDot size={25} className=" text-[#ff4d2d]" />
                    <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[#ff4d2d]' />
                    <input type="text" placeholder='search delicious food...' className='px-[10px] text-gray-700 outline-0 w-full' onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>
            </div>}

            <div className='flex items-center gap-4'>
                {userData.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(false)} /> : <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(true)} />)
                }
                {userData.role == "owner" ? <>
                    {myShopData && <> <button className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate("/add-item")}>
                        <FaPlus size={20} />
                        <span>Add Food Item</span>
                    </button>
                        <button className='md:hidden flex items-center  p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate("/add-item")}>
                            <FaPlus size={20} />
                        </button></>}

                    <div className='hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium' onClick={() => navigate("/my-orders")}>
                        <TbReceipt2 size={20} />
                        <span>My Orders</span>
                    </div>
                    <div className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium' onClick={() => navigate("/my-orders")}>
                        <TbReceipt2 size={20} />
                    </div>
                </> : (
                    <>
                        {userData.role == "user" && <div className='relative cursor-pointer' onClick={() => navigate("/cart")}>
                            <FiShoppingCart size={25} className='text-[#ff4d2d]' />
                            <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d]'>{cartItems.length}</span>
                        </div>}


                        <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium' onClick={() => navigate(userData.role === "deliveryBoy" ? "/my-deliveries" : "/my-orders")}>
                            {userData.role === "deliveryBoy" ? "My Deliveries" : "My Orders"}
                        </button>
                    </>
                )}

                {/* User Profile Button */}
                <div className='relative' ref={dropdownRef}>
                    <div
                        className='w-[45px] h-[45px] rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 text-white text-lg shadow-lg font-bold cursor-pointer hover:scale-110 transition-transform duration-200 border-2 border-white'
                        onClick={() => setShowInfo(prev => !prev)}
                    >
                        {userData?.fullName.slice(0, 1).toUpperCase()}
                    </div>

                    {/* Dropdown Menu */}
                    {showInfo && (
                        <div className='absolute top-[55px] right-0 w-[280px] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 z-[9999]'>
                            {/* Header */}
                            <div className='bg-gradient-to-r from-orange-500 to-red-600 p-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold border-2 border-white/30'>
                                        {userData?.fullName.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className='text-white font-bold text-base'>{userData.fullName}</p>
                                        <p className='text-white/80 text-xs capitalize'>{userData.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className='p-2'>
                                {/* My Orders/Deliveries - Mobile Only */}
                                {(userData.role == "user" || userData.role == "deliveryBoy") && (
                                    <button
                                        className='md:hidden w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 rounded-xl transition-colors duration-200 group'
                                        onClick={() => {
                                            navigate(userData.role === "deliveryBoy" ? "/my-deliveries" : "/my-orders")
                                            setShowInfo(false)
                                        }}
                                    >
                                        <div className='w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors'>
                                            <TbReceipt2 className='text-orange-600' size={18} />
                                        </div>
                                        <span className='text-gray-700 font-medium'>{userData.role === "deliveryBoy" ? "My Deliveries" : "My Orders"}</span>
                                    </button>
                                )}

                                {/* Profile */}
                                <button
                                    className='w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors duration-200 group'
                                    onClick={() => {
                                        navigate("/profile")
                                        setShowInfo(false)
                                    }}
                                >
                                    <div className='w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors'>
                                        <FaUser className='text-gray-600' size={16} />
                                    </div>
                                    <span className='text-gray-700 font-medium'>My Profile</span>
                                </button>

                                {/* Logout */}
                                <button
                                    className='w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors duration-200 group'
                                    onClick={() => {
                                        handleLogOut()
                                        setShowInfo(false)
                                    }}
                                >
                                    <div className='w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors'>
                                        <FaRightFromBracket className='text-red-600' size={16} />
                                    </div>
                                    <span className='text-red-600 font-medium'>Log Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Nav
