import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/context/theme-provider'
import ThemedView from '@/components/ui/theme/ThemedView'
import ThemedText from '@/components/ui/theme/ThemedText'
import { cn } from '@/lib/cn'

interface ServiceItemProps {
  title: string
  description?: string
  icon: string
  color: string
  onPress?: () => void
}

const ServiceItem = ({ title, description, icon, color, onPress }: ServiceItemProps) => {
  const { colorScheme } = useTheme()
  const isDark = colorScheme === 'dark'
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mb-3"
    >
      <ThemedView 
        variant="card" 
        className={cn(
          'flex-row items-center p-4 rounded-xl shadow-sm border',
          isDark ? 'border-border-dark shadow-gray-800/10' : 'border-gray-100 shadow-gray-200/50'
        )}
        style={{
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Icon Container */}
        <ThemedView 
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: color }}
        >
          <Ionicons name={icon as any} size={24} color="white" />
        </ThemedView>
        
        {/* Content */}
        <ThemedView className="flex-1 bg-transparent" variant="default">
          <ThemedText className="text-base font-semibold leading-tight">
            {title}
          </ThemedText>
          
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  )
}

export default ServiceItem