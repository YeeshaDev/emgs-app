import { cn } from "@/lib/cn"
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated"

interface SkeletonProps {
  className?: string
  width?: number | string
  height?: number | string
  rounded?: "none" | "sm" | "md" | "lg" | "full"
}

const Skeleton = ({ className, width, height, rounded = "md" }: SkeletonProps) => {
  // Animation for the skeleton loading effect
  const opacity = useSharedValue(0.5)

  // Set up the animation
  opacity.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.6, 1) }), -1, true)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  // Map rounded values to Tailwind classes
  const roundedMap = {
    none: "",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }

  return (
    <Animated.View
      style={[animatedStyle, { width: typeof width === "number" ? width : undefined, height: typeof height === "number" ? height : undefined }]}
      className={cn(`bg-gray-200 ${roundedMap[rounded]}`, className)}
    />
  )
}

export default Skeleton
