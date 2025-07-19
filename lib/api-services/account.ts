import api from "@/lib/store/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
export interface UserProfile {
  id: string
  fullName: string
  email: string
  phone: string
  userType?: "user" | "tutor"
  profilePicture?: string | null
  preferredLanguage: string
  notificationsEnabled: boolean
  coursesInProgress?: number
  coursesCompleted?: number
  isVerified?: boolean 
  enrolledCourses?:any
  completedLessons?:any
  completedCoursesCount: number     
}

export interface Language {
  code: string
  name: string
  flag: string
}
export interface Support {
  email:string;
  name:string;
  description:string;
}

// Available languages
export const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
]

// API functions
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/account/profile")
  return response.data.data.user
}

export const updateLanguage = async (language: string): Promise<UserProfile> => {
  const response = await api.put("/account/language", { language })
  return response.data.data
}

export const contactSupport = async (data: Support) => {
  const response = await api.post("/support/submit",  data )
  return response.data
}

export const updateProfile = async (profileData: {
  fullName: string
  preferredLanguage: string
  notificationsEnabled: boolean
}): Promise<UserProfile> => {
  const response = await api.put("/account/profile", profileData)
  return response.data.data.user
}

// Custom hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  })
}

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLanguage,
    onSuccess: (data) => {
      // Update the user profile in the cache
      queryClient.setQueryData<UserProfile>(["userProfile"], (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, preferredLanguage: data.preferredLanguage }
      })
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Update the user profile in the cache
      queryClient.setQueryData<UserProfile>(["userProfile"], (oldData) => {
        if (!oldData) return oldData
        return { ...oldData }
      })
    },
  })
}

export const useContactSupport = () => {
  return useMutation({
    mutationFn: contactSupport,
  })
}


