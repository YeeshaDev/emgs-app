import React from 'react'
import { View, ViewProps } from 'react-native'
import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/cn'

interface ThemedViewProps extends ViewProps {
  children?: React.ReactNode
  variant?: 'default' | 'card' | 'muted' | 'border'
  className?: string
}

const ThemedView = ({ 
  children, 
  variant = 'default', 
  className = '', 
  style,
  ...props 
}: ThemedViewProps) => {
  const { colorScheme } = useTheme()
  
  const getBackgroundColor = () => {
    const isDark = colorScheme === 'dark'
    
    switch (variant) {
      case 'card':
        return isDark ? 'bg-card-dark' : 'bg-card'
      case 'muted':
        return isDark ? 'bg-muted-dark' : 'bg-muted'
      case 'border':
        return isDark 
          ? 'bg-background-dark border-border-dark' 
          : 'bg-background border-border'
      case 'default':
      default:
        return isDark ? 'bg-background-dark' : 'bg-background'
    }
  }
  
  return (
    <View 
      className={cn(getBackgroundColor(), className)}
      style={style}
      {...props}
    >
      {children}
    </View>
  )
}

export default ThemedView