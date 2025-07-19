
import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Feather } from "@expo/vector-icons"
import { useFileUpload } from "@/lib/api-services/upload"
import { useUpdateProfilePicture } from "@/lib/api-services/profile-image"
import { useToast } from "@/context/toast-provider"

interface ImagePickerProps {
  initialImage?: string | null
  onImageSelected?: (imageUrl: string) => void
  size?: "sm" | "md" | "lg"
  shape?: "circle" | "square"
  title?: string
  subtitle?: string
  updateProfileOnUpload?: boolean
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  initialImage ='https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436180.jpg?ga=GA1.1.506414774.1739325588&semt=ais_hybrid&w=740',
  onImageSelected,
  size = "md",
  shape = "circle",
  title = "Upload Image",
  subtitle = "Tap to select an image",
  updateProfileOnUpload = false,
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const { mutate: uploadFile, isPending: isUploading } = useFileUpload()
  const { mutate: updateProfilePicture, isPending: isUpdatingProfile } = useUpdateProfilePicture()
  const { showToast } = useToast()

  const isPending = isUploading || isUpdatingProfile

  // Size mapping
  const sizeMap = {
    sm: { container: "w-16 h-16", icon: 16 },
    md: { container: "w-24 h-24", icon: 20 },
    lg: { container: "w-32 h-32", icon: 24 },
  }

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        showToast("We need camera roll permissions to upload images", "error")
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0]
        setImage(selectedImage.uri)

        // Upload image to server
        uploadFile(selectedImage.uri, {
          onSuccess: (data) => {
            console.log("Upload successful, URL:", data.url)

            // If we should update profile picture
            if (updateProfileOnUpload) {
              updateProfilePicture(data.url, {
                onSuccess: () => {
                  showToast("Profile picture updated successfully", "success")
                },
                onError: (error) => {
                  console.error("Profile update error:", error)
                  showToast("Failed to update profile picture", "error")
                },
              })
            }

            // Call the callback with the uploaded image URL
            if (onImageSelected) {
              onImageSelected(data.url)
            }
          },
          onError: (error) => {
            console.error("Error uploading image:", error)
            showToast("Failed to upload image", "error")
            // Reset to initial image if upload fails
            setImage(initialImage)
          },
        })
      }
    } catch (error) {
      console.error("Error picking image:", error)
      showToast("An error occurred while picking an image", "error")
    }
  }

  return (
   
      <TouchableOpacity
        onPress={pickImage}
        disabled={isPending}
        className={`relative ${sizeMap[size].container} ${shape === "circle" ? "rounded-full" : "rounded-lg"}  bg-gray-100 items-center justify-center border border-gray-300`}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#B91C1C" />
        ) : image ? (
          <Image source={{ uri: image }} className="w-full h-full rounded-full" />
        ) : (
          <View className='absolute top-0'>
          <Feather name="camera" size={sizeMap[size].icon} color="#6B7280" />
          </View>
        )}

        {image && !isPending && (
          <View className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full">
           <Feather name="camera" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>

      
   
  )
}

export default ImagePickerComponent

