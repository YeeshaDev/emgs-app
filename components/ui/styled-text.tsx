import React from "react"
import { Text, TextProps } from "react-native"
import clsx from "clsx"

interface StyledTextProps extends TextProps {
  children: React.ReactNode
  weight?: "regular" | "medium" | "semibold" | "bold" 
  className?: string
}

const fontMap: Record<string, string> = {
  regular: "Montserrat_400Regular",
  medium: "Montserrat_500Medium",
  semibold: "Montserrat_600SemiBold",
  bold: "Montserrat_700Bold",
}

const StyledText: React.FC<StyledTextProps> = ({
  children,
  weight = "medium",
  className = "",
  style,
  ...props
}) => {
  const fontFamily = fontMap[weight] || fontMap.regular

  return (
    <Text
      {...props}
      style={[{ fontFamily }, style]}
      className={clsx(className)}
    >
      {children}
    </Text>
  )
}

export default StyledText
