import api from "@/lib/store/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
export interface Notification {
  _id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: string
  link?: string
}

// API functions
export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notifications")
  return response.data.results
}

export const fetchNotification = async (id: string): Promise<Notification> => {
  const response = await api.get(`/notifications/${id}`)
  return response.data.data
}

export const deleteNotification = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/notifications/${id}`)
  return response.data
}

export const markNotificationAsRead = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.put(`/notifications/${id}/read`)
  return response.data
}

export const markAllNotificationsAsRead = async (): Promise<{ success: boolean }> => {
  const response = await api.put("/notifications/read/all")
  return response.data
}

// Custom hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  })
}

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: () => fetchNotification(id),
    enabled: !!id,
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, id) => {
      // Update the notification in the cache
      queryClient.setQueryData<Notification>(["notification", id], (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, isRead: true }
      })

      // Update the notification in the notifications list
      queryClient.setQueryData<Notification[]>(["notifications"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification,
        )
      })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Update all notifications in the cache to be read
      queryClient.setQueryData<Notification[]>(["notifications"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((notification) => ({ ...notification, isRead: true }))
      })
    },
  })
}

// Helper hook to get unread notifications count
export const useUnreadNotificationsCount = () => {
  const { data: notifications } = useNotifications()

  if (!notifications) return 0
  return notifications.filter((notification) => !notification.isRead).length
}
