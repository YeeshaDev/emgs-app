"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
 // ImageSourcePropType,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import CustomButton from "./button"

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title: string
  icon?: React.ReactNode
 // img:ImageSourcePropType;
  children: React.ReactNode
  actionButton?: {
    title: string
    onPress: () => void
  }
}

const BottomSheet = ({ visible, onClose, title, icon, children, actionButton }: BottomSheetProps) => {
  const { height } = Dimensions.get("window")
  const slideAnim = useRef(new Animated.Value(height)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, height, slideAnim])

  if (!visible) return null

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.header}>
                <View style={styles.iconContainer}>{icon}</View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Feather name="x" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{title}</Text>

              <ScrollView style={styles.content}>{children}</ScrollView>

              {actionButton && (
                <View style={styles.actionContainer}>
                  <CustomButton title={actionButton.title} onPress={actionButton.onPress} variant="primary" />
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 10,
  },
})

export default BottomSheet

