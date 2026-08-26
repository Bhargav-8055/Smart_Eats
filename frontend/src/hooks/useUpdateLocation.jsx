import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        const updateLocation = async (lat, lon) => {
            const result = await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true })
            console.log(result.data)
        }

        navigator.geolocation.watchPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude)
        }, (error) => {
            // Silently handle errors - not critical for all users
            if (error.code !== error.PERMISSION_DENIED) {
                console.log('ℹ️ Location tracking not available')
            }
        }, {
            enableHighAccuracy: false,   // Use network location (faster, less battery)
            timeout: 5000,                // Shorter timeout
            maximumAge: 30000             // Cache for 30 seconds
        })
    }, [userData])
}

export default useUpdateLocation
