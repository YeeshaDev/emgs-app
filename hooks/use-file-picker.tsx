
import { useState, useCallback } from "react"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { Platform } from "react-native"
import {
  uploadFileToCloudinary,
  uploadMultipleFilesToCloudinary,
  type UploadResponse,
  type MultipleUploadResponse,
} from "@/lib/api-services/upload"

export type FileType = "image" | "video" | "document" | "audio" | "all"
export type PickerMode = "single" | "multiple"

export interface FilePickerOptions {
  mediaTypes?: ImagePicker.MediaTypeOptions
  allowsEditing?: boolean
  quality?: number
  maxWidth?: number
  maxHeight?: number
  maxDuration?: number // for videos (in seconds)
  maxFileSize?: number // in bytes
  documentTypes?: string[] // for document picker
}

export interface FileInfo {
  uri: string
  name: string
  type: string
  size?: number
  width?: number
  height?: number
  duration?: number
}

export interface UseFilePickerResult {
  files: FileInfo[]
  isLoading: boolean
  isUploading: boolean
  uploadedUrls: string[]
  error: Error | null
  pickFile: () => Promise<void>
  uploadFiles: () => Promise<string[]>
  resetFiles: () => void
  resetError: () => void
}

// Default options for different file types
const defaultImageOptions: FilePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
  maxFileSize: 10 * 1024 * 1024, // 10MB
}

const defaultVideoOptions: FilePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  allowsEditing: true,
  quality: 0.8,
  maxDuration: 60, // 1 minute
  maxFileSize: 50 * 1024 * 1024, // 50MB
}

const defaultDocumentOptions: FilePickerOptions = {
  documentTypes: ["*/*"],
  maxFileSize: 20 * 1024 * 1024, // 20MB
}

const defaultAudioOptions: FilePickerOptions = {
  documentTypes: ["audio/*"],
  maxFileSize: 20 * 1024 * 1024, // 20MB
}

