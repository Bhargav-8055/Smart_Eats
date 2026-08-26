import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity, setUserData } from '../redux/userSlice'

function useGetShopByCity() {
  const dispatch = useDispatch()
  const { currentCity } = useSelector(state => state.user)
  useEffect(() => {
    const fetchShops = async () => {
      try {
        if (!currentCity) {
          console.log("[SHOP FETCH] currentCity is null/undefined, skipping fetch");
          return;
        }
        console.log("[SHOP FETCH] Fetching shops for city:", currentCity);
        const result = await axios.get(`${serverUrl}/api/shop/get-shop-by-city/${currentCity}`, { withCredentials: true })
        console.log("[SHOP FETCH] Response received:", result.data);
        console.log("[SHOP FETCH] Number of shops:", result.data.length);
        dispatch(setShopsInMyCity(result.data))
      } catch (error) {
        console.log("[SHOP FETCH] Error fetching shops:", error)
        dispatch(setShopsInMyCity([])) // Reset shops on error
      }
    }
    fetchShops()

  }, [currentCity])
}

export default useGetShopByCity
