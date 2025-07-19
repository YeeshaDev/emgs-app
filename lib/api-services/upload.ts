import api from "@/lib/store/api"
import { useMutation } from "@tanstack/react-query"

// Type
export interface UploadResponse {
  url: string
  publicId: string
  format: string
  width: number
  height: number
  size: number
}

export interface MultipleUploadResponse {
  message: string
  files: {
    originalName: string
    url: string
    public_id: string
  }[]
}

// Helper function to get file name from URI
export const getFileNameFromUri = (uri: string): string => {
  const uriParts = uri.split("/")
  return uriParts[uriParts.length - 1]
}

// Helper function to get file type from URI
export const getFileTypeFromUri = (uri: string): string => {
  const fileName = getFileNameFromUri(uri)
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || ""

  switch (fileExtension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "pdf":
      return "application/pdf"
    case "doc":
    case "docx":
      return "application/msword"
    case "xls":
    case "xlsx":
      return "application/vnd.ms-excel"
    case "mp3":
      return "audio/mpeg"
    case "mp4":
      return "video/mp4"
    case "mov":
      return "video/quicktime"
    default:
      return "application/octet-stream"
  }
}

// API function to upload file to Cloudinary
export const uploadFileToCloudinary = async (fileUri: string): Promise<UploadResponse> => {
  try {
    // Create form data
    const formData = new FormData()

    // Skip FileSystem.getInfoAsync check which is causing the error
    // Instead, directly append the file to form data
    formData.append("file", {
      uri: fileUri,
      name: getFileNameFromUri(fileUri),
      type: getFileTypeFromUri(fileUri),
    } as any)

    console.log("Uploading file:", fileUri)

    // Upload file
    const response = await api.post("/file/upload-cloudinary", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Upload response:", response.data)
    return {
      url: response.data.data.url,
      publicId: response.data.data.public_id,
      format: response.data.data.format || "",
      width: response.data.data.width || 0,
      height: response.data.data.height || 0,
      size: response.data.data.size || 0,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// API function to upload multiple files to Cloudinary
export const uploadMultipleFilesToCloudinary = async (fileUris: string[]): Promise<MultipleUploadResponse> => {
  try {
    // Create form data
    const formData = new FormData()

    // Add each file to form data with key 'files'
    for (const fileUri of fileUris) {
      // Skip FileSystem.getInfoAsync check
      formData.append("files", {
        uri: fileUri,
        name: getFileNameFromUri(fileUri),
        type: getFileTypeFromUri(fileUri),
      } as any)
    }

    console.log(`Uploading ${fileUris.length} files`)

    // Upload files
    const response = await api.post("/file/upload-cloudinary-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Multiple upload response:", response.data)
    return response.data.data
  } catch (error) {
    console.error("Error uploading multiple files:", error)
    throw error
  }
}

// Custom hook for single file upload
export const useFileUpload = () => {
  return useMutation({
    mutationFn: uploadFileToCloudinary,
  })
}

// Custom hook for multiple file upload
export const useMultipleFileUpload = () => {
  return useMutation({
    mutationFn: uploadMultipleFilesToCloudinary,
  })
}
