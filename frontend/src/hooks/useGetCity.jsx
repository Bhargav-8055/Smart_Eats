import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log("📍 RAW GEOLOCATION:", position)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const accuracy = position.coords.accuracy

            console.log(`🎯 COORDINATES: Lat: ${latitude}, Lon: ${longitude}`)
            console.log(`📏 ACCURACY: ${accuracy} meters`)

            dispatch(setLocation({ lat: latitude, lon: longitude }))
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)

            console.log("🌍 GEOAPIFY FULL RESPONSE:", result.data)

            const cityName = result?.data?.results[0].city || result?.data?.results[0].county;
            console.log("[GEOLOCATION] City from API (raw):", cityName);
            console.log("[GEOLOCATION] City lowercased:", cityName?.toLowerCase());
            console.log("[GEOLOCATION] Full address:", result?.data?.results[0]);

            dispatch(setCurrentCity(cityName?.toLowerCase()))
            dispatch(setCurrentState(result?.data?.results[0].state))
            dispatch(setCurrentAddress(result?.data?.results[0].address_line2 || result?.data?.results[0].address_line1))
            dispatch(setAddress(result?.data?.results[0].address_line2))
        }, (error) => {
            console.error('❌ Geolocation error:', error);
        }, {
            enableHighAccuracy: true,   // Use GPS for accurate location
            timeout: 10000,              // 10 second timeout (GPS takes longer)
            maximumAge: 0                // Don't use cached location
        })
    }, [userData])
}

export default useGetCity
