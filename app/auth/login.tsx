
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import PageContainer from '@/components/ui/page-container';
import { Feather } from '@expo/vector-icons';
import CustomButton from '@/components/ui/button';
import FormInput from '@/components/ui/input';
import { AuthHeader } from "@/components/auth/header";
import { LoginFormData, loginSchema } from '@/lib/schemas/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/context/toast-provider';
import { useAuthStore } from '@/lib/store/auth-store';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native';
//import api from '@/lib/store/api';
import { GoogleAuthButton } from "@/components/auth/google-auth"

export default function LoginScreen() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const { showToast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login data:", data)
    try {
      await login(data)
    
      showToast("Login successful!", "success")
      router.replace("/")
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to log in", "error")
      console.log(err|| "Failed to log in")
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google Login
    showToast("Google login is not implemented yet", "info")
  }

  useEffect(() => {
    return () => {
      if (error) clearError()
    }
  }, [error, clearError])
  
    return (
      <>
           <AuthHeader />
          <PageContainer>
            <View className='flex flex-col gap-y-3 mt-10 px-5'>
            
            <Text className="text-2xl font-bold">
              Login Into Your Account
            </Text>
            
            <Text className="text-gray-500 mb-8">
              Welcome back! Please enter your details
            </Text>
  
            {error && (
        <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <Text className="text-red-500">{error}</Text>
        </View>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Email Address</Text>
            <TextInput
              className={`border rounded-md px-3 py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Password</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-md px-3 py-3 pr-10 ${
                  errors.password ? "border-primary" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text className="text-pprimary text-xs mt-1">{errors.password.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity onPress={() => router.push("/auth/forgot-password")} className="mb-6">
        <Text className="text-primary font-semibold text-right">Forgot Password?</Text>
      </TouchableOpacity>

      <CustomButton
        title={isLoading ? "Logging in..." : "Log In"}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="mb-4"
      />
            <View className="flex-row justify-center mb-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup-path')}>
                <Text className="text-primary font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
  
            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
  
            {/* <CustomButton 
              title="Sign up with Google" 
              variant="google"
              onPress={() => {/* Handle Google Sign in 
            /> */}
            <GoogleAuthButton
        text="Log in with Google"
        className="mt-6"
        onSuccess={() => router.replace("/")}
        onError={(error) => console.error("Google auth error:", error)}
      />

            </View>
          </PageContainer>
          </>
       
    );
  };
  