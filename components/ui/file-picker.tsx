
import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {
  useImagePicker,
  useVideoPicker,
  useDocumentPicker,
  useAudioPicker,
  type FileType,
  type PickerMode,
  type FileInfo,
} from "@/hooks/use-file-picker"

interface FilePickerProps {
  type: FileType
  mode?: PickerMode
  label?: string
  placeholder?: string
  onFilesPicked?: (files: FileInfo[]) => void
  onFilesUploaded?: (urls: string[]) => void
  maxFiles?: number
  className?: string
  buttonText?: string
  showPreview?: boolean
  autoUpload?: boolean
}

export const FilePicker: React.FC<FilePickerProps> = ({
  type,
  mode = "single",
  label,
  placeholder = "No file selected",
  onFilesPicked,
  onFilesUploaded,
  maxFiles = 10,
  className,
  buttonText,
  showPreview = true,
  autoUpload = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // Select the appropriate hook based on file type
  const imagePicker = useImagePicker(mode)
  const videoPicker = useVideoPicker(mode)
  const documentPicker = useDocumentPicker(mode)
  const audioPicker = useAudioPicker(mode)

  const { files, isLoading, isUploading, uploadedUrls, error, pickFile, uploadFiles, resetFiles } = (() => {
    switch (type) {
      case "image":
        return imagePicker
      case "video":
        return videoPicker
      case "document":
        return documentPicker
      case "audio":
        return audioPicker
      default:
        return imagePicker
    }
  })()

  // Get icon based on file type
  const getFileIcon = () => {
    switch (type) {
      case "image":
        return "image-outline"
      case "video":
        return "videocam-outline"
      case "document":
        return "document-text-outline"
      case "audio":
        return "musical-notes-outline"
      default:
        return "document-outline"
    }
  }

  // Get button text based on file type
  const getButtonText = () => {
    if (buttonText) return buttonText

    switch (type) {
      case "image":
        return mode === "single" ? "Select Image" : "Select Images"
      case "video":
        return mode === "single" ? "Select Video" : "Select Videos"
      case "document":
        return mode === "single" ? "Select Document" : "Select Documents"
      case "audio":
        return mode === "single" ? "Select Audio" : "Select Audio Files"
      default:
        return mode === "single" ? "Select File" : "Select Files"
    }
  }

  // Handle file picking
  const handlePickFile = async () => {
    await pickFile()

    // If files were picked, call the callback
    if (files.length > 0) {
      onFilesPicked?.(files)

      // Auto upload if enabled
      if (autoUpload) {
        handleUploadFiles()
      }
    }
  }

  // Handle file upload
  const handleUploadFiles = async () => {
    const urls = await uploadFiles()
    setUploadedFiles(urls)
    onFilesUploaded?.(urls)
  }

  // Render file preview
  const renderFilePreview = (file: FileInfo) => {
    if (type === "image" && showPreview) {
      return <Image source={{ uri: file.uri }} style={styles.previewImage} resizeMode="cover" />
    }

    return (
      <View style={styles.fileItem}>
        <Ionicons name={getFileIcon() as any} size={24} color="#555" />
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {file.name}
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container]} className={className}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.button} onPress={handlePickFile} disabled={isLoading || isUploading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name={getFileIcon() as any} size={20} color="#fff" />
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error.message}</Text>}

      {files.length > 0 ? (
        <View style={styles.filesContainer}>
          <Text style={styles.filesTitle}>
            {files.length} {files.length === 1 ? "file" : "files"} selected
          </Text>

          <ScrollView style={styles.filesList} horizontal={type === "image"}>
            {files.map((file, index) => (
              <View key={`${file.uri}-${index}`} style={styles.filePreviewContainer}>
                {renderFilePreview(file)}
              </View>
            ))}
          </ScrollView>

          {!autoUpload && (
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFiles} disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload</Text>
              )}
            </TouchableOpacity>
          )}

          {uploadedUrls.length > 0 && (
            <View style={styles.uploadedContainer}>
              <Text style={styles.uploadedTitle}>Uploaded Successfully</Text>
              <Text style={styles.uploadedCount}>
                {uploadedUrls.length} {uploadedUrls.length === 1 ? "file" : "files"} uploaded
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.placeholder}>{placeholder}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
  placeholder: {
    color: "#666",
    marginTop: 8,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
  },
  filesContainer: {
    marginTop: 12,
  },
  filesTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  filesList: {
    maxHeight: 120,
  },
  filePreviewContainer: {
    marginRight: 8,
    marginBottom: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: 250,
  },
  fileName: {
    marginLeft: 8,
    flex: 1,
  },
  uploadButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  uploadedContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
  },
  uploadedTitle: {
    color: "#10b981",
    fontWeight: "500",
  },
  uploadedCount: {
    color: "#333",
    marginTop: 4,
  },
})
