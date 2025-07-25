
import { TouchableOpacity, View, Text, Image, Platform } from "react-native"
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useAuthStore } from "@/lib/store/auth-store"
import { useToast } from "@/context/toast-provider"
import { useRouter } from "expo-router"
import { useEffect } from "react"

interface GoogleAuthButtonProps {
  text?: string
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const GoogleAuthButton = ({
  text = "Sign in with Google",
  className = "",
  onSuccess,
  onError,
}:GoogleAuthButtonProps) => {
  const { handleGoogleTokenAuth, isLoading } = useAuthStore()
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, 
      offlineAccess: false, 
      hostedDomain: '', 
      forceCodeForRefreshToken: false, // Android only
      accountName: '', // Android only
      scopes: ['openid', 'email', 'profile'], 
    })
  }, [])

  const handleGoogleAuth = async () => {
    try {
      
      await GoogleSignin.hasPlayServices()
      
     
      const signInResult = await GoogleSignin.signIn()
      
     
      const tokens = await GoogleSignin.getTokens()
      
      if (tokens.idToken && signInResult.data) {
      
        await handleGoogleTokenAuth(tokens.idToken, signInResult.data.user)
        showToast("Google authentication successful", "success")
        if (onSuccess) onSuccess()
        router.push('/(tabs)') 
      } else {
        throw new Error("No ID token received")
      }
    } catch (error: any) {
      console.error("Google auth error:", error)
      
      let errorMessage = "Google authentication failed"
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = "Sign in was cancelled"
        showToast(errorMessage, "info")
        return
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "Sign in is already in progress"
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Google Play Services not available"
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        errorMessage = "Sign in required"
      }
      
      showToast(errorMessage, "error")
      if (onError && error instanceof Error) onError(error)
    }
  }

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut()
      showToast("Signed out successfully", "success")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center bg-primary-google rounded-md py-3 ${className}`}
      onPress={handleGoogleAuth}
      disabled={isLoading}
    >
      <View className="mr-2 bg-white rounded-lg p-1.5">
        <Image
          source={require('../../assets/images/google.png')}
          className="w-5 h-5 object-contain"
        />
      </View>
      <Text className="text-white font-medium">
        {isLoading ? "Processing..." : text}
      </Text>
    </TouchableOpacity>
  )
}