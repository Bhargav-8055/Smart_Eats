import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'

function useGetMyshop() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  useEffect(() => {
    const fetchShop = async () => {
      // Only fetch if user is a shop owner
      if (!userData || userData.role !== 'owner') {
        return
      }

      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my-shop`, { withCredentials: true })
        dispatch(setMyShopData(result.data))
      } catch (error) {
        // Silent fail - user might not have created a shop yet
        console.log('ℹ️ No shop found for this owner')
      }
    }
    fetchShop()

  }, [userData])
}

export default useGetMyshop
