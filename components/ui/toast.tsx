"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, Animated, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"

type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", duration = 3000, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(-100))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onClose) onClose()
      })
    }, duration)

    return () => clearTimeout(timer)
  }, [fadeAnim, slideAnim, duration, onClose])

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#10B981"
      case "error":
        return "#EF4444"
      case "info":
      default:
        return "#3B82F6"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle"
      case "error":
        return "alert-circle"
      case "info":
      default:
        return "info"
    }
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Feather name={getIcon() as any} size={20} color="white" />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onClose}>
        <Feather name="x" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    paddingHorizontal:4
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    color: "white",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
})

export default Toast

