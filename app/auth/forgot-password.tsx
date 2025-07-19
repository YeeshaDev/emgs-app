"use client"

import { useState } from "react"
import { View, Text } from "react-native"
import { cn } from "@/lib/cn"
import { useRouter } from 'expo-router';
import PageContainer from "@/components/ui/page-container"
import FormInput from "@/components/ui/input"
import CustomButton from "@/components/ui/button"
import { AuthHeader } from "@/components/auth/header"

const ForgotPasswordScreen = () => {
    const router = useRouter();
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetPassword = () => {
    if (!email) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
     router.push("/auth/verify-email")
    }, 1500)
  }

  return (
    <>
      <AuthHeader />
    <PageContainer>
      
      <View className={cn("mt-6")}>
        <Text className={cn("text-2xl font-bold")}>Forgot Password?</Text>
        <Text className={cn("text-gray-600 mt-2")}>
          Please enter your email and we will send you an OTP code in the next step to reset your password
        </Text>
      </View>

      <View className={cn("mt-6")}>
        <FormInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className={cn("mt-auto")}>
        <CustomButton
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
          disabled={!email}
          className={cn("mt-6")}
        />

        <View className={cn("flex-row justify-center mt-4")}>
          <Text className={cn("text-gray-600 text-center")} onPress={() => router.push("/auth/login")}>
            ← Back to Log in
          </Text>
        </View>
      </View>
    </PageContainer>
    </>
  )
}

export default ForgotPasswordScreen

