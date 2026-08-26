import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../config'
import { hideRatingModal, setMyOrders } from '../redux/userSlice'

function Star({ value, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(value)} className={`text-2xl px-1 ${selected ? 'text-yellow-400' : 'text-gray-300'}`}>
      ★
    </button>
  )
}

export default function RateOrderModal() {
  const dispatch = useDispatch()
  const { ratingModal } = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [ratings, setRatings] = useState({})
  const [success, setSuccess] = useState(null)

  // when modal opens, lower map z-index (common map classes) so modal stays in front
  useEffect(() => {
    if (!ratingModal?.show) return
    const style = document.createElement('style')
    style.id = 'rating-modal-map-style'
    style.innerHTML = `
      .leaflet-container, .mapboxgl-canvas, .map, .ol-viewport { z-index: 0 !important; }
    `
    document.head.appendChild(style)
    return () => {
      const s = document.getElementById('rating-modal-map-style')
      if (s) s.remove()
    }
  }, [ratingModal?.show])

  useEffect(() => {
    if (!ratingModal?.show) return
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/get-order-by-id/${ratingModal.orderId}`, { withCredentials: true })
        setOrderData(res.data)
        // initialize ratings for items in the shopOrder
        const shopOrder = res.data.shopOrders.find(so => String(so._id) === String(ratingModal.shopOrderId))
        if (shopOrder && shopOrder.shopOrderItems) {
          const init = {}
          shopOrder.shopOrderItems.forEach(i => {
            const itemId = i.item?._id || i.item
            init[itemId] = 5 // default 5
          })
          setRatings(init)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrder()
  }, [ratingModal])

  if (!ratingModal?.show) return null

  const close = () => {
    setSuccess(null)
    dispatch(hideRatingModal())
  }

  const onSelect = (itemId, value) => {
    setRatings(prev => ({ ...prev, [itemId]: value }))
  }

  const handleSubmit = async () => {
    if (!orderData) return
    setLoading(true)
    try {
      const shopOrder = orderData.shopOrders.find(so => String(so._id) === String(ratingModal.shopOrderId))
      if (shopOrder && shopOrder.shopOrderItems) {
        for (const si of shopOrder.shopOrderItems) {
          const itemId = si.item?._id || si.item
          const r = ratings[itemId]
          if (itemId && r) {
            await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating: r }, { withCredentials: true })
          }
        }
      }
      setSuccess('Thanks for rating!')
      // refresh my orders in store so UI updates (soft update)
      try {
        const ordersRes = await axios.get(`${serverUrl}/api/order/get-my-orders`, { withCredentials: true })
        dispatch(setMyOrders(ordersRes.data))
      } catch (e) {
        console.warn('Could not refresh orders', e)
      }
      // close after short delay
      setTimeout(() => {
        close()
      }, 1200)
    } catch (err) {
      console.error(err)
      setSuccess('Could not submit ratings')
      setTimeout(() => setSuccess(null), 2000)
    } finally {
      setLoading(false)
    }
  }

  const shopOrder = orderData ? orderData.shopOrders.find(so => String(so._id) === String(ratingModal.shopOrderId)) : null

  return (
    <div className='fixed inset-0 z-[99999] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={close} />
      <div className='relative bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl z-50'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold'>Rate Your Order</h3>
          <button onClick={close} aria-label='Close rating' className='text-gray-500 hover:text-gray-700'>Close</button>
        </div>
        <div className='grid grid-cols-1 gap-4'>
          <p className='text-sm text-gray-600'>Thanks for ordering! Please rate the items you received.</p>
          {shopOrder ? (
            <div className='space-y-4'>
              {shopOrder.shopOrderItems.map((si, idx) => {
                const item = si.item
                const itemId = item?._id || si.item
                return (
                  <div key={idx} className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                      {item?.image && <img src={item.image} alt={item.name} className='w-14 h-14 rounded-md object-cover' />}
                      <div>
                        <p className='font-semibold'>{item?.name || 'Item'}</p>
                        <p className='text-xs text-gray-500'>Qty: {si.quantity}</p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      {[1, 2, 3, 4, 5].map(v => (
                        <Star key={v} value={v} selected={ratings[itemId] >= v} onSelect={(val) => onSelect(itemId, val)} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (<p className='text-sm text-gray-500'>Loading items...</p>)}

          {success && <div className='text-sm text-green-600 font-medium'>{success}</div>}

          <div className='flex justify-end gap-3'>
            <button onClick={close} className='px-4 py-2 rounded-lg border'>Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className='px-4 py-2 rounded-lg bg-orange-500 text-white shadow'>{loading ? 'Submitting...' : 'Submit Ratings'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
