import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, TextInput, StatusBar } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Feather } from "@expo/vector-icons"
import CustomButton from "@/components/ui/button"
import { useRouter, useLocalSearchParams } from "expo-router"
import { AuthHeader } from "@/components/auth/header"
import { SignupFormData, signupSchema } from "@/lib/schemas/validation"
import { useAuthStore } from "@/lib/store/auth-store"
import { useToast } from "@/context/toast-provider"
import KeyboardAvoider from "@/components/keyboard-avoider"
import StyledText from "@/components/ui/styled-text"


const SignUpScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const role = (params.role as "user" | "tutor") || "user"
 // const userType = role === "student" ? "user" : "tutor"

  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [countryCode, setCountryCode] = useState("+234")

  const { signup, isLoading, error, clearError } = useAuthStore()
  const { showToast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      userType: role,
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    if (!agreeToTerms) {
      showToast("Please agree to the terms and conditions", "error")
      return
    }

    try {
     
      const formattedData = {
        ...data,
        phone: `${countryCode}${data.phone.replace(/^0+/, "")}`,
      }

      const response = await signup(formattedData)
     // console.log('userid', response.data.userId)
      showToast("Account created successfully! Please verify your email.", "success")
      router.push({
        pathname: "/auth/verify-email",
        params: {
          email: data.email,
          userId: response?.data?.userId,
        },
      })
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create account", "error")
    }
  }

  const handleGoogleSignUp = () => {
   
    showToast("Google sign up is not implemented yet", "info")
  }

  
  useEffect(() => {
    return () => {
      if (error) clearError()
    }
  }, [error, clearError])

  return (
    <>
      <AuthHeader />
      <KeyboardAvoider
      headerHeight={30 + (StatusBar.currentHeight || 0)}
            dismissKeyboardOnTap={true}
            extraScrollHeight={40}
            contentContainerStyle={{padding:15}}
          >
      {/* <PageContainer> */}
      <View className="mt-3">
        <StyledText weight="bold" className="text-2xl">Let's Get You Started</StyledText>
        <StyledText className="text-gray-600 mt-2">
          Sign up to unlock seamless access to education, travel services, and exclusive opportunities.
          {role}
        </StyledText>
      </View>


      <CustomButton 
              title="Sign up with Google" 
              variant="google"
              className="mt-5 h-14"
              onPress={handleGoogleSignUp}
            />
            

            {error && (
          <View className="mb-4 p-3 mt-2 bg-red-50 border border-red-200 rounded-md">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}

      <View className="flex-row items-center my-4 overflow-scroll">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* <FormInput label="Full Name" placeholder="Enter your full name" value={fullName} onChangeText={setFullName} />

      <FormInput
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className='mb-3'>
        <Text className={cn("text-gray-700 mb-2")}>Phone Number</Text>
        <View className={cn("flex-row")}>
          <TouchableOpacity
            className={cn(
              "border rounded-r-0 border-gray-300 rounded-md px-2 py-3 mr-[-5px] w-20 flex-row items-center justify-between",
            )}
          >
            <Text>{countryCode}</Text>
            <Feather name="chevron-down" size={16} color="#374151" />
          </TouchableOpacity>
          <TextInput
            className={cn("border !border-l-0 rounded-l-0 border-gray-300 rounded-md px-4 py-3  flex-1")}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <FormInput
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        hasIcon={true}
        icon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#374151" />
          </TouchableOpacity>
        }
      />

      <View className={cn("flex-row items-center mt-2")}>
        <TouchableOpacity
          className={cn("size-7 border border-gray-300 rounded mr-2 items-center justify-center")}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          {agreeToTerms && <Feather name="check" size={15} color="#A4081D" />}
        </TouchableOpacity>
        <Text className={cn("text-gray-700 text-sm flex-1")}>I agree to the EMGS Term of Service and Privacy Policy</Text>
      </View>

      <CustomButton
        title="Sign Up"
        onPress={handleSignUp}
        loading={loading}
        disabled={!fullName || !email || !phoneNumber || !password || !agreeToTerms}
        className={cn("mt-6")}
      /> */}
<Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <StyledText className="text-gray-700 mb-1">Full Name</StyledText>
              <TextInput
                className={`border rounded-md px-3 h-14 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {errors.fullName && <Text className="text-red-500 text-xs mt-1">{errors.fullName.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <StyledText className="text-gray-700 mb-1">Email Address</StyledText>
              <TextInput
                className={`border placeholder:text-gray-300 rounded-md px-3 h-14 ${errors.email ? "border-red-500" : "border-gray-300"}`}
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

        <View className="mb-4">
          <StyledText className="text-gray-700 mb-1">Phone Number</StyledText>
          <View className="flex-row">
            <TouchableOpacity className="border border-gray-300 rounded-md px-2 py-3 mr-2 w-20 flex-row items-center justify-between">
              <StyledText>{countryCode}</StyledText>
              <Feather name="chevron-down" size={16} color="#374151" />
            </TouchableOpacity>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex-1">
                  <TextInput
                    className={`border placeholder:text-gray-300 rounded-md px-3 py-3 w-full ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Phone number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                  />
                  {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone.message}</Text>}
                </View>
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <StyledText className="text-gray-700 mb-1">Password</StyledText>
              <View className="relative">
                <TextInput
                  className={`border placeholder:text-gray-300 rounded-md px-3 h-14 pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Create a password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#374151" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
            </View>
          )}
        />

        <View className="flex-row items-center mt-2 mb-6">
          <TouchableOpacity
            className={`w-5 h-5 border border-gray-300 ${agreeToTerms ? 'bg-primary border-primary' : 'bg-white'} rounded mr-2 items-center justify-center`}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            {agreeToTerms && <Feather name="check" size={14} color={agreeToTerms ? "white" : "#374151"} />}
          </TouchableOpacity>
          <StyledText className="text-gray-700 flex-1">I agree to the EMGS Term of Service and Privacy Policy</StyledText>
        </View>

        <CustomButton
          title={isLoading ? "Creating Account..." : "Sign Up"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="mb-4"
        />
      <View className="flex-row justify-center mt-2 mb-4">
        <StyledText className="text-gray-600">Already have an account?</StyledText>
        <StyledText className="text-primary font-bold ml-1" onPress={() => router.push("/auth/login")}>
          Login
        </StyledText>
      </View>
    {/* </PageContainer> */}
    </KeyboardAvoider>
    </>
  )
}

export default SignUpScreen

