import type React from "react"
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"
import type { FileInfo } from "@/hooks/use-file-picker"

interface FileUploadFieldProps {
  title: string
  description: string
  icon: React.ComponentProps<typeof Feather>["name"]
  onPress: () => void
  isLoading: boolean
  isUploading: boolean
  files: FileInfo[]
  onRemoveFile: (index: number) => void
  fileTypeLabel?: string
  maxFileSize?: string
  supportedFormats?: string
  disabled?: boolean
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  title,
  description,
  icon,
  onPress,
  isLoading,
  isUploading,
  files,
  onRemoveFile,
  fileTypeLabel = "FILE",
  maxFileSize = "10mb",
  supportedFormats,
  disabled = false,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-1">{title}</Text>
      <TouchableOpacity
        className="border border-dashed border-gray-300 rounded-md p-6 items-center justify-center"
        onPress={onPress}
        disabled={disabled || isLoading || isUploading}
      >
        {isLoading || isUploading ? (
          <ActivityIndicator color="#4F46E5" size="small" />
        ) : (
          <Feather name={icon} size={24} color="#6B7280" />
        )}
        <Text className="text-gray-700 mt-2">{description}</Text>
        <Text className="text-gray-500 text-xs mt-1">Maximum file size is {maxFileSize}</Text>
        {supportedFormats && <Text className="text-red-500 text-xs mt-1">* {supportedFormats}</Text>}
        {isLoading && <Text className="text-blue-500 mt-2">Selecting files...</Text>}
        {isUploading && <Text className="text-blue-500 mt-2">Uploading files...</Text>}
      </TouchableOpacity>

      {files.map((file, index) => (
        <View key={index} className="flex-row items-center justify-between bg-gray-50 p-3 mt-2 rounded-md">
          <View className="flex-row items-center">
            <View className="bg-red-500 w-8 h-8 rounded items-center justify-center mr-2">
              <Text className="text-white text-xs font-bold">{fileTypeLabel}</Text>
            </View>
            <View>
              <Text className="text-gray-800">{file.name}</Text>
              <Text className="text-gray-500 text-xs">{formatFileSize(file.size || 0)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onRemoveFile(index)} disabled={isUploading}>
            <Feather name="x" size={20} color={isUploading ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}
