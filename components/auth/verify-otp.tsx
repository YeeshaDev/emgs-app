"use client"

import { cn } from "@/lib/cn"

import { useState, useEffect } from "react"
import { View, Text } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import CustomButton from "../ui/button"
import OTPInput from "../ui/otp-input"
import SuccessModal from "../ui/success-modal"

const VerifyEmail = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const email = (params.email as string) || "user@example.com"

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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

  const handleVerify = () => {
    if (otp.length !== 6) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setShowSuccessModal(true)
    }, 1500)
  }

  const handleProceed = () => {
    setShowSuccessModal(false)
    router.push("/")
  }

  const handleResendCode = () => {
    if (!canResend) return

    // Reset timer
    setTimeLeft(60)
    setCanResend(false)

    // Simulate resending code
    // API call would go here
  }

  // Format the masked email
  const maskedEmail = email.replace(/(\w{3})[\w.-]+@([\w.]+)/g, "$1***@$2")

  // Format the timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    
      <View>

      <View className="mt-6">
        <Text className="text-2xl font-bold">Verify Your Email</Text>
        <Text className="text-gray-600 mt-2">
          Please enter the verification code sent to ({maskedEmail}) to verify your account
        </Text>
        
      </View>

      <View className="mt-8">
        <OTPInput length={6} onComplete={(code) => setOtp(code)} />

        <Text
          className={cn("mt-4 text-center", canResend ? "text-primary" : "text-gray-500")}
          onPress={canResend ? handleResendCode : undefined}
        >
          Resend Code in {canResend ? "" : formatTime(timeLeft)}
        </Text>
      </View>

      <View className="mt-auto">
        <CustomButton
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== 6}
          className="mt-6"
        />
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="Account Verified"
        message="Your account has been successfully verified. Click the button below to Proceed."
        buttonText="Proceed to Homepage"
        onButtonPress={handleProceed}
      />
    </View>
  )
}

export default VerifyEmail;