// Base hook for file picking
export const useFilePicker = (
  fileType: FileType = "image",
  mode: PickerMode = "single",
  options: FilePickerOptions = {},
): UseFilePickerResult => {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<Error | null>(null)

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (fileType === "image" || fileType === "video") {
        if (Platform.OS !== "web") {
          const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
          if (mediaLibraryStatus !== "granted") {
            setError(new Error("Permission to access media library was denied"))
            return false
          }

          // For videos, also request camera permissions
          if (fileType === "video") {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
            if (cameraStatus !== "granted") {
              setError(new Error("Permission to access camera was denied"))
              return false
            }
          }
        }
      }
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to request permissions"))
      return false
    }
  }

  // Pick file based on type
  const pickFile = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Request permissions first
      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        setIsLoading(false)
        return
      }

      let result: any
      let pickedFiles: FileInfo[] = []

      // Pick files based on type
      switch (fileType) {
        case "image":
          const imageOptions = { ...defaultImageOptions, ...options }
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: imageOptions.mediaTypes || ImagePicker.MediaTypeOptions.Images,
            allowsEditing: imageOptions.allowsEditing,
            quality: imageOptions.quality,
            allowsMultipleSelection: mode === "multiple",
            aspect: [4, 3],
          })

          if (!result.canceled) {
            pickedFiles = result.assets.map((asset: any) => ({
              uri: asset.uri,
              name: asset.uri.split("/").pop() || "image.jpg",
              type: `image/${asset.uri.split(".").pop() || "jpeg"}`,
              width: asset.width,
              height: asset.height,
              size: asset.fileSize,
            }))
          }
          break

        case "video":
          const videoOptions = { ...defaultVideoOptions, ...options }
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: videoOptions.mediaTypes || ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: videoOptions.allowsEditing,
            quality: videoOptions.quality,
            allowsMultipleSelection: mode === "multiple",
            videoMaxDuration: videoOptions.maxDuration,
          })

          if (!result.canceled) {
            pickedFiles = result.assets.map((asset: any) => ({
              uri: asset.uri,
              name: asset.uri.split("/").pop() || "video.mp4",
              type: `video/${asset.uri.split(".").pop() || "mp4"}`,
              width: asset.width,
              height: asset.height,
              duration: asset.duration,
              size: asset.fileSize,
            }))
          }
          break

        case "document":
          const documentOptions = { ...defaultDocumentOptions, ...options }
          if (mode === "multiple") {
            result = await DocumentPicker.getDocumentAsync({
              type: documentOptions.documentTypes,
              multiple: true,
              copyToCacheDirectory: true,
            })

            if (result.assets) {
              pickedFiles = result.assets.map((asset:any) => ({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || "application/octet-stream",
                size: asset.size,
              }))
            }
          } else {
            result = await DocumentPicker.getDocumentAsync({
              type: documentOptions.documentTypes,
              copyToCacheDirectory: true,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const asset = result.assets[0]
              pickedFiles = [
                {
                  uri: asset.uri,
                  name: asset.name,
                  type: asset.mimeType || "application/octet-stream",
                  size: asset.size,
                },
              ]
            }
          }
          break

        case "audio":
          const audioOptions = { ...defaultAudioOptions, ...options }
          if (mode === "multiple") {
            result = await DocumentPicker.getDocumentAsync({
              type: audioOptions.documentTypes,
              multiple: true,
              copyToCacheDirectory: true,
            })

            if (result.assets) {
              pickedFiles = result.assets.map((asset: any) => ({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || "audio/mpeg",
                size: asset.size,
              }))
            }
          } else {
            result = await DocumentPicker.getDocumentAsync({
              type: audioOptions.documentTypes,
              copyToCacheDirectory: true,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const asset = result.assets[0]
              pickedFiles = [
                {
                  uri: asset.uri,
                  name: asset.name,
                  type: asset.mimeType || "audio/mpeg",
                  size: asset.size,
                },
              ]
            }
          }
          break

        case "all":
          if (mode === "multiple") {
            result = await DocumentPicker.getDocumentAsync({
              type: "*/*",
              multiple: true,
              copyToCacheDirectory: true,
            })

            if (result.assets) {
              pickedFiles = result.assets.map((asset: any) => ({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || "application/octet-stream",
                size: asset.size,
              }))
            }
          } else {
            result = await DocumentPicker.getDocumentAsync({
              type: "*/*",
              copyToCacheDirectory: true,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const asset = result.assets[0]
              pickedFiles = [
                {
                  uri: asset.uri,
                  name: asset.name,
                  type: asset.mimeType || "application/octet-stream",
                  size: asset.size,
                },
              ]
            }
          }
          break
      }

      // Validate file size if maxFileSize is specified
      if (options.maxFileSize) {
        pickedFiles = pickedFiles.filter((file) => {
          if (file.size && file.size > (options.maxFileSize || 0)) {
            console.warn(`File ${file.name} exceeds maximum size limit`)
            return false
          }
          return true
        })
      }

      // Update state with picked files
      if (mode === "single") {
        setFiles(pickedFiles.slice(0, 1))
      } else {
        setFiles((prevFiles) => [...prevFiles, ...pickedFiles])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to pick file"))
    } finally {
      setIsLoading(false)
    }
  }, [fileType, mode, options])

  // Upload files to Cloudinary
  const uploadFiles = useCallback(async (): Promise<string[]> => {
    if (files.length === 0) {
      return []
    }

    try {
      setIsUploading(true)
      setError(null)

      let urls: string[] = []

      if (files.length === 1 && mode === "single") {
        // Upload single file
        const response: UploadResponse = await uploadFileToCloudinary(files[0].uri)
        urls = [response.url]
      } else {
        // Upload multiple files
        const fileUris = files.map((file) => file.uri)
        const response: MultipleUploadResponse = await uploadMultipleFilesToCloudinary(fileUris)
        urls = response.files.map((file) => file.url)
      }

      setUploadedUrls(urls)
      return urls
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to upload files"))
      return []
    } finally {
      setIsUploading(false)
    }
  }, [files, mode])

  // Reset files
  const resetFiles = useCallback(() => {
    setFiles([])
    setUploadedUrls([])
  }, [])

  // Reset error
  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    files,
    isLoading,
    isUploading,
    uploadedUrls,
    error,
    pickFile,
    uploadFiles,
    resetFiles,
    resetError,
  }
}

// Specialized hooks for different file types
export const useImagePicker = (mode: PickerMode = "single", options: FilePickerOptions = {}) => {
  return useFilePicker("image", mode, { ...defaultImageOptions, ...options })
}

export const useVideoPicker = (mode: PickerMode = "single", options: FilePickerOptions = {}) => {
  return useFilePicker("video", mode, { ...defaultVideoOptions, ...options })
}

export const useDocumentPicker = (mode: PickerMode = "single", options: FilePickerOptions = {}) => {
  return useFilePicker("document", mode, { ...defaultDocumentOptions, ...options })
}

export const useAudioPicker = (mode: PickerMode = "single", options: FilePickerOptions = {}) => {
  return useFilePicker("audio", mode, { ...defaultAudioOptions, ...options })
}

// Combined hook for picking and uploading in one step
export const usePickAndUpload = (
  fileType: FileType = "image",
  mode: PickerMode = "single",
  options: FilePickerOptions = {},
) => {
  const picker = useFilePicker(fileType, mode, options)

  const pickAndUpload = useCallback(async (): Promise<string[]> => {
    await picker.pickFile()
    if (picker.files.length > 0) {
      return await picker.uploadFiles()
    }
    return []
  }, [picker])

  return {
    ...picker,
    pickAndUpload,
  }
}
