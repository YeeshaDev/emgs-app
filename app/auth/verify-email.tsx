"use client"

//import { cn } from "@/lib/cn"

import { useState, useEffect } from "react"
import { View, Text, Pressable } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import PageContainer from "@/components/ui/page-container"
import CustomButton from "@/components/ui/button"
import OTPInput from "@/components/ui/otp-input"
//import Logo from "@/components/ui/auth-logo"
import SuccessModal from "@/components/ui/success-modal"
import { AuthHeader } from "@/components/auth/header"
import { useToast } from "@/context/toast-provider"
import { useAuthStore } from "@/lib/store/auth-store"

const VerifyEmailScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const email = (params.email as string) || ""
  const userId = (params.userId as string) || ""
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { verify, isLoading, error, clearError } = useAuthStore()
  const { showToast } = useToast()
//  console.log('userId', userId);
//  console.log('otp', otp);
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleVerify = async () => {
    if (otp.length !== 6) return

    try {
      await verify({
        userId: userId,
        verificationCode: otp,
      })
      setShowSuccessModal(true)
      showToast("Email verified successfully!", "success")
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to verify email", "error")
    }
  }

  const handleResendCode = () => {
    if (!canResend) return

    // Reset timer
    setTimeLeft(60)
    setCanResend(false)

    // API call to resend code would go here
    showToast("Verification code resent", "info")
  }

  // Clear any errors when component unmounts
  useEffect(() => {
    return () => {
      if (error) clearError()
    }
  }, [error, clearError])

  // Format the masked email
  const maskedEmail = email.replace(/(\w{3})[\w.-]+@([\w.]+)/g, "$1***@$2")

  // Format the timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <AuthHeader />
    <PageContainer scrollable={false}>
     

      <View className="mt-6">
        <Text className="text-2xl font-bold">Verify Your Email</Text>
        <Text className="text-gray-600 mt-2">
          Please enter the verification code sent to ({maskedEmail}) to verify your account
        </Text>
          {/* <Text className="text-gray-600 mt-2">
                  {userId} otp - {otp}
                </Text> */}
      </View>

      

      <View className="mt-8 items-center">
        <OTPInput length={6} onComplete={(code) => setOtp(code)} />

        {canResend ? (
<Pressable onPress={handleVerify}>
        <Text
          className={`mt-4 text-primary font-semibold`}
          onPress={canResend ? handleResendCode : undefined}
        >
          Resend Code
        </Text>
        </Pressable>
        ): (
          <Text
          className={`mt-4 text-gray-500`}
          onPress={canResend ? handleResendCode : undefined}
        >
          Resend Code in {formatTime(timeLeft)}
        </Text>
        )}
      </View>

      {error && (
        <View className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <Text className="text-red-500">{error}</Text>
        </View>
      )}
      <View className="mt-auto">
        <CustomButton
          title={isLoading ? "Verifying..." : "Verify"}
          onPress={handleVerify}
          loading={isLoading}
          disabled={otp.length !== 6 || isLoading}
          className="mt-6"
        />
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="Account Verified"
        message="Your account has been successfully verified. Click the button below to Proceed."
        buttonText="Proceed to Login"
        onButtonPress={()=> router.push('/auth/login')}
      />
    </PageContainer>
    </>
  )
}

export default VerifyEmailScreen

