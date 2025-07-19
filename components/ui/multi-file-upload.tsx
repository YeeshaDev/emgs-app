"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFilePicker, type FileType } from "@/hooks/use-file-picker"

interface MultiFileUploadProps {
  label?: string
  fileTypes: FileType[]
  onFilesUploaded: (urls: string[]) => void
  maxFiles?: number
  initialUrls?: string[]
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  label = "Upload Files",
  fileTypes = ["image", "document"],
  onFilesUploaded,
  maxFiles = 10,
  initialUrls = [],
}) => {
  const [selectedType, setSelectedType] = useState<FileType>(fileTypes[0])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls)

  const { files, isLoading, isUploading, error, pickFile, uploadFiles, resetFiles } = useFilePicker(
    selectedType,
    "multiple",
  )

  useEffect(() => {
    if (initialUrls.length > 0) {
      setUploadedUrls(initialUrls)
    }
  }, [initialUrls])

  const handleTypeSelect = (type: FileType) => {
    setSelectedType(type)
    resetFiles()
  }

  const handlePickFile = async () => {
    if (files.length + uploadedUrls.length >= maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files`)
      return
    }

    await pickFile()
  }

  const handleUploadFiles = async () => {
    if (files.length === 0) return

    const urls = await uploadFiles()
    if (urls.length > 0) {
      const newUrls = [...uploadedUrls, ...urls]
      setUploadedUrls(newUrls)
      onFilesUploaded(newUrls)
      resetFiles()
    }
  }

  const removeUploadedFile = (index: number) => {
    const newUrls = [...uploadedUrls]
    newUrls.splice(index, 1)
    setUploadedUrls(newUrls)
    onFilesUploaded(newUrls)
  }

  const removeSelectedFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    // We need to manually update the files state since we don't have a setter from the hook
    // This is a workaround - in a real app, you might want to modify the hook to expose a setter
    resetFiles()
  }

  const getFileTypeIcon = (type: FileType) => {
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

  const getFileTypeLabel = (type: FileType) => {
    switch (type) {
      case "image":
        return "Images"
      case "video":
        return "Videos"
      case "document":
        return "Documents"
      case "audio":
        return "Audio"
      case "all":
        return "All Files"
      default:
        return "Files"
    }
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.typeSelector}>
        {fileTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, selectedType === type && styles.selectedTypeButton]}
            onPress={() => handleTypeSelect(type)}
          >
            <Ionicons name={getFileTypeIcon(type) as any} size={18} color={selectedType === type ? "#fff" : "#555"} />
            <Text style={[styles.typeButtonText, selectedType === type && styles.selectedTypeButtonText]}>
              {getFileTypeLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.uploadActions}>
        <TouchableOpacity style={styles.pickButton} onPress={handlePickFile} disabled={isLoading || isUploading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.pickButtonText}>Select {getFileTypeLabel(selectedType)}</Text>
            </>
          )}
        </TouchableOpacity>

        {files.length > 0 && (
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFiles} disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error.message}</Text>}

      {/* Selected files section */}
      {files.length > 0 && (
        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Selected Files</Text>
          <ScrollView style={styles.filesList}>
            {files.map((file, index) => (
              <View key={`${file.uri}-${index}`} style={styles.fileItem}>
                <Ionicons name={getFileTypeIcon(selectedType) as any} size={20} color="#555" />
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                  {file.name}
                </Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeSelectedFile(index)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Uploaded files section */}
      {uploadedUrls.length > 0 && (
        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Uploaded Files</Text>
          <Text style={styles.fileCount}>
            {uploadedUrls.length}/{maxFiles} files
          </Text>
          <ScrollView style={styles.filesList}>
            {uploadedUrls.map((url, index) => (
              <View key={`${url}-${index}`} style={styles.fileItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                  {url.split("/").pop() || `File ${index + 1}`}
                </Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeUploadedFile(index)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: "#3b82f6",
  },
  typeButtonText: {
    marginLeft: 6,
    color: "#555",
  },
  selectedTypeButtonText: {
    color: "#fff",
  },
  uploadActions: {
    flexDirection: "row",
    marginBottom: 12,
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  pickButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 6,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 6,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
    marginBottom: 8,
  },
  filesSection: {
    marginTop: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  fileCount: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  filesList: {
    maxHeight: 150,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fileName: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
})
