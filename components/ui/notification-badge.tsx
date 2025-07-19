
import type React from "react"
import { View, Animated, Easing } from "react-native"
import { useEffect, useRef } from "react"
import { useUnreadNotificationsCount } from "@/lib/api-services/notifications"

interface NotificationBadgeProps {
  size?: number
  color?: string
  pulseColor?: string
  pulseSize?: number
}

const NotificationBadge = ({
  size = 8,
  color = "#EF4444",
  pulseColor = "rgba(239, 68, 68, 0.4)",
  pulseSize = 16,
}: NotificationBadgeProps) => {
  const unreadCount = useUnreadNotificationsCount()
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (unreadCount > 0) {
      // Create pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      // Stop animation if no unread notifications
      pulseAnim.stopAnimation()
      pulseAnim.setValue(1)
    }

    return () => {
      pulseAnim.stopAnimation()
    }
  }, [unreadCount, pulseAnim])

  if (unreadCount === 0) {
    return null
  }

  return (
    <View className="absolute -top-1 right-2">
      <Animated.View
        style={{
          width: pulseSize,
          height: pulseSize,
          borderRadius: pulseSize / 2,
          backgroundColor: pulseColor,
          position: "absolute",
          top: -(pulseSize - size) / 2,
          right: -(pulseSize - size) / 2,
          transform: [{ scale: pulseAnim }],
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  )
}

export default NotificationBadge
