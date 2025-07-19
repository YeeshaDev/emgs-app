import api from "@/lib/store/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UserProfile } from "./account"

// API functions for profile picture
export const updateProfilePicture = async (imageUrl: string): Promise<{ success: boolean }> => {
  const response = await api.put("/account/profile-picture", { profile_image: imageUrl })
  return response.data
}

export const deleteProfilePicture = async (): Promise<{ success: boolean }> => {
  const response = await api.delete("/account/profile-picture")
  return response.data
}

// Custom hooks for profile picture operations
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      // Invalidate user profile to refetch with new image
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
  })
}

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      // Update the user profile in the cache to remove avatar
      queryClient.setQueryData<UserProfile>(["userProfile"], (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, avatar: undefined }
      })
    },
  })
}
