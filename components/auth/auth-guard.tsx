import type React from "react"
import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { useRouter, useSegments } from "expo-router"
import { useAuthStore } from "@/lib/store/auth-store"
import Constants from 'expo-constants'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuthStore()

  const segments = useSegments()
  const router = useRouter()

  // Check if we're in development mode with debug enabled
  const isDevelopmentDebug = 
    Constants.expoConfig?.extra?.environment === 'DEVELOPMENT' && 
    Constants.expoConfig?.extra?.debug === 'true'

  useEffect(() => {
    // Skip authentication checks in development debug mode
    if (isDevelopmentDebug) {
      console.log('🚧 Auth Guard: Bypassing authentication checks (Development + Debug mode)')
      return
    }

    if (isLoading) return

    const inAuthGroup = segments[0] === "(tabs)" 
    // || segments[0] === "account" || segments[0] === "course"
    const inAuthScreen =
      (segments[0] === "auth" && (
        segments[1] === "login" ||
        segments[1] === "register" ||
        segments[1] === "signup-path" ||
        segments[1] === "verify-email" ||
        segments[1] === "forgot-password"
      ))

    if (!isAuthenticated && !user && inAuthGroup) {
      // Redirect to login if trying to access protected routes
      router.replace("/onboarding")
    } else if (isAuthenticated && user && inAuthScreen) {
      // Redirect to home if already authenticated
      router.replace("/")
    }
    else if (isAuthenticated && !user) {
      // Redirect to home if already authenticated
      router.replace("/auth/login")
    }
  }, [isAuthenticated, user, segments, isLoading, router, isDevelopmentDebug])

  if (isLoading && !isDevelopmentDebug) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#B91C1C" />
      </View>
    )
  }

  return <>{children}</>
}

export default AuthGuard

