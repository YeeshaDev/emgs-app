import React from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/context/theme-provider'
import ThemedView from '@/components/ui/theme/ThemedView'
import ThemedText from '@/components/ui/theme/ThemedText'
import NotificationBadge from '@/components/ui/notification-badge'
import { cn } from '@/lib/cn'

interface MainHeaderProps {
  title: string
  onReferPress?: () => void
  onNotificationPress?: () => void
}

const MainHeader = ({ title, onReferPress, onNotificationPress }: MainHeaderProps) => {
  const { colorScheme } = useTheme()
  const isDark = colorScheme === 'dark'
  
  return (
    <ThemedView 
      variant="border"
      className="flex-row items-center justify-between px-4 py-3 border-b"
    >
      {/* Title */}
      <ThemedText className="text-2xl font-bold">
        {title}
      </ThemedText>
      
      {/* Right Section - Notification & Refer Button */}
      <ThemedView className="flex-row items-center gap-3" variant="default">
        {/* Refer & Earn Button */}
        <TouchableOpacity
          onPress={onReferPress}
          className="flex-row items-center bg-primary rounded-full px-4 py-2 shadow-sm"
          activeOpacity={0.8}
        >
          <ThemedText className="text-white font-medium text-sm mr-2">
            Refer & Earn
          </ThemedText>
          <AntDesign name="sharealt" size={16} color="white" />
        </TouchableOpacity>
        {/* Notification Button */}
        <TouchableOpacity
          onPress={onNotificationPress}
          className={cn(
            'relative p-2 rounded-full',
            isDark ? 'bg-card-dark' : 'bg-grey-6'
          )}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="notifications-outline" 
            size={20} 
            color={isDark ? '#ffffff' : '#374151'} 
          />
          <NotificationBadge />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

export default MainHeader