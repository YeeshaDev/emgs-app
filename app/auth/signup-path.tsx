"use client"

import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from 'expo-router';
import { cn } from "@/lib/cn"
import PageContainer from "@/components/ui/page-container"
// import { Feather } from "@expo/vector-icons"
// import Logo from "@/components/ui/auth-logo"
import CustomButton from '@/components/ui/button';
import { AuthHeader } from "@/components/auth/header"
const JoinPathScreen = () => {
    const router = useRouter();
  const [selectedPath, setSelectedPath] = React.useState<"user" | "tutor" | null>(null)

  const handleJoin = () => {
    router.push(`/auth/register?role=${selectedPath}`)
  }

  return (
    <>
           <AuthHeader />
    <PageContainer scrollable={false}>
      

      <View className={cn("mt-6")}>
        <Text className={cn("text-2xl font-bold")}>Join as a Student or Tutor</Text>
        <Text className={cn("text-gray-600 mt-2")}>
          Learn from experts or share your knowledge—choose your path and get started today!
        </Text>
      </View>

      <View className={cn("flex-row justify-between mt-20")}>
        <TouchableOpacity
          className={cn(
            `border-2 rounded-lg px-4 py-8 w-[48%] ${selectedPath === "user" ? "border-primary" : "border-primary-border"}`,
          )}
          onPress={() => setSelectedPath("user")}
        >
          <View className={cn("")}>
            <Text className={cn("text-5xl font-semibold mt-2 mb-5")}>✏️</Text>
            <Text className={cn("text-lg font-semibold mt-4")}>Join as a Student</Text>
            <Text className={cn("text-gray-600  mt-2")}>
              Access top-quality courses and learning materials
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={cn(
            `border-2 rounded-lg px-4 py-8 w-[48%] ${selectedPath === "tutor" ? "border-primary" : "border-primary-border"}`,
          )}
          onPress={() => setSelectedPath("tutor")}
        >
          <View>
          <Text className={cn("text-5xl font-semibold mt-4")}>🎓</Text>
            <Text className={cn("text-lg font-semibold mt-4")}>Join as a Tutor</Text>
            <Text className={cn("text-gray-600 mt-2")}>Share your knowledge and teach students</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className={cn("mt-auto")}>
        <CustomButton
          title={selectedPath === "tutor" ? "Join as a Tutor" : "Join as a Student"}
          onPress={handleJoin}
          disabled={!selectedPath}
          className={cn("mt-6")}
        />

        <View className={cn("flex-row justify-center mt-4")}>
          <Text className={cn("text-gray-600")}>Already have an account?</Text>
          <Text className={cn("text-primary font-bold ml-1")} onPress={() => router.push("/auth/login")}>
            Login
          </Text>
        </View>
      </View>
    </PageContainer>
    </>
  )
}

export default JoinPathScreen

