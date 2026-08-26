import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import axios from 'axios';
import { serverUrl } from '../config';
import { setCoupon } from '../redux/userSlice';
import { BiSolidOffer } from "react-icons/bi";

function CartPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cartItems, totalAmount, coupon, discount } = useSelector(state => state.user)
    const [couponCode, setCouponCode] = useState(coupon?.code || "")
    const [coupons, setCoupons] = useState([])
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(coupon ? `Coupon applied! You saved ₹${discount}` : "")

    // Initialize couponCode from Redux on mount
    useEffect(() => {
        if (coupon?.code) {
            setCouponCode(coupon.code);
            setSuccess(`Coupon applied! You saved ₹${discount}`);
        }
    }, []);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/coupon/all`, { withCredentials: true })
                setCoupons(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchCoupons()
    }, [])

    const handleApplyCoupon = async () => {
        try {
            setError("")
            setSuccess("")
            // Calculate subtotal before discount for validation
            const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

            const res = await axios.post(`${serverUrl}/api/coupon/validate`, {
                code: couponCode,
                cartAmount: subtotal
            }, { withCredentials: true })

            if (res.data.success) {
                dispatch(setCoupon({
                    code: res.data.code,
                    discount: res.data.discount
                }))
                setSuccess(`Coupon applied! You saved ₹${res.data.discount}`)
            }
        } catch (error) {
            dispatch(setCoupon(null))
            setError(error.response?.data?.message || "Invalid Coupon")
        }
    }

    const removeCoupon = () => {
        dispatch(setCoupon(null))
        setCouponCode("")
        setSuccess("")
        setError("")
    }

    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
            <div className='w-full max-w-[800px]'>
                <div className='flex items-center gap-[20px] mb-6 '>
                    <div className=' z-[10] ' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
                    <h1 className='"text-2xl font-bold  text-start'>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <div className='text-7xl mb-4 animate-bounce'>🛒</div>
                        <h2 className='text-3xl font-black text-gray-800 mb-2'>Your Cart is Empty</h2>
                        <p className='text-gray-600 text-lg mb-6 text-center'>Oops! Your cart is waiting for some delicious food items.</p>
                        <p className='text-gray-500 text-base mb-8 max-w-sm text-center'>Add your favorite meals now and get ready to satisfy your hunger! 😋</p>
                        <button onClick={() => navigate("/")} className='px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg'>Start Shopping</button>
                    </div>
                ) : (<>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>

                    {/* Coupon Section */}
                    <div className='mt-6 bg-white p-4 rounded-2xl shadow-sm border border-orange-100'>
                        <h2 className='text-lg font-bold text-gray-800 mb-3 flex items-center gap-2'>
                            <BiSolidOffer className='text-orange-500 text-xl' />
                            Apply Coupon
                        </h2>

                        <div className='flex gap-2 mb-3'>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder='Enter Coupon Code'
                                className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] uppercase'
                                disabled={!!coupon}
                            />
                            {coupon ? (
                                <button onClick={removeCoupon} className='bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200'>Remove</button>
                            ) : (
                                <button onClick={handleApplyCoupon} className='bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900'>Apply</button>
                            )}
                        </div>

                        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
                        {success && <p className='text-green-500 text-sm mb-2'>{success}</p>}

                        {/* Available Coupons List */}
                        {!coupon && coupons.length > 0 && (
                            <div className='mt-3 space-y-2'>
                                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Available Coupons</p>
                                <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
                                    {coupons.map((c) => (
                                        <div key={c._id} onClick={() => setCouponCode(c.code)} className='flex-shrink-0 border border-dashed border-orange-300 bg-orange-50 rounded-lg p-2 cursor-pointer hover:bg-orange-100 transition-colors min-w-[150px]'>
                                            <p className='font-bold text-orange-600 text-sm'>{c.code}</p>
                                            <p className='text-xs text-gray-600 truncate'>{c.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='relative group/total mt-6'>
                        {/* Animated highlight glow */}
                        <div className='absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-orange-400/20 rounded-2xl blur-xl opacity-0 group-hover/total:opacity-100 transition-opacity duration-500'></div>

                        <div className='relative px-6 py-4 rounded-2xl flex flex-col gap-2 backdrop-blur-2xl bg-gradient-to-r from-white/50 to-orange-50/50 border-2 border-white/60 shadow-xl shadow-orange-200/30 hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300'>

                            <div className='flex justify-between items-center text-gray-600'>
                                <span>Subtotal</span>
                                <span>₹{cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}</span>
                            </div>

                            {discount > 0 && (
                                <div className='flex justify-between items-center text-green-600 font-medium'>
                                    <span>Discount ({coupon?.code})</span>
                                    <span>- ₹{discount}</span>
                                </div>
                            )}

                            <div className='h-[1px] bg-gray-200 my-1'></div>

                            <div className='flex justify-between items-center'>
                                <h1 className='text-lg font-bold text-gray-700'>Total Amount</h1>
                                <span className='text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent'>₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex justify-end' >
                        <button className='bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition cursor-pointer' onClick={() => navigate("/checkout")}>Proceed to CheckOut</button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default CartPage
