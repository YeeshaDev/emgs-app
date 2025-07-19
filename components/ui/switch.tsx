import React, { useState } from "react"
import { Animated, Pressable } from "react-native"

interface CustomSwitchProps {
  value: boolean
  disabled:boolean
  onToggle: (value: boolean) => void
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onToggle }) => {
  const [translateX] = useState(new Animated.Value(value ? 20 : 0))

  const toggleSwitch = () => {
    const newValue = !value
    onToggle(newValue)
    Animated.timing(translateX, {
      toValue: newValue ? 20 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  return (
    <Pressable
      onPress={toggleSwitch}
      style={{
        width: 47,
        height: 25,
        borderRadius: 15,
        backgroundColor: value ? "#2A2E36" : "#FFFFFF",
        padding: 2,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: value ? "#FFFFFF" : "#D1D1D1",
          transform: [{ translateX }],
        }}
      />
    </Pressable>
  )
}

export default CustomSwitch
