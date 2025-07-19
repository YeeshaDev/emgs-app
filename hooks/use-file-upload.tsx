
import { useState, useCallback } from "react"
import { useFileUpload, useMultipleFileUpload } from "@/lib/api-services/upload"
import type { FileInfo } from "./use-file-picker"

interface UseFileUploadOptions {
  onUploadStart?: () => void
  onUploadSuccess?: (urls: string[]) => void
  onUploadError?: (error: Error) => void
}

export const useFileUploadManager = (options: UseFileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<Error | null>(null)

  const { mutateAsync: uploadSingleFile } = useFileUpload()
  const { mutateAsync: uploadMultipleFiles } = useMultipleFileUpload()

  // Upload a single file
  const uploadFile = useCallback(
    async (fileUri: string): Promise<string> => {
      try {
        setIsUploading(true)
        setError(null)
        options.onUploadStart?.()

        const response = await uploadSingleFile(fileUri)
        const url = response.url

        setUploadedUrls((prev) => [...prev, url])
        options.onUploadSuccess?.([url])

        return url
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to upload file")
        setError(error)
        options.onUploadError?.(error)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [uploadSingleFile, options],
  )

  // Upload multiple files
  const uploadFiles = useCallback(
    async (fileUris: string[]): Promise<string[]> => {
      if (fileUris.length === 0) return []

      try {
        setIsUploading(true)
        setError(null)
        options.onUploadStart?.()

        const response = await uploadMultipleFiles(fileUris)
        const urls = response.files.map((file) => file.url)

        setUploadedUrls((prev) => [...prev, ...urls])
        options.onUploadSuccess?.(urls)

        return urls
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to upload files")
        setError(error)
        options.onUploadError?.(error)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [uploadMultipleFiles, options],
  )

  // Upload files from FileInfo objects
  const uploadFileInfos = useCallback(
    async (files: FileInfo[]): Promise<string[]> => {
      const fileUris = files.map((file) => file.uri)
      return await uploadFiles(fileUris)
    },
    [uploadFiles],
  )

  // Reset state
  const reset = useCallback(() => {
    setUploadedUrls([])
    setError(null)
  }, [])

  return {
    isUploading,
    uploadedUrls,
    error,
    uploadFile,
    uploadFiles,
    uploadFileInfos,
    reset,
  }
}
