import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import api from "./api"
import AsyncStorage from '@react-native-async-storage/async-storage'

export type User = {
  id: string;
  userId: string
  fullName: string
  email: string
  phone: string
  role: "user" | "tutor"
  isVerified: boolean
}


interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

 
  signup: (userData: SignupData) => Promise<{ data: { userId: string } }>
  login: (credentials: LoginData) => Promise<void>
  verify: (verificationData: VerifyData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  handleGoogleTokenAuth: (idToken: string, userInfo: any) => Promise<void>
  
}

export type SignupData = {
  fullName: string
  email: string
  phone: string
  password: string
  userType: "user" | "tutor"
}

export type LoginData = {
  email: string
  password: string
}

export type VerifyData = {
  userId: string
  verificationCode: string
}

const asyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.error(`Error getting item ${key}:`, error)
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error setting item ${key}:`, error)
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key}:`, error)
    }
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signup: async (userData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.post("/auth/register", userData)
          
          set({
            isLoading: false,
           
            user: { ...response.data.data, email: userData.email },
          })
          return response.data
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to sign up",
          })
          throw error
        }
      },

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.post("/auth/login", credentials)
          const { user } = response.data.data

         
          await asyncStorage.setItem("auth_token", response.data.data.token)

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.data
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to log in",
          })
          throw error
        }
      },

      verify: async (verificationData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await api.post("/auth/verify-email", verificationData)
          const { user } = response.data.data

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.data
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to verify account",
          })
          throw error
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })
          
          // Remove token from secure storage
          await asyncStorage.removeItem("auth_token")

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to log out",
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),

      
      handleGoogleTokenAuth: async (idToken: string, userInfo: any) => {
        try {
          set({ isLoading: true, error: null })
          
          
          const response = await api.post('/auth/google-login', {
            idToken,
            userInfo: {
              email: userInfo.email,
              name: userInfo.name,
              photo: userInfo.photo,
              id: userInfo.id,
            }
          })

          if (!response.data) {
            throw new Error('Authentication failed')
          }

          const { user, token } = response.data.data || response.data
          
          
          await asyncStorage.setItem("auth_token", token)

          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })

        } catch (error: any) {
          set({ 
            isLoading: false,
            error: error.response?.data?.message || "Failed to authenticate with Google"
          })
          throw error
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// import { create } from "zustand"
// import { persist, createJSONStorage } from "zustand/middleware"
// //import * as SecureStore from "expo-secure-store"
// import api from "./api"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// // Define user type
// export type User = {
//   id: string;
//   userId: string
//   fullName: string
//   email: string
//   phone: string
//   role: "user" | "tutor"
//   isVerified: boolean
// }

// // Define auth store state
// interface AuthState {
//   user: User | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   error: string | null

//   // Actions
//   signup: (userData: SignupData) => Promise<{ data: { userId: string } }>
//   login: (credentials: LoginData) => Promise<void>
//   verify: (verificationData: VerifyData) => Promise<void>
//   logout: () => Promise<void>
//   clearError: () => void
//   initiateGoogleLogin: (redirectUrl: string) => Promise<string>
//   handleGoogleCallback: (code: string, state: string) => Promise<any>
// }

// // Define data types
// export type SignupData = {
//   fullName: string
//   email: string
//   phone: string
//   password: string
//   userType: "user" | "tutor"
// }

// export type LoginData = {
//   email: string
//   password: string
// }

// // Update the VerifyData type to match the expected API structure
// export type VerifyData = {
//   userId: string
//   verificationCode: string
// }

// const asyncStorage = {
//   getItem: async (key: string): Promise<string | null> => {
//     try {
//       return await AsyncStorage.getItem(key)
//     } catch (error) {
//       console.error(`Error getting item ${key}:`, error)
//       return null
//     }
//   },
//   setItem: async (key: string, value: string): Promise<void> => {
//     try {
//       await AsyncStorage.setItem(key, value)
//     } catch (error) {
//       console.error(`Error setting item ${key}:`, error)
//     }
//   },
//   removeItem: async (key: string): Promise<void> => {
//     try {
//       await AsyncStorage.removeItem(key)
//     } catch (error) {
//       console.error(`Error removing item ${key}:`, error)
//     }
//   },
// }

// // Create auth store
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       signup: async (userData) => {
//         try {
//           set({ isLoading: true, error: null })
//           const response = await api.post("/auth/register", userData)
//           // Don't set authenticated yet since verification is needed
//           set({
//             isLoading: false,
//             // Store email for verification step
//             user: { ...response.data.data, email: userData.email },
//           })
//           return response.data
//         } catch (error: any) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || "Failed to sign up",
//           })
//           throw error
//         }
//       },

//       login: async (credentials) => {
//         try {
//           set({ isLoading: true, error: null })
//           const response = await api.post("/auth/login", credentials)
//           const { user } = response.data.data

//           // Store token in secure storage
//           await asyncStorage.setItem("auth_token", response.data.data.token)

//           set({
//             user,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//           return response.data
//         } catch (error: any) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || "Failed to log in",
//           })
//           throw error
//         }
//       },

//       // Update the verify function to use the correct endpoint
//       verify: async (verificationData) => {
//         try {
//           set({ isLoading: true, error: null })
//           const response = await api.post("/auth/verify-email", verificationData)
//           const { user } = response.data.data

//           // Store token in secure storage
//           //await AsyncStorage.getItem("auth_token", token)

//           set({
//             user,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//           return response.data
//         } catch (error: any) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || "Failed to verify account",
//           })
//           throw error
//         }
//       },

//       logout: async () => {
//         try {
//           set({ isLoading: true })
//           // Call logout API if needed
//           //await api.post("/auth/logout/")

//           // Remove token from secure storage
//           await asyncStorage.removeItem("auth_token")

//           set({
//             user: null,
//             isAuthenticated: false,
//             isLoading: false,
//             error: null,
//           })
//         } catch (error: any) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || "Failed to log out",
//           })
//           throw error
//         }
//       },

//       clearError: () => set({ error: null }),

//       // Add Google authentication functions
//       initiateGoogleLogin: async (redirectUrl: string) => {
//         try {
//           set({ isLoading: true, error: null })
//           // Store the redirect URL for later use
//           await asyncStorage.setItem("google_redirect_url", redirectUrl)

//           // Return the URL to open in a browser
//           return `https://emgs-backend.vercel.app/api/v1/auth/google-login?redirect_url=${encodeURIComponent(redirectUrl)}`
//         } catch (error: any) {
//           set({
//             isLoading: false,
//             error: "Failed to initiate Google login",
//           })
//           throw error
//         }
//       },

//       handleGoogleTokenAuth: async (idToken: string, userInfo: any) => {
//     set({ isLoading: true })
    
//     try {
//       const response = await fetch('/auth/google-login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           idToken,
//           userInfo: {
//             email: userInfo.email,
//             name: userInfo.name,
//             photo: userInfo.photo,
//             id: userInfo.id,
//           }
//         }),
//       })

//       if (!response.ok) {
//         throw new Error('Authentication failed')
//       }

//       const data = await response.json()
      
//       // Store the authentication data
//       set({
//         user: data.user,
//         token: data.token,
//         isAuthenticated: true,
//         isLoading: false,
//       })

//       // Store tokens securely
//       await SecureStore.setItemAsync('access_token', data.token)
//       await SecureStore.setItemAsync('refresh_token', data.refreshToken)

//     } catch (error) {
//       set({ isLoading: false })
//       throw error
//     }
//   },

//       handleGoogleCallback: async (code: string, state: string) => {
//         try {
//           set({ isLoading: true, error: null })

//           // Get the stored redirect URL
//           const redirectUrl = await asyncStorage.getItem("google_redirect_url")

//           if (!redirectUrl) {
//             throw new Error("Redirect URL not found")
//           }

//           // Call the callback endpoint
//           const response = await api.get(`/auth/google-login?code=${code}&state=${state}`)
//           const { token, user } = response.data

//           // Store token in secure storage
//           await asyncStorage.setItem("auth_token", token)

//           // Clean up the stored redirect URL
//           await asyncStorage.removeItem("google_redirect_url")

//           set({
//             user,
//             isAuthenticated: true,
//             isLoading: false,
//           })
//           return response.data
//         } catch (error: any) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || "Failed to complete Google login",
//           })
//           throw error
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => asyncStorage),
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     },
//   ),
// )

