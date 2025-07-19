"use client"

import { useState } from "react"
import { View } from "react-native"
import { useRouter } from "expo-router"
//import PageContainer from "@/components/ui/page-container"
import SuccessModal from "@/components/ui/success-modal"

const AccountVerifiedScreen = () => {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(true)

  const handleProceed = () => {
    setModalVisible(false)
    router.push("/")
  }

  return (
   
      <View className="flex-1 bg-white">
        <SuccessModal
          visible={modalVisible}
          title="Account Verified"
          message="Your account has been successfully verified. Click the button below to Proceed."
          buttonText="Proceed to Homepage"
          onButtonPress={handleProceed}
        />
      </View>
   
  )
}

export default AccountVerifiedScreen

