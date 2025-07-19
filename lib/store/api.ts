import axios from "axios"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage'
// Create axios instance
const api = axios.create({
  baseURL: "https://emgs-backend.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token")
   // console.log("Token from AsyncStorage:", token)  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle specific error cases here (e.g., token expiration)
    if (error.response?.status === 401) {
      // Token expired or invalid
      AsyncStorage.removeItem("auth_token")
      // You could trigger a logout action here
    }
    return Promise.reject(error)
  },
)

export default api

